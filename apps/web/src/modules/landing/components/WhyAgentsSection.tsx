import React from 'react';

const features = [
  {
    number: '01',
    label: 'SMART TOOLS',
    title: 'Search that thinks',
    description:
      "Save your agent's context for what matters. Only give it the right tools, at the right time.",
    points: [
      'Tools resolved by intent, not configuration',
      'Proposed execution plans for complex workflows',
      'Built-in guardrails so your agent gets it right the first time',
    ],
    image: 'https://i.pinimg.com/736x/3a/c6/09/3ac6095b83854c091ddcdaa92f22a0a4.jpg',
  },
  {
    number: '02',
    label: 'CONSTANT EVOLUTION',
    title: 'Gets better with every run',
    description:
      'Your agent refines its context and tool usage with each task, so every run is faster and sharper than the last.',
    points: [
      'Context preserved across every session',
      'Tool selection improves from past outcomes',
      'Self-refining prompts and workflows',
    ],
    image: 'https://i.pinimg.com/736x/3a/c6/09/3ac6095b83854c091ddcdaa92f22a0a4.jpg',
  },
  {
    number: '03',
    label: 'END USER AUTH',
    title: 'Every action, properly scoped',
    description:
      'Authentication that ties every agent action back to the right user, with permissions that follow identity.',
    points: [
      'OAuth and SSO handled out of the box',
      'User-scoped permissions on every tool call',
      'A full audit trail of agent activity',
    ],
    image: 'https://i.pinimg.com/736x/3a/c6/09/3ac6095b83854c091ddcdaa92f22a0a4.jpg',
  },
  {
    number: '04',
    label: 'DYNAMIC SANDBOX',
    title: 'Run anywhere, safely',
    description:
      'Ephemeral sandboxes that spin up per task and tear down when done, so agents always work in clean, isolated runtimes.',
    points: [
      'A fresh isolated runtime per execution',
      'Environments reset automatically',
      'Enforced resource limits and guardrails',
    ],
    image: 'https://i.pinimg.com/736x/3a/c6/09/3ac6095b83854c091ddcdaa92f22a0a4.jpg',
  },
];

const BACKGROUND = 'https://composio.dev/images/constant-evolution-bg.png';

export default function WhyAgentsSection() {
  return (
    <section className="w-full text-white py-16 px-4 sm:px-6 lg:px-12 mt-20">
      <div className="mx-auto space-y-12">
        <div className="space-y-4">
          <div className="inline-block border border-white/20 px-3 py-1 text-xs  uppercase text-white/70">
            WHY Relic ai
          </div>
          <h2 className="text-3xl sm:text-5xl lg:text-[44px] font-normal tracking-[-2.5px] max-w-3xl">
            Your agents are smart. <br />
            Their tools should be too.
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-3 lg:sticky lg:top-24 self-start flex flex-col space-y-2 mr-20">
            {features.map((feature) => (
              <div
                key={feature.number}
                className="text-left px-4 py-3.5 flex items-center gap-4 text-[13px] tracking-wider border-l-2 border-blue-500 bg-white/5 text-white font-light"
              >
                <span className="text-blue-400">{feature.number}</span>
                <span>{feature.label}</span>
              </div>
            ))}
          </div>

          <div className="lg:col-span-9 flex flex-col gap-y-8 lg:gap-y-0 ">
            {features.map((feature, index) => (
              <div
                key={feature.number}
                className="lg:sticky bg-black mb-20"
                style={{ top: `calc(4rem + ${index * 1.5}rem)`, zIndex: index + 1 }}
              >
                <div className="grid grid-cols-1 lg:grid-cols-9 ">
                  <div
                    className="lg:col-span-5 relative w-full h-[380px] sm:h-[450px] bg-cover bg-center bg-no-repeat overflow-hidden flex items-center justify-center p-4 border border-white/10 shadow-2xl"
                    style={{ backgroundImage: `url(${BACKGROUND})` }}
                  >
                    <img
                      src={feature.image}
                      alt={`${feature.title} preview`}
                      className="p-20 object-contain rounded shadow-lg border border-white/20"
                    />
                  </div>

                  <div className="lg:col-span-4 border border-white/10 p-6 sm:p-8 space-y-6 flex flex-col">
                    <div className="text-[20px] font-mono bg-black/20 tracking-wider">
                      {feature.number}
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-4xl font-medium tracking-tight text-white">
                        {feature.title}
                      </h3>
                      <p className="text-[15px] text-white/90 leading-relaxed font-light">
                        {feature.description}
                      </p>
                    </div>

                    <div className="space-y-3 pt-9 mt-7 border-t border-white/10">
                      {feature.points.map((point) => (
                        <div
                          key={point}
                          className="flex items-start gap-3 text-[17px] font-light text-white/80"
                        >
                          <span className="w-1 h-1 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
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
