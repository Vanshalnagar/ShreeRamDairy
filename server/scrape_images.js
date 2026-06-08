const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from current directory
dotenv.config({ path: path.join(__dirname, '.env') });

const Product = require('./models/Product');
const Category = require('./models/Category');

const connStr = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/shree_ram_dairy';

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function scrapeImage(query) {
  try {
    const url = `https://www.bing.com/images/search?q=${encodeURIComponent(query)}&form=HDRSC2&first=1`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36'
      },
      signal: AbortSignal.timeout(10000) // 10s timeout
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
        // Skip obvious bad domains or placeholders
        if (!lower.includes('placeholder') && !lower.includes('cat-image')) {
          return m;
        }
      }
    }

    return matches[0] || null;
  } catch (err) {
    console.error(`  Error scraping image for "${query}":`, err.message);
    return null;
  }
}

async function startScraping() {
  try {
    console.log(`Connecting to MongoDB: ${connStr}`);
    await mongoose.connect(connStr);
    console.log('MongoDB connection established.');

    // Fetch all categories to map IDs to names
    const categories = await Category.find({});
    const categoryMap = {};
    categories.forEach(cat => {
      categoryMap[cat._id.toString()] = cat.name;
    });

    // Fetch all products
    const products = await Product.find({});
    console.log(`Found ${products.length} products in database.`);

    let updateCount = 0;

    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      const categoryName = categoryMap[product.category.toString()] || '';
      
      // Skip products that already have a high-quality local image asset
      if (product.image && product.image.startsWith('/images/products/')) {
        console.log(`[SKIPPED] "${product.name}" already has high-quality local asset: ${product.image}`);
        continue;
      }

      // Check if current image is a default seeder unsplash placeholder
      const isUnsplashPlaceholder = product.image && (
        product.image.includes('photo-1550583724-b2692b85b150') ||
        product.image.includes('photo-1563636619-e9143da7973b') ||
        product.image.includes('photo-1626132647523-66f5bf380027') ||
        product.image.includes('photo-1589119908995-c6837fa14848') ||
        product.image.includes('photo-1601004890684-d8cbf643f5f2') ||
        product.image.includes('photo-1488477181946-6428a0291777') ||
        product.image.includes('photo-1563729784474-d77dbb933a9e') ||
        product.image.includes('photo-1601050690597-df056fb4ce78') ||
        product.image.includes('photo-1505253716362-afaea1d3d1af')
      );

      if (!isUnsplashPlaceholder && product.image && !product.image.includes('unsplash.com')) {
        console.log(`[SKIPPED] "${product.name}" already has customized image: ${product.image}`);
        continue;
      }

      // Build search query based on category
      let searchQuery = '';
      const catLower = categoryName.toLowerCase();
      if (catLower.includes('dairy')) {
        searchQuery = `Indian dairy ${product.name}`;
      } else if (
        catLower.includes('sweet') || 
        catLower.includes('peda') || 
        catLower.includes('barfi') || 
        catLower.includes('halwa') || 
        catLower.includes('basundi') || 
        catLower.includes('shrikhand') || 
        catLower.includes('special')
      ) {
        searchQuery = `Indian sweet ${product.name} mithai`;
      } else if (
        catLower.includes('sev') || 
        catLower.includes('chevdo') || 
        catLower.includes('kachori') || 
        catLower.includes('farsan') || 
        catLower.includes('gathiya') || 
        catLower.includes('chavanu')
      ) {
        searchQuery = `Indian snack ${product.name} namkeen`;
      } else {
        searchQuery = `Indian food ${product.name}`;
      }

      console.log(`[${i + 1}/${products.length}] Scraping for "${product.name}" (Query: "${searchQuery}")...`);
      
      const imgUrl = await scrapeImage(searchQuery);
      if (imgUrl) {
        console.log(`  -> Found image: ${imgUrl}`);
        product.image = imgUrl;
        await product.save();
        updateCount++;
      } else {
        console.log(`  -> No image found.`);
      }

      // Throttle requests by 1.2 seconds to avoid rate limiting
      await sleep(1200);
    }

    console.log(`Successfully updated ${updateCount} product images in database!`);
    await mongoose.connection.close();
    console.log('MongoDB connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('Scraping workflow failed:', error);
    process.exit(1);
  }
}

startScraping();
