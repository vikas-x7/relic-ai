export default function Getstart() {
  return (
    <div className="relative h-[50vh] overflow-hidden md:h-[100vh] bg-white text-black font-cabin">
      <div className="pointer-events-none absolute inset-0 z-0 opacity-100">
        <svg className="h-full w-full" id="noice-getstart">
          <filter id="noise-filter-getstart">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="2"
              numOctaves="4"
              stitchTiles="stitch"
            ></feTurbulence>
            <feColorMatrix type="saturate" values="0"></feColorMatrix>
            <feComponentTransfer>
              <feFuncR type="linear" slope="3"></feFuncR>
              <feFuncG type="linear" slope="3"></feFuncG>
              <feFuncB type="linear" slope="3"></feFuncB>
              <feFuncA type="linear" slope="0.62"></feFuncA>
            </feComponentTransfer>
            <feComponentTransfer>
              <feFuncR type="linear" slope="0" intercept="0.50" />
              <feFuncG type="linear" slope="0" intercept="0.50" />
              <feFuncB type="linear" slope="0" intercept="0.50" />
            </feComponentTransfer>
          </filter>
          <rect width="100%" height="100%" filter="url(#noise-filter-getstart)"></rect>
        </svg>
      </div>

      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-4 text-center">
        <p className="mb-1 text-[18px] font-medium tracking-tight sm:text-[24px] md:text-[30px] md:-tracking-[1px]">
          Don&apos;t Go with flow
        </p>

        <div className="relative inline-block p-2 sm:p-3 md:p-4">
          <span className="absolute top-0 left-0 h-3 w-3 border-t-2 border-l-2 border-black/60 sm:h-4 sm:w-4" />

          <span className="absolute top-0 right-0 h-3 w-3 border-t-2 border-r-2 border-black/60 sm:h-4 sm:w-4" />

          <span className="absolute bottom-0 left-0 h-3 w-3 border-b-2 border-l-2 border-black/60 sm:h-4 sm:w-4" />

          <span className="absolute right-0 bottom-0 h-3 w-3 border-r-2 border-b-2 border-black/60 sm:h-4 sm:w-4" />

          <h1 className="border border-dashed border-black/40 px-5 py-4 pr-4 text-[32px] leading-none font-medium -tracking-[1px] sm:px-4 sm:py-10 sm:pr-5 sm:text-[60px] md:px-5 md:py-13 md:pr-7 md:text-[130px] md:leading-10 md:-tracking-[7px]">
            Getstart with Relic AI
          </h1>
        </div>
      </div>
    </div>
  );
}
