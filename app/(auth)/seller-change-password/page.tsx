// src/app/reset-password/page.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ResetPasswordFormData,
  resetPasswordSchema,
} from "@/lib/validations/seller";
import { resetPassword, verifyResetToken } from "@/app/actions/auth";
import { Logo } from "@/components/MyLogo";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  useEffect(() => {
    //recupere le token en paramètre sur l'url
    const token = searchParams.get("token");
    if (!token) {
      //setValue("token", token);

      //verifie l'existence du token
      verifyToken(/* token */);
    } else {
      setTokenValid(false);
    }
  }, [searchParams, setValue]);

  //verifie la validité du token
  const verifyToken = async (/* token: string */) => {
    try {
      const result = { error: "" }; /* await verifyResetToken(token); */
      setTokenValid(true /* !result?.error */);
      if (result?.error) setError(result.error);
    } catch (err) {
      setTokenValid(false);
      setError("Error verifying token");
    }
  };

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      const result = await resetPassword(data);

      if (result?.error) {
        setError(result.error);
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setError("An error occurred while resetting password");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (tokenValid === null) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Loading...</h1>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Invalid Token</h1>
        <p className="mb-4">
          The password reset link is invalid or has expired. Please request a
          new one.
        </p>
        <Link
          href="/seller-forgot-password"
          className="w-full block text-center bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          Request New Link
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Password Reset Successful</h1>
        <p className="mb-4">
          Your password has been successfully updated. You can now log in with
          your new password.
        </p>
        <Link
          href="/login"
          className="w-full block text-center bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center w-full h-screen">
      <Logo />
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6">Reset Password</h1>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input type="hidden" {...register("token")} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Nouveau Mot de passe *
              </label>
              <input
                id="password"
                type="password"
                {...register("password")}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirmer le mot de passe *
              </label>
              <input
                id="confirmPassword"
                type="password"
                {...register("confirmPassword")}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Entrer un nouveau mot de passe"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-blue-400 transition"
          >
            {isSubmitting ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
