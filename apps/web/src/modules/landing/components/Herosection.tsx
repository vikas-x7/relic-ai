'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

import { IoIosArrowDown, IoMdArrowUp, IoMdPlay } from 'react-icons/io';
import { MdArrowForward, MdOutlineArrowOutward, MdOutlineFullscreenExit } from 'react-icons/md';
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
    <section className="relative text-black font-cabin mt-30 flex flex-col py-12 sm:py-16 md:py-20 sm:mt-16 sm:mt-20 mb-6 sm:mb-10 px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20">
      <div className="flex items-center justify-between w-full mb-8 sm:mb-12">
        <div className="flex items-center gap-3">
          <Image
            width={100}
            height={100}
            priority
            src="/images/pinktree.jpg"
            alt="Based in India"
            className="w-6 sm:w-10 "
          />

          <div className="text-[0.5rem] md:text-[0.85rem] text-black">
            <p>Based In The Beautiful</p>
            <p>India & Online Worldwide</p>
          </div>
        </div>

        <div className="hidden sm:flex flex-col items-end text-start gap-3 text-black font-medium">
          <Link href="#" className="hover:text-black/50 transition-colors font-light">
            Canvas
          </Link>
          <Link href="#" className="hover:text-black/50 transition-colors font-light">
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

      <div className="w-full">
        <div className="w-full flex flex-col items-start justify-center">
          <h1 className="text-[23px] tracking-[-1.5px] leading-7 font-semibold md:-tracking-[3.5px] text-black md:text-3xl md:text-[54px] md:leading-14">
            Your thoughts Don&apos;t Flow in a Straight <br /> Line Your AI should not Either
          </h1>

          <p className="mt-3 text-[9px] md:text-[1rem] text-black/90 -tracking-[0.1px]">
            Relic AI gives your ideas a canvas. Start a conversation, branch mid-thought, and
            <br /> build a living map of your thinking without ever losing
          </p>

          <div className="mx-auto mt-4 flex w-full items-center justify-start md:mt-8 md:w-full">
            <Link
              onClick={() =>
                document.getElementById('demo-video')?.scrollIntoView({ behavior: 'smooth' })
              }
              className="mr-3 flex cursor-pointer items-center gap-1.5 bg-[#000000] text-white rounded-[3px] px-3 py-1 text-[10px] font-medium md:px-8 md:py-2 md:text-[14px]"
              href={'/chat'}
            >
              Get start now
              <MdOutlineArrowOutward size={20} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
