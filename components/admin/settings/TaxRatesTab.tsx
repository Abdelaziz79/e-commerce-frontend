// components/admin/settings/TaxRatesTab.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useAdminSettings,
  useDeleteTaxRate,
} from "@/hooks/use-admin-settings-hooks";
import { TaxRate } from "@/types/adminSettings";
import { DollarSign, Edit, Loader2, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { TaxRateModal } from "./TaxRateModal";

export function TaxRatesTab() {
  const { data: settingsData, isLoading } = useAdminSettings();
  const deleteMutation = useDeleteTaxRate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTaxRate, setEditingTaxRate] = useState<TaxRate | null>(null);

  const handleOpenModal = (taxRate: TaxRate | null = null) => {
    setEditingTaxRate(taxRate);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTaxRate(null);
  };

  const handleDelete = async (taxRateId: string, taxRateName: string) => {
    const confirmed = await new Promise<boolean>((resolve) => {
      toast(`Delete tax rate "${taxRateName}"?`, {
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
      await deleteMutation.mutateAsync(taxRateId);
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
          <h3 className="text-lg font-semibold text-gray-900">Tax Rates</h3>
          <p className="text-sm text-gray-500 mt-1">
            Manage location-based tax rates ({settings.taxRates.length} total)
          </p>
        </div>
        <Button
          onClick={() => handleOpenModal(null)}
          className="gap-2 rounded-none"
        >
          <Plus className="h-4 w-4" />
          Add Tax Rate
        </Button>
      </div>

      {settings.taxRates.length === 0 ? (
        <Card className="border border-gray-200 shadow-sm rounded-none">
          <CardContent className="py-12 text-center">
            <DollarSign className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm font-medium text-gray-600 mb-1">
              No tax rates configured
            </p>
            <p className="text-xs text-gray-500 mb-4">
              Add your first tax rate to start calculating taxes
            </p>
            <Button
              onClick={() => handleOpenModal(null)}
              variant="outline"
              className="rounded-none"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Tax Rate
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {settings.taxRates.map((taxRate) => (
            <Card
              key={taxRate._id}
              className="border border-gray-200 shadow-sm rounded-none"
            >
              <CardHeader className="border-b border-gray-200">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2 text-base">
                      {taxRate.name}
                      {taxRate.isDefault && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-none font-normal">
                          Default
                        </span>
                      )}
                      {!taxRate.isActive && (
                        <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-none font-normal">
                          Inactive
                        </span>
                      )}
                    </CardTitle>
                    {taxRate.description && (
                      <p className="text-xs text-gray-500">
                        {taxRate.description}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">
                      {taxRate.rate}%
                    </p>
                    <p className="text-xs text-gray-500">Tax Rate</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-5">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                  {taxRate.country && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Country</p>
                      <p className="font-medium text-gray-900">
                        {taxRate.country}
                      </p>
                    </div>
                  )}
                  {taxRate.state && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">State</p>
                      <p className="font-medium text-gray-900">
                        {taxRate.state}
                      </p>
                    </div>
                  )}
                  {taxRate.city && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">City</p>
                      <p className="font-medium text-gray-900">
                        {taxRate.city}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Priority</p>
                    <p className="font-medium text-gray-900">
                      {taxRate.priority}
                    </p>
                  </div>
                  {taxRate.postalCodes && taxRate.postalCodes.length > 0 && (
                    <div className="col-span-2 md:col-span-4">
                      <p className="text-xs text-gray-500 mb-1">Postal Codes</p>
                      <p className="font-medium text-gray-900">
                        {taxRate.postalCodes.join(", ")}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-4 border-t border-gray-200">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenModal(taxRate)}
                    className="rounded-none"
                  >
                    <Edit className="h-3 w-3 mr-1.5" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(taxRate._id, taxRate.name)}
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
        <TaxRateModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          editingTaxRate={editingTaxRate}
        />
      )}
    </div>
  );
}
