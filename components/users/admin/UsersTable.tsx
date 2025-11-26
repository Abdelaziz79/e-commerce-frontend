// components/users/admin/UsersTable.tsx
"use client";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AdminUser } from "@/types/admin";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Users as UsersIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { UserRow } from "./UserRow";

interface UsersTableProps {
  users: AdminUser[];
  sort: string;
  onSortChange: (sort: string) => void;
  isLoading: boolean;
}

export function UsersTable({
  users,
  sort,
  onSortChange,
  isLoading,
}: UsersTableProps) {
  const handleSort = (field: string) => {
    const isCurrentlyAsc = sort === field;
    const isCurrentlyDesc = sort === `-${field}`;

    if (isCurrentlyDesc) {
      onSortChange(field);
    } else if (isCurrentlyAsc) {
      onSortChange(`-${field}`);
    } else {
      onSortChange(field);
    }
  };

  const SortableHeader = ({
    field,
    label,
    className,
  }: {
    field: string;
    label: string;
    className?: string;
  }) => (
    <Button
      variant="ghost"
      onClick={() => handleSort(field)}
      className={cn(
        "h-8 px-2 -ml-2 text-xs font-semibold text-gray-600 uppercase tracking-wider hover:text-gray-900 hover:bg-gray-50",
        className
      )}
    >
      {label}
      <ArrowUpDown className="ml-2 h-3 w-3" />
    </Button>
  );

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader className="bg-gray-50 border-b border-gray-200">
          <TableRow>
            <TableHead className="min-w-[250px]">
              <SortableHeader field="name" label="User" />
            </TableHead>
            <TableHead>
              <SortableHeader field="email" label="Email" />
            </TableHead>
            <TableHead className="text-center">
              <SortableHeader field="role" label="Role" />
            </TableHead>
            <TableHead className="text-center">
              <SortableHeader field="status" label="Status" />
            </TableHead>
            <TableHead>
              <SortableHeader field="createdAt" label="Joined" />
            </TableHead>
            <TableHead className="w-[50px] text-right pr-4"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className={cn(isLoading && "opacity-50 transition-opacity")}>
          {users.map((user) => (
            <UserRow key={user._id} user={user} />
          ))}
        </TableBody>
      </Table>
      {!isLoading && users.length === 0 && (
        <div className="text-center p-12 text-sm text-gray-500 border-t border-gray-200">
          <UsersIcon className="h-12 w-12 mx-auto text-gray-300 mb-3" />
          <h4 className="font-semibold text-gray-800 text-base">
            No users found
          </h4>
          <p className="text-gray-500 mt-1">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      )}
    </div>
  );
}
