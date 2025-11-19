"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

type PageButton = {
  title: string;
  href?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
};

interface PageHeaderProps {
  pageTitle: string;
  pageDescription: string;
  pageButtons?: PageButton[];
  headerButtons?: PageButton[];
}

export function PageHeader({
  pageDescription,
  pageButtons,
  pageTitle,
  headerButtons,
}: PageHeaderProps) {
  return (
    <div className="space-y-4 ">
      <div className="flex items-center gap-3 mb-5">
        {headerButtons?.map((button, index) => (
          <Button
            key={index}
            asChild
            variant="ghost"
            size="sm"
            className="text-xs h-8 hover:bg-gray-100 border border-gray-200"
          >
            <Link href={button.href || ""} onClick={button.onClick}>
              {button.icon && <span>{button.icon}</span>}
              {button.title}
            </Link>
          </Button>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-gray-200 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{pageTitle}</h1>
          <p className="text-sm text-gray-600">{pageDescription}</p>
        </div>
        <div className="flex items-center gap-3">
          {pageButtons?.map((button, index) => (
            <Button
              key={index}
              asChild
              className="h-9 text-sm rounded-none bg-gray-900 hover:bg-gray-800"
            >
              <Link href={button.href || ""} onClick={button.onClick}>
                {button.icon && <span>{button.icon}</span>}
                {button.title}
              </Link>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
