const DEMO_VIDEO =
  'https://res.cloudinary.com/dyv9kenuj/video/upload/v1778740598/relicdemov1_1_aurpo2.mp4';

export default function Highlights() {
  return (
    <section
      id="demo-video"
      className="relative w-full my-6 sm:my-10 px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20"
    >
      <div className="relative w-full h-[40vh] sm:h-[60vh] lg:h-[100vh] max-h-[850px] overflow-hidden rounded-lg sm:rounded-xl shadow-2xl bg-black/5">
        <video
          className="w-full h-full object-cover"
          src={DEMO_VIDEO}
          autoPlay
          muted
          loop
          playsInline
        />
      </div>
    </section>
  );
}
