'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { HiOutlineX } from 'react-icons/hi';
import { MdArrowForward } from 'react-icons/md';
import { LiaGripLinesSolid } from 'react-icons/lia';
import { BiSolidSquare } from 'react-icons/bi';

const NAV_LINKS = [
  { name: 'Works', id: 'works' },
  { name: 'About', id: 'about' },
  { name: 'Labs', id: 'labs' },
  { name: 'Contact', id: 'contact' },
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
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const NavItem = ({ name, id, className }: { name: string; id: string; className?: string }) => (
    <button onClick={() => handleSmoothScroll(id)} className={className}>
      {name}
    </button>
  );

  return (
    <nav className="font-cabin fixed top-0 left-0 right-0 z-50 px-2 sm:px-12 ">
      <div className="bg-[#F0F0F0] rounded-[2px] text-black w-full h-8 text-center flex items-center justify-center overflow-hidden px-4 mask-[linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
        <p className="flex items-center gap-2  text-xs sm:text-sm whitespace-nowrap">
          Relic ai the beta version is here <MdArrowForward />
        </p>
      </div>

      <div className="container mx-auto">
        <div className="flex h-12  items-center justify-between">
          <div className="hidden lg:flex items-center gap-5 bg-[#F0F0F0]  px-3 py-2 rounded-[3px] transition-colors duration-300 ">
            <Link href="/" className="flex items-center">
              {/* <BiSolidSquare size={23} className="text-[#171717]" /> */}
              <img src="https://i.pinimg.com/736x/bd/26/66/bd2666c8166b5c90afd47b36f428cc25.jpg" alt="" className="w-6 mr-1 grayscale mix-blend-multiply" />
              <h1 className="text-[19px] font-semibold tracking-[-0.5px] mt-[0.5px]">Relic AI </h1>
            </Link>
            {NAV_LINKS.map((link) => (
              <NavItem key={link.id} {...link} className="text-[14px] hover:opacity-70  mt-1 transition-opacity tracking-[-0.5px]" />
            ))}
          </div>

          <div className="flex lg:hidden items-center gap-2 bg-black/5 px-3 py-1.5 rounded-[3px] backdrop-blur-md">
            <Link href="/" className="flex items-center gap-2">
              <BiSolidSquare size={20} className="text-[#000000]" />
              <h1 className="text-[16px] font-bold tracking-[-1px]">Relic ai </h1>
            </Link>
          </div>

          <div className="relative">
            <button
              className="text-sm flex items-center gap-2 tracking-[-0.5px] sm:tracking-[-0.5px] cursor-pointer bg-[#F0F0F0] px-3 py-1.5 rounded-[3px] backdrop-blur-md"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle Menu"
            >
              <span>Menu</span>
              {isOpen ? <HiOutlineX size={24} /> : <LiaGripLinesSolid size={24} />}
            </button>

            <div
              className={`absolute right-0 top-12 mt-2 w-[calc(100vw-2.5rem)] sm:w-94 max-w-sm bg-[#1F1F1F] text-white p-6 shadow-2xl rounded-[4px] border border-black/5 transition-transform duration-500 ease-out z-50 ${
                isOpen ? 'translate-x-0 pointer-events-auto' : 'translate-x-[200%] pointer-events-none'
              }`}
            >
              <div className="flex flex-col gap-2 mb-6">
                {NAV_LINKS.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => handleSmoothScroll(link.id)}
                    className="text-[22px] sm:text-[25px] font-light tracking-[-1px] text-left text-white/80 hover:text-white transition-colors"
                  >
                    {link.name}
                  </button>
                ))}
              </div>

              <div className="border-t border-white/10 pt-4 flex flex-col sm:flex-row justify-between gap-4 text-[14px] sm:text-[15px] text-white">
                <div className="flex gap-4 font-light text-white/80">
                  <Link href="#" className="hover:text-white transition-colors">
                    LinkedIn
                  </Link>
                  <Link href="#" className="hover:text-white transition-colors">
                    Twitter
                  </Link>
                </div>
                <Link href="#" className="hover:text-white transition-colors font-light text-white/80">
                  Privacy policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
