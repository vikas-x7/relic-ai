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
          animation: marquee 90s linear infinite;
        }
      `}</style>

      <section className="w-full overflow-hidden border-y border-dashed border-white/12 bg-black py-8">
        <div className="relative w-full overflow-hidden">
          <div className="animate-marquee-loop">
            {[0, 1].map((group) => (
              <div
                key={group}
                className="flex shrink-0 items-center gap-8 sm:gap-12 lg:gap-16 pr-8 sm:pr-12 lg:pr-16"
                aria-hidden={group === 1}
              >
                {marqueeItemsData.map((item, i) => (
                  <div
                    key={`${group}-${i}`}
                    className="flex shrink-0 items-center justify-center opacity-40 transition-opacity duration-300 hover:opacity-100"
                  >
                    <img
                      src={item.src}
                      alt={group === 0 ? `${item.name}-logo` : ''}
                      className="h-6 w-auto max-w-full object-contain brightness-200 contrast-200 grayscale"
                    />

                    <span className="ml-3 text-[16px] font-medium tracking-tight text-white md:text-[18px]">
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
