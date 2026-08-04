import { useState, useMemo } from "react";
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

const CATEGORIES = [
  "All",
  "Phones",
  "Laptops",
  "Tablets",
  "Audio",
  "Wearables",
  "Gaming",
  "Accessories",
  "Cameras & Drones",
];

const Index = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  const { data: products, isLoading, error } = useQuery({
    queryKey: ["products"],
    queryFn: () => fetchProducts(),
  });

  const filtered = useMemo(() => {
    if (!products) return [];
    if (activeCategory === "All") return products;
    return products.filter((p) => p.category === activeCategory);
  }, [products, activeCategory]);

  const { addItem } = useCartStore();
  const { toast } = useToast();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-10" />
        <div className="container relative py-20 md:py-28">
          <div className="max-w-3xl mx-auto text-center space-y-5">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Zap className="w-4 h-4" />
              Gadget Online Store
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              The latest tech,{" "}
              <span className="bg-gradient-hero bg-clip-text text-transparent">
                delivered fast
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Phones, laptops, tablets, audio, wearables and more — genuine
              products, warranty-backed and ready to ship from Felicia Tech.
            </p>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="container py-12">
        {/* Section header */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold mb-1">Shop by Category</h2>
          <p className="text-muted-foreground">
            Browse a product to read customer reviews and leave your own
          </p>
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap gap-2 mb-10">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background text-muted-foreground border-border hover:border-primary hover:text-primary"
              }`}
            >
              {cat}
              {cat !== "All" && products && (
                <span className="ml-1.5 text-xs opacity-70">
                  {products.filter((p) => p.category === cat).length}
                </span>
              )}
              {cat === "All" && products && (
                <span className="ml-1.5 text-xs opacity-70">
                  {products.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-destructive">
              Failed to load products. Please try again.
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 space-y-2">
            <p className="text-muted-foreground text-lg">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((product) => (
              <Card
                key={product.id}
                className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col"
              >
                <Link to={`/product/${product.slug}`} className="block">
                  <div className="relative aspect-square overflow-hidden bg-white">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.title}
                        loading="lazy"
                        className="w-full h-full object-contain p-4 hover:scale-105 transition-transform duration-300"
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
                    <h3 className="font-semibold line-clamp-2 hover:text-primary transition-colors">
                      {product.title}
                    </h3>
                  </Link>
                  {product.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {product.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between pt-2 mt-auto">
                    <span className="text-xl font-bold">
                      ${parseFloat(product.price.toString()).toFixed(2)}
                    </span>
                    <span
                      className={`text-xs font-medium ${
                        product.in_stock
                          ? "text-green-600"
                          : "text-destructive"
                      }`}
                    >
                      {product.in_stock ? "In Stock" : "Out of Stock"}
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
                        title: "Added to cart",
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

      <footer className="border-t mt-20">
        <div className="container py-8 text-center text-muted-foreground">
          <p>© 2026 Felicia Tech. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
