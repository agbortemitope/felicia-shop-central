/**
 * Seed script: clears and re-populates products + sample reviews.
 * Run with: pnpm --filter @workspace/scripts run seed
 */
import { Pool } from "pg";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set");
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const products = [
  // ── Phones ──────────────────────────────────────────────────────────────
  {
    id: "p-001",
    title: "Apple iPhone 15 Pro",
    slug: "apple-iphone-15-pro",
    description: "Titanium design, A17 Pro chip, 48 MP main camera, Action Button, and USB 3 transfer speeds. The most powerful iPhone ever made.",
    price: "999.00",
    image_url: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80",
    category: "Phones",
    in_stock: true,
  },
  {
    id: "p-002",
    title: "Apple iPhone 14",
    slug: "apple-iphone-14",
    description: "A15 Bionic chip, Emergency SOS via satellite, Crash Detection, and an advanced dual‑camera system — supercharged by iOS 17.",
    price: "699.00",
    image_url: "https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=800&q=80",
    category: "Phones",
    in_stock: true,
  },
  {
    id: "p-003",
    title: "Samsung Galaxy S24 Ultra",
    slug: "samsung-galaxy-s24-ultra",
    description: "Snapdragon 8 Gen 3, built‑in S Pen, 200 MP camera with 100× Space Zoom, and Galaxy AI features for next‑level productivity.",
    price: "1299.00",
    image_url: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&q=80",
    category: "Phones",
    in_stock: true,
  },
  {
    id: "p-004",
    title: "Motorola Edge 40 Pro",
    slug: "motorola-edge-40-pro",
    description: "Snapdragon 8 Gen 2, 165 Hz pOLED display, 125 W TurboPower charging, and a 50 MP triple‑camera array — all in a sleek curved body.",
    price: "599.00",
    image_url: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&q=80",
    category: "Phones",
    in_stock: true,
  },
  // ── Laptops ─────────────────────────────────────────────────────────────
  {
    id: "p-005",
    title: "MacBook Pro 14″ M3 Pro",
    slug: "macbook-pro-14-m3",
    description: "Apple M3 Pro chip, Liquid Retina XDR display, up to 22 hours battery life, and MagSafe 3 charging. Built for demanding creative workflows.",
    price: "1999.00",
    image_url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80",
    category: "Laptops",
    in_stock: true,
  },
  {
    id: "p-006",
    title: "Dell XPS 15",
    slug: "dell-xps-15",
    description: "Intel Core i7‑13700H, 3.5K OLED touch display, NVIDIA GeForce RTX 4060, 32 GB RAM, and a sleek CNC‑machined aluminum chassis.",
    price: "1549.00",
    image_url: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&q=80",
    category: "Laptops",
    in_stock: true,
  },
  {
    id: "p-007",
    title: "HP Spectre x360 14",
    slug: "hp-spectre-x360-14",
    description: "2-in-1 convertible with Intel Core Ultra 7, OLED touch display, HP Tilt Pen, and a gem-cut design that turns heads anywhere.",
    price: "1349.00",
    image_url: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80",
    category: "Laptops",
    in_stock: false,
  },
  {
    id: "p-008",
    title: "Lenovo ThinkPad X1 Carbon",
    slug: "lenovo-thinkpad-x1-carbon",
    description: "Ultra-light at just 2.48 lb, Intel Core i7 vPro, 14″ IPS display, MIL-SPEC durability, and legendary ThinkPad keyboard — business perfected.",
    price: "1449.00",
    image_url: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&q=80",
    category: "Laptops",
    in_stock: true,
  },
  // ── Tablets ─────────────────────────────────────────────────────────────
  {
    id: "p-009",
    title: "Apple iPad Pro 12.9″ M2",
    slug: "apple-ipad-pro-12-m2",
    description: "M2 chip, stunning Liquid Retina XDR display with ProMotion, Apple Pencil hover, and Thunderbolt connectivity — iPad at its most pro.",
    price: "1099.00",
    image_url: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80",
    category: "Tablets",
    in_stock: true,
  },
  {
    id: "p-010",
    title: "Samsung Galaxy Tab S9 Ultra",
    slug: "samsung-galaxy-tab-s9-ultra",
    description: "14.6″ Dynamic AMOLED 2X display, Snapdragon 8 Gen 2, included S Pen, IP68 water resistance, and DeX desktop mode.",
    price: "1199.00",
    image_url: "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800&q=80",
    category: "Tablets",
    in_stock: true,
  },
  {
    id: "p-011",
    title: "Amazon Fire HD 10 (2023)",
    slug: "amazon-fire-hd-10",
    description: "10.1″ 1080p display, octa-core processor, 3 GB RAM, 13-hour battery, and hands-free Alexa — the best value tablet for home entertainment.",
    price: "139.00",
    image_url: "https://images.unsplash.com/photo-1592434134753-a70f4af63af8?w=800&q=80",
    category: "Tablets",
    in_stock: true,
  },
  // ── Audio ────────────────────────────────────────────────────────────────
  {
    id: "p-012",
    title: "Apple AirPods Pro (2nd Gen)",
    slug: "airpods-pro-2nd-gen",
    description: "H2 chip, Adaptive Transparency, up to 2× more Active Noise Cancellation, Personalized Spatial Audio, and MagSafe charging case.",
    price: "249.00",
    image_url: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&q=80",
    category: "Audio",
    in_stock: true,
  },
  {
    id: "p-013",
    title: "Sony WH-1000XM5",
    slug: "sony-wh-1000xm5",
    description: "Industry-leading noise cancellation, 30-hour battery, Multipoint connection for two devices, and crisp Speak-to-Chat detection.",
    price: "349.00",
    image_url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
    category: "Audio",
    in_stock: true,
  },
  {
    id: "p-014",
    title: "Bose QuietComfort 45",
    slug: "bose-quietcomfort-45",
    description: "Legendary Bose noise cancellation, TriPort acoustic architecture, 24‑hour battery, Aware Mode, and premium comfort for all-day wear.",
    price: "279.00",
    image_url: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80",
    category: "Audio",
    in_stock: true,
  },
  // ── Wearables ────────────────────────────────────────────────────────────
  {
    id: "p-015",
    title: "Apple Watch Series 9",
    slug: "apple-watch-series-9",
    description: "S9 chip, brighter always-on Retina display, Double Tap gesture, advanced health sensors, and crash detection — the ultimate smartwatch.",
    price: "399.00",
    image_url: "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=800&q=80",
    category: "Wearables",
    in_stock: true,
  },
  {
    id: "p-016",
    title: "Samsung Galaxy Watch 6 Classic",
    slug: "samsung-galaxy-watch-6-classic",
    description: "Iconic rotating bezel, Sapphire Crystal glass, BioActive Sensor for health tracking, and seamless Galaxy ecosystem integration.",
    price: "329.00",
    image_url: "https://images.unsplash.com/photo-1523395243481-163f8f6155ab?w=800&q=80",
    category: "Wearables",
    in_stock: true,
  },
  {
    id: "p-017",
    title: "Fitbit Charge 6",
    slug: "fitbit-charge-6",
    description: "Built-in GPS, continuous heart rate tracking, ECG, EDA stress sensor, Google Maps integration, and 7-day battery life.",
    price: "159.00",
    image_url: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=800&q=80",
    category: "Wearables",
    in_stock: false,
  },
  // ── Gaming ────────────────────────────────────────────────────────────────
  {
    id: "p-018",
    title: "PS5 DualSense Controller",
    slug: "ps5-dualsense-controller",
    description: "Adaptive triggers, haptic feedback, built-in microphone, USB-C charging, and a rechargeable battery — feel the game like never before.",
    price: "69.00",
    image_url: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800&q=80",
    category: "Gaming",
    in_stock: true,
  },
  {
    id: "p-019",
    title: "Xbox Elite Series 2 Controller",
    slug: "xbox-elite-series-2",
    description: "Hall-effect thumbsticks, wrap-around rubberized grip, adjustable-tension triggers, Hair Trigger Locks, and 40‑hour rechargeable battery.",
    price: "179.00",
    image_url: "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=800&q=80",
    category: "Gaming",
    in_stock: true,
  },
  {
    id: "p-020",
    title: "Nintendo Switch OLED",
    slug: "nintendo-switch-oled",
    description: "7″ vibrant OLED screen, wide adjustable stand, 64 GB storage, enhanced audio, and the full Nintendo library — play anywhere.",
    price: "349.00",
    image_url: "https://images.unsplash.com/photo-1617096200347-cb04ae810b1d?w=800&q=80",
    category: "Gaming",
    in_stock: true,
  },
  // ── Accessories ───────────────────────────────────────────────────────────
  {
    id: "p-021",
    title: "Anker 65W GaN USB-C Charger",
    slug: "anker-65w-gan-charger",
    description: "Compact 3-port GaN charger (2× USB-C, 1× USB-A), 65 W total output, PowerIQ 4.0 fast charging, and foldable prongs for travel.",
    price: "35.00",
    image_url: "https://images.unsplash.com/photo-1591370874773-6702e8f12fd8?w=800&q=80",
    category: "Accessories",
    in_stock: true,
  },
  {
    id: "p-022",
    title: "Spigen Ultra Hybrid iPhone 15 Pro Case",
    slug: "spigen-ultra-hybrid-iphone-15-pro",
    description: "Military-grade drop protection, crystal-clear polycarbonate back that shows off your iPhone's titanium finish, and precise cutouts.",
    price: "19.00",
    image_url: "https://images.unsplash.com/photo-1603313011808-8870e4c7ab3c?w=800&q=80",
    category: "Accessories",
    in_stock: true,
  },
  {
    id: "p-023",
    title: "Belkin MagSafe Car Mount Pro",
    slug: "belkin-magsafe-car-mount",
    description: "Certified MagSafe alignment ring, 15 W wireless charging while mounted, 360° rotation, one-handed release, and universal vent clip.",
    price: "49.00",
    image_url: "https://images.unsplash.com/photo-1587033411391-5d9e51cce126?w=800&q=80",
    category: "Accessories",
    in_stock: true,
  },
  // ── Cameras & Drones ─────────────────────────────────────────────────────
  {
    id: "p-024",
    title: "DJI Mini 4 Pro",
    slug: "dji-mini-4-pro",
    description: "Under 249 g, 4K/60fps HDR video, omnidirectional obstacle sensing, 34‑min flight time, and ActiveTrack 360° — the ultimate compact drone.",
    price: "759.00",
    image_url: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&q=80",
    category: "Cameras & Drones",
    in_stock: true,
  },
  {
    id: "p-025",
    title: "GoPro Hero 12 Black",
    slug: "gopro-hero-12-black",
    description: "5.3K video, Max Lens Mod 2.0 compatibility, HyperSmooth 6.0 stabilization, 27MP photos, and waterproof to 33 ft without a housing.",
    price: "399.00",
    image_url: "https://images.unsplash.com/photo-1564466809058-bf4114d55352?w=800&q=80",
    category: "Cameras & Drones",
    in_stock: true,
  },
  {
    id: "p-026",
    title: "Sony ZV-E10 Mirrorless Camera",
    slug: "sony-zv-e10",
    description: "24.2 MP APS-C sensor, interchangeable E-mount lenses, real-time Eye AF, vlog‑optimized directional mic, and 4K video for creators.",
    price: "748.00",
    image_url: "https://images.unsplash.com/photo-1606986628570-9f0a77d07b71?w=800&q=80",
    category: "Cameras & Drones",
    in_stock: false,
  },
];

const reviews: {
  id: string;
  product_id: string;
  author_name: string;
  rating: number;
  comment: string;
}[] = [
  // iPhone 15 Pro
  { id: "r-001", product_id: "p-001", author_name: "Tyler Johnson", rating: 5, comment: "Absolutely love this phone. The titanium frame feels premium and the camera is insane — took it to Yellowstone and every shot looks professional." },
  { id: "r-002", product_id: "p-001", author_name: "Ashley Martinez", rating: 5, comment: "Upgraded from my 13 Pro and the difference is night and day. The Action Button is a game changer. Battery easily gets me through two full days." },
  { id: "r-003", product_id: "p-001", author_name: "Brandon Lee", rating: 4, comment: "Great phone overall. USB-C is finally here. Docking one star only because the base storage is still 128 GB at this price point." },
  // iPhone 14
  { id: "r-004", product_id: "p-002", author_name: "Megan Thompson", rating: 5, comment: "Best bang for the buck in Apple's lineup right now. Crash Detection saved my brother on a ski trip — that feature alone makes it worth it." },
  { id: "r-005", product_id: "p-002", author_name: "Chris Williams", rating: 4, comment: "Solid phone. Camera is great in daylight, decent at night. The Dynamic Island is missing here but for $699 I can't complain." },
  // Samsung Galaxy S24 Ultra
  { id: "r-006", product_id: "p-003", author_name: "Jasmine Davis", rating: 5, comment: "The S Pen is so responsive it replaced my paper notebook. Galaxy AI features are surprisingly useful — the live translation blew my mind at a trade show." },
  { id: "r-007", product_id: "p-003", author_name: "Derek Wilson", rating: 4, comment: "Camera is unreal. 100× Space Zoom is gimmicky but the 10× optical is stunning. The phone is a bit heavy but you get used to it." },
  // Motorola Edge 40 Pro
  { id: "r-008", product_id: "p-004", author_name: "Samantha Brown", rating: 5, comment: "125W charging is WILD — zero to full in under 20 minutes. The curved display is beautiful and the speakers are loud and clear." },
  // MacBook Pro M3
  { id: "r-009", product_id: "p-005", author_name: "Kevin Harris", rating: 5, comment: "Switched from a Windows machine and I'm never going back. Compiling our whole React codebase takes seconds. The fan barely spins." },
  { id: "r-010", product_id: "p-005", author_name: "Rachel Clark", rating: 5, comment: "I do 4K video editing and this machine chews through DaVinci Resolve timelines effortlessly. Battery lasts my entire workday with room to spare." },
  // Dell XPS 15
  { id: "r-011", product_id: "p-006", author_name: "Nathan Robinson", rating: 4, comment: "Gorgeous OLED display — colors pop like nothing else. The RTX 4060 handles gaming and Blender renders with ease. Gets warm under heavy load but nothing alarming." },
  { id: "r-012", product_id: "p-006", author_name: "Lauren White", rating: 5, comment: "Best Windows laptop I've ever owned. The display is worth the price alone. Keyboard is comfortable for long coding sessions." },
  // Lenovo ThinkPad X1 Carbon
  { id: "r-013", product_id: "p-008", author_name: "Marcus Anderson", rating: 5, comment: "The keyboard is still the best in the business. At 2.4 lbs my shoulders thank me on every business trip. Battery hits the full 15 hours without any tricks." },
  // iPad Pro
  { id: "r-014", product_id: "p-009", author_name: "Olivia Jackson", rating: 5, comment: "Using this for digital illustration with Apple Pencil and Procreate — the hover detection is incredibly precise. The Liquid Retina XDR display is jaw-dropping." },
  { id: "r-015", product_id: "p-009", author_name: "Ethan Moore", rating: 4, comment: "Powerful enough to replace my laptop for most tasks. iPadOS still has some limitations but for media consumption and note-taking this is flawless." },
  // Samsung Galaxy Tab S9 Ultra
  { id: "r-016", product_id: "p-010", author_name: "Brittany Taylor", rating: 5, comment: "The 14.6-inch AMOLED is stunning for watching movies. DeX mode is actually useful for productivity. The S Pen included in the box is a big win." },
  // AirPods Pro
  { id: "r-017", product_id: "p-012", author_name: "Austin Garcia", rating: 5, comment: "The noise cancellation on the subway is incredible — shuts out all the noise instantly. Adaptive Transparency lets me hear announcements without taking them out." },
  { id: "r-018", product_id: "p-012", author_name: "Kayla Rodriguez", rating: 5, comment: "Had the first gen AirPods Pro and the upgrade is massive. Audio quality is much richer and the fit is more secure during workouts." },
  // Sony WH-1000XM5
  { id: "r-019", product_id: "p-013", author_name: "Jason Lewis", rating: 5, comment: "Best headphones I've ever owned, period. The ANC blocks out everything on long-haul flights. Speak-to-Chat works flawlessly at coffee shops." },
  { id: "r-020", product_id: "p-013", author_name: "Stephanie Hall", rating: 4, comment: "Sound quality is phenomenal, especially for classical music. The only downside is they don't fold flat like the XM4. Still a 9/10 purchase." },
  // Apple Watch Series 9
  { id: "r-021", product_id: "p-015", author_name: "Ryan Walker", rating: 5, comment: "The Double Tap gesture feels like magic. Crash detection and fall detection have given my parents peace of mind. Battery easily lasts two days with always-on display." },
  { id: "r-022", product_id: "p-015", author_name: "Amanda Young", rating: 5, comment: "I switched from a Garmin for the health features. Sleep tracking, cycle tracking, and ECG all in one watch. The always-on display is bright enough outdoors." },
  // PS5 DualSense
  { id: "r-023", product_id: "p-018", author_name: "Tyler Scott", rating: 5, comment: "The haptic feedback in God of War Ragnarök literally made me jump — you feel every blade hit. Adaptive triggers in Returnal are intense. Best controller ever made." },
  { id: "r-024", product_id: "p-018", author_name: "Nicole Green", rating: 4, comment: "Huge upgrade over the DualShock 4. The haptics are genuinely next-level. Battery life is shorter than I'd like but the experience makes up for it." },
  // Nintendo Switch OLED
  { id: "r-025", product_id: "p-020", author_name: "Josh Baker", rating: 5, comment: "The OLED screen makes handheld mode feel totally different — colors are so vibrant. Playing Zelda on the train is a joy I didn't know I needed." },
  // DJI Mini 4 Pro
  { id: "r-026", product_id: "p-024", author_name: "Cody Nelson", rating: 5, comment: "Under 249g means I can fly it in most places without registering. The 4K/60fps footage is cinematic right out of the box. Obstacle avoidance saved it on my first flight." },
  { id: "r-027", product_id: "p-024", author_name: "Heather Carter", rating: 5, comment: "Took this to Hawaii and captured footage that looked like a pro film crew. The ActiveTrack 360 feature followed me perfectly on a hike without any help." },
  // GoPro Hero 12
  { id: "r-028", product_id: "p-025", author_name: "Zach Mitchell", rating: 4, comment: "HyperSmooth 6.0 is genuinely impressive — mounted on my mountain bike helmet and the footage looks like a gimbal. Waterproof without a case is a huge plus." },
  // Sony ZV-E10
  { id: "r-029", product_id: "p-026", author_name: "Tiffany Perez", rating: 5, comment: "Perfect first mirrorless for YouTube. The Eye AF locked onto my face instantly and the directional mic cuts out most background noise. The E-mount lens ecosystem is huge." },
];

async function seed() {
  const client = await pool.connect();
  try {
    // Insert products (idempotent — skip rows that already exist by primary key)
    let productCount = 0;
    for (const p of products) {
      const result = await client.query(
        `INSERT INTO products (id, title, slug, description, price, image_url, category, in_stock)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
         ON CONFLICT (id) DO NOTHING`,
        [p.id, p.title, p.slug, p.description, p.price, p.image_url, p.category, p.in_stock]
      );
      productCount += result.rowCount ?? 0;
    }
    console.log(`✓ Seeded ${productCount} products (${products.length - productCount} already existed).`);

    // Insert reviews (idempotent — skip rows that already exist by primary key)
    let reviewCount = 0;
    for (const r of reviews) {
      const result = await client.query(
        `INSERT INTO reviews (id, product_id, author_name, rating, comment)
         VALUES ($1,$2,$3,$4,$5)
         ON CONFLICT (id) DO NOTHING`,
        [r.id, r.product_id, r.author_name, r.rating, r.comment]
      );
      reviewCount += result.rowCount ?? 0;
    }
    console.log(`✓ Seeded ${reviewCount} reviews (${reviews.length - reviewCount} already existed).`);
  } finally {
    client.release();
    await pool.end();
  }
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
