"use client";
import Link from "next/link";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="sp-main sp-empty">
      <h1>Something interrupted your discovery</h1>
      <p>Your browser saves and drafts are still available. Try loading this page again.</p>
      <button className="sp-button" onClick={reset}>
        Try again
      </button>
      <Link className="sp-text-link" href="/">
        Back to the feed
      </Link>
    </main>
  );
}
