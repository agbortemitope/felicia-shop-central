/*
# Remove legacy products without slugs

The original seed migration (20251114001533) inserted 15 products without slug values.
The new migration added 26 products with slugs but the old rows remained, causing duplicates.
This migration deletes the old slug-less products so only the 26 new ones remain.
Reviews linked to old products are removed via ON DELETE CASCADE.
*/

DELETE FROM products WHERE slug IS NULL;
