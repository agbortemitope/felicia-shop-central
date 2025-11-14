/*
  # Create products table

  1. New Tables
    - `products`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `price` (numeric)
      - `image_url` (text)
      - `category` (text)
      - `in_stock` (boolean)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `products` table
    - Add policy for public read access
*/

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  price numeric NOT NULL,
  image_url text,
  category text,
  in_stock boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products are publicly readable"
  ON products
  FOR SELECT
  USING (true);

INSERT INTO products (title, description, price, image_url, category, in_stock) VALUES
('MacBook Air M3', 'Latest MacBook Air with M3 chip, 8-core CPU, 10GB GPU', 1299.99, 'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=600', 'Laptops', true),
('MacBook Pro 16" M4', 'Powerful MacBook Pro with M4 Max chip, 12-core CPU, 20-core GPU', 3499.99, 'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=600', 'Laptops', true),
('iPhone 16 Pro Max', 'Latest iPhone with A18 Pro, titanium design, ProMotion display', 1199.99, 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=600', 'Smartphones', true),
('iPhone 16 Pro', 'iPhone 16 Pro with A18 Pro chip and advanced camera system', 999.99, 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=600', 'Smartphones', true),
('iPhone 16', 'Latest iPhone with A18 chip and dual camera', 799.99, 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=600', 'Smartphones', true),
('iPad Pro 13" M4', 'Largest iPad Pro with M4 chip and stunning display', 1299.99, 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=600', 'Tablets', true),
('iPad Air 11" M2', 'iPad Air with M2 chip and versatile form factor', 799.99, 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=600', 'Tablets', true),
('AirPods Pro (2nd Gen)', 'Active noise cancellation, spatial audio, adaptive audio', 249.99, 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=600', 'Audio', true),
('Apple Watch Series 10', 'Advanced health tracking, always-on display', 429.99, 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=600', 'Wearables', true),
('Samsung Galaxy S24 Ultra', 'Premium Android flagship with AI features', 1299.99, 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=600', 'Smartphones', true),
('PlayStation 5', 'Latest gaming console with ray tracing and 4K gaming', 499.99, 'https://images.pexels.com/photos/442512/pexels-photo-442512.jpeg?auto=compress&cs=tinysrgb&w=600', 'Gaming', true),
('Nintendo Switch OLED', 'Latest Switch with stunning OLED display', 349.99, 'https://images.pexels.com/photos/442512/pexels-photo-442512.jpeg?auto=compress&cs=tinysrgb&w=600', 'Gaming', true),
('Sony WH-1000XM5', 'Premium noise-canceling wireless headphones', 399.99, 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=600', 'Audio', true),
('GoPro Hero 13', '5.3K rugged action camera with AI enhancements', 449.99, 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=600', 'Cameras', true),
('DJI Air 3S', 'Advanced drone with 48MP camera and long flight time', 999.99, 'https://images.pexels.com/photos/2400181/pexels-photo-2400181.jpeg?auto=compress&cs=tinysrgb&w=600', 'Drones', true);
