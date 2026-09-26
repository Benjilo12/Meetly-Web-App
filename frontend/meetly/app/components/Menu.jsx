'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Menu as MenuIcon, X } from 'lucide-react';

const NAV_LINKS = [];

export default function Menu() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <Image src="/logo.svg" alt="Meetly logo" width={30} height={30} />
            Meetly
          </Link>

          {/* Desktop links removed */}

          {/* Desktop CTA */}
          <Link
            href="/sign-in"
            className="hidden md:inline-flex items-center bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
          >
                Start a Meeting
          </Link>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 -mr-2"
            onClick={() => setOpen(!open)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            {open ? <X size={26} /> : <MenuIcon size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown panel */}
      <div
        className={`md:hidden overflow-hidden transition-[max-height] duration-300 ease-in-out border-t border-gray-200 bg-white ${
          open ? 'max-h-96' : 'max-h-0 border-t-0'
        }`}
      >
        <nav className="flex flex-col px-4 py-4 gap-1">
          <Link
            href="/sign-in"
            onClick={() => setOpen(false)}
            className="mt-3 text-center bg-orange-500 text-white font-semibold py-3 rounded-lg"
          >
            Sign in
          </Link>
        </nav>
      </div>
    </header>
  );
}