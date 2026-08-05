import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { fetchProductBySlug, fetchReviews } from "@/lib/supabase";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";
import { Loader as Loader2, ShoppingCart, ArrowLeft, Star } from "lucide-react";

const Stars = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i <= Math.round(rating) ? "fill-primary text-primary" : "text-muted-foreground/40"}`}
      />
    ))}
  </div>
);

const ProductDetail = () => {
  const { handle } = useParams<{ handle: string }>();
  const addItem = useCartStore((state) => state.addItem);

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", handle],
    queryFn: () => fetchProductBySlug(handle!),
    enabled: !!handle,
  });

  const { data: reviews } = useQuery({
    queryKey: ["reviews", product?.id],
    queryFn: () => fetchReviews(product!.id),
    enabled: !!product?.id,
  });

  const average =
    reviews && reviews.length
      ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
      : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-32 text-center space-y-4">
          <p className="text-muted-foreground">Product not found.</p>
          <Link to="/">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to shop
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container py-10">
        <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to shop
        </Link>

        <div className="grid md:grid-cols-2 gap-10">
          <div className="rounded-xl border bg-white p-6 flex items-center justify-center">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.title}
                className="w-full h-[420px] object-contain"
              />
            ) : (
              <div className="h-[420px] flex items-center justify-center text-muted-foreground">No image</div>
            )}
          </div>

          <div className="space-y-6">
            {product.category && <Badge variant="secondary">{product.category}</Badge>}
            <h1 className="text-3xl font-bold">{product.title}</h1>

            {reviews && reviews.length > 0 && (
              <div className="flex items-center gap-2">
                <Stars rating={average} />
                <span className="text-sm text-muted-foreground">
                  {average.toFixed(1)} · {reviews.length} reviews
                </span>
              </div>
            )}

            <p className="text-3xl font-bold text-primary">${Number(product.price).toFixed(2)}</p>
            {product.description && (
              <p className="text-muted-foreground leading-relaxed">{product.description}</p>
            )}

            <Button
              size="lg"
              className="w-full"
              disabled={!product.in_stock}
              onClick={() => {
                addItem({
                  id: product.id,
                  name: product.title,
                  price: Number(product.price),
                  quantity: 1,
                });
                toast.success("Added to cart", { description: product.title });
              }}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              {product.in_stock ? "Add to Cart" : "Out of Stock"}
            </Button>
          </div>
        </div>

        {reviews && reviews.length > 0 && (
          <section className="mt-16 max-w-3xl">
            <h2 className="text-2xl font-bold mb-6">Customer reviews</h2>
            <div className="space-y-6">
              {reviews.map((r) => (
                <div key={r.id} className="border-b pb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{r.author_name}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(r.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <Stars rating={r.rating} />
                  {r.comment && <p className="text-muted-foreground mt-2">{r.comment}</p>}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
