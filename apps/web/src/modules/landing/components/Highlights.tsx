export default function Highlights() {
  const highlights = [
    {
      title: 'Branching conversations',
      tag: 'Branching',
    },
    {
      title: 'Infinite canvas',
      tag: 'Canvas',
    },
  ];

  return (
    <section className="  px-6 md:px-12  py-40">
      {/* Title Section */}
      <div className="mb-16 text-center ">
        <h2 className="text-4xl md:text-5xl font-semibold text-gray-900 tracking-[-3px] text-white">See the power of infinite canvas.</h2>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {highlights.map((item, index) => (
          <div key={index} className="flex flex-col">
            {/* Main Dark Card Container */}
            <div className="bg-[#1f1f1f] p-4 md:p-8 rounded-xl shadow-lg">
              {/* Inner Light Frame */}
              <div className="bg-[#cccccc] p-3 rounded-md">
                <div className="bg-gray-200 px-2 py-1 w-12 text-[10px] text-gray-700 font-mono mb-3 border border-gray-400">video</div>
                {/* Content Area */}
                <div className={`w-full aspect-[16/10]  flex items-center justify-center`}>{/* Content goes here */}</div>
              </div>
            </div>
            {/* Caption */}
            <div className="mt-4 flex items-center gap-2">
              <h3 className="font-medium text-lg">{item.title}</h3>
              <span className="text-gray-500">from</span>
              <span className="font-semibold underline cursor-pointer">{item.tag}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
