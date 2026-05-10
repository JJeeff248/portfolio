/**
 * GET public gallery manifest (v1 JSON) for portfolio build + site.
 * DynamoDB table: `GALLERY_TABLE_NAME` (default `gallery`).
 * Items: `itemType` `"album"` | `"photo"` — see gallery_photos lambda.
 */
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.GALLERY_TABLE_NAME || "gallery";

const corsHeaders = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": true,
};

export const handler = async (event) => {
    const method = event.requestContext?.http?.method || event.httpMethod;
    if (method !== "GET") {
        return {
            statusCode: 405,
            headers: corsHeaders,
            body: JSON.stringify({ error: "Method Not Allowed" }),
        };
    }

    try {
        const result = await docClient.send(
            new ScanCommand({ TableName: TABLE_NAME })
        );

        const items = result.Items ?? [];

        const albums = items
            .filter((i) => i.itemType === "album")
            .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
            .map((a) => ({
                slug: a.slug,
                title: a.title,
                sortOrder: Number(a.sortOrder ?? 0),
            }));

        const photos = items
            .filter((i) => i.itemType === "photo" && i.published === true)
            .sort(
                (a, b) =>
                    (a.sortOrder ?? 0) - (b.sortOrder ?? 0) ||
                    String(a.createdAt ?? "").localeCompare(
                        String(b.createdAt ?? "")
                    )
            )
            .map((p) => {
                const w = Number(p.width ?? 1);
                const h = Number(p.height ?? 1);
                const aspectRatio = w / h;
                const tags = Array.isArray(p.tags) ? p.tags : [];
                return {
                    slug: p.slug,
                    title: p.title ?? "",
                    src: p.src ?? "",
                    width: w,
                    height: h,
                    aspectRatio,
                    tags,
                    albumSlug: p.albumSlug ?? null,
                    exif: p.exif ?? null,
                    showExifDefault: p.showExifDefault ?? true,
                };
            });

        const manifest = {
            version: 1,
            generatedAt: new Date().toISOString(),
            albums,
            photos,
        };

        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify(manifest),
        };
    } catch (err) {
        console.error("gallery_manifest:", err);
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({ error: err?.message ?? "failed" }),
        };
    }
};
