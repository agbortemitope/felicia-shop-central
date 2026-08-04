import { supabase } from "@/integrations/supabase/client";

export { supabase };

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
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) throw error;
  return (data ?? []) as unknown as Product[];
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  return (data as unknown as Product) ?? null;
}

export async function fetchReviews(productId: string): Promise<Review[]> {
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("product_id", productId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as unknown as Review[];
}

export async function submitReview(input: {
  product_id: string;
  author_name: string;
  rating: number;
  comment: string;
}): Promise<void> {
  const { error } = await supabase.from("reviews").insert({
    product_id: input.product_id,
    author_name: input.author_name.trim().slice(0, 60),
    rating: input.rating,
    comment: input.comment.trim().slice(0, 1000) || null,
  } as never);

  if (error) throw error;
}
