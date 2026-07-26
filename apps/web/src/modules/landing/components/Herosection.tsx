'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

import { IoIosArrowDown, IoMdArrowUp, IoMdPlay } from 'react-icons/io';
import { MdArrowForward, MdOutlineFullscreenExit } from 'react-icons/md';
import { CiMemoPad } from 'react-icons/ci';
import { IoAddOutline, IoMicOutline } from 'react-icons/io5';
import { FcGoogle } from 'react-icons/fc';
import MovingHanding from '@/src/modules/landing/components/MovingHading';
import Image from 'next/image';

export default function Hero() {
  const placeholders = [
    'When a lead fills out our demo form, enrich them and route hot ones to the right rep on Slack',
    'Design a scalable microservices architecture for an e-commerce platform',
    'Create a system flow for a real-time chat application with WebSockets',
    'Map out the authentication flow using NextAuth and PostgreSQL',
  ];

  const [currentPlaceholder, setCurrentPlaceholder] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const typingSpeed = isDeleting ? 3 : 20;
    const currentText = placeholders[placeholderIndex];

    const handleTyping = () => {
      if (!isDeleting && charIndex < currentText.length) {
        setCurrentPlaceholder(currentText.substring(0, charIndex + 1));
        setCharIndex((prev) => prev + 1);
      } else if (isDeleting && charIndex > 0) {
        setCurrentPlaceholder(currentText.substring(0, charIndex - 1));
        setCharIndex((prev) => prev - 1);
      } else if (!isDeleting && charIndex === currentText.length) {
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && charIndex === 0) {
        setIsDeleting(false);
        setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, placeholderIndex]);

  return (
    <section className="relative text-black font-cabin px-10 h-screen flex flex-col  justify-center">
      <div className="">
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
      <div className=" ">
        <div className="">
          <div className="w-full flex-col items-center justify-center">
            {/* <p className="mb-2 inline-block rounded-4xl border border-black/10 border-dashed px-4 py-1 text-[10px] tracking-[0] backdrop-blur-md md:mb-6 md:px-4 md:py-1.5 md:text-[13px] md:-tracking-[0.1px] text-black/80">
              A canvas where every thought gets its own space to grow
            </p> */}

            <h1 className="text-[23px]  font-medium -tracking-[4px] text-[#252724] md:text-3xl md:text-[54px] md:leading-14 ">
              Your thoughts Don&apos;t Flow in a Straight <br /> Line Your AI should not Either
            </h1>

            <p className="mt-3 text-[9px]  md:text-[1rem]  text-black/60  -tracking-[0.1px]">
              Relic AI gives your ideas a canvas. Start a conversation, branch mid-thought, and
              <br /> build a living map of your thinking without ever losing
            </p>

            <div className="mx-auto mt-4 flex w-full items-center justify-start md:mt-8 md:w-full">
              <button
                onClick={() =>
                  document.getElementById('demo-video')?.scrollIntoView({ behavior: 'smooth' })
                }
                className="mr-3 flex cursor-pointer items-center gap-1 bg-[#1d1d1c] text-white rounded-[6px] border border-black/10 px-3 py-1 text-[10px] font-medium   md:px-8 md:py-2 md:text-[14px] "
              >
                See How it work
              </button>

              <Link
                href="/chat"
                className="flex items-center gap-1 px-2 py-1 text-[10px] font-medium  text-black md:px-7 md:py-1.5 md:text-[14px]"
              >
                Get start now <MdArrowForward />
              </Link>
            </div>

            {/* <MovingHanding /> */}
            {/* <div className="relative mx-auto mt-5 inline-block w-[330px] p-0.5 md:w-full md:max-w-2xl mt-20">
              <span className="absolute top-0 left-0 h-2 w-2 border-t-2 border-l-2 border-black/70 md:h-4 md:w-4" />
              <span className="absolute top-0 right-0 h-2 w-2 border-t-2 border-r-2 border-black/70 md:h-4 md:w-4" />
              <span className="absolute bottom-0 left-0 h-2 w-2 border-b-2 border-l-2 border-black/70 md:h-4 md:w-4" />
              <span className="absolute right-0 bottom-0 h-2 w-2 border-r-2 border-b-2 border-black/70 md:h-4 md:w-4" />

              <div className="w-full backdrop-blur-md">
                <div className="relative flex flex-col border border-black/10 shadow-xl">
                  <textarea
                    className="h-10 w-full resize-none bg-transparent px-3 pt-2 text-[8px] leading-relaxed  placeholder-black/80 outline-none md:h-20 md:px-4 md:pt-4 md:text-[14px]"
                    rows={3}
                    placeholder={currentPlaceholder + '|'}
                  />

                  <div className="flex flex-row items-center justify-between border-t border-black/20 px-3 py-1 sm:px-4 md:py-2">
                    <div className="flex items-center">
                      <button className="flex items-center gap-1 rounded-sm border border-[#191919] px-2 py-1 text-[8px] font-medium  transition-colors hover:bg-white/5 md:gap-2 md:text-[12px]">
                        <FcGoogle className="text-[9px] md:text-[14px]" />
                        <span>Gemma 2</span>
                        <IoIosArrowDown className="opacity-70" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="flex items-center gap-1 sm:gap-2">
                        <button className="flex h-6 w-6 items-center justify-center rounded-[2px] border border-[#191919]  transition-colors hover:bg-white/5 sm:h-7 sm:w-7">
                          <MdOutlineFullscreenExit className="text-[13px] md:text-[18px]" />
                        </button>

                        <button className="flex h-6 w-6 items-center justify-center rounded-[2px] border border-[#191919]  transition-colors hover:bg-white/5 sm:h-7 sm:w-7">
                          <IoMicOutline className="text-[13px] md:text-[18px]" />
                        </button>

                        <button className="flex h-6 w-6 items-center justify-center rounded-[2px] border border-[#191919]  transition-colors hover:bg-white/5 sm:h-7 sm:w-7">
                          <IoAddOutline className="text-[13px] md:text-[18px]" />
                        </button>
                      </div>

                      <button className="flex h-5 w-5 items-center justify-center rounded-[2px] bg-white text-black transition-transform hover:scale-105 active:scale-95 sm:h-7 sm:w-7">
                        <IoMdArrowUp className="text-[13px] md:text-[18px]" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </section>
  );
}
