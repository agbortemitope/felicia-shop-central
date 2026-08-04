CREATE TABLE IF NOT EXISTS public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  price numeric NOT NULL,
  image_url text,
  category text,
  in_stock boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.products TO anon;
GRANT SELECT ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products are publicly readable"
  ON public.products FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  author_name text NOT NULL,
  rating integer NOT NULL,
  comment text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS reviews_product_id_idx ON public.reviews(product_id);

GRANT SELECT, INSERT ON public.reviews TO anon;
GRANT SELECT, INSERT ON public.reviews TO authenticated;
GRANT ALL ON public.reviews TO service_role;

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reviews are publicly readable"
  ON public.reviews FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Anyone can submit a review"
  ON public.reviews FOR INSERT TO anon, authenticated
  WITH CHECK (
    rating BETWEEN 1 AND 5
    AND char_length(author_name) BETWEEN 1 AND 60
    AND (comment IS NULL OR char_length(comment) <= 1000)
  );

INSERT INTO public.products (title, slug, description, price, image_url, category, in_stock) VALUES
('MacBook Air M3', 'macbook-air-m3', 'Latest MacBook Air with M3 chip, 8-core CPU, 10-core GPU and all-day battery life.', 1299.99, 'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=800', 'Laptops', true),
('MacBook Pro 16" M4 Max', 'macbook-pro-16-m4-max', 'Powerful MacBook Pro with M4 Max chip, 12-core CPU and 20-core GPU.', 3499.99, 'https://images.pexels.com/photos/303383/pexels-photo-303383.jpeg?auto=compress&cs=tinysrgb&w=800', 'Laptops', true),
('Dell XPS 15', 'dell-xps-15', 'Premium Windows ultrabook with OLED display and RTX graphics.', 1899.99, 'https://images.pexels.com/photos/459653/pexels-photo-459653.jpeg?auto=compress&cs=tinysrgb&w=800', 'Laptops', true),
('iPhone 16 Pro Max', 'iphone-16-pro-max', 'A18 Pro chip, titanium design and ProMotion display.', 1199.99, 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=800', 'Smartphones', true),
('iPhone 16 Pro', 'iphone-16-pro', 'iPhone 16 Pro with A18 Pro chip and advanced camera system.', 999.99, 'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=800', 'Smartphones', true),
('iPhone 16', 'iphone-16', 'Latest iPhone with A18 chip and dual camera system.', 799.99, 'https://images.pexels.com/photos/47261/pexels-photo-47261.jpeg?auto=compress&cs=tinysrgb&w=800', 'Smartphones', true),
('Samsung Galaxy S24 Ultra', 'samsung-galaxy-s24-ultra', 'Premium Android flagship with S Pen and 200MP camera.', 1299.99, 'https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=800', 'Smartphones', true),
('Google Pixel 9 Pro', 'google-pixel-9-pro', 'Tensor G4 chip with the best computational photography on Android.', 999.99, 'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=800', 'Smartphones', true),
('iPad Pro 13" M4', 'ipad-pro-13-m4', 'The largest iPad Pro with M4 chip and Ultra Retina XDR display.', 1299.99, 'https://images.pexels.com/photos/1334597/pexels-photo-1334597.jpeg?auto=compress&cs=tinysrgb&w=800', 'Tablets', true),
('iPad Air 11" M2', 'ipad-air-11-m2', 'iPad Air with M2 chip in a light, versatile form factor.', 799.99, 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=800', 'Tablets', true),
('Samsung Galaxy Tab S10+', 'samsung-galaxy-tab-s10-plus', 'Large AMOLED tablet with S Pen included.', 999.99, 'https://images.pexels.com/photos/1334598/pexels-photo-1334598.jpeg?auto=compress&cs=tinysrgb&w=800', 'Tablets', true),
('AirPods Pro (2nd Gen)', 'airpods-pro-2nd-gen', 'Active noise cancellation, spatial audio and adaptive transparency.', 249.99, 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=800', 'Audio', true),
('Sony WH-1000XM5', 'sony-wh-1000xm5', 'Industry-leading noise-cancelling over-ear headphones.', 399.99, 'https://images.pexels.com/photos/3394665/pexels-photo-3394665.jpeg?auto=compress&cs=tinysrgb&w=800', 'Audio', true),
('Bose QuietComfort Ultra', 'bose-quietcomfort-ultra', 'Immersive audio with world-class comfort and noise cancellation.', 429.99, 'https://images.pexels.com/photos/205926/pexels-photo-205926.jpeg?auto=compress&cs=tinysrgb&w=800', 'Audio', true),
('JBL Flip 6 Speaker', 'jbl-flip-6-speaker', 'Portable waterproof Bluetooth speaker with bold sound.', 129.99, 'https://images.pexels.com/photos/1279107/pexels-photo-1279107.jpeg?auto=compress&cs=tinysrgb&w=800', 'Audio', true),
('Apple Watch Series 10', 'apple-watch-series-10', 'Advanced health tracking with a bigger always-on display.', 429.99, 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=800', 'Wearables', true),
('Samsung Galaxy Watch 7', 'samsung-galaxy-watch-7', 'Sleep coaching, body composition and multi-day battery.', 329.99, 'https://images.pexels.com/photos/267394/pexels-photo-267394.jpeg?auto=compress&cs=tinysrgb&w=800', 'Wearables', true),
('PlayStation 5 Slim', 'playstation-5-slim', 'Next-gen console with ray tracing and blazing-fast SSD.', 499.99, 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=800', 'Gaming', true),
('Xbox Series X', 'xbox-series-x', 'The most powerful Xbox with true 4K gaming.', 499.99, 'https://images.pexels.com/photos/687811/pexels-photo-687811.jpeg?auto=compress&cs=tinysrgb&w=800', 'Gaming', true),
('Nintendo Switch OLED', 'nintendo-switch-oled', 'Handheld and docked play with a vivid 7-inch OLED screen.', 349.99, 'https://images.pexels.com/photos/371924/pexels-photo-371924.jpeg?auto=compress&cs=tinysrgb&w=800', 'Gaming', true),
('Logitech MX Master 3S', 'logitech-mx-master-3s', 'Precision wireless mouse for creators and developers.', 99.99, 'https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg?auto=compress&cs=tinysrgb&w=800', 'Accessories', true),
('Anker 737 Power Bank', 'anker-737-power-bank', '24,000mAh 140W power bank that charges laptops and phones.', 149.99, 'https://images.pexels.com/photos/4526407/pexels-photo-4526407.jpeg?auto=compress&cs=tinysrgb&w=800', 'Accessories', true),
('GoPro HERO 13 Black', 'gopro-hero-13-black', '5.3K rugged action camera with HyperSmooth stabilisation.', 449.99, 'https://images.pexels.com/photos/1051077/pexels-photo-1051077.jpeg?auto=compress&cs=tinysrgb&w=800', 'Cameras', true),
('Sony Alpha A7 IV', 'sony-alpha-a7-iv', '33MP full-frame mirrorless camera for photo and video.', 2499.99, 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=800', 'Cameras', false),
('DJI Air 3S Drone', 'dji-air-3s-drone', 'Dual-camera drone with 48MP sensor and long flight time.', 999.99, 'https://images.pexels.com/photos/2400181/pexels-photo-2400181.jpeg?auto=compress&cs=tinysrgb&w=800', 'Drones', true),
('DJI Mini 4 Pro', 'dji-mini-4-pro', 'Sub-249g drone with omnidirectional obstacle sensing.', 759.99, 'https://images.pexels.com/photos/336232/pexels-photo-336232.jpeg?auto=compress&cs=tinysrgb&w=800', 'Drones', true)
ON CONFLICT (slug) DO NOTHING;