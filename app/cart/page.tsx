// app/cart/page.tsx
import CartPage from "@/components/cart/CartPage";

export const metadata = {
  title: "Shopping Cart | Your Store",
  description: "Review and manage your shopping cart",
};

export default function Page() {
  return <CartPage />;
}
