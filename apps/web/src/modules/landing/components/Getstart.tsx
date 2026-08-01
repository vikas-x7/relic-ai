export default function Getstart() {
  return (
    <div className="relative py-16 sm:py-24 md:py-32 overflow-hidden bg-white text-black font-cabin">
      <div className="flex flex-col items-center justify-center px-4 sm:px-8 text-center max-w-4xl mx-auto">
        <p className="text-base text-black mb-2 tracking-[-0.5px] leading-none">
          We believe at Relic AI
        </p>
        <h2 className="text-[1rem] md:text-xl md:text-2xl mb-8 sm:mb-10 tracking-[-0.5px] sm:tracking-[-0.5px]">
          A canvas where your thinking has no edges no dead ends and no direction it cannot explore
        </h2>

        <div className="relative inline-block p-2 sm:p-3 md:p-4 max-w-full">
          <span className="absolute top-0 left-0 h-3 w-3 border-t-2 border-l-2 border-black/60 sm:h-4 sm:w-4" />
          <span className="absolute top-0 right-0 h-3 w-3 border-t-2 border-r-2 border-black/60 sm:h-4 sm:w-4" />
          <span className="absolute bottom-0 left-0 h-3 w-3 border-b-2 border-l-2 border-black/60 sm:h-4 sm:w-4" />
          <span className="absolute right-0 bottom-0 h-3 w-3 border-r-2 border-b-2 border-black/60 sm:h-4 sm:w-4" />

          <h1 className="border border-dashed border-black/40 px-3 py-3 sm:px-6 sm:py-8 md:px-8 md:py-10 text-[20px] xs:text-[26px] sm:text-[45px] md:text-[75px] lg:text-[100px] xl:text-[100px] leading-none font-bold -tracking-[1px] md:-tracking-[4px] lg:-tracking-[7px]">
            Getstart with Relic AI
          </h1>
        </div>
      </div>
    </div>
  );
}
