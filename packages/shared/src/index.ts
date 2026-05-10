import { z } from "zod";

/** Structured EXIF fields exposed to the portfolio (subset of raw EXIF). */
export const GalleryExifSchema = z.object({
    camera: z.string().optional(),
    lens: z.string().optional(),
    focalLengthMm: z.number().optional(),
    aperture: z.number().optional(),
    iso: z.number().optional(),
    exposureSeconds: z.number().optional(),
    capturedAt: z.string().optional(),
    rawNote: z.string().optional(),
});
export type GalleryExif = z.infer<typeof GalleryExifSchema>;

export const GalleryPhotoSchema = z.object({
    slug: z
        .string()
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug must be URL-safe lowercase"),
    title: z.string(),
    src: z.string().url(),
    width: z.number().int().positive(),
    height: z.number().int().positive(),
    aspectRatio: z.number().positive(),
    tags: z.array(z.string()).default([]),
    albumSlug: z.string().nullable().optional(),
    exif: GalleryExifSchema.nullable().optional(),
    showExifDefault: z.boolean().optional().default(true),
});
export type GalleryPhoto = z.infer<typeof GalleryPhotoSchema>;

export const GalleryAlbumSchema = z.object({
    slug: z.string(),
    title: z.string(),
    sortOrder: z.number().int().default(0),
});
export type GalleryAlbum = z.infer<typeof GalleryAlbumSchema>;

export const GalleryManifestSchema = z.object({
    version: z.literal(1),
    generatedAt: z.string(),
    albums: z.array(GalleryAlbumSchema).default([]),
    photos: z.array(GalleryPhotoSchema),
});

export type GalleryManifest = z.infer<typeof GalleryManifestSchema>;

export function parseGalleryManifest(data: unknown): GalleryManifest {
    return GalleryManifestSchema.parse(data);
}
