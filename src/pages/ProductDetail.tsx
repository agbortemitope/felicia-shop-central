import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { fetchProductBySlug, fetchProductReviews } from "@/lib/supabase";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";
import { Loader as Loader2, ShoppingCart, ArrowLeft, Star, Zap } from "lucide-react";
import { useState } from "react";

const ProductDetail = () => {
  const { handle } = useParams<{ handle: string }>();
  const addItem = useCartStore((state) => state.addItem);

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', handle],
    queryFn: () => fetchProductBySlug(handle!),
    enabled: !!handle,
  });

  const { data: reviews } = useQuery({
    queryKey: ['reviews', product?.id],
    queryFn: () => fetchProductReviews(product!.id),
    enabled: !!product?.id,
  });

  const handleAddToCart = () => {
    if (!product) return;
    addItem({
      id: product.id,
      name: product.title,
      price: parseFloat(product.price.toString()),
      quantity: 1,
    });
    toast.success('Added to cart', {
      description: `${product.title} has been added to your cart`,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-20 text-center">
          <p className="text-destructive">Product not found</p>
          <Link to="/">
            <Button className="mt-4">Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const price = parseFloat(product.price.toString());
  const avgRating = reviews && reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container py-8">
        <Link to="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Button>
        </Link>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Image */}
          <div className="relative aspect-square rounded-xl overflow-hidden bg-muted shadow-card">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                <Zap className="w-12 h-12 text-primary/50" />
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              {product.category && (
                <p className="text-sm font-medium text-primary uppercase tracking-wider mb-2">
                  {product.category}
                </p>
              )}
              <h1 className="text-4xl font-bold mb-4">{product.title}</h1>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl font-bold text-primary">
                  ${price.toFixed(2)}
                </span>
                {avgRating && (
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{avgRating}</span>
                    <span className="text-muted-foreground text-sm">
                      ({reviews!.length} review{reviews!.length !== 1 ? 's' : ''})
                    </span>
                  </div>
                )}
              </div>
              <Badge variant={product.in_stock ? "default" : "secondary"}>
                {product.in_stock ? "In Stock" : "Out of Stock"}
              </Badge>
            </div>

            {product.description && (
              <div>
                <h2 className="text-lg font-semibold mb-2">Description</h2>
                <p className="text-muted-foreground">{product.description}</p>
              </div>
            )}

            {/* Add to Cart */}
            <Button
              onClick={handleAddToCart}
              size="lg"
              className="w-full md:w-auto"
              disabled={!product.in_stock}
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              {product.in_stock ? "Add to Cart" : "Out of Stock"}
            </Button>
          </div>
        </div>

        {/* Reviews Section */}
        {reviews && reviews.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {reviews.map((review) => (
                <Card key={review.id} className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                        {review.reviewer_name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{review.reviewer_name}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(review.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-muted-foreground/30'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  {review.comment && (
                    <p className="text-muted-foreground text-sm">{review.comment}</p>
                  )}
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
