// app/error.tsx
"use client";

import { useEffect } from "react";

import { Logo } from "@/components/MyLogo";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-2xl text-center">
        {/* Logo */}
        <div className="mb-6 flex justify-center">
          <Logo />
        </div>

        <h1 className="mb-2 text-3xl font-bold text-gray-800">Oops!</h1>
        <h2 className="mb-6 text-xl text-gray-600">Something went wrong</h2>

        <div className="mb-6 rounded-lg border-l-4 border-red-500 bg-red-50 p-4 text-left">
          <p className="text-red-700">
            {error.message || "An unexpected error occurred"}
          </p>
        </div>

        {/*  <div className="space-y-4">
          <Button
            onClick={reset}
            className="w-full bg-indigo-600 hover:bg-indigo-700"
          >
            Try Again
          </Button>
          <Button asChild variant="link">
            <Link href="/dashboard">Return to Dashboard</Link>
          </Button>
        </div> */}
      </div>
    </div>
  );
}
