"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, LogIn } from "lucide-react";
import { Input } from "@/components/ui/input"; // NEW
import { Button } from "@/components/ui/button"; // NEW
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
          <div className="pointer-events-none fixed inset-0 z-70 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="pointer-events-auto w-full max-w-md p-4"
            >
              <div className="glass-panel relative overflow-hidden rounded-3xl p-8 ring-1 ring-white/20">
                {/* Glow */}
                <div className="bg-brand-primary/20 pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full blur-3xl" />

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

                <form onSubmit={handleSubmit} className="relative space-y-6">
                  <div className="space-y-4">
                    <Input
                      label="Email"
                      type="email"
                      placeholder="name@example.com"
                      icon={<Mail className="h-4 w-4" />}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                    />
                    <Input
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
                    <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs font-medium text-red-400">
                      {error}
                    </div>
                  )}

                  <div className="pt-2">
                    <Button type="submit" isLoading={isLoading}>
                      <LogIn className="mr-2 h-4 w-4" /> Sign In
                    </Button>
                  </div>
                </form>

                <div className="mt-6 text-center text-xs text-zinc-500">
                  Don't have an account?{" "}
                  <a
                    href="#"
                    className="text-brand-primary hover:text-brand-secondary transition-colors"
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
