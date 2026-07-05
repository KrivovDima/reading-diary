import { join } from "path";
import { v4 as uuidv4 } from "uuid";
import * as fs from "fs/promises";

export async function uploadBookCover(file: File): Promise<string | null> {
  if (!file.type.startsWith("image/")) {
    return null;
  }

  // 5MB
  if (file.size >= 5 * 1024 * 1024) {
    return null;
  }

  const ext = file.name.split(".").pop();
  const fileName = `${uuidv4()}.${ext}`;
  const uploadDir = join(process.cwd(), "public", "uploads", "covers");

  await fs.mkdir(uploadDir, { recursive: true });

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  await fs.writeFile(join(uploadDir, fileName), buffer);

  const coverPath = `/uploads/covers/${fileName}`;

  return coverPath;
}
