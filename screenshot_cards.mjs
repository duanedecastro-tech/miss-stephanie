import puppeteer from 'puppeteer';
import sharp from 'sharp';
import fs from 'fs';

const OUT = 'C:/Users/duane/OneDrive/Singers Company Middleburg/Post Images';
const BASE = 'C:/Users/duane/Desktop/Miss Stephanie';

const CARDS = [
  { post: '05', file: 'post_05.html', selector: '.date-card' },
  { post: '17', file: 'post_17.html', selector: '.open-card' },
];

const browser = await puppeteer.launch({ headless: true });

for (const { post, file, selector } of CARDS) {
  const page = await browser.newPage();
  await page.setViewport({ width: 800, height: 1200, deviceScaleFactor: 2 });

  const url = `file:///C:/Users/duane/Desktop/Miss Stephanie/${file}`;
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
  await new Promise(r => setTimeout(r, 1500)); // let fonts load

  const el = await page.$(selector);
  if (!el) {
    console.error(`post_${post} — selector "${selector}" not found`);
    await page.close();
    continue;
  }

  const tmpPath = `${OUT}/post_${post}_raw.png`;
  await el.screenshot({ path: tmpPath });
  console.log(`post_${post} — captured ${selector}`);

  await sharp(tmpPath)
    .resize(1080, 1080, { fit: 'cover', position: 'centre' })
    .jpeg({ quality: 92 })
    .toFile(`${OUT}/post_${post}_instagram.jpg`);

  await sharp(tmpPath)
    .resize(1200, 630, { fit: 'cover', position: 'centre' })
    .jpeg({ quality: 92 })
    .toFile(`${OUT}/post_${post}_facebook.jpg`);

  fs.unlinkSync(tmpPath);
  console.log(`post_${post} ✓  → IG 1080×1080 + FB 1200×630`);

  await page.close();
}

await browser.close();
console.log('\nDone.');
