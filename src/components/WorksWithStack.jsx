// src/components/WorksWithStack.jsx
export default function WorksWithStack() {
  const logos = [
    { src: "/Figma-logo.svg", alt: "Figma" },
    { src: "/google-drive.svg", alt: "Google Drive" },
    { src: "/google-meet.svg", alt: "Google Meet" },
    { src: "/Notion-logo.svg", alt: "Notion" },
    { src: "/confluence-1.svg", alt: "Confluence" },
  ];

  return (
    <section aria-labelledby="works-with-stack" className="py-16">
      <h2 id="works-with-stack" className="text-center text-2xl md:text-3xl font-semibold tracking-tight">
        Works with your stack
      </h2>

      <div className="mx-auto mt-10 grid w-full max-w-6xl grid-cols-2 gap-8 px-6 sm:grid-cols-3 md:grid-cols-5">
        {logos.map(({ src, alt }) => (
          <a
            key={alt}
            href="#integrations"
            className="group inline-flex h-12 w-full items-center justify-center rounded-xl ring-offset-2 transition focus:outline-none focus:ring-2 focus:ring-black/30 dark:focus:ring-white/30"
            aria-label={alt}
          >
            <img
              src={src}
              alt={alt}
              loading="lazy"
              decoding="async"
              className="h-10 md:h-12 w-auto object-contain opacity-70 grayscale transition duration-200 group-hover:opacity-100 group-hover:grayscale-0"
            />
          </a>
        ))}
      </div>
    </section>
  );
}
