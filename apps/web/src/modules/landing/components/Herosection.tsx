import Link from 'next/link';
import { MdOutlineArrowOutward } from 'react-icons/md';
import Image from 'next/image';

export default function Hero() {
  return (
    <section className="relative text-black font-cabin mt-30 flex flex-col py-12 sm:py-16 md:py-20 sm:mt-16 sm:mt-10 mb-6 sm:mb-10 px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20">
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
