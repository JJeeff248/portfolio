import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const MAX_LINES = 400;
const EXTENSIONS = new Set([
    ".ts",
    ".tsx",
    ".js",
    ".jsx",
    ".mjs",
    ".cjs",
    ".css",
    ".html",
]);
const IGNORE_DIR_NAMES = new Set(["node_modules", "dist", ".husky", "public/projects"]);
const IGNORE_FILES = new Set(["package-lock.json"]);

function walkFiles(dir, out = []) {
    let entries;
    try {
        entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
        return out;
    }
    for (const ent of entries) {
        const full = path.join(dir, ent.name);
        if (ent.isDirectory()) {
            if (IGNORE_DIR_NAMES.has(ent.name)) continue;
            walkFiles(full, out);
        } else {
            out.push(full);
        }
    }
    return out;
}

function lineCount(text) {
    if (text.length === 0) return 0;
    let n = 1;
    for (let i = 0; i < text.length; i++) {
        if (text[i] === "\n") n++;
    }
    return n;
}

const violations = [];
for (const file of walkFiles(ROOT)) {
    const base = path.basename(file);
    if (IGNORE_FILES.has(base)) continue;
    const ext = path.extname(file);
    if (!EXTENSIONS.has(ext)) continue;
    const rel = path.relative(ROOT, file);
    const text = fs.readFileSync(file, "utf8");
    const lines = lineCount(text);
    if (lines > MAX_LINES) {
        violations.push({ rel, lines });
    }
}

if (violations.length > 0) {
    console.error(
        `Files exceed ${MAX_LINES} lines (limit is ${MAX_LINES}):\n` +
            violations
                .sort((a, b) => b.lines - a.lines)
                .map((v) => `  ${v.lines}\t${v.rel}`)
                .join("\n")
    );
    process.exit(1);
}
