"use client";

import { useState, useEffect } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CopyIdButtonProps {
  idToCopy: string;
}

export function CopyIdButton({ idToCopy }: CopyIdButtonProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timeout = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timeout);
  }, [copied]);

  const handleCopy = () => {
    navigator.clipboard.writeText(idToCopy);
    setCopied(true);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleCopy}
      className="flex items-center gap-2 h-9"
      title="Copy Full ID"
    >
      {copied ? (
        <Check className="h-4 w-4 text-green-600" aria-label="Copied" />
      ) : (
        <Copy className="h-4 w-4" aria-label="Copy ID" />
      )}
      <span className="text-sm font-medium">{copied ? "Copied" : "Copy ID"}</span>
    </Button>
  );
}
