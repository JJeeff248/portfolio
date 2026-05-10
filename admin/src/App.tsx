/**
 * Static SPA: paste a Cognito access token (same pool as blog admin) after signing in elsewhere,
 * or wire OAuth later. Reads/writes `portfolio/gallery/*` on api.chris-sa.com.
 */
import { useCallback, useEffect, useMemo, useState } from "react";
import { apiUrl } from "./apiConfig";

const TOKEN_KEY = "portfolio_gallery_access_token";

type PhotoRow = {
    photoId?: string;
    slug?: string;
    title?: string;
    published?: boolean;
};

function App() {
    const [token, setToken] = useState(
        () => localStorage.getItem(TOKEN_KEY) ?? ""
    );
    const [busy, setBusy] = useState(false);
    const [err, setErr] = useState<string | null>(null);
    const [photos, setPhotos] = useState<PhotoRow[]>([]);

    const authHdr = useMemo(
        () => (token.trim() ? { Authorization: `Bearer ${token.trim()}` } : {}),
        [token]
    );

    const saveToken = () => {
        localStorage.setItem(TOKEN_KEY, token.trim());
        setErr(null);
    };

    const loadPhotos = useCallback(async () => {
        setBusy(true);
        setErr(null);
        try {
            const res = await fetch(
                apiUrl("portfolio/gallery/photos/all"),
                { headers: authHdr as HeadersInit }
            );
            if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
            const data = (await res.json()) as { items?: PhotoRow[] };
            setPhotos(
                data.items?.filter((i: Record<string, unknown>) => i.itemType === "photo") ??
                    []
            );
        } catch (e: unknown) {
            setErr(e instanceof Error ? e.message : String(e));
        } finally {
            setBusy(false);
        }
    }, [authHdr]);

    useEffect(() => {
        if (token.trim()) void loadPhotos();
    }, [loadPhotos, token]);

    async function togglePublished(photoId: string | undefined, next: boolean) {
        if (!photoId || !token) return;
        setBusy(true);
        try {
            const res = await fetch(
                apiUrl(`portfolio/gallery/photos/${encodeURIComponent(photoId)}`),
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        ...(authHdr as Record<string, string>),
                    },
                    body: JSON.stringify({ published: next }),
                }
            );
            if (!res.ok) throw new Error(await res.text());
            await loadPhotos();
        } finally {
            setBusy(false);
        }
    }

    async function publishManifestHint() {
        setErr(null);
        setBusy(true);
        try {
            const res = await fetch(apiUrl("portfolio/gallery-manifest"));
            if (!res.ok) throw new Error(await res.text());
            const blob = JSON.stringify(await res.json(), null, 2);
            navigator.clipboard.writeText(blob).catch(() => {});
            alert(
                "Fetched public manifest JSON (also copied). Point portfolio CI at this URL:\\n"
                    + apiUrl("portfolio/gallery-manifest")
            );
        } catch (e: unknown) {
            setErr(e instanceof Error ? e.message : String(e));
        } finally {
            setBusy(false);
        }
    }

    return (
        <main style={{ padding: 24, maxWidth: 640 }}>
            <h1 style={{ marginTop: 0 }}>Gallery (Dynamo)</h1>
            <p style={{ opacity: 0.85 }}>
                API routes live under{" "}
                <code>/portfolio/gallery*</code>. Use JWT from Cognito (
                blog admin pool — same issuer as api.chris-sa.com authorizer).
            </p>
            <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                Bearer access_token
                <textarea
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    rows={3}
                    placeholder="Paste access_token"
                    style={{ fontFamily: "monospace", fontSize: 12 }}
                />
            </label>
            <div style={{ marginTop: 8, display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button type="button" onClick={saveToken}>
                    Save token locally
                </button>
                <button
                    type="button"
                    disabled={busy || !token.trim()}
                    onClick={() => void loadPhotos()}
                >
                    Refresh list
                </button>
                <button type="button" disabled={busy} onClick={() => void publishManifestHint()}>
                    GET public manifest
                </button>
            </div>
            <p style={{ fontSize: 13, opacity: 0.8 }}>
                Env:{" "}
                <code>VITE_API_BASE_URL</code> (default prod API).
                Create DynamoDB table <code>gallery</code>, partition key <code>
                    id
                </code>{" "}
                (String).
            </p>

            {err && <p style={{ color: "crimson" }}>{err}</p>}

            <ul style={{ listStyle: "none", padding: 0 }}>
                {photos.map((p, i) => (
                    <li
                        key={p.photoId ?? p.slug ?? i}
                        style={{
                            borderBottom: "1px solid #ccc",
                            padding: "10px 0",
                        }}
                    >
                        <strong>{p.title ?? "(no title)"}</strong>
                        <div>
                            <code>{p.slug}</code> — id {p.photoId}
                        </div>
                        <label>
                            <input
                                type="checkbox"
                                checked={!!p.published}
                                disabled={busy}
                                onChange={() =>
                                    void togglePublished(
                                        p.photoId,
                                        !p.published
                                    )
                                }
                            />{" "}
                            Published (in public manifest)
                        </label>
                    </li>
                ))}
            </ul>
        </main>
    );
}

export default App;
