// backend/services/imgurService.ts
import { IMGUR_CLIENT_ID } from "@/b/config/env";

export async function uploadImageToImgur(imageBase64: string): Promise<string> {
  const res = await fetch("https://api.imgur.com/3/image", {
    method: "POST",
    headers: {
      Authorization: `Client-ID ${IMGUR_CLIENT_ID}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ image: imageBase64, type: "base64" })
  });

  const data = await res.json();
  if (!data.success) throw new Error("Imgur upload failed");
  return data.data.link;
}

export async function uploadImagesToImgur(imagesBase64: string[]): Promise<string[]> {
  const results: string[] = [];
  for (const base64 of imagesBase64) {
    const url = await uploadImageToImgur(base64);
    results.push(url);
  }
  return results;
}