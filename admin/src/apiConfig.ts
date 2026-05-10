const base =
    import.meta.env.VITE_API_BASE_URL ?? "https://api.chris-sa.com";

export function apiUrl(path: string): string {
    const p = path.startsWith("/") ? path.slice(1) : path;
    return `${base}/${p}`;
}
