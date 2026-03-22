// Viewer-request CloudFront Function
// Rewrites /gallery?photo=N to /gallery/photo/N/index.html for social crawlers
// so they receive the prerendered per-photo OG HTML from S3.
// Regular browsers are passed through unchanged and the React app handles ?photo=N.

var CRAWLER_RE = /bot|crawl|slurp|spider|facebookexternalhit|twitterbot|linkedinbot|whatsapp|telegrambot|discordbot|slack/i;
var NUM_PHOTOS = 19;

function handler(event) {
    var request = event.request;
    var ua = (request.headers["user-agent"] || {}).value || "";
    var uri = request.uri;
    var qs  = request.querystring || {};

    var isGallery = uri === "/gallery" || uri === "/gallery/" || uri === "/gallery/index.html";

    if (CRAWLER_RE.test(ua) && isGallery && qs.photo) {
        var n = parseInt(qs.photo.value, 10);
        if (!isNaN(n) && n >= 0 && n < NUM_PHOTOS) {
            request.uri = "/gallery/photo/" + n + "/index.html";
            request.querystring = {};
            return request;
        }
    }

    if (uri.endsWith("/")) {
        request.uri = uri + "index.html";
    } else if (uri.indexOf(".") === -1 && uri !== "/") {
        request.uri = uri + "/index.html";
    }

    return request;
}
