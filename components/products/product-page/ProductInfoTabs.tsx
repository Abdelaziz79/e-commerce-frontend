// src/components/products/product-page/ProductInfoTabs.tsx
import { ReviewDialog } from "@/components/products/ReviewDialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Product } from "@/types/product";
import { Review } from "@/types/review";
import { RotateCw, ShieldCheck, Star, Truck } from "lucide-react";

interface ProductInfoTabsProps {
  product: Product;
  reviews: Review[];
}

export function ProductInfoTabs({ product, reviews }: ProductInfoTabsProps) {
  return (
    <Tabs defaultValue="description" className="w-full" id="reviews">
      <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 mb-6">
        <TabsTrigger value="description">Description</TabsTrigger>
        <TabsTrigger
          value="specifications"
          disabled={
            !product.attributes || Object.keys(product.attributes).length === 0
          }
        >
          Specifications
        </TabsTrigger>
        <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
        <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
      </TabsList>

      {/* Description Tab */}
      <TabsContent value="description">
        <Card>
          <CardContent className="pt-6">
            <div
              className="prose max-w-none prose-p:text-gray-700 prose-headings:text-gray-900"
              dangerouslySetInnerHTML={{
                __html:
                  product.richDescription || `<p>${product.description}</p>`,
              }}
            />
          </CardContent>
        </Card>
      </TabsContent>

      {/* Specifications Tab */}
      <TabsContent value="specifications">
        <Card>
          <CardHeader>
            <CardTitle>Technical Specifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
              {product.attributes &&
                Object.entries(product.attributes).map(([key, value]) => (
                  <div key={key} className="flex border-b border-gray-100 pb-3">
                    <span className="font-medium text-gray-800 w-1/3 capitalize">
                      {key.replace(/_/g, " ")}
                    </span>
                    <span className="text-gray-600">{value}</span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Reviews Tab */}
      <TabsContent value="reviews">
        <Card>
          <CardHeader>
            <CardTitle>Customer Reviews</CardTitle>
            <CardDescription>
              See what others have to say about this product.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {reviews.length > 0 ? (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div
                    key={review._id}
                    className="pb-6 border-b border-gray-100 last:border-0"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-800">
                        {review.user.name}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    {review.title && (
                      <h4 className="font-semibold text-gray-900 mb-1">
                        {review.title}
                      </h4>
                    )}
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {review.comment}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                There are no reviews for this product yet. Be the first to share
                your thoughts!
              </p>
            )}
            <div className="mt-8">
              <ReviewDialog productId={product._id}>
                <Button>Write a Review</Button>
              </ReviewDialog>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Shipping & Returns Tab */}
      <TabsContent value="shipping">
        <Card>
          <CardHeader>
            <CardTitle>Shipping & Returns</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <div>
              <h3 className="font-semibold text-lg mb-3 flex items-center">
                <Truck className="mr-2 h-5 w-5 text-gray-600" /> Shipping Policy
              </h3>
              <div className="prose prose-sm max-w-none text-gray-700">
                <p>
                  We are committed to delivering your products in a timely and
                  efficient manner.
                </p>
                <ul>
                  <li>
                    <strong>Standard Shipping:</strong> Free for orders over
                    $50. For orders under $50, a flat rate of $4.99 applies.
                    Delivery typically takes 3-5 business days.
                  </li>
                  <li>
                    <strong>Express Shipping:</strong> Available for a flat rate
                    of $12.99. Delivery typically takes 1-2 business days.
                  </li>
                  <li>
                    <strong>Processing Time:</strong> Most orders are processed
                    and shipped within 24-48 hours of placement.
                  </li>
                </ul>
                <p>
                  You will receive a shipping confirmation email with a tracking
                  number as soon as your order is dispatched.
                </p>
              </div>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold text-lg mb-3 flex items-center">
                <RotateCw className="mr-2 h-5 w-5 text-gray-600" /> Return
                Policy
              </h3>
              <div className="prose prose-sm max-w-none text-gray-700">
                <p>
                  Your satisfaction is our priority. If you&apos;re not
                  completely happy with your purchase, you can return it within{" "}
                  <strong>30 days</strong> of delivery.
                </p>
                <ul>
                  <li>
                    Items must be in new, unused condition with all original
                    packaging and tags attached.
                  </li>
                  <li>
                    To initiate a return, please visit our online returns center
                    or contact customer support.
                  </li>
                  <li>
                    Refunds will be processed to the original payment method
                    within 5-7 business days after we receive and inspect the
                    returned item.
                  </li>
                </ul>
              </div>
            </div>
            {product.warranty && (
              <>
                <Separator />
                <div>
                  <h3 className="font-semibold text-lg mb-3 flex items-center">
                    <ShieldCheck className="mr-2 h-5 w-5 text-gray-600" />{" "}
                    Warranty
                  </h3>
                  <p className="text-gray-700 leading-relaxed text-sm">
                    {product.warranty}
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
