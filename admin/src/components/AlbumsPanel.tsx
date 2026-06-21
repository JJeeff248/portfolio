import { useState } from "react";
import {
    Alert,
    Box,
    Button,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from "@mui/material";
import type { GalleryAlbumRow } from "../api/galleryApi";
import { createAlbum } from "../api/galleryApi";
import { slugify } from "../utils/slugify";

type AlbumsPanelProps = {
    accessToken: string;
    albums: GalleryAlbumRow[];
    onAlbumCreated: (album: GalleryAlbumRow) => void;
};

export function AlbumsPanel({
    accessToken,
    albums,
    onAlbumCreated,
}: AlbumsPanelProps) {
    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [slugTouched, setSlugTouched] = useState(false);
    const [sortOrder, setSortOrder] = useState("0");
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleCreate = async () => {
        const finalSlug = slugify(slug || title);
        if (!finalSlug || !title.trim()) {
            setError("Title and slug are required.");
            return;
        }
        setBusy(true);
        setError(null);
        setSuccess(null);
        try {
            const finalSort = Number(sortOrder) || 0;
            await createAlbum(accessToken, {
                slug: finalSlug,
                title: title.trim(),
                sortOrder: finalSort,
            });
            onAlbumCreated({
                id: `album#${finalSlug}`,
                itemType: "album",
                slug: finalSlug,
                title: title.trim(),
                sortOrder: finalSort,
            });
            setTitle("");
            setSlug("");
            setSlugTouched(false);
            setSortOrder("0");
            setSuccess(`Album "${title.trim()}" created.`);
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : String(e));
        } finally {
            setBusy(false);
        }
    };

    const sorted = [...albums].sort(
        (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0) || a.slug.localeCompare(b.slug)
    );

    return (
        <Box sx={{ maxWidth: 560 }}>
            <Typography variant="h6" gutterBottom>
                Albums ({albums.length})
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 3 }}>
                <TextField
                    label="Album title"
                    value={title}
                    disabled={busy}
                    onChange={(e) => {
                        const v = e.target.value;
                        setTitle(v);
                        if (!slugTouched) setSlug(slugify(v));
                    }}
                />
                <TextField
                    label="Slug"
                    value={slug}
                    disabled={busy}
                    onChange={(e) => {
                        setSlugTouched(true);
                        setSlug(e.target.value);
                    }}
                />
                <TextField
                    label="Sort order"
                    type="number"
                    value={sortOrder}
                    disabled={busy}
                    onChange={(e) => setSortOrder(e.target.value)}
                />
                <Button
                    variant="contained"
                    disabled={busy || !title.trim()}
                    onClick={() => void handleCreate()}
                    sx={{ alignSelf: "flex-start" }}
                >
                    Create album
                </Button>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}
            {success && (
                <Alert severity="success" sx={{ mb: 2 }}>
                    {success}
                </Alert>
            )}

            {sorted.length > 0 && (
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Title</TableCell>
                            <TableCell>Slug</TableCell>
                            <TableCell>Sort</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sorted.map((a) => (
                            <TableRow key={a.slug}>
                                <TableCell>{a.title}</TableCell>
                                <TableCell>
                                    <code>{a.slug}</code>
                                </TableCell>
                                <TableCell>{a.sortOrder ?? 0}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </Box>
    );
}
