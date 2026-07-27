const DEMO_VIDEO =
  'https://res.cloudinary.com/dyv9kenuj/video/upload/v1778740598/relicdemov1_1_aurpo2.mp4';

export default function Highlights() {
  return (
    <section className="relative w-full m lg:my-0 px-4 sm:px-6 lg:px-20 ">
      <div className="relative w-full h-[50vh] sm:h-[75vh] lg:h-screen overflow-hidden rounded-lg sm:rounded-xl shadow-3xl">
        <video className="w-full h-full object-cover" src={DEMO_VIDEO} autoPlay muted loop />
      </div>
    </section>
  );
}
