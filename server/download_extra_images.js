const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, '../client/public/images/homepage');
fs.mkdirSync(outputDir, { recursive: true });

async function scrapeImage(query) {
  try {
    const url = `https://www.bing.com/images/search?q=${encodeURIComponent(query)}&form=HDRSC2&first=1`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36'
      },
      signal: AbortSignal.timeout(10000)
    });

    if (!response.ok) throw new Error(`HTTP status ${response.status}`);
    const html = await response.text();
    const murlRegex = /murl&quot;:&quot;(http.*?)&quot;/g;
    const matches = [];
    let match;
    while ((match = murlRegex.exec(html)) !== null) {
      matches.push(match[1]);
    }

    for (const m of matches) {
      const lower = m.toLowerCase();
      if (lower.includes('.jpg') || lower.includes('.jpeg') || lower.includes('.png') || lower.includes('.webp')) {
        if (!lower.includes('placeholder')) {
          return m;
        }
      }
    }
    return matches[0] || null;
  } catch (err) {
    console.error(`Error scraping image for "${query}":`, err.message);
    return null;
  }
}

async function downloadImage(url, filename) {
  try {
    console.log(`Downloading: ${url} -> ${filename}`);
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36'
      },
      signal: AbortSignal.timeout(15000)
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const destPath = path.join(outputDir, filename);
    fs.writeFileSync(destPath, buffer);
    console.log(`Saved successfully to ${destPath}`);
    return true;
  } catch (error) {
    console.error(`Failed to download from ${url}:`, error.message);
    return false;
  }
}

async function main() {
  const items = [
    { name: 'Cake', query: 'Indian Mawa Cake sweet dessert', filename: 'cake.jpg' },
    { name: 'Fafda Jalebi', query: 'Gujarati Fafda Jalebi plate morning snack', filename: 'fafda_jalebi.jpg' }
  ];

  for (const item of items) {
    console.log(`\nSearching for: "${item.name}"...`);
    const imgUrl = await scrapeImage(item.query);
    if (imgUrl) {
      const success = await downloadImage(imgUrl, item.filename);
      if (!success) {
        // Fallback
        const fbUrl = await scrapeImage(`Gujarati food ${item.name}`);
        if (fbUrl) await downloadImage(fbUrl, item.filename);
      }
    } else {
      console.log(`No image found for ${item.name}`);
    }
  }
  console.log('\nExtra image downloading completed!');
  process.exit(0);
}

main();
