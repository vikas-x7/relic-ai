import MovingHanding from '@/src/modules/landing/components/MovingHading';
import Ather from './Ather';
import Build from './Build';
import Highlights from './Highlights';
import Integrations from './Integrations';
import Working from './Working';
import WhyAgentsSection from '@/src/modules/landing/components/WhyAgentsSection';

export default function Feature() {
  const stats = [
    {
      value: '34',
      description: 'Complete context inheritance for branches.',
    },
    {
      value: '100%',
      description: 'Complete context inheritance for branches.',
    },
    {
      value: '10x',
      description: 'Faster brainstorming on a single canvas.',
    },
    {
      value: '0%',
      description: 'Zero conversation history lost anymore.',
    },
  ];

  const features = [
    {
      title: 'Secure Guard',
      description: 'We fortify your AI deployments with robust security protocols. Our team ensures every model adheres to strict data privacy standards.',
      icon: '/icons/lock.svg',
    },
    {
      title: 'Agent Build',
      description: 'Tailored AI agents designed for your specific needs. We develop custom logic and workflows that integrate deeply with your existing tools.',
      icon: '/icons/agent.svg',
    },
    {
      title: 'Cloud Scale',
      description: 'Infrastructure optimization for high-traffic AI apps. We ensure your systems remain fast, responsive, and ready for any level of demand.',
      icon: '/icons/cloud.svg',
    },
    {
      title: 'Data Mining',
      description: "Transform raw information into actionable intelligence. We build the pipelines and vector stores that power your organization's future.",
      icon: '/icons/database.svg',
    },
  ];

  const borderClasses = [
    'border-b md:border-r border-dashed border-white/10',
    'border-b xl:border-r border-dashed border-white/10',
    'border-b md:border-r border-dashed border-white/10',
    'border-b border-white/10',
  ];

  return (
    <section className="relative overflow-clip bg-black  text-white  selection:bg-white/20 flex flex-col justify-between font-cabin">
      <MovingHanding />
      <WhyAgentsSection />
      <div className="pointer-events-none absolute inset-0 z-0 opacity-100">
        <svg className="h-full w-full" id="noice-feature">
          <filter id="noise-filter-feature">
            <feTurbulence type="fractalNoise" baseFrequency="2" numOctaves="4" stitchTiles="stitch"></feTurbulence>
            <feColorMatrix type="saturate" values="0"></feColorMatrix>
            <feComponentTransfer>
              <feFuncR type="linear" slope="0.37"></feFuncR>
              <feFuncG type="linear" slope="0.37"></feFuncG>
              <feFuncB type="linear" slope="0.37"></feFuncB>
              <feFuncA type="linear" slope="0.13"></feFuncA>
            </feComponentTransfer>
            <feComponentTransfer>
              <feFuncR type="linear" slope="0" intercept="0.50" />
              <feFuncG type="linear" slope="0" intercept="0.50" />
              <feFuncB type="linear" slope="0" intercept="0.50" />
            </feComponentTransfer>
          </filter>
          <rect width="100%" height="100%" filter="url(#noise-filter-feature)"></rect>
        </svg>
      </div>

      {/* <div className="relative z-10 w-full bg-white h-30 rounded-b-[40px] mb-20"></div> */}

      {/* <section className="relative overflow-hidden w-full">
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
            {features.map((feature, index) => (
              <div key={index} className={`relative px-8 py-10 ${borderClasses[index]}`}>
                <div className="relative z-10 py-10">
                  <div className="mb-16 flex justify-center">
                    <div
                      className="absolute inset-0 opacity-90"
                      style={{
                        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.18) 1px, transparent 1px)',
                        backgroundSize: '18px 18px',
                      }}
                    />
                    <img src={feature.icon} className="h-32 w-32" alt={feature.title} />
                  </div>
                </div>

                <div>
                  <h3 className="mb-1 mt-10 text-2xl font-light text-white">{feature.title}</h3>

                  <p className="text-[15px] text-white/50">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      <section className="border-t border-white/10 ">
        <div className="ml-95 w-3xl border-l border-white/10 border-dashed">
          <div className="py-25 px-10">
            <div className="relative z-10 flex items-start justify-between ">
              <div className="flex items-center gap-3 text-white/70 py-4">
                <span className="text-[14px] tracking-[-0.05px] uppercase text-white">Statistics</span>
              </div>
            </div>

            <div className="relative z-10  max-w-4xl flex-1 flex flex-col justify-center  ">
              <h2 className="text-2xl md:text-[32px] text-white/90 leading-relaxed md:leading-[38px] mb-10 font-cabin tracking-[-1.5px]">
                Build a connected knowledge graph of your conversations. track every single thought visually on an infinite canvas.
              </h2>
            </div>

            {/* View Report Button */}
            <button className="flex items-stretch w-fit group hover:opacity-80 transition-opacity cursor-pointer">
              <div className="bg-[#0a0a0a] px-3 py-3 border border-white/80 flex items-center justify-center">
                {/* Abstract dot icon inside the button */}
                <svg width="14" height="10" viewBox="0 0 24 24" fill="currentColor" className="text-white">
                  <path d="M6 14H10V18H6V14ZM10 10H14V14H10V10ZM14 6H18V10H14V6Z" />
                </svg>
              </div>
              <div className="bg-white text-black px-8 py-1  font-medium text-sm flex items-center justify-center border border-white border-l-0">Try Canvas</div>
            </button>
          </div>
        </div>

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-4 border-y border-white/10 border-dashed w-full mt-auto ">
          {stats.map((stat, index) => (
            <div key={index} className="relative min-h-[220px] font-bricolage flex flex-col p-8 md:p-12 border-b md:border-b-0 md:border-r border-white/10 border-dashed ">
              {/* Top Right Bracket Icon ( ┐ ) */}
              <svg className="absolute top-8 right-8 w-4 h-4 text-white/40" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M4 4H20V20" strokeWidth="1" strokeLinecap="square" />
              </svg>

              <div className="mt-12">
                <h3 className="text-6xl md:text-[70px] font-light tracking-[-5px] text-white mb-6">{stat.value}</h3>
                <p className="text-white/60 font-mono text-sm tracking-[-1px] leading-relaxed max-w-[220px]">{stat.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <Highlights />

      {/* <Working /> */}
      <Integrations />
      <Build />
    </section>
  );
}
