import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const region = process.env.AWS_REGION || "ap-southeast-2";
const s3Client = new S3Client({ region });
const bucket = process.env.GALLERY_UPLOAD_BUCKET || "static-chris-sa";

const ALLOWED = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    webp: "image/webp",
};

export const handler = async (event) => {
    try {
        const extension = event.queryStringParameters?.extension?.toLowerCase();
        if (!extension || !ALLOWED[extension]) {
            return {
                statusCode: 400,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Credentials": true,
                },
                body: JSON.stringify({
                    error:
                        "Invalid extension. Allowed: " +
                        Object.keys(ALLOWED).join(", "),
                }),
            };
        }

        const timestamp = Date.now();
        const rand = Math.random().toString(36).substring(2, 10);
        const fileName = `${timestamp}-${rand}.${extension}`;
        const key = `gallery/${fileName}`;
        const publicBase =
            process.env.GALLERY_PUBLIC_BASE || "https://static.chris-sa.com";

        const command = new PutObjectCommand({
            Bucket: bucket,
            Key: key,
            ContentType: ALLOWED[extension],
        });

        const uploadUrl = await getSignedUrl(s3Client, command, {
            expiresIn: 3600,
        });

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true,
            },
            body: JSON.stringify({
                uploadUrl,
                fileUrl: `${publicBase}/${key}`,
                key,
            }),
        };
    } catch (error) {
        console.error("gallery_upload:", error);
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true,
            },
            body: JSON.stringify({ error: "Failed to generate upload URL" }),
        };
    }
};
