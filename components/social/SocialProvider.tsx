"use client";
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { FAVORITES_KEY, readStoredIds, writeStoredIds } from "@/lib/demo-data";
import { COLLECTIONS_KEY, readCollections, type Collection } from "@/lib/social/storage";
import { Modal } from "./Modal";
import { Icon } from "./Icon";
type State = {
  saved: string[];
  collections: Collection[];
  toggleSave: (id: string) => void;
  addToCollection: (id: string) => void;
  notify: (text: string) => void;
  createCollection: (name: string) => boolean;
  removeFromCollection: (collectionId: string, id: string) => void;
};
const Context = createContext<State>({
  saved: [],
  collections: [],
  toggleSave: () => {},
  addToCollection: () => {},
  notify: () => {},
  createCollection: () => false,
  removeFromCollection: () => {},
});
export const useSocial = () => useContext(Context);
export function SocialProvider({ children }: { children: ReactNode }) {
  const [saved, setSaved] = useState<string[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [message, setMessage] = useState("");
  const [target, setTarget] = useState<string | null>(null);
  const [name, setName] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  function notify(text: string) {
    setMessage(text);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setMessage(""), 4000);
  }
  useEffect(() => {
    const refresh = () => {
      setSaved(readStoredIds(FAVORITES_KEY));
      setCollections(readCollections());
    };
    refresh();
    window.addEventListener("pp-favorites", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("pp-favorites", refresh);
      window.removeEventListener("storage", refresh);
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);
  function persist(nextSaved: string[], nextCollections: Collection[]) {
    try {
      writeStoredIds(FAVORITES_KEY, nextSaved);
      localStorage.setItem(COLLECTIONS_KEY, JSON.stringify(nextCollections));
      setSaved(nextSaved);
      setCollections(nextCollections);
      window.dispatchEvent(new Event("pp-favorites"));
      return true;
    } catch {
      notify("Could not save changes. Browser storage is unavailable or full.");
      return false;
    }
  }
  function toggleSave(id: string) {
    const previous = readStoredIds(FAVORITES_KEY);
    const wasSaved = previous.includes(id);
    const next = wasSaved ? previous.filter((value) => value !== id) : [...previous, id];
    const nextCollections = wasSaved
      ? readCollections().map((collection) => ({
          ...collection,
          propertyIds: collection.propertyIds.filter((value) => value !== id),
        }))
      : readCollections();
    if (persist(next, nextCollections))
      notify(
        wasSaved ? "Removed from saved properties." : "Saved on this browser. Find it in Saved.",
      );
  }
  function createCollection(value: string) {
    const clean = value.trim();
    if (!clean || clean.length > 40) {
      notify("Choose a collection name between 1 and 40 characters.");
      return false;
    }
    const current = readCollections();
    if (current.some((item) => item.name.toLowerCase() === clean.toLowerCase())) {
      notify("A collection with this name already exists.");
      return false;
    }
    return persist(readStoredIds(FAVORITES_KEY), [
      ...current,
      { id: crypto.randomUUID(), name: clean, propertyIds: [] },
    ]);
  }
  function assign(collectionId: string) {
    if (!target) return;
    const previous = readStoredIds(FAVORITES_KEY);
    const next = readCollections().map((collection) =>
      collection.id === collectionId
        ? { ...collection, propertyIds: [...new Set([...collection.propertyIds, target])] }
        : collection,
    );
    if (persist([...new Set([...previous, target])], next)) {
      setTarget(null);
      notify("Property added to your collection on this browser.");
    }
  }
  function removeFromCollection(collectionId: string, id: string) {
    persist(
      readStoredIds(FAVORITES_KEY),
      readCollections().map((collection) =>
        collection.id === collectionId
          ? { ...collection, propertyIds: collection.propertyIds.filter((value) => value !== id) }
          : collection,
      ),
    );
  }
  return (
    <Context.Provider
      value={{
        saved,
        collections,
        toggleSave,
        addToCollection: setTarget,
        notify,
        createCollection,
        removeFromCollection,
      }}
    >
      {children}
      <div className={`sp-toast ${message ? "is-visible" : ""}`} role="status" aria-live="polite">
        {message && (
          <>
            <Icon name="check" size={18} />
            {message}
          </>
        )}
      </div>
      <Modal open={target !== null} onClose={() => setTarget(null)} title="Save to a collection">
        <p className="sp-muted">Your collections are private to this browser.</p>
        <div className="sp-collection-choices">
          {collections.map((collection) => (
            <button type="button" key={collection.id} onClick={() => assign(collection.id)}>
              <Icon name="bookmark" />
              <span>{collection.name}</span>
              <Icon name="plus" size={18} />
            </button>
          ))}
        </div>
        <form
          className="sp-inline-form"
          onSubmit={(event) => {
            event.preventDefault();
            if (createCollection(name)) setName("");
          }}
        >
          <label className="sp-sr" htmlFor="new-collection-name">
            New collection name
          </label>
          <input
            id="new-collection-name"
            maxLength={40}
            required
            placeholder="New collection name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <button className="sp-button" type="submit">
            Create
          </button>
        </form>
        {!collections.length && (
          <p className="sp-muted">
            Create your first collection, then select it to add this property.
          </p>
        )}
      </Modal>
    </Context.Provider>
  );
}
