import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const BASE = "https://chris-sa.com";

const projectsSource = fs.readFileSync(
    path.join(ROOT, "src/data/projects.ts"),
    "utf8"
);
const projectLinks = [
    ...projectsSource.matchAll(/link:\s*"(\/projects\/[^"]+)"/g),
].map((m) => m[1]);

/** Static HTML under public/ not represented in projects.ts */
const extraPaths = [
    "/projects/cotiss/",
    "/projects/teach-python/basics.html",
    "/projects/teach-python/functions.html",
];

const paths = [...new Set(["/", "/gallery", ...projectLinks, ...extraPaths])];
paths.sort((a, b) => a.localeCompare(b));

function escapeXml(s) {
    return s
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

const urlEntries = paths.map((p) => {
    const loc = escapeXml(`${BASE}${p}`);
    const line1 = "  <url>";
    const line2 = `    <loc>${loc}</loc>`;
    const line3 = "  </url>";
    return [line1, line2, line3].join("\n");
});

const header = '<?xml version="1.0" encoding="UTF-8"?>';
const openUrlset =
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
const closeUrlset = "</urlset>";

const xml =
    [header, openUrlset, urlEntries.join("\n"), closeUrlset].join("\n") +
    "\n";

fs.writeFileSync(path.join(ROOT, "public/sitemap.xml"), xml);
