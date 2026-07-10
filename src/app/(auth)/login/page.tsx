import { Suspense } from "react";
import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = { title: "Log in" };

export default function LoginPage() {
  const googleEnabled = !!process.env.AUTH_GOOGLE_ID && !!process.env.AUTH_GOOGLE_SECRET;

  return (
    <div>
      <div className="mb-6 text-center">
        <h1 className="text-xl font-semibold tracking-tight">Welcome back</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Log in to continue your prep.
        </p>
      </div>
      <Suspense>
        <LoginForm googleEnabled={googleEnabled} />
      </Suspense>
    </div>
  );
}
