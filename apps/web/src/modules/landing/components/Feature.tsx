export default function Feature() {
  const stats = [
    {
      value: '∞',
      description: 'Infinite branching from any node or thought.',
    },
    {
      value: '100%',
      description: 'Context inheritance carried to every branch.',
    },
    {
      value: '10x',
      description: 'Faster non-linear exploration on one canvas.',
    },
    {
      value: '0%',
      description: 'Zero lost ideas or forgotten conversation history.',
    },
  ];

  return (
    <section>
      <section className=" ">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:ml-24 xl:ml-32 lg:max-w-3xl border-l border-black/20 ">
          <div className="py-12 sm:py-16 lg:py-25 px-4 sm:px-8 lg:px-10">
            <div className="relative z-10 flex items-start justify-between ">
              <div className="flex items-center gap-3 text-black/70 py-4">
                <span className="text-[14px] tracking-[-0.05px] uppercase text-black">
                  Statistics
                </span>
              </div>
            </div>

            <div className="relative z-10 max-w-4xl flex-1 flex flex-col justify-center">
              <h2 className="text-xl sm:text-2xl md:text-[32px] text-black/90 leading-relaxed md:leading-9.5 mb-8 sm:mb-10 font-cabin tracking-[-0.5px] sm:tracking-[-1.5px]">
                Build a connected knowledge graph of conversations. track single thought on an
                infinite canvas.
              </h2>
            </div>

            {/* View Report Button */}
            <button className="flex items-stretch w-fit group hover:opacity-80 transition-opacity cursor-pointer">
              <div className="bg-[#0a0a0a] px-3 py-3 border border-black/80 flex items-center justify-center">
                {/* Abstract dot icon inside the button */}
                <svg
                  width="14"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="text-black"
                >
                  <path d="M6 14H10V18H6V14ZM10 10H14V14H10V10ZM14 6H18V10H14V6Z" />
                </svg>
              </div>
              <div className="bg-white text-black px-6 sm:px-8 py-1 font-medium text-sm flex items-center justify-center border border-black border-l-0">
                Try Canvas
              </div>
            </button>
          </div>
        </div>

        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-y border-black/20  w-full mt-auto">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="relative min-h-[180px] sm:min-h-[220px] font-bricolage flex flex-col p-6 sm:p-8 md:p-12 border-b sm:border-b-0 border-r border-black/20 "
            >
              {/* Top Right Bracket Icon ( ┐ ) */}
              <svg
                className="absolute top-6 right-6 sm:top-8 sm:right-8 w-4 h-4 text-black/40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path d="M4 4H20V20" strokeWidth="1" strokeLinecap="square" />
              </svg>

              <div className="mt-8 sm:mt-12">
                <h3 className="text-4xl sm:text-5xl md:text-[70px] font-light tracking-[-3px] sm:tracking-[-5px] text-black mb-4 sm:mb-6">
                  {stat.value}
                </h3>
                <p className="text-black/60 font-mono text-xs sm:text-sm tracking-[-0.5px] sm:tracking-[-1px] leading-relaxed max-w-[220px]">
                  {stat.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
}
