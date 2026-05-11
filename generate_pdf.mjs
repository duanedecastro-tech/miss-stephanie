import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});

const printStyle = `
  body { padding: 0 !important; margin: 0 !important; background: #fff !important; }
  .flyer { box-shadow: none !important; border-radius: 0 !important; }
`;

// --- FRONT ---
const frontPage = await browser.newPage();
await frontPage.setViewport({ width: 816, height: 1056 });
await frontPage.goto('file://' + path.join(__dirname, 'flyer.html').replace(/\\/g, '/'), { waitUntil: 'networkidle0' });
await frontPage.addStyleTag({ content: printStyle });
await frontPage.pdf({
  path: path.join(__dirname, 'SingersCompany_Middleburg_Flyer_Front.pdf'),
  printBackground: true,
  preferCSSPageSize: true,
  scale: 0.97,
  margin: { top: 0, right: 0, bottom: 0, left: 0 },
});
console.log('✓ SingersCompany_Middleburg_Flyer_Front.pdf');

// --- BACK ---
const backPage = await browser.newPage();
await backPage.setViewport({ width: 816, height: 1056 });
await backPage.goto('file://' + path.join(__dirname, 'flyer-back.html').replace(/\\/g, '/'), { waitUntil: 'networkidle0' });
await backPage.addStyleTag({ content: printStyle });
await backPage.pdf({
  path: path.join(__dirname, 'SingersCompany_Middleburg_Flyer_Back.pdf'),
  printBackground: true,
  preferCSSPageSize: true,
  scale: 0.97,
  margin: { top: 0, right: 0, bottom: 0, left: 0 },
});
console.log('✓ SingersCompany_Middleburg_Flyer_Back.pdf');

await browser.close();
