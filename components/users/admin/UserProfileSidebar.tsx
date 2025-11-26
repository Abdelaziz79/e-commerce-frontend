// components/users/admin/UserProfileSidebar.tsx
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  useBanUser,
  useSuspendUser,
  useUnbanUser,
  useUpdateUserRole,
} from "@/hooks/use-admin-mutations";
import { getImageSrc } from "@/lib/utils";
import { AdminUser } from "@/types/admin";
import {
  Ban,
  Copy,
  Pause,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Unlock,
} from "lucide-react";
import { toast } from "sonner";
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
import { useEffect, useState } from "react";

interface UserProfileSidebarProps {
  user: AdminUser;
}

export function UserProfileSidebar({ user }: UserProfileSidebarProps) {
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

  const isBanned = user.status === "banned";
  const isSuspended = user.status === "suspended";
  const isRestricted = isBanned || isSuspended;
  const isAdmin = user.role === "admin";

  const copyId = () => {
    navigator.clipboard.writeText(user._id);
    toast.success("User ID copied to clipboard");
  };

  // --- Handlers ---
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

  const handleRoleToggle = () => {
    const newRole = isAdmin ? "user" : "admin";
    const action = isAdmin ? "Remove Admin" : "Make Admin";
    toast(`${action}?`, {
      description: isAdmin
        ? "This user will lose dashboard access."
        : "This user will gain full system control.",
      action: {
        label: "Confirm",
        onClick: () =>
          updateRoleMutation.mutate({
            userId: user._id,
            data: { role: newRole },
          }),
      },
      cancel: { label: "Cancel", onClick: () => toast.dismiss() },
    });
  };

  return (
    <>
      <Card className="overflow-hidden border-border/60 shadow-sm">
        <CardHeader className="text-center pb-0 pt-8">
          <div className="mx-auto relative">
            <Avatar className="h-28 w-28 border-4 border-white shadow-lg mx-auto">
              <AvatarImage
                src={getImageSrc(user.avatar)}
                className="object-cover"
              />
              <AvatarFallback className="text-3xl bg-muted text-muted-foreground">
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {isAdmin && (
              <div className="absolute bottom-1 right-1 bg-blue-600 text-white p-1.5 rounded-full shadow-sm border-2 border-white">
                <ShieldCheck className="h-4 w-4" />
              </div>
            )}
          </div>

          <div className="mt-4 space-y-1">
            <h2 className="text-xl font-bold text-foreground">{user.name}</h2>
            <p className="text-sm text-muted-foreground font-medium">
              {user.email}
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 mt-4">
            <Badge
              variant={isRestricted ? "destructive" : "secondary"}
              className="capitalize px-3 py-1"
            >
              {user.status}
            </Badge>
            {user.isEmailVerified && (
              <Badge
                variant="outline"
                className="border-emerald-200 text-emerald-700 bg-emerald-50"
              >
                Verified
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="pt-8">
          <div className="flex items-center justify-between p-3 bg-muted/40 rounded-lg border border-border/50">
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                User ID
              </span>
              <p className="text-xs font-mono text-foreground truncate max-w-[150px]">
                {user._id}
              </p>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    onClick={copyId}
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Copy ID</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardContent>

        <Separator />

        <CardFooter className="flex flex-col gap-3 pt-6 bg-muted/10">
          <p className="text-xs font-medium text-muted-foreground self-start mb-1">
            Administrative Actions
          </p>

          <Button
            variant="outline"
            className="w-full justify-start h-10 border-border/60 hover:bg-muted/50"
            onClick={handleRoleToggle}
            disabled={updateRoleMutation.isPending}
          >
            {isAdmin ? (
              <>
                <ShieldAlert className="mr-2 h-4 w-4 text-orange-500" />
                Revoke Admin Access
              </>
            ) : (
              <>
                <Shield className="mr-2 h-4 w-4 text-blue-500" />
                Promote to Admin
              </>
            )}
          </Button>

          {isRestricted ? (
            <Button
              variant="outline"
              className="w-full justify-start h-10 border-emerald-200 text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50"
              onClick={handleUnban}
              disabled={unbanUserMutation.isPending}
            >
              <Unlock className="mr-2 h-4 w-4" />
              {unbanUserMutation.isPending ? "Unbanning..." : "Unban Account"}
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                className="w-full justify-start h-10 border-yellow-200 text-yellow-700 hover:text-yellow-800 hover:bg-yellow-50"
                onClick={() => setShowSuspendDialog(true)}
                disabled={suspendUserMutation.isPending || isAdmin}
              >
                <Pause className="mr-2 h-4 w-4" />
                Suspend Account
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start h-10 border-red-200 text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => setShowBanDialog(true)}
                disabled={banUserMutation.isPending || isAdmin}
              >
                <Ban className="mr-2 h-4 w-4" />
                Ban Account
              </Button>
            </>
          )}
        </CardFooter>
      </Card>

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
              {user.name} will be permanently banned from accessing the
              platform. This action can be reversed later.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="ban-reason">Reason (Optional)</Label>
              <Textarea
                id="ban-reason"
                placeholder="Enter the reason for banning this user..."
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
              {user.name} will be temporarily suspended from accessing the
              platform. This action can be reversed at any time.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="suspend-reason">Reason (Optional)</Label>
              <Textarea
                id="suspend-reason"
                placeholder="Enter the reason for suspending this user..."
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
