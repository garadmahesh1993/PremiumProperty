import Link from "next/link";
export function SiteFooter() {
  return (
    <footer className="sp-legacy-footer">
      <Link href="/about">About Premium Property</Link>
      <Link href="/contact">Contact</Link>
      <Link href="/privacy">Privacy</Link>
      <Link href="/terms">Terms</Link>
    </footer>
  );
}
