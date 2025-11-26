// components/admin/settings/ShippingRatesTab.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useAdminSettings,
  useDeleteShippingRate,
} from "@/hooks/use-admin-settings-hooks";
import { ShippingRate } from "@/types/adminSettings";
import { Edit, Loader2, Plus, Trash2, Truck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ShippingRateModal } from "./ShippingRateModal";

export function ShippingRatesTab() {
  const { data: settingsData, isLoading } = useAdminSettings();
  const deleteMutation = useDeleteShippingRate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingShippingRate, setEditingShippingRate] =
    useState<ShippingRate | null>(null);

  const handleOpenModal = (shippingRate: ShippingRate | null = null) => {
    setEditingShippingRate(shippingRate);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingShippingRate(null);
  };

  const handleDelete = async (
    shippingRateId: string,
    shippingRateName: string
  ) => {
    const confirmed = await new Promise<boolean>((resolve) => {
      toast(`Delete shipping rate "${shippingRateName}"?`, {
        description: "This action cannot be undone.",
        action: {
          label: "Delete",
          onClick: () => resolve(true),
        },
        cancel: {
          label: "Cancel",
          onClick: () => resolve(false),
        },
      });
    });

    if (confirmed) {
      await deleteMutation.mutateAsync(shippingRateId);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  const settings = settingsData?.data;
  if (!settings) return null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Shipping Rates
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Configure shipping methods and costs (
            {settings.shippingRates.length} total)
          </p>
        </div>
        <Button
          onClick={() => handleOpenModal(null)}
          className="gap-2 rounded-none"
        >
          <Plus className="h-4 w-4" />
          Add Shipping Rate
        </Button>
      </div>

      {/* Free Shipping Info */}
      {settings.freeShippingEnabled && (
        <Card className="border border-blue-200 bg-blue-50 shadow-sm rounded-none">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Truck className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-blue-900">
                  Free Shipping Enabled
                </p>
                <p className="text-xs text-blue-700">
                  Orders over ${settings.freeShippingThreshold.toFixed(2)} ship
                  free
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {settings.shippingRates.length === 0 ? (
        <Card className="border border-gray-200 shadow-sm rounded-none">
          <CardContent className="py-12 text-center">
            <Truck className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm font-medium text-gray-600 mb-1">
              No shipping rates configured
            </p>
            <p className="text-xs text-gray-500 mb-4">
              Add your first shipping rate to enable shipping
            </p>
            <Button
              onClick={() => handleOpenModal(null)}
              variant="outline"
              className="rounded-none"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Shipping Rate
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {settings.shippingRates.map((rate) => (
            <Card
              key={rate._id}
              className="border border-gray-200 shadow-sm rounded-none"
            >
              <CardHeader className="border-b border-gray-200">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2 text-base">
                      {rate.name}
                      {!rate.isActive && (
                        <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-none font-normal">
                          Inactive
                        </span>
                      )}
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-none font-normal capitalize">
                        {rate.type}
                      </span>
                    </CardTitle>
                    {rate.description && (
                      <p className="text-xs text-gray-500">
                        {rate.description}
                      </p>
                    )}
                  </div>
                  {rate.type === "flat" && rate.flatRate !== undefined && (
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">
                        ${rate.flatRate.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500">Flat Rate</p>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-5">
                <div className="space-y-4">
                  {/* Flat Rate Details */}
                  {rate.type === "flat" && (
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">
                          Shipping Cost
                        </p>
                        <p className="font-medium text-gray-900">
                          ${rate.flatRate?.toFixed(2)}
                        </p>
                      </div>
                      {rate.freeShippingThreshold && (
                        <div>
                          <p className="text-xs text-gray-500 mb-1">
                            Free Shipping Over
                          </p>
                          <p className="font-medium text-gray-900">
                            ${rate.freeShippingThreshold.toFixed(2)}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Weight-Based Details */}
                  {rate.type === "weight-based" &&
                    rate.weightRanges &&
                    rate.weightRanges.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-gray-700 mb-2">
                          Weight Ranges
                        </p>
                        <div className="space-y-2">
                          {rate.weightRanges.map((range, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between p-2 bg-gray-50 border border-gray-200 text-xs"
                            >
                              <span className="text-gray-600">
                                {range.minWeight} - {range.maxWeight} kg
                              </span>
                              <span className="font-semibold text-gray-900">
                                ${range.rate.toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Price-Based Details */}
                  {rate.type === "price-based" &&
                    rate.priceRanges &&
                    rate.priceRanges.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-gray-700 mb-2">
                          Price Ranges
                        </p>
                        <div className="space-y-2">
                          {rate.priceRanges.map((range, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between p-2 bg-gray-50 border border-gray-200 text-xs"
                            >
                              <span className="text-gray-600">
                                ${range.minPrice.toFixed(2)} - $
                                {range.maxPrice.toFixed(2)}
                              </span>
                              <span className="font-semibold text-gray-900">
                                ${range.rate.toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                </div>

                <div className="flex gap-2 pt-4 border-t border-gray-200 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenModal(rate)}
                    className="rounded-none"
                  >
                    <Edit className="h-3 w-3 mr-1.5" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(rate._id, rate.name)}
                    disabled={deleteMutation.isPending}
                    className="rounded-none"
                  >
                    {deleteMutation.isPending ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <>
                        <Trash2 className="h-3 w-3 mr-1.5" />
                        Delete
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {isModalOpen && (
        <ShippingRateModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          editingShippingRate={editingShippingRate}
        />
      )}
    </div>
  );
}
