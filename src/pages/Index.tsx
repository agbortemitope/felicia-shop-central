import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { fetchProducts } from "@/lib/supabase";
import { Header } from "@/components/Header";
import { Loader2, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: () => fetchProducts(),
  });

  const { addItem } = useCartStore();
  const { toast } = useToast();

  return (
    <div className="min-h-screen bg-background" data-lovable-id="app-container">
      <Header />

      <section className="relative overflow-hidden" data-lovable-id="hero-section">
        <div className="absolute inset-0 bg-gradient-hero opacity-10" />
        <div className="container relative py-24 md:py-32">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Zap className="w-4 h-4" />
              Latest Tech Gadgets
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Discover the Future of{" "}
              <span className="bg-gradient-hero bg-clip-text text-transparent">
                Technology
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Premium gadgets and cutting-edge electronics for tech enthusiasts.
              Experience innovation at your fingertips.
            </p>
          </div>
        </div>
      </section>

      <section className="container py-16" data-lovable-id="products-section">
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-2">Featured Products</h2>
          <p className="text-muted-foreground">Explore our latest collection of tech gadgets including the new iPhone 17 series</p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-destructive">Failed to load products. Please try again.</p>
          </div>
        ) : !products || products.length === 0 ? (
          <div className="text-center py-20 space-y-4">
            <p className="text-muted-foreground text-lg">No products found</p>
            <p className="text-sm text-muted-foreground">
              Create your first product by telling me what you'd like to add!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" data-lovable-id="products-grid">
            {products.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col" data-lovable-id={`product-card-${product.id}`}>
                <Link to={`/product/${product.slug}`} className="block">
                  <div className="relative aspect-square overflow-hidden bg-muted">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.title}
                        loading="lazy"
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                        <Zap className="w-12 h-12 text-primary/50" />
                      </div>
                    )}
                  </div>
                </Link>
                <div className="p-4 space-y-3 flex-1 flex flex-col">
                  {product.category && (
                    <p className="text-xs font-medium text-primary uppercase tracking-wider">
                      {product.category}
                    </p>
                  )}
                  <Link to={`/product/${product.slug}`}>
                    <h3 className="font-semibold line-clamp-2 hover:text-primary transition-colors">{product.title}</h3>
                  </Link>
                  {product.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {product.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xl font-bold">
                      ${parseFloat(product.price.toString()).toFixed(2)}
                    </span>
                    <span className={`text-xs font-medium ${product.in_stock ? 'text-green-600' : 'text-destructive'}`}>
                      {product.in_stock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                  <Button
                    onClick={() => {
                      addItem({
                        id: product.id,
                        name: product.title,
                        price: parseFloat(product.price.toString()),
                        quantity: 1,
                      });
                      toast({
                        title: 'Added to cart',
                        description: `${product.title} added to your cart`,
                      });
                    }}
                    disabled={!product.in_stock}
                    className="w-full"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      <footer className="border-t mt-20" data-lovable-id="footer">
        <div className="container py-8 text-center text-muted-foreground">
          <p>© 2025 Felicia Tech Gadgets. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
