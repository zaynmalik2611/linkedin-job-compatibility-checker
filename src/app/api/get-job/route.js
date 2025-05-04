import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function POST() {
  const browser = await puppeteer.launch({
    headless: 'new', // to avoid Chromium errors
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  try {
    const page = await browser.newPage();
    await page.goto('https://www.linkedin.com/jobs/view/4209814770', {
      waitUntil: 'networkidle2',
    });
    const jobText = await page.evaluate(() => {
      const jobSectionContainerContent = document.querySelector(
        '.core-section-container__content',
      );
      return jobSectionContainerContent?.innerText ?? 'Job not found';
    });
    return NextResponse.json({ jobText });
  } catch (err) {
    console.error('Error scraping:', err);
    return NextResponse.json({ error: 'Scraping failed' }, { status: 500 });
  } finally {
    await browser.close();
  }
}
