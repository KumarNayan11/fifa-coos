import { redirect } from "next/navigation";
import { destroySession } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LayoutDashboard, AlertTriangle, Activity, BrainCircuit, ArrowLeft } from "lucide-react";
import { SidebarNav } from "@/components/shared/SidebarNav";

export default function OpsLayout({ children }: { children: React.ReactNode }) {
  const handleLogout = async () => {
    "use server";
    await destroySession();
    redirect("/ops/login");
  };

  const navItems = [
    { label: "Dashboard", href: "/ops", icon: <LayoutDashboard className="h-5 w-5" /> },
    { label: "Incidents", href: "/ops/incidents", icon: <AlertTriangle className="h-5 w-5" /> },
    { label: "Telemetry", href: "/ops#telemetry", icon: <Activity className="h-5 w-5" /> },
    { label: "AI Copilot", href: "/ops#ai-copilot", icon: <BrainCircuit className="h-5 w-5" /> },
  ];

  const bottomItem = (
    <Link
      href="/"
      className="flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
    >
      <ArrowLeft className="h-5 w-5" aria-hidden="true" />
      <span>Back to Home</span>
    </Link>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b px-6 py-4 flex justify-between items-center sticky top-0 z-20 shadow-sm">
        <h1 className="text-xl font-bold tracking-tight text-gray-900">
          Command Center <span className="text-blue-600">Ops</span>
        </h1>
        <form action={handleLogout}>
          <Button variant="outline" size="sm" type="submit">
            Logout
          </Button>
        </form>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <SidebarNav items={navItems} bottomItem={bottomItem} />

        <main id="main-content" className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
