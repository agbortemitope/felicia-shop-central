import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { fetchProductBySlug } from "@/lib/api";
import { Header } from "@/components/Header";
import { ReviewSection } from "@/components/ReviewSection";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/stores/cartStore";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ShoppingCart, ArrowLeft, Zap } from "lucide-react";

const ProductDetail = () => {
  const { handle } = useParams<{ handle: string }>();
  const addItem = useCartStore((state) => state.addItem);
  const { toast } = useToast();

  const { data: product, isLoading, error } = useQuery({
    queryKey: ["product", handle],
    queryFn: () => fetchProductBySlug(handle!),
    enabled: !!handle,
  });

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

  const handleAddToCart = () => {
    addItem({ id: product.id, name: product.title, price, quantity: 1 });
    toast({
      title: "Added to cart",
      description: `${product.title} has been added to your cart`,
    });
  };

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
          <div className="relative aspect-square rounded-xl overflow-hidden bg-white border">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.title}
                className="w-full h-full object-contain p-6"
              />

            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Zap className="w-12 h-12 text-primary/50" />
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              {product.category && (
                <p className="text-xs font-medium text-primary uppercase tracking-wider mb-2">
                  {product.category}
                </p>
              )}
              <h1 className="text-4xl font-bold mb-4">{product.title}</h1>
              <p className="text-3xl font-bold text-primary">${price.toFixed(2)}</p>
            </div>

            {product.description && (
              <div>
                <h2 className="text-lg font-semibold mb-2">Description</h2>
                <p className="text-muted-foreground">{product.description}</p>
              </div>
            )}

            <Badge variant={product.in_stock ? "default" : "secondary"}>
              {product.in_stock ? "In Stock" : "Out of Stock"}
            </Badge>

            <Button
              onClick={handleAddToCart}
              size="lg"
              className="w-full md:w-auto"
              disabled={!product.in_stock}
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Add to Cart
            </Button>
          </div>
        </div>

        <ReviewSection productId={product.id} />
      </div>
    </div>
  );
};

export default ProductDetail;
