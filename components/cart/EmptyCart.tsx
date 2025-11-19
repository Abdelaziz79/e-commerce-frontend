// components/cart/EmptyCart.tsx
import { Button } from "@/components/ui/button";
import { ShoppingBag, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export function EmptyCart() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="text-center max-w-lg">
        <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 mb-8 shadow-sm">
          <ShoppingBag className="h-11 w-11 text-slate-400" strokeWidth={1.5} />
          <div className="absolute -top-1 -right-1">
            <Sparkles className="h-5 w-5 text-slate-300" />
          </div>
        </div>

        <h2 className="text-3xl font-bold text-slate-900 mb-3">
          Your cart is empty
        </h2>
        <p className="text-slate-500 text-lg mb-10 leading-relaxed">
          Discover amazing products and start adding your favorites to your
          cart.
        </p>

        <Button
          size="lg"
          className="gap-2 h-12 px-8 text-base shadow-sm hover:shadow-md transition-shadow"
          asChild
        >
          <Link href="/products">
            Browse Products
            <ArrowRight className="h-5 w-5" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
