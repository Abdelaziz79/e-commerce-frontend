"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  canCancelOrder,
  formatOrderStatus,
  useCancelOrder,
  useOrder,
} from "@/hooks/use-orders";
import { cn } from "@/lib/utils";
import { CartItem } from "@/types/cart";
import { OrderStatus } from "@/types/order";
import { Product } from "@/types/product";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
  DollarSign,
  Download,
  FileText,
  Loader2,
  Mail,
  MapPin,
  MessageSquare,
  Package,
  Phone,
  Tag,
  Truck,
  User,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

// Helper function to get status color
function getOrderStatusColor(status: string) {
  const statusColors: Record<string, string> = {
    pending: "text-yellow-600 bg-yellow-50",
    processing: "text-blue-600 bg-blue-50",
    shipped: "text-purple-600 bg-purple-50",
    delivered: "text-green-600 bg-green-50",
    cancelled: "text-red-600 bg-red-50",
    refunded: "text-orange-600 bg-orange-50",
    "on-hold": "text-gray-600 bg-gray-50",
    failed: "text-red-700 bg-red-100",
    completed: "text-emerald-600 bg-emerald-50",
  };

  return statusColors[status] || "text-gray-600 bg-gray-50";
}

// Helper function to extract product ID
function getProductId(product: Product | string): string {
  if (typeof product === "string") {
    return product;
  }
  if (product && typeof product === "object" && product._id) {
    return product._id;
  }
  return "";
}

// Helper function to format variation info
function formatVariationLabel(item: CartItem): string {
  if (!item.variation) return "";

  const parts = [];
  if (item.variation.style) parts.push(item.variation.style);
  if (item.variation.color) parts.push(item.variation.color);
  if (item.variation.size) parts.push(item.variation.size);
  if (item.variation.material) parts.push(item.variation.material);

  return parts.length > 0 ? parts.join(" - ") : "";
}

export default function OrderDetailsPage() {
  const params = useParams();
  const orderId = params.id as string;
  const { data, isLoading, error } = useOrder(orderId);
  const { mutate: cancelOrder, isPending: isCancelling } = useCancelOrder();
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const order = data?.data?.order;

  // Get the status color using the helper function
  const statusColorClass = order ? getOrderStatusColor(order.status) : "";

  const handleCancelConfirm = () => {
    if (!order) return;

    cancelOrder(
      { orderId: order._id, data: { reason: cancelReason } },
      {
        onSuccess: () => {
          setCancelDialogOpen(false);
          setCancelReason("");
        },
      }
    );
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return <Clock className="h-5 w-5" />;
      case "processing":
        return <Package className="h-5 w-5" />;
      case "shipped":
        return <Truck className="h-5 w-5" />;
      case "delivered":
      case "completed":
        return <CheckCircle className="h-5 w-5" />;
      case "cancelled":
      case "failed":
        return <XCircle className="h-5 w-5" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "processing":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "shipped":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "delivered":
      case "completed":
        return "bg-green-50 text-green-700 border-green-200";
      case "cancelled":
      case "failed":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-900 font-semibold">
            Loading order details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Order Not Found
          </h3>
          <p className="text-sm text-gray-600 mb-6">
            {error?.message || "We couldn't find the order you're looking for."}
          </p>
          <Button asChild className="rounded-none">
            <Link href="/orders">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Orders
            </Link>
          </Button>
        </Card>
      </div>
    );
  }

  const userName =
    typeof order.user === "object" ? order.user.name : "Customer";
  const userEmail = typeof order.user === "object" ? order.user.email : "";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <Button
            asChild
            variant="ghost"
            className="mb-4 -ml-4 text-gray-600 hover:text-gray-900"
          >
            <Link href="/orders">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Orders
            </Link>
          </Button>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-2">
                Order Details
              </h1>
              <p className="text-sm text-gray-600">Order {order.orderNumber}</p>
            </div>

            <Badge
              className={cn(
                statusColorClass,
                "rounded-none font-semibold px-4 py-2 text-sm uppercase tracking-wide self-start lg:self-center"
              )}
            >
              <span className="flex items-center gap-2">
                {getStatusIcon(order.status)}
                {formatOrderStatus(order.status)}
              </span>
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <Card className="bg-white border border-gray-200 rounded-none shadow-none">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-5">
                  <Package className="h-5 w-5 text-gray-600" />
                  <h2 className="text-lg font-bold text-gray-900">
                    Order Items
                  </h2>
                  <span className="ml-auto text-sm text-gray-500">
                    {order.orderItems.length}{" "}
                    {order.orderItems.length === 1 ? "item" : "items"}
                  </span>
                </div>

                <div className="space-y-4">
                  {order.orderItems.map((item, idx) => {
                    const productId = getProductId(item.product);
                    const variationLabel = formatVariationLabel(item);
                    const hasVariation = !!item.variation?.sku;

                    return (
                      <div key={idx}>
                        <Link
                          href={productId ? `/products/${productId}` : "#"}
                          className="flex items-start gap-4 group hover:bg-gray-50 p-3 -mx-3 rounded transition-colors"
                        >
                          <div className="relative w-24 h-24 bg-gray-50 flex items-center justify-center flex-shrink-0 border border-gray-200">
                            <Image
                              src={item.image || "/placeholder.png"}
                              alt={item.name}
                              width={96}
                              height={96}
                              className="object-contain p-2"
                            />
                            {hasVariation && (
                              <div className="absolute top-1 right-1 bg-blue-500 text-white p-1 rounded-sm">
                                <Tag className="h-3 w-3" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-base font-semibold text-gray-900 group-hover:text-gray-700 transition-colors mb-1">
                              {item.name}
                            </h3>

                            {/* Variation Badge */}
                            {hasVariation ? (
                              <div className="mb-3">
                                <div className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-200 px-2 py-1 rounded mb-2">
                                  <Tag className="h-3 w-3 text-blue-600" />
                                  <span className="text-xs font-semibold text-blue-700 uppercase">
                                    {variationLabel}
                                  </span>
                                </div>

                                {/* Variation Details */}
                                <div className="flex flex-wrap gap-2">
                                  {item.variation?.size && (
                                    <span className="text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                                      Size:{" "}
                                      <span className="font-medium">
                                        {item.variation.size}
                                      </span>
                                    </span>
                                  )}
                                  {item.variation?.color && (
                                    <span className="text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                                      Color:{" "}
                                      <span className="font-medium">
                                        {item.variation.color}
                                      </span>
                                    </span>
                                  )}
                                  {item.variation?.material && (
                                    <span className="text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                                      Material:{" "}
                                      <span className="font-medium">
                                        {item.variation.material}
                                      </span>
                                    </span>
                                  )}
                                  {item.variation?.style && (
                                    <span className="text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                                      Style:{" "}
                                      <span className="font-medium">
                                        {item.variation.style}
                                      </span>
                                    </span>
                                  )}
                                  {item.variation?.sku && (
                                    <span className="text-xs text-gray-500 bg-gray-50 px-2 py-0.5 rounded font-mono">
                                      SKU: {item.variation.sku}
                                    </span>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <div className="mb-2">
                                <span className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-2 py-0.5 rounded">
                                  <Package className="h-3 w-3" />
                                  Standard Product
                                </span>
                              </div>
                            )}

                            {/* Price and Quantity */}
                            <div className="flex items-center justify-between mt-3">
                              <span className="text-sm text-gray-600">
                                Quantity:{" "}
                                <span className="font-semibold text-gray-900">
                                  {item.quantity}
                                </span>
                              </span>
                              <div className="flex items-center gap-3">
                                <span className="text-sm text-gray-600">
                                  ${item.price.toFixed(2)} × {item.quantity}
                                </span>
                                <span className="text-base font-bold text-gray-900">
                                  ${(item.price * item.quantity).toFixed(2)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </Link>
                        {idx < order.orderItems.length - 1 && (
                          <Separator className="mt-4" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>

            {/* Order Timeline */}
            <Card className="bg-white border border-gray-200 rounded-none shadow-none">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-5">
                  <Clock className="h-5 w-5 text-gray-600" />
                  <h2 className="text-lg font-bold text-gray-900">
                    Order Timeline
                  </h2>
                </div>

                <div className="space-y-4">
                  {order.statusHistory.map((history, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center border-2",
                            getStatusColor(history.status)
                          )}
                        >
                          {getStatusIcon(history.status)}
                        </div>
                        {idx < order.statusHistory.length - 1 && (
                          <div className="w-0.5 h-12 bg-gray-200 my-1" />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="flex items-start justify-between mb-1">
                          <h3 className="font-semibold text-gray-900">
                            {formatOrderStatus(history.status)}
                          </h3>
                          <span className="text-xs text-gray-500">
                            {new Date(history.date).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </span>
                        </div>
                        {history.note && (
                          <p className="text-sm text-gray-600">
                            {history.note}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Tracking Information */}
            {order.shipping?.trackingNumber && (
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-none shadow-none">
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-blue-500 p-2 rounded-full">
                      <Truck className="h-5 w-5 text-white" />
                    </div>
                    <h2 className="text-lg font-bold text-blue-900">
                      Tracking Information
                    </h2>
                  </div>

                  <div className="space-y-3 bg-white p-4 rounded">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600">
                        Carrier
                      </span>
                      <span className="text-sm font-bold text-gray-900 uppercase">
                        {order.shipping.carrier}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600">
                        Tracking Number
                      </span>
                      <span className="text-sm font-mono font-bold text-blue-600">
                        {order.shipping.trackingNumber}
                      </span>
                    </div>
                    {order.shipping.estimatedDeliveryDate && (
                      <>
                        <Separator />
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-600">
                            Estimated Delivery
                          </span>
                          <span className="text-sm font-semibold text-gray-900">
                            {new Date(
                              order.shipping.estimatedDeliveryDate
                            ).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                      </>
                    )}
                    {order.shipping.shippedAt && (
                      <>
                        <Separator />
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-600">
                            Shipped On
                          </span>
                          <span className="text-sm font-semibold text-gray-900">
                            {new Date(
                              order.shipping.shippedAt
                            ).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </Card>
            )}

            {/* Customer Notes */}
            {order.notes && (
              <Card className="bg-amber-50 border border-amber-200 rounded-none shadow-none">
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <MessageSquare className="h-5 w-5 text-amber-600" />
                    <h2 className="text-base font-bold text-amber-900">
                      Customer Notes
                    </h2>
                  </div>
                  <p className="text-sm text-amber-800 leading-relaxed">
                    {order.notes}
                  </p>
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <Card className="bg-white border border-gray-200 rounded-none shadow-none sticky top-6">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-5">
                  <FileText className="h-5 w-5 text-gray-600" />
                  <h2 className="text-lg font-bold text-gray-900">
                    Order Summary
                  </h2>
                </div>

                <div className="space-y-3 mb-5">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Item(s) Price</span>
                    <span className="font-semibold text-gray-900">
                      ${order.itemsPrice.toFixed(2)}
                    </span>
                  </div>
                  {order.shippingPrice > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-semibold text-gray-900">
                        ${order.shippingPrice.toFixed(2)}
                      </span>
                    </div>
                  )}
                  {order.taxPrice > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tax</span>
                      <span className="font-semibold text-gray-900">
                        ${order.taxPrice.toFixed(2)}
                      </span>
                    </div>
                  )}
                  {order.discountAmount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600">Discount</span>
                      <span className="font-semibold text-green-600">
                        -${order.discountAmount.toFixed(2)}
                      </span>
                    </div>
                  )}
                  <Separator className="my-3" />
                  <div className="flex justify-between text-base">
                    <span className="font-bold text-gray-900">Total</span>
                    <span className="font-bold text-gray-900 text-xl">
                      ${order.totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div
                  className={cn(
                    "p-3 rounded mb-5",
                    order.isPaid
                      ? "bg-green-50 border border-green-200"
                      : "bg-orange-50 border border-orange-200"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <CreditCard
                      className={cn(
                        "h-4 w-4",
                        order.isPaid ? "text-green-600" : "text-orange-600"
                      )}
                    />
                    <span
                      className={cn(
                        "text-sm font-semibold",
                        order.isPaid ? "text-green-700" : "text-orange-700"
                      )}
                    >
                      {order.isPaid ? "Payment Completed" : "Payment Pending"}
                    </span>
                  </div>
                  {order.isPaid && order.paidAt && (
                    <p className="text-xs text-green-600 mt-1 ml-6">
                      Paid on{" "}
                      {new Date(order.paidAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  {canCancelOrder(order) && (
                    <Button
                      variant="outline"
                      onClick={() => setCancelDialogOpen(true)}
                      className="w-full rounded-none text-red-600 border-red-300 hover:bg-red-50 hover:text-red-700"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Cancel Order
                    </Button>
                  )}
                  {order.invoiceUrl && (
                    <Button
                      asChild
                      variant="outline"
                      className="w-full rounded-none"
                    >
                      <a href={order.invoiceUrl} download>
                        <Download className="h-4 w-4 mr-2" />
                        Download Invoice
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </Card>

            {/* Customer Information */}
            <Card className="bg-white border border-gray-200 rounded-none shadow-none">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-5">
                  <User className="h-5 w-5 text-gray-600" />
                  <h2 className="text-lg font-bold text-gray-900">Customer</h2>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-900 font-medium">
                      {userName}
                    </span>
                  </div>
                  {userEmail && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">{userEmail}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">
                      Ordered on{" "}
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Shipping Address */}
            <Card className="bg-white border border-gray-200 rounded-none shadow-none">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="h-5 w-5 text-gray-600" />
                  <h2 className="text-lg font-bold text-gray-900">
                    Shipping Address
                  </h2>
                </div>

                <div className="text-sm text-gray-700 space-y-1 leading-relaxed">
                  <p className="font-medium text-gray-900">
                    {order.shippingAddress.address}
                  </p>
                  <p>
                    {order.shippingAddress.city},{" "}
                    {order.shippingAddress.postalCode}
                  </p>
                  <p>{order.shippingAddress.country}</p>
                  {order.shippingAddress.phoneNumber && (
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">
                        {order.shippingAddress.phoneNumber}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Payment Method */}
            <Card className="bg-white border border-gray-200 rounded-none shadow-none">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard className="h-5 w-5 text-gray-600" />
                  <h2 className="text-lg font-bold text-gray-900">
                    Payment Method
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-900 uppercase">
                    {order.paymentMethod}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Cancel Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Cancel Order
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-600">
              Are you sure you want to cancel order{" "}
              <span className="font-semibold text-gray-900">
                {order.orderNumber}
              </span>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reason" className="text-sm font-medium">
                Reason for cancellation{" "}
                <span className="text-gray-400 font-normal">(optional)</span>
              </Label>
              <Textarea
                id="reason"
                placeholder="Let us know why you're cancelling this order..."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                rows={4}
                className="resize-none text-sm"
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => {
                setCancelDialogOpen(false);
                setCancelReason("");
              }}
              disabled={isCancelling}
              className="rounded-none"
            >
              Keep Order
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelConfirm}
              disabled={isCancelling}
              className="rounded-none"
            >
              {isCancelling ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Cancelling...
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 mr-2" />
                  Cancel Order
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
