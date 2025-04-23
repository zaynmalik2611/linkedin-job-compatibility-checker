import { NextResponse } from 'next/server';
import pdfParse from 'pdf-parse/lib/pdf-parse.js';

export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get('file');
  const arrayBuffer = await file.arrayBuffer();

  const pdf = await pdfParse(arrayBuffer);
  console.log('pdf', pdf.text);

  return NextResponse.json({ text: pdf.text });
}
