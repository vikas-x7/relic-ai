import React from 'react';
import Link from 'next/link';
import { BiSolidSquare } from 'react-icons/bi';
import { FiGithub } from 'react-icons/fi';
import { FaGithub, FaInstagram, FaLinkedinIn, FaTwitter } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      id="footer"
      className="w-full  text-black pt-12 sm:pt-16 lg:pt-20 pb-8 px-6 sm:px-12 lg:px-20 border-t border-black/10"
    >
      <div className="mx-auto flex flex-col justify-between ">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              {/* Logo */}
              <div className="flex items-center gap-1">
                <img
                  src="https://i.pinimg.com/736x/ae/ab/b5/aeabb51bc53443992e48787480e292e5.jpg"
                  alt="Relic AI Logo"
                  className="w-6 h-6 md:w-7 md:h-7 object-contain"
                />
                <span className="text-xl sm:text-3xl font-bold tracking-[-2.5px]  text-black">
                  Relic AI
                </span>
              </div>

              {/* Subheading */}
              <p className="mt-8 sm:mt-7 text-sm sm:text-base md:text-[17px] tracking-[-0.5px] text-black/90 max-w-md ">
                Reach out to us to discover how our services can assist you in accomplishing your
                objectives.
              </p>

              <div className="w-full flex items-center  mt-10 gap-4">
                <h1 className="font-semibold tracking-[-1px]">Ask AI</h1>

                <img
                  src="https://thesvg.org/icons/openai-chatgpt/default.svg"
                  alt=""
                  className="w-4"
                />
                <img src="https://thesvg.org/icons/claude/default.svg" alt="" className="w-4" />
                <img src="https://thesvg.org/icons/perplexity/default.svg" alt="" className="w-4" />
                <img src="https://thesvg.org/icons/gemini/default.svg" alt="" className="w-4" />
                <img src="https://thesvg.org/icons/grok/light.svg" alt="" className="w-4" />
              </div>
            </div>
          </div>

          {/* Right Column: Nav Columns */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-12 lg:justify-end lg:pl-16 pt-1">
            {/* Social Column */}
            <div>
              <h3 className="text-[16px] font-semibold text-black  tracking-[-0.5px] mb-4 sm:mb-5">
                Social
              </h3>
              <ul className="space-y-3 text-xs sm:text-sm text-neutral-600">
                <li>
                  <a
                    href="https://x.com/Relic__ai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:text-black transition-colors"
                  >
                    Twitter
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.linkedin.com/company/relic-ai/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:text-black transition-colors"
                  >
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.instagram.com/relic__ai/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:text-black transition-colors"
                  >
                    Instagram
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/vikas-x7/cronix"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:text-black transition-colors"
                  >
                    GitHub
                  </a>
                </li>
              </ul>
            </div>

            {/* Product Column */}
            <div>
              <h3 className="text-[16px] font-semibold text-black  tracking-[-0.5px] mb-4 sm:mb-5">
                Product
              </h3>
              <ul className="space-y-3 text-xs sm:text-sm text-neutral-600">
                <li>
                  <Link href="/documentation" className="hover:text-black transition-colors">
                    How it works
                  </Link>
                </li>
                <li>
                  <a href="#features" className="hover:text-black transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-black transition-colors">
                    See Demo
                  </a>
                </li>
                <li>
                  <a href="#faq" className="hover:text-black transition-colors">
                    Faq
                  </a>
                </li>
                <li>
                  <Link href="/dashboard" className="hover:text-black transition-colors">
                    Get started
                  </Link>
                </li>
              </ul>
            </div>

            {/* Boring But Necessary Column */}
            <div>
              <h3 className="text-[16px] text-black font-semibold  tracking-[-0.5px] mb-4 sm:mb-5">
                Terms and Policy
              </h3>
              <ul className="space-y-3 text-xs sm:text-sm text-neutral-600">
                <li>
                  <Link href="/privacy-policy" className="hover:text-black transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms-of-service" className="hover:text-black transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/website-terms-of-use" className="hover:text-black transition-colors">
                    Website Terms of Use
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 sm:mt-24 lg:mt-32 pt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs text-neutral-600 ">
          <h1>©{currentYear} Relic AI all rights reserved</h1>

          <p>Made with all love 💗</p>
        </div>

        <div className="w-full overflow-hidden  mb-[-230px] mt-3 text-center">
          <h1 className="text-[17vw] sm:text-[18vw] md:text-[17.3vw] text-[#eeeeee] font-bold overflow-hidden tracking-[-7px] sm:tracking-[-20px] md:tracking-[-20px] ml-[-4px] sm:ml-[-10px] leading-[0.72] sm:leading-[0.72] md:leading-[0.72] whitespace-nowrap select-none ">
            TRY RELIC AI
          </h1>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
