'use client';

import React from 'react';
import Link from 'next/link';
import { FaGithub, FaInstagram, FaLinkedinIn, FaTwitter, FaXTwitter } from 'react-icons/fa6';

const Footer = () => {
  return (
    <footer
      id="footer"
      className="font-cabin text-black w-full pt-12 sm:pt-16 md:pt-10 pb-0 flex flex-col justify-between bg-white border-t border-black/10 px-10 relative"
    >
      <div className="w-full flex-1 flex flex-col justify-between pb-0">
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 md:gap-12 pt-4 pb-12 sm:pb-16 px-4 sm:px-8 md:px-12 lg:px-16 xl:px-7 mb-20 border-b border-black/10">
            <div className="space-y-4 sm:col-span-2 md:col-span-2">
              <div className="flex items-center gap-1 select-none">
                <img
                  src="https://i.pinimg.com/736x/ae/ab/b5/aeabb51bc53443992e48787480e292e5.jpg"
                  alt="Relic AI Logo"
                  className="w-6 h-6 md:w-6 md:h-6 object-contain"
                />
                <h1 className="text-2xl md:text-3xl font-bold tracking-[-2px] ml-[-2px]">
                  Relic AI
                </h1>
              </div>

              <p className="text-sm text-black/70 mt-[-13px] max-w-sm  tracking-[-0.3px]">
                Breathing canvas where your conversations <br /> don&apos;t just happen, they grow.
              </p>

              {/* Social Icons */}
              <div className="flex items-center gap-3 pt-2">
                <Link
                  href="https://x.com/Relic__ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="X (Twitter)"
                  className="flex h-8 w-8 items-center justify-center rounded border border-black/10 text-black transition-all hover:border-black/30 hover:bg-black/5 hover:text-black"
                >
                  <FaTwitter size={15} />
                </Link>
                <Link
                  href="https://www.linkedin.com/company/relic-ai/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="flex h-8 w-8 items-center justify-center rounded border border-black/10 text-black transition-all hover:border-black/30 hover:bg-black/5 hover:text-black"
                >
                  <FaLinkedinIn size={15} />
                </Link>
                <Link
                  href="https://www.instagram.com/relic__ai/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="flex h-8 w-8 items-center justify-center rounded border border-black/10 text-black transition-all hover:border-black/30 hover:bg-black/5 hover:text-black"
                >
                  <FaInstagram size={15} />
                </Link>
                <Link
                  href="https://www.instagram.com/relic__ai/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="flex h-8 w-8 items-center justify-center rounded border border-black/10 text-black transition-all hover:border-black/30 hover:bg-black/5 hover:text-black"
                >
                  <FaGithub size={15} />
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg text-black font-semibold tracking-[-1px]">Company</h3>
              <ul className="flex flex-col gap-2.5 text-sm">
                <li>
                  <Link href="#" className="text-black/70 transition-colors hover:text-black">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-black/70 transition-colors hover:text-black">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-black/70 transition-colors hover:text-black">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>

            {/* Features Section */}
            <div className="space-y-4">
              <h3 className="text-lg text-black font-semibold tracking-[-1px]">Features</h3>
              <ul className="flex flex-col gap-2.5 text-sm">
                <li>
                  <Link href="#" className="text-black/70 transition-colors hover:text-black">
                    Canvas Nodes
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-black/70 transition-colors hover:text-black">
                    Branching
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-black/70 transition-colors hover:text-black">
                    Persistent Memory
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-black/70 transition-colors hover:text-black">
                    Multi AI Models
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg text-black font-semibold tracking-[-1px]">Features</h3>
              <ul className="flex flex-col gap-2.5 text-sm">
                <li>
                  <Link href="#" className="text-black/70 transition-colors hover:text-black">
                    Canvas Nodes
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-black/70 transition-colors hover:text-black">
                    Branching
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-black/70 transition-colors hover:text-black">
                    Persistent Memory
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-black/70 transition-colors hover:text-black">
                    Multi AI Models
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="w-full flex items-center justify-center mb-30 gap-4">
            <h1 className="font-semibold tracking-[-1px]">Ask AI</h1>

            <img src="https://thesvg.org/icons/openai-chatgpt/default.svg" alt="" className="w-4" />
            <img src="https://thesvg.org/icons/claude/default.svg" alt="" className="w-4" />
            <img src="https://thesvg.org/icons/perplexity/default.svg" alt="" className="w-4" />
            <img src="https://thesvg.org/icons/gemini/default.svg" alt="" className="w-4" />
            <img src="https://thesvg.org/icons/grok/light.svg" alt="" className="w-4" />
          </div>
        </div>

        <div className="w-full overflow-hidden leading-none border-b-0 pb-0 mb-0 text-center">
          <h1 className="text-[17vw] sm:text-[18vw] md:text-[17.3vw] text-[#292929] font-bold overflow-hidden tracking-[-7px] sm:tracking-[-20px] md:tracking-[-20px] ml-[-4px] sm:ml-[-10px] leading-[0.72] sm:leading-[0.72] md:leading-[0.72] whitespace-nowrap select-none px-1 translate-y-[2%] block mb-0 pb-0 px-10">
            TRYRELICAI
          </h1>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent via-white/10 to-white/10" />
      </div>
    </footer>
  );
};

export default Footer;
