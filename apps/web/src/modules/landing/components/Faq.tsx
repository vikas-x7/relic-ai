'use client';
import { useState } from 'react';

export default function FAQ() {
  const [activeTab, setActiveTab] = useState('Overview');
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const tabs = ['Overview', 'Features', 'Workflow', 'Billing'];

  const tabData: Record<string, { q: string; a: string }[]> = {
    Overview: [
      {
        q: 'What is Relic AI workspace?',
        a: 'Relic AI is a visual workspace built on an infinite canvas. We provide conversational branching to explore different ideas without losing context, building a connected knowledge graph easily.',
      },
      {
        q: 'Who is this visual tool for?',
        a: 'It is built for researchers, students, and anyone brainstorming complex topics.',
      },
      {
        q: 'How does branching help research?',
        a: 'It lets you start new chats from any node to explore follow-up topics.',
      },
      {
        q: 'Is Relic AI free to use?',
        a: 'Yes, we offer a generous free tier for everyone to start experimenting.',
      },
      {
        q: 'Where can I access the app?',
        a: 'You can sign up and explore the workspace online at relicai.in.',
      },
    ],
    Features: [
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
    ],
    Workflow: [
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
    ],
    Billing: [
      {
        q: 'Is there a limit to how many nodes I can create?',
        a: 'No, you can create unlimited conversation nodes on the infinite canvas.',
      },
      {
        q: 'Is there a free trial plan available?',
        a: 'Yes, you can try Relic AI for free today.',
      },
      {
        q: 'What payment methods do you accept?',
        a: 'We accept all major credit cards and online payment systems.',
      },
      {
        q: 'Can I cancel my subscription anytime?',
        a: 'Yes, you can cancel your paid plan anytime from settings.',
      },
      {
        q: 'Do you offer discounts for students?',
        a: 'Yes, students can apply for special educational discount plans.',
      },
    ],
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setOpenIndex(0);
  };

  return (
    <section className="relative overflow-hidden w-full  text-[#111] font-cabin ">
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 border-y border-dashed border-black/10 ">
        <div className=" py-8 sm:py-12 border-b md:border-b-0 md:border-r border-dashed border-black/10 flex flex-col justify-between px-20">
          <div>
            <span className="text-xs tracking-[0.2em] font-medium">FAQ</span>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl leading-tight sm:leading-13 tracking-[-1.5px] sm:tracking-[-3px] mb-6 sm:mb-10 mt-3">
              Common <br className="hidden sm:block" /> inquiries
            </h2>
          </div>

          <div className="py-4 sm:py-6">
            <p className="text-black/90  text-sm sm:text-base leading-relaxed mb-6 sm:mb-8">
              Everything you need to know about starting, branching, and managing your visual chats
              with Relic AI. Got any questions?
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

        {/* Right Side: Tabs and Accordion */}
        <div className="flex flex-col ">
          {/* Tab Navigation */}
          <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-dashed border-black/10 pr-20">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`py-3 text-xs sm:text-base font-normal transition-colors  ${activeTab === tab ? 'bg-[#111] text-white' : 'hover:bg-black/5'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Accordion List */}
          <div className="flex flex-col pr-20">
            {tabData[activeTab]?.map((item, i) => (
              <div
                key={i}
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="flex items-center justify-between p-4 sm:p-6 lg:p-8 border-b border-dashed border-black/10 hover:bg-black/5 cursor-pointer transition-colors "
              >
                <div className="flex items-center gap-4">
                  <div>
                    <h3 className="text-sm sm:text-base">{item.q}</h3>
                    {openIndex === i && (
                      <p className="text-xs sm:text-sm text-black/50 mt-2 ">{item.a}</p>
                    )}
                  </div>
                </div>
                <span className="text-lg sm:text-xl font-light text-black/40 ml-2">
                  {openIndex === i ? '−' : '+'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
