// components/orders/CancelOrderDialog.tsx
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Order } from "@/types/order";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

interface CancelOrderDialogProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmCancel: (reason: string) => void;
  isPending: boolean;
}

export function CancelOrderDialog({
  order,
  isOpen,
  onClose,
  onConfirmCancel,
  isPending,
}: CancelOrderDialogProps) {
  const [cancelReason, setCancelReason] = useState("");

  useEffect(() => {
    // Reset reason when dialog is closed/reopened
    if (!isOpen) {
      setCancelReason("");
    }
  }, [isOpen]);

  if (!order) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cancel Order</DialogTitle>
          <DialogDescription>
            Are you sure you want to cancel order #{order.orderNumber}? This
            action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 py-4">
          <Label htmlFor="reason">Cancellation Reason (Optional)</Label>
          <Textarea
            id="reason"
            placeholder="e.g., Ordered by mistake"
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Keep Order
          </Button>
          <Button
            variant="destructive"
            onClick={() => onConfirmCancel(cancelReason)}
            disabled={isPending}
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isPending ? "Cancelling..." : "Confirm Cancellation"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
