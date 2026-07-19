"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface SidebarNavProps {
  items: NavItem[];
  bottomItem?: React.ReactNode;
}

export function SidebarNav({ items, bottomItem }: SidebarNavProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Helper to determine if a route is active
  // Handles hash links by just matching the base path
  const isActive = (href: string) => {
    const basePath = href.split("#")[0];
    if (basePath === "/" && pathname !== "/") return false;

    // For /ops, exact match or /ops/incidents should highlight /ops if it's the dashboard link,
    // but we want exact matches to work better.
    // A simple heuristic:
    if (href === pathname) return true;
    if (
      pathname.startsWith(basePath) &&
      basePath !== "/" &&
      basePath !== "/ops" &&
      basePath !== "/volunteer"
    )
      return true;

    return false;
  };

  return (
    <>
      {/* Mobile Menu Toggle (Visible only on small screens) */}
      <div className="md:hidden fixed bottom-4 right-4 z-50">
        <Button
          size="icon"
          className="rounded-full shadow-lg h-12 w-12 bg-indigo-600 hover:bg-indigo-700 text-white"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Navigation"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Sidebar Overlay (Mobile) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Content */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-white border-r transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0 overflow-y-auto flex flex-col",
          isOpen ? "translate-x-0 mt-[65px]" : "-translate-x-full", // mt-[65px] pushes it below header on mobile if header is sticky
        )}
      >
        <nav className="p-4 space-y-2 flex-1" aria-label="Main Navigation">
          {items.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  active ? "bg-indigo-50 text-indigo-700" : "text-gray-700 hover:bg-gray-50",
                )}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {bottomItem && <div className="p-4 border-t border-gray-100">{bottomItem}</div>}
      </aside>
    </>
  );
}
