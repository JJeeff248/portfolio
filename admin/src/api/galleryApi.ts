import type { GalleryExif, GalleryManifest } from "@chris-sa/gallery-manifest";
import { apiUrl } from "../apiConfig";

export type GalleryPhotoRow = {
    id: string;
    itemType: "photo";
    photoId: string;
    slug: string;
    title: string;
    src: string;
    width: number;
    height: number;
    sortOrder: number;
    published: boolean;
    showExifDefault: boolean;
    tags: string[];
    albumSlug: string | null;
    exif: GalleryExif | null;
    createdAt?: string;
    updatedAt?: string;
};

export type GalleryAlbumRow = {
    id: string;
    itemType: "album";
    slug: string;
    title: string;
    sortOrder: number;
};

export type GalleryItem = GalleryPhotoRow | GalleryAlbumRow;

async function apiFetch(
    path: string,
    accessToken: string,
    init?: RequestInit
): Promise<Response> {
    const headers: HeadersInit = {
        ...(init?.headers ?? {}),
        Authorization: `Bearer ${accessToken}`,
    };
    if (init?.body && !(headers as Record<string, string>)["Content-Type"]) {
        (headers as Record<string, string>)["Content-Type"] = "application/json";
    }
    return fetch(apiUrl(path), { ...init, headers });
}

async function parseError(res: Response): Promise<string> {
    const text = await res.text();
    try {
        const j = JSON.parse(text) as { error?: string };
        return j.error || text || res.statusText;
    } catch {
        return text || res.statusText;
    }
}

export async function listGalleryItems(
    accessToken: string
): Promise<GalleryItem[]> {
    const res = await apiFetch("portfolio/gallery/photos/all", accessToken);
    if (!res.ok) throw new Error(await parseError(res));
    const data = (await res.json()) as { items?: GalleryItem[] };
    return data.items ?? [];
}

export async function fetchPublicManifest(): Promise<GalleryManifest> {
    const res = await fetch(apiUrl("portfolio/gallery-manifest"));
    if (!res.ok) throw new Error(await parseError(res));
    return (await res.json()) as GalleryManifest;
}

export type PresignResult = {
    uploadUrl: string;
    fileUrl: string;
    key: string;
};

export async function presignUpload(
    accessToken: string,
    extension: string
): Promise<PresignResult> {
    const res = await apiFetch(
        `portfolio/gallery-upload?extension=${encodeURIComponent(extension)}`,
        accessToken,
        { method: "POST" }
    );
    if (!res.ok) throw new Error(await parseError(res));
    return (await res.json()) as PresignResult;
}

export async function putFileToS3(
    uploadUrl: string,
    file: File
): Promise<void> {
    const res = await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
    });
    if (!res.ok) throw new Error(`S3 upload failed (${res.status})`);
}

export type CreatePhotoInput = {
    slug: string;
    title: string;
    src: string;
    width: number;
    height: number;
    published?: boolean;
    showExifDefault?: boolean;
    tags?: string[];
    albumSlug?: string | null;
    exif?: GalleryExif | null;
    sortOrder?: number;
};

export async function createPhoto(
    accessToken: string,
    input: CreatePhotoInput
): Promise<{ photoId: string; slug: string }> {
    const res = await apiFetch("portfolio/gallery/photos", accessToken, {
        method: "POST",
        body: JSON.stringify(input),
    });
    if (!res.ok) throw new Error(await parseError(res));
    return (await res.json()) as { photoId: string; slug: string };
}

export type PatchPhotoInput = Partial<
    Pick<
        GalleryPhotoRow,
        | "title"
        | "published"
        | "showExifDefault"
        | "sortOrder"
        | "src"
        | "width"
        | "height"
        | "tags"
        | "albumSlug"
        | "exif"
    >
>;

export async function patchPhoto(
    accessToken: string,
    photoId: string,
    patch: PatchPhotoInput
): Promise<void> {
    const res = await apiFetch(
        `portfolio/gallery/photos/${encodeURIComponent(photoId)}`,
        accessToken,
        { method: "PATCH", body: JSON.stringify(patch) }
    );
    if (!res.ok) throw new Error(await parseError(res));
}

export async function deletePhoto(
    accessToken: string,
    photoId: string
): Promise<void> {
    const res = await apiFetch(
        `portfolio/gallery/photos/${encodeURIComponent(photoId)}`,
        accessToken,
        { method: "DELETE" }
    );
    if (!res.ok) throw new Error(await parseError(res));
}

export type CreateAlbumInput = {
    slug: string;
    title: string;
    sortOrder?: number;
};

export async function createAlbum(
    accessToken: string,
    input: CreateAlbumInput
): Promise<void> {
    const res = await apiFetch("portfolio/gallery/albums", accessToken, {
        method: "POST",
        body: JSON.stringify(input),
    });
    if (!res.ok) throw new Error(await parseError(res));
}
