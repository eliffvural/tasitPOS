import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const extensions = {
  "application/pdf": "pdf",
  "image/jpeg": "jpg",
  "image/png": "png",
};

function matchesDeclaredType(body, type) {
  if (type === "application/pdf") return body.subarray(0, 5).toString() === "%PDF-";
  if (type === "image/jpeg") return body[0] === 0xff && body[1] === 0xd8 && body[2] === 0xff;
  if (type === "image/png") return body.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  return false;
}

export async function storePrivateDocument(file, transactionId) {
  const extension = extensions[file.type];
  const objectName = `${transactionId}-${randomUUID()}.${extension}`;
  const body = Buffer.from(await file.arrayBuffer());
  if (!matchesDeclaredType(body, file.type)) throw new Error("ERR_DOCUMENT_CONTENT");
  const mode = process.env.DOCUMENT_STORAGE_MODE || "local";

  if (mode === "s3") {
    const bucket = process.env.AWS_S3_BUCKET;
    const region = process.env.AWS_REGION;
    if (!bucket || !region) throw new Error("ERR_DOCUMENT_STORAGE_NOT_CONFIGURED");

    const key = `vehicle-documents/${new Date().toISOString().slice(0, 10)}/${objectName}`;
    const client = new S3Client({ region });
    await client.send(new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: file.type,
      ServerSideEncryption: process.env.AWS_KMS_KEY_ID ? "aws:kms" : "AES256",
      ...(process.env.AWS_KMS_KEY_ID ? { SSEKMSKeyId: process.env.AWS_KMS_KEY_ID } : {}),
      Metadata: { transaction_id: transactionId },
    }));
    return { url: `s3://${bucket}/${key}`, provider: "S3", key };
  }

  const directory = path.join(process.cwd(), ".data", "private-documents");
  await mkdir(directory, { recursive: true, mode: 0o700 });
  const diskPath = path.join(directory, objectName);
  await writeFile(diskPath, body, { mode: 0o600 });
  return { url: `private://documents/${objectName}`, provider: "LOCAL_PRIVATE", key: objectName };
}

export async function readPrivateDocument(transaction) {
  if (transaction.document_provider === "S3") {
    const client = new S3Client({ region: process.env.AWS_REGION });
    const result = await client.send(new GetObjectCommand({ Bucket: process.env.AWS_S3_BUCKET, Key: transaction.document_url.split("/").slice(3).join("/") }));
    return { body: Buffer.from(await result.Body.transformToByteArray()), contentType: result.ContentType || "application/octet-stream" };
  }
  const name = path.basename(String(transaction.document_url || "").replace("private://documents/", ""));
  const diskPath = path.join(process.cwd(), ".data", "private-documents", name);
  const body = await import("node:fs/promises").then(({ readFile }) => readFile(diskPath));
  const contentType = name.endsWith(".pdf") ? "application/pdf" : name.endsWith(".png") ? "image/png" : "image/jpeg";
  return { body, contentType };
}
