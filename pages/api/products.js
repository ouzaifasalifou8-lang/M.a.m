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
    const { featured, category, search } = req.query;
    let sql = "SELECT * FROM products WHERE is_active=1";
    if (featured) sql += " AND is_featured=1";
    if (category) sql += ` AND category_id='${category}'`;
    if (search) sql += ` AND (name LIKE '%${search}%' OR description LIKE '%${search}%')`;
    sql += " ORDER BY created_at DESC LIMIT 50";
    const products = await db(sql);
    return res.json(products);
  }

  if (req.method === "POST") {
    const { id, name, description, price, promo_price, stock, category_id,
            seller_id, image_url, is_featured } = req.body;
    const pid = id || `prd_${Date.now()}`;
    const slug = name.toLowerCase().replace(/\\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    await db(`INSERT OR REPLACE INTO products
      (id, seller_id, category_id, name, slug, description, price, compare_price,
       stock, is_active, is_featured, image_url, created_at, updated_at)
      VALUES ('${pid}','${seller_id||'admin'}','${category_id||'cat_001'}',
      '${name}','${slug}','${description}',${price},${promo_price||'NULL'},
      ${stock},1,${is_featured?1:0},'${image_url||''}',
      datetime('now'),datetime('now'))`);
    return res.json({ success: true, id: pid });
  }

  if (req.method === "DELETE") {
    const { id } = req.query;
    await db(`UPDATE products SET is_active=0 WHERE id='${id}'`);
    return res.json({ success: true });
  }
}
