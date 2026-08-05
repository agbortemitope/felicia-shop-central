import { useQuery } from "@tanstack/react-query";
import { fetchProducts, getCategories, type Product } from "@/lib/supabase";
import { Header } from "@/components/Header";
import { Loader as Loader2, Zap, ShoppingCart, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { useState, useMemo } from "react";

const Index = () => {
  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: () => fetchProducts(),
  });

  const { addItem } = useCartStore();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const categories = useMemo(() => {
    if (!products) return [];
    return getCategories(products);
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    if (!activeCategory) return products;
    return products.filter((p) => p.category === activeCategory);
  }, [products, activeCategory]);

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
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Featured Products</h2>
          <p className="text-muted-foreground">
            Explore our latest collection of tech gadgets including the new iPhone 17 series
          </p>
        </div>

        {/* Category Filter */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            <Button
              variant={activeCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(null)}
            >
              All Products
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-destructive">Failed to load products. Please try again.</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 space-y-4">
            <p className="text-muted-foreground text-lg">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" data-lovable-id="products-grid">
            {filteredProducts.map((product) => (
              <ProductGridCard key={product.id} product={product} onAddToCart={() => {
                addItem({
                  id: product.id,
                  name: product.title,
                  price: parseFloat(product.price.toString()),
                  quantity: 1,
                });
                toast.success('Added to cart', {
                  description: `${product.title} added to your cart`,
                });
              }} />
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

const ProductGridCard = ({
  product,
  onAddToCart,
}: {
  product: Product;
  onAddToCart: () => void;
}) => {
  const price = parseFloat(product.price.toString());

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col" data-lovable-id={`product-card-${product.id}`}>
      <Link to={`/product/${product.slug}`} className="flex flex-col flex-1">
        <div className="relative aspect-square overflow-hidden bg-muted">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
              <Zap className="w-12 h-12 text-primary/50" />
            </div>
          )}
          {!product.in_stock && (
            <div className="absolute top-3 right-3">
              <Badge variant="secondary">Out of Stock</Badge>
            </div>
          )}
        </div>
        <div className="p-4 space-y-3 flex-1 flex flex-col">
          {product.category && (
            <p className="text-xs font-medium text-primary uppercase tracking-wider">
              {product.category}
            </p>
          )}
          <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
            {product.title}
          </h3>
          {product.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 flex-1">
              {product.description}
            </p>
          )}
          <div className="flex items-center justify-between pt-2 mt-auto">
            <span className="text-xl font-bold">
              ${price.toFixed(2)}
            </span>
            {product.in_stock && (
              <Badge variant="outline" className="text-green-600 border-green-600/30">
                In Stock
              </Badge>
            )}
          </div>
        </div>
      </Link>
      <div className="p-4 pt-0">
        <Button
          onClick={(e) => {
            e.preventDefault();
            onAddToCart();
          }}
          disabled={!product.in_stock}
          className="w-full"
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          Add to Cart
        </Button>
      </div>
    </Card>
  );
};

export default Index;
