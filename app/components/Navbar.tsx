"use client"; // ✅ Fixes hydration issues

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full relative flex items-center justify-between mx-auto px-4 py-5">
      <Link href="/" className="font-bold text-3xl">
        Marshal<span className="text-primary">Blog</span>
      </Link>


    </nav>
  );
}
