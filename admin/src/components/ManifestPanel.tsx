import { useEffect, useState } from "react";
import {
    Alert,
    Box,
    Button,
    Link,
    Typography,
} from "@mui/material";
import { apiUrl } from "../apiConfig";
import { fetchPublicManifest } from "../api/galleryApi";

export function ManifestPanel() {
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [summary, setSummary] = useState<{
        photos: number;
        albums: number;
        generatedAt: string;
    } | null>(null);

    const manifestUrl = apiUrl("portfolio/gallery-manifest");

    const load = async () => {
        setBusy(true);
        setError(null);
        try {
            const m = await fetchPublicManifest();
            setSummary({
                photos: m.photos.length,
                albums: m.albums?.length ?? 0,
                generatedAt: m.generatedAt,
            });
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : String(e));
            setSummary(null);
        } finally {
            setBusy(false);
        }
    };

    useEffect(() => {
        void load();
    }, []);

    return (
        <Box sx={{ maxWidth: 640 }}>
            <Typography variant="h6" gutterBottom>
                Public manifest
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
                Published photos are served at{" "}
                <Link href={manifestUrl} target="_blank" rel="noopener noreferrer">
                    {manifestUrl}
                </Link>
                . Portfolio site CI uses <code>GALLERY_MANIFEST_URL</code> to
                bake this into the static build.
            </Typography>
            <Button variant="outlined" disabled={busy} onClick={() => void load()}>
                Refresh summary
            </Button>
            {summary && (
                <Box sx={{ mt: 2 }}>
                    <Typography variant="body2">
                        <strong>{summary.photos}</strong> published photos,{" "}
                        <strong>{summary.albums}</strong> albums
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        generatedAt: {summary.generatedAt}
                    </Typography>
                </Box>
            )}
            {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                    {error}
                </Alert>
            )}
        </Box>
    );
}
