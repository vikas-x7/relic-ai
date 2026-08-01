'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { HiOutlineX } from 'react-icons/hi';
import { MdArrowForward } from 'react-icons/md';
import { LiaGripLinesSolid } from 'react-icons/lia';
import { BiSolidSquare } from 'react-icons/bi';
import { FiLogIn } from 'react-icons/fi';

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
    <nav className="font-cabin fixed top-0 left-0 right-0 z-50 px-2 sm:px-20 ">
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
              <img
                src="https://i.pinimg.com/736x/bd/26/66/bd2666c8166b5c90afd47b36f428cc25.jpg"
                alt=""
                className="w-6 mr-1 grayscale mix-blend-multiply"
              />
              <h1 className="text-[19px] font-semibold tracking-[-0.5px] mt-[0.5px]">Relic AI </h1>
            </Link>
            {NAV_LINKS.map((link) => (
              <NavItem
                key={link.id}
                {...link}
                className="text-[14px] hover:opacity-70  mt-1 transition-opacity tracking-[-0.2px]"
              />
            ))}
          </div>

          <div className="flex lg:hidden items-center gap-2 bg-black/5 px-3 py-1.5 rounded-[3px] backdrop-blur-md">
            <Link href="/" className="flex items-center gap-2">
              <BiSolidSquare size={20} className="text-[#000000]" />
              <h1 className="text-[16px] font-bold tracking-[-1px]">Relic ai </h1>
            </Link>
          </div>

          <div className="relative">
            <Link
              className="text-sm flex items-center gap-2 tracking-[-0.5px] sm:tracking-[-0.2px] cursor-pointer bg-[#F0F0F0] px-3 py-1.5 rounded-[3px] backdrop-blur-md"

              aria-label="Toggle Menu"
              href={'/auth'}
            >
              <span>Login</span>

              <FiLogIn />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
