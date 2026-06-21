/**
 * Authenticated CRUD for gallery DynamoDB (`id` PK, itemType album|photo).
 */

import crypto from "node:crypto";

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
    DynamoDBDocumentClient,
    DeleteCommand,
    PutCommand,
    ScanCommand,
    UpdateCommand,
} from "@aws-sdk/lib-dynamodb";

const docClient = DynamoDBDocumentClient.from(new DynamoDBClient({}));

const TABLE = process.env.GALLERY_TABLE_NAME || "gallery";

const corsHeaders = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": true,
};

function json(statusCode, bodyObj) {
    return {
        statusCode,
        headers: corsHeaders,
        body: JSON.stringify(bodyObj ?? {}),
    };
}

export const handler = async (event) => {
    const method =
        event.requestContext?.http?.method || event.httpMethod || "GET";

    if (method === "OPTIONS") return json(200, {});

    const raw =
        event.rawPath ||
        event.requestContext?.http?.path ||
        event.path ||
        "";

    try {
        if (method === "GET" && raw.includes("/portfolio/gallery/photos/all")) {
            const out = await docClient.send(
                new ScanCommand({ TableName: TABLE })
            );
            const items =
                out.Items?.filter((i) =>
                    ["photo", "album"].includes(i.itemType)
                ) ?? [];
            return json(200, {
                items: items.sort(
                    (a, b) =>
                        (a.sortOrder ?? 0) - (b.sortOrder ?? 0) ||
                        String(a.slug ?? "").localeCompare(String(b.slug ?? ""))
                ),
            });
        }

        if (method === "POST" && raw.includes("/portfolio/gallery/albums")) {
            const body = JSON.parse(event.body || "{}");
            const slug = slugify(body.slug ?? "");
            const title =
                typeof body.title === "string" ? body.title.trim() : "";
            if (!slug || !title) {
                return json(400, { error: "slug and title required" });
            }
            const id = `album#${slug}`;
            await docClient.send(
                new PutCommand({
                    TableName: TABLE,
                    Item: {
                        id,
                        itemType: "album",
                        slug,
                        title,
                        sortOrder: Number(body.sortOrder ?? 0),
                    },
                })
            );
            return json(200, { ok: true, id });
        }

        if (
            method === "POST" &&
            /\/portfolio\/gallery\/photos\/?$/.test(raw) &&
            !raw.includes("all")
        ) {
            const body = JSON.parse(event.body || "{}");
            const slug = slugify(body.slug ?? "");
            if (
                !slug.match(/^[a-z0-9]+(?:-[a-z0-9]+)*$/) ||
                !body.title ||
                !body.src ||
                body.width == null ||
                body.height == null
            ) {
                return json(400, {
                    error:
                        "slug (URL-safe), title, src, width, height required",
                });
            }
            const photoId =
                typeof body.photoId === "string" && body.photoId.length > 0
                    ? body.photoId
                    : crypto.randomUUID();
            const id = `photo#${photoId}`;
            const now = new Date().toISOString();
            await docClient.send(
                new PutCommand({
                    TableName: TABLE,
                    Item: {
                        id,
                        photoId,
                        itemType: "photo",
                        slug,
                        title: String(body.title),
                        src: String(body.src),
                        width: Number(body.width),
                        height: Number(body.height),
                        sortOrder: Number(body.sortOrder ?? Date.now()),
                        published: Boolean(body.published ?? false),
                        showExifDefault:
                            body.showExifDefault !== undefined
                                ? Boolean(body.showExifDefault)
                                : true,
                        tags: Array.isArray(body.tags) ? body.tags : [],
                        albumSlug:
                            typeof body.albumSlug === "string"
                                ? body.albumSlug
                                : null,
                        exif: body.exif ?? null,
                        createdAt: now,
                        updatedAt: now,
                    },
                })
            );
            return json(200, { photoId, slug, id });
        }

        const pid = event.pathParameters?.photoId?.trim();
        if (pid) {
            const id = pid.startsWith("photo#") ? pid : `photo#${pid}`;

            if (method === "PATCH") {
                const body = JSON.parse(event.body || "{}");
                const allowed = [
                    "title",
                    "published",
                    "showExifDefault",
                    "sortOrder",
                    "src",
                    "width",
                    "height",
                    "tags",
                    "albumSlug",
                    "exif",
                ];
                const updated = {};
                for (const k of allowed) {
                    if (Object.prototype.hasOwnProperty.call(body, k)) {
                        updated[k] = body[k];
                    }
                }
                if (Object.keys(updated).length === 0) {
                    return json(400, { error: "no valid fields" });
                }
                updated.updatedAt = new Date().toISOString();
                const ks = Object.keys(updated);

                const names = {};
                const values = { ":t": "photo" };
                const parts = [];
                let i = 0;
                for (const k of ks) {
                    parts.push(`#f${i} = :vv${i}`);
                    names[`#f${i}`] = k;
                    values[`:vv${i}`] = updated[k];
                    i++;
                }
                await docClient.send(
                    new UpdateCommand({
                        TableName: TABLE,
                        Key: { id },
                        UpdateExpression: "SET " + parts.join(", "),
                        ExpressionAttributeNames: names,
                        ExpressionAttributeValues: values,
                        ConditionExpression:
                            "attribute_exists(id) AND itemType = :t",
                    })
                );
                return json(200, { ok: true });
            }

            if (method === "DELETE") {
                await docClient.send(
                    new DeleteCommand({ TableName: TABLE, Key: { id } })
                );
                return json(200, { deleted: id });
            }
        }

        return json(404, { error: "not_found", raw, method });
    } catch (error) {
        console.error("gallery_photos:", error);
        return json(500, { error: error.message });
    }
};

function slugify(s) {
    return String(s ?? "")
        .toLowerCase()
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 96);
}
