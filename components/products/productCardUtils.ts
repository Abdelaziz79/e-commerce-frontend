import { cva } from "class-variance-authority";

export const favoriteButtonVariants = cva(
  "transition-all duration-200 hover:scale-110",
  {
    variants: {
      isFavorite: {
        true: "text-red-500 hover:text-red-600",
        false: "text-gray-600 hover:text-red-500",
      },
    },
    defaultVariants: { isFavorite: false },
  }
);

export const getBorderClasses = (
  view: "grid" | "list",
  position: "left" | "middle" | "right",
  isLast: boolean
): string => {
  if (view === "grid") {
    return position === "middle" ? "border-l border-r border-gray-200" : "";
  }
  return !isLast ? "border-b border-gray-200" : "";
};
