'use client';
import { useEffect, useState } from 'react';

export default function Home() {
  // CHORE: setup docker for the project
  // TODO: improve the UI of the project
  const [resumeFile, setResumeFile] = useState(null);
  console.log('resumeFile', resumeFile);

  const uploadPDF = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    console.log('here');
    const res = await fetch('/api/extract', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    console.log('data', data);
    // return data.text;
  };

  // useEffect(() => {
  //   (async () => {
  //     //TODO: make it a post request and send the jobId
  //     const res = await fetch('/api/get-job', {
  //       method: 'GET',
  //     });

  //     const data = await res.json();
  //     console.log('data', data);
  //   })();
  // });

  //TODO: make a loader etc
  const evaluateCompatibility = async () => {
    let jobData = 'javascript developer';
    let resumeData = 'python developer';
    let prompt = `evaluate the compatibility for resume data: ${resumeData} and job data: ${jobData}`;
    const res = await fetch('/api/ask-deepseek', {
      method: 'POST',
      body: JSON.stringify({ prompt }),
    });

    const data = await res.json();
    console.log('result', data);
    // return data.text;
  };

  return (
    <>
      <h1 className="font-bold">Select a resume file</h1>
      <input
        accept="application/pdf"
        type="file"
        onChange={(e) => setResumeFile(e.target.files[0])}
      />
      <button
        onClick={() => uploadPDF(resumeFile)}
        className="bg-gray-800 text-white p-2 rounded-lg cursor-pointer"
      >
        Extract data
      </button>
      <button
        onClick={evaluateCompatibility}
        className="text-white bg-blue-800"
      >
        Evaluate Compatibility
      </button>
    </>
  );
}
