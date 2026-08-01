'use client';

const marqueeItemsData = [
  { name: 'Gemini', src: 'https://thesvg.org/icons/gemini/default.svg' },
  { name: 'Kimi', src: 'https://thesvg.org/icons/kimi/default.svg' },
  { name: 'MiniMax', src: 'https://thesvg.org/icons/minimax/default.svg' },
  { name: 'DeepSeek', src: 'https://thesvg.org/icons/deepseek/default.svg' },
  { name: 'Mistral AI', src: 'https://thesvg.org/icons/mistral/default.svg' },
  { name: 'Gemini', src: 'https://thesvg.org/icons/gemini/default.svg' },
  { name: 'Kimi', src: 'https://thesvg.org/icons/kimi/default.svg' },
  { name: 'Gemini', src: 'https://thesvg.org/icons/gemini/default.svg' },
  { name: 'Kimi', src: 'https://thesvg.org/icons/kimi/default.svg' },
  { name: 'MiniMax', src: 'https://thesvg.org/icons/minimax/default.svg' },
  { name: 'DeepSeek', src: 'https://thesvg.org/icons/deepseek/default.svg' },
  { name: 'Mistral AI', src: 'https://thesvg.org/icons/mistral/default.svg' },
  { name: 'Gemini', src: 'https://thesvg.org/icons/gemini/default.svg' },
  { name: 'Kimi', src: 'https://thesvg.org/icons/kimi/default.svg' },
];

export default function MovingHanding() {
  return (
    <>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee-loop {
          display: flex;
          width: max-content;
          animation: marquee 110s linear infinite;
        }
      `}</style>

      <section className="w-full overflow-hidden border-y border-dashed border-black/20 py-3 sm:py-6 sm:py-8 px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 mt-16 sm:mt-24 md:mt-30">
        <div className="relative overflow-hidden">
          <div className="animate-marquee-loop">
            {[0, 1].map((group) => (
              <div
                key={group}
                className="flex shrink-0 items-center gap-6 sm:gap-10 lg:gap-16 pr-6 sm:pr-10 lg:pr-16"
                aria-hidden={group === 1}
              >
                {marqueeItemsData.map((item, i) => (
                  <div key={`${group}-${i}`} className="flex shrink-0 items-center justify-center">
                    <img
                      src={item.src}
                      alt={group === 0 ? `${item.name}-logo` : ''}
                      className="h-4 sm:h-6 w-auto max-w-full object-contain"
                    />

                    <span className="ml-3 text-[13px] sm:text-[16px] font-medium tracking-tight text-black md:text-[15px]">
                      {item.name}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
