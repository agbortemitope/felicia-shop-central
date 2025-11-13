import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/lib/shopify";
import { ProductCard } from "@/components/ProductCard";
import { Header } from "@/components/Header";
import { Loader2, Zap } from "lucide-react";

const Index = () => {
  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: () => fetchProducts(50),
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
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

      {/* Products Section */}
      <section className="container py-16">
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-2">Featured Products</h2>
          <p className="text-muted-foreground">Explore our latest collection of tech gadgets</p>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.node.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t mt-20">
        <div className="container py-8 text-center text-muted-foreground">
          <p>© 2025 Felicia Tech Gadgets. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
