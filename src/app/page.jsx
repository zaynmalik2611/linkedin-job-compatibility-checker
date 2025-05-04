'use client';
import { useEffect, useState } from 'react';

export default function Home() {
  // CHORE: setup linting for the project
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeData, setResumeData] = useState('');
  const [jobData, setJobData] = useState('');
  const [jobUrl, setJobUrl] = useState('');
  const [evaluatedCompatibility, setEvaluatedCompatibility] = useState('');
  const [isCompatibilityChecking, setIsCompatibilityChecking] = useState(false);

  const uploadPDF = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('/api/extract', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      setResumeData(data.text);
    } catch (error) {
      //TODO: add a toast
    }
  };

  const getJobData = async () => {
    try {
      const res = await fetch('/api/get-job', {
        method: 'POST',
        body: JSON.stringify({}),
      });

      const data = await res.json();
      setJobData(data?.jobText);
    } catch (error) {
      // TODO: add a toast
    }
  };

  const evaluateCompatibility = async () => {
    setIsCompatibilityChecking(true);
    setEvaluatedCompatibility('');
    try {
      let prompt = `evaluate the compatibility for resume data: ${resumeData} and job data: ${jobData}`;
      const res = await fetch('http://127.0.0.1:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'deepseek-r1:1.5b', // change the model if you want to
          prompt,
          stream: true, // Enable streaming
        }),
      });

      const reader = res.body.getReader();
      const decoder = new TextDecoder('utf-8');

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const parsedChunk = JSON.parse(chunk);
        setEvaluatedCompatibility(
          (prevResponse) => prevResponse + parsedChunk.response,
        );
      }
    } catch (error) {
      // TODO: add a toast to show error
      console.log('error', error);
    }

    setIsCompatibilityChecking(false);
  };

  return (
    <div className="mx-auto max-w-7xl p-4 space-y-6">
      <h1 className="text-center text-3xl font-semibold tracking-tight">
        Compatibility Checker
      </h1>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
        {/* ------------ Résumé Column ------------ */}
        <div className="flex flex-col border rounded-xl shadow-sm max-h-[85vh] p-4">
          <h2 className="text-lg font-bold mb-2">Select a résumé file</h2>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setResumeFile(e.target.files?.[0] ?? null)}
            className="file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-gray-100 file:font-semibold hover:file:bg-gray-200"
          />
          <button
            onClick={() => uploadPDF(resumeFile)}
            disabled={!resumeFile}
            className="mt-3 w-full rounded-lg bg-gray-800 py-2 text-white font-medium disabled:opacity-40"
          >
            Extract data
          </button>
          <h3 className="mt-4 font-medium">Résumé Data</h3>
          <div className="mt-2 flex-1 overflow-auto rounded-lg border p-3 text-sm whitespace-pre-wrap">
            {resumeData || 'No data yet.'}
          </div>
        </div>

        {/* ------------ Job Column ------------ */}
        <div className="flex flex-col border rounded-xl shadow-sm max-h-[85vh] p-4">
          <h2 className="text-lg font-bold mb-2">Job description</h2>
          <input
            type="text"
            placeholder="Enter job URL…"
            value={jobUrl}
            onChange={(e) => setJobUrl(e.target.value)}
            className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
          <button
            onClick={getJobData}
            disabled={!jobUrl}
            className="mt-3 w-full rounded-lg bg-gray-800 py-2 text-white font-medium disabled:opacity-40"
          >
            Get Job Data
          </button>
          <h3 className="mt-4 font-medium">Job Data</h3>
          <div className="mt-2 flex-1 overflow-auto rounded-lg border p-3 text-sm whitespace-pre-wrap">
            {jobData || 'No data yet.'}
          </div>
        </div>

        {/* ------------ Compatibility Column ------------ */}
        <div className="flex flex-col border rounded-xl shadow-sm max-h-[85vh] p-4">
          <h2 className="text-lg font-bold mb-2">Compatibility Score</h2>
          <button
            onClick={evaluateCompatibility}
            disabled={isCompatibilityChecking || !resumeData || !jobData}
            className="w-full rounded-lg bg-gray-800 py-2 text-white font-medium disabled:opacity-40"
          >
            {isCompatibilityChecking ? 'Evaluating…' : 'Evaluate Compatibility'}
          </button>
          <div className="mt-4 flex-1 overflow-auto rounded-lg border p-3 text-sm whitespace-pre-wrap">
            {evaluatedCompatibility || 'Run evaluation to see results.'}
          </div>
        </div>
      </div>
    </div>
  );
}
