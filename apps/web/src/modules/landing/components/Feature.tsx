export default function Feature() {
  const stats = [
    {
      value: '34',
      description: 'Complete context inheritance for branches.',
    },
    {
      value: '100%',
      description: 'Complete context inheritance for branches.',
    },
    {
      value: '10x',
      description: 'Faster brainstorming on a single canvas.',
    },
    {
      value: '0%',
      description: 'Zero conversation history lost anymore.',
    },
  ];

  return (
    <section>
      <section className=" ">
        <div className="ml-95 w-3xl border-l border-white/12 border-dashed">
          <div className="py-25 px-10">
            <div className="relative z-10 flex items-start justify-between ">
              <div className="flex items-center gap-3 text-white/70 py-4">
                <span className="text-[14px] tracking-[-0.05px] uppercase text-white">
                  Statistics
                </span>
              </div>
            </div>

            <div className="relative z-10  max-w-4xl flex-1 flex flex-col justify-center  ">
              <h2 className="text-2xl md:text-[32px] text-white/90 leading-relaxed md:leading-9.5 mb-10 font-cabin tracking-[-1.5px]">
                Build a connected knowledge graph of your conversations. track every single thought
                visually on an infinite canvas.
              </h2>
            </div>

            {/* View Report Button */}
            <button className="flex items-stretch w-fit group hover:opacity-80 transition-opacity cursor-pointer">
              <div className="bg-[#0a0a0a] px-3 py-3 border border-white/80 flex items-center justify-center">
                {/* Abstract dot icon inside the button */}
                <svg
                  width="14"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="text-white"
                >
                  <path d="M6 14H10V18H6V14ZM10 10H14V14H10V10ZM14 6H18V10H14V6Z" />
                </svg>
              </div>
              <div className="bg-white text-black px-8 py-1  font-medium text-sm flex items-center justify-center border border-white border-l-0">
                Try Canvas
              </div>
            </button>
          </div>
        </div>

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-4 border-y border-white/10 border-dashed w-full mt-auto ">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="relative min-h-[220px] font-bricolage flex flex-col p-8 md:p-12 border-b md:border-b-0 md:border-r border-white/10 border-dashed "
            >
              {/* Top Right Bracket Icon ( ┐ ) */}
              <svg
                className="absolute top-8 right-8 w-4 h-4 text-white/40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path d="M4 4H20V20" strokeWidth="1" strokeLinecap="square" />
              </svg>

              <div className="mt-12">
                <h3 className="text-6xl md:text-[70px] font-light tracking-[-5px] text-white mb-6">
                  {stat.value}
                </h3>
                <p className="text-white/60 font-mono text-sm tracking-[-1px] leading-relaxed max-w-[220px]">
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
