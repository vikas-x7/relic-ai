'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { HiOutlineX } from 'react-icons/hi';
import { MdArrowForward } from 'react-icons/md';
import { LiaGripLinesSolid } from 'react-icons/lia';
import { FiLogIn } from 'react-icons/fi';

const NAV_LINKS = [
  { name: 'Works', id: 'works' },
  { name: 'About', id: 'about' },
  { name: 'FAQ', id: 'faq' },
  { name: 'Pricing', href: '/pricing' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOverFooter, setIsOverFooter] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > window.innerHeight - 50);
      const footer = document.getElementById('footer');
      if (!footer) return setIsOverFooter(false);

      const footerBounds = footer.getBoundingClientRect();
      setIsOverFooter(footerBounds.top <= 72 && footerBounds.bottom > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSmoothScroll = (id: string) => {
    setIsOpen(false);
    const el = document.getElementById(id);
    if (!el) return;
    const navOffset = 96;
    const top = el.getBoundingClientRect().top + window.scrollY - navOffset;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  const NavItem = ({
    name,
    id,
    href,
    className,
  }: {
    name: string;
    id?: string;
    href?: string;
    className?: string;
  }) =>
    href ? (
      <Link href={href} onClick={() => setIsOpen(false)} className={className}>
        {name}
      </Link>
    ) : (
      <button onClick={() => id && handleSmoothScroll(id)} className={className}>
        {name}
      </button>
    );

  return (
    <nav className="font-cabin fixed top-0 left-0 right-0 z-50">
      <div className="max-w-[1640px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 ">
        <div className="bg-[#F0F0F0] rounded-[2px] text-black w-full h-8 text-center flex items-center justify-center overflow-hidden px-4 mask-[linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
          <p className="flex items-center gap-2 text-xs sm:text-sm whitespace-nowrap">
            Relic ai the beta version is here <MdArrowForward />
          </p>
        </div>

        <div className="flex h-12 items-center justify-between mt-1">
          <div className="hidden lg:flex items-center gap-5 bg-[#F0F0F0] px-3 py-2 rounded-[3px] transition-colors duration-300">
            <Link href="/" className="flex items-center ">
              <img
                src="https://i.pinimg.com/736x/ae/ab/b5/aeabb51bc53443992e48787480e292e5.jpg"
                alt="Relic AI"
                className="w-5 mr-1 grayscale mix-blend-multiply"
              />
              <h1 className="text-[19px] font-semibold tracking-[-1px] mt-[0.5px]">Relic AI</h1>
            </Link>
            {NAV_LINKS.map((link) => (
              <NavItem
                key={link.id ?? link.href}
                {...link}
                className="text-[14px] hover:opacity-70 mt-1 transition-opacity tracking-[-0.2px] cursor-pointer"
              />
            ))}
          </div>

          <div className="flex lg:hidden items-center gap-2 bg-[#F0F0F0] px-3 py-1.5 rounded-[3px] backdrop-blur-md">
            <Link href="/" className="flex items-center gap-2">
              <img
                src="https://i.pinimg.com/736x/bd/26/66/bd2666c8166b5c90afd47b36f428cc25.jpg"
                alt="Relic AI"
                className="w-5 mr-1 grayscale mix-blend-multiply"
              />
              <h1 className="text-[16px] font-bold tracking-[-1px]">Relic AI</h1>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Link
              className="hidden lg:flex text-sm items-center gap-2 tracking-[-0.5px] sm:tracking-[-0.2px] cursor-pointer bg-[#F0F0F0] px-3 py-1.5 rounded-[3px] backdrop-blur-md text-black hover:opacity-80 transition-opacity"
              href={'/auth'}
            >
              <span>Login</span>
              <FiLogIn />
            </Link>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden flex items-center justify-center p-2 bg-[#F0F0F0] rounded-[3px] text-black hover:bg-black/10 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <HiOutlineX size={20} /> : <LiaGripLinesSolid size={20} />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="lg:hidden mt-2 bg-[#F0F0F0] p-4 rounded-[4px] shadow-lg flex flex-col gap-3 border border-black/10 animate-backdrop-in">
            {NAV_LINKS.map((link) => (
              <NavItem
                key={link.id ?? link.href}
                {...link}
                className="text-left text-sm font-medium text-black/80 hover:text-black py-1 transition-colors border-b border-black/5 cursor-pointer"
              />
            ))}
            <Link
              href={'/auth'}
              onClick={() => setIsOpen(false)}
              className="text-left text-sm font-semibold text-black hover:opacity-80 py-1.5 transition-colors flex items-center justify-between"
            >
              <span>Login</span>
              <FiLogIn />
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
