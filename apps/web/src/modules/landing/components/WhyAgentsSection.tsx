import React from 'react';

const features = [
  {
    number: '01',
    label: 'SPATIAL CANVAS',
    title: 'A living canvas for your mind',
    description:
      'Relic AI replaces linear chat threads with a spatial canvas. Your ideas exist as individual nodes, each a self-contained conversation with full context and memory.',
    points: [
      'Self-contained nodes instead of endless linear threads',
      'Zoom in to think deep, zoom out to see your full mind map',
      'Explore side thoughts without derailing your main work',
    ],
    image: 'https://i.pinimg.com/736x/3a/c6/09/3ac6095b83854c091ddcdaa92f22a0a4.jpg',
  },
  {
    number: '02',
    label: 'INFINITE BRANCHING',
    title: 'Branch at any moment, mid-thought',
    description:
      'Create a branch from any exact moment in a conversation. A new node opens carrying all context forward while your original thought stays intact.',
    points: [
      'Branch mid-sentence or mid-idea at any time',
      'Full context and memory carried seamlessly to new branches',
      'Build a living web of connected thinking without disruption',
    ],
    image: 'https://i.pinimg.com/736x/3a/c6/09/3ac6095b83854c091ddcdaa92f22a0a4.jpg',
  },
  {
    number: '03',
    label: 'PERSISTENT MEMORY',
    title: 'Your genuine AI second brain',
    description:
      'Nothing ever disappears on Relic. Pick up right where you left off weeks later with full context and memory intact — no re-explaining required.',
    points: [
      'Every node and branch lives on your canvas permanently',
      'The AI remembers exactly what you were building',
      'A persistent map of your thinking that gets richer over time',
    ],
    image: 'https://i.pinimg.com/736x/3a/c6/09/3ac6095b83854c091ddcdaa92f22a0a4.jpg',
  },
  {
    number: '04',
    label: 'NON-LINEAR THINKING',
    title: 'Move in every direction, not just forward',
    description:
      'Every other AI gives you a thread; Relic gives you a canvas. Every other AI forgets; Relic remembers everything, always.',
    points: [
      'Multi-directional exploration shaped entirely by you',
      'One AI with infinite, connected branches',
      'A true thinking space powered by AI',
    ],
    image: 'https://i.pinimg.com/736x/3a/c6/09/3ac6095b83854c091ddcdaa92f22a0a4.jpg',
  },
];

const BACKGROUND = 'https://i.pinimg.com/736x/31/3a/96/313a96507971b3aa64e0753f6e205520.jpg';

export default function WhyAgentsSection() {
  return (
    <section className="w-full text-black py-12 sm:py-16  sm:px-6 lg:px-20 mt-12 sm:mt-20 ">
      <div className="mx-auto space-y-8 sm:space-y-12">
        <div className="space-y-4">
          <h2 className="text-2xl sm:text-4xl lg:text-[36px] font-medium tracking-[-1.5px] sm:tracking-[-1.5px] max-w-3xl">
            Your thinking tool should work <br />
            the our mind works.
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-0">
          <div className="hidden lg:flex lg:col-span-3 lg:sticky lg:top-24 self-start flex-col space-y-2 lg:mr-8 xl:mr-16">
            {features.map((feature) => (
              <div
                key={feature.number}
                className="text-left px-4 py-3.5 flex items-center gap-4 text-[13px] tracking-wider border-l-2 border-blue-500 bg-white/5 text-black font-light"
              >
                <span className="text-black">{feature.number}</span>
                <span className="font-medium tracking-[-0.01px]">{feature.label}</span>
              </div>
            ))}
          </div>

          <div className="lg:col-span-9 flex flex-col gap-y-0">
            {features.map((feature, index) => (
              <div
                key={feature.number}
                className="sticky  mb-12 sm:mb-20 overflow-hidden "
                style={{ top: `calc(7rem + ${index * 1.5}rem)`, zIndex: index + 1 }}
              >
                <div className="grid grid-cols-1 lg:grid-cols-9 items-stretch min-h-[420px]">
                  <div
                    className="lg:col-span-5 relative w-full h-[260px] sm:h-[360px] lg:h-full min-h-[300px] bg-cover bg-center bg-no-repeat overflow-hidden flex items-center justify-center "
                    style={{ backgroundImage: `url(${BACKGROUND})` }}
                  >
                    <img
                      src={feature.image}
                      alt={`${feature.title} preview`}
                      className="p-4 sm:p-8 lg:p-12 object-contain  "
                    />
                  </div>

                  <div className="lg:col-span-4 p-6 sm:p-8 lg:p-10 space-y-6 flex flex-col justify-between bg-[#FCFCFB] border-t lg:border-t-0 lg:border-l border-black/10">
                    <div className="space-y-4">
                      <div className="text-sm  text-black font-bricolage">{feature.number}</div>

                      <div className="space-y-2.5">
                        <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold tracking-tight text-black leading-snug">
                          {feature.title}
                        </h3>
                        <p className="text-sm sm:text-[15px] text-black/70 leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2.5 pt-6 border-t border-black/10">
                      {feature.points.map((point) => (
                        <div
                          key={point}
                          className="flex items-start gap-3 text-xs sm:text-sm text-black/75 leading-snug"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-black/60 mt-1.5 flex-shrink-0" />
                          <span>{point}</span>
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
