import rawManifest from "../../generated/galleryManifest.json";
import {
    parseGalleryManifest,
    type GalleryPhoto as GP,
} from "@chris-sa/gallery-manifest";

const manifest = parseGalleryManifest(rawManifest);

export type Photo = GP;

export type { GalleryExif } from "@chris-sa/gallery-manifest";

/** Baked at build time; used until live manifest loads (and as offline fallback). */
export const fallbackGalleryPhotos: Photo[] = manifest.photos;

/** @deprecated use fallbackGalleryPhotos or useGalleryManifest */
export const galleryPhotos: Photo[] = fallbackGalleryPhotos;

export function getPhotoIndexBySlug(
    photos: Photo[],
    slug: string | null
): number | null {
    if (!slug || slug.trim() === "") return null;
    const i = photos.findIndex((p) => p.slug === slug);
    return i === -1 ? null : i;
}

export function indexRecord(
    length: number,
    value: boolean
): Record<number, boolean> {
    const record: Record<number, boolean> = {};
    for (let i = 0; i < length; i++) {
        record[i] = value;
    }
    return record;
}
