import React from 'react';

export default function Build() {
  const features = [
    {
      title: 'Prime Logic',
      description:
        'We prioritize high-fidelity model alignment to ensure your agents deliver consistent results.',
      icon: (
        <svg
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Isometric cube outline */}
          <path
            d="M20 4L34 11V29L20 36L6 29V11L20 4Z"
            stroke="white"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
          <path d="M20 4V36" stroke="white" strokeWidth="1" strokeOpacity="0.4" />
          <path d="M6 11L20 18L34 11" stroke="white" strokeWidth="1" strokeOpacity="0.4" />
          {/* Star in the center */}
          <path
            d="M20 12L21.5 15.5L25 16L22.5 18.5L23 22L20 20.5L17 22L17.5 18.5L15 16L18.5 15.5L20 12Z"
            stroke="white"
            strokeWidth="1.2"
            fill="none"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      title: 'Total Clarity',
      description:
        'Gain full observability into how your data is processed, indexed, and retrieved by your AI.',
      icon: (
        <svg
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Eye outline */}
          <path
            d="M6 20C10 12 30 12 34 20C30 28 10 28 6 20Z"
            stroke="white"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
          <circle cx="20" cy="20" r="6" stroke="white" strokeWidth="1.2" />
          <circle cx="20" cy="20" r="2.5" fill="white" />
          {/* Radiating lines */}
          <path d="M20 6V9" stroke="white" strokeWidth="1.2" />
          <path d="M20 31V34" stroke="white" strokeWidth="1.2" />
          <path d="M6 20H9" stroke="white" strokeWidth="1.2" />
          <path d="M31 20H34" stroke="white" strokeWidth="1.2" />
        </svg>
      ),
    },
    {
      title: 'Fast Cycles',
      description:
        'Transition from prototype to production in weeks, not months, with our pre-built frameworks.',
      icon: (
        <svg
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="20" cy="20" r="14" stroke="white" strokeWidth="1.2" strokeDasharray="3 3" />
          <circle cx="20" cy="20" r="10" stroke="white" strokeWidth="1.2" />
          {/* Lightning bolt */}
          <path
            d="M21 13L15 21H20L19 27L25 19H20L21 13Z"
            stroke="white"
            strokeWidth="1.2"
            fill="none"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      title: 'Fast Cycles',
      description:
        'Transition from prototype to production in weeks, not months, with our pre-built frameworks.',
      icon: (
        <svg
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="20" cy="20" r="14" stroke="white" strokeWidth="1.2" strokeDasharray="3 3" />
          <circle cx="20" cy="20" r="10" stroke="white" strokeWidth="1.2" />
          {/* Lightning bolt */}
          <path
            d="M21 13L15 21H20L19 27L25 19H20L21 13Z"
            stroke="white"
            strokeWidth="1.2"
            fill="none"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
  ];

  return (
    <section className="px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12  mt-16 sm:mt-24 md:mt-32 pt-12 sm:pt-16">
        <div className="w-full h-[280px] sm:h-[400px] lg:h-[570px] overflow-hidden group">
          <img
            src="https://i.pinimg.com/originals/9c/14/86/9c14863b9e64ffc65cdfda4cdc9a0b99.gif"
            alt="Built for the long term"
            className="w-full h-full object-cover rounded-[8px]"
          />
        </div>

        {/* Right Side: Text & Features */}
        <div className="flex flex-col justify-between">
          {/* Top Header */}
          <div className="mb-6 sm:mb-8">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium text-black/90 tracking-[-1px] sm:tracking-[-3px] leading-tight">
              Built for the long term
            </h2>
            <p className="text-sm md:text-base text-black/90 mt-4 sm:mt-6 max-w-xl leading-relaxed font-light">
              We don&apos;t just ship code; we architect neural ecosystems. Our approach combines
              rigorous testing with rapid deployment cycles.
            </p>
          </div>

          {/* Grid of features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 mt-6 sm:mt-4 gap-6 sm:gap-8">
            {features.map((feature, index) => {
              return (
                <div key={index}>
                  <div className="mb-4 sm:mb-6 transform transition-transform text-black duration-300 group-hover:scale-105">
                    <h1 className="text-[30px]">{index + 1}</h1>
                  </div>
                  <h4 className="text-base sm:text-lg text-black/90 tracking-tight">
                    {feature.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-black/70 mt-2 sm:mt-3 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
