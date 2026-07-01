'use client';
import { SiOpenid, SiFigma, SiMeta, SiGithub } from 'react-icons/si';
import { FaBolt, FaBrain, FaStar } from 'react-icons/fa';
import { TbHexagon } from 'react-icons/tb';
import { BsAsterisk } from 'react-icons/bs';

export default function Integrations() {
  // Array mein components ko import karke rakha hai
  const logos = [
    { icon: FaStar },
    { icon: SiFigma },
    { icon: FaStar },
    { icon: FaBrain },
    { icon: SiMeta },
    { icon: SiGithub },
    { icon: TbHexagon },
    { icon: FaStar },
    { icon: SiFigma },
    { icon: FaStar },
    { icon: FaBrain },
    { icon: SiMeta },
    { icon: SiGithub },
    { icon: TbHexagon },
    { icon: TbHexagon },
  ];

  return (
    <section className="text-white pb-54 ">
      {/* Header */}
      <div className="mb-20 flex items-end justify-end px-12 ">
        <div className="w-4xl text-end">
          <div className="text-[15px] uppercase ml-7 text-white/50 mb-6 flex items-center gap-2">
            <span>
              <BsAsterisk />
            </span>{' '}
            INTEGRATIONS
          </div>
          <h2 className="text-4xl md:text-3xl font-medium leading-[1.1] text-[#FAFAFA] tracking-tighter">
            Armory bridges the gap between your data and your tools.
            <span> Deploy agents that live where you work, from Slack to GitHub and beyond.</span>
          </h2>
        </div>
      </div>

      {/* Logo Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 border-t border-dashed border-l border-white/10 ">
        {logos.map((item, index) => {
          const Icon = item.icon; // Component ko variable mein assign kiya
          return (
            <div
              key={index}
              className="h-42 border-b border-r border-dashed border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all duration-300 hover:bg-white/5 cursor-pointer"
            >
              <Icon className="text-4xl" />
            </div>
          );
        })}
      </div>
    </section>
  );
}
