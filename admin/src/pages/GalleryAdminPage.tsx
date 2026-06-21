import { useCallback, useEffect, useMemo, useState } from "react";
import {
    Alert,
    AppBar,
    Box,
    Button,
    Container,
    Tab,
    Tabs,
    Toolbar,
    Typography,
} from "@mui/material";
import { useAuthContext } from "../context/AuthContext";
import {
    listGalleryItems,
    type GalleryAlbumRow,
    type GalleryPhotoRow,
} from "../api/galleryApi";
import { UploadPanel } from "../components/UploadPanel";
import { PhotosPanel } from "../components/PhotosPanel";
import { AlbumsPanel } from "../components/AlbumsPanel";
import { ManifestPanel } from "../components/ManifestPanel";

function GalleryAdminPage() {
    const auth = useAuthContext();
    const accessToken = auth.user?.access_token ?? "";
    const [tab, setTab] = useState(0);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [photos, setPhotos] = useState<GalleryPhotoRow[]>([]);
    const [albums, setAlbums] = useState<GalleryAlbumRow[]>([]);

    const load = useCallback(async () => {
        if (!accessToken) return;
        setBusy(true);
        setError(null);
        try {
            const items = await listGalleryItems(accessToken);
            setPhotos(
                items.filter(
                    (i): i is GalleryPhotoRow => i.itemType === "photo"
                )
            );
            setAlbums(
                items.filter(
                    (i): i is GalleryAlbumRow => i.itemType === "album"
                )
            );
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : String(e));
        } finally {
            setBusy(false);
        }
    }, [accessToken]);

    useEffect(() => {
        void load();
    }, [load]);

    const publishedCount = useMemo(
        () => photos.filter((p) => p.published).length,
        [photos]
    );

    return (
        <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
            <AppBar
                position="static"
                color="transparent"
                elevation={0}
                sx={{
                    borderBottom: 1,
                    borderColor: "divider",
                    bgcolor: "background.paper",
                }}
            >
                <Toolbar>
                    <Typography
                        variant="h6"
                        sx={{ flexGrow: 1, color: "text.primary", fontWeight: 700 }}
                    >
                        Gallery admin
                    </Typography>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mr: 2, display: { xs: "none", sm: "block" } }}
                    >
                        {photos.length} photos · {publishedCount} published
                    </Typography>
                    <Button
                        color="inherit"
                        sx={{ color: "text.secondary" }}
                        onClick={() => void load()}
                        disabled={busy}
                    >
                        Reload
                    </Button>
                    <Button
                        color="inherit"
                        sx={{ color: "text.secondary" }}
                        onClick={() => void auth.removeUser()}
                    >
                        Sign out
                    </Button>
                </Toolbar>
            </AppBar>

            <Container maxWidth="lg" sx={{ py: 3 }}>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <Tabs
                    value={tab}
                    onChange={(_, v: number) => setTab(v)}
                    sx={{ mb: 3 }}
                >
                    <Tab label="Upload" />
                    <Tab label="Photos" />
                    <Tab label="Albums" />
                    <Tab label="Manifest" />
                </Tabs>

                {tab === 0 && (
                    <UploadPanel
                        accessToken={accessToken}
                        albums={albums}
                        onUploaded={() => void load()}
                    />
                )}
                {tab === 1 && (
                    <PhotosPanel
                        accessToken={accessToken}
                        photos={photos}
                        albums={albums}
                        onChanged={() => void load()}
                    />
                )}
                {tab === 2 && (
                    <AlbumsPanel
                        accessToken={accessToken}
                        albums={albums}
                        onChanged={() => void load()}
                    />
                )}
                {tab === 3 && <ManifestPanel />}
            </Container>
        </Box>
    );
}

export default GalleryAdminPage;
