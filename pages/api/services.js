const TOKEN = process.env.TURSO_TOKEN || "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3Nzk5MjQ3MzgsImlkIjoiMDE5ZTZiYmYtN2IwMS03ODAwLTgxMjAtMmIxYWU3ZmY5NDhiIiwicmlkIjoiNTc5N2IxMTMtYWJkNS00NzNmLWE0ZDQtMjg3NDczZmYxOTFiIn0.XbdprTEP9RO1kuQywjbrwcLpTjyf5k4avD6UZrG7Ht54tYEq2_yu-dCmdAfdXvJiUC5M55DjeEf-EdwXvsa8CQ";
const DB_URL = "https://mam-ouzaif.aws-eu-west-1.turso.io/v2/pipeline";

async function db(sql) {
  const res = await fetch(DB_URL, {
    method: "POST",
    headers: { "Authorization": `Bearer ${TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({ requests: [{ type: "execute", stmt: { sql } }, { type: "close" }] })
  });
  const data = await res.json();
  try {
    const result = data.results[0].response.result;
    const cols = result.cols.map(c => c.name);
    return result.rows.map(row => Object.fromEntries(cols.map((c, i) => [c, row[i].value])));
  } catch { return []; }
}

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { type } = req.query;
    if (type === "gallery") {
      const rows = await db("SELECT * FROM service_gallery ORDER BY created_at DESC");
      return res.json(rows);
    }
    if (type === "testimonials") {
      const rows = await db("SELECT * FROM testimonials WHERE is_approved=1 ORDER BY created_at DESC");
      return res.json(rows);
    }
    const rows = await db("SELECT * FROM service_info LIMIT 1");
    return res.json(rows[0] || {});
  }
  if (req.method === "POST") {
    const { type, ...data } = req.body;
    if (type === "gallery") {
      await db(`INSERT INTO service_gallery (id, image_url, caption, created_at)
        VALUES ('gal_${Date.now()}','${data.image_url}','${data.caption}',datetime('now'))`);
    }
    if (type === "testimonial") {
      await db(`INSERT INTO testimonials (id, name, text, rating, is_approved, created_at)
        VALUES ('test_${Date.now()}','${data.name}','${data.text}',${data.rating},0,datetime('now'))`);
    }
    return res.json({ success: true });
  }
}
