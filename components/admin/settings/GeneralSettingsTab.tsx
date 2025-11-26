// components/admin/settings/GeneralSettingsTab.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  useAdminSettings,
  useToggleShippingEnabled,
  useToggleTaxEnabled,
  useUpdateGeneralSettings,
} from "@/hooks/use-admin-settings-hooks";
import { UpdateGeneralSettingsData } from "@/types/adminSettings";
import { Loader2, Settings, Store } from "lucide-react";
import { useEffect, useState } from "react";

export function GeneralSettingsTab() {
  const { data: settingsData, isLoading } = useAdminSettings();
  const updateSettings = useUpdateGeneralSettings();
  const toggleTax = useToggleTaxEnabled();
  const toggleShipping = useToggleShippingEnabled();

  const [formData, setFormData] = useState<UpdateGeneralSettingsData>({
    storeName: "",
    storeEmail: "",
    storeCurrency: "",
    storeTimezone: "",
    orderPrefix: "",
    minimumOrderAmount: 0,
    maximumOrderAmount: undefined,
    allowGuestCheckout: false,
    orderNotificationEmail: "",
    sendOrderConfirmation: true,
    sendShippingNotification: true,
    maintenanceMode: false,
    maintenanceMessage: "",
  });

  useEffect(() => {
    if (settingsData?.data) {
      const settings = settingsData.data;
      setFormData({
        storeName: settings.storeName,
        storeEmail: settings.storeEmail || "",
        storeCurrency: settings.storeCurrency,
        storeTimezone: settings.storeTimezone,
        orderPrefix: settings.orderPrefix,
        minimumOrderAmount: settings.minimumOrderAmount,
        maximumOrderAmount: settings.maximumOrderAmount,
        allowGuestCheckout: settings.allowGuestCheckout,
        orderNotificationEmail: settings.orderNotificationEmail || "",
        sendOrderConfirmation: settings.sendOrderConfirmation,
        sendShippingNotification: settings.sendShippingNotification,
        maintenanceMode: settings.maintenanceMode,
        maintenanceMessage: settings.maintenanceMessage,
      });
    }
  }, [settingsData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettings.mutateAsync(formData);
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
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Store Information */}
      <Card className="border border-gray-200 shadow-sm rounded-none">
        <CardHeader className="border-b border-gray-200">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold text-gray-900">
            <Store className="h-4 w-4 text-gray-500" />
            Store Information
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label
                htmlFor="storeName"
                className="text-xs font-medium text-gray-700"
              >
                Store Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="storeName"
                value={formData.storeName}
                onChange={(e) =>
                  setFormData({ ...formData, storeName: e.target.value })
                }
                placeholder="My Store"
                className="h-9 text-sm border-gray-200 rounded-none"
                required
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="storeEmail"
                className="text-xs font-medium text-gray-700"
              >
                Store Email
              </Label>
              <Input
                id="storeEmail"
                type="email"
                value={formData.storeEmail}
                onChange={(e) =>
                  setFormData({ ...formData, storeEmail: e.target.value })
                }
                placeholder="store@example.com"
                className="h-9 text-sm border-gray-200 rounded-none"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="storeCurrency"
                className="text-xs font-medium text-gray-700"
              >
                Currency <span className="text-red-500">*</span>
              </Label>
              <Input
                id="storeCurrency"
                value={formData.storeCurrency}
                onChange={(e) =>
                  setFormData({ ...formData, storeCurrency: e.target.value })
                }
                placeholder="USD"
                className="h-9 text-sm border-gray-200 rounded-none"
                maxLength={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="storeTimezone"
                className="text-xs font-medium text-gray-700"
              >
                Timezone
              </Label>
              <Input
                id="storeTimezone"
                value={formData.storeTimezone}
                onChange={(e) =>
                  setFormData({ ...formData, storeTimezone: e.target.value })
                }
                placeholder="UTC"
                className="h-9 text-sm border-gray-200 rounded-none"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order Settings */}
      <Card className="border border-gray-200 shadow-sm rounded-none">
        <CardHeader className="border-b border-gray-200">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold text-gray-900">
            <Settings className="h-4 w-4 text-gray-500" />
            Order Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label
                htmlFor="orderPrefix"
                className="text-xs font-medium text-gray-700"
              >
                Order Prefix
              </Label>
              <Input
                id="orderPrefix"
                value={formData.orderPrefix}
                onChange={(e) =>
                  setFormData({ ...formData, orderPrefix: e.target.value })
                }
                placeholder="ORD"
                className="h-9 text-sm border-gray-200 rounded-none"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="minimumOrderAmount"
                className="text-xs font-medium text-gray-700"
              >
                Minimum Order Amount
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                  $
                </span>
                <Input
                  id="minimumOrderAmount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.minimumOrderAmount}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      minimumOrderAmount: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder="0.00"
                  className="pl-7 h-9 text-sm border-gray-200 rounded-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="maximumOrderAmount"
                className="text-xs font-medium text-gray-700"
              >
                Maximum Order Amount{" "}
                <span className="text-gray-400 text-xs">(Optional)</span>
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                  $
                </span>
                <Input
                  id="maximumOrderAmount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.maximumOrderAmount || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      maximumOrderAmount: e.target.value
                        ? parseFloat(e.target.value)
                        : undefined,
                    })
                  }
                  placeholder="No limit"
                  className="pl-7 h-9 text-sm border-gray-200 rounded-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="orderNotificationEmail"
                className="text-xs font-medium text-gray-700"
              >
                Order Notification Email
              </Label>
              <Input
                id="orderNotificationEmail"
                type="email"
                value={formData.orderNotificationEmail}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    orderNotificationEmail: e.target.value,
                  })
                }
                placeholder="orders@example.com"
                className="h-9 text-sm border-gray-200 rounded-none"
              />
            </div>
          </div>

          <div className="space-y-3 pt-3 border-t border-gray-200">
            <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200">
              <div>
                <Label
                  htmlFor="allowGuestCheckout"
                  className="text-xs font-medium text-gray-900 cursor-pointer"
                >
                  Allow Guest Checkout
                </Label>
                <p className="text-xs text-gray-500">
                  Let customers checkout without an account
                </p>
              </div>
              <Switch
                id="allowGuestCheckout"
                checked={formData.allowGuestCheckout}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, allowGuestCheckout: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200">
              <div>
                <Label
                  htmlFor="sendOrderConfirmation"
                  className="text-xs font-medium text-gray-900 cursor-pointer"
                >
                  Send Order Confirmation
                </Label>
                <p className="text-xs text-gray-500">
                  Email customers when order is placed
                </p>
              </div>
              <Switch
                id="sendOrderConfirmation"
                checked={formData.sendOrderConfirmation}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, sendOrderConfirmation: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200">
              <div>
                <Label
                  htmlFor="sendShippingNotification"
                  className="text-xs font-medium text-gray-900 cursor-pointer"
                >
                  Send Shipping Notification
                </Label>
                <p className="text-xs text-gray-500">
                  Email customers when order ships
                </p>
              </div>
              <Switch
                id="sendShippingNotification"
                checked={formData.sendShippingNotification}
                onCheckedChange={(checked) =>
                  setFormData({
                    ...formData,
                    sendShippingNotification: checked,
                  })
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feature Toggles */}
      <Card className="border border-gray-200 shadow-sm rounded-none">
        <CardHeader className="border-b border-gray-200">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold text-gray-900">
            <Settings className="h-4 w-4 text-gray-500" />
            Feature Toggles
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5 space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200">
            <div>
              <p className="text-xs font-medium text-gray-900">
                Tax Calculation
              </p>
              <p className="text-xs text-gray-500">Calculate taxes on orders</p>
            </div>
            <Button
              type="button"
              variant={settings.taxEnabled ? "default" : "outline"}
              size="sm"
              onClick={() => toggleTax.mutate()}
              disabled={toggleTax.isPending}
              className="rounded-none"
            >
              {toggleTax.isPending ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : settings.taxEnabled ? (
                "Enabled"
              ) : (
                "Disabled"
              )}
            </Button>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200">
            <div>
              <p className="text-xs font-medium text-gray-900">Shipping</p>
              <p className="text-xs text-gray-500">
                Enable shipping calculations
              </p>
            </div>
            <Button
              type="button"
              variant={settings.shippingEnabled ? "default" : "outline"}
              size="sm"
              onClick={() => toggleShipping.mutate()}
              disabled={toggleShipping.isPending}
              className="rounded-none"
            >
              {toggleShipping.isPending ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : settings.shippingEnabled ? (
                "Enabled"
              ) : (
                "Disabled"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Maintenance Mode */}
      <Card className="border border-gray-200 shadow-sm rounded-none">
        <CardHeader className="border-b border-gray-200">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold text-gray-900">
            <Settings className="h-4 w-4 text-gray-500" />
            Maintenance Mode
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5 space-y-5">
          <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200">
            <div>
              <Label
                htmlFor="maintenanceMode"
                className="text-xs font-medium text-gray-900 cursor-pointer"
              >
                Maintenance Mode
              </Label>
              <p className="text-xs text-gray-500">
                Temporarily disable the store
              </p>
            </div>
            <Switch
              id="maintenanceMode"
              checked={formData.maintenanceMode}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, maintenanceMode: checked })
              }
            />
          </div>

          {formData.maintenanceMode && (
            <div className="space-y-2 p-4 bg-white border border-gray-200">
              <Label
                htmlFor="maintenanceMessage"
                className="text-xs font-medium text-gray-700"
              >
                Maintenance Message
              </Label>
              <Input
                id="maintenanceMessage"
                value={formData.maintenanceMessage}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    maintenanceMessage: e.target.value,
                  })
                }
                placeholder="We'll be back soon!"
                className="h-9 text-sm border-gray-200 rounded-none"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end gap-2 pt-4">
        <Button
          type="submit"
          disabled={updateSettings.isPending}
          className="rounded-none"
        >
          {updateSettings.isPending ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </form>
  );
}
