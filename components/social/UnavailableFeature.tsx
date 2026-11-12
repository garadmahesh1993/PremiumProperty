import Link from "next/link";
import { SocialShell } from "./SocialShell";
import { Icon } from "./Icon";
export function UnavailableFeature({ feature }: { feature: "reels" | "messages" }) {
  const reels = feature === "reels";
  return (
    <SocialShell rail={false}>
      <section className="sp-unavailable">
        <span className="sp-feature-icon">
          <Icon name={reels ? "reels" : "message"} size={40} />
        </span>
        <span className="sp-label">
          {reels ? "PROPERTY REELS" : "PROPERTY CONVERSATIONS"} · NOT AVAILABLE YET
        </span>
        <h1>{reels ? "Every space has a story." : "A good move starts with a conversation."}</h1>
        <p>
          {reels
            ? "Video tours are not connected in this preview. Explore property photo galleries while we prepare a safe home for property videos."
            : "An online inbox is not connected. You can use the platform’s existing public business contact options to ask about the website."}
        </p>
        <div>
          <Link className="sp-button" href={reels ? "/explore" : "/contact"}>
            {reels ? "Explore photo galleries" : "Contact the platform team"}
            <Icon name="arrow" size={17} />
          </Link>
          <Link className="sp-text-link" href={reels ? "/saved" : "/account"}>
            {reels ? "Your saved spaces" : "Your property activity"}
          </Link>
        </div>
        <p className="sp-feature-note">
          {reels
            ? "No video playback, uploads or live tours are offered here."
            : "No message or visit request is sent from this page."}
        </p>
      </section>
    </SocialShell>
  );
}
