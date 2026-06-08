const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
const User = require('../models/User');

dotenv.config();

const categories = [
  { name: 'Dairy Products', slug: 'dairy-products', description: 'Fresh and pure farm-fresh dairy items made daily.', image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop&q=80' },
  { name: 'Halwa', slug: 'halwa', description: 'Rich and traditional hot sweet puddings.', image: 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=600&auto=format&fit=crop&q=80' },
  { name: 'Peda', slug: 'peda', description: 'Traditional round milk fudge pedas.', image: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=600&auto=format&fit=crop&q=80' },
  { name: 'Fancy Mawa Sweets', slug: 'fancy-mawa-sweets', description: 'Artisanal decorative mawa configurations.', image: 'https://images.unsplash.com/photo-1589119908995-c6837fa14848?w=600&auto=format&fit=crop&q=80' },
  { name: 'Barfi', slug: 'barfi', description: 'Delicious fudge slices made from condensed milk and nuts.', image: 'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?w=600&auto=format&fit=crop&q=80' },
  { name: 'Traditional Sweets', slug: 'traditional-sweets', description: 'Classic Indian festival favorites.', image: 'https://images.unsplash.com/photo-1589119908995-c6837fa14848?w=600&auto=format&fit=crop&q=80' },
  { name: 'Fruit Sweets', slug: 'fruit-sweets', description: 'Sweets flavored with pure mango, strawberry, and figs.', image: 'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?w=600&auto=format&fit=crop&q=80' },
  { name: 'Kaju Special', slug: 'kaju-special', description: 'Premium cashew-based visual delights.', image: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=600&auto=format&fit=crop&q=80' },
  { name: 'Shrikhand', slug: 'shrikhand', description: 'Strained sweet yogurt dessert from Western India.', image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&auto=format&fit=crop&q=80' },
  { name: 'Basundi', slug: 'basundi', description: 'Rich, thick sweetened condensed milk pudding.', image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=600&auto=format&fit=crop&q=80' },
  { name: 'Chevdo', slug: 'chevdo', description: 'Crunchy savouries mixed with nuts and spices.', image: 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=600&auto=format&fit=crop&q=80' },
  { name: 'Sev', slug: 'sev', description: 'Crisp chickpea flour noodles.', image: 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=600&auto=format&fit=crop&q=80' },
  { name: 'Kachori', slug: 'kachori', description: 'Crisp deep-fried pastry loaded with lentils or potatoes.', image: 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=600&auto=format&fit=crop&q=80' },
  { name: 'Farsan', slug: 'farsan', description: 'Traditional Gujarati fried snacks.', image: 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=600&auto=format&fit=crop&q=80' },
  { name: 'Gathiya', slug: 'gathiya', description: 'Soft chickpea snacks, a staple Gujarati breakfast item.', image: 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=600&auto=format&fit=crop&q=80' },
  { name: 'Chavanu', slug: 'chavanu', description: 'Popular crispy roasted lentil and nut mix.', image: 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=600&auto=format&fit=crop&q=80' }
];

const productsData = [
  // DAIRY PRODUCTS
  { name: "Toned Milk", gujaratiName: "ટોન્ડ દૂધ", category: "Dairy Products", price: 42, unit: "1L", desc: "Fresh homogenized toned milk containing 3.0% fat.", ingredients: "Pasteurized Milk", image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500" },
  { name: "Full Cream Milk", gujaratiName: "ફુલ ક્રીમ દૂધ", category: "Dairy Products", price: 50, unit: "1L", desc: "Rich and creamy high-fat milk, perfect for making curd and tea.", ingredients: "Pasteurized Cream Milk", image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=500" },
  { name: "Buffalo Milk", gujaratiName: "ભેંસનું દૂધ", category: "Dairy Products", price: 58, unit: "1L", desc: "Thick and pure fresh buffalo milk, rich in nutrients.", ingredients: "Fresh Buffalo Milk", image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500" },
  { name: "Paneer", gujaratiName: "પનીર", category: "Dairy Products", price: 350, unit: "1kg", desc: "Soft and fresh cottage cheese made from pure buffalo milk.", ingredients: "Milk Coagulum", image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=500" },
  { name: "Cheese", gujaratiName: "ચીઝ", category: "Dairy Products", price: 300, unit: "1kg", desc: "Processed cheddar cheese blocks, highly nutritious.", ingredients: "Milk, Cheese Culture", image: "https://images.unsplash.com/photo-1486299267070-8382e214434b?w=500" },
  { name: "Mawa", gujaratiName: "માવો (ખોયા)", category: "Dairy Products", price: 300, unit: "1kg", desc: "Fresh condensed milk solids, ideal for sweet preparations.", ingredients: "Condensed Milk Solids", image: "https://images.unsplash.com/photo-1589119908995-c6837fa14848?w=500" },
  { name: "Gulab Jamun Mawa", gujaratiName: "ગુલાબ જાંબુ માવો", category: "Dairy Products", price: 300, unit: "1kg", desc: "Special soft mawa prepared specifically for making Gulab Jamuns.", ingredients: "Soft Milk Solids", image: "https://images.unsplash.com/photo-1589119908995-c6837fa14848?w=500" },
  { name: "Pure Desi Ghee", gujaratiName: "શુદ્ધ દેશી ઘી", category: "Dairy Products", price: 800, unit: "1kg", desc: "Clarified butter churned from pure buffalo milk using traditional methods.", ingredients: "Milk Fat", image: "https://images.unsplash.com/photo-1589119908995-c6837fa14848?w=500" },
  { name: "Cow Ghee", gujaratiName: "ગાયનું ઘી", category: "Dairy Products", price: 820, unit: "1kg", desc: "Healthy golden clarified butter made from pure cow milk.", ingredients: "Cow Milk Fat", image: "https://images.unsplash.com/photo-1589119908995-c6837fa14848?w=500" },

  // HALWA
  { name: "Dudhi Halwa", gujaratiName: "દૂધીનો હલવો", category: "Halwa", price: 380, unit: "1kg", desc: "Grated bottle gourd cooked in pure ghee, mawa, and sugar.", ingredients: "Bottle Gourd, Ghee, Sugar, Mawa, Cashews", image: "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=500" },
  { name: "Anjeer Halwa", gujaratiName: "અંજીર હલવો", category: "Halwa", price: 420, unit: "1kg", desc: "Nutritious rich halwa made of premium dried figs and ghee.", ingredients: "Figs, Ghee, Sugar, Almonds", image: "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=500" },
  { name: "Dry Fruit Halwa", gujaratiName: "ડ્રાયફ્રૂટ હલવો", category: "Halwa", price: 380, unit: "1kg", desc: "Exquisite halwa loaded with chopped almonds, pistachios, and cashews.", ingredients: "Mixed Nuts, Ghee, Sugar", image: "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=500" },
  { name: "Badam Halwa", gujaratiName: "બદામ હલવો", category: "Halwa", price: 380, unit: "1kg", desc: "Royal almond fudge cooked with pure ghee and saffron.", ingredients: "Almonds, Ghee, Saffron, Sugar", image: "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=500" },

  // PEDA
  { name: "Mathura Peda", gujaratiName: "મથુરા પેંડા", category: "Peda", price: 300, unit: "1kg", desc: "Caramelized brown milk fudge rolled in sugar dust.", ingredients: "Caramelized Mawa, Cardamom, Sugar", image: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=500" },
  { name: "Mawa Peda", gujaratiName: "માવાના પેંડા", category: "Peda", price: 320, unit: "1kg", desc: "Classic soft white peda made of fresh mawa.", ingredients: "Mawa, Sugar, Cardamom", image: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=500" },
  { name: "Kesar Peda", gujaratiName: "કેસર પેંડા", category: "Peda", price: 380, unit: "1kg", desc: "Traditional saffron milk fudge pedas.", ingredients: "Mawa, Saffron threads, Sugar", image: "/images/products/kesar_peda.png" },
  { name: "Kesar Badam Peda", gujaratiName: "કેસર બદામ પેંડા", category: "Peda", price: 400, unit: "1kg", desc: "Royal peda flavored with kesar and stuffed with crushed almonds.", ingredients: "Mawa, Saffron, Almonds, Sugar", image: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=500" },
  { name: "Kandoiwala Peda", gujaratiName: "કંદોઈવાલા પેંડા", category: "Peda", price: 380, unit: "1kg", desc: "Traditional sweet-maker recipe peda, highly aromatic.", ingredients: "Rich Milk Solids, Nutmeg, Cardamom", image: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=500" },
  { name: "Rajwadi Peda", gujaratiName: "રાજવાડી પેંડા", category: "Peda", price: 380, unit: "1kg", desc: "Large royal peda topped with a whole almond.", ingredients: "Rich Mawa, Pistachios, Almonds", image: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=500" },
  { name: "Star Peda", gujaratiName: "સ્ટાર પેંડા", category: "Peda", price: 400, unit: "1kg", desc: "Star-shaped decorated mawa pedas.", ingredients: "Mawa, Pistachios, Sugar", image: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=500" },

  // FANCY MAWA SWEETS
  { name: "Hira Moti", gujaratiName: "હીરા મોતી", category: "Fancy Mawa Sweets", price: 400, unit: "1kg", desc: "Silver bead decorated double layered mawa balls.", ingredients: "Mawa, Edible Silver Beads, Pistachios", image: "https://images.unsplash.com/photo-1589119908995-c6837fa14848?w=500" },
  { name: "Mawa Lollipop", gujaratiName: "માવા લોલીપોપ", category: "Fancy Mawa Sweets", price: 400, unit: "1kg", desc: "Playful lollipop-shaped sweets dipped in desiccated coconut.", ingredients: "Mawa, Coconut Powder, Cardamom", image: "https://images.unsplash.com/photo-1589119908995-c6837fa14848?w=500" },
  { name: "Mawa Kaju", gujaratiName: "માવા કાજુ", category: "Fancy Mawa Sweets", price: 400, unit: "1kg", desc: "Delicious blend of rich cashew paste and mawa solids.", ingredients: "Cashews, Mawa, Sugar", image: "https://images.unsplash.com/photo-1589119908995-c6837fa14848?w=500" },
  { name: "Mawa Cake", gujaratiName: "માવા કેક મિઠાઈ", category: "Fancy Mawa Sweets", price: 400, unit: "1kg", desc: "Cake shaped mawa delight, layered with nuts.", ingredients: "Mawa, Almonds, Pistachios, Cardamom", image: "https://images.unsplash.com/photo-1589119908995-c6837fa14848?w=500" },
  { name: "Mawa Roll", gujaratiName: "માવા રોલ", category: "Fancy Mawa Sweets", price: 400, unit: "1kg", desc: "Rolled mawa sweet stuffed with rich nut paste.", ingredients: "Mawa, Pistachio Paste, Almonds", image: "https://images.unsplash.com/photo-1589119908995-c6837fa14848?w=500" },
  { name: "Badam Katli", gujaratiName: "બદામ કતલી", category: "Fancy Mawa Sweets", price: 400, unit: "1kg", desc: "Delicious diamond-shaped almond fudge.", ingredients: "Almonds, Sugar, Vark", image: "https://images.unsplash.com/photo-1589119908995-c6837fa14848?w=500" },

  // BARFI
  { name: "Mawa Barfi", gujaratiName: "માવા બરફી", category: "Barfi", price: 380, unit: "1kg", desc: "Classic plain rectangular milk fudge barfi.", ingredients: "Mawa, Sugar, Cardamom", image: "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?w=500" },
  { name: "Kesar Barfi", gujaratiName: "કેસર બરફી", category: "Barfi", price: 380, unit: "1kg", desc: "Saffron infused milk fudge slices.", ingredients: "Mawa, Saffron, Sugar", image: "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?w=500" },
  { name: "Gola Pista Barfi", gujaratiName: "ગોળા પિસ્તા બરફી", category: "Barfi", price: 380, unit: "1kg", desc: "Layered barfi heavily loaded with crushed green pistachios.", ingredients: "Mawa, Pistachios, Saffron", image: "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?w=500" },
  { name: "Chocolate Barfi", gujaratiName: "ચોકલેટ બરફી", category: "Barfi", price: 380, unit: "1kg", desc: "Dual layered barfi with chocolate fudge on top and vanilla mawa at bottom.", ingredients: "Cocoa, Mawa, Sugar", image: "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?w=500" },
  { name: "Butter Scotch Barfi", gujaratiName: "બટર સ્કોચ બરફી", category: "Barfi", price: 400, unit: "1kg", desc: "Unique sweet barfi with crunchy butterscotch bits.", ingredients: "Mawa, Butterscotch chips, Sugar", image: "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?w=500" },
  { name: "Mango Delight Barfi", gujaratiName: "મેંગો ડીલાઈટ બરફી", category: "Barfi", price: 400, unit: "1kg", desc: "Tangy and sweet alphonso mango flavored barfi.", ingredients: "Alphonso Mango Pulp, Mawa, Sugar", image: "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?w=500" },
  { name: "Anjeer Barfi", gujaratiName: "અંજીર બરફી", category: "Barfi", price: 350, unit: "1kg", desc: "No added sugar fig barfi made with dry fruits.", ingredients: "Dried Figs, Almonds, Cashews", image: "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?w=500" },
  { name: "Fruit Dry Barfi", gujaratiName: "ફ્રુટ ડ્રાય બરફી", category: "Barfi", price: 400, unit: "1kg", desc: "Barfi loaded with dry fruits and dehydrated fruit chunks.", ingredients: "Dates, Dried Pineapple, Cashews, Almonds", image: "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?w=500" },

  // TRADITIONAL SWEETS
  { name: "Rasgulla", gujaratiName: "રસગુલ્લા", category: "Traditional Sweets", price: 350, unit: "1kg", desc: "Spongy, sweet cheese balls soaked in light sugar syrup.", ingredients: "Chena, Sugar Syrup", image: "/images/products/rasgulla.png" },
  { name: "Gulab Jamun", gujaratiName: "ગુલાબ જાંબુ", category: "Traditional Sweets", price: 320, unit: "1kg", desc: "Golden fried khoya dumplings soaked in warm rose sugar syrup.", ingredients: "Khoya, Flour, Sugar Syrup, Rose Water", image: "/images/products/gulab_jamun.png" },
  { name: "Rasmalai", gujaratiName: "રસમલાઈ", category: "Traditional Sweets", price: 380, unit: "1kg", desc: "Flattened balls of chhena soaked in malai flavored with cardamom.", ingredients: "Chena, Milk, Cardamom, Pistachios, Sugar", image: "/images/products/rasmalai.png" },
  { name: "Kesar Mohanthal", gujaratiName: "કેસર મોહનથાળ", category: "Traditional Sweets", price: 320, unit: "1kg", desc: "Gujarati festive gram flour fudge cooked in pure ghee and saffron.", ingredients: "Gram flour (Besan), Desi Ghee, Saffron, Sugar", image: "https://images.unsplash.com/photo-1589119908995-c6837fa14848?w=500" },
  { name: "Topra Pak", gujaratiName: "ટોપરા પાક", category: "Traditional Sweets", price: 300, unit: "1kg", desc: "Fresh coconut sweet cake flavored with cardamom.", ingredients: "Desiccated Coconut, Sugar, Ghee, Cardamom", image: "https://images.unsplash.com/photo-1589119908995-c6837fa14848?w=500" },
  { name: "Balushahi", gujaratiName: "બાલુશાહી", category: "Traditional Sweets", price: 300, unit: "1kg", desc: "Flaky glazed donuts made of refined flour and ghee.", ingredients: "Flour, Ghee, Sugar glaze", image: "https://images.unsplash.com/photo-1589119908995-c6837fa14848?w=500" },
  { name: "Shyam no Laddu", gujaratiName: "શ્યામનો લાડુ", category: "Traditional Sweets", price: 320, unit: "1kg", desc: "Special dark laddoos made of roasted wheat flour and jaggery.", ingredients: "Coarse Wheat Flour, Ghee, Jaggery, Spices", image: "https://images.unsplash.com/photo-1589119908995-c6837fa14848?w=500" },
  { name: "Magas", gujaratiName: "મગસ", category: "Traditional Sweets", price: 300, unit: "1kg", desc: "Classic Gujarati sweet gram flour fudge rounds.", ingredients: "Coarse Besan, Ghee, Powdered Sugar", image: "https://images.unsplash.com/photo-1589119908995-c6837fa14848?w=500" },

  // FRUIT SWEETS
  { name: "Fruit Barfi", gujaratiName: "ફ્રૂટ બરફી", category: "Fruit Sweets", price: 420, unit: "1kg", desc: "Condensed milk fudge flavored with real fruit purees.", ingredients: "Mawa, Fruit extracts, Sugar", image: "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?w=500" },
  { name: "Motichur Laddu", gujaratiName: "મોતીચૂર લાડુ", category: "Fruit Sweets", price: 450, unit: "1kg", desc: "Tiny ghee fried gram flour droplets bound together.", ingredients: "Besan Boondi, Ghee, Sugar Syrup", image: "/images/products/motichoor_laddu.png" },
  { name: "Motichur Dryfruit", gujaratiName: "ડ્રાયફ્રૂટ મોતીચૂર", category: "Fruit Sweets", price: 450, unit: "1kg", desc: "Ghee motichur laddoos heavily stuffed with cashews and pistachios.", ingredients: "Besan, Ghee, Sugar, Almonds, Cashews", image: "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?w=500" },
  { name: "Gulabpak", gujaratiName: "ગુલાબપાક", category: "Fruit Sweets", price: 450, unit: "1kg", desc: "Rose petal preserve cooked with mawa and dry fruits.", ingredients: "Rose Petals (Gulkand), Mawa, Almonds", image: "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?w=500" },
  { name: "Sonpapdi", gujaratiName: "સોન પાપડી", category: "Fruit Sweets", price: 450, unit: "1kg", desc: "Flaky, crispy, thread-layered gram flour sweet.", ingredients: "Gram flour, Sugar, Ghee, Pistachios", image: "/images/products/soan_papdi.png" },
  { name: "Mesur", gujaratiName: "મેસૂર પાક", category: "Fruit Sweets", price: 200, unit: "1kg", desc: "Traditional porous gram flour ghee sweet.", ingredients: "Besan, Ghee, Sugar", image: "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?w=500" },
  { name: "Balu Halwa", gujaratiName: "બાલુ હલવો", category: "Fruit Sweets", price: 300, unit: "1kg", desc: "Sticky gelatinous sweet fudge, highly flavorful.", ingredients: "Starch, Sugar, Ghee, Nut Meg", image: "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?w=500" },
  { name: "Karachi Halwa", gujaratiName: "કરાચી હલવો", category: "Fruit Sweets", price: 300, unit: "1kg", desc: "Chewy corn flour halwa studded with pistachios and cashews.", ingredients: "Corn flour, Ghee, Sugar, Colors, Almonds", image: "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?w=500" },

  // KAJU SPECIAL
  { name: "Kaju Katli", gujaratiName: "કાજુ કતલી", category: "Kaju Special", price: 450, unit: "1kg", desc: "Mouthwatering diamond cashew fudge, thin and premium.", ingredients: "Cashews, Sugar, Vark", image: "/images/products/kaju_katli.png" },
  { name: "Kesar Katli", gujaratiName: "કેસર કાજુ કતલી", category: "Kaju Special", price: 500, unit: "1kg", desc: "Cashew fudge infused with pure saffron.", ingredients: "Cashews, Saffron, Sugar", image: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=500" },
  { name: "Kaju Anjeer Roll", gujaratiName: "કાજુ અંજીર રોલ", category: "Kaju Special", price: 500, unit: "1kg", desc: "Cashew roll filled with dried fig paste and nuts.", ingredients: "Cashews, Dried Figs, Sugar", image: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=500" },
  { name: "Kaju Pista Roll", gujaratiName: "કાજુ પિસ્તા રોલ", category: "Kaju Special", price: 550, unit: "1kg", desc: "Cashew cylinders stuffed with rich pistachio fudge.", ingredients: "Cashews, Pistachios, Sugar", image: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=500" },
  { name: "Dry Fruit Roll", gujaratiName: "ડ્રાયફ્રૂટ રોલ", category: "Kaju Special", price: 620, unit: "1kg", desc: "No sugar roll bound together with dates and premium nuts.", ingredients: "Dates, Almonds, Pistachios, Walnuts", image: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=500" },
  { name: "Shahi Roll", gujaratiName: "શાહી રોલ", category: "Kaju Special", price: 620, unit: "1kg", desc: "Luxurious cashew roll coated with almonds and saffron.", ingredients: "Cashews, Almonds, Saffron, Cardamom", image: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=500" },
  { name: "Kaju Designer", gujaratiName: "કાજુ ડિઝાઇનર મીઠાઈ", category: "Kaju Special", price: 620, unit: "1kg", desc: "Artistic shaped cashew sweets styled like apples and peaches.", ingredients: "Cashew paste, Edible colors, Sugar", image: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=500" },
  { name: "Kaju Dryfruit Kamal", gujaratiName: "કાજુ ડ્રાયફ્રૂટ કમળ", category: "Kaju Special", price: 680, unit: "1kg", desc: "Lotus shaped cashew fudge filled with chopped premium nuts.", ingredients: "Cashews, Mixed Dry Fruits, Sugar, Saffron", image: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=500" },

  // SHRIKHAND
  { name: "Kesar Elaichi", gujaratiName: "કેસર ઈલાયચી શ્રીખંડ", category: "Shrikhand", price: 200, unit: "1kg", desc: "Sweet strained yogurt flavored with saffron and cardamom.", ingredients: "Chakka (strained yogurt), Sugar, Saffron, Cardamom", image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500" },
  { name: "Mango Delight", gujaratiName: "મેંગો ડીલાઈટ શ્રીખંડ", category: "Shrikhand", price: 200, unit: "1kg", desc: "Mango flavored sweet yogurt (Amrakhand).", ingredients: "Chakka, Mango Pulp, Sugar", image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500" },
  { name: "Paan Delight", gujaratiName: "પાન ડીલાઈટ શ્રીખંડ", category: "Shrikhand", price: 200, unit: "1kg", desc: "Unique betel leaf and gulkand flavored shrikhand.", ingredients: "Chakka, Betel Leaves, Gulkand, Sugar", image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500" },
  { name: "Butterscotch Crispy", gujaratiName: "બટરસ્કોચ શ્રીખંડ", category: "Shrikhand", price: 200, unit: "1kg", desc: "Sweet shrikhand with crunchy butterscotch praline.", ingredients: "Chakka, Butterscotch Crunch, Sugar", image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500" },
  { name: "American Dryfruit", gujaratiName: "અમેરિકન ડ્રાયફ્રૂટ શ્રીખંડ", category: "Shrikhand", price: 220, unit: "1kg", desc: "Strained yogurt loaded with almonds, cashews, raisins and jelly.", ingredients: "Chakka, Mixed Nuts, Raisins, Jelly, Sugar", image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500" },
  { name: "Rajbhog", gujaratiName: "રાજભોગ શ્રીખંડ", category: "Shrikhand", price: 240, unit: "1kg", desc: "Rich golden yogurt dessert loaded with saffron, almonds, and pistachios.", ingredients: "Chakka, Saffron, Almonds, Pistachios, Sugar", image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500" },
  { name: "Chhappanbhog", gujaratiName: "છપ્પનભોગ શ્રીખંડ", category: "Shrikhand", price: 240, unit: "1kg", desc: "Royal shrikhand named after the 56 offerings, loaded with premium nuts.", ingredients: "Chakka, Charoli, Almonds, Pistachios, Saffron, Sugar", image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500" },

  // BASUNDI
  { name: "Kesar Pista Basundi", gujaratiName: "કેસર પિસ્તા બાસુંદી", category: "Basundi", price: 230, unit: "1kg", desc: "Thickened milk dessert flavored with saffron and pistachios.", ingredients: "Milk, Saffron, Pistachios, Sugar", image: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=500" },
  { name: "Sitafal Basundi", gujaratiName: "સીતાફળ બાસુંદી", category: "Basundi", price: 240, unit: "1kg", desc: "Thick sweetened milk mixed with fresh custard apple pulp.", ingredients: "Milk, Custard Apple Pulp, Sugar", image: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=500" },
  { name: "Anjeer Basundi", gujaratiName: "અંજીર બાસુંદી", category: "Basundi", price: 240, unit: "1kg", desc: "Thick condensed milk base blended with fig chunks.", ingredients: "Milk, Dried Figs, Sugar", image: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=500" },
  { name: "Fruit Salad Basundi", gujaratiName: "ફ્રૂટ સલાડ બાસુંદી", category: "Basundi", price: 220, unit: "1kg", desc: "Rich condensed milk served with chopped apples, grapes, and pomegranates.", ingredients: "Milk, Apple, Grapes, Pomegranate, Sugar", image: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=500" },

  // CHEVDO
  { name: "Tikhi Mix", gujaratiName: "તીખી મીક્સ સેવ", category: "Chevdo", price: 120, unit: "1kg", desc: "Spicy and crunchy chickpea flour mix.", ingredients: "Gram flour, Spices, Chili Powder", image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=500" },
  { name: "Moli Mix", gujaratiName: "મોળી મીક્સ", category: "Chevdo", price: 120, unit: "1kg", desc: "Mildly spiced crunchy mixture, kid friendly.", ingredients: "Gram flour, Salt, Mild Spices", image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=500" },
  { name: "Methi Para", gujaratiName: "મેથી પરા", category: "Chevdo", price: 120, unit: "1kg", desc: "Crispy fried dough crackers flavored with fenugreek.", ingredients: "Wheat flour, Dried Fenugreek (Methi), Salt, Ghee", image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=500" },
  { name: "Masala Sing", gujaratiName: "મસાલા સીંગ", category: "Chevdo", price: 120, unit: "1kg", desc: "Coated spicy fried peanuts.", ingredients: "Peanuts, Gram flour, Chili, Spices", image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=500" },
  { name: "Makai Chevdo", gujaratiName: "મકાઈનો ચેવડો", category: "Chevdo", price: 120, unit: "1kg", desc: "Fried cornflakes savory mixture, light and sweet-spicy.", ingredients: "Corn Flakes, Peanuts, Cashews, Raisins, Spices", image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=500" },
  { name: "Tikha Chevdo", gujaratiName: "તીખો ચેવડો", category: "Chevdo", price: 140, unit: "1kg", desc: "Spicy roasted rice flakes mixture with green chilies.", ingredients: "Flattened Rice (Poha), Green Chilies, Mustard Seeds", image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=500" },
  { name: "Mitha Chevdo", gujaratiName: "મીઠો ચેવડો", category: "Chevdo", price: 140, unit: "1kg", desc: "Sweet and salty poha chavanu loaded with raisins.", ingredients: "Poha, Powdered Sugar, Raisins, Fennel Seeds", image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=500" },

  // SEV
  { name: "Moli Sev", gujaratiName: "મોળી સેવ", category: "Sev", price: 130, unit: "1kg", desc: "Mild plain chickpea noodles.", ingredients: "Gram flour, Salt", image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=500" },
  { name: "Nylon Sev", gujaratiName: "નાયલોન સેવ", category: "Sev", price: 130, unit: "1kg", desc: "Extremely thin fine sev, perfect for garnishing chaats.", ingredients: "Gram flour, Oil, Salt", image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=500" },
  { name: "Ratlami Sev", gujaratiName: "રતલામી સેવ", category: "Sev", price: 130, unit: "1kg", desc: "Spicy sev flavored with cloves and black pepper.", ingredients: "Gram flour, Cloves, Black Pepper, Asafoetida", image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=500" },
  { name: "Lal Marcha Sev", gujaratiName: "લાલ મરચા સેવ", category: "Sev", price: 140, unit: "1kg", desc: "Spicy sev seasoned with red chili powder.", ingredients: "Gram flour, Red Chili Powder, Salt", image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=500" },
  { name: "Tamtam Sev", gujaratiName: "ટમટમ સેવ", category: "Sev", price: 140, unit: "1kg", desc: "Thick hot and tangy sev mix.", ingredients: "Gram flour, Garlic paste, Chili, Citric Acid", image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=500" },
  { name: "Fulwadi Sev", gujaratiName: "ફૂલવાડી સેવ", category: "Sev", price: 140, unit: "1kg", desc: "Crispy cylinder snacks flavored with fennel and sesame seeds.", ingredients: "Gram flour, Fennel Seeds, Sesame, Chili", image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=500" },
  { name: "Bikaneri Sev", gujaratiName: "બીકાનેરી ભુજિયા", category: "Sev", price: 140, unit: "1kg", desc: "Crispy moth bean flour sev, very famous snack.", ingredients: "Moth bean flour, Gram flour, Salt, Spices", image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=500" },

  // KACHORI
  { name: "Bataka Kachori", gujaratiName: "બટાકા કચોરી", category: "Kachori", price: 160, unit: "1kg", desc: "Dry potato kachoris, spicy and sweet.", ingredients: "Flour, Dehydrated Potato, Ghee, Spices", image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=500" },
  { name: "Sadi Kachori", gujaratiName: "સાદી કચોરી", category: "Kachori", price: 160, unit: "1kg", desc: "Plain traditional kachori filled with spiced moong dal.", ingredients: "Flour, Moong Dal, Spices", image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=500" },
  { name: "Methi Kachori", gujaratiName: "મેથી કચોરી", category: "Kachori", price: 160, unit: "1kg", desc: "Kachori dough flavored with dry fenugreek leaves.", ingredients: "Flour, Fenugreek, Lentil stuffing", image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=500" },
  { name: "Lal Marcha Kachori", gujaratiName: "લાલ મરચા કચોરી", category: "Kachori", price: 160, unit: "1kg", desc: "Super hot chili stuffed kachori.", ingredients: "Flour, Red Chili paste, Lentils", image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=500" },
  { name: "Kanda Kachori", gujaratiName: "કાંદા કચોરી", category: "Kachori", price: 180, unit: "1kg", desc: "Famous fried onion kachori (crispy outer shell, soft filling).", ingredients: "Flour, Onion, Potato, Spices", image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=500" },

  // FARSAN
  { name: "Samosa", gujaratiName: "સમોસા (સૂકા)", category: "Farsan", price: 90, unit: "1kg", desc: "Dry mini samosas stuffed with sweet-sour lentil paste.", ingredients: "Flour, Lentils, Raisins, Spices", image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=500" },
  { name: "Kachori", gujaratiName: "કચોરી (નાની)", category: "Farsan", price: 90, unit: "1kg", desc: "Mini dry kachoris, perfect tea-time snack.", ingredients: "Flour, Lentils, Asafoetida, Sugar", image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=500" },
  { name: "Patudi", gujaratiName: "પાતુડી (ખાંડવી)", category: "Farsan", price: 240, unit: "1kg", desc: "Silky rolls made of chickpea flour and yogurt, tempered with mustard seeds.", ingredients: "Gram flour, Yogurt, Mustard, Coconut", image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=500" },
  { name: "Fulwadi Gathiya", gujaratiName: "ફૂલવાડી ગાંઠિયા", category: "Farsan", price: 240, unit: "1kg", desc: "Spicy crispy deep fried gram flour rolls.", ingredients: "Gram flour, Ajwain, Black Pepper", image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=500" },
  { name: "Methi Gota", gujaratiName: "મેથી ગોટા", category: "Farsan", price: 240, unit: "1kg", desc: "Soft and fluffy fenugreek leaf fritters, a monsoon special.", ingredients: "Gram flour, Fresh Fenugreek, Chili, Spices", image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=500" },
  { name: "Moli Bhujia", gujaratiName: "મોળી ભુજીયા", category: "Farsan", price: 150, unit: "1kg", desc: "Mild potato and gram flour sev.", ingredients: "Potato, Gram flour, Salt", image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=500" },
  { name: "Bataka Vada", gujaratiName: "બટાકા વડા", category: "Farsan", price: 150, unit: "1kg", desc: "Batter fried spiced potato dumplings.", ingredients: "Potato, Gram flour, Chili, Ghee, Mustard", image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=500" },
  { name: "Kanda Vada", gujaratiName: "કાંદા વડા", category: "Farsan", price: 150, unit: "1kg", desc: "Batter fried onion and gram flour fritters.", ingredients: "Onion, Gram flour, Spices", image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=500" },
  { name: "Nylon Khaman", gujaratiName: "નાયલોન ખમણ ઢોકળા", category: "Farsan", price: 100, unit: "1kg", desc: "Spongy, juicy steamed chickpea cakes tempered with chilies and curry leaves.", ingredients: "Chana flour, Lemon juice, Mustard, Curry leaves", image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=500" },

  // GATHIYA
  { name: "Bhavnagari Moli Gathiya", gujaratiName: "ભાવનગરી મોળા ગાંઠિયા", category: "Gathiya", price: 130, unit: "1kg", desc: "Traditional soft and thick Gujarati gram flour snacks.", ingredients: "Gram flour, Carom seeds (Ajwain), Salt", image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=500" },
  { name: "Bhavnagari Nylon Gathiya", gujaratiName: "ભાવનગરી નાયલોન ગાંઠિયા", category: "Gathiya", price: 130, unit: "1kg", desc: "Thin light soft gathiya.", ingredients: "Gram flour, Ajwain, Soda, Salt", image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=500" },
  { name: "Chokdi Gathiya", gujaratiName: "ચોકડી ગાંઠિયા", category: "Gathiya", price: 130, unit: "1kg", desc: "Square network shaped crunchy gathiya.", ingredients: "Gram flour, Spices, Salt", image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=500" },

  // CHAVANU
  { name: "Rajwadi Mix Chavanu", gujaratiName: "રાજવાડી મીક્સ ચવાણું", category: "Chavanu", price: 120, unit: "1kg", desc: "Sweet-salty mix chavanu loaded with dry fruits.", ingredients: "Gram flour, Rice flakes, Peanuts, Cashews, Raisins", image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=500" },
  { name: "Tikhu Molu Chavanu", gujaratiName: "તીખું મોળું ચવાણું", category: "Chavanu", price: 120, unit: "1kg", desc: "Balanced hot and mild chavanu mixture.", ingredients: "Gram flour, Poha, Spices", image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=500" },
  { name: "Papad Chavanu", gujaratiName: "પાપડ ચવાણું", category: "Chavanu", price: 120, unit: "1kg", desc: "Gujarati chavanu mixed with broken spiced papad pieces.", ingredients: "Papad, Gram flour, Poha, Spices", image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=500" }
];

const seedDB = async () => {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/shree_ram_dairy';
    console.log(`Connecting to MongoDB for seeding: ${connStr}`);
    await mongoose.connect(connStr);
    console.log('DB connection established.');

    // Clear models
    await Product.deleteMany({});
    await Category.deleteMany({});
    await Coupon.deleteMany({});
    await User.deleteMany({});
    console.log('Cleared existing collections.');

    // Seed categories
    const insertedCategories = await Category.insertMany(categories);
    console.log(`Successfully seeded ${insertedCategories.length} categories.`);

    // Map category name to database ObjectId
    const categoryMap = {};
    insertedCategories.forEach(cat => {
      categoryMap[cat.name] = cat._id;
    });

    // Prepare products with correct category reference
    const preparedProducts = productsData.map(item => {
      const catId = categoryMap[item.category];
      if (!catId) {
        throw new Error(`Category mapping failed for: ${item.category}`);
      }
      return {
        name: item.name,
        gujaratiName: item.gujaratiName,
        category: catId,
        description: item.desc,
        ingredients: item.ingredients,
        price: item.price,
        weightOptions: item.unit === '1L' ? ['1L', '2L', '5L'] : ['250g', '500g', '1kg'],
        stock: 100,
        image: item.image,
        rating: 4 + Math.round(Math.random() * 10) / 10 // random rating between 4.0 and 5.0
      };
    });

    const insertedProducts = await Product.insertMany(preparedProducts);
    console.log(`Successfully seeded ${insertedProducts.length} sweets & dairy products!`);

    // Seed default coupons
    const coupons = [
      { code: 'WELCOME10', discountPercent: 10, expiryDate: new Date('2028-12-31'), active: true },
      { code: 'FESTIVE25', discountPercent: 25, expiryDate: new Date('2028-12-31'), active: true },
      { code: 'RAMNAVAMI', discountPercent: 15, expiryDate: new Date('2028-12-31'), active: true }
    ];
    await Coupon.insertMany(coupons);
    console.log('Seeded default coupons: WELCOME10, FESTIVE25, RAMNAVAMI.');

    // Seed a default admin and user account
    const userSalt = await mongoose.model('User').schema.methods.matchPassword; // dummy reference to ensure import compatibility
    
    // Create admin account
    await User.create({
      name: 'Shree Ram Admin',
      email: 'admin@shreeramdairy.com',
      phone: '9999999999',
      password: 'adminpassword123',
      role: 'admin'
    });
    
    // Create user account
    await User.create({
      name: 'Vanshal Sharma',
      email: 'user@shreeramdairy.com',
      phone: '9876543210',
      password: 'userpassword123',
      role: 'user',
      addresses: [
        {
          title: 'Home',
          receiverName: 'Vanshal Sharma',
          receiverPhone: '9876543210',
          addressLine: '42, Ghalib Circle, Connaught Place',
          city: 'New Delhi',
          state: 'Delhi',
          pincode: '110001',
          isDefault: true
        }
      ]
    });

    console.log('Seeded Default Accounts:');
    console.log('- Admin: admin@shreeramdairy.com (Password: adminpassword123)');
    console.log('- User: user@shreeramdairy.com (Password: userpassword123)');

    await mongoose.connection.close();
    console.log('Seeding completed successfully. Database closed.');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedDB();
