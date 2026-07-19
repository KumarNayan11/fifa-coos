"use client";

import { useActionState } from "react";
import { loginAction } from "./actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, null);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 space-y-6">
      <Card className="w-full max-w-md shadow-lg border-0">
        <CardHeader className="space-y-1 pb-6 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight text-gray-900">
            Operations Login
          </CardTitle>
          <CardDescription>Enter your credentials to access the Command Center</CardDescription>
        </CardHeader>
        <form action={formAction}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Enter email"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Enter password"
              />
            </div>

            {state?.error && (
              <div className="text-sm font-medium text-red-500 mt-2 text-center bg-red-50 p-2 rounded-md border border-red-100">
                {state.error}
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              type="submit"
              disabled={isPending}
            >
              {isPending ? "Authenticating..." : "Sign in"}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {/* Demo Credentials Helper */}
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-xl p-5 shadow-md text-left space-y-3">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-indigo-900 flex items-center gap-2 select-none">
          <ShieldCheck className="h-4 w-4 text-indigo-600" />
          Sandbox Demonstration Accounts
        </h3>
        <div className="grid grid-cols-2 gap-3.5 text-xs">
          <div className="bg-indigo-50/30 p-3 rounded-lg border border-indigo-150 space-y-1">
            <span className="font-bold uppercase text-[9px] tracking-wider text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
              Operations
            </span>
            <p className="font-semibold text-gray-700 mt-1">ops@example.com</p>
            <p className="font-mono text-gray-400 text-[10px]">Password: password123</p>
          </div>
          <div className="bg-emerald-50/30 p-3 rounded-lg border border-emerald-150 space-y-1">
            <span className="font-bold uppercase text-[9px] tracking-wider text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
              Volunteer
            </span>
            <p className="font-semibold text-gray-700 mt-1">volunteer@example.com</p>
            <p className="font-mono text-gray-400 text-[10px]">Password: password123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
