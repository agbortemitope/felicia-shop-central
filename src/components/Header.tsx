import { Link } from "react-router-dom";
import { CartDrawer } from "./CartDrawer";
import { Smartphone } from "lucide-react";

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-lg bg-gradient-hero flex items-center justify-center">
            <Smartphone className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl">Felicia Tech</span>
        </Link>
        
        <div className="flex items-center gap-4">
          <CartDrawer />
        </div>
      </div>
    </header>
  );
};
