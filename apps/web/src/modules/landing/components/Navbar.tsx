'use client';

import { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { number: '01', label: 'Home', href: '#' },
    { number: '02', label: 'Features', href: '#features' },
    { number: '03', label: 'Engineered', href: '#engineered' },
    { number: '04', label: 'Integrations', href: '#integrations' },
    { number: '05', label: 'FAQ', href: '#faq' },
  ];

  return (
    <>
      {/* Floating Menu Button - Fixed at bottom right */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-13 right-3 z-[10000] flex px-4 py-1 cursor-pointer items-center justify-center   bg-[#1C1A16] text-white shadow-2xl transition-all duration-300 hover:scale-105 hover:border-white/50 rounded-[5px] font-cabin"
        aria-label="Toggle Menu"
      >
       menu
      </button>

      {/* Full Screen Menu Overlay - Slides from top to bottom */}
      <div
        className={`fixed inset-0 z-[9999] h-screen w-screen bg-[#070707] transition-all duration-500 ease-in-out ${
          isOpen
            ? 'translate-y-0 opacity-100'
            : '-translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        {/* Background Grid Lines */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute left-1/4 top-0 h-full w-px bg-white/10"></div>
          <div className="absolute left-2/4 top-0 h-full w-px bg-white/10"></div>
          <div className="absolute left-3/4 top-0 h-full w-px bg-white/10"></div>
        </div>

        {/* Menu Content Container */}
        <div className="flex h-full w-full flex-col justify-between px-8 py-16 md:px-24 md:py-24 max-w-7xl mx-auto">
          {/* Top Bar inside Menu */}
          <div className="flex items-center justify-between">
            <span className="font-bricolage text-2xl font-bold tracking-tight text-white">
              relicai<span className="text-zinc-500">.</span>
            </span>
            <span className="font-mono text-xs uppercase tracking-widest text-zinc-500">
              Navigation Menu
            </span>
          </div>

          {/* Main Links */}
          <nav className="flex flex-col gap-6 md:gap-8 my-auto">
            {menuItems.map((item, index) => (
              <a
                key={index}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="group flex items-baseline gap-4 md:gap-6 text-left w-fit"
              >
                <span className="font-mono text-sm text-zinc-600 transition-colors duration-300 group-hover:text-white">
                  {item.number}
                </span>
                <span className="font-bricolage text-5xl md:text-7xl font-light tracking-tight text-white transition-all duration-300 group-hover:pl-4 group-hover:text-zinc-300">
                  {item.label}
                </span>
              </a>
            ))}
          </nav>

          {/* Footer inside Menu */}
          <div className="flex flex-col gap-4 border-t border-white/10 pt-8 md:flex-row md:items-center md:justify-between text-zinc-500 text-sm font-mono">
            <div>© 2026 Relic AI. All rights reserved.</div>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">Twitter</a>
              <a href="#" className="hover:text-white transition-colors">GitHub</a>
              <a href="#" className="hover:text-white transition-colors">Discord</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
