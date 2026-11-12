import Link from "next/link";
import { notFound } from "next/navigation";
import { demoListings } from "@/lib/demo-data";
import { SocialShell } from "@/components/social/SocialShell";
import { PropertyTile } from "@/components/social/PropertyTile";
import { Photo } from "@/components/social/Photo";
import { Icon } from "@/components/social/Icon";

export default async function ProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!["premium-property", "aj-nova-reality"].includes(slug)) notFound();
  const editorial = slug === "premium-property";
  return (
    <SocialShell rail={false}>
      <div className="sp-profile-cover">
        <Photo
          src={demoListings[0].image}
          alt="Contemporary home, illustrative cover"
          sizes="90vw"
          eager
        />
        <span>Spaces with a little more possibility.</span>
      </div>
      <section className="sp-public-profile">
        <div className="sp-profile-summary">
          <div className="sp-profile-avatar">
            {editorial ? <Icon name="home" size={35} /> : "AN"}
          </div>
          <div>
            <span className="sp-label">
              {editorial ? "EDITORIAL COLLECTION" : "PLATFORM OPERATOR"}
            </span>
            <h1>{editorial ? "Premium Property" : "AJ NOVA REALITY"}</h1>
            <p>
              {editorial
                ? "A collection of spaces, perspectives and new beginnings."
                : "The business behind Premium Property."}
            </p>
          </div>
          <Link className="sp-button" href="/contact">
            <Icon name="message" size={18} />
            Contact the team
          </Link>
        </div>
        <div className="sp-profile-about">
          <div>
            <h2>About</h2>
            <p>
              {editorial
                ? "Explore the existing sample catalog, save spaces you love and build your own collections. These properties are fictional examples, with illustrative photography."
                : "Meet the team behind Premium Property. Get help exploring spaces, preparing a property post or finding your way around the platform."}
            </p>
          </div>
          <div>
            <h2>Clear from the start</h2>
            <p>
              Properties in this collection are illustrative examples. Seller identity and live
              availability are not verified. Contact the platform team for general questions.
            </p>
            <Link href={editorial ? "/profiles/aj-nova-reality" : "/about"}>
              {editorial ? "Meet the platform team" : "More about the business"}
              <Icon name="arrow" size={16} />
            </Link>
          </div>
        </div>
      </section>
      <div className="sp-section-title">
        <h2>{editorial ? "From the collection" : "Explore the platform collection"}</h2>
        <Link href="/explore">
          All spaces
          <Icon name="arrow" size={16} />
        </Link>
      </div>
      <p className="sp-muted">
        Sample properties · not listings attributed to this business or an individual agent
      </p>
      <div className="sp-visual-grid">
        {demoListings.slice(0, 6).map((item) => (
          <PropertyTile key={item.id} item={item} />
        ))}
      </div>
    </SocialShell>
  );
}
