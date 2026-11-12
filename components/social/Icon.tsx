import type { SVGProps } from "react";
const paths = {
  home: "m3 11 9-8 9 8M5 10v11h14V10m-10 11v-7h6v7",
  explore: "M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0Zm-7-3-2 4-4 2 2-4 4-2Z",
  reels: "M4 3h16v18H4ZM4 8h16M8 3l3 5m3-5 3 5m-7 4 5 3-5 3v-6Z",
  bookmark: "M5 3h14v19l-7-5-7 5V3Z",
  heart:
    "M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z",
  message: "M21 11a9 9 0 0 1-9 9H4l-2 2V11a9 9 0 0 1 19 0ZM7 9h10M7 13h6",
  user: "M20 21v-2a8 8 0 0 0-16 0v2M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0",
  plus: "M12 4v16M4 12h16",
  search: "m21 21-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0",
  arrow: "M4 12h16m-6-6 6 6-6 6",
  back: "M20 12H4m6-6-6 6 6 6",
  close: "m6 6 12 12M6 18 18 6",
  pin: "M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0ZM15 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0",
  share:
    "m9 11 6-4m-6 6 6 4M9 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM21 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM21 19a3 3 0 1 1-6 0 3 3 0 0 1 6 0",
  more: "M5 12h.01M12 12h.01M19 12h.01",
  bed: "M3 20V7m18 13V9M3 13h18v7M3 17h18M6 9h5v4H6Zm7 0h5v4h-5Z",
  area: "M4 9V4h5m6 0h5v5m0 6v5h-5M9 20H4v-5",
  check: "m5 12 4 4L19 6",
  filter: "M4 7h7m4 0h5M4 17h3m4 0h9M11 4v6M7 14v6",
  grid: "M3 3h7v7H3Zm11 0h7v7h-7ZM3 14h7v7H3Zm11 0h7v7h-7Z",
  down: "m6 9 6 6 6-6",
  expand: "M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5",
  mail: "M3 5h18v14H3Zm0 0 9 8 9-8",
  phone: "M8 3H4c-2 9 8 19 17 17v-4l-5-2-2 2-6-6 2-2-2-5Z",
  upload: "M12 16V3m-5 5 5-5 5 5M4 15v6h16v-6",
} as const;
export function Icon({
  name,
  size = 22,
  ...props
}: SVGProps<SVGSVGElement> & { name: keyof typeof paths; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={name === "more" ? 3 : 1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path d={paths[name]} />
    </svg>
  );
}
