import { Link } from "react-router-dom";
import { CartDrawer } from "./CartDrawer";
import logo from "@/assets/felicia-tech-logo.png";

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
          <img src={logo} alt="Felicia Tech gadget online store logo" className="h-11 w-auto" />
        </Link>

        <div className="flex items-center gap-4">
          <CartDrawer />
        </div>
      </div>
    </header>
  );
};
