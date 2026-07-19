import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, UserRound } from "lucide-react";

import { Container } from "@/components/ui/container";
import { buttonVariants } from "@/components/ui/button";
import { STADIUM } from "@/features/fan/data/stadium";

export const metadata: Metadata = {
  title: `Fan Copilot | ${STADIUM.name}`,
  description: "Your AI stadium assistant for navigating the venue and finding facilities.",
};

export default function FanLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-background">
      {/* Mobile-optimized header */}
      <header className="shrink-0 border-b bg-background/95 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Container className="flex items-center justify-between">
          <Link
            href="/"
            className={buttonVariants({
              variant: "ghost",
              size: "sm",
              className: "gap-2 text-muted-foreground",
            })}
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Link>

          <div className="text-sm font-semibold tracking-tight">Fan Copilot</div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
              <UserRound className="h-3 w-3" />
              <span>Anonymous Fan</span>
            </div>
          </div>
        </Container>
      </header>

      {/* Scrollable content area */}
      <main id="main-content" className="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  );
}
