import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/lib/supabase";
import { Header } from "@/components/Header";
import { Loader2, Zap, Search, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

type SortKey = "newest" | "price-asc" | "price-desc" | "name";

const Index = () => {
  const { data: products, isLoading, error } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  const { addItem } = useCartStore();
  const { toast } = useToast();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState<SortKey>("newest");
  const [inStockOnly, setInStockOnly] = useState(false);

  const maxPrice = useMemo(() => {
    if (!products?.length) return 1000;
    return Math.ceil(Math.max(...products.map((p) => Number(p.price))) / 50) * 50;
  }, [products]);

  const [priceRange, setPriceRange] = useState<[number, number] | null>(null);
  const range: [number, number] = priceRange ?? [0, maxPrice];

  const categories = useMemo(() => {
    const set = new Set((products || []).map((p) => p.category).filter(Boolean) as string[]);
    return Array.from(set).sort();
  }, [products]);

  const filtered = useMemo(() => {
    let list = (products || []).filter((p) => {
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        (p.description || "").toLowerCase().includes(q) ||
        (p.category || "").toLowerCase().includes(q);
      const matchesCategory = category === "all" || p.category === category;
      const price = Number(p.price);
      const matchesPrice = price >= range[0] && price <= range[1];
      const matchesStock = !inStockOnly || p.in_stock;
      return matchesSearch && matchesCategory && matchesPrice && matchesStock;
    });

    list = [...list].sort((a, b) => {
      switch (sort) {
        case "price-asc":
          return Number(a.price) - Number(b.price);
        case "price-desc":
          return Number(b.price) - Number(a.price);
        case "name":
          return a.title.localeCompare(b.title);
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

    return list;
  }, [products, search, category, range, inStockOnly, sort]);

  const filtersActive =
    search.trim() !== "" ||
    category !== "all" ||
    inStockOnly ||
    range[0] !== 0 ||
    range[1] !== maxPrice;

  const resetFilters = () => {
    setSearch("");
    setCategory("all");
    setInStockOnly(false);
    setPriceRange(null);
    setSort("newest");
  };

  return (
    <div className="min-h-screen bg-background" data-lovable-id="app-container">
      <Header />

      <section className="relative overflow-hidden" data-lovable-id="hero-section">
        <div className="absolute inset-0 bg-gradient-hero opacity-10" />
        <div className="container relative py-20 md:py-28">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Zap className="w-4 h-4" />
              Latest Phones & Gadgets
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Felicia Tech{" "}
              <span className="bg-gradient-hero bg-clip-text text-transparent">
                Gadget Online Store
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Genuine smartphones and rugged devices, delivered fast. Search the catalogue
              and filter by category or budget.
            </p>
          </div>
        </div>
      </section>

      <section className="container py-12" data-lovable-id="products-section">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Shop all products</h2>
          <p className="text-muted-foreground">Find your next device faster.</p>
        </div>

        {/* Filter bar */}
        <div className="rounded-xl border bg-card p-4 md:p-5 mb-8 space-y-4" data-lovable-id="filter-bar">
          <div className="grid gap-4 md:grid-cols-[1fr_auto_auto]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="pl-9"
                aria-label="Search products"
              />
            </div>

            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="md:w-[190px]" aria-label="Filter by category">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
              <SelectTrigger className="md:w-[190px]" aria-label="Sort products">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price-asc">Price: low to high</SelectItem>
                <SelectItem value="price-desc">Price: high to low</SelectItem>
                <SelectItem value="name">Name A–Z</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
            <div className="max-w-md">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-muted-foreground">Price range</span>
                <span className="font-medium">
                  ${range[0]} – ${range[1]}
                </span>
              </div>
              <Slider
                value={range}
                min={0}
                max={maxPrice}
                step={10}
                onValueChange={(v) => setPriceRange([v[0], v[1]] as [number, number])}
                aria-label="Price range"
              />
            </div>

            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant={inStockOnly ? "default" : "outline"}
                size="sm"
                onClick={() => setInStockOnly((v) => !v)}
              >
                In stock only
              </Button>
              {filtersActive && (
                <Button type="button" variant="ghost" size="sm" onClick={resetFilters}>
                  <X className="w-4 h-4 mr-1" /> Clear
                </Button>
              )}
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-destructive">Failed to load products. Please try again.</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground mb-4">
              {filtered.length} {filtered.length === 1 ? "product" : "products"}
            </p>

            {filtered.length === 0 ? (
              <div className="text-center py-20 space-y-4">
                <p className="text-muted-foreground text-lg">No products match your filters</p>
                <Button variant="outline" onClick={resetFilters}>
                  Clear filters
                </Button>
              </div>
            ) : (
              <div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                data-lovable-id="products-grid"
              >
                {filtered.map((product) => (
                  <Card
                    key={product.id}
                    className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col"
                    data-lovable-id={`product-card-${product.id}`}
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
                        <Badge variant="secondary" className="w-fit">
                          {product.category}
                        </Badge>
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
                          ${Number(product.price).toFixed(2)}
                        </span>
                        <span
                          className={`text-xs font-medium ${
                            product.in_stock ? "text-primary" : "text-destructive"
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
                            price: Number(product.price),
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
          </>
        )}
      </section>

      <footer className="border-t mt-20" data-lovable-id="footer">
        <div className="container py-8 text-center text-muted-foreground">
          <p>© 2026 Felicia Tech Gadget Online Store. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
