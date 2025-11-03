"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  useDeleteAvatar,
  useUploadAvatar,
  useUserAvatar,
} from "@/hooks/use-user-mutations";
import { Camera, Loader2, Trash2 } from "lucide-react";
import Image from "next/image";
import { ChangeEvent, useRef, useState } from "react";
import { toast } from "sonner";

// Use the public-facing server URL for images.
const IMAGE_HOST_URL =
  process.env.NEXT_PUBLIC_IMAGE_HOST_URL || "http://localhost:5000";

interface AvatarUploadProps {
  userName?: string;
  className?: string;
}

export function AvatarUpload({
  userName = "User",
  className = "",
}: AvatarUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const avatarUrlFromHook = useUserAvatar(); // This hook should already provide the full URL
  const uploadAvatarMutation = useUploadAvatar();
  const deleteAvatarMutation = useDeleteAvatar();

  const isLoading =
    uploadAvatarMutation.isPending || deleteAvatarMutation.isPending;

  const constructFullUrl = (url: string) => {
    if (!url || url.startsWith("http") || url.startsWith("blob:")) {
      return url;
    }
    return `${IMAGE_HOST_URL}${url}`;
  };

  const avatarUrl = constructFullUrl(avatarUrlFromHook);

  const validateFile = (file: File): boolean => {
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      toast.error(
        "Invalid file type. Please upload JPEG, PNG, or WebP images."
      );
      return false;
    }

    if (file.size > maxSize) {
      toast.error("File size must be less than 5MB.");
      return false;
    }

    return true;
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!validateFile(file)) {
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setPreviewUrl(reader.result as string);
    reader.readAsDataURL(file);

    try {
      await uploadAvatarMutation.mutateAsync(file);
      setPreviewUrl(null); // Clear preview on successful upload
    } catch (error) {
      setPreviewUrl(null); // Clear preview on error
      console.error("Upload failed:", error);
    }

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDelete = async () => {
    try {
      await deleteAvatarMutation.mutateAsync();
      setPreviewUrl(null);
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handleUploadClick = () => fileInputRef.current?.click();

  const displayUrl = previewUrl || avatarUrl;
  const isDefaultAvatar = avatarUrl.includes("default-avatar");

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      <div
        className="relative group w-28 h-28 cursor-pointer"
        onClick={handleUploadClick}
      >
        <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-border bg-muted">
          <Image
            src={displayUrl || "/placeholder.svg"} // Fallback for initial load
            alt={`${userName}'s avatar`}
            fill
            className="object-cover"
            priority
            unoptimized
          />
        </div>

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-full">
            <Loader2 className="w-6 h-6 text-white animate-spin" />
          </div>
        )}

        {/* Hover Overlay */}
        {!isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
            <Camera className="w-6 h-6 text-white" />
          </div>
        )}
      </div>

      <div className="flex flex-col items-center gap-2">
        <Button
          onClick={handleUploadClick}
          disabled={isLoading}
          size="sm"
          className="w-full"
        >
          <Camera className="w-4 h-4 mr-2" />
          {isLoading ? "Uploading..." : "Change Photo"}
        </Button>

        {!isDefaultAvatar && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                disabled={isLoading}
                className="text-destructive hover:text-destructive hover:bg-destructive/10 w-full"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Remove
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Remove Profile Picture?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will revert your avatar to the default. This action
                  cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className={buttonVariants({ variant: "destructive" })}
                >
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileChange}
        disabled={isLoading}
        className="hidden"
        aria-label="Upload avatar file"
      />

      {/* Info Text */}
      <p className="text-xs text-muted-foreground text-center max-w-xs">
        Max 5MB. JPG, PNG, or WebP.
      </p>
    </div>
  );
}
