import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import Link from "next/link";
import React, { ElementType } from "react";

type ActionButtonProps = React.ComponentProps<typeof Button> & {
  tooltip: string;
  icon: LucideIcon | ElementType;
  iconClassName?: string;
  delay?: string;
  href?: string;
};

export function ActionButton({
  tooltip,
  icon: Icon,
  className,
  iconClassName,
  delay = "delay-0",
  href,
  ...props
}: ActionButtonProps) {
  const content = <Icon className={cn("h-4 w-4", iconClassName)} />;

  const button = href ? (
    <Button
      asChild
      size="icon"
      className={cn(
        "bg-white hover:bg-gray-100 h-9 w-9 shadow-md border border-gray-200 text-gray-700 hover:text-gray-900 transition-all duration-200 rounded-none",
        className
      )}
      {...props}
    >
      <Link href={href}>{content}</Link>
    </Button>
  ) : (
    <Button
      size="icon"
      className={cn(
        "bg-white hover:bg-gray-100 h-9 w-9 shadow-md border border-gray-200 text-gray-700 hover:text-gray-900 transition-all duration-200 rounded-none",
        className
      )}
      {...props}
    >
      {content}
    </Button>
  );

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent side="left">
        <p className="text-xs">{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  );
}
