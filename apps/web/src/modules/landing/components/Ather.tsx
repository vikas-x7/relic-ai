'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

import { IoIosArrowDown, IoMdArrowUp, IoMdPlay } from 'react-icons/io';
import { MdArrowForward, MdOutlineFullscreenExit } from 'react-icons/md';
import { CiMemoPad } from 'react-icons/ci';
import { IoAddOutline, IoMicOutline } from 'react-icons/io5';
import { FcGoogle } from 'react-icons/fc';

export default function Ather() {
  const placeholders = [
    'How do I branch a conversation to explore different ideas without ever losing the parent context of my original chat?',
    'What is the benefit of using an infinite canvas?',
    'How does Relic AI build a connected knowledge graph of conversations?',
    'Can I ask follow up questions in a node?',
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
    <section className="relative ">
      <div className="md:mt z-10  flex items-start justify-center text-center ">
        <div className="relative flex w-full items-center justify-center overflow-hidden border-dashed border-white/10 md:w-[90vw] md:border-x">
          <div className="w-full flex-col items-center justify-center">
   

            <div className="relative mx-auto mt-5 inline-block w-[330px] p-0.5 md:w-full md:max-w-2xl text-black">
              <span className="absolute top-0 left-0 h-2 w-2 border-t-2 border-l-2 border-black/70 md:h-4 md:w-4" />
              <span className="absolute top-0 right-0 h-2 w-2 border-t-2 border-r-2 border-black/70 md:h-4 md:w-4" />
              <span className="absolute bottom-0 left-0 h-2 w-2 border-b-2 border-l-2 border-black/70 md:h-4 md:w-4" />
              <span className="absolute right-0 bottom-0 h-2 w-2 border-r-2 border-b-2 border-black/70 md:h-4 md:w-4" />

              <div className="w-full backdrop-blur-md">
                <div className="relative flex flex-col border border-black/10 shadow-xl">
                  <textarea
                    className="h-10 w-full resize-none bg-transparent px-3 pt-2 text-[8px] leading-relaxed text-black placeholder-black/80 outline-none md:h-20 md:px-4 md:pt-4 md:text-[14px]"
                    rows={3}
                    placeholder={currentPlaceholder + '|'}
                  />

                  <div className="flex flex-row items-center justify-between border-t border-[#191919] px-3 py-1 sm:px-4 md:py-2">
                    <div className="flex items-center">
                      <button className="flex items-center gap-1 rounded-sm border border-[#191919] px-2 py-1 text-[8px] font-medium text-black transition-colors hover:bg-white/5 md:gap-2 md:text-[12px]">
                        <FcGoogle className="text-[9px] md:text-[14px]" />
                        <span>Gemma 2</span>
                        <IoIosArrowDown className="opacity-70" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="flex items-center gap-1 sm:gap-2">
                        <button className="flex h-6 w-6 items-center justify-center rounded-[2px] border border-[#191919] text-black transition-colors hover:bg-white/5 sm:h-7 sm:w-7">
                          <MdOutlineFullscreenExit className="text-[13px] md:text-[18px]" />
                        </button>

                        <button className="flex h-6 w-6 items-center justify-center rounded-[2px] border border-[#191919] text-black transition-colors hover:bg-white/5 sm:h-7 sm:w-7">
                          <IoMicOutline className="text-[13px] md:text-[18px]" />
                        </button>

                        <button className="flex h-6 w-6 items-center justify-center rounded-[2px] border border-[#191919] text-black transition-colors hover:bg-white/5 sm:h-7 sm:w-7">
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
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
