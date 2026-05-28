const TOKEN = "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3Nzk5MjQ3MzgsImlkIjoiMDE5ZTZiYmYtN2IwMS03ODAwLTgxMjAtMmIxYWU3ZmY5NDhiIiwicmlkIjoiNTc5N2IxMTMtYWJkNS00NzNmLWE0ZDQtMjg3NDczZmYxOTFiIn0.XbdprTEP9RO1kuQywjbrwcLpTjyf5k4avD6UZrG7Ht54tYEq2_yu-dCmdAfdXvJiUC5M55DjeEf-EdwXvsa8CQ";
const URL = "https://mam-ouzaif.aws-eu-west-1.turso.io/v2/pipeline";

export async function query(sql) {
  const res = await fetch(URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      requests: [
        { type: "execute", stmt: { sql } },
        { type: "close" }
      ]
    })
  });
  const data = await res.json();
  const result = data.results[0].response.result;
  const cols = result.cols.map(c => c.name);
  return result.rows.map(row =>
    Object.fromEntries(cols.map((c, i) => [c, row[i].value]))
  );
}

export async function execute(sql) {
  const res = await fetch(URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      requests: [
        { type: "execute", stmt: { sql } },
        { type: "close" }
      ]
    })
  });
  return res.json();
    }
