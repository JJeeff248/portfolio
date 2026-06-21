import { useCallback, useRef, useState } from "react";
import {
    Alert,
    Box,
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    InputLabel,
    LinearProgress,
    MenuItem,
    Select,
    TextField,
    Typography,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import type { GalleryAlbumRow } from "../api/galleryApi";
import {
    createPhoto,
    presignUpload,
    putFileToS3,
} from "../api/galleryApi";
import { slugify } from "../utils/slugify";
import {
    fileExtension,
    parseGalleryExif,
    readImageDimensions,
} from "../utils/image";

type UploadPanelProps = {
    accessToken: string;
    albums: GalleryAlbumRow[];
    onUploaded: () => void;
};

type UploadStep = "idle" | "presign" | "upload" | "create" | "done";

export function UploadPanel({
    accessToken,
    albums,
    onUploaded,
}: UploadPanelProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [slugTouched, setSlugTouched] = useState(false);
    const [published, setPublished] = useState(true);
    const [showExifDefault, setShowExifDefault] = useState(true);
    const [albumSlug, setAlbumSlug] = useState<string>("");
    const [tagsText, setTagsText] = useState("");
    const [dragging, setDragging] = useState(false);
    const [step, setStep] = useState<UploadStep>("idle");
    const [error, setError] = useState<string | null>(null);
    const [dimensions, setDimensions] = useState<{
        width: number;
        height: number;
    } | null>(null);

    const resetForm = () => {
        setFile(null);
        setPreviewUrl(null);
        setTitle("");
        setSlug("");
        setSlugTouched(false);
        setPublished(true);
        setShowExifDefault(true);
        setAlbumSlug("");
        setTagsText("");
        setDimensions(null);
        setStep("idle");
        setError(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleFileSelect = useCallback(async (next: File) => {
        if (!next.type.startsWith("image/")) {
            setError("Please choose an image file.");
            return;
        }
        setError(null);
        setFile(next);
        setPreviewUrl(URL.createObjectURL(next));
        const baseTitle = next.name.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ");
        setTitle((t) => t || baseTitle);
        setSlug((s) => s || slugify(baseTitle));
        try {
            const dims = await readImageDimensions(next);
            setDimensions(dims);
        } catch {
            setDimensions(null);
        }
    }, []);

    const handleUpload = async () => {
        if (!file) return;
        const finalSlug = slugify(slug || title);
        if (!finalSlug || !title.trim()) {
            setError("Title and slug are required.");
            return;
        }
        setError(null);
        try {
            setStep("presign");
            const ext = fileExtension(file);
            const { uploadUrl, fileUrl } = await presignUpload(accessToken, ext);

            setStep("upload");
            await putFileToS3(uploadUrl, file);

            setStep("create");
            const dims =
                dimensions ?? (await readImageDimensions(file));
            const exif = await parseGalleryExif(file);
            const tags = tagsText
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean);

            await createPhoto(accessToken, {
                slug: finalSlug,
                title: title.trim(),
                src: fileUrl,
                width: dims.width,
                height: dims.height,
                published,
                showExifDefault,
                tags,
                albumSlug: albumSlug || null,
                exif,
            });

            setStep("done");
            onUploaded();
            resetForm();
        } catch (e: unknown) {
            setStep("idle");
            setError(e instanceof Error ? e.message : String(e));
        }
    };

    const busy = step !== "idle" && step !== "done";

    return (
        <Box sx={{ maxWidth: 560 }}>
            <Typography variant="h6" gutterBottom>
                Upload photo
            </Typography>
            <Box
                onDragOver={(e) => {
                    e.preventDefault();
                    setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => {
                    e.preventDefault();
                    setDragging(false);
                    const dropped = e.dataTransfer.files[0];
                    if (dropped) void handleFileSelect(dropped);
                }}
                sx={{
                    border: "2px dashed",
                    borderColor: dragging ? "primary.main" : "divider",
                    borderRadius: 2,
                    p: 3,
                    textAlign: "center",
                    mb: 2,
                    bgcolor: dragging ? "action.hover" : "transparent",
                }}
            >
                {previewUrl ? (
                    <Box
                        component="img"
                        src={previewUrl}
                        alt="Preview"
                        sx={{
                            maxWidth: "100%",
                            maxHeight: 240,
                            borderRadius: 1,
                            mb: 1,
                        }}
                    />
                ) : (
                    <CloudUploadIcon
                        sx={{ fontSize: 48, color: "text.secondary", mb: 1 }}
                    />
                )}
                <Typography variant="body2" color="text.secondary" gutterBottom>
                    Drag an image here or choose a file
                </Typography>
                <Button
                    variant="outlined"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={busy}
                >
                    Choose file
                </Button>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) void handleFileSelect(f);
                    }}
                />
            </Box>

            {dimensions && (
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                    {dimensions.width} × {dimensions.height}px
                </Typography>
            )}

            <TextField
                label="Title"
                fullWidth
                margin="dense"
                value={title}
                disabled={busy}
                onChange={(e) => {
                    const v = e.target.value;
                    setTitle(v);
                    if (!slugTouched) setSlug(slugify(v));
                }}
            />
            <TextField
                label="Slug (URL path)"
                fullWidth
                margin="dense"
                value={slug}
                disabled={busy}
                onChange={(e) => {
                    setSlugTouched(true);
                    setSlug(e.target.value);
                }}
                helperText="/gallery/photo/{slug}/"
            />
            <TextField
                label="Tags (comma-separated)"
                fullWidth
                margin="dense"
                value={tagsText}
                disabled={busy}
                onChange={(e) => setTagsText(e.target.value)}
            />
            <FormControl fullWidth margin="dense" disabled={busy}>
                <InputLabel id="album-label">Album</InputLabel>
                <Select
                    labelId="album-label"
                    label="Album"
                    value={albumSlug}
                    onChange={(e) => setAlbumSlug(e.target.value)}
                >
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    {albums.map((a) => (
                        <MenuItem key={a.slug} value={a.slug}>
                            {a.title}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <FormControlLabel
                control={
                    <Checkbox
                        checked={published}
                        disabled={busy}
                        onChange={(e) => setPublished(e.target.checked)}
                    />
                }
                label="Published (visible in public manifest)"
            />
            <FormControlLabel
                control={
                    <Checkbox
                        checked={showExifDefault}
                        disabled={busy}
                        onChange={(e) => setShowExifDefault(e.target.checked)}
                    />
                }
                label="Show EXIF in lightbox by default"
            />

            {busy && (
                <Box sx={{ my: 2 }}>
                    <LinearProgress />
                    <Typography variant="caption" color="text.secondary">
                        {step === "presign" && "Requesting upload URL…"}
                        {step === "upload" && "Uploading to S3…"}
                        {step === "create" && "Saving photo record…"}
                    </Typography>
                </Box>
            )}

            {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                    {error}
                </Alert>
            )}

            <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                <Button
                    variant="contained"
                    disabled={!file || busy || !title.trim()}
                    onClick={() => void handleUpload()}
                >
                    Upload &amp; save
                </Button>
                <Button disabled={busy} onClick={resetForm}>
                    Clear
                </Button>
            </Box>
        </Box>
    );
}
