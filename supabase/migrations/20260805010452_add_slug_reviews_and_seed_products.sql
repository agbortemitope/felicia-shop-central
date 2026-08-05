/*
# Add slug column, reviews table, and seed 26 products with reviews

1. Schema Changes
   - Add `slug` column (text, unique) to `products` table for URL-friendly product identifiers
   - Create `reviews` table for customer product reviews
     - `id` (uuid, primary key)
     - `product_id` (uuid, foreign key to products, ON DELETE CASCADE)
     - `reviewer_name` (text, name of reviewer)
     - `rating` (integer, 1-5 star rating)
     - `comment` (text, review body)
     - `created_at` (timestamptz, default now())

2. Data Seeding
   - Insert 26 products across 9 categories: Laptops, Smartphones, Tablets,
     Audio, Wearables, Gaming, Cameras, Drones, Accessories
   - Includes the full iPhone 17 series (Pro Max, Pro, Plus, base)
   - Each product has: title, description, price, image_url, category, slug, in_stock
   - Insert demo reviews with American names for various products

3. Security
   - Reviews table has RLS enabled
   - Public read access for reviews (anon + authenticated)
   - Public read access for products (already exists)
*/

-- Add slug column to products
ALTER TABLE products ADD COLUMN IF NOT EXISTS slug text;
CREATE UNIQUE INDEX IF NOT EXISTS products_slug_key ON products (slug);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  reviewer_name text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_reviews" ON reviews;
CREATE POLICY "anon_select_reviews" ON reviews FOR SELECT
  TO anon, authenticated USING (true);

-- Seed 26 products (idempotent via ON CONFLICT)
INSERT INTO products (title, description, price, image_url, category, slug, in_stock) VALUES
-- Laptops (3)
('MacBook Air M3', 'Latest MacBook Air with M3 chip, 8-core CPU, 10-core GPU, 13-inch Liquid Retina display', 1299.99, 'https://images.pexels.com/photos/129205/pexels-photo-129205.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Laptops', 'macbook-air-m3', true),
('MacBook Pro 16" M4', 'Powerful MacBook Pro with M4 Max chip, 12-core CPU, 20-core GPU, stunning 16-inch Liquid Retina XDR display', 3499.99, 'https://images.pexels.com/photos/265144/pexels-photo-265144.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Laptops', 'macbook-pro-16-m4', true),
('Dell XPS 15', 'Premium Windows laptop with Intel Core Ultra 9, NVIDIA RTX 4070, stunning 15.6-inch OLED touch display', 1899.99, 'https://images.pexels.com/photos/5202955/pexels-photo-5202955.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Laptops', 'dell-xps-15', true),
-- Smartphones (6)
('iPhone 17 Pro Max', 'The most powerful iPhone ever with A19 Pro chip, titanium design, 5x telephoto camera, and ProMotion display', 1199.99, 'https://images.pexels.com/photos/30639091/pexels-photo-30639091.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Smartphones', 'iphone-17-pro-max', true),
('iPhone 17 Pro', 'iPhone 17 Pro with A19 Pro chip, advanced triple camera system, and aerospace-grade titanium build', 1099.99, 'https://images.pexels.com/photos/3945698/pexels-photo-3945698.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Smartphones', 'iphone-17-pro', true),
('iPhone 17 Plus', 'iPhone 17 Plus with A19 chip, large 6.7-inch display, dual camera system, and all-day battery life', 899.99, 'https://images.pexels.com/photos/3945672/pexels-photo-3945672.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Smartphones', 'iphone-17-plus', true),
('iPhone 17', 'Latest iPhone with A19 chip, 6.1-inch display, dual camera, and USB-C', 799.99, 'https://images.pexels.com/photos/3945695/pexels-photo-3945695.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Smartphones', 'iphone-17', true),
('Samsung Galaxy S24 Ultra', 'Premium Android flagship with Snapdragon 8 Gen 3, 200MP camera, S Pen, and Galaxy AI features', 1299.99, 'https://images.pexels.com/photos/3945691/pexels-photo-3945691.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Smartphones', 'samsung-galaxy-s24-ultra', true),
('Google Pixel 9 Pro', 'Google Pixel 9 Pro with Tensor G4 chip, advanced AI photography, and 7 years of OS updates', 999.99, 'https://images.pexels.com/photos/30639091/pexels-photo-30639091.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Smartphones', 'google-pixel-9-pro', true),
-- Tablets (3)
('iPad Pro 13" M4', 'Largest iPad Pro with M4 chip, Ultra Retina XDR display, and Apple Pencil Pro support', 1299.99, 'https://images.pexels.com/photos/10535365/pexels-photo-10535365.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Tablets', 'ipad-pro-13-m4', true),
('iPad Air 11" M2', 'iPad Air with M2 chip, 11-inch Liquid Retina display, and versatile form factor', 799.99, 'https://images.pexels.com/photos/38639/mockup-psd-ipad-iphone-38639.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Tablets', 'ipad-air-11-m2', true),
('Samsung Galaxy Tab S9', 'Premium Android tablet with Snapdragon 8 Gen 2, AMOLED display, and S Pen included', 699.99, 'https://images.pexels.com/photos/3946006/pexels-photo-3946006.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Tablets', 'samsung-galaxy-tab-s9', true),
-- Audio (3)
('AirPods Pro (2nd Gen)', 'Active noise cancellation, spatial audio, adaptive audio, and USB-C charging case', 249.99, 'https://images.pexels.com/photos/3394665/pexels-photo-3394665.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Audio', 'airpods-pro-2nd-gen', true),
('Sony WH-1000XM5', 'Premium noise-canceling wireless headphones with 30-hour battery and crystal-clear calls', 399.99, 'https://images.pexels.com/photos/33481395/pexels-photo-33481395.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Audio', 'sony-wh-1000xm5', true),
('Bose QuietComfort Ultra', 'Bose immersive audio, world-class noise cancellation, and all-day comfort', 429.99, 'https://images.pexels.com/photos/7772548/pexels-photo-7772548.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Audio', 'bose-quietcomfort-ultra', true),
-- Wearables (2)
('Apple Watch Series 10', 'Advanced health tracking, always-on display, sleep apnea alerts, and faster S10 chip', 429.99, 'https://images.pexels.com/photos/267391/pexels-photo-267391.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Wearables', 'apple-watch-series-10', true),
('Samsung Galaxy Watch Ultra', 'Rugged titanium smartwatch with advanced health monitoring and 100-hour battery', 649.99, 'https://images.pexels.com/photos/51011/pexels-photo-51011.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Wearables', 'samsung-galaxy-watch-ultra', true),
-- Gaming (3)
('PlayStation 5', 'Latest gaming console with ray tracing, 4K gaming, and lightning-fast SSD loading', 499.99, 'https://images.pexels.com/photos/4523006/pexels-photo-4523006.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Gaming', 'playstation-5', true),
('Nintendo Switch OLED', 'Hybrid gaming console with vibrant 7-inch OLED screen and detachable Joy-Con controllers', 349.99, 'https://images.pexels.com/photos/9409819/pexels-photo-9409819.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Gaming', 'nintendo-switch-oled', true),
('Xbox Series X', 'Most powerful Xbox with 12 teraflops, true 4K gaming, and Quick Resume', 499.99, 'https://images.pexels.com/photos/12719135/pexels-photo-12719135.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Gaming', 'xbox-series-x', true),
-- Cameras (3)
('GoPro Hero 13', '5.3K rugged action camera with AI enhancements, magnetic mount, and waterproof design', 449.99, 'https://images.pexels.com/photos/3989612/pexels-photo-3989612.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Cameras', 'gopro-hero-13', true),
('Canon EOS R50', 'Compact mirrorless camera with 24.2MP sensor, 4K video, and Dual Pixel autofocus', 679.99, 'https://images.pexels.com/photos/4372403/pexels-photo-4372403.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Cameras', 'canon-eos-r50', true),
('Fujifilm X-T50', 'Premium APS-C mirrorless camera with 40MP sensor, film simulations, and classic design', 1699.99, 'https://images.pexels.com/photos/3653771/pexels-photo-3653771.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Cameras', 'fujifilm-xt50', true),
-- Drones (1)
('DJI Air 3S', 'Advanced drone with dual-camera system, 4K HDR video, 45-minute flight time, and obstacle sensing', 999.99, 'https://images.pexels.com/photos/5555813/pexels-photo-5555813.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Drones', 'dji-air-3s', true),
-- Accessories (2)
('Logitech MX Master 3S', 'Premium wireless mouse with 8000 DPI sensor, quiet clicks, and fast charging', 99.99, 'https://images.pexels.com/photos/7151696/pexels-photo-7151696.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Accessories', 'logitech-mx-master-3s', true),
('Apple Magic Keyboard', 'Wireless rechargeable keyboard with scissor mechanism and USB-C charging', 99.99, 'https://images.pexels.com/photos/7151698/pexels-photo-7151698.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Accessories', 'apple-magic-keyboard', true)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  in_stock = EXCLUDED.in_stock;

-- Seed demo reviews with American names
INSERT INTO reviews (product_id, reviewer_name, rating, comment)
SELECT p.id, 'Jennifer Thompson', 5, 'Absolutely love this! The performance is incredible and the build quality is top-notch. Worth every penny.'
FROM products p WHERE p.slug = 'iphone-17-pro-max'
ON CONFLICT DO NOTHING;

INSERT INTO reviews (product_id, reviewer_name, rating, comment)
SELECT p.id, 'Michael Rodriguez', 5, 'The camera system on this phone is unreal. Coming from an iPhone 15 Pro, the upgrade is massive.'
FROM products p WHERE p.slug = 'iphone-17-pro-max'
ON CONFLICT DO NOTHING;

INSERT INTO reviews (product_id, reviewer_name, rating, comment)
SELECT p.id, 'Ashley Williams', 4, 'Great phone overall, but the battery life could be a bit better. The titanium feels premium.'
FROM products p WHERE p.slug = 'iphone-17-pro'
ON CONFLICT DO NOTHING;

INSERT INTO reviews (product_id, reviewer_name, rating, comment)
SELECT p.id, 'Christopher Davis', 5, 'Perfect size and the display is gorgeous. The A19 chip is blazing fast for gaming.'
FROM products p WHERE p.slug = 'iphone-17'
ON CONFLICT DO NOTHING;

INSERT INTO reviews (product_id, reviewer_name, rating, comment)
SELECT p.id, 'Jessica Martinez', 5, 'The big screen is perfect for watching movies and reading. Battery lasts all day easily.'
FROM products p WHERE p.slug = 'iphone-17-plus'
ON CONFLICT DO NOTHING;

INSERT INTO reviews (product_id, reviewer_name, rating, comment)
SELECT p.id, 'David Wilson', 5, 'Switched from Android to this MacBook and never looking back. The M3 chip handles everything I throw at it.'
FROM products p WHERE p.slug = 'macbook-air-m3'
ON CONFLICT DO NOTHING;

INSERT INTO reviews (product_id, reviewer_name, rating, comment)
SELECT p.id, 'Amanda Brown', 5, 'This thing is a beast. Video editing in 4K is smooth as butter. Best laptop I have ever owned.'
FROM products p WHERE p.slug = 'macbook-pro-16-m4'
ON CONFLICT DO NOTHING;

INSERT INTO reviews (product_id, reviewer_name, rating, comment)
SELECT p.id, 'Joshua Anderson', 4, 'Great laptop for the price. The OLED screen is stunning but it runs a bit warm under heavy load.'
FROM products p WHERE p.slug = 'dell-xps-15'
ON CONFLICT DO NOTHING;

INSERT INTO reviews (product_id, reviewer_name, rating, comment)
SELECT p.id, 'Stephanie Garcia', 5, 'The noise cancellation is incredible. I cannot hear anything on my commute anymore.'
FROM products p WHERE p.slug = 'sony-wh-1000xm5'
ON CONFLICT DO NOTHING;

INSERT INTO reviews (product_id, reviewer_name, rating, comment)
SELECT p.id, 'Brandon Lee', 5, 'Sound quality is amazing and they are super comfortable for long listening sessions.'
FROM products p WHERE p.slug = 'airpods-pro-2nd-gen'
ON CONFLICT DO NOTHING;

INSERT INTO reviews (product_id, reviewer_name, rating, comment)
SELECT p.id, 'Nicole Taylor', 5, 'The health tracking features are impressive. The sleep apnea alerts give me peace of mind.'
FROM products p WHERE p.slug = 'apple-watch-series-10'
ON CONFLICT DO NOTHING;

INSERT INTO reviews (product_id, reviewer_name, rating, comment)
SELECT p.id, 'Kevin Nguyen', 5, 'Best gaming console I have owned. The load times are instant and the graphics are stunning.'
FROM products p WHERE p.slug = 'playstation-5'
ON CONFLICT DO NOTHING;

INSERT INTO reviews (product_id, reviewer_name, rating, comment)
SELECT p.id, 'Rachel Moore', 4, 'Love the OLED screen! Perfect for playing in handheld mode. Wish the battery lasted a bit longer.'
FROM products p WHERE p.slug = 'nintendo-switch-oled'
ON CONFLICT DO NOTHING;

INSERT INTO reviews (product_id, reviewer_name, rating, comment)
SELECT p.id, 'Tyler Jackson', 5, 'The footage quality is incredible for such a small camera. Took it surfing and it held up perfectly.'
FROM products p WHERE p.slug = 'gopro-hero-13'
ON CONFLICT DO NOTHING;

INSERT INTO reviews (product_id, reviewer_name, rating, comment)
SELECT p.id, 'Megan White', 5, 'Great drone for beginners and pros alike. The obstacle avoidance saved me from a few crashes already.'
FROM products p WHERE p.slug = 'dji-air-3s'
ON CONFLICT DO NOTHING;

INSERT INTO reviews (product_id, reviewer_name, rating, comment)
SELECT p.id, 'Daniel Harris', 5, 'The S Pen is a game changer. I use it for work notes and sketching every single day.'
FROM products p WHERE p.slug = 'samsung-galaxy-s24-ultra'
ON CONFLICT DO NOTHING;

INSERT INTO reviews (product_id, reviewer_name, rating, comment)
SELECT p.id, 'Lauren Clark', 4, 'The AI camera features are cool but sometimes overprocess the photos. Still a great phone.'
FROM products p WHERE p.slug = 'google-pixel-9-pro'
ON CONFLICT DO NOTHING;

INSERT INTO reviews (product_id, reviewer_name, rating, comment)
SELECT p.id, 'Justin Lewis', 5, 'The M4 chip makes this the fastest tablet I have ever used. Replaced my laptop for most tasks.'
FROM products p WHERE p.slug = 'ipad-pro-13-m4'
ON CONFLICT DO NOTHING;

INSERT INTO reviews (product_id, reviewer_name, rating, comment)
SELECT p.id, 'Samantha Walker', 5, 'Best mouse I have ever used. The ergonomics are perfect and the battery lasts for weeks.'
FROM products p WHERE p.slug = 'logitech-mx-master-3s'
ON CONFLICT DO NOTHING;
