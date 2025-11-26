// components/admin/settings/DiscountCodesTab.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useAdminSettings,
  useDeleteDiscountCode,
} from "@/hooks/use-admin-settings-hooks";
import { DiscountCode } from "@/types/adminSettings";
import { Calendar, Edit, Loader2, Plus, Tag, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { DiscountCodeModal } from "./DiscountCodeModal";

export function DiscountCodesTab() {
  const { data: settingsData, isLoading } = useAdminSettings();
  const deleteMutation = useDeleteDiscountCode();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDiscountCode, setEditingDiscountCode] =
    useState<DiscountCode | null>(null);

  const handleOpenModal = (discountCode: DiscountCode | null = null) => {
    setEditingDiscountCode(discountCode);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingDiscountCode(null);
  };

  const handleDelete = async (
    discountCodeId: string,
    discountCodeCode: string
  ) => {
    const confirmed = await new Promise<boolean>((resolve) => {
      toast(`Delete discount code "${discountCodeCode}"?`, {
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
      await deleteMutation.mutateAsync(discountCodeId);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const isExpired = (validUntil: string) => {
    return new Date(validUntil) < new Date();
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

  const activeDiscounts = settings.discountCodes.filter(
    (code) => code.isActive && !isExpired(code.validUntil)
  );
  const inactiveDiscounts = settings.discountCodes.filter(
    (code) => !code.isActive || isExpired(code.validUntil)
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Discount Codes
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Manage promotional discount codes ({settings.discountCodes.length}{" "}
            total, {activeDiscounts.length} active)
          </p>
        </div>
        <Button
          onClick={() => handleOpenModal(null)}
          className="gap-2 rounded-none"
        >
          <Plus className="h-4 w-4" />
          Add Discount Code
        </Button>
      </div>

      {settings.discountCodes.length === 0 ? (
        <Card className="border border-gray-200 shadow-sm rounded-none">
          <CardContent className="py-12 text-center">
            <Tag className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm font-medium text-gray-600 mb-1">
              No discount codes configured
            </p>
            <p className="text-xs text-gray-500 mb-4">
              Create promotional codes to offer discounts to customers
            </p>
            <Button
              onClick={() => handleOpenModal(null)}
              variant="outline"
              className="rounded-none"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Discount Code
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Active Discount Codes */}
          {activeDiscounts.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-gray-900">
                Active Codes ({activeDiscounts.length})
              </h4>
              <div className="grid gap-4">
                {activeDiscounts.map((code) => (
                  <DiscountCodeCard
                    key={code._id}
                    code={code}
                    onEdit={handleOpenModal}
                    onDelete={handleDelete}
                    isDeleting={deleteMutation.isPending}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Inactive/Expired Discount Codes */}
          {inactiveDiscounts.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-gray-900">
                Inactive/Expired Codes ({inactiveDiscounts.length})
              </h4>
              <div className="grid gap-4">
                {inactiveDiscounts.map((code) => (
                  <DiscountCodeCard
                    key={code._id}
                    code={code}
                    onEdit={handleOpenModal}
                    onDelete={handleDelete}
                    isDeleting={deleteMutation.isPending}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {isModalOpen && (
        <DiscountCodeModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          editingDiscountCode={editingDiscountCode}
        />
      )}
    </div>
  );
}

// Discount Code Card Component
interface DiscountCodeCardProps {
  code: DiscountCode;
  onEdit: (code: DiscountCode) => void;
  onDelete: (id: string, code: string) => void;
  isDeleting: boolean;
}

function DiscountCodeCard({
  code,
  onEdit,
  onDelete,
  isDeleting,
}: DiscountCodeCardProps) {
  const applicable =
    code.applicableCategories?.length ||
    code.applicableProducts?.length ||
    code.excludedCategories?.length ||
    code.excludedProducts?.length;

  const isExpired = new Date(code.validUntil) < new Date();
  const usagePercentage = code.usageLimit
    ? (code.usageCount / code.usageLimit) * 100
    : 0;

  return (
    <Card className="border border-gray-200 shadow-sm rounded-none">
      <CardHeader className="border-b border-gray-200">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-base">
              <code className="bg-gray-900 text-white px-3 py-1 rounded-none font-mono text-sm">
                {code.code}
              </code>
              {!code.isActive && (
                <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-none font-normal">
                  Inactive
                </span>
              )}
              {isExpired && (
                <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-none font-normal">
                  Expired
                </span>
              )}
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-none font-normal capitalize">
                {code.type}
              </span>
            </CardTitle>
            {code.description && (
              <p className="text-xs text-gray-500">{code.description}</p>
            )}
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900">
              {code.type === "percentage"
                ? `${code.value}%`
                : `$${code.value.toFixed(2)}`}
            </p>
            <p className="text-xs text-gray-500">Discount</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-5">
        <div className="space-y-4">
          {/* Discount Details */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-xs text-gray-500 mb-1">Min Order</p>
              <p className="font-medium text-gray-900">
                ${code.minOrderAmount.toFixed(2)}
              </p>
            </div>
            {code.maxDiscountAmount && (
              <div>
                <p className="text-xs text-gray-500 mb-1">Max Discount</p>
                <p className="font-medium text-gray-900">
                  ${code.maxDiscountAmount.toFixed(2)}
                </p>
              </div>
            )}
            <div>
              <p className="text-xs text-gray-500 mb-1">Usage</p>
              <p className="font-medium text-gray-900">
                {code.usageCount}
                {code.usageLimit ? ` / ${code.usageLimit}` : " (Unlimited)"}
              </p>
            </div>
            {code.perUserLimit && (
              <div>
                <p className="text-xs text-gray-500 mb-1">Per User</p>
                <p className="font-medium text-gray-900">
                  {code.perUserLimit} uses
                </p>
              </div>
            )}
          </div>

          {/* Usage Progress */}
          {code.usageLimit && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-gray-600">
                <span>Usage Progress</span>
                <span>{usagePercentage.toFixed(0)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-none h-2">
                <div
                  className={`h-2 rounded-none transition-all ${
                    usagePercentage >= 100
                      ? "bg-red-500"
                      : usagePercentage >= 75
                      ? "bg-yellow-500"
                      : "bg-green-500"
                  }`}
                  style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                />
              </div>
            </div>
          )}

          {/* Date Range */}
          <div className="flex items-center gap-4 text-xs text-gray-600 pt-2 border-t border-gray-200">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>Valid from:</span>
              <span className="font-medium text-gray-900">
                {new Date(code.validFrom).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span>until:</span>
              <span className="font-medium text-gray-900">
                {new Date(code.validUntil).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Applicable Items */}
          {applicable !== 0 && (
            <div className="space-y-2 p-3 bg-gray-50 border border-gray-200 text-xs">
              {code.applicableCategories &&
                code.applicableCategories.length > 0 && (
                  <div>
                    <span className="font-medium text-gray-700">
                      Applicable Categories:{" "}
                    </span>
                    <span className="text-gray-600">
                      {code.applicableCategories.length} categories
                    </span>
                  </div>
                )}
              {code.applicableProducts &&
                code.applicableProducts.length > 0 && (
                  <div>
                    <span className="font-medium text-gray-700">
                      Applicable Products:{" "}
                    </span>
                    <span className="text-gray-600">
                      {code.applicableProducts.length} products
                    </span>
                  </div>
                )}
              {code.excludedCategories &&
                code.excludedCategories.length > 0 && (
                  <div>
                    <span className="font-medium text-gray-700">
                      Excluded Categories:{" "}
                    </span>
                    <span className="text-gray-600">
                      {code.excludedCategories.length} categories
                    </span>
                  </div>
                )}
              {code.excludedProducts && code.excludedProducts.length > 0 && (
                <div>
                  <span className="font-medium text-gray-700">
                    Excluded Products:{" "}
                  </span>
                  <span className="text-gray-600">
                    {code.excludedProducts.length} products
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t border-gray-200">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(code)}
              className="rounded-none"
            >
              <Edit className="h-3 w-3 mr-1.5" />
              Edit
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(code._id, code.code)}
              disabled={isDeleting}
              className="rounded-none"
            >
              {isDeleting ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <>
                  <Trash2 className="h-3 w-3 mr-1.5" />
                  Delete
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
