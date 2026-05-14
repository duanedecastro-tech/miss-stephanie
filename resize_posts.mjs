import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const SRC = 'C:/Users/duane/OneDrive/Singers Company Middleburg/Spring Photos';
const OUT = 'C:/Users/duane/OneDrive/Singers Company Middleburg/Post Images';

// Post number → source photo filename
const POSTS = {
  '01': 'IMG10844.jpg',
  '02': 'IMG10830.jpg',   // post_02 group/cast shot — closest match in Drive
  '03': 'IMG10814.jpg',   // rehearsal/BTS candid
  '04': 'IMG10917.jpg',   // Miss Stephanie portrait
  '05': null,             // graphic card — no photo
  '06': 'IMG10906.jpg',
  '07': 'IMG10879.jpg',
  '08': 'IMG10871.jpg',
  '09': 'IMG10913.jpg',
  '10': 'IMG10888.jpg',
  '11': 'IMG10856.jpg',
  '12': 'IMG10853.jpg',
  '13': 'IMG10902.jpg',
  '14': 'IMG10865.jpg',
  '15': 'IMG10908.jpg',
  '16': 'IMG10945.jpg',
  '17': null,             // graphic card — no photo
  '18': 'IMG10947.jpg',
  '19': 'IMG10870.jpg',
  '20': 'IMG10961.jpg',
  '21': 'IMG10958.jpg',
  '22': 'IMG10825.jpg',
  '23': 'IMG10964.jpg',
  '24': 'IMG10949.jpg',
  '25': 'IMG10826.jpg',
  '26': 'IMG10889.jpg',
  '27': 'IMG10912.jpg',
  '28': 'IMG10960.jpg',
  '29': 'IMG10827.jpg',
};

if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

let done = 0;
let skipped = 0;

for (const [num, photo] of Object.entries(POSTS)) {
  if (!photo) {
    console.log(`post_${num} — skipped (graphic card, no photo)`);
    skipped++;
    continue;
  }

  const src = path.join(SRC, photo);
  if (!fs.existsSync(src)) {
    console.warn(`post_${num} — WARNING: ${photo} not found in source folder`);
    continue;
  }

  // Instagram: 1080×1080 square, center crop
  const igOut = path.join(OUT, `post_${num}_instagram.jpg`);
  await sharp(src)
    .resize(1080, 1080, { fit: 'cover', position: 'centre' })
    .jpeg({ quality: 92 })
    .toFile(igOut);

  // Facebook: 1200×630, center crop
  const fbOut = path.join(OUT, `post_${num}_facebook.jpg`);
  await sharp(src)
    .resize(1200, 630, { fit: 'cover', position: 'centre' })
    .jpeg({ quality: 92 })
    .toFile(fbOut);

  console.log(`post_${num} ✓  ${photo} → IG 1080×1080 + FB 1200×630`);
  done++;
}

console.log(`\nDone. ${done} posts processed (${done * 2} image files). ${skipped} skipped (graphic cards).`);
console.log(`Output: ${OUT}`);
