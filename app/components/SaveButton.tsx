"use client";
import { useEffect, useState } from "react";
import { FAVORITES_KEY, readStoredIds, writeStoredIds } from "@/lib/demo-data";
export function SaveButton({ id }: { id: string }) {
  const [saved, setSaved] = useState(false);
  useEffect(() => { setSaved(readStoredIds(FAVORITES_KEY).includes(id)); const update=()=>setSaved(readStoredIds(FAVORITES_KEY).includes(id)); window.addEventListener("storage",update); window.addEventListener("pp-favorites",update); return()=>{window.removeEventListener("storage",update);window.removeEventListener("pp-favorites",update)}; },[id]);
  function toggle(){const ids=readStoredIds(FAVORITES_KEY);const next=ids.includes(id)?ids.filter(x=>x!==id):[...ids,id];writeStoredIds(FAVORITES_KEY,next);setSaved(next.includes(id));window.dispatchEvent(new Event("pp-favorites"));}
  return <button className={`save-button ${saved?"is-saved":""}`} aria-label={saved?"Remove from shortlist":"Save property"} aria-pressed={saved} onClick={toggle}>{saved?"♥":"♡"}</button>;
}
