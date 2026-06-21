import { useMemo, useState } from "react";
import {
    Alert,
    Box,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormControlLabel,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Tooltip,
    Typography,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import type { GalleryAlbumRow, GalleryPhotoRow } from "../api/galleryApi";
import { deletePhoto, patchPhoto } from "../api/galleryApi";

type PhotosPanelProps = {
    accessToken: string;
    photos: GalleryPhotoRow[];
    albums: GalleryAlbumRow[];
    onChanged: () => void;
};

type EditState = {
    photo: GalleryPhotoRow;
    title: string;
    sortOrder: string;
    tagsText: string;
    albumSlug: string;
    published: boolean;
    showExifDefault: boolean;
};

export function PhotosPanel({
    accessToken,
    photos,
    albums,
    onChanged,
}: PhotosPanelProps) {
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [edit, setEdit] = useState<EditState | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<GalleryPhotoRow | null>(
        null
    );

    const sorted = useMemo(
        () =>
            [...photos].sort(
                (a, b) =>
                    (a.sortOrder ?? 0) - (b.sortOrder ?? 0) ||
                    a.slug.localeCompare(b.slug)
            ),
        [photos]
    );

    const openEdit = (photo: GalleryPhotoRow) => {
        setEdit({
            photo,
            title: photo.title,
            sortOrder: String(photo.sortOrder ?? 0),
            tagsText: (photo.tags ?? []).join(", "),
            albumSlug: photo.albumSlug ?? "",
            published: photo.published,
            showExifDefault: photo.showExifDefault,
        });
        setError(null);
    };

    const saveEdit = async () => {
        if (!edit) return;
        setBusy(true);
        setError(null);
        try {
            const tags = edit.tagsText
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean);
            await patchPhoto(accessToken, edit.photo.photoId, {
                title: edit.title.trim(),
                sortOrder: Number(edit.sortOrder) || 0,
                tags,
                albumSlug: edit.albumSlug || null,
                published: edit.published,
                showExifDefault: edit.showExifDefault,
            });
            setEdit(null);
            onChanged();
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : String(e));
        } finally {
            setBusy(false);
        }
    };

    const confirmDelete = async () => {
        if (!deleteTarget) return;
        setBusy(true);
        setError(null);
        try {
            await deletePhoto(accessToken, deleteTarget.photoId);
            setDeleteTarget(null);
            onChanged();
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : String(e));
        } finally {
            setBusy(false);
        }
    };

    const togglePublished = async (photo: GalleryPhotoRow) => {
        setBusy(true);
        setError(null);
        try {
            await patchPhoto(accessToken, photo.photoId, {
                published: !photo.published,
            });
            onChanged();
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : String(e));
        } finally {
            setBusy(false);
        }
    };

    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                Photos ({photos.length})
            </Typography>
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Preview</TableCell>
                        <TableCell>Title / slug</TableCell>
                        <TableCell>Published</TableCell>
                        <TableCell align="right">Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {sorted.map((p) => (
                        <TableRow key={p.photoId}>
                            <TableCell>
                                <Box
                                    component="img"
                                    src={p.src}
                                    alt=""
                                    sx={{
                                        width: 72,
                                        height: 48,
                                        objectFit: "cover",
                                        borderRadius: 1,
                                    }}
                                />
                            </TableCell>
                            <TableCell>
                                <Typography variant="body2" fontWeight={600}>
                                    {p.title}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {p.slug}
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Checkbox
                                    checked={p.published}
                                    disabled={busy}
                                    onChange={() => void togglePublished(p)}
                                />
                            </TableCell>
                            <TableCell align="right">
                                <Tooltip title="View on site">
                                    <IconButton
                                        size="small"
                                        href={`https://chris-sa.com/gallery/photo/${p.slug}/`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <OpenInNewIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                                <IconButton
                                    size="small"
                                    disabled={busy}
                                    onClick={() => openEdit(p)}
                                >
                                    <EditIcon fontSize="small" />
                                </IconButton>
                                <IconButton
                                    size="small"
                                    color="error"
                                    disabled={busy}
                                    onClick={() => setDeleteTarget(p)}
                                >
                                    <DeleteOutlineIcon fontSize="small" />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Dialog
                open={!!edit}
                onClose={() => !busy && setEdit(null)}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>Edit photo</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Title"
                        fullWidth
                        margin="dense"
                        value={edit?.title ?? ""}
                        disabled={busy}
                        onChange={(e) =>
                            setEdit((s) =>
                                s ? { ...s, title: e.target.value } : s
                            )
                        }
                    />
                    <TextField
                        label="Sort order"
                        fullWidth
                        margin="dense"
                        type="number"
                        value={edit?.sortOrder ?? "0"}
                        disabled={busy}
                        onChange={(e) =>
                            setEdit((s) =>
                                s ? { ...s, sortOrder: e.target.value } : s
                            )
                        }
                    />
                    <TextField
                        label="Tags (comma-separated)"
                        fullWidth
                        margin="dense"
                        value={edit?.tagsText ?? ""}
                        disabled={busy}
                        onChange={(e) =>
                            setEdit((s) =>
                                s ? { ...s, tagsText: e.target.value } : s
                            )
                        }
                    />
                    <FormControl fullWidth margin="dense" disabled={busy}>
                        <InputLabel id="edit-album-label">Album</InputLabel>
                        <Select
                            labelId="edit-album-label"
                            label="Album"
                            value={edit?.albumSlug ?? ""}
                            onChange={(e) =>
                                setEdit((s) =>
                                    s ? { ...s, albumSlug: e.target.value } : s
                                )
                            }
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
                                checked={edit?.published ?? false}
                                disabled={busy}
                                onChange={(e) =>
                                    setEdit((s) =>
                                        s
                                            ? { ...s, published: e.target.checked }
                                            : s
                                    )
                                }
                            />
                        }
                        label="Published"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={edit?.showExifDefault ?? true}
                                disabled={busy}
                                onChange={(e) =>
                                    setEdit((s) =>
                                        s
                                            ? {
                                                  ...s,
                                                  showExifDefault:
                                                      e.target.checked,
                                              }
                                            : s
                                    )
                                }
                            />
                        }
                        label="Show EXIF by default"
                    />
                </DialogContent>
                <DialogActions>
                    <Button disabled={busy} onClick={() => setEdit(null)}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        disabled={busy || !edit?.title.trim()}
                        onClick={() => void saveEdit()}
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={!!deleteTarget}
                onClose={() => !busy && setDeleteTarget(null)}
            >
                <DialogTitle>Delete photo?</DialogTitle>
                <DialogContent>
                    <Typography>
                        Remove <strong>{deleteTarget?.title}</strong> from
                        DynamoDB? The S3 file is not deleted.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button disabled={busy} onClick={() => setDeleteTarget(null)}>
                        Cancel
                    </Button>
                    <Button
                        color="error"
                        variant="contained"
                        disabled={busy}
                        onClick={() => void confirmDelete()}
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
