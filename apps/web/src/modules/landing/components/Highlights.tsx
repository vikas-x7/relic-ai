const DEMO_VIDEO = 'https://res.cloudinary.com/dyv9kenuj/video/upload/v1778740598/relicdemov1_1_aurpo2.mp4';

export default function Highlights() {
  return (
    <section className="relative w-full my-30 px-4 sm:px-6 lg:px-12">
      <div className="relative w-full h-screen overflow-hidden ">
        <video className="w-full h-full object-cover" src={DEMO_VIDEO} autoPlay muted loop />
      </div>
    </section>
  );
}
