// app/admin/stock/page.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import ErrorState from "@/components/shared/ErrorState";
import { LoadingDisplay } from "@/components/cart/LoadingDisplay";
import {
  useAdjustProductStock,
  useAdjustVariationStock,
} from "@/hooks/use-product-mutations";
import {
  useLowStockProducts,
  useOutOfStockProducts,
} from "@/hooks/use-product-queries";
import {
  AlertCircle,
  TrendingDown,
  Package,
  Zap,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { LowStockProduct, OutOfStockProduct } from "@/types/product";
import Link from "next/link";

interface StockAdjustmentDialogProps {
  productId: string;
  productName: string;
  currentStock: number;
  variationId?: string;
  variationSku?: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

function StockAdjustmentDialog({
  productId,
  productName,
  currentStock,
  variationId,
  variationSku,
  isOpen,
  onOpenChange,
}: StockAdjustmentDialogProps) {
  const [adjustment, setAdjustment] = useState("0");
  const [reason, setReason] = useState("");
  const { mutate: adjustStock, isPending } = useAdjustProductStock();
  const { mutate: adjustVariationStock, isPending: isVariationPending } =
    useAdjustVariationStock();

  const handleSubmit = () => {
    const adj = parseInt(adjustment);
    if (isNaN(adj) || adj === 0) {
      alert("Please enter a valid adjustment value");
      return;
    }

    const newStock = currentStock + adj;
    if (newStock < 0) {
      alert("Adjustment would result in negative stock");
      return;
    }

    if (variationId && variationSku) {
      adjustVariationStock(
        {
          productId,
          variationId,
          data: {
            adjustment: adj,
            reason: reason || undefined,
          },
        },
        {
          onSuccess: () => {
            setAdjustment("0");
            setReason("");
            onOpenChange(false);
          },
        }
      );
    } else {
      adjustStock(
        {
          productId,
          data: {
            adjustment: adj,
            reason: reason || undefined,
          },
        },
        {
          onSuccess: () => {
            setAdjustment("0");
            setReason("");
            onOpenChange(false);
          },
        }
      );
    }
  };

  const isPendingMutation = isPending || isVariationPending;
  const title = variationSku
    ? `Adjust Variation Stock: ${variationSku}`
    : "Adjust Stock";
  const subtitle = variationSku
    ? `For variation: ${variationSku}`
    : `For product: ${productName}`;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{subtitle}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label className="text-sm">Current Stock</Label>
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="font-semibold text-lg">{currentStock}</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="adjustment" className="text-sm">
              Adjustment Amount
            </Label>
            <Input
              id="adjustment"
              type="number"
              placeholder="e.g., 10 (add) or -5 (remove)"
              value={adjustment}
              onChange={(e) => setAdjustment(e.target.value)}
            />
            <p className="text-xs text-gray-500">
              New stock would be:{" "}
              <span className="font-semibold">
                {currentStock + (parseInt(adjustment) || 0)}
              </span>
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason" className="text-sm">
              Reason (Optional)
            </Label>
            <Input
              id="reason"
              placeholder="e.g., Restock received, Damage adjustment"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPendingMutation}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isPendingMutation}>
            {isPendingMutation ? "Adjusting..." : "Adjust Stock"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface VariationSelectorDialogProps {
  productId: string;
  productName: string;
  variations: Array<{ _id?: string; sku: string; countInStock: number }>;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (variationId: string, sku: string, stock: number) => void;
}

function VariationSelectorDialog({
  productId,
  productName,
  variations,
  isOpen,
  onOpenChange,
  onSelect,
}: VariationSelectorDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Select Variation to Adjust</DialogTitle>
          <DialogDescription>
            Choose which variation stock to adjust for {productName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 py-4 max-h-[400px] overflow-y-auto">
          {variations.map((variation) => (
            <Button
              key={variation._id || variation.sku}
              variant="outline"
              className="w-full justify-between h-auto py-3 px-4"
              onClick={() => {
                onSelect(
                  variation._id || variation.sku,
                  variation.sku,
                  variation.countInStock
                );
                onOpenChange(false);
              }}
            >
              <div className="text-left">
                <p className="font-medium">{variation.sku}</p>
                <p className="text-sm text-gray-500">
                  Current stock: {variation.countInStock}
                </p>
              </div>
              <Badge
                variant={
                  variation.countInStock === 0 ? "destructive" : "outline"
                }
              >
                {variation.countInStock}
              </Badge>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function LowStockTable({
  products,
  threshold,
}: {
  products: LowStockProduct[];
  threshold: number;
}) {
  const [selectedAdjustment, setSelectedAdjustment] = useState<{
    productId: string;
    productName: string;
    currentStock: number;
    variationId?: string;
    variationSku?: string;
  } | null>(null);

  const [variationSelectorState, setVariationSelectorState] = useState<{
    isOpen: boolean;
    productId: string;
    productName: string;
    variations: Array<{ _id?: string; sku: string; countInStock: number }>;
  }>({
    isOpen: false,
    productId: "",
    productName: "",
    variations: [],
  });

  const handleVariationSelect = (
    variationId: string,
    sku: string,
    stock: number
  ) => {
    setSelectedAdjustment({
      productId: variationSelectorState.productId,
      productName: variationSelectorState.productName,
      currentStock: stock,
      variationId,
      variationSku: sku,
    });
  };

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Package className="w-12 h-12 text-gray-300 mb-3" />
        <p className="text-gray-500">No low stock products found</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Main Stock</TableHead>
              <TableHead className="text-right">Status</TableHead>
              <TableHead>Variations</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => {
              const isCritical = product.countInStock <= threshold / 2;
              const categoryName =
                typeof product.category === "object" && product.category
                  ? product.category.name
                  : "—";

              return (
                <TableRow
                  key={product._id}
                  className={isCritical ? "bg-red-50/50" : ""}
                >
                  <TableCell>
                    <Link href={`/products/${product._id}`}>
                      <div className="flex items-start gap-2 hover:opacity-80 transition-opacity cursor-pointer">
                        {product.mainImage && (
                          <Image
                            src={product.mainImage}
                            alt={product.name}
                            width={32}
                            height={32}
                            className="rounded object-cover"
                          />
                        )}
                        <div>
                          <p className="font-medium text-sm">{product.name}</p>
                          <p className="text-xs text-gray-500">
                            {product.slug}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </TableCell>
                  <TableCell className="text-sm">{categoryName}</TableCell>
                  <TableCell className="text-right">
                    <span className="font-semibold">
                      {product.countInStock}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end">
                      <Badge
                        variant={isCritical ? "destructive" : "secondary"}
                        className="flex items-center gap-1"
                      >
                        {isCritical ? (
                          <AlertCircle className="w-3 h-3" />
                        ) : (
                          <TrendingDown className="w-3 h-3" />
                        )}
                        {isCritical ? "Critical" : "Low"}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    {product.hasVariations &&
                    product.lowStockVariations &&
                    product.lowStockVariations.length > 0 ? (
                      <div className="space-y-1">
                        <Badge
                          variant="outline"
                          className="text-xs flex items-center gap-1 w-fit"
                        >
                          <Zap className="w-2.5 h-2.5" />
                          {product.lowStockVariations.length} affected
                        </Badge>
                        <div className="text-xs text-gray-500 space-y-0.5">
                          {product.lowStockVariations
                            .slice(0, 2)
                            .map((v, idx) => (
                              <div key={v._id || v.sku || idx}>
                                <span className="font-medium">{v.sku}</span>:{" "}
                                {v.countInStock} left
                              </div>
                            ))}
                          {product.lowStockVariations.length > 2 && (
                            <div>
                              +{product.lowStockVariations.length - 2} more
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          setSelectedAdjustment({
                            productId: product._id,
                            productName: product.name,
                            currentStock: product.countInStock,
                          })
                        }
                      >
                        Main
                      </Button>
                      {product.lowStockVariations &&
                        product.lowStockVariations.length > 0 && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs"
                            onClick={() =>
                              setVariationSelectorState({
                                isOpen: true,
                                productId: product._id,
                                productName: product.name,
                                variations: product.lowStockVariations || [],
                              })
                            }
                          >
                            Var ({product.lowStockVariations.length})
                          </Button>
                        )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {selectedAdjustment && (
        <StockAdjustmentDialog
          productId={selectedAdjustment.productId}
          productName={selectedAdjustment.productName}
          currentStock={selectedAdjustment.currentStock}
          variationId={selectedAdjustment.variationId}
          variationSku={selectedAdjustment.variationSku}
          isOpen={!!selectedAdjustment}
          onOpenChange={(open) => !open && setSelectedAdjustment(null)}
        />
      )}

      {variationSelectorState.isOpen && (
        <VariationSelectorDialog
          productId={variationSelectorState.productId}
          productName={variationSelectorState.productName}
          variations={variationSelectorState.variations}
          isOpen={variationSelectorState.isOpen}
          onOpenChange={(open) =>
            setVariationSelectorState({
              ...variationSelectorState,
              isOpen: open,
            })
          }
          onSelect={handleVariationSelect}
        />
      )}
    </>
  );
}

function OutOfStockTable({ products }: { products: OutOfStockProduct[] }) {
  const [selectedAdjustment, setSelectedAdjustment] = useState<{
    productId: string;
    productName: string;
    currentStock: number;
    variationId?: string;
    variationSku?: string;
  } | null>(null);

  const [variationSelectorState, setVariationSelectorState] = useState<{
    isOpen: boolean;
    productId: string;
    productName: string;
    variations: Array<{ _id?: string; sku: string; countInStock: number }>;
  }>({
    isOpen: false,
    productId: "",
    productName: "",
    variations: [],
  });

  const handleVariationSelect = (
    variationId: string,
    sku: string,
    stock: number
  ) => {
    setSelectedAdjustment({
      productId: variationSelectorState.productId,
      productName: variationSelectorState.productName,
      currentStock: stock,
      variationId,
      variationSku: sku,
    });
  };

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Package className="w-12 h-12 text-green-300 mb-3" />
        <p className="text-gray-500">No out of stock products - Great job!</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Main Stock</TableHead>
              <TableHead className="text-right">Status</TableHead>
              <TableHead>Variations</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => {
              const categoryName =
                typeof product.category === "object" && product.category
                  ? product.category.name
                  : "—";

              const isCompletelyOutOfStock =
                product.stockSummary?.isCompletelyOutOfStock;

              return (
                <TableRow
                  key={product._id}
                  className={
                    isCompletelyOutOfStock ? "bg-red-100/50" : "bg-orange-50/30"
                  }
                >
                  <TableCell>
                    <Link href={`/products/${product._id}`}>
                      <div className="flex items-start gap-2 hover:opacity-80 transition-opacity cursor-pointer">
                        {product.mainImage && (
                          <Image
                            src={product.mainImage}
                            alt={product.name}
                            width={32}
                            height={32}
                            className="rounded object-cover"
                          />
                        )}
                        <div>
                          <p className="font-medium text-sm">{product.name}</p>
                          <p className="text-xs text-gray-500">
                            {product.slug}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </TableCell>
                  <TableCell className="text-sm">{categoryName}</TableCell>
                  <TableCell className="text-right">
                    <span className="font-semibold text-red-600">
                      {product.countInStock}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end">
                      <Badge
                        variant="destructive"
                        className="flex items-center gap-1"
                      >
                        <XCircle className="w-3 h-3" />
                        {isCompletelyOutOfStock
                          ? "Completely Out"
                          : "Out of Stock"}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    {product.hasVariations &&
                    product.outOfStockVariations &&
                    product.outOfStockVariations.length > 0 ? (
                      <div className="space-y-1">
                        <Badge
                          variant="destructive"
                          className="text-xs flex items-center gap-1 w-fit"
                        >
                          <AlertTriangle className="w-2.5 h-2.5" />
                          {product.outOfStockVariations.length} out of stock
                        </Badge>
                        {product.stockSummary?.inStockVariationCount > 0 && (
                          <p className="text-xs text-green-600">
                            {product.stockSummary.inStockVariationCount} still
                            available
                          </p>
                        )}
                        <div className="text-xs text-gray-500 space-y-0.5">
                          {product.outOfStockVariations
                            .slice(0, 2)
                            .map((v, idx) => (
                              <div key={v._id || v.sku || idx}>
                                <span className="font-medium">{v.sku}</span>:
                                Out
                              </div>
                            ))}
                          {product.outOfStockVariations.length > 2 && (
                            <div>
                              +{product.outOfStockVariations.length - 2} more
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">
                        No variations
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          setSelectedAdjustment({
                            productId: product._id,
                            productName: product.name,
                            currentStock: product.countInStock,
                          })
                        }
                      >
                        Restock Main
                      </Button>
                      {product.outOfStockVariations &&
                        product.outOfStockVariations.length > 0 && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs"
                            onClick={() =>
                              setVariationSelectorState({
                                isOpen: true,
                                productId: product._id,
                                productName: product.name,
                                variations: product.outOfStockVariations || [],
                              })
                            }
                          >
                            Var ({product.outOfStockVariations.length})
                          </Button>
                        )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {selectedAdjustment && (
        <StockAdjustmentDialog
          productId={selectedAdjustment.productId}
          productName={selectedAdjustment.productName}
          currentStock={selectedAdjustment.currentStock}
          variationId={selectedAdjustment.variationId}
          variationSku={selectedAdjustment.variationSku}
          isOpen={!!selectedAdjustment}
          onOpenChange={(open) => !open && setSelectedAdjustment(null)}
        />
      )}

      {variationSelectorState.isOpen && (
        <VariationSelectorDialog
          productId={variationSelectorState.productId}
          productName={variationSelectorState.productName}
          variations={variationSelectorState.variations}
          isOpen={variationSelectorState.isOpen}
          onOpenChange={(open) =>
            setVariationSelectorState({
              ...variationSelectorState,
              isOpen: open,
            })
          }
          onSelect={handleVariationSelect}
        />
      )}
    </>
  );
}

function StockSummary({
  lowStockStats,
  outOfStockStats,
}: {
  lowStockStats: {
    totalCount: number;
    mainStockCount: number;
    variationCount: number;
  };
  outOfStockStats: {
    totalCount: number;
    completelyOut: number;
    partiallyOut: number;
  };
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Low Stock</p>
              <p className="text-2xl font-bold text-yellow-600">
                {lowStockStats.totalCount}
              </p>
            </div>
            <TrendingDown className="w-8 h-8 text-yellow-500 opacity-20" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Out of Stock</p>
              <p className="text-2xl font-bold text-red-600">
                {outOfStockStats.totalCount}
              </p>
            </div>
            <XCircle className="w-8 h-8 text-red-500 opacity-20" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Completely Out</p>
              <p className="text-2xl font-bold text-red-700">
                {outOfStockStats.completelyOut}
              </p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-700 opacity-20" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Low Main Stock</p>
              <p className="text-2xl font-bold">
                {lowStockStats.mainStockCount}
              </p>
            </div>
            <AlertCircle className="w-8 h-8 text-orange-500 opacity-20" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Low Variations</p>
              <p className="text-2xl font-bold">
                {lowStockStats.variationCount}
              </p>
            </div>
            <Zap className="w-8 h-8 text-yellow-500 opacity-20" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StockPageContent() {
  const [threshold, setThreshold] = useState("10");
  const [activeTab, setActiveTab] = useState<"low" | "out">("low");

  const {
    data: lowStockData,
    isLoading: lowStockLoading,
    error: lowStockError,
  } = useLowStockProducts({
    threshold: parseInt(threshold),
  });

  const {
    data: outOfStockData,
    isLoading: outOfStockLoading,
    error: outOfStockError,
  } = useOutOfStockProducts();

  const lowStockStats = {
    totalCount: lowStockData?.results || 0,
    mainStockCount:
      lowStockData?.data?.filter((p) => p.mainProductLowStock).length || 0,
    variationCount:
      lowStockData?.data?.filter((p) => p.hasLowVariations).length || 0,
  };

  const outOfStockStats = {
    totalCount: outOfStockData?.results || 0,
    completelyOut:
      outOfStockData?.data?.filter(
        (p) => p.stockSummary?.isCompletelyOutOfStock
      ).length || 0,
    partiallyOut:
      outOfStockData?.data?.filter(
        (p) => !p.stockSummary?.isCompletelyOutOfStock
      ).length || 0,
  };

  if (lowStockLoading || outOfStockLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-12">
        <LoadingDisplay />
      </div>
    );
  }

  if (lowStockError || outOfStockError) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-12">
        <ErrorState
          error={lowStockError || outOfStockError}
          title="Failed to load stock data"
        />
      </div>
    );
  }

  return (
    <div className="flex-1 w-full bg-gray-50/50 pb-12">
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Stock Management</h1>
          <p className="text-gray-600 mt-2">
            Monitor and manage low stock and out of stock products
          </p>
        </div>

        {/* Summary Stats */}
        <StockSummary
          lowStockStats={lowStockStats}
          outOfStockStats={outOfStockStats}
        />

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as "low" | "out")}
        >
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="low" className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4" />
              Low Stock ({lowStockStats.totalCount})
            </TabsTrigger>
            <TabsTrigger value="out" className="flex items-center gap-2">
              <XCircle className="w-4 h-4" />
              Out of Stock ({outOfStockStats.totalCount})
            </TabsTrigger>
          </TabsList>

          {/* Low Stock Tab */}
          <TabsContent value="low" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Stock Threshold</CardTitle>
                  <Select value={threshold} onValueChange={setThreshold}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 units or less</SelectItem>
                      <SelectItem value="10">10 units or less</SelectItem>
                      <SelectItem value="20">20 units or less</SelectItem>
                      <SelectItem value="50">50 units or less</SelectItem>
                      <SelectItem value="100">100 units or less</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  Low Stock Products ({lowStockData?.results || 0} total)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <LowStockTable
                  products={lowStockData?.data || []}
                  threshold={parseInt(threshold)}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Out of Stock Tab */}
          <TabsContent value="out" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>
                  Out of Stock Products ({outOfStockData?.results || 0} total)
                </CardTitle>
                <p className="text-sm text-gray-500 mt-1">
                  {outOfStockStats.completelyOut} completely out of stock •{" "}
                  {outOfStockStats.partiallyOut} with some variations available
                </p>
              </CardHeader>
              <CardContent>
                <OutOfStockTable products={outOfStockData?.data || []} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default function StockPage() {
  return (
    <ProtectedRoute userType="admin">
      <StockPageContent />
    </ProtectedRoute>
  );
}
