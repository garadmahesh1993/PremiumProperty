"use client";
import { useState } from "react";
import Link from "next/link";
import { demoListings } from "@/lib/demo-data";
import { SocialShell } from "@/components/social/SocialShell";
import { PropertyTile } from "@/components/social/PropertyTile";
import { useSocial } from "@/components/social/SocialProvider";
import { Icon } from "@/components/social/Icon";
import { Modal } from "@/components/social/Modal";

export default function SavedPage() {
  const { saved, collections, createCollection, removeFromCollection } = useSocial();
  const [selected, setSelected] = useState("all"),
    [open, setOpen] = useState(false),
    [name, setName] = useState(""),
    [page, setPage] = useState(1);
  const collection = collections.find((x) => x.id === selected);
  const items = demoListings.filter((item) =>
    (selected === "all" ? saved : collection?.propertyIds || []).includes(item.id),
  );
  const total = Math.max(1, Math.ceil(items.length / 6)),
    current = Math.min(page, total);
  return (
    <SocialShell rail={false}>
      <div className="sp-page-heading sp-heading-action">
        <div>
          <span className="sp-label">A LITTLE CLOSER TO HOME</span>
          <h1>
            Your collection of possibilities<span>.</span>
          </h1>
          <p>Saved privately in this browser. No account sync is connected.</p>
        </div>
        <button className="sp-button" onClick={() => setOpen(true)}>
          <Icon name="plus" size={18} />
          New collection
        </button>
      </div>
      <div className="sp-collection-grid">
        <button
          type="button"
          className={selected === "all" ? "active" : ""}
          onClick={() => {
            setSelected("all");
            setPage(1);
          }}
        >
          <Icon name="bookmark" size={29} />
          <strong>All saved spaces</strong>
          <span>{saved.filter((id) => demoListings.some((x) => x.id === id)).length} saved</span>
        </button>
        {collections.map((item) => (
          <button
            type="button"
            key={item.id}
            className={selected === item.id ? "active" : ""}
            onClick={() => {
              setSelected(item.id);
              setPage(1);
            }}
          >
            <Icon name="grid" size={29} />
            <strong>{item.name}</strong>
            <span>{item.propertyIds.length} spaces</span>
          </button>
        ))}
      </div>
      <div className="sp-section-title">
        <h2>{collection?.name || "All saved spaces"}</h2>
        <span>{items.length} properties</span>
      </div>
      {items.length ? (
        <>
          <div className="sp-visual-grid">
            {items.slice((current - 1) * 6, current * 6).map((item) => (
              <div key={item.id}>
                <PropertyTile item={item} />
                {collection && (
                  <button
                    type="button"
                    className="sp-remove-collection"
                    onClick={() => removeFromCollection(collection.id, item.id)}
                  >
                    Remove from this collection
                  </button>
                )}
              </div>
            ))}
          </div>
          <nav className="sp-pagination" aria-label="Saved pages">
            <button
              className="sp-button sp-button-light"
              disabled={current === 1}
              onClick={() => setPage(current - 1)}
            >
              Previous
            </button>
            <span>
              {current} / {total}
            </span>
            <button
              className="sp-button"
              disabled={current === total}
              onClick={() => setPage(current + 1)}
            >
              Next spaces
            </button>
          </nav>
        </>
      ) : (
        <div className="sp-empty">
          <Icon name="bookmark" size={38} />
          <h2>Make room for your favourites</h2>
          <p>Tap Save on a property. Use its + action to add it to a collection.</p>
          <Link className="sp-button" href="/explore">
            Find your inspiration
            <Icon name="arrow" size={17} />
          </Link>
        </div>
      )}
      <Modal open={open} onClose={() => setOpen(false)} title="Create a collection">
        <p>Dream Homes, Shortlisted, Investment Options… make it your own.</p>
        <form
          className="sp-inline-form"
          onSubmit={(e) => {
            e.preventDefault();
            if (createCollection(name)) {
              setName("");
              setOpen(false);
            }
          }}
        >
          <label className="sp-sr" htmlFor="saved-collection-name">
            Collection name
          </label>
          <input
            id="saved-collection-name"
            required
            maxLength={40}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Collection name"
          />
          <button className="sp-button">Create</button>
        </form>
      </Modal>
    </SocialShell>
  );
}
