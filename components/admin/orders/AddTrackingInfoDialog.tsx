// components/admin/orders/AddTrackingInfoDialog.tsx
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AddTrackingInfoData } from "@/types/order";
import { Loader2, Truck, Hash, Calendar, Package } from "lucide-react";
import { useEffect, useState } from "react";

interface AddTrackingInfoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: AddTrackingInfoData) => void;
  isPending: boolean;
}

export function AddTrackingInfoDialog({
  isOpen,
  onClose,
  onConfirm,
  isPending,
}: AddTrackingInfoDialogProps) {
  const [carrier, setCarrier] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [estimatedDeliveryDate, setEstimatedDeliveryDate] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setCarrier("");
      setTrackingNumber("");
      setEstimatedDeliveryDate("");
    }
  }, [isOpen]);

  const handleConfirm = () => {
    if (carrier.trim() && trackingNumber.trim()) {
      onConfirm({
        carrier: carrier.trim(),
        trackingNumber: trackingNumber.trim(),
        estimatedDeliveryDate: estimatedDeliveryDate || undefined,
      });
    }
  };

  const isValid = carrier.trim() && trackingNumber.trim();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md rounded-xl border-gray-200 shadow-lg">
        <DialogHeader className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gray-900 rounded-lg">
              <Truck className="h-4 w-4 text-white" />
            </div>
            <DialogTitle className="text-xl font-semibold text-gray-900">
              Add Shipping Information
            </DialogTitle>
          </div>
          <DialogDescription className="text-sm text-gray-600">
            Enter tracking details to keep your customer informed about their
            order.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label
              htmlFor="carrier"
              className="text-sm font-medium text-gray-900"
            >
              Carrier <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Package className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="carrier"
                value={carrier}
                onChange={(e) => setCarrier(e.target.value)}
                placeholder="e.g., FedEx, UPS, USPS"
                className="pl-10 h-10 border-gray-200 rounded-lg focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
                disabled={isPending}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="trackingNumber"
              className="text-sm font-medium text-gray-900"
            >
              Tracking Number <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="trackingNumber"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Enter tracking number"
                className="pl-10 h-10 border-gray-200 rounded-lg focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
                disabled={isPending}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="estimatedDeliveryDate"
              className="text-sm font-medium text-gray-900"
            >
              Estimated Delivery Date{" "}
              <span className="text-gray-500 text-xs">(Optional)</span>
            </Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="estimatedDeliveryDate"
                type="date"
                value={estimatedDeliveryDate}
                onChange={(e) => setEstimatedDeliveryDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="pl-10 h-10 border-gray-200 rounded-lg focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
                disabled={isPending}
              />
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isPending}
            className="flex-1 h-10 rounded-lg border-gray-200 hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isPending || !isValid}
            className="flex-1 h-10 rounded-lg bg-gray-900 hover:bg-gray-800"
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isPending ? "Saving..." : "Save Information"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
