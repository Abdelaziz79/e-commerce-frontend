"use client";

import { ImageCropDialog } from "@/components/settings/ImageCropDialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
import { Separator } from "@/components/ui/separator";
import {
  useDeleteAvatar,
  useUpdateProfile,
  useUploadAvatar,
  useUserAvatar,
  useUserProfile,
} from "@/hooks/use-user-mutations";
import { UpdateProfileData } from "@/types/user";
import {
  AlertCircle,
  Camera,
  Check,
  Loader2,
  Mail,
  Phone,
  Trash2,
  User,
} from "lucide-react";
import { useRef, useState } from "react";

// Profile Section Component (UPDATED)
function ProfileSection() {
  const { data: profileData } = useUserProfile();
  const updateProfile = useUpdateProfile();
  const avatarUrl = useUserAvatar();
  const uploadAvatar = useUploadAvatar();
  const deleteAvatar = useDeleteAvatar();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const user = profileData?.data;
  // State to manage the image source for the cropping dialog
  const [imageSrc, setImageSrc] = useState<string>("");

  const [formData, setFormData] = useState<UpdateProfileData>({
    name: profileData?.data?.name || "",
    email: profileData?.data?.email || "",
    phone: profileData?.data?.phone || "",
  });

  const handleSubmit = () => {
    updateProfile.mutate(formData);
  };

  // This function is triggered when a user selects a file from the file explorer
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        // Set the image source, which will open the dialog
        setImageSrc(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
    // Clear the input value to allow selecting the same file again
    e.target.value = "";
  };

  // This function is called from the dialog when the user saves the cropped image
  const handleAvatarSave = (croppedImage: Blob) => {
    // Convert the Blob to a File
    const file = new File([croppedImage], `avatar-${user?._id}.png`, {
      type: "image/png",
    });
    uploadAvatar.mutate(file);
    setImageSrc(""); // Close the dialog
  };

  const handleDeleteAvatar = () => {
    deleteAvatar.mutate();
  };
  return (
    <>
      <Card className="border border-gray-200 shadow-sm rounded-none">
        <CardHeader className="border-b border-gray-200">
          <CardTitle className="text-lg font-semibold">
            Profile Information
          </CardTitle>
          <CardDescription className="text-sm">
            Update your personal information and profile picture
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {/* Avatar Section */}
          <div className="flex items-center gap-6">
            <div className="relative">
              <Avatar className="h-24 w-24 border-2 border-gray-200">
                <AvatarImage src={avatarUrl} alt={user?.name} />
                <AvatarFallback className="text-2xl font-semibold bg-gray-100">
                  {user?.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {/* This label triggers the hidden file input */}
              <label
                htmlFor="avatar-upload"
                className="absolute bottom-0 right-0 p-2 bg-white border-2 border-gray-200 rounded-full cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <Camera className="h-4 w-4 text-gray-600" />
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  disabled={uploadAvatar.isPending}
                />
              </label>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{user?.name}</h3>
              <p className="text-sm text-gray-500 mb-3">{user?.email}</p>
              <div className="flex items-center gap-2">
                <Badge
                  variant={user?.isEmailVerified ? "default" : "secondary"}
                  className="rounded-none"
                >
                  {user?.isEmailVerified ? (
                    <>
                      <Check className="h-3 w-3 mr-1" /> Verified
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-3 w-3 mr-1" /> Unverified
                    </>
                  )}
                </Badge>
                {avatarUrl.includes("default-avatar.png") === false && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleDeleteAvatar}
                    disabled={deleteAvatar.isPending}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 h-7 text-xs"
                  >
                    {deleteAvatar.isPending ? (
                      <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                    ) : (
                      <Trash2 className="h-3 w-3 mr-1" />
                    )}
                    Remove Photo
                  </Button>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Profile Form */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-sm font-medium flex items-center gap-2"
              >
                <User className="h-4 w-4 text-gray-500" />
                Full Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="h-10 rounded-none border-gray-200"
                placeholder="Enter your full name"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium flex items-center gap-2"
              >
                <Mail className="h-4 w-4 text-gray-500" />
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="h-10 rounded-none border-gray-200"
                placeholder="Enter your email"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="phone"
                className="text-sm font-medium flex items-center gap-2"
              >
                <Phone className="h-4 w-4 text-gray-500" />
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="h-10 rounded-none border-gray-200"
                placeholder="Enter your phone number"
              />
            </div>

            <div className="flex justify-end pt-4">
              <Button
                onClick={handleSubmit}
                disabled={updateProfile.isPending}
                className="rounded-none h-10"
              >
                {updateProfile.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* The Dialog is now controlled by the imageSrc state */}
      <ImageCropDialog
        imageSrc={imageSrc}
        onClose={() => setImageSrc("")}
        onSave={handleAvatarSave}
      />
    </>
  );
}

export default ProfileSection;
