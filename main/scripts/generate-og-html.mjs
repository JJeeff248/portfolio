import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const DIST = path.join(ROOT, "dist");
const BASE = "https://chris-sa.com";

const manifestPath = path.join(ROOT, "src", "generated", "galleryManifest.json");
const manifestRaw = fs.readFileSync(manifestPath, "utf8");
const manifest = JSON.parse(manifestRaw);

const PROJECTS = [
    {
        id: "twentythreefiftynine",
        title: "Twenty Three Fifty Nine",
        description: "A grade tracking website for university students.",
        image: `${BASE}/assets/2359.png`,
    },
    {
        id: "teach-python",
        title: "Teach Python",
        description: "A website for learning Python programming.",
        image: `${BASE}/projects/teach-python/images/HeaderImg.jpg`,
    },
    {
        id: "helpamate",
        title: "Help a Mate",
        description:
            "A fundraising platform to help individuals raise funds for causes.",
        image: `${BASE}/assets/helpamate.png`,
    },
    {
        id: "chapschallenge",
        title: "Chap's Challenge",
        description: "A puzzle game created in Java.",
        image: `${BASE}/assets/chaps-challenge.png`,
    },
];

function galleryIndexOg() {
    const otter =
        manifest.photos?.find((p) => p.slug === "happy-otter-napping") ??
        manifest.photos?.[0];
    if (!otter) {
        throw new Error("gallery manifest must include at least one photo");
    }
    return {
        url: `${BASE}/gallery`,
        title: "Photography — Chris Sá",
        description: "A collection of moments captured through my lens.",
        image: otter.src,
        imageW: otter.width,
        imageH: otter.height,
        imageAlt: `${otter.title} — Chris Sá Photography`,
    };
}

function esc(s) {
    return s
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

function ogBlock({ url, title, description, image, imageW, imageH, imageAlt }) {
    return [
        `        <!-- Open Graph / Social Previews -->`,
        `        <meta property="og:type" content="website" />`,
        `        <meta property="og:site_name" content="Chris S\u00e1" />`,
        `        <meta property="og:url" content="${esc(url)}" />`,
        `        <meta property="og:title" content="${esc(title)}" />`,
        `        <meta property="og:description" content="${esc(description)}" />`,
        `        <meta property="og:image" content="${esc(image)}" />`,
        `        <meta property="og:image:alt" content="${esc(imageAlt ?? title)}" />`,
        `        <meta property="og:image:width" content="${imageW}" />`,
        `        <meta property="og:image:height" content="${imageH}" />`,
        ``,
        `        <!-- Twitter / X Card -->`,
        `        <meta name="twitter:card" content="summary_large_image" />`,
        `        <meta name="twitter:title" content="${esc(title)}" />`,
        `        <meta name="twitter:description" content="${esc(description)}" />`,
        `        <meta name="twitter:image" content="${esc(image)}" />`,
        `        <meta name="twitter:image:alt" content="${esc(imageAlt ?? title)}" />`,
    ].join("\n");
}

const OG_START = "        <!-- Open Graph / Social Previews -->";
const OG_END = '        <meta name="twitter:image:alt"';

function injectOg(template, meta) {
    const start = template.indexOf(OG_START);
    const end =
        template.indexOf("/>", template.indexOf(OG_END)) + 2;
    if (start === -1 || end === 1) throw new Error("OG markers not found in template");
    return template.slice(0, start) + ogBlock(meta) + template.slice(end);
}

function injectTitle(html, title) {
    return html.replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`);
}

function writeRoute(distRelPath, meta) {
    const dir = path.join(DIST, distRelPath);
    fs.mkdirSync(dir, { recursive: true });
    const template = fs.readFileSync(path.join(DIST, "index.html"), "utf8");
    let html = injectOg(template, meta);
    html = injectTitle(html, meta.title);
    fs.writeFileSync(path.join(dir, "index.html"), html);
    console.log(`  wrote dist/${distRelPath}/index.html  —  ${meta.title}`);
}

const template = fs.readFileSync(path.join(DIST, "index.html"), "utf8");
if (!template.includes(OG_START)) {
    console.error("ERROR: OG marker not found in dist/index.html — aborting");
    process.exit(1);
}

console.log("Generating per-route OG HTML...");

writeRoute("gallery", galleryIndexOg());

for (const photo of manifest.photos) {
    const q = encodeURIComponent(photo.slug);
    writeRoute(`gallery/photo/${photo.slug}`, {
        url: `${BASE}/gallery?photo=${q}`,
        title: `${photo.title} — Chris Sá Photography`,
        description: `A photo by Chris Sá: ${photo.title}`,
        image: photo.src,
        imageW: photo.width,
        imageH: photo.height,
        imageAlt: photo.title,
    });
}

for (const project of PROJECTS) {
    writeRoute(`projects/${project.id}`, {
        url: `${BASE}/projects/${project.id}`,
        title: `${project.title} — Chris Sá`,
        description: project.description,
        image: project.image,
        imageW: 1200,
        imageH: 630,
        imageAlt: project.title,
    });
}

console.log("Done.");
