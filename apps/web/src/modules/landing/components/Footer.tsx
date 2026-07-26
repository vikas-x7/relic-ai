'use client';

import React from 'react';
import Link from 'next/link';
import { FaLinkedinIn, FaXTwitter } from 'react-icons/fa6';
import { FiArrowUpRight } from 'react-icons/fi';
import Image from 'next/image';

const Footer = () => {
  return (
    <div className="font-cabin text-black px-3 sm:px-12 h-dvh pt-20 pb-6 sm:pt-24 sm:pb-8 ">
      <div className="w-full h-full flex flex-col justify-between ">
        <div className="md:px-4 mt-23 sm:mt-30 ">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10 sm:mb-0">
            <Link
              href="/auth"
              className="inline-flex text-[13px] sm:text-[14px] items-center ml-[-5] justify-center gap-2 bg-[#010101] text-white px-3 py-1 sm:py-1.5 rounded-[2px] font-medium hover:bg-gray-800 transition-colors w-fit"
            >
              Getstart Now
              <FiArrowUpRight size={20} />
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8 mb-12">
            <div className="flex items-center gap-3">
              <Image
                width={100}
                height={100}
                priority
                src="/images/pinktree.jpg"
                alt="Based in India"
                className="w-8 sm:w-10"
              />
              <div className="text-[0.7rem] md:text-[0.85rem] text-black">
                <p>Based In The Beautiful</p>
                <p>India & Online Worldwide</p>
              </div>
            </div>

            <div className="hidden sm:flex flex-col items-end text-start gap-3  text-black font-medium">
              <Link href="#" className="hover:text-black/50 transition-colors font-light ">
                Canvas
              </Link>
              <Link href="#" className="hover:text-black/50 transition-colors font-light ">
                Nodes
              </Link>
              <Link href="#" className="hover:text-black/50 transition-colors font-light">
                Branching
              </Link>
              <Link href="#" className="hover:text-black/50 transition-colors font-light">
                Memory
              </Link>
            </div>
          </div>
        </div>

        <div>
          <div className=" sm:px-6 md:px-4">
            <p className="text-sm text-black mb-2 tracking-[-0.5px] leading-none">
              We believe at Relic AI
            </p>
            <h2 className="text-[1rem] md:text-xl md:text-2xl  mb-8 sm:mb-10 tracking-[-0.5px] sm:tracking-[-1px]">
              A canvas where your thinking has no edges, no dead ends, and no direction it cannot
              explore.
            </h2>
          </div>

          <h1 className="text-[17vw] sm:text-[18vw] md:text-[17.3vw] text-[#010101] font-bold overflow-hidden tracking-[-4.5px] sm:tracking-[-20px] md:tracking-[-20px] ml-[-4px] sm:ml-[-10px] leading-[0.8] sm:leading-[200px] md:leading-[250px] whitespace-nowrap select-none px-1">
            Relicaicanvas ai
          </h1>
        </div>
      </div>
    </div>
  );
};

export default Footer;
