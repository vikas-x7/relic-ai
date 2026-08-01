'use client';

import React from 'react';
import Link from 'next/link';
import { FaInstagram, FaLinkedinIn, FaXTwitter } from 'react-icons/fa6';

const Footer = () => {
  return (
    <footer
      id="footer"
      className="font-cabin text-black w-full pt-12 sm:pt-16 md:pt-24 pb-0 flex flex-col justify-between bg-white border-t border-black/5"
    >
      <div className="w-full flex-1 flex flex-col justify-between pb-0">
        {/* Upper Footer Links & Brand */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 pt-4 pb-12 sm:pb-16 px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20">
          {/* Brand & Socials Section */}
          <div className="space-y-4 sm:col-span-2 md:col-span-2">
            <div className="flex items-center gap-1 select-none">
              <img
                src="https://i.pinimg.com/736x/bd/26/66/bd2666c8166b5c90afd47b36f428cc25.jpg"
                alt="Relic AI Logo"
                className="w-8 h-8 md:w-8 md:h-8 object-contain"
              />
              <h1 className="text-2xl md:text-3xl font-bold tracking-[-2px]">Relic AI</h1>
            </div>

            <p className="text-sm text-black/60 max-w-sm leading-relaxed">
              Breathing canvas where your conversations don&apos;t just happen, they grow.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <Link
                href="https://x.com/Relic__ai"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (Twitter)"
                className="flex h-9 w-9 items-center justify-center rounded border border-black/10 text-black/60 transition-all hover:border-black/30 hover:bg-black/5 hover:text-black"
              >
                <FaXTwitter size={15} />
              </Link>
              <Link
                href="https://www.linkedin.com/company/relic-ai/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="flex h-9 w-9 items-center justify-center rounded border border-black/10 text-black/60 transition-all hover:border-black/30 hover:bg-black/5 hover:text-black"
              >
                <FaLinkedinIn size={15} />
              </Link>
              <Link
                href="https://www.instagram.com/relic__ai/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded border border-black/10 text-black/60 transition-all hover:border-black/30 hover:bg-black/5 hover:text-black"
              >
                <FaInstagram size={15} />
              </Link>
            </div>
          </div>

          {/* Company Section */}
          <div className="space-y-4">
            <h3 className="text-sm text-black">Company</h3>
            <ul className="flex flex-col gap-2.5 text-sm">
              <li>
                <Link href="#" className="text-black/60 transition-colors hover:text-black">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="#" className="text-black/60 transition-colors hover:text-black">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-black/60 transition-colors hover:text-black">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Features Section */}
          <div className="space-y-4">
            <h3 className="text-sm text-black">Features</h3>
            <ul className="flex flex-col gap-2.5 text-sm">
              <li>
                <Link href="#" className="text-black/60 transition-colors hover:text-black">
                  Canvas Nodes
                </Link>
              </li>
              <li>
                <Link href="#" className="text-black/60 transition-colors hover:text-black">
                  Branching
                </Link>
              </li>
              <li>
                <Link href="#" className="text-black/60 transition-colors hover:text-black">
                  Persistent Memory
                </Link>
              </li>
              <li>
                <Link href="#" className="text-black/60 transition-colors hover:text-black">
                  Multi AI Models
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="w-full overflow-hidden leading-none border-b-0 pb-0 mb-0">
          <h1 className="text-[17vw] sm:text-[18vw] md:text-[17.3vw] text-[#010101] font-bold overflow-hidden tracking-[-4.5px] sm:tracking-[-20px] md:tracking-[-34px] ml-[-4px] sm:ml-[-10px] leading-[0.72] sm:leading-[0.72] md:leading-[0.72] whitespace-nowrap select-none px-1 translate-y-[2%] block mb-0 pb-0">
            Relicaicanvas ai
          </h1>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
