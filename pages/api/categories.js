const TOKEN = process.env.TURSO_TOKEN || "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3Nzk5MjQ3MzgsImlkIjoiMDE5ZTZiYmYtN2IwMS03ODAwLTgxMjAtMmIxYWU3ZmY5NDhiIiwicmlkIjoiNTc5N2IxMTMtYWJkNS00NzNmLWE0ZDQtMjg3NDczZmYxOTFiIn0.XbdprTEP9RO1kuQywjbrwcLpTjyf5k4avD6UZrG7Ht54tYEq2_yu-dCmdAfdXvJiUC5M55DjeEf-EdwXvsa8CQ";
const DB_URL = "https://mam-ouzaif.aws-eu-west-1.turso.io/v2/pipeline";

async function db(sql) {
  const res = await fetch(DB_URL, {
    method: "POST",
    headers: { "Authorization": `Bearer ${TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({ requests: [{ type: "execute", stmt: { sql } }, { type: "close" }] })
  });
  const data = await res.json();
  const result = data.results[0].response.result;
  const cols = result.cols.map(c => c.name);
  return result.rows.map(row => Object.fromEntries(cols.map((c, i) => [c, row[i].value])));
}

export default async function handler(req, res) {
  if (req.method === "GET") {
    const cats = await db("SELECT * FROM categories WHERE is_active=1 ORDER BY sort_order");
    return res.json(cats);
  }
  if (req.method === "POST") {
    const { name, parent_id } = req.body;
    const id = `cat_${Date.now()}`;
    const slug = name.toLowerCase().replace(/\\s+/g, '-');
    await db(`INSERT INTO categories (id, parent_id, name, slug, is_active, sort_order)
      VALUES ('${id}','${parent_id||''}','${name}','${slug}',1,0)`);
    return res.json({ success: true });
  }
}
