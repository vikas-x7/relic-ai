import React from 'react';

export default function Build() {
  const features = [
    {
      title: 'Prime Logic',
      description: 'We prioritize high-fidelity model alignment to ensure your agents deliver consistent results.',
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Isometric cube outline */}
          <path d="M20 4L34 11V29L20 36L6 29V11L20 4Z" stroke="black" strokeWidth="1.2" strokeLinejoin="round" />
          <path d="M20 4V36" stroke="black" strokeWidth="1" strokeOpacity="0.2" />
          <path d="M6 11L20 18L34 11" stroke="black" stroke-width="1" strokeOpacity="0.2" />
          {/* Star in the center */}
          <path d="M20 12L21.5 15.5L25 16L22.5 18.5L23 22L20 20.5L17 22L17.5 18.5L15 16L18.5 15.5L20 12Z" stroke="black" strokeWidth="1.2" fill="none" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      title: 'Total Clarity',
      description: 'Gain full observability into how your data is processed, indexed, and retrieved by your AI.',
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Eye outline */}
          <path d="M6 20C10 12 30 12 34 20C30 28 10 28 6 20Z" stroke="black" stroke-width="1.2" strokeLinejoin="round" />
          <circle cx="20" cy="20" r="6" stroke="black" stroke-width="1.2" />
          <circle cx="20" cy="20" r="2.5" fill="black" />
          {/* Radiating lines */}
          <path d="M20 6V9" stroke="black" stroke-width="1.2" />
          <path d="M20 31V34" stroke="black" stroke-width="1.2" />
          <path d="M6 20H9" stroke="black" stroke-width="1.2" />
          <path d="M31 20H34" stroke="black" stroke-width="1.2" />
        </svg>
      ),
    },
    {
      title: 'Fast Cycles',
      description: 'Transition from prototype to production in weeks, not months, with our pre-built frameworks.',
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="20" cy="20" r="14" stroke="black" stroke-width="1.2" stroke-dasharray="3 3" />
          <circle cx="20" cy="20" r="10" stroke="black" stroke-width="1.2" />
          {/* Lightning bolt */}
          <path d="M21 13L15 21H20L19 27L25 19H20L21 13Z" stroke="black" stroke-width="1.2" fill="none" stroke-linejoin="round" />
        </svg>
      ),
    },
  ];

  return (
    <section className="">
      <div className="grid grid-cols-1 lg:grid-cols-2 border-t border-dashed border-white/20 ">
        <div className=" w-full h-screen overflow-hidden group border-r border-white/10 border-dashed">
          <img src="https://i.pinimg.com/originals/9c/14/86/9c14863b9e64ffc65cdfda4cdc9a0b99.gif" alt="Built for the long term" className="w-full h-screen object-cover" />
        </div>

        {/* Right Side: Text & Features */}
        <div className="flex flex-col justify-center ">
          {/* Top Header */}
          <div className="mb-16 px-10">
            <h2 className="text-4xl md:text-5xl lg:text-5xl  text-white/90 mt-6 tracking-[-2px] leading-none">Built for the long term</h2>
            <p className="text-sm md:text-base text-white/60 mt-6 max-w-xl leading-relaxed font-light">
              We don&apos;t just ship code; we architect neural ecosystems. Our approach combines rigorous testing with rapid deployment cycles.
            </p>
          </div>

          {/* Grid of features */}
          <div className="grid grid-cols-1 md:grid-cols-2 border-t border-white/10 px-10">
            {features.map((feature, index) => {
              // Custom borders for grid layout
              const borderClass =
                index === 0
                  ? 'border-b md:border-r border-white/10 py-10 pr-6'
                  : index === 1
                    ? 'border-b border-white/10 py-10 md:pl-10 pr-6'
                    : index === 2
                      ? 'border-b md:border-b-0 md:border-r border-white/10 py-10 pr-6'
                      : '';

              return (
                <div key={index} className={`group ${borderClass}`}>
                  <div className="mb-6 transform transition-transform text-white duration-300 group-hover:scale-105">{feature.icon}</div>
                  <h4 className="font-mono text-lg font-bold text-white/60 uppercase tracking-tight">{feature.title}</h4>
                  <p className="text-sm text-zinc-600 mt-3 leading-relaxed font-light">{feature.description}</p>
                </div>
              );
            })}

            {/* Empty block for grid symmetry on desktop */}
            <div className="py-10 md:pl-10 pr-6 hidden md:block opacity-0 pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  );
}
