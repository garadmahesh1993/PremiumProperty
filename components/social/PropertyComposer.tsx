"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SocialShell } from "./SocialShell";
import { Icon } from "./Icon";
import { readDraftMedia, writeDraftMedia, type DraftPhoto } from "@/lib/social/draft-media";
import { useSocial } from "./SocialProvider";

const steps = ["Property type", "Location", "Property details", "Pricing", "Photos", "Review"];
const initial = {
  type: "Apartment",
  purpose: "Sell",
  city: "Pune",
  area: "",
  beds: "2",
  price: "",
  title: "",
  size: "",
  baths: "1",
  furnishing: "Unfurnished",
  description: "",
  priceType: "Asking price",
  coverId: "",
};
type Draft = typeof initial & Record<string, unknown>;
function errorsFor(form: Draft, step: number, photos: DraftPhoto[]) {
  if (step === 1 && (!form.city.trim() || !form.area.trim()))
    return "Add a city and locality before continuing.";
  if (
    step === 2 &&
    (!form.title.trim() ||
      !form.description.trim() ||
      !Number.isFinite(Number(form.size)) ||
      Number(form.size) <= 0)
  )
    return "Add a title, description and a valid positive area.";
  if (step === 3 && (!Number.isFinite(Number(form.price)) || Number(form.price) <= 0))
    return "Enter a valid price greater than zero.";
  if (step === 4 && !photos.length)
    return "Choose at least one property photo for the complete draft.";
  return "";
}
export function PropertyComposer() {
  const router = useRouter(),
    { notify } = useSocial();
  const [ready, setReady] = useState(false),
    [form, setForm] = useState<Draft>(initial),
    [step, setStep] = useState(0),
    [photos, setPhotos] = useState<DraftPhoto[]>([]),
    [previews, setPreviews] = useState<Record<string, string>>({}),
    [error, setError] = useState(""),
    [saved, setSaved] = useState("Checking your draft…"),
    [done, setDone] = useState(false),
    [busy, setBusy] = useState(false),
    [dragging, setDragging] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null),
    upload = useRef<HTMLInputElement>(null);
  useEffect(() => {
    let active = true;
    async function restore() {
      try {
        const account = JSON.parse(localStorage.getItem("pp-account-profile") || "null");
        if (!account?.verified) {
          router.replace("/login?next=%2Fpost-property");
          return;
        }
        const draft = JSON.parse(localStorage.getItem("pp-property-draft") || "null");
        if (draft && typeof draft === "object") {
          const next = { ...initial, ...draft };
          for (const key of Object.keys(initial))
            if (typeof next[key] !== "string") next[key] = initial[key as keyof typeof initial];
          next.priceType = next.purpose === "Rent" ? "Monthly rent" : "Asking price";
          if (active) setForm(next);
        }
        try {
          const media = await readDraftMedia();
          if (active) setPhotos(media);
        } catch {
          if (active)
            setError(
              "Saved photos could not be recovered. Existing text is preserved; browser photo storage may be unavailable.",
            );
        }
        if (active) {
          setReady(true);
          setSaved("Draft recovered · this browser only");
        }
      } catch {
        router.replace("/login?next=%2Fpost-property");
      }
    }
    void restore();
    return () => {
      active = false;
    };
  }, [router]);
  useEffect(() => {
    const urls = Object.fromEntries(
      photos.map((photo) => [photo.id, URL.createObjectURL(photo.blob)]),
    );
    setPreviews(urls);
    return () => Object.values(urls).forEach((url) => URL.revokeObjectURL(url));
  }, [photos]);
  function update(key: keyof typeof initial, value: string) {
    const next = {
      ...form,
      [key]: value,
      ...(key === "purpose"
        ? { priceType: value === "Rent" ? "Monthly rent" : "Asking price" }
        : {}),
    };
    setForm(next);
    setError("");
    try {
      localStorage.setItem("pp-property-draft", JSON.stringify(next));
      setSaved("Draft saved · this browser only");
    } catch {
      setSaved("Unsaved changes · browser storage unavailable");
    }
  }
  async function keepPhotos(next: DraftPhoto[]) {
    setBusy(true);
    try {
      await writeDraftMedia(next);
      setPhotos(next);
      setSaved("Photos saved · this browser only");
      return true;
    } catch {
      setError(
        "Photos could not be saved. Free browser storage and try again. Your previous photos are preserved.",
      );
      return false;
    } finally {
      setBusy(false);
    }
  }
  async function addFiles(files: FileList | File[]) {
    if (busy) return;
    const chosen = Array.from(files);
    if (photos.length + chosen.length > 12) {
      setError("Use up to 12 photos per draft.");
      return;
    }
    if (
      chosen.some(
        (file) =>
          !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
          file.size > 8 * 1024 * 1024,
      )
    ) {
      setError("Choose JPG, PNG or WebP photos, up to 8 MB each.");
      return;
    }
    if (
      photos.reduce((sum, p) => sum + p.blob.size, 0) + chosen.reduce((sum, p) => sum + p.size, 0) >
      40 * 1024 * 1024
    ) {
      setError("Keep the total photo size below 40 MB.");
      return;
    }
    setError("");
    setBusy(true);
    try {
      for (const file of chosen) {
        const bitmap = await createImageBitmap(file);
        bitmap.close();
      }
      await keepPhotos([
        ...photos,
        ...chosen.map((file) => ({ id: crypto.randomUUID(), name: file.name, blob: file })),
      ]);
    } catch {
      setError("One of these files could not be opened as a photo. Choose a valid image.");
    } finally {
      setBusy(false);
      if (upload.current) upload.current.value = "";
    }
  }
  function go(next: number) {
    setError("");
    setStep(next);
    requestAnimationFrame(() => heading.current?.focus());
  }
  function submit(event: FormEvent) {
    event.preventDefault();
    const issue =
      step === 5
        ? [0, 1, 2, 3, 4].map((s) => errorsFor(form, s, photos)).find(Boolean)
        : errorsFor(form, step, photos);
    if (issue) {
      setError(issue);
      return;
    }
    if (step < 5) {
      go(step + 1);
      return;
    }
    try {
      localStorage.setItem("pp-property-draft", JSON.stringify(form));
      localStorage.setItem("pp-demo-listing", JSON.stringify(form));
      setDone(true);
      notify("Complete draft saved on this browser. No listing was published.");
    } catch {
      setError("The complete draft could not be saved. Browser storage is unavailable.");
    }
  }
  const cover = photos.find((x) => x.id === form.coverId) || photos[0],
    isHome = !["Office space", "Plot"].includes(form.type);
  const preview = (
    <article className="sp-composer-preview">
      <div className="sp-composer-preview-photo">
        {cover && previews[cover.id] ? (
          <img src={previews[cover.id]} alt="Your draft cover photo" />
        ) : (
          <>
            <Icon name="home" size={45} />
            <span>Your property, in focus</span>
          </>
        )}
      </div>
      <div>
        <span className="sp-label">PRIVATE DRAFT PREVIEW</span>
        <h3>{form.title || "A new place to call home"}</h3>
        <strong>
          {form.price
            ? `₹${Number(form.price).toLocaleString("en-IN")}${form.purpose === "Rent" ? " / month" : ""}`
            : "Your asking price"}
        </strong>
        <p>{[form.area, form.city].filter(Boolean).join(", ") || "Your neighbourhood"}</p>
        <div className="sp-preview-specs">
          {isHome && <span>{form.beds} BHK</span>}
          <span>{form.size || "—"} sq.ft.</span>
          <span>{form.type}</span>
        </div>
      </div>
    </article>
  );
  if (!ready)
    return (
      <SocialShell rail={false}>
        <p role="status">Opening your property workspace…</p>
      </SocialShell>
    );
  return (
    <SocialShell rail={false}>
      <div className="sp-page-heading">
        <span className="sp-label">YOUR SPACE. YOUR STORY.</span>
        <h1>
          {done ? "Ready for your next chapter." : "Create a property post"}
          <span>.</span>
        </h1>
        <p>
          {done
            ? "Your complete draft is saved privately in this browser. Publishing is not connected."
            : "Bring the details together. Give your property the introduction it deserves."}
        </p>
      </div>
      {done ? (
        <div className="sp-composer-success">
          {preview}
          <div>
            <h2>A complete draft, safely kept</h2>
            <p>
              Text and photos remain on this device. They have not been uploaded, reviewed or
              published.
            </p>
            <button
              className="sp-button"
              onClick={() => {
                setDone(false);
                go(5);
              }}
            >
              Continue editing
            </button>
            <Link className="sp-text-link" href="/account">
              Your profile
              <Icon name="arrow" size={16} />
            </Link>
          </div>
        </div>
      ) : (
        <>
          <ol className="sp-composer-steps" aria-label="Property draft progress">
            {steps.map((label, index) => (
              <li
                key={label}
                aria-current={index === step ? "step" : undefined}
                className={index <= step ? "active" : ""}
              >
                <span>{index < step ? <Icon name="check" size={16} /> : index + 1}</span>
                <strong>{label}</strong>
              </li>
            ))}
          </ol>
          <div className="sp-composer-layout">
            <form className="sp-composer-form" onSubmit={submit}>
              <div className="sp-composer-form-heading">
                <span className="sp-label">STEP {step + 1} OF 6</span>
                <span role="status">{saved}</span>
              </div>
              <h2 ref={heading} tabIndex={-1}>
                {steps[step]}
              </h2>
              <p className="sp-muted">
                {
                  [
                    "Start with the kind of space you’re sharing.",
                    "A location helps the right people discover your space.",
                    "The details that make a property a home.",
                    "Keep pricing clear and easy to compare.",
                    "Put your best view first. Photos stay on this device.",
                    "One last look before saving your complete draft.",
                  ][step]
                }
              </p>
              {step === 0 && (
                <div className="sp-form-grid">
                  <label>
                    Property type
                    <select value={form.type} onChange={(e) => update("type", e.target.value)}>
                      {[
                        "Apartment",
                        "Independent house",
                        "Villa",
                        "Office space",
                        "PG / Co-living",
                        "Plot",
                      ].map((x) => (
                        <option key={x}>{x}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Offering
                    <select
                      value={form.purpose}
                      onChange={(e) => update("purpose", e.target.value)}
                    >
                      <option>Sell</option>
                      <option>Rent</option>
                    </select>
                  </label>
                </div>
              )}
              {step === 1 && (
                <div className="sp-form-grid">
                  <label>
                    City
                    <input
                      required
                      maxLength={100}
                      value={form.city}
                      onChange={(e) => update("city", e.target.value)}
                      autoComplete="address-level2"
                    />
                  </label>
                  <label>
                    Locality
                    <input
                      required
                      maxLength={150}
                      value={form.area}
                      onChange={(e) => update("area", e.target.value)}
                      placeholder="Neighbourhood"
                    />
                  </label>
                  <p className="sp-form-full sp-muted">
                    Keep your precise home address and personal contact details out of the public
                    description.
                  </p>
                </div>
              )}
              {step === 2 && (
                <div className="sp-form-grid">
                  <label className="sp-form-full">
                    Property title
                    <input
                      required
                      maxLength={120}
                      value={form.title}
                      onChange={(e) => update("title", e.target.value)}
                      placeholder="A sunlit home with room to grow"
                    />
                  </label>
                  <label>
                    Area (sq.ft.)
                    <input
                      required
                      type="number"
                      min="1"
                      max="100000000"
                      value={form.size}
                      onChange={(e) => update("size", e.target.value)}
                    />
                  </label>
                  {isHome && (
                    <label>
                      Bedrooms
                      <select value={form.beds} onChange={(e) => update("beds", e.target.value)}>
                        {["Studio", "1", "2", "3", "4", "5"].map((x) => (
                          <option key={x}>{x}</option>
                        ))}
                      </select>
                    </label>
                  )}
                  {form.type !== "Plot" && (
                    <>
                      <label>
                        Bathrooms
                        <select
                          value={form.baths}
                          onChange={(e) => update("baths", e.target.value)}
                        >
                          {["0", "1", "2", "3", "4", "5"].map((x) => (
                            <option key={x}>{x}</option>
                          ))}
                        </select>
                      </label>
                      <label>
                        Furnishing
                        <select
                          value={form.furnishing}
                          onChange={(e) => update("furnishing", e.target.value)}
                        >
                          <option>Unfurnished</option>
                          <option>Semi-furnished</option>
                          <option>Fully furnished</option>
                        </select>
                      </label>
                    </>
                  )}
                  <label className="sp-form-full">
                    Description
                    <textarea
                      required
                      maxLength={3000}
                      rows={5}
                      value={form.description}
                      onChange={(e) => update("description", e.target.value)}
                      placeholder="Tell us about the space, light and everyday essentials…"
                    />
                  </label>
                </div>
              )}
              {step === 3 && (
                <div className="sp-form-grid">
                  <label>
                    {form.purpose === "Rent" ? "Monthly rent" : "Asking price"} (₹)
                    <input
                      required
                      type="number"
                      min="1"
                      max="1000000000000"
                      value={form.price}
                      onChange={(e) => update("price", e.target.value)}
                    />
                  </label>
                  <label>
                    Price basis
                    <input
                      readOnly
                      value={form.purpose === "Rent" ? "Monthly rent" : "Asking price"}
                    />
                  </label>
                </div>
              )}
              {step === 4 && (
                <>
                  <div
                    className={`sp-uploader ${dragging ? "dragging" : ""}`}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragging(true);
                    }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setDragging(false);
                      void addFiles(e.dataTransfer.files);
                    }}
                  >
                    <Icon name="upload" size={37} />
                    <h3>Let your space speak</h3>
                    <p>Drag photos here or choose from your device.</p>
                    <label className="sp-button sp-upload-label">
                      Choose property photos
                      <input
                        ref={upload}
                        className="sp-file-input"
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        multiple
                        disabled={busy}
                        onChange={(e) => {
                          if (e.target.files) void addFiles(e.target.files);
                        }}
                      />
                    </label>
                    <small>JPG, PNG, WebP · 8 MB each · up to 12 photos, 40 MB total</small>
                  </div>
                  <div className="sp-upload-previews">
                    {photos.map((photo) => (
                      <div key={photo.id}>
                        <img src={previews[photo.id]} alt={photo.name} />
                        <button
                          type="button"
                          aria-label={`Remove ${photo.name}`}
                          disabled={busy}
                          onClick={() => void keepPhotos(photos.filter((x) => x.id !== photo.id))}
                        >
                          <Icon name="close" size={15} />
                        </button>
                        <label>
                          <input
                            type="radio"
                            name="cover"
                            checked={cover?.id === photo.id}
                            onChange={() => update("coverId", photo.id)}
                          />
                          Cover photo
                        </label>
                      </div>
                    ))}
                  </div>
                  <p role="status" className="sp-muted">
                    {busy ? "Saving photos…" : `${photos.length} photos saved locally`}
                  </p>
                </>
              )}
              {step === 5 && (
                <div className="sp-review">
                  <dl>
                    {[
                      ["Offering", form.purpose],
                      ["Type", form.type],
                      ["Location", `${form.area}, ${form.city}`],
                      ["Area", `${form.size} sq.ft.`],
                      ...(isHome ? [["Bedrooms", form.beds]] : []),
                      ["Price", `₹${Number(form.price).toLocaleString("en-IN")}`],
                      ["Photos", String(photos.length)],
                    ].map(([label, value]) => (
                      <div key={label}>
                        <dt>{label}</dt>
                        <dd>{value}</dd>
                      </div>
                    ))}
                  </dl>
                  <p>{form.description}</p>
                  <p className="sp-draft-notice">
                    Save a complete local draft. Publishing, ownership checks and moderation require
                    a connected backend.
                  </p>
                </div>
              )}
              {error && (
                <p className="sp-form-error" role="alert">
                  {error}
                </p>
              )}
              <div className="sp-composer-actions">
                <button
                  className="sp-button sp-button-light"
                  type="button"
                  disabled={!step || busy}
                  onClick={() => go(step - 1)}
                >
                  Previous
                </button>
                <button className="sp-button" disabled={busy} type="submit">
                  {step === 5 ? "Save complete draft" : "Continue"}
                  <Icon name="arrow" size={17} />
                </button>
              </div>
            </form>
            <aside className="sp-preview-aside">
              <span className="sp-label">A FIRST LOOK AT YOUR POST</span>
              {preview}
              <p>Live preview · only you can see this draft</p>
            </aside>
          </div>
        </>
      )}
    </SocialShell>
  );
}
