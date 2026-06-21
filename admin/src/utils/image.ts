import exifr from "exifr";
import type { GalleryExif } from "@chris-sa/gallery-manifest";

export function readImageDimensions(
    file: File
): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
        const url = URL.createObjectURL(file);
        const img = new Image();
        img.onload = () => {
            URL.revokeObjectURL(url);
            resolve({ width: img.naturalWidth, height: img.naturalHeight });
        };
        img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error("Could not read image dimensions"));
        };
        img.src = url;
    });
}

export async function parseGalleryExif(file: File): Promise<GalleryExif | null> {
    try {
        const data = await exifr.parse(file, {
            pick: [
                "Make",
                "Model",
                "LensModel",
                "FocalLength",
                "FNumber",
                "ISO",
                "ExposureTime",
                "DateTimeOriginal",
            ],
        });
        if (!data || typeof data !== "object") return null;

        const make = (data as { Make?: string }).Make;
        const model = (data as { Model?: string }).Model;
        const camera =
            make && model ? `${make} ${model}` : model || make || undefined;

        const focal = (data as { FocalLength?: number }).FocalLength;
        const fNumber = (data as { FNumber?: number }).FNumber;
        const iso = (data as { ISO?: number }).ISO;
        const exposure = (data as { ExposureTime?: number }).ExposureTime;
        const captured = (data as { DateTimeOriginal?: Date }).DateTimeOriginal;

        const hasValue =
            camera ||
            (data as { LensModel?: string }).LensModel ||
            focal ||
            fNumber ||
            iso ||
            exposure ||
            captured;
        if (!hasValue) return null;

        return {
            camera,
            lens: (data as { LensModel?: string }).LensModel,
            focalLengthMm: typeof focal === "number" ? focal : undefined,
            aperture: typeof fNumber === "number" ? fNumber : undefined,
            iso: typeof iso === "number" ? iso : undefined,
            exposureSeconds:
                typeof exposure === "number" ? exposure : undefined,
            capturedAt: captured ? new Date(captured).toISOString() : undefined,
        };
    } catch {
        return null;
    }
}

export function fileExtension(file: File): string {
    const fromName = file.name.split(".").pop()?.toLowerCase();
    if (fromName && fromName.length <= 5) return fromName;
    const mime = file.type.split("/")[1];
    if (mime === "jpeg") return "jpg";
    return mime || "jpg";
}
