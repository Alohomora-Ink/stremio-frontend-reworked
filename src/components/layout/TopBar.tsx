"use client";

import { useState, useRef, useEffect } from "react";
import { Search, User, LogIn, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCtx, useAuthActions } from "@/stremio-core-ts-wrapper/src";
import { useRouter, usePathname } from "next/navigation";

export function TopBar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  const { isAuthenticated, profile } = useCtx();
  const { login } = useAuthActions();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchText.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchText)}`);
    }
  };

  const closeSearch = () => {
    setIsSearchOpen(false);
    setSearchText("");
    if (pathname.startsWith("/search")) {
      router.back();
    }
  };

  return (
    <div className="fixed top-6 right-6 z-50 flex items-center gap-3">
      <div className="relative h-12 flex items-center justify-end">
        <AnimatePresence initial={false}>
          {isSearchOpen ? (
            <motion.form
              initial={{ width: 48, opacity: 0 }}
              animate={{ width: 300, opacity: 1 }}
              exit={{ width: 48, opacity: 0 }}
              className="absolute right-0 h-full bg-zinc-900/60 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl overflow-hidden flex items-center z-20"
              onSubmit={handleSearchSubmit}
            >
              <Search className="w-5 h-5 text-zinc-400 ml-4 shrink-0" />
              <input
                ref={searchInputRef}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search..."
                className="w-full bg-transparent border-none outline-none text-white px-3 text-sm h-full"
                onBlur={(e) => {
                  // TODO: Close on blur if empty? => Close Seach View
                  // For now let's keep it open until explicit close or click away logic
                }}
              />
              <button
                type="button"
                onClick={closeSearch}
                className="p-2 mr-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-zinc-400" />
              </button>
            </motion.form>
          ) : (
            <motion.button
              layoutId="search-icon"
              onClick={() => setIsSearchOpen(true)}
              className="w-12 h-12 rounded-full bg-zinc-900/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-colors shadow-lg z-10"
            >
              <Search className="w-5 h-5" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
      <div className="relative group">
        <button className="w-12 h-12 rounded-full bg-zinc-900/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-colors shadow-lg overflow-hidden">
          {isAuthenticated && profile?.avatar ? (
            <img
              src={profile.avatar}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-5 h-5" />
          )}
        </button>
        <div className="absolute top-full right-0 mt-2 w-48 bg-zinc-900/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl p-1 opacity-0 scale-95 -translate-y-2.5 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0 transition-all duration-200 pointer-events-none group-hover:pointer-events-auto transform origin-top-right">
          {isAuthenticated ? (
            <div className="p-3 text-sm">
              <p className="text-zinc-400 text-xs mb-1">Signed in as</p>
              <p className="text-white font-medium truncate">
                {profile?.email}
              </p>
            </div>
          ) : (
            <button className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-white/10 text-sm text-white transition-colors">
              <LogIn className="w-4 h-4" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
