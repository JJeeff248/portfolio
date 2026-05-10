import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const out = path.join(ROOT, "src", "generated", "galleryManifest.json");
const fallback = path.join(ROOT, "galleryManifest.sample.json");

async function main() {
    const url = process.env.GALLERY_MANIFEST_URL;
    let text;
    if (url && url.length > 0) {
        const res = await fetch(url);
        if (!res.ok) {
            throw new Error(
                `GALLERY_MANIFEST_URL fetch failed: ${res.status} ${res.statusText}`
            );
        }
        text = await res.text();
    } else {
        if (!fs.existsSync(fallback)) {
            throw new Error(`Missing ${fallback} and GALLERY_MANIFEST_URL`);
        }
        text = fs.readFileSync(fallback, "utf8");
    }
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, text, "utf8");
    console.log(`Wrote ${out}`);
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
