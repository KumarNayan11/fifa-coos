import { redirect } from "next/navigation";
import { destroySession } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { HeartHandshake, FileText, MessageCircle, LayoutDashboard } from "lucide-react";

export default function VolunteerLayout({ children }: { children: React.ReactNode }) {
  const handleLogout = async () => {
    "use server";
    await destroySession();
    redirect("/ops/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b px-6 py-4 flex justify-between items-center sticky top-0 z-20 shadow-sm">
        <h1 className="text-xl font-bold tracking-tight text-gray-900">
          Volunteer <span className="text-indigo-600">Assistant</span>
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
          <nav className="p-4 space-y-2" aria-label="Volunteer Navigation">
            <Link
              href="/volunteer"
              className="flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-md bg-indigo-50 text-indigo-700"
            >
              <HeartHandshake className="h-5 w-5" aria-hidden="true" />
              <span>Dashboard</span>
            </Link>

            <Link
              href="/volunteer"
              className="flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50"
              title="Coming Soon"
            >
              <FileText className="h-5 w-5" aria-hidden="true" />
              <span>Knowledge Search</span>
            </Link>

            <Link
              href="/volunteer"
              className="flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50"
              title="Coming Soon"
            >
              <MessageCircle className="h-5 w-5" aria-hidden="true" />
              <span>Volunteer Copilot</span>
            </Link>

            <hr className="my-2 border-gray-200" />

            <Link
              href="/"
              className="flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50"
            >
              <LayoutDashboard className="h-5 w-5" aria-hidden="true" />
              <span>Back to Home</span>
            </Link>
          </nav>
        </aside>

        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
