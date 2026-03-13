"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-[#800020]/30 bg-[#1b0b0b] sticky top-0 z-50 shadow-lg shadow-[#800020]/10">
      <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          {/* Logo */}
          <Link href="/decoder" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-[#800020] to-[#b22234] rounded-lg flex items-center justify-center shadow-lg shadow-[#800020]/40 group-hover:scale-105 transition-transform">
              <ShieldCheck className="text-[#f5eaea]" size={20} />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#f5eaea] to-[#f5eaea]/70 tracking-tight">
              JWT TOOL
            </span>
          </Link>

          {/* Links */}
          <div className="flex space-x-1">
            <Link
              href="/decoder"
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                pathname === "/decoder" || pathname === "/"
                  ? "bg-[#800020]/20 text-[#f5eaea] border border-[#800020]/50"
                  : "text-[#f5eaea]/70 hover:bg-[#2a0f0f] hover:text-[#f5eaea]"
              }`}
            >
              Decoder
            </Link>
            <Link
              href="/encoder"
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                pathname === "/encoder"
                  ? "bg-[#800020]/20 text-[#f5eaea] border border-[#800020]/50"
                  : "text-[#f5eaea]/70 hover:bg-[#2a0f0f] hover:text-[#f5eaea]"
              }`}
            >
              Encoder
            </Link>
          </div>
        </div>

        <div className="flex items-center">
          <a
            href="https://jwt.io/"
            target="_blank"
            rel="noreferrer"
            className="text-xs text-[#f5eaea]/50 hover:text-[#f5eaea]/80 flex items-center gap-1 transition-colors"
          >
            Powered by Next.js
          </a>
        </div>
      </div>
    </nav>
  );
}
