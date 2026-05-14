import puppeteer from 'puppeteer';
import fs from 'fs';

const browser = await puppeteer.launch({ headless: true });

// ── gallery.html → gallery.pdf ──────────────────────────────────────────────
{
  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 900 });
  await page.goto('file:///C:/Users/duane/Desktop/Miss Stephanie/gallery.html', { waitUntil: 'networkidle2', timeout: 20000 });
  await new Promise(r => setTimeout(r, 2000));
  await page.pdf({
    path: 'C:/Users/duane/Desktop/Miss Stephanie/gallery.pdf',
    format: 'A4',
    landscape: true,
    printBackground: true,
    margin: { top: '0', right: '0', bottom: '0', left: '0' }
  });
  await page.close();
  console.log('gallery.pdf done.');
}

// ── calendar.md → calendar.pdf ───────────────────────────────────────────────
{
  const md = fs.readFileSync('C:/Users/duane/Desktop/Miss Stephanie/calendar.md', 'utf8');

  // Convert markdown tables and headings to clean HTML
  const html = `<!DOCTYPE html>
<html><head>
<meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">
<style>
  body { font-family: 'Poppins', sans-serif; padding: 40px 48px; color: #111; max-width: 960px; margin: 0 auto; }
  h1 { font-size: 22px; color: #2d1b69; border-bottom: 3px solid #7c3aed; padding-bottom: 8px; margin-bottom: 8px; }
  h2 { font-size: 15px; color: #6b21a8; margin-top: 32px; margin-bottom: 8px; }
  h3 { font-size: 13px; color: #444; margin-top: 20px; }
  p { font-size: 13px; line-height: 1.7; margin-bottom: 8px; }
  table { width: 100%; border-collapse: collapse; margin: 12px 0 24px; font-size: 12px; }
  th { background: #2d1b69; color: #fff; padding: 8px 12px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; }
  td { padding: 7px 12px; border-bottom: 1px solid #e9d5ff; vertical-align: top; }
  tr:nth-child(even) td { background: #faf5ff; }
  blockquote { background: #fff7ed; border-left: 4px solid #f97316; padding: 10px 16px; margin: 12px 0; font-size: 13px; color: #7c2d12; }
  strong { color: #2d1b69; }
  code { background: #f3f0ff; padding: 2px 6px; border-radius: 3px; font-size: 12px; }
  hr { border: none; border-top: 1px solid #e9d5ff; margin: 24px 0; }
</style>
</head><body>
${md
  .replace(/^# (.+)$/gm, '<h1>$1</h1>')
  .replace(/^## (.+)$/gm, '<h2>$1</h2>')
  .replace(/^### (.+)$/gm, '<h3>$1</h3>')
  .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
  .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  .replace(/`(.+?)`/g, '<code>$1</code>')
  .replace(/^---$/gm, '<hr>')
  .replace(/^\| (.+) \|$/gm, (line) => {
    const cells = line.split('|').filter(c => c.trim() && !c.match(/^[-\s]+$/));
    if (!cells.length) return '';
    return '<tr>' + cells.map(c => `<td>${c.trim()}</td>`).join('') + '</tr>';
  })
  .replace(/(<tr>.*<\/tr>\n?)+/g, (block) => '<table>' + block.replace(/<tr><td>(#|Post|---)/,'<tr><th>').replace(/<\/td><td>/g,'</th><th>').replace(/<\/td><\/tr>/,'</th></tr>') + '</table>')
  .replace(/\n\n/g, '</p><p>')
  .replace(/^(?!<[h|t|b|p|h])/gm, '')}
</body></html>`;

  const tmpHtml = 'C:/Users/duane/Desktop/Miss Stephanie/calendar_tmp.html';
  fs.writeFileSync(tmpHtml, html);

  const page = await browser.newPage();
  await page.setViewport({ width: 1100, height: 900 });
  await page.goto(`file:///${tmpHtml}`, { waitUntil: 'networkidle2', timeout: 15000 });
  await new Promise(r => setTimeout(r, 1500));
  await page.pdf({
    path: 'C:/Users/duane/Desktop/Miss Stephanie/calendar.pdf',
    format: 'A4',
    landscape: true,
    printBackground: true,
    margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' }
  });
  await page.close();
  fs.unlinkSync(tmpHtml);
  console.log('calendar.pdf done.');
}

await browser.close();
console.log('All done.');
