"use client";
import { useRef, useState } from "react";
import { getListingGallery, type DemoListing } from "@/lib/demo-data";
import { Photo } from "./Photo";
import { Icon } from "./Icon";
import { Modal } from "./Modal";
export function MediaGallery({
  item,
  eager = false,
  compact = false,
}: {
  item: DemoListing;
  eager?: boolean;
  compact?: boolean;
}) {
  const images = getListingGallery(item);
  const [index, setIndex] = useState(0),
    [open, setOpen] = useState(false);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const move = (delta: number) =>
    setIndex((value) => (value + delta + images.length) % images.length);
  const events = {
    onKeyDown: (event: React.KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        move(1);
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        move(-1);
      }
    },
    onTouchStart: (event: React.TouchEvent) => {
      touch.current = { x: event.touches[0].clientX, y: event.touches[0].clientY };
    },
    onTouchEnd: (event: React.TouchEvent) => {
      if (touch.current) {
        const delta = event.changedTouches[0].clientX - touch.current.x;
        const vertical = event.changedTouches[0].clientY - touch.current.y;
        if (Math.abs(delta) > 45 && Math.abs(delta) > Math.abs(vertical)) move(delta < 0 ? 1 : -1);
      }
      touch.current = null;
    },
  };
  return (
    <>
      <div className={`sp-media ${compact ? "sp-media-compact" : ""}`} {...events}>
        <button
          type="button"
          className="sp-open-photo"
          aria-label={`Open photos of ${item.title}`}
          onClick={() => setOpen(true)}
        >
          <Photo
            src={images[index]}
            alt={`${item.title}, illustrative photo ${index + 1}`}
            eager={eager}
            sizes="(max-width:700px) 100vw, (max-width:1180px) 70vw, 1000px"
          />
        </button>
        <span className="sp-media-purpose">{item.purpose === "buy" ? "FOR SALE" : "FOR RENT"}</span>
        <span className="sp-media-counter" aria-live="polite">
          {index + 1}/{images.length}
        </span>
        <button
          type="button"
          className="sp-media-prev"
          aria-label={`Previous photo of ${item.title}`}
          onClick={() => move(-1)}
        >
          <Icon name="back" size={18} />
        </button>
        <button
          type="button"
          className="sp-media-next"
          aria-label={`Next photo of ${item.title}`}
          onClick={() => move(1)}
        >
          <Icon name="arrow" size={18} />
        </button>
        <span className="sp-media-expand">
          <Icon name="expand" size={16} />
        </span>
        <div className="sp-media-dots" aria-hidden="true">
          {images.map((_, i) => (
            <i className={i === index ? "active" : ""} key={i} />
          ))}
        </div>
      </div>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Property photo gallery"
        className="sp-gallery-modal"
        onKeyDown={events.onKeyDown}
      >
        <div
          className="sp-full-gallery"
          onTouchStart={events.onTouchStart}
          onTouchEnd={events.onTouchEnd}
        >
          <div className="sp-full-photo">
            <Photo
              src={images[index]}
              alt={`${item.title}, photo ${index + 1} of ${images.length}`}
              sizes="95vw"
              eager
            />
            <button
              type="button"
              className="sp-media-prev"
              onClick={() => move(-1)}
              aria-label="Previous gallery photo"
            >
              <Icon name="back" />
            </button>
            <button
              type="button"
              className="sp-media-next"
              onClick={() => move(1)}
              aria-label="Next gallery photo"
            >
              <Icon name="arrow" />
            </button>
          </div>
          <div className="sp-gallery-thumbs">
            {images.map((image, i) => (
              <button
                type="button"
                key={image}
                onClick={() => setIndex(i)}
                aria-label={`Show gallery photo ${i + 1}`}
                aria-pressed={index === i}
              >
                <Photo src={image} alt="" sizes="90px" />
              </button>
            ))}
          </div>
          <p role="status">
            Photo {index + 1} of {images.length} · Illustrative photos
          </p>
        </div>
      </Modal>
    </>
  );
}
