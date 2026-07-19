import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface BackButtonProps {
  href: string;
  label?: string;
  className?: string;
}

export function BackButton({ href, label = "Back", className }: BackButtonProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground group",
        className,
      )}
    >
      <ArrowLeft
        className="h-4 w-4 transition-transform group-hover:-translate-x-1"
        aria-hidden="true"
      />
      {label}
    </Link>
  );
}
