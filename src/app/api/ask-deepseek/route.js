import { NextResponse } from 'next/server';

export async function POST(req) {
  const body = await req.json();
  const prompt = body.prompt;
  console.log('prompt', prompt);
  const res = await fetch('http://127.0.0.1:11434/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'deepseek-r1:8b',
      prompt,
      stream: false,
    }),
  });

  const promptResponse = await res.json();
  return NextResponse.json({ result: promptResponse.response }); // you can also parse it fully if not streaming
}
