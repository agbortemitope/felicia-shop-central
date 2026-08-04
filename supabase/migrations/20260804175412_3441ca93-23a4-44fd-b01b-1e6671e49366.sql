DELETE FROM public.reviews;
DELETE FROM public.products;

INSERT INTO public.products (title, slug, description, price, image_url, category, in_stock) VALUES
('Apple iPhone 15','iphone-15','6.1" Super Retina XDR display, A16 Bionic chip, 48MP main camera with 2x telephoto, Dynamic Island and USB-C charging. Aluminium frame with Ceramic Shield front.',699.00,'/__l5e/assets-v1/6c02d2fd-e556-4fe1-a3a6-7bb5991d163c/iphone-15.jpg','Smartphones',true),
('Apple iPhone 16','iphone-16','A18 chip with Apple Intelligence, 48MP Fusion camera, dedicated Camera Control button, Action button and all-day battery life. 6.1" display.',899.00,'/__l5e/assets-v1/df39d2c2-d6ed-4746-af8f-7cc7b06451e7/iphone-16.jpg','Smartphones',true),
('Apple iPhone 17e','iphone-17e','The affordable iPhone: A19 chip, 48MP Fusion camera, Ceramic Shield 2 with 3x better scratch resistance, MagSafe and fast USB-C charging. 256GB starting storage.',649.00,'/__l5e/assets-v1/687def0f-7665-4059-b4d3-10df18590a50/iphone-17e.jpg','Smartphones',true),
('Motorola Edge 2026','motorola-edge-2026','Elegant design built to last: 50MP Sony LYTIA main camera, 50MP ultrawide, 50MP selfie cam and 4K recording. Military-grade durability with Corning Gorilla Glass 7i and IP68/69 rating.',549.00,'/__l5e/assets-v1/0d5d4050-1f5a-4817-98e3-bfe895483704/motorola-edge-2026.jpg','Smartphones',true),
('Motorola Moto G 2026','moto-g-2026','A selfie''s best friend. Long-lasting 5000mAh battery with 60W TurboPower charging — power for the day in 7 minutes — plus wireless charging and a crisp big-screen display.',229.00,'/__l5e/assets-v1/b4a26533-f41d-4868-9dd4-1b08d695e8f4/moto-g-2026.jpg','Smartphones',true),
('Crosscall CORE-P6','crosscall-core-p6','Ultra-rugged push-to-talk handset built for the field. Reinforced shockproof body, physical keypad, programmable buttons, waterproof design and marathon battery life.',899.00,'/__l5e/assets-v1/49da589f-efd2-490c-9c58-0d1fd5fba702/crosscall-core-p6.jpg','Rugged Phones',true);

INSERT INTO public.reviews (product_id, author_name, rating, comment, created_at)
SELECT p.id, v.author, v.rating, v.comment, now() - (v.days || ' days')::interval
FROM public.products p
JOIN (VALUES
 ('iphone-15','Chidera Okafor',5,'Battery easily lasts me a full working day and the camera is sharp even in low light. Delivery took two days to Lekki.',4),
 ('iphone-15','Tunde Bakare',4,'Great phone overall. Only gripe is it heats up a little while gaming, otherwise flawless.',11),
 ('iphone-15','Amaka N.',5,'Switched from an older Android and the transfer was painless. Screen is beautiful.',19),
 ('iphone-16','Samuel Adeyemi',5,'The Camera Control button sounds like a gimmick until you use it. Photos are next level.',3),
 ('iphone-16','Grace Ilori',4,'Fast and smooth, though I wish it came with a charger in the box. Packaging arrived sealed and genuine.',9),
 ('iphone-16','Kelvin Umeh',5,'Worth the upgrade from the 14. Apple Intelligence features are actually useful day to day.',16),
 ('iphone-17e','Blessing Ada',5,'Best value iPhone right now. 256GB base storage means I stopped worrying about space.',2),
 ('iphone-17e','Femi Olatunji',4,'Camera is excellent for the price. Slightly slower charging than I expected but not a deal breaker.',8),
 ('iphone-17e','Rita Chukwu',5,'Bought the pink one for my sister and she loves it. Feels solid, not cheap at all.',14),
 ('motorola-edge-2026','Ibrahim Sule',5,'Dropped it twice on concrete already and there is not a scratch. Cameras punch above their price.',5),
 ('motorola-edge-2026','Nkechi Eze',4,'Lovely design and clean Android. Speaker could be louder but the battery is superb.',12),
 ('motorola-edge-2026','David Ogun',5,'Ultrawide and macro shots are genuinely impressive. Happy customer.',21),
 ('moto-g-2026','Peace Aluko',5,'For the money this is unbeatable. Seven minutes on charge gets me through the evening.',6),
 ('moto-g-2026','Yusuf Danladi',4,'Solid budget phone for calls, WhatsApp and light gaming. Not a flagship, but does not pretend to be.',13),
 ('moto-g-2026','Ngozi Bello',5,'Bought two for the shop staff. Reliable and the battery is the real star.',23),
 ('crosscall-core-p6','Ekene Nwosu',5,'We use these on site. Dust, rain, drops from scaffolding — it keeps going. Push-to-talk is instant.',7),
 ('crosscall-core-p6','Hauwa Mohammed',4,'Heavy and chunky, but that is the point. Battery lasts us a full three-day shift rotation.',17),
 ('crosscall-core-p6','Paul Ezeani',5,'Physical keys work with gloves on, which no touchscreen does. Exactly what our field team needed.',26)
) AS v(slug, author, rating, comment, days) ON v.slug = p.slug;