"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, LogIn } from "lucide-react";
import { LiquidGlassInput } from "@/components/primitives/glass/LiquidGlassInput";
import { LiquidGlassButton } from "@/components/primitives/glass/LiquidGlassButton";
import { useLogin } from "../hooks/use-login";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { login, isLoading } = useLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    const result = await login(email, password);

    if (result.success) {
      onClose();
      setPassword("");
    } else {
      setError(result.error || "Login failed");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-60 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Container (Center of Screen) */}
          <div className="pointer-events-none fixed inset-0 z-70 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="pointer-events-auto w-full max-w-md p-4"
            >
              {/* THE LIQUID GLASS MODAL */}
              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/80 p-8 shadow-2xl ring-1 ring-white/20 backdrop-blur-2xl">
                {/* Glossy Top Shine */}
                <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />

                {/* Header */}
                <div className="relative mb-8 flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      Welcome Back
                    </h2>
                    <p className="text-sm text-zinc-400">
                      Sign in to your Stremio account
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-zinc-400 transition-colors hover:bg-white/10 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="relative space-y-6">
                  <div className="space-y-4">
                    <LiquidGlassInput
                      label="Email"
                      type="email"
                      placeholder="name@example.com"
                      icon={<Mail className="h-4 w-4" />}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                    />
                    <LiquidGlassInput
                      label="Password"
                      type="password"
                      placeholder="••••••••"
                      icon={<Lock className="h-4 w-4" />}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                    />
                  </div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs font-medium text-red-400"
                    >
                      {error}
                    </motion.div>
                  )}

                  <div className="pt-2">
                    <LiquidGlassButton type="submit" isLoading={isLoading}>
                      <LogIn className="mr-2 h-4 w-4" />
                      Sign In
                    </LiquidGlassButton>
                  </div>
                </form>

                {/* Footer / Sign Up Link */}
                <div className="mt-6 text-center text-xs text-zinc-500">
                  Don't have an account?{" "}
                  <a
                    href="#"
                    className="text-blue-400 transition-colors hover:text-blue-300"
                  >
                    Sign Up (Coming Soon)
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
