import MovingHanding from './MovingHading';

export default function Hero() {
  return (
    <section className="relative w-full flex flex-col overflow-hidden text-[#1a1a1a]">
      <div className="pointer-events-none absolute inset-0 z-0 opacity-15"></div>

      <div className="relative z-110">
        <MovingHanding />
      </div>

      <div className="relative z-10 w-full flex justify-center -mt-8 ">
        <h1 className="text-[28vw] leading-[0.50] font-bold tracking-[-0.06em] text-[#1C1A16] select-none font-cabin">relicainot</h1>
      </div>

      <div className="flex items-center justify-center w-full mt-30">
          <button className="rounded-[7px] bg-white px-3 py-[6px] tracking-[-0.75px] text-sm font-medium shadow-sm flex items-center gap-2">
       Infinite Canvas AI
          </button>

          <div className="w-8 md:w-16 h-[1px] bg-gray-200"></div>

          <button className="rounded-[7px] bg-white px-3 py-[6px]  tracking-[-0.75px] border border-gray-200/60 bg-white/40 px-5 py-2.5 text-sm font-medium flex items-center gap-2 hover:bg-white transition-colors">
           Branch at any point
          </button>
        </div>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center w-full px-6 pb-8 md:mb-10">
      

        <h2 className="text-3xl md:text-5xl lg:text-[3.5rem]  leading-tight mt-10  text-center tracking-[-2px] font-larken">The infinite canvas workspace for ai conversion</h2>

        <p className="text-sm md:text-base  font-cabin lg:text-[16px] text-black tracking-[px] max-w-[49rem] mx-auto leading-relaxed mb-8 text-center">
          Relic AI is a visual workspace built on an infinite canvas. You can create new branches from any message, inherit context automatically, and organize complex research into connected knowledge graphs.
        </p>

        <button className="bg-[#1a1a1a] text-white rounded-[10px] px-7 py-3 text-sm md:text-base font-medium flex items-center gap-2 hover:bg-black transition-transform cursor-pointer">
          Start branching now
        </button>
      </div>

      <div className="px-6">
        <video className="rounded-[10px] " autoPlay loop muted playsInline src="https://res.cloudinary.com/dyv9kenuj/video/upload/v1778740598/relicdemov1_1_aurpo2.mp4"></video>
      </div>
    </section>
  );
}
