import { Router, type IRouter } from "express";
import { db, productsTable, reviewsTable } from "@workspace/db";
import { eq, asc, desc } from "drizzle-orm";
import { CreateReviewBody } from "@workspace/api-zod";

const router: IRouter = Router();

// GET /api/products
router.get("/products", async (req, res): Promise<void> => {
  try {
    const products = await db
      .select()
      .from(productsTable)
      .orderBy(asc(productsTable.created_at));
    res.json(
      products.map((p) => ({
        ...p,
        price: parseFloat(p.price),
      }))
    );
  } catch (err) {
    req.log.error({ err }, "Failed to list products");
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// GET /api/products/:slug
router.get("/products/:slug", async (req, res): Promise<void> => {
  try {
    const { slug } = req.params;
    const [product] = await db
      .select()
      .from(productsTable)
      .where(eq(productsTable.slug, slug))
      .limit(1);

    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    res.json({ ...product, price: parseFloat(product.price) });
  } catch (err) {
    req.log.error({ err }, "Failed to get product by slug");
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

// GET /api/products/:productId/reviews
router.get("/products/:productId/reviews", async (req, res): Promise<void> => {
  try {
    const { productId } = req.params;
    const reviews = await db
      .select()
      .from(reviewsTable)
      .where(eq(reviewsTable.product_id, productId))
      .orderBy(desc(reviewsTable.created_at));
    res.json(reviews);
  } catch (err) {
    req.log.error({ err }, "Failed to list reviews");
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
});

// POST /api/products/:productId/reviews
router.post("/products/:productId/reviews", async (req, res): Promise<void> => {
  try {
    const { productId } = req.params;
    const parsed = CreateReviewBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid review data" });
      return;
    }

    const [review] = await db
      .insert(reviewsTable)
      .values({
        product_id: productId,
        author_name: parsed.data.author_name,
        rating: Math.round(parsed.data.rating),
        comment: parsed.data.comment ?? null,
      })
      .returning();

    res.status(201).json(review);
  } catch (err) {
    req.log.error({ err }, "Failed to create review");
    res.status(500).json({ error: "Failed to submit review" });
  }
});

export default router;
