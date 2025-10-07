// components/admin/orders/AddTrackingInfoDialog.tsx
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AddTrackingInfoData } from "@/types/order";
import { Loader2 } from "lucide-react";
import { useState } from "react";

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

  const handleConfirm = () => {
    if (carrier && trackingNumber) {
      onConfirm({ carrier, trackingNumber });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Shipping Information</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="carrier" className="text-right">
              Carrier
            </Label>
            <Input
              id="carrier"
              value={carrier}
              onChange={(e) => setCarrier(e.target.value)}
              className="col-span-3"
              placeholder="e.g., FedEx, UPS"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="trackingNumber" className="text-right">
              Tracking #
            </Label>
            <Input
              id="trackingNumber"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isPending || !carrier || !trackingNumber}
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Information
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
