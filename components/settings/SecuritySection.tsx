"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUpdatePassword } from "@/hooks/use-user-mutations";
import { UpdatePasswordData } from "@/types/user";
import { Loader2, Lock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// Security Section Component (No changes needed)
function SecuritySection() {
  const updatePassword = useUpdatePassword();
  const [formData, setFormData] = useState<UpdatePasswordData>({
    currentPassword: "",
    newPassword: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = () => {
    if (formData.newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (formData.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    if (!formData.currentPassword) {
      toast.error("Please enter your current password");
      return;
    }

    updatePassword.mutate(formData, {
      onSuccess: () => {
        setFormData({ currentPassword: "", newPassword: "" });
        setConfirmPassword("");
      },
    });
  };

  return (
    <Card className="border border-gray-200 shadow-sm rounded-none">
      <CardHeader className="border-b border-gray-200">
        <CardTitle className="text-lg font-semibold">
          Security Settings
        </CardTitle>
        <CardDescription className="text-sm">
          Update your password to keep your account secure
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label
              htmlFor="currentPassword"
              className="text-sm font-medium flex items-center gap-2"
            >
              <Lock className="h-4 w-4 text-gray-500" />
              Current Password
            </Label>
            <Input
              id="currentPassword"
              type="password"
              value={formData.currentPassword}
              onChange={(e) =>
                setFormData({ ...formData, currentPassword: e.target.value })
              }
              className="h-10 rounded-none border-gray-200"
              placeholder="Enter current password"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword" className="text-sm font-medium">
              New Password
            </Label>
            <Input
              id="newPassword"
              type="password"
              value={formData.newPassword}
              onChange={(e) =>
                setFormData({ ...formData, newPassword: e.target.value })
              }
              className="h-10 rounded-none border-gray-200"
              placeholder="Enter new password"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-medium">
              Confirm New Password
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="h-10 rounded-none border-gray-200"
              placeholder="Re-enter new password"
            />
          </div>

          <div className="bg-gray-50 border border-gray-200 p-4 text-sm text-gray-600">
            <p className="font-medium mb-2">Password Requirements:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>At least 8 characters long</li>
              <li>Include uppercase and lowercase letters</li>
              <li>Include at least one number</li>
            </ul>
          </div>

          <div className="flex justify-end pt-4">
            <Button
              onClick={handleSubmit}
              disabled={updatePassword.isPending}
              className="rounded-none h-10"
            >
              {updatePassword.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Password"
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default SecuritySection;
