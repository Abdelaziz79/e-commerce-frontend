import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-full max-w-md space-y-8">
        <div className="relative">
          <div className="text-9xl font-bold text-gray-200">404</div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-3xl font-bold text-gray-800">Oops!</div>
          </div>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mt-8">
          Page Not Found
        </h1>

        <p className="text-lg text-gray-600 mt-4">
          We couldn&apos;t find the page you&apos;re looking for. It might have
          been moved or deleted.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Button
            asChild
            variant="default"
            size="lg"
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Link href="/">Back to Home</Link>
          </Button>

          <Button asChild variant="outline" size="lg">
            <Link href="/products">Browse Products</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
