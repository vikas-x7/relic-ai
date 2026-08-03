'use client';
import { useState } from 'react';

const FAQ_ITEMS: { q: string; a: string }[] = [
  {
    q: 'Can I branch my conversation?',
    a: 'Yes, you can create a new branch from any single message.',
  },
  {
    q: 'How does this differ from traditional AI chatbots?',
    a: 'Instead of single threads, you organize chats as nodes on canvas.',
  },
  {
    q: 'Can I customize the canvas theme?',
    a: 'Yes, you can switch between modern dark and clean light modes.',
  },
  {
    q: 'What models can I use here?',
    a: 'We support popular models like Gemini, Claude, and GPT-4 out of the box.',
  },
  {
    q: 'Can I share my canvas workspace?',
    a: 'Yes, you can easily share your canvas with friends and colleagues.',
  },

  {
    q: 'Does the new branch inherit parent context?',
    a: 'The new branch inherits all context from the parent message automatically.',
  },
  {
    q: 'How are conversation nodes organized visually?',
    a: 'They form a connected knowledge graph on the infinite canvas.',
  },
  {
    q: 'Can I search through my nodes?',
    a: 'Yes, there is a global search to find any message instantly.',
  },
  {
    q: 'How do I navigate large graphs?',
    a: 'You can pan and zoom easily using mouse drag and wheel.',
  },
  {
    q: 'Can I rename conversation node titles?',
    a: 'Yes, you can double-click any node header to rename it.',
  },
];

function AccordionItem({
  item,
  isOpen,
  onToggle,
}: {
  item: { q: string; a: string };
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      onClick={onToggle}
      className="flex flex-col justify-center py-4 sm:py-6 lg:py-8 border-b border-dashed border-black/10 hover:bg-black/5 cursor-pointer transition-colors px-5 "
    >
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-sm sm:text-base font-medium text-[#111]">{item.q}</h3>
      </div>
      <div
        className={`grid transition-[grid-template-rows,opacity,margin] duration-300 ease-in-out ${
          isOpen ? 'grid-rows-[1fr] opacity-100 mt-2.5' : 'grid-rows-[0fr] opacity-0 mt-0'
        }`}
      >
        <div className="overflow-hidden">
          <p className="text-xs sm:text-sm text-black/60 leading-relaxed">{item.a}</p>
        </div>
      </div>
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const half = Math.ceil(FAQ_ITEMS.length / 2);
  const leftItems = FAQ_ITEMS.slice(0, half);
  const rightItems = FAQ_ITEMS.slice(half);

  return (
    <section id="faq" className="w-full text-[#111] font-cabin   scroll-mt-[40rem] mt-30">
      <div className="flex justify-between items-start px-4 sm:px-24 py-20">
        <div>
          <h2 className="text-3xl sm:text-5xl leading-tight tracking-[-1.5px] sm:tracking-[-3px] font-medium mb-2">
            Frequently Asked Questions
          </h2>
          <p className="text-black/90 text-sm sm:text-base leading-relaxed mb-6 sm:mb-8 max-w-xl mx-auto">
            Branching, and managing your visual chats with Relic AI. Got any questions?
          </p>
          <button className="flex items-stretch group hover:opacity-80 transition-opacity">
            <div className="bg-transparent px-3 py-2 border border-black flex items-center justify-center">
              <span className="w-2.5 h-3 bg-black"></span>
            </div>
            <div className="bg-[#111] text-white px-5 py-2 text-sm font-light border border-[#111]">
              Contact Us
            </div>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-14 px-4 sm:px-19  ">
        <div className="">
          {leftItems.map((item, i) => (
            <AccordionItem
              key={i}
              item={item}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>

        <div className=" ">
          {rightItems.map((item, idx) => {
            const globalIndex = half + idx;
            return (
              <AccordionItem
                key={globalIndex}
                item={item}
                isOpen={openIndex === globalIndex}
                onToggle={() => setOpenIndex(openIndex === globalIndex ? null : globalIndex)}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
