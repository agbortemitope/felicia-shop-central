import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { fetchProductByHandle } from "@/lib/shopify";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";
import { Loader2, ShoppingCart, ArrowLeft, Check } from "lucide-react";
import { useState } from "react";

const ProductDetail = () => {
  const { handle } = useParams<{ handle: string }>();
  const addItem = useCartStore(state => state.addItem);
  const [selectedVariantId, setSelectedVariantId] = useState<string>("");
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', handle],
    queryFn: () => fetchProductByHandle(handle!),
    enabled: !!handle,
  });

  const handleAddToCart = () => {
    if (!product) return;

    const variant = product.variants.edges.find(
      (v: { node: { id: string } }) => v.node.id === selectedVariantId
    )?.node || product.variants.edges[0]?.node;

    if (!variant) return;

    const cartItem = {
      product: { node: product },
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions || []
    };
    
    addItem(cartItem);
    toast.success('Added to cart', {
      description: `${product.title} has been added to your cart`,
    });
  };

  const handleOptionChange = (optionName: string, value: string) => {
    const newOptions = { ...selectedOptions, [optionName]: value };
    setSelectedOptions(newOptions);

    const matchingVariant = product?.variants.edges.find((v: { node: { selectedOptions: Array<{ name: string; value: string }> } }) => {
      return v.node.selectedOptions.every((opt) =>
        newOptions[opt.name] === opt.value
      );
    });

    if (matchingVariant) {
      setSelectedVariantId(matchingVariant.node.id);
    }
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

  const image = product.images.edges[0]?.node;
  const price = parseFloat(product.priceRange.minVariantPrice.amount);
  const currency = product.priceRange.minVariantPrice.currencyCode;
  const selectedVariant = product.variants.edges.find((v: { node: { id: string } }) => v.node.id === selectedVariantId)?.node
    || product.variants.edges[0]?.node;

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
            {image ? (
              <img
                src={image.url}
                alt={image.altText || product.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                No image available
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold mb-4">{product.title}</h1>
              <p className="text-3xl font-bold text-primary">
                {currency} {price.toFixed(2)}
              </p>
            </div>

            {product.description && (
              <div>
                <h2 className="text-lg font-semibold mb-2">Description</h2>
                <p className="text-muted-foreground">{product.description}</p>
              </div>
            )}

            {/* Options */}
            {product.options && product.options.length > 0 && (
              <div className="space-y-4">
                {product.options.map((option: { name: string; values: string[] }) => (
                  option.values.length > 1 && (
                    <div key={option.name}>
                      <h3 className="text-sm font-semibold mb-2">{option.name}</h3>
                      <div className="flex flex-wrap gap-2">
                        {option.values.map((value: string) => (
                          <Button
                            key={value}
                            variant={selectedOptions[option.name] === value ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleOptionChange(option.name, value)}
                            className="relative"
                          >
                            {value}
                            {selectedOptions[option.name] === value && (
                              <Check className="w-3 h-3 ml-2" />
                            )}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )
                ))}
              </div>
            )}

            {/* Availability */}
            {selectedVariant && (
              <Badge variant={selectedVariant.availableForSale ? "default" : "secondary"}>
                {selectedVariant.availableForSale ? "In Stock" : "Out of Stock"}
              </Badge>
            )}

            {/* Add to Cart */}
            <Button 
              onClick={handleAddToCart}
              size="lg"
              className="w-full md:w-auto"
              disabled={!selectedVariant?.availableForSale}
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
