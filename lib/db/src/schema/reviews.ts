import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";
import { productsTable } from "./products";

export const reviewsTable = pgTable("reviews", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  product_id: text("product_id").notNull().references(() => productsTable.id),
  author_name: text("author_name").notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  created_at: timestamp("created_at").notNull().defaultNow(),
});

export type Review = typeof reviewsTable.$inferSelect;
export type InsertReview = typeof reviewsTable.$inferInsert;
