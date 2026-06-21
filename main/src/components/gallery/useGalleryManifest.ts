import { useEffect, useState } from "react";
import {
    parseGalleryManifest,
    type GalleryPhoto,
} from "@chris-sa/gallery-manifest";
import { fallbackGalleryPhotos } from "./galleryData";

const MANIFEST_URL =
    import.meta.env.VITE_GALLERY_MANIFEST_URL ??
    "https://api.chris-sa.com/portfolio/gallery-manifest";

export function useGalleryManifest() {
    const [photos, setPhotos] =
        useState<GalleryPhoto[]>(fallbackGalleryPhotos);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        let cancelled = false;

        void (async () => {
            try {
                const res = await fetch(MANIFEST_URL);
                if (!res.ok) throw new Error(String(res.status));
                const manifest = parseGalleryManifest(await res.json());
                if (!cancelled) setPhotos(manifest.photos);
            } catch {
                // baked manifest from build remains the fallback
            } finally {
                if (!cancelled) setReady(true);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, []);

    return { photos, ready };
}
