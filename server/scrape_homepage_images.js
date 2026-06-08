const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, '../client/public/images/homepage');
fs.mkdirSync(outputDir, { recursive: true });

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function scrapeImage(query) {
  try {
    const url = `https://www.bing.com/images/search?q=${encodeURIComponent(query)}&form=HDRSC2&first=1`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36'
      },
      signal: AbortSignal.timeout(10000)
    });

    if (!response.ok) {
      throw new Error(`HTTP status ${response.status}`);
    }

    const html = await response.text();
    
    // Parse murl (media URL) from HTML
    const murlRegex = /murl&quot;:&quot;(http.*?)&quot;/g;
    const matches = [];
    let match;
    while ((match = murlRegex.exec(html)) !== null) {
      matches.push(match[1]);
    }

    if (matches.length === 0) {
      const murlRegex2 = /"murl"\s*:\s*"(http.*?)"/g;
      while ((match = murlRegex2.exec(html)) !== null) {
        matches.push(match[1]);
      }
    }

    // Filter matches to find a clean extension image
    for (const m of matches) {
      const lower = m.toLowerCase();
      if (lower.includes('.jpg') || lower.includes('.jpeg') || lower.includes('.png') || lower.includes('.webp')) {
        if (!lower.includes('placeholder') && !lower.includes('cat-image')) {
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
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

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

const targets = [
  {
    name: 'Moong Dal Halwa',
    query: 'Indian Moong Dal Halwa sweet bowl ghee',
    filename: 'moong_dal_halwa.jpg'
  },
  {
    name: 'Ratlami Sev',
    query: 'Indian Ratlami Sev namkeen crispy',
    filename: 'ratlami_sev.jpg'
  },
  {
    name: 'Mathri',
    query: 'Indian crispy Mathri snack',
    filename: 'mathri.jpg'
  },
  {
    name: 'Chakli',
    query: 'Indian crispy Chakli snack spiral',
    filename: 'chakli.jpg'
  },
  {
    name: 'Namkeen Mix',
    query: 'Gujarati Mix Chavanu namkeen mix snack',
    filename: 'namkeen_mix.jpg'
  },
  {
    name: 'Crispy Mathri',
    query: 'Indian methi mathri biscuits',
    filename: 'crispy_mathri.jpg'
  }
];

async function main() {
  console.log(`Starting homepage image download process... Output directory: ${outputDir}`);
  
  for (const target of targets) {
    console.log(`\nProcessing: "${target.name}"...`);
    const imgUrl = await scrapeImage(target.query);
    
    if (imgUrl) {
      console.log(`Found image URL: ${imgUrl}`);
      const success = await downloadImage(imgUrl, target.filename);
      if (!success) {
        // Fallback to a secondary query if first one fails
        console.log(`Retrying with fallback query...`);
        const fallbackUrl = await scrapeImage(`Indian food ${target.name}`);
        if (fallbackUrl) {
          await downloadImage(fallbackUrl, target.filename);
        }
      }
    } else {
      console.log(`No URL found for query: "${target.query}"`);
    }
    
    await sleep(1500); // Wait 1.5s between downloads
  }
  
  console.log('\nHomepage image downloading completed!');
  process.exit(0);
}

main();
