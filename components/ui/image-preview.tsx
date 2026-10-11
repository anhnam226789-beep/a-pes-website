"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

/**
 * An illustration that fills the width it is given and opens full screen when
 * tapped.
 *
 * Screenshots from a phone are tall and narrow, and the text inside them is
 * the whole point. Sizing them by height — the previous `h-72` box — shrank a
 * 9:19.5 screenshot to roughly a third of the card's width on mobile, which is
 * unreadable. Sizing by width keeps them legible in the flow, and the viewer
 * covers the cases where the reader still needs to look closer.
 */
export function ImagePreview({ src, alt }: { src: string; alt: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="block w-full cursor-zoom-in"
        aria-label={`Phóng to ảnh: ${alt}`}
      >
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          className="block w-full h-auto"
        />
      </button>

      {isOpen && (
        <ImageViewer src={src} alt={alt} onClose={() => setIsOpen(false)} />
      )}
    </>
  );
}

/**
 * The image against a black screen and nothing else.
 *
 * `object-contain` against the full viewport rather than a padded box: a phone
 * screenshot is close enough to the shape of a phone screen that fitting it to
 * the viewport fills almost all of it, which is the point of opening it.
 *
 * **Rendered through a portal, and it has to stay that way.** The step cards
 * use `.glass-card`, which sets `backdrop-filter`. Any element with a
 * backdrop-filter becomes the containing block for `position: fixed`
 * descendants and opens its own stacking context, so an overlay rendered in
 * place is clipped to the card and painted underneath the header and the
 * bottom nav — `inset-0` and `z-50` cannot fix that from the inside. Moving
 * the node to `<body>` takes it out of that scope entirely.
 */
function ImageViewer({
  src,
  alt,
  onClose,
}: {
  src: string;
  alt: string;
  onClose: () => void;
}) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);

    // Without this the page behind scrolls while the viewer is open, so
    // closing it leaves the reader somewhere else in the guide.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  return createPortal(
    <div
      // Above the sticky header (z-40) and the mobile bottom nav (z-50).
      className="fixed inset-0 z-[60] bg-black flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label={alt}
      // Anywhere outside the image is backdrop, and the image sits on top of
      // this handler rather than beside it, so tapping it does not dismiss.
      onClick={onClose}
    >
      <img
        src={src}
        alt={alt}
        onClick={(event) => event.stopPropagation()}
        className="max-w-full max-h-full w-auto h-auto object-contain"
      />

      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 w-11 h-11 rounded-full bg-dark-card/80 border border-dark-border text-txt-primary hover:text-neon-primary hover:border-neon-primary/50 transition-colors flex items-center justify-center"
        aria-label="Đóng ảnh"
      >
        <i className="fa-solid fa-xmark text-lg"></i>
      </button>
    </div>,
    document.body,
  );
}
