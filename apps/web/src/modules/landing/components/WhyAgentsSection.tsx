import React from 'react';

const features = [
  {
    number: '01',
    label: 'Spatil canvas',
    title: 'A living canvas for your mind',
    description:
      'Relic AI replaces linear chat threads with a spatial canvas. Your ideas exist as individual nodes, each a self-contained conversation with full context and memory.',
    points: [
      'Self-contained nodes instead of endless linear threads',
      'Zoom in to think deep, zoom out to see your full mind map',
      'Explore side thoughts without derailing your main work',
    ],
    image: 'https://i.pinimg.com/1200x/2e/c2/e7/2ec2e75d3c281bb4577a5006c4a13f11.jpg',
  },
  {
    number: '02',
    label: 'Infinite branching',
    title: 'Branch at any moment, mid-thought',
    description:
      'Create a branch from any exact moment in a conversation. A new node opens carrying all context forward while your original thought stays intact.',
    points: [
      'Branch mid-sentence or mid-idea at any time',
      'Full context and memory carried seamlessly to new branches',
      'Build a living web of connected thinking without disruption',
    ],
    image: 'https://i.pinimg.com/1200x/bc/e0/af/bce0afb2ef17f6fc0baae79d5db25697.jpg',
  },
  {
    number: '03',
    label: 'Persistance memory',
    title: 'Your genuine AI second brain',
    description:
      'Nothing ever disappears on Relic. Pick up right where you left off weeks later with full context and memory intact — no re-explaining required.',
    points: [
      'Every node and branch lives on your canvas permanently',
      'The AI remembers exactly what you were building',
      'A persistent map of your thinking that gets richer over time',
    ],
    image: 'https://i.pinimg.com/1200x/f8/11/58/f81158f704053a31cc719a957bba19ce.jpg',
  },
];

const BACKGROUND =
  'https://res.cloudinary.com/dyv9kenuj/image/upload/v1790302341/Soundwave-2048x2048_y1tnfm.png';

export default function WhyAgentsSection() {
  return (
    <section className="w-full text-black py-12 sm:py-16 md:py-20 px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 mt-12 sm:mt-20">
      <div className="mx-auto space-y-8 sm:space-y-12">
        <div className="flex flex-col items-center text-center space-y-5 sm:space-y-6 pb-12 pt-4">
          <h2 className="text-3xl sm:text-5xl lg:text-[40px] font-medium tracking-[-1.5px] sm:tracking-[-2px] text-black  ">
            Everything between the ask and the result handled
          </h2>
          <p className="text-black/80 text-sm sm:text-base md:text-[17px] max-w-3xl mx-auto ">
            Give your AI & agent a task. Relic AI finds the right actions across 1,500+ apps,
            connects each app in a click, and keeps connections working as those apps change.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-0">
          <div className="hidden lg:flex lg:col-span-3 lg:sticky lg:top-24 self-start flex-col space-y-2 lg:mr-8 xl:mr-16">
            {features.map((feature) => (
              <div
                key={feature.number}
                className="text-left px-4 py-3.5 flex items-center gap-3 text-[13px] tracking-wider  bg-white/5 text-black font-light"
              >
                <span className="text-black text-[16px]">{feature.number}</span>
                <span className="font-medium tracking-[-0.01px] text-[16px]">{feature.label}</span>
              </div>
            ))}
          </div>

          <div className="lg:col-span-9 flex flex-col ">
            {features.map((feature, index) => (
              <div
                key={feature.number}
                className="sticky mb-12 sm:mb-20 overflow-hidden shadow-sm lg:shadow-none"
                style={{ top: `calc(5rem + ${index * 1.25}rem)`, zIndex: index + 1 }}
              >
                <div className="grid grid-cols-1 lg:grid-cols-9 items-stretch min-h-[360px] sm:min-h-[420px] rounded-lg lg:rounded-none overflow-hidden border border-black/10 border-dashed  ">
                  <div
                    className="lg:col-span-5 relative w-full h-[220px] sm:h-[320px] lg:h-full min-h-[220px] sm:min-h-[300px] bg-cover bg-center bg-no-repeat overflow-hidden flex items-center justify-center p-20 "
                    style={{ backgroundImage: `url(${BACKGROUND})` }}
                  >
                    <img
                      src={feature.image}
                      alt={`${feature.title} preview`}
                      className="object-contain max-h-full  border-[5px] border-white/30 shadow-lg"
                    />
                  </div>

                  <div className="lg:col-span-4  p-10 space-y-6  bg-white border-t lg:border-t-0  border-black/10">
                    <div className="space-y-4">
                      <div className="space-y-2.5">
                        <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold tracking-tight text-black leading-snug">
                          {feature.title}
                        </h3>
                        <p className="text-sm sm:text-[15px] text-black/70 leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col space-y-4 pt-4 sm:pt-6 border-t border-black/10 relative">
                      <div className="absolute left-[1px] top-8 bottom-4 w-[1px] bg-black/10" />
                      {feature.points.map((point) => (
                        <div
                          key={point}
                          className="flex items-start gap-4 text-sm sm:text-[15px] text-black/80 font-medium relative z-10"
                        >
                          <div className="w-[3px] h-[20px] bg-black/30 mt-[2px] rounded-full flex-shrink-0" />
                          <span className="leading-snug">{point}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
