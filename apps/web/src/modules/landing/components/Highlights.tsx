export default function Highlights() {
  const highlights = [
    {
      title: 'Branching conversations',
      tag: 'Branching',
      image1: 'https://i.pinimg.com/1200x/d9/7f/83/d97f83370baff66a4f512016ef5bfadf.jpg',
      image2: 'URL_YAHAN_DAALEIN_2',
    },
    {
      title: 'Infinite canvas',
      tag: 'Canvas',
      image1: 'https://i.pinimg.com/1200x/c4/25/b9/c425b95893916bd298afeb125459daba.jpg',
      image2: 'URL_YAHAN_DAALEIN_4',
    },
  ];

  return (
    <section className="px-6 md:px-12 py-40">
      <div className="mb-16 text-center">
        <h2 className="text-4xl md:text-5xl font-medium font-bricolage tracking-[-2px]">See the power of infinite canvas</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {highlights.map((item, index) => (
          <div key={index} className="flex flex-col">
            <div className="bg-[#1f1f1f] p-4 md:p-8  shadow-lg">
              <div className="">
                <div className="">
                  <img src={item.image1} alt={item.title} className="h-[70vh] w-full object-cover rounded" />
                </div>
              </div>
            </div>
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
