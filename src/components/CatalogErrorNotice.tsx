"use client";
import { useCatalog } from "./CatalogProvider";
export default function CatalogErrorNotice() {
  const { error, refresh } = useCatalog();
  return error ? <div className="inline-notice" role="status"><span>{error}</span><button type="button" onClick={() => void refresh()}>Try again</button></div> : null;
}
