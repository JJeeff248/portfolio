/**
 * CloudFront Function: og-injector
 *
 * Intercepts viewer-request events and rewrites the HTML response from S3
 * to inject per-page Open Graph / Twitter Card meta tags.
 *
 * Runtime: cloudfront-js-2.0
 * Event type: viewer-response  (attach to the Default (*) cache behaviour)
 *
 * HOW IT WORKS
 * ─────────────────────────────────────────────────────────────────────────────
 * CloudFront serves index.html for every SPA route (via the S3 custom error
 * page config that maps 403/404 → /index.html). This function runs AFTER the
 * response is fetched, reads the URI + query string from the original request,
 * and replaces the og:/twitter: meta tags in the HTML body before returning it
 * to the browser / crawler.
 *
 * IMPORTANT: The function must be associated as a viewer-response function,
 * NOT a viewer-request function, because it needs to modify the response body.
 * CloudFront Functions support body manipulation only in viewer-response.
 * Body access requires "Include body" to be enabled on the function association.
 *
 * PAGES HANDLED
 * ─────────────────────────────────────────────────────────────────────────────
 *  /                         → Portfolio overview
 *  /gallery                  → Photography gallery
 *  /gallery?photo=<n>        → Individual photo (uses static.chris-sa.com image)
 *  /projects/:projectId      → Individual project page
 *
 * UPDATING PHOTO / PROJECT DATA
 * ─────────────────────────────────────────────────────────────────────────────
 * Keep PHOTOS and PROJECTS in sync with:
 *   main/src/components/gallery/galleryData.ts
 *   main/src/data/projects.ts
 */

var SITE_URL = "https://chris-sa.com";
var STATIC_URL = "https://static.chris-sa.com/gallery/";
var SITE_NAME = "Chris S\xE1"; // "Sá" — HTML-entity free for JS string
var DEFAULT_IMAGE = STATIC_URL + "10_Happy_otter_napping.webp";
var DEFAULT_IMAGE_W = "5185";
var DEFAULT_IMAGE_H = "3457";

// Must match imageEntries in galleryData.ts (index → filename stem + dimensions)
var PHOTOS = [
    { title: "Bee sitting on a purple flower",                     file: "00_Bee_sitting_on_a_purple_flower.webp",                        w: "2395", h: "2993" },
    { title: "Sunset over Makara hills with windmill silhouettes", file: "01_Sunset_over_Makara_hills_with_windmill_silhouettes.webp",    w: "5184", h: "2749" },
    { title: "Capybara at Wellington zoo",                         file: "02_Capybara_at_Wellington_zoo.webp",                            w: "3833", h: "2556" },
    { title: "Fruit Splash",                                       file: "08_Fruit_Splash.webp",                                          w: "2849", h: "3744" },
    { title: "A leaf",                                             file: "09_A_leaf.webp",                                                w: "2302", h: "1866" },
    { title: "Happy otter napping",                                file: "10_Happy_otter_napping.webp",                                   w: "5185", h: "3457" },
    { title: "Tui hanging upside down in a kowhai tree",           file: "11_Tui_hanging_upside_down_in_a_kowhai_tree.webp",              w: "4219", h: "2950" },
    { title: "Gas burner in love",                                 file: "12_Gas_burner_in_love.webp",                                    w: "3496", h: "2127" },
    { title: "Stunning seagull",                                   file: "13_Stunning_seagull.webp",                                      w: "2849", h: "4273" },
    { title: "Crab chilling under some water",                     file: "14_Crab_chilling_under_some_water.webp",                        w: "5185", h: "3457" },
    { title: "The glowing man",                                    file: "15_The_glowing_man.webp",                                       w: "1120", h: "1899" },
    { title: "Wood fire burning hot",                              file: "16_Wood_fire_burning_hot.webp",                                 w: "5185", h: "3457" },
    { title: "Huka falls",                                         file: "17_Huka_falls.webp",                                            w: "5185", h: "3457" },
    { title: "Fly on a tree",                                      file: "18_Fly_on_a_tree.webp",                                         w: "5185", h: "3457" },
    { title: "Morning frost on a green wooden railing",            file: "19_Morning_frost_on_a_green_wooden_railing.webp",               w: "3649", h: "1587" },
    { title: "Train Platform",                                     file: "20_Train_Platform.webp",                                        w: "4228", h: "2224" },
    { title: "Otters sleeping",                                    file: "21_Otters_sleeping.webp",                                       w: "5185", h: "3457" },
    { title: "Is there a ghost",                                   file: "22_Is_there_a_ghost.webp",                                      w: "3865", h: "2521" },
    { title: "Donkey at a petting zoo",                            file: "23_Donkey_at_a_petting_zoo.webp",                               w: "2849", h: "4273" },
];

// Must match projects in main/src/data/projects.ts
var PROJECTS = {
    "twentythreefiftynine": {
        title: "Twenty Three Fifty Nine",
        description: "A grade tracking website for university students.",
        image: SITE_URL + "/assets/2359.png",
    },
    "teach-python": {
        title: "Teach Python",
        description: "A website for learning Python programming.",
        image: SITE_URL + "/projects/teach-python/images/HeaderImg.jpg",
    },
    "helpamate": {
        title: "Help a Mate",
        description: "A fundraising platform to help individuals raise funds for causes.",
        image: SITE_URL + "/assets/helpamate.png",
    },
    "chapschallenge": {
        title: "Chap's Challenge",
        description: "A puzzle game created in Java.",
        image: SITE_URL + "/assets/chaps-challenge.png",
    },
};

function escapeAttr(str) {
    return str
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

function buildMeta(pageUrl, title, description, image, imageW, imageH, imageAlt) {
    var t   = escapeAttr(title);
    var d   = escapeAttr(description);
    var img = escapeAttr(image);
    var alt = escapeAttr(imageAlt || title);
    var w   = imageW || DEFAULT_IMAGE_W;
    var h   = imageH || DEFAULT_IMAGE_H;
    var url = escapeAttr(pageUrl);

    return [
        '<meta property="og:type" content="website" />',
        '<meta property="og:site_name" content="' + escapeAttr(SITE_NAME) + '" />',
        '<meta property="og:url" content="' + url + '" />',
        '<meta property="og:title" content="' + t + '" />',
        '<meta property="og:description" content="' + d + '" />',
        '<meta property="og:image" content="' + img + '" />',
        '<meta property="og:image:alt" content="' + alt + '" />',
        '<meta property="og:image:width" content="' + w + '" />',
        '<meta property="og:image:height" content="' + h + '" />',
        '<meta name="twitter:card" content="summary_large_image" />',
        '<meta name="twitter:title" content="' + t + '" />',
        '<meta name="twitter:description" content="' + d + '" />',
        '<meta name="twitter:image" content="' + img + '" />',
        '<meta name="twitter:image:alt" content="' + alt + '" />',
    ].join("\n        ");
}

function getPageMeta(uri, querystring) {
    // Parse ?photo=N
    var photoIndex = null;
    if (querystring) {
        var parts = querystring.split("&");
        for (var i = 0; i < parts.length; i++) {
            var kv = parts[i].split("=");
            if (kv[0] === "photo" && kv.length === 2) {
                var n = parseInt(kv[1], 10);
                if (!isNaN(n) && n >= 0 && n < PHOTOS.length) {
                    photoIndex = n;
                }
            }
        }
    }

    // /gallery?photo=N
    if (uri === "/gallery" && photoIndex !== null) {
        var photo = PHOTOS[photoIndex];
        var photoUrl = STATIC_URL + photo.file;
        var pageUrl = SITE_URL + "/gallery?photo=" + photoIndex;
        return buildMeta(
            pageUrl,
            photo.title + " \u2014 Chris S\xE1 Photography",
            "A photo by Chris S\xE1: " + photo.title,
            photoUrl, photo.w, photo.h,
            photo.title
        );
    }

    // /gallery
    if (uri === "/gallery" || uri === "/gallery/") {
        return buildMeta(
            SITE_URL + "/gallery",
            "Photography \u2014 Chris S\xE1",
            "A collection of moments captured through my lens.",
            DEFAULT_IMAGE, DEFAULT_IMAGE_W, DEFAULT_IMAGE_H,
            "Happy otter napping \u2014 Chris S\xE1 Photography"
        );
    }

    // /projects/:projectId
    var projectMatch = uri.match(/^\/projects\/([^/]+)\/?$/);
    if (projectMatch) {
        var projectId = projectMatch[1];
        var project = PROJECTS[projectId];
        if (project) {
            return buildMeta(
                SITE_URL + "/projects/" + projectId,
                project.title + " \u2014 Chris S\xE1",
                project.description,
                project.image, null, null,
                project.title
            );
        }
    }

    // / (root / fallback)
    return buildMeta(
        SITE_URL + "/",
        "Chris S\xE1 \u2014 Portfolio",
        "Software engineer and photographer based in Wellington, NZ.",
        DEFAULT_IMAGE, DEFAULT_IMAGE_W, DEFAULT_IMAGE_H,
        "Happy otter napping \u2014 a photo from Chris S\xE1's photography gallery"
    );
}

// OG block injected by index.html static tags — replace it with per-page version
var OG_START = "<!-- Open Graph / Social Previews -->";
var OG_END   = '<meta name="twitter:image:alt"';

function handler(event) {
    var response = event.response;
    var request  = event.request;

    // Only process HTML responses
    var ct = (response.headers["content-type"] || {}).value || "";
    if (ct.indexOf("text/html") === -1) {
        return response;
    }

    var body = response.body ? response.body.text : null;
    if (!body) return response;

    var uri = request.uri || "/";
    var qs  = request.querystring
        ? Object.keys(request.querystring).map(function(k) {
              var v = request.querystring[k];
              return k + "=" + (v && v.value ? v.value : "");
          }).join("&")
        : "";

    var newMeta = getPageMeta(uri, qs);

    // Replace the OG block between OG_START comment and end of twitter:image:alt tag
    var startIdx = body.indexOf(OG_START);
    if (startIdx !== -1) {
        var endIdx = body.indexOf("/>", body.indexOf(OG_END));
        if (endIdx !== -1) {
            body = body.substring(0, startIdx) +
                   OG_START + "\n        " + newMeta +
                   body.substring(endIdx + 2);
        }
    }

    response.body = body;
    return response;
}
