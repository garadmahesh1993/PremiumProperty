export type DraftPhoto = { id: string; name: string; blob: Blob };
function openStore(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("premiumproperty-drafts", 1);
    request.onupgradeneeded = () => request.result.createObjectStore("media");
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
export async function readDraftMedia(): Promise<DraftPhoto[]> {
  const db = await openStore();
  try {
    return await new Promise((resolve, reject) => {
      const request = db.transaction("media", "readonly").objectStore("media").get("current");
      request.onsuccess = () =>
        resolve(
          Array.isArray(request.result)
            ? request.result.filter((x) => x && typeof x.id === "string" && x.blob instanceof Blob)
            : [],
        );
      request.onerror = () => reject(request.error);
    });
  } finally {
    db.close();
  }
}
export async function writeDraftMedia(photos: DraftPhoto[]): Promise<void> {
  const db = await openStore();
  try {
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction("media", "readwrite");
      transaction.objectStore("media").put(photos, "current");
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
      transaction.onabort = () => reject(transaction.error);
    });
  } finally {
    db.close();
  }
}
