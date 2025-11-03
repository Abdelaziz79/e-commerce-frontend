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
import { Loader2 } from "lucide-react";
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

  // Reset form when dialog closes
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Shipping Information</DialogTitle>
          <DialogDescription>
            Enter the carrier and tracking number for this order.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="carrier">
              Carrier <span className="text-red-500">*</span>
            </Label>
            <Input
              id="carrier"
              value={carrier}
              onChange={(e) => setCarrier(e.target.value)}
              placeholder="e.g., FedEx, UPS, USPS"
              disabled={isPending}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="trackingNumber">
              Tracking Number <span className="text-red-500">*</span>
            </Label>
            <Input
              id="trackingNumber"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="Enter tracking number"
              disabled={isPending}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="estimatedDeliveryDate">
              Estimated Delivery Date (Optional)
            </Label>
            <Input
              id="estimatedDeliveryDate"
              type="date"
              value={estimatedDeliveryDate}
              onChange={(e) => setEstimatedDeliveryDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              disabled={isPending}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={isPending || !isValid}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isPending ? "Saving..." : "Save Information"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
