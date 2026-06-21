import { useEffect, useMemo, useRef, useState } from "react";
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
    onPhotoPatched: (
        photoId: string,
        patch: Partial<GalleryPhotoRow>
    ) => void;
    onPhotoRemoved: (photoId: string) => void;
    onPhotosReordered: (photos: GalleryPhotoRow[]) => void;
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

function withSortOrders(photos: GalleryPhotoRow[]): GalleryPhotoRow[] {
    return photos.map((photo, index) => ({
        ...photo,
        sortOrder: index * 10,
    }));
}

function orderSignature(photos: GalleryPhotoRow[]): string {
    return photos.map((p) => `${p.photoId}:${p.sortOrder ?? 0}`).join("|");
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
    onPhotoPatched,
    onPhotoRemoved,
    onPhotosReordered,
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
    const orderSigRef = useRef(orderSignature(sortPhotos(photos)));

    useEffect(() => {
        const photoMap = new Map(photos.map((p) => [p.photoId, p]));
        const serverSorted = sortPhotos(photos);
        const serverSig = orderSignature(serverSorted);

        setOrdered((prev) => {
            if (prev.length === 0 && photos.length > 0) {
                orderSigRef.current = serverSig;
                return serverSorted;
            }

            const hasNew = photos.some(
                (p) => !prev.some((x) => x.photoId === p.photoId)
            );
            const hasRemoved = prev.some((p) => !photoMap.has(p.photoId));
            const orderChanged = serverSig !== orderSigRef.current;

            if (orderChanged || hasNew || hasRemoved) {
                orderSigRef.current = serverSig;
                return serverSorted;
            }

            return prev
                .map((p) => photoMap.get(p.photoId) ?? p)
                .filter((p) => photoMap.has(p.photoId));
        });
    }, [photos]);

    const patchLocal = (
        photoId: string,
        patch: Partial<GalleryPhotoRow>
    ) => {
        setOrdered((prev) =>
            prev.map((p) => (p.photoId === photoId ? { ...p, ...patch } : p))
        );
        onPhotoPatched(photoId, patch);
    };

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
        const withOrder = withSortOrders(next);
        const updates = withOrder.filter(
            (photo, index) => (next[index].sortOrder ?? 0) !== photo.sortOrder
        );

        if (updates.length === 0) return;

        setBusy(true);
        setError(null);
        try {
            await Promise.all(
                updates.map((photo) =>
                    patchPhoto(accessToken, photo.photoId, {
                        sortOrder: photo.sortOrder,
                    })
                )
            );
            orderSigRef.current = orderSignature(withOrder);
            setOrdered(withOrder);
            onPhotosReordered(withOrder);
        } catch (e: unknown) {
            setOrdered(sortPhotos(photos));
            orderSigRef.current = orderSignature(sortPhotos(photos));
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
        const tags = edit.tagsText
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean);
        const patch = {
            title: edit.title.trim(),
            tags,
            albumSlug: edit.albumSlug || null,
            published: edit.published,
            showExifDefault: edit.showExifDefault,
        };
        try {
            await patchPhoto(accessToken, edit.photo.photoId, patch);
            patchLocal(edit.photo.photoId, patch);
            setEdit(null);
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : String(e));
        } finally {
            setBusy(false);
        }
    };

    const confirmDelete = async () => {
        if (!deleteTarget) return;
        const { photoId } = deleteTarget;
        setBusy(true);
        setError(null);
        try {
            await deletePhoto(accessToken, photoId);
            setOrdered((prev) => prev.filter((p) => p.photoId !== photoId));
            onPhotoRemoved(photoId);
            setDeleteTarget(null);
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : String(e));
        } finally {
            setBusy(false);
        }
    };

    const togglePublished = async (photo: GalleryPhotoRow) => {
        const next = !photo.published;
        patchLocal(photo.photoId, { published: next });
        setError(null);
        try {
            await patchPhoto(accessToken, photo.photoId, { published: next });
        } catch (e: unknown) {
            patchLocal(photo.photoId, { published: photo.published });
            setError(e instanceof Error ? e.message : String(e));
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
                Drag rows to set gallery order. The public site picks up changes
                on the next gallery page load.
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
