import puppeteer from 'puppeteer';

const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();
await page.setViewport({ width: 1200, height: 900 });

const url = 'file:///C:/Users/duane/Desktop/Miss Stephanie/START_HERE.html';
await page.goto(url, { waitUntil: 'networkidle2', timeout: 20000 });
await new Promise(r => setTimeout(r, 2000)); // let fonts load

await page.pdf({
  path: 'C:/Users/duane/Desktop/Miss Stephanie/START_HERE.pdf',
  format: 'A4',
  printBackground: true,
  margin: { top: '0', right: '0', bottom: '0', left: '0' }
});

await browser.close();
console.log('START_HERE.pdf generated.');
