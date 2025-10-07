// app/favorites/page.tsx
import FavoritesPage from "@/components/favorites/FavoritesPage";

export const metadata = {
  title: "My Wishlist | Your Store",
  description: "View and manage your favorite products",
};

export default function Page() {
  return <FavoritesPage />;
}
