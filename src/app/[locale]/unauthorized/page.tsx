import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <Container className="min-h-screen flex items-center justify-center">
      <div className="text-center max-w-md mx-auto space-y-6">
        <div className="flex justify-center">
          <ShieldAlert className="h-16 w-16 text-red-500" />
        </div>

        <PageHeader
          title="Access Denied"
          description="You do not have the necessary permissions to access this page."
        />

        <div className="text-sm text-gray-500 bg-gray-50 p-4 rounded-lg border border-gray-100">
          This area is restricted to authorized personnel only. If you believe you should have
          access, please contact your system administrator.
        </div>

        <div className="pt-4 flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3 justify-center">
          <Link href="/ops/login" passHref>
            <Button variant="outline" className="w-full">
              Sign in with different account
            </Button>
          </Link>
          <Link href="/" passHref>
            <Button className="w-full bg-blue-600 hover:bg-blue-700">Return to Home</Button>
          </Link>
        </div>
      </div>
    </Container>
  );
}
