import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCartStore } from "@/stores/cartStore";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Loader2, Check } from "lucide-react";
import { Link } from "react-router-dom";

const Checkout = () => {
  const navigate = useNavigate();
  const { items, clearCart } = useCartStore();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
  });

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      toast({
        title: "Error",
        description: "Please enter your name",
      });
      return false;
    }

    if (!formData.email.trim() || !formData.email.includes("@")) {
      toast({
        title: "Error",
        description: "Please enter a valid email",
      });
      return false;
    }

    if (!formData.address.trim() || !formData.city.trim() || !formData.zip.trim()) {
      toast({
        title: "Error",
        description: "Please enter a complete address",
      });
      return false;
    }

    if (formData.cardNumber.replace(/\s/g, "").length < 13) {
      toast({
        title: "Error",
        description: "Please enter a valid card number",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);

      toast({
        title: "Order Placed Successfully",
        description: "Your order has been confirmed. Thank you for your purchase!",
      });

      setTimeout(() => {
        clearCart();
        navigate("/");
      }, 2000);
    }, 1500);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-16">
          <div className="text-center space-y-6">
            <h1 className="text-3xl font-bold">Checkout</h1>
            <p className="text-muted-foreground text-lg">Your cart is empty</p>
            <Link to="/">
              <Button size="lg">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-16">
          <div className="max-w-md mx-auto text-center space-y-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold">Order Confirmed!</h1>
            <p className="text-muted-foreground">
              Thank you for your purchase. You will receive a confirmation email shortly.
            </p>
            <div className="pt-6 space-y-3">
              <p className="text-sm text-muted-foreground">Redirecting to home page...</p>
              <Link to="/">
                <Button className="w-full">Back to Home</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container py-12">
        <div className="mb-8">
          <Link to="/cart">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Cart
            </Button>
          </Link>
        </div>

        <h1 className="text-4xl font-bold mb-12">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-6">Contact Information</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="John"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Doe"
                      required
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="john@example.com"
                    required
                  />
                </div>
                <div className="mt-4">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="text-xl font-bold mb-6">Shipping Address</h2>
                <div>
                  <Label htmlFor="address">Street Address</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="123 Main St"
                    required
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="New York"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      placeholder="NY"
                      required
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <Label htmlFor="zip">ZIP Code</Label>
                  <Input
                    id="zip"
                    name="zip"
                    value={formData.zip}
                    onChange={handleInputChange}
                    placeholder="10001"
                    required
                  />
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="text-xl font-bold mb-6">Payment Information</h2>
                <div>
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    placeholder="1234 5678 9012 3456"
                    required
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label htmlFor="cardExpiry">Expiry Date</Label>
                    <Input
                      id="cardExpiry"
                      name="cardExpiry"
                      value={formData.cardExpiry}
                      onChange={handleInputChange}
                      placeholder="MM/YY"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="cardCvc">CVC</Label>
                    <Input
                      id="cardCvc"
                      name="cardCvc"
                      value={formData.cardCvc}
                      onChange={handleInputChange}
                      placeholder="123"
                      required
                    />
                  </div>
                </div>
              </Card>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing Order...
                  </>
                ) : (
                  `Place Order - $${total.toFixed(2)}`
                )}
              </Button>
            </form>
          </div>

          <div>
            <Card className="p-6 sticky top-20">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {item.name} x {item.quantity}
                    </span>
                    <span className="font-medium">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-6 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between text-base font-bold pt-3 border-t">
                  <span>Total</span>
                  <span className="text-primary">${total.toFixed(2)}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
