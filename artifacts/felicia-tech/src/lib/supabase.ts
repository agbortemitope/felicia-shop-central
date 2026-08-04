// Replaced Supabase with generated API client
import { listProducts, getProductBySlug, listReviews, createReview as apiCreateReview } from "@workspace/api-client-react";

export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category: string | null;
  in_stock: boolean;
  created_at: string;
}

export interface Review {
  id: string;
  product_id: string;
  author_name: string;
  rating: number;
  comment: string | null;
  created_at: string;
}

export async function fetchProducts(): Promise<Product[]> {
  return listProducts() as Promise<Product[]>;
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  try {
    return getProductBySlug(slug) as Promise<Product>;
  } catch {
    return null;
  }
}

export async function fetchReviews(productId: string): Promise<Review[]> {
  return listReviews(productId) as Promise<Review[]>;
}

export async function submitReview(input: {
  product_id: string;
  author_name: string;
  rating: number;
  comment: string;
}): Promise<void> {
  await apiCreateReview(input.product_id, {
    author_name: input.author_name.trim().slice(0, 60),
    rating: input.rating,
    comment: input.comment.trim().slice(0, 1000),
  });
}
