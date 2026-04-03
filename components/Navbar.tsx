"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { href: "/", label: "Home" },
    { href: "/trips", label: "Find Trips" },
    { href: "/my-booking", label: "My Booking" },
  ];

  return (
    <header className="sticky top-0 z-50 glass border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center shadow-lg shadow-orange-500/30 group-hover:shadow-orange-500/50 transition-shadow">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M4 16c0 1.1.9 2 2 2h1v1c0 .6.4 1 1 1s1-.4 1-1v-1h6v1c0 .6.4 1 1 1s1-.4 1-1v-1h1c1.1 0 2-.9 2-2V8c0-3-3-5-8-5S4 5 4 8v8zm3.5 0c-.8 0-1.5-.7-1.5-1.5S6.7 13 7.5 13s1.5.7 1.5 1.5S8.3 16 7.5 16zm9 0c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5 1.5.7 1.5 1.5-.7 1.5-1.5 1.5zM6 9V8c0-1.7 2.7-3 6-3s6 1.3 6 3v1H6z"/>
            </svg>
          </div>
          <div>
            <span className="font-display font-800 text-lg text-white tracking-tight">Swift<span className="text-gradient">Ride</span></span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`nav-link px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === link.href
                  ? "text-orange-400 bg-orange-500/10 active"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link href="/trips" className="btn-primary px-5 py-2 rounded-xl text-sm">
            Book Now →
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden btn-ghost p-2 rounded-lg"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <div className="w-5 h-0.5 bg-slate-400 mb-1 transition-all"></div>
          <div className="w-5 h-0.5 bg-slate-400 mb-1"></div>
          <div className="w-5 h-0.5 bg-slate-400"></div>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden glass border-t border-white/5 px-4 py-4 flex flex-col gap-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                pathname === link.href
                  ? "text-orange-400 bg-orange-500/10"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/trips"
            onClick={() => setMenuOpen(false)}
            className="btn-primary text-center px-5 py-2.5 rounded-xl text-sm mt-2"
          >
            Book Now →
          </Link>
        </div>
      )}
    </header>
  );
}
