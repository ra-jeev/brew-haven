import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cartStore";
import { useFeatureFlags } from "@/stores/featureFlags";

interface LayoutProps {
  children: React.ReactNode;
}

function CartButton() {
  const items = useCartStore((state) => state.items);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Button
      variant="link"
      asChild
      className="h-auto w-auto p-0 text-muted-foreground hover:text-foreground"
    >
      <Link to="/checkout" className="relative">
        <ShoppingBag className="!h-6 !w-6" />
        {itemCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-coffee dark:bg-coffee-light text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {itemCount}
          </span>
        )}
      </Link>
    </Button>
  );
}

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className="text-muted-foreground hover:text-foreground transition-colors"
    >
      {children}
    </Link>
  );
}

export default function Layout({ children }: LayoutProps) {
  const { showPromotionalBanner } = useFeatureFlags();

  return (
    <div className="min-h-screen bg-background text-foreground ">
      {showPromotionalBanner && (
        <div className="bg-coffee-light text-cream-light p-2 text-center ">
          🎉 Special Offer: Get 20% off on all seasonal drinks! 🎉
        </div>
      )}

      <header className="border-b ">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            to="/"
            className="text-2xl font-bold text-coffee dark:text-cream"
          >
            ☕ Brew Haven
          </Link>

          <nav className="flex items-center gap-6">
            <NavLink to="/menu">Menu</NavLink>
            <NavLink to="/orders">Orders</NavLink>
            <NavLink to="/admin">Admin</NavLink>
            <CartButton />
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">{children}</main>

      <footer className="border-t mt-auto">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between text-muted-foreground">
          <p>© 2024 Coffee Haven. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
