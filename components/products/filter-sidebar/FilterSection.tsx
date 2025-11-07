import { ChevronDown, ChevronUp } from "lucide-react";

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  makeBorder?: boolean;
}

export function FilterSection({
  title,
  children,
  isOpen,
  onToggle,
  makeBorder = true,
}: FilterSectionProps) {
  return (
    <div
      className={`space-y-3 pt-4 ${makeBorder && "border-t border-gray-100 "} `}
    >
      <button
        onClick={onToggle}
        className=" w-full flex items-center justify-between text-sm font-bold text-gray-900 uppercase tracking-wider  transition-colors cursor-pointer"
      >
        <span>{title}</span>
        {isOpen ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </button>
      {isOpen && children}
    </div>
  );
}
