export const config = { api: { bodyParser: { sizeLimit: '10mb' } } };

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { image, folder } = req.body;
  
  // Upload vers Cloudinary
  const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || "mamshop";
  const UPLOAD_PRESET = process.env.CLOUDINARY_PRESET || "mamshop_preset";
  
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        file: image,
        upload_preset: UPLOAD_PRESET,
        folder: folder || "mamshop"
      })
    }
  );
  const data = await response.json();
  if (data.secure_url) {
    return res.json({ url: data.secure_url });
  }
  return res.status(400).json({ error: "Upload failed" });
}
