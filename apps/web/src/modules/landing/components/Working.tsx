'use client';
import { useState } from 'react';

export default function Working() {
  const [activeTab, setActiveTab] = useState('TRAINING');
  const tabs = ['DISCOVERY', 'ANALYSIS', 'TRAINING', 'DEPLOY'];

  return (
    <section className="w-full  text-white font-cabin border-t border-white/10">
      {/* --- HEADER --- */}
      <div className="py-20 px-8 text-start ">
        <h2 className="text-5xl md:text-5xl tracking-[-2px] font-bricolage">Engineered for autonomy</h2>
        <p className="text-white/70 mt-3 font-light text-lg tracking-[-0.75px]">
          Go beyond simple chat interfaces. Armory provides <br /> the underlying architecture to build, test, and scale enterprise-grade agents.
        </p>
      </div>

      {/* --- TABS --- */}
      <div className="grid grid-cols-2 md:grid-cols-4 border-t border-b border-white/10">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-6 text-sm font-medium tracking-wide transition-all border-r border-white/10 last:border-r-0 ${activeTab === tab ? 'bg-white text-black' : 'hover:bg-white/5'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* --- CONTENT AREA --- */}
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Left: Image Placeholder */}
        <div className="p-12 md:p-20 border-r border-white/10 flex items-center justify-center bg-gradient-to-b from-white/5 to-transparent">
          <div className="w-full aspect-video bg-[#1a1a1a] rounded-lg shadow-2xl border border-white/10 flex items-center justify-center">
            <span className="text-white/20 font-mono text-sm">Dashboard Preview</span>
          </div>
        </div>

        {/* Right: Description */}
        <div className="p-12 md:p-20 flex flex-col justify-center">
          <h3 className="text-2xl font-medium mb-6">Refine your models with human-in-the-loop feedback.</h3>
          <p className="text-white/60 leading-relaxed mb-8">Fine-tune weights and logic gates to match your brand&apos;s unique voice.</p>

          <div className="text-sm text-white/40 mb-6">Optimize weights for specific industry needs.</div>

          <div className="flex items-center gap-3 bg-white/5 border border-white/10 w-fit px-4 py-2 ">
            <div className="w-5 h-5 rounded-full border border-white/30 flex items-center justify-center">
              <span className="text-[10px]">✓</span>
            </div>
            <span className="text-sm  ">Model Tuning</span>
          </div>
        </div>
      </div>
    </section>
  );
}
