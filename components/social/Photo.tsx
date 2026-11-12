"use client";
import Image from "next/image";
import { useState } from "react";
import manifest from "@/lib/social/images.json";
export function Photo({
  src,
  alt,
  sizes = "(max-width: 700px) 100vw, 50vw",
  eager = false,
}: {
  src: string;
  alt: string;
  sizes?: string;
  eager?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const id = src.match(/photo-\d+-[a-z0-9]+/)?.[0];
  const local = id ? (manifest as Record<string, string>)[id] : undefined;
  if (failed || !local)
    return (
      <div className="sp-photo-fallback" role="img" aria-label={`${alt}. Photo unavailable.`}>
        <span>⌂</span>
        <small>Photo unavailable</small>
      </div>
    );
  return (
    <Image
      src={local}
      alt={alt}
      fill
      sizes={sizes}
      loading={eager ? "eager" : "lazy"}
      fetchPriority={eager ? "high" : "auto"}
      onError={() => setFailed(true)}
      style={{ objectFit: "cover" }}
    />
  );
}
