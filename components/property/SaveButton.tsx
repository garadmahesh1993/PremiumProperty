"use client";
import { useSocial } from "@/components/social/SocialProvider";
export function SaveButton({ id }: { id: string }) {
  const { saved: ids, toggleSave } = useSocial();
  const saved = ids.includes(id);
  function toggle() {
    toggleSave(id);
  }
  return (
    <button
      className={`save-button ${saved ? "is-saved" : ""}`}
      aria-label={saved ? "Remove from shortlist" : "Save property"}
      aria-pressed={saved}
      onClick={toggle}
    >
      {saved ? "♥" : "♡"}
    </button>
  );
}
