// components/users/admin/UserRowActions.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  useBanUser,
  useSuspendUser,
  useUnbanUser,
  useUpdateUserRole,
} from "@/hooks/use-admin-mutations";
import { AdminUser } from "@/types/admin";
import { Ban, Eye, MoreHorizontal, Pause, Shield, Unlock } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface UserRowActionsProps {
  user: AdminUser;
}

export function UserRowActions({ user }: UserRowActionsProps) {
  const banUserMutation = useBanUser();
  const suspendUserMutation = useSuspendUser();
  const unbanUserMutation = useUnbanUser();
  const updateRoleMutation = useUpdateUserRole();

  const [showBanDialog, setShowBanDialog] = useState(false);
  const [showSuspendDialog, setShowSuspendDialog] = useState(false);
  const [banReason, setBanReason] = useState("");
  const [suspendReason, setSuspendReason] = useState("");

  // Fix: Remove pointer-events: none when dialog closes
  useEffect(() => {
    if (!showBanDialog && !showSuspendDialog) {
      // Small delay to ensure dialog animation completes
      const timer = setTimeout(() => {
        document.body.style.pointerEvents = "";
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [showBanDialog, showSuspendDialog]);

  const handleBan = () => {
    banUserMutation.mutate(
      {
        userId: user._id,
        data: { reason: banReason || "Banned by admin" },
      },
      {
        onSuccess: () => {
          setShowBanDialog(false);
          setBanReason("");
          // Ensure body style is reset
          document.body.style.pointerEvents = "";
        },
        onError: () => {
          // Also reset on error
          document.body.style.pointerEvents = "";
        },
      }
    );
  };

  const handleSuspend = () => {
    suspendUserMutation.mutate(
      {
        userId: user._id,
        data: { reason: suspendReason || "Suspended by admin" },
      },
      {
        onSuccess: () => {
          setShowSuspendDialog(false);
          setSuspendReason("");
          // Ensure body style is reset
          document.body.style.pointerEvents = "";
        },
        onError: () => {
          // Also reset on error
          document.body.style.pointerEvents = "";
        },
      }
    );
  };

  const handleUnban = () => {
    unbanUserMutation.mutate(user._id, {
      onSettled: () => {
        document.body.style.pointerEvents = "";
      },
    });
  };

  const handleMakeAdmin = () => {
    toast("Make admin?", {
      description: `${user.name} will have admin privileges.`,
      action: {
        label: "Confirm",
        onClick: () =>
          updateRoleMutation.mutate({
            userId: user._id,
            data: { role: "admin" },
          }),
      },
      cancel: { label: "Cancel", onClick: () => toast.dismiss() },
    });
  };

  const handleRemoveAdmin = () => {
    toast("Remove admin status?", {
      description: `${user.name} will no longer have admin privileges.`,
      action: {
        label: "Confirm",
        onClick: () =>
          updateRoleMutation.mutate({
            userId: user._id,
            data: { role: "user" },
          }),
      },
      cancel: { label: "Cancel", onClick: () => toast.dismiss() },
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem asChild>
            <Link href={`/admin/users/${user._id}`} className="cursor-pointer">
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </Link>
          </DropdownMenuItem>

          {user.status === "active" && (
            <>
              <DropdownMenuSeparator />
              {user.role === "user" ? (
                <DropdownMenuItem onClick={handleMakeAdmin}>
                  <Shield className="mr-2 h-4 w-4" />
                  Make Admin
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem onClick={handleRemoveAdmin}>
                  <Shield className="mr-2 h-4 w-4" />
                  Remove Admin
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={() => setShowSuspendDialog(true)}
                className="text-yellow-600"
              >
                <Pause className="mr-2 h-4 w-4" />
                Suspend User
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setShowBanDialog(true)}
                className="text-red-600"
              >
                <Ban className="mr-2 h-4 w-4" />
                Ban User
              </DropdownMenuItem>
            </>
          )}

          {(user.status === "banned" || user.status === "suspended") && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleUnban}
                className="text-green-600"
              >
                <Unlock className="mr-2 h-4 w-4" />
                Unban User
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Ban Dialog */}
      <Dialog open={showBanDialog} onOpenChange={setShowBanDialog}>
        <DialogContent
          onCloseAutoFocus={() => {
            document.body.style.pointerEvents = "";
          }}
        >
          <DialogHeader>
            <DialogTitle>Ban User</DialogTitle>
            <DialogDescription>
              {user.name} will be permanently banned. This can be reversed
              later.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="ban-reason-row">Reason (Optional)</Label>
              <Textarea
                id="ban-reason-row"
                placeholder="Enter the reason for banning..."
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowBanDialog(false);
                document.body.style.pointerEvents = "";
              }}
              disabled={banUserMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleBan}
              disabled={banUserMutation.isPending}
            >
              {banUserMutation.isPending ? "Banning..." : "Ban User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Suspend Dialog */}
      <Dialog open={showSuspendDialog} onOpenChange={setShowSuspendDialog}>
        <DialogContent
          onCloseAutoFocus={() => {
            document.body.style.pointerEvents = "";
          }}
        >
          <DialogHeader>
            <DialogTitle>Suspend User</DialogTitle>
            <DialogDescription>
              {user.name} will be temporarily suspended. This can be reversed at
              any time.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="suspend-reason-row">Reason (Optional)</Label>
              <Textarea
                id="suspend-reason-row"
                placeholder="Enter the reason for suspending..."
                value={suspendReason}
                onChange={(e) => setSuspendReason(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowSuspendDialog(false);
                document.body.style.pointerEvents = "";
              }}
              disabled={suspendUserMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSuspend}
              disabled={suspendUserMutation.isPending}
              className="bg-yellow-600 hover:bg-yellow-700"
            >
              {suspendUserMutation.isPending ? "Suspending..." : "Suspend User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
