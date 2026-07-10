import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = { title: "Sign up" };

export default function RegisterPage() {
  const googleEnabled = !!process.env.AUTH_GOOGLE_ID && !!process.env.AUTH_GOOGLE_SECRET;

  return (
    <div>
      <div className="mb-6 text-center">
        <h1 className="text-xl font-semibold tracking-tight">Create your account</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Start solving in under a minute.
        </p>
      </div>
      <RegisterForm googleEnabled={googleEnabled} />
    </div>
  );
}
