"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useAuth } from "@/hooks/auth-context";
import { Image as ImageIcon } from "lucide-react";
import { AvatarUpload } from "./AvatarUpload"; // Ensure this path is correct

export function AvatarManager() {
  const { user } = useAuth();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <ImageIcon className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Profile Picture
            </h3>
            <p className="text-sm text-gray-500">
              Upload or change your avatar
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <AvatarUpload userName={user?.name} className="mt-4" />
      </CardContent>
    </Card>
  );
}
