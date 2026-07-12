'use client';

import React from 'react';
import Link from 'next/link';
import { FaLinkedinIn, FaXTwitter } from 'react-icons/fa6';
import { FiArrowUpRight } from 'react-icons/fi';

const Hero = () => {
  return (
    <div className="w-full font-cabin bg-white text-black pt-12 sm:pt-16 md:pt-20 border-t border-black/20 border-dashed mt-16 sm:mt-24 md:mt-30 overflow-hidden px-12">
      <div className="">
        <div className="px-4 sm:px-6 md:px-4 mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
            <Link
              href="/auth"
              className="inline-flex text-[13px] sm:text-[14px] items-center ml-[-5] justify-center gap-2 bg-[#101010] text-white px-3 py-1 sm:py-1 rounded-[3px] font-medium hover:bg-gray-800 transition-colors w-fit"
            >
              Getstart now
              <FiArrowUpRight size={14} />
            </Link>

            <div className="flex gap-4 text-black/60 sm:text-white/30">
              <Link href="#" className="hover:text-black sm:hover:text-white transition-colors">
                <FaXTwitter size={14} />
              </Link>
              <Link href="#" className="hover:text-black sm:hover:text-white transition-colors">
                <FaLinkedinIn size={14} />
              </Link>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8 mb-12">
            <div className="flex items-center gap-3">
              <img
                src="https://i.pinimg.com/1200x/de/c8/b9/dec8b90206c23c3c48b05d39bea187c1.jpg"
                alt="Flag of India"
                className="w-8 sm:w-10 "
              />
              <div className="text-[4px] sm:text-[10px] text-black">
                <p>Based In The Beautiful</p>
                <p>India & Online Worldwide</p>
              </div>
            </div>

            <div className="flex flex-row sm:flex-col items-start sm:items-end gap-6 sm:gap-3 text-sm text-black font-medium">
              <Link href="#" className="hover:text-black/50 transition-colors font-light">
                Home
              </Link>
              <Link href="#" className="hover:text-black/50 transition-colors font-light ">
                Get start
              </Link>
              <Link href="#" className="hover:text-black/50 transition-colors font-light">
                Working
              </Link>
            </div>
          </div>
        </div>

        <div>
          <div className="px-4 sm:px-6 md:px-4">
            <p className="text-sm text-black mb-2 tracking-[-0.5px] leading-none">
              As we believe at relic ai
            </p>
            <h2 className="text-xl md:text-2xl  mb-8 sm:mb-10 tracking-[-1px]">
              Anything less than seamless automation is a compromise.
            </h2>
          </div>

          <h1 className="text-[16vw] sm:text-[18vw] md:text-[17.3vw] text-[#010101] font-bold overflow-hidden tracking-tight sm:tracking-[-20px] md:tracking-[-20px] ml-[-4px] sm:ml-[-10px] leading-[0.8] sm:leading-[200px] md:leading-[250px] whitespace-nowrap select-none px-1">
            Relicaicanvas ai
          </h1>
        </div>
      </div>
    </div>
  );
};

export default Hero;
