import { redirect } from "next/navigation";
import { destroySession } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LayoutDashboard, AlertTriangle, Activity, Users } from "lucide-react";

export default function OpsLayout({ children }: { children: React.ReactNode }) {
  const handleLogout = async () => {
    "use server";
    await destroySession();
    redirect("/ops/login");
  };

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
        {/* Sidebar Navigation */}
        <aside className="w-64 bg-white border-r hidden md:block overflow-y-auto">
          <nav className="p-4 space-y-2">
            <Link
              href="/ops"
              className="flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-md bg-blue-50 text-blue-700"
            >
              <LayoutDashboard className="h-5 w-5" />
              <span>Dashboard</span>
            </Link>

            <Link
              href="/ops"
              className="flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50"
            >
              <AlertTriangle className="h-5 w-5" />
              <span>Incidents</span>
            </Link>

            <Link
              href="/ops"
              className="flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50"
            >
              <Activity className="h-5 w-5" />
              <span>Telemetry</span>
            </Link>

            <Link
              href="/ops"
              className="flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50"
              title="Coming Soon"
            >
              <Users className="h-5 w-5" />
              <span>AI Copilot</span>
            </Link>

            <hr className="my-2 border-gray-200" />

            <Link
              href="/"
              className="flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50"
            >
              <LayoutDashboard className="h-5 w-5" />
              <span>Back to Home</span>
            </Link>
          </nav>
        </aside>

        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
