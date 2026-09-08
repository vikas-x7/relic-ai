const DEMO_VIDEO =
  'https://res.cloudinary.com/dyv9kenuj/video/upload/v1778740598/relicdemov1_1_aurpo2.mp4';

export default function xHighlights() {
  return (
    <section
      id="demo-video"
      className="relative w-full my-6 sm:my-10 px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20"
    >
      <div className="relative w-full   lg:h-[100vh] max-h-[850px] overflow-hidden rounded-[5px] sm:rounded-[7px] shadow-2xl bg-black/5">
        <video
          className="w-full h-full object-cover"
          src={DEMO_VIDEO}
          autoPlay
          muted
          loop
          playsInline
        />
      </div>
      {/* <img
        src="https://res.cloudinary.com/dyv9kenuj/image/upload/v1788495473/screenshot-studio-1788495300168_wqjwwp.webp"
        alt=""
        className="w-full "
      /> */}
    </section>
  );
}
