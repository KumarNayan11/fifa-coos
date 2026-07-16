import { redirect } from "next/navigation";
import { destroySession } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export default function OpsLayout({ children }: { children: React.ReactNode }) {
  const handleLogout = async () => {
    "use server";
    await destroySession();
    redirect("/ops/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b px-6 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <h1 className="text-xl font-bold tracking-tight text-gray-900">
          Command Center <span className="text-blue-600">Ops</span>
        </h1>
        <form action={handleLogout}>
          <Button variant="outline" size="sm" type="submit">
            Logout
          </Button>
        </form>
      </header>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
