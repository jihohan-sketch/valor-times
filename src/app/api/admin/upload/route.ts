import { mkdir, writeFile } from "fs/promises";
import path from "path";

import { NextResponse } from "next/server";

import { isAdminRequest } from "@/lib/cms/auth";

/**
 * Picture uploads.
 *
 * ── Why the type is sniffed rather than read
 * `file.type` is the Content-Type the *caller* wrote into the multipart part.
 * Trusting it means the extension on disk is chosen by whoever is uploading,
 * and the bytes underneath need have nothing to do with it. The first few
 * bytes of a real image are not negotiable, so those decide.
 *
 * ── Why SVG is not on the list
 * An SVG is a document, not a bitmap: it can carry <script>, and it is served
 * back from /uploads on this site's own origin, so a scripted one runs as the
 * paper. Nothing the newsroom publishes is vector, so the format is simply
 * gone rather than sanitised — there is no sanitiser here worth trusting a
 * whole origin to.
 */

const MAX_BYTES = 8 * 1024 * 1024;

/** Signature checks against the head of the file, in `extension` order. */
const SIGNATURES: { extension: string; matches: (head: Buffer) => boolean }[] = [
  {
    extension: "jpg",
    matches: (head) => head[0] === 0xff && head[1] === 0xd8 && head[2] === 0xff,
  },
  {
    extension: "png",
    matches: (head) =>
      head.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])),
  },
  {
    extension: "gif",
    matches: (head) => {
      const magic = head.subarray(0, 6).toString("latin1");
      return magic === "GIF87a" || magic === "GIF89a";
    },
  },
  {
    extension: "webp",
    matches: (head) =>
      head.subarray(0, 4).toString("latin1") === "RIFF" &&
      head.subarray(8, 12).toString("latin1") === "WEBP",
  },
];

function sniff(bytes: Buffer): string | null {
  if (bytes.length < 12) return null;
  const head = bytes.subarray(0, 12);
  return SIGNATURES.find((signature) => signature.matches(head))?.extension ?? null;
}

export async function POST(request: Request) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "Choose an image to upload." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Images must be under 8MB." }, { status: 400 });
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const extension = sniff(bytes);
  if (!extension) {
    return NextResponse.json(
      { error: "Use a JPG, PNG, WebP or GIF image." },
      { status: 400 },
    );
  }

  const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extension}`;
  const directory = path.join(process.cwd(), "public", "uploads");
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, name), bytes);

  return NextResponse.json({ url: `/uploads/${name}` });
}
