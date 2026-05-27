// api/produits.js
import { createClient } from "@libsql/client";

export default async function handler(req, res) {
  // Initialisation du client Turso avec vos clés
  const db = createClient({
    url: "libsql://mam-ouzaif.aws-eu-west-1.turso.io",
    authToken: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3Nzk5MjQ0MzksImlkIjoiMDE5ZTZiYmYtN2IwMS03ODAwLTgxMjAtMmIxYWU3ZmY5NDhiIiwicmlkIjoiNTc5N2IxMTMtYWJkNS00NzNmLWE0ZDQtMjg3NDczZmYxOTFiIn0.6Tyuoc9kZP26Jigx_Vt8icENLzbUGCfmQeiFGd9tgpcdl95X_Imfxxkj9L6e-vkVgTO4QA7hmtSzyFryxUiLBg"
  });

  if (req.method === 'POST') {
    const { nom } = req.body;
    await db.execute("INSERT INTO Produits (nom) VALUES (?)", [nom]);
    res.status(200).json({ message: "Produit ajouté" });
  } else {
    const result = await db.execute("SELECT * FROM Produits");
    res.status(200).json(result.rows);
  }
}
