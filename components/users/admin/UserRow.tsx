// components/users/admin/UserRow.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { AdminUser } from "@/types/admin";
import Image from "next/image";
import { UserRowActions } from "./UserRowActions";
import { cn, getImageSrc } from "@/lib/utils";
import Link from "next/link";

interface UserRowProps {
  user: AdminUser;
}

export function UserRow({ user }: UserRowProps) {
  const statusColors = {
    active: "bg-green-50 text-green-700 border-green-200",
    banned: "bg-red-50 text-red-700 border-red-200",
    suspended: "bg-yellow-50 text-yellow-700 border-yellow-200",
  };

  const roleColors = {
    user: "bg-gray-50 text-gray-700 border-gray-200",
    admin: "bg-blue-50 text-blue-700 border-blue-200",
  };

  return (
    <TableRow className="border-b border-gray-200 hover:bg-gray-50/50 transition-colors">
      <TableCell>
        <div className="flex items-center gap-3">
          {user.avatar ? (
            <div className="w-10 h-10 relative bg-white border border-gray-200 rounded-full overflow-hidden flex-shrink-0">
              <Image
                src={getImageSrc(user.avatar)}
                alt={user.name}
                fill
                className="object-cover"
                sizes="40px"
              />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-600">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <Link
              href={`/admin/users/${user._id}`}
              className="font-semibold text-sm text-gray-900 hover:text-gray-700 transition-colors"
            >
              {user.name}
            </Link>
            <p className="text-xs text-gray-500 mt-0.5">
              {user.isEmailVerified ? "Verified" : "Unverified"}
            </p>
          </div>
        </div>
      </TableCell>
      <TableCell className="text-sm text-gray-600">{user.email}</TableCell>
      <TableCell className="text-center">
        <Badge
          variant="outline"
          className={cn(
            "font-medium rounded-none px-2.5 py-0.5 text-xs border",
            roleColors[user.role as keyof typeof roleColors]
          )}
        >
          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
        </Badge>
      </TableCell>
      <TableCell className="text-center">
        <Badge
          variant="outline"
          className={cn(
            "font-medium rounded-none px-2.5 py-0.5 text-xs border",
            statusColors[user.status as keyof typeof statusColors]
          )}
        >
          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
        </Badge>
      </TableCell>
      <TableCell className="text-sm text-gray-600">
        {new Date(user.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </TableCell>
      <TableCell className="text-right pr-4">
        <UserRowActions user={user} />
      </TableCell>
    </TableRow>
  );
}
