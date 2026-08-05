import { Link } from "react-router-dom";
import { CartDrawer } from "./CartDrawer";
import logo from "@/assets/felicia-tech-logo.jpg";

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" data-lovable-id="header">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity" data-lovable-id="logo">
          <img src={logo} alt="Felicia Tech Gadget Online Store logo" className="h-10 w-auto rounded" />
          <span className="font-bold text-lg hidden sm:inline">Felicia Tech</span>
        </Link>

        <div className="flex items-center gap-4">
          <CartDrawer />
        </div>
      </div>
    </header>
  );
};
