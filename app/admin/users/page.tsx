// app/admin/users/page.tsx
"use client";

import ErrorState from "@/components/shared/ErrorState";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { StatCards } from "@/components/users/admin/StatCards";
import { TablePagination } from "@/components/users/admin/TablePagination";
import { TableSkeleton } from "@/components/users/admin/TableSkeleton";
import { TableToolbar } from "@/components/users/admin/TableToolbar";
import { UsersTable } from "@/components/users/admin/UsersTable";
import { useAdminUsers } from "@/hooks/use-admin-mutations";
import { useDebounce } from "@/hooks/use-debounce";
import { UsersParams } from "@/types/admin";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 300);
  const [params, setParams] = useState<UsersParams>({
    page: 1,
    limit: 10,
    sort: "-createdAt",
  });

  const { data, isLoading, error, refetch } = useAdminUsers(params);

  const users = data?.data || [];
  const pagination = data
    ? {
        page: data.page,
        pages: data.pages,
        total: data.total,
        results: data.results,
      }
    : null;
  const stats = data?.stats;

  useEffect(() => {
    setParams((prev) => ({
      ...prev,
      keyword: debouncedSearch || undefined,
      page: 1,
    }));
  }, [debouncedSearch]);

  const handleFilterChange = (filters: Partial<UsersParams>) => {
    setParams((prev) => ({ ...prev, ...filters, page: 1 }));
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setParams({
      page: 1,
      limit: 10,
      sort: "-createdAt",
    });
  };

  const handlePageChange = (page: number) => {
    setParams((p) => ({ ...p, page }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-[1400px] mx-auto space-y-6">
        <PageHeader
          pageTitle="Users"
          pageDescription={`Manage your users • ${pagination?.total.toLocaleString()} total users`}
          headerButtons={[
            {
              title: "Back to Dashboard",
              href: "/admin",
              icon: <ArrowLeft className="h-3 w-3" />,
            },
          ]}
        />

        {stats && <StatCards stats={stats} />}

        <Card className="border-gray-200 rounded-none overflow-hidden shadow-sm p-0 gap-0">
          <TableToolbar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            params={params}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />

          <CardContent className="p-0">
            {isLoading ? (
              <TableSkeleton />
            ) : error ? (
              <ErrorState
                error={error}
                onRetry={refetch}
                onResetFilters={handleClearFilters}
                title="Failed to load users"
              />
            ) : (
              <UsersTable
                users={users}
                sort={params.sort || ""}
                onSortChange={(sort) => setParams((p) => ({ ...p, sort }))}
                isLoading={isLoading}
              />
            )}
          </CardContent>
        </Card>

        {!isLoading &&
          pagination &&
          pagination.total > 0 &&
          pagination.pages > 1 && (
            <TablePagination
              pagination={pagination}
              onPageChange={handlePageChange}
            />
          )}
      </div>
    </div>
  );
}
