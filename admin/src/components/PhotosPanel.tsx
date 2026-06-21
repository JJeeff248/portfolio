import { useEffect, useMemo, useState } from "react";
import {
    DndContext,
    KeyboardSensor,
    PointerSensor,
    closestCenter,
    type DragEndEvent,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    SortableContext,
    arrayMove,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
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
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import EditIcon from "@mui/icons-material/Edit";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
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
    tagsText: string;
    albumSlug: string;
    published: boolean;
    showExifDefault: boolean;
};

function publicPhotoUrl(slug: string): string {
    return `https://chris-sa.com/gallery?photo=${encodeURIComponent(slug)}`;
}

function sortPhotos(photos: GalleryPhotoRow[]): GalleryPhotoRow[] {
    return [...photos].sort(
        (a, b) =>
            (a.sortOrder ?? 0) - (b.sortOrder ?? 0) ||
            a.slug.localeCompare(b.slug)
    );
}

type SortablePhotoRowProps = {
    photo: GalleryPhotoRow;
    busy: boolean;
    copiedId: string | null;
    onTogglePublished: (photo: GalleryPhotoRow) => void;
    onCopyLink: (photo: GalleryPhotoRow) => void;
    onEdit: (photo: GalleryPhotoRow) => void;
    onDelete: (photo: GalleryPhotoRow) => void;
};

function SortablePhotoRow({
    photo,
    busy,
    copiedId,
    onTogglePublished,
    onCopyLink,
    onEdit,
    onDelete,
}: SortablePhotoRowProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: photo.photoId });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.6 : 1,
    };

    return (
        <TableRow ref={setNodeRef} style={style} hover>
            <TableCell sx={{ width: 40, px: 0.5 }}>
                <IconButton
                    size="small"
                    disabled={busy}
                    sx={{ cursor: isDragging ? "grabbing" : "grab", touchAction: "none" }}
                    aria-label={`Reorder ${photo.title}`}
                    {...attributes}
                    {...listeners}
                >
                    <DragIndicatorIcon fontSize="small" color="action" />
                </IconButton>
            </TableCell>
            <TableCell>
                <Box
                    component="img"
                    src={photo.src}
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
                    {photo.title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                    {photo.slug}
                </Typography>
            </TableCell>
            <TableCell>
                <Checkbox
                    checked={photo.published}
                    disabled={busy}
                    onChange={() => onTogglePublished(photo)}
                />
            </TableCell>
            <TableCell align="right">
                <Tooltip title="View on site">
                    <IconButton
                        size="small"
                        href={publicPhotoUrl(photo.slug)}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <OpenInNewIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
                <Tooltip
                    title={
                        copiedId === photo.photoId
                            ? "Copied!"
                            : "Copy gallery link"
                    }
                >
                    <IconButton
                        size="small"
                        disabled={busy}
                        onClick={() => onCopyLink(photo)}
                    >
                        <ContentCopyIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
                <IconButton
                    size="small"
                    disabled={busy}
                    onClick={() => onEdit(photo)}
                >
                    <EditIcon fontSize="small" />
                </IconButton>
                <IconButton
                    size="small"
                    color="error"
                    disabled={busy}
                    onClick={() => onDelete(photo)}
                >
                    <DeleteOutlineIcon fontSize="small" />
                </IconButton>
            </TableCell>
        </TableRow>
    );
}

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
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [ordered, setOrdered] = useState<GalleryPhotoRow[]>(() =>
        sortPhotos(photos)
    );

    useEffect(() => {
        setOrdered(sortPhotos(photos));
    }, [photos]);

    const photoIds = useMemo(
        () => ordered.map((p) => p.photoId),
        [ordered]
    );

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const persistOrder = async (next: GalleryPhotoRow[]) => {
        const updates = next
            .map((photo, index) => ({
                photo,
                sortOrder: index * 10,
            }))
            .filter(
                ({ photo, sortOrder }) => (photo.sortOrder ?? 0) !== sortOrder
            );

        if (updates.length === 0) return;

        setBusy(true);
        setError(null);
        try {
            await Promise.all(
                updates.map(({ photo, sortOrder }) =>
                    patchPhoto(accessToken, photo.photoId, { sortOrder })
                )
            );
            onChanged();
        } catch (e: unknown) {
            setOrdered(sortPhotos(photos));
            setError(e instanceof Error ? e.message : String(e));
        } finally {
            setBusy(false);
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = ordered.findIndex((p) => p.photoId === active.id);
        const newIndex = ordered.findIndex((p) => p.photoId === over.id);
        if (oldIndex < 0 || newIndex < 0) return;

        const next = arrayMove(ordered, oldIndex, newIndex);
        setOrdered(next);
        void persistOrder(next);
    };

    const openEdit = (photo: GalleryPhotoRow) => {
        setEdit({
            photo,
            title: photo.title,
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

    const copyLink = async (photo: GalleryPhotoRow) => {
        try {
            await navigator.clipboard.writeText(publicPhotoUrl(photo.slug));
            setCopiedId(photo.photoId);
            window.setTimeout(() => setCopiedId(null), 2000);
        } catch {
            setError("Could not copy link to clipboard");
        }
    };

    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                Photos ({photos.length})
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Drag rows to set gallery order (top appears first on the public
                site).
            </Typography>
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ width: 40 }} />
                            <TableCell>Preview</TableCell>
                            <TableCell>Title / slug</TableCell>
                            <TableCell>Published</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <SortableContext
                        items={photoIds}
                        strategy={verticalListSortingStrategy}
                    >
                        <TableBody>
                            {ordered.map((p) => (
                                <SortablePhotoRow
                                    key={p.photoId}
                                    photo={p}
                                    busy={busy}
                                    copiedId={copiedId}
                                    onTogglePublished={(photo) =>
                                        void togglePublished(photo)
                                    }
                                    onCopyLink={(photo) => void copyLink(photo)}
                                    onEdit={openEdit}
                                    onDelete={setDeleteTarget}
                                />
                            ))}
                        </TableBody>
                    </SortableContext>
                </Table>
            </DndContext>

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
