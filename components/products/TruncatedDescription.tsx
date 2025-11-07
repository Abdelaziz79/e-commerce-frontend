import { useState, useEffect, useRef } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface TruncatedDescriptionProps {
  text: string;
  lines?: number;
}

export function TruncatedDescription({
  text,
  lines = 2,
}: TruncatedDescriptionProps) {
  const [isTruncated, setIsTruncated] = useState(false);
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (ref.current) {
      setIsTruncated(ref.current.scrollHeight > ref.current.clientHeight);
    }
  }, [text]);

  return (
    <Tooltip disableHoverableContent={!isTruncated}>
      <TooltipTrigger asChild>
        <p
          ref={ref}
          className={cn(
            "text-sm text-gray-600 leading-relaxed",
            `line-clamp-${lines}`
          )}
        >
          {text}
        </p>
      </TooltipTrigger>
      {isTruncated && (
        <TooltipContent side="bottom" className="max-w-xs">
          {text}
        </TooltipContent>
      )}
    </Tooltip>
  );
}
