"use client";

import { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";

export function GlobalSearchIcon() {
  const router = useRouter();
  const pathname = usePathname();
  const [searchText, setSearchText] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const isSearchPage = pathname.startsWith("/search");
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (isSearchPage) {
      setIsExpanded(true);
      if (searchInputRef.current) searchInputRef.current.focus();
    } else {
      setIsExpanded(false);
      setSearchText("");
    }
  }, [isSearchPage]);

  const handleOpen = () => {
    setIsExpanded(true);
    router.push("/search");
  };

  const handleClose = () => {
    setIsExpanded(false);
    setSearchText("");
    if (isSearchPage) router.back();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchText.trim()) {
      router.replace(`/search?q=${encodeURIComponent(searchText)}`);
    }
  };

  return (
    <div className="relative flex h-12 items-center justify-end">
      <AnimatePresence initial={false} mode="wait">
        {isExpanded ? (
          <motion.form
            key="search-bar"
            initial={{ width: 48, opacity: 0 }}
            animate={{ width: 300, opacity: 1 }}
            exit={{ width: 48, opacity: 0 }}
            className="glass-panel absolute right-0 z-20 flex h-full items-center rounded-full"
            onSubmit={handleSubmit}
          >
            <div className="w-full">
              <Input
                ref={searchInputRef}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search..."
                icon={<Search className="h-4 w-4" />}
                className="h-full border-none bg-transparent shadow-none"
              />
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="mr-2 rounded-full p-2 transition-colors hover:bg-white/10"
            >
              <X className="h-4 w-4 text-zinc-400" />
            </button>
          </motion.form>
        ) : (
          <motion.button
            key="search-icon"
            layoutId="search-icon"
            onClick={handleOpen}
            className="glass-panel z-10 flex h-12 w-12 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10"
          >
            <Search className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
