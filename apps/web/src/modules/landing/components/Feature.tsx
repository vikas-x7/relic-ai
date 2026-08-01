import { MdArrowForwardIos } from 'react-icons/md';

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
    <section className="w-full text-black">
      <div className="px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20">
        <div className="max-w-3xl border-l border-dashed border-black/20 pl-4 sm:pl-8 md:pl-12 py-4 sm:py-29">
          <div className="flex items-center gap-3 text-black/70 py-4">
            <span className=" text-[10px] sm:text-[14px] tracking-[-0.05px] uppercase text-black">
              Statistics
            </span>
          </div>

          <h2 className="text-[18px] tracking-[-0.5px] leading-6  sm:text-2xl md:text-[32px] text-black/90 sm:leading-relaxed md:leading-9 mb-8 sm:mb-10 font-cabin sm:tracking-[-0.5px] sm:tracking-[-1.5px] font-medium">
            Build a connected knowledge graph of conversations track single thought on an infinite
            canvas.
          </h2>

          <button className="flex items-stretch w-fit group hover:opacity-80 transition-opacity cursor-pointer">
            <div className="bg-[#0a0a0a] p-1.5 sm:px-3 sm:p-3 border border-black/80 flex items-center justify-center">
              <MdArrowForwardIos className="text-white text-[10px]" />
            </div>
            <div className="bg-white text-black px-3 sm:px-8 py-1 font-medium  text-[10px] sm:text-sm flex items-center justify-center border border-black border-l-0">
              Try Canvas
            </div>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-y border-dashed border-black/20 w-full px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="relative min-h-[180px] sm:min-h-[220px] flex flex-col p-6 sm:p-8 md:p-12 border-b sm:border-b-0 border-r border-dashed border-black/20 last:border-r-0"
          >
            <svg
              className="absolute top-6 right-6 sm:top-8 sm:right-8 w-4 h-4 text-black/40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path d="M4 4H20V20" strokeWidth="1" strokeLinecap="square" />
            </svg>

            <div className="mt-8 sm:mt-12">
              <h3 className="text-4xl sm:text-5xl md:text-[70px] font-light tracking-[-3px] sm:tracking-[-5px] text-black mb-4 sm:mb-6 font-bricolage">
                {stat.value}
              </h3>
              <p className="text-black/80 text-[13px] sm:text-base sm:tracking-[-0.5px] leading-relaxed max-w-[220px]">
                {stat.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
