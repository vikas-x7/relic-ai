'use client';

import React from 'react';
import Link from 'next/link';
// React Icons import
import { FaXTwitter, FaLinkedinIn, FaDiscord, FaRedditAlien, FaInstagram, FaYoutube } from 'react-icons/fa6';
import Image from 'next/image';

const Footer = () => {
  return (
    <footer className="w-full overflow-hidden border-t border-white/10 bg-black pt-12 text-white md:pt-20 font-cabin">
      <div className="">
        {/* Main Grid: image_650155.png layout */}
        <div className="mb-16 grid grid-cols-1 gap-12 md:grid-cols-4 px-12">
          {/* Brand & Socials Section */}
          <div className="space-y-2 md:col-span-2">
            <div className="flex items-center gap-2 select-none">
              <h1 className="text-[24px] -tracking-[2px] md:text-[32px]">Relic ai</h1>
            </div>

            <p className="text-sm text-white/50">
              Breathing canvas where your conversations don&apos;t just <br />
              happen, they grow.
            </p>

            {/* Social Icons using React Icons */}
            <div className="flex items-center gap-3">
              <Link
                href="https://x.com/Relic__ai"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-[2px] border border-white/10 text-white/50 transition-all hover:bg-white/5 hover:text-white"
              >
                <FaXTwitter size={14} />
              </Link>
              <Link
                href="https://www.linkedin.com/company/relic-ai/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-[2px] border border-white/10 text-white/50 transition-all hover:bg-white/5 hover:text-white"
              >
                <FaLinkedinIn size={14} />
              </Link>

              <Link
                href="https://www.instagram.com/relic__ai/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-[2px] border border-white/10 text-white/50 transition-all hover:bg-white/5 hover:text-white"
              >
                <FaInstagram size={14} />
              </Link>
            </div>
          </div>

          {/* Product Section */}
          <div className="space-y-4">
            <h3 className="text-sm text-white">Company</h3>
            <ul className="flex flex-col gap-3 text-[13px] md:text-sm">
              <li>
                <Link href="#" className="text-white/50 transition-colors hover:text-white">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/50 transition-colors hover:text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/50 transition-colors hover:text-white">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Section */}
          <div className="space-y-4">
            <h3 className="text-sm text-white">Feature</h3>
            <ul className="flex flex-col gap-3 text-[13px] md:text-sm">
              <li>
                <Link href="#" className="text-white/50 transition-colors hover:text-white">
                  Canvas Nodes
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/50 transition-colors hover:text-white">
                  Branching
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/50 transition-colors hover:text-white">
                  Persistent Memory
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/50 transition-colors hover:text-white">
                  Multi AI Models
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright Line */}
        <div className="flex flex-col items-center justify-between border-t border-white/5 py-6 text-[12px] text-white/30 md:flex-row px-12">
          <p>© 2026 Relic AI. All rights reserved.</p>
          <p>Designed and built by Relic AI.</p>
        </div>
      </div>

      {/* Visual Image Section */}
      <div className="relative mt-6 w-full overflow-hidden opacity-80 md:mt-8">
        <img src="https://relicai.in/_next/image?url=%2Fimages%2Frelicfooter.jpg&w=2048&q=75" alt="" className="block h-auto w-full object-cover" />

        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/10 to-transparent" />
      </div>
    </footer>
  );
};

export default Footer;
