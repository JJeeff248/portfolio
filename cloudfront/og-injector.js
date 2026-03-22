// Viewer-request CloudFront Function
// Rewrites /gallery?photo=N to /gallery/photo/N/index.html for social crawlers
// so they receive the prerendered per-photo OG HTML from S3.
// Regular browsers are passed through unchanged and the React app handles ?photo=N.

var CRAWLER_RE = /bot|crawl|slurp|spider|facebookexternalhit|twitterbot|linkedinbot|whatsapp|telegrambot|discordbot|slack/i;
var NUM_PHOTOS = 19;

function handler(event) {
    var request = event.request;
    var ua = (request.headers["user-agent"] || {}).value || "";

    if (!CRAWLER_RE.test(ua)) return request;

    var uri = request.uri;
    var qs  = request.querystring || {};

    if (uri === "/gallery" && qs.photo) {
        var n = parseInt(qs.photo.value, 10);
        if (!isNaN(n) && n >= 0 && n < NUM_PHOTOS) {
            request.uri = "/gallery/photo/" + n + "/index.html";
            request.querystring = {};
        }
    }

    return request;
}
