import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const DIST = path.join(ROOT, "dist");
const BASE = "https://chris-sa.com";
const STATIC = "https://static.chris-sa.com/gallery/";

const GALLERY_PHOTOS = [
    { index: 0,  title: "Bee sitting on a purple flower",                     file: "00_Bee_sitting_on_a_purple_flower.webp",                      w: 2395, h: 2993 },
    { index: 1,  title: "Sunset over Makara hills with windmill silhouettes", file: "01_Sunset_over_Makara_hills_with_windmill_silhouettes.webp",   w: 5184, h: 2749 },
    { index: 2,  title: "Capybara at Wellington zoo",                         file: "02_Capybara_at_Wellington_zoo.webp",                           w: 3833, h: 2556 },
    { index: 3,  title: "Fruit Splash",                                       file: "08_Fruit_Splash.webp",                                         w: 2849, h: 3744 },
    { index: 4,  title: "A leaf",                                             file: "09_A_leaf.webp",                                               w: 2302, h: 1866 },
    { index: 5,  title: "Happy otter napping",                                file: "10_Happy_otter_napping.webp",                                  w: 5185, h: 3457 },
    { index: 6,  title: "Tui hanging upside down in a kowhai tree",           file: "11_Tui_hanging_upside_down_in_a_kowhai_tree.webp",             w: 4219, h: 2950 },
    { index: 7,  title: "Gas burner in love",                                 file: "12_Gas_burner_in_love.webp",                                   w: 3496, h: 2127 },
    { index: 8,  title: "Stunning seagull",                                   file: "13_Stunning_seagull.webp",                                     w: 2849, h: 4273 },
    { index: 9,  title: "Crab chilling under some water",                     file: "14_Crab_chilling_under_some_water.webp",                       w: 5185, h: 3457 },
    { index: 10, title: "The glowing man",                                    file: "15_The_glowing_man.webp",                                      w: 1120, h: 1899 },
    { index: 11, title: "Wood fire burning hot",                              file: "16_Wood_fire_burning_hot.webp",                                 w: 5185, h: 3457 },
    { index: 12, title: "Huka falls",                                         file: "17_Huka_falls.webp",                                           w: 5185, h: 3457 },
    { index: 13, title: "Fly on a tree",                                      file: "18_Fly_on_a_tree.webp",                                        w: 5185, h: 3457 },
    { index: 14, title: "Morning frost on a green wooden railing",            file: "19_Morning_frost_on_a_green_wooden_railing.webp",              w: 3649, h: 1587 },
    { index: 15, title: "Train Platform",                                     file: "20_Train_Platform.webp",                                       w: 4228, h: 2224 },
    { index: 16, title: "Otters sleeping",                                    file: "21_Otters_sleeping.webp",                                      w: 5185, h: 3457 },
    { index: 17, title: "Is there a ghost",                                   file: "22_Is_there_a_ghost.webp",                                     w: 3865, h: 2521 },
    { index: 18, title: "Donkey at a petting zoo",                            file: "23_Donkey_at_a_petting_zoo.webp",                              w: 2849, h: 4273 },
];

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
        description: "A fundraising platform to help individuals raise funds for causes.",
        image: `${BASE}/assets/helpamate.png`,
    },
    {
        id: "chapschallenge",
        title: "Chap's Challenge",
        description: "A puzzle game created in Java.",
        image: `${BASE}/assets/chaps-challenge.png`,
    },
];

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
const OG_END   = "        <meta name=\"twitter:image:alt\"";

function injectOg(template, meta) {
    const start = template.indexOf(OG_START);
    const end   = template.indexOf("/>", template.indexOf(OG_END)) + 2;
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

// /gallery
writeRoute("gallery", {
    url: `${BASE}/gallery`,
    title: "Photography \u2014 Chris S\u00e1",
    description: "A collection of moments captured through my lens.",
    image: `${STATIC}10_Happy_otter_napping.webp`,
    imageW: 5185,
    imageH: 3457,
    imageAlt: "Happy otter napping \u2014 Chris S\u00e1 Photography",
});

// /gallery?photo=N — each photo gets its own directory under gallery/photo/N/
for (const photo of GALLERY_PHOTOS) {
    writeRoute(`gallery/photo/${photo.index}`, {
        url: `${BASE}/gallery?photo=${photo.index}`,
        title: `${photo.title} \u2014 Chris S\u00e1 Photography`,
        description: `A photo by Chris S\u00e1: ${photo.title}`,
        image: `${STATIC}${photo.file}`,
        imageW: photo.w,
        imageH: photo.h,
        imageAlt: photo.title,
    });
}

// /projects/:id
for (const project of PROJECTS) {
    writeRoute(`projects/${project.id}`, {
        url: `${BASE}/projects/${project.id}`,
        title: `${project.title} \u2014 Chris S\u00e1`,
        description: project.description,
        image: project.image,
        imageW: 1200,
        imageH: 630,
        imageAlt: project.title,
    });
}

console.log("Done.");
