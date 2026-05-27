// supabase.js
const SUPABASE_URL = 'https://myxxcaaveqbwsujckxhj.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_A-8fk-zlmgdcTc3WAcx7fA_A0Z0SSJy'; // Remplace par ta vraie clé

// On utilise 'window.supabase' pour s'assurer que la lib est bien chargée
const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ── AUTH ──────────────────────────────────────
async function loginAdmin(email, password) {
  const { data, error } = await db.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

async function getSession() {
  const { data } = await db.auth.getSession();
  return data.session;
}

// ── PRODUITS ──────────────────────────────────
async function getProduits() {
  const { data, error } = await db.from('produits').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

async function ajouterProduit(produit) {
  const { data, error } = await db.from('produits').insert([produit]).select();
  if (error) throw error;
  return data[0];
}

// ── UPLOAD ────────────────────────────────────
async function uploadImage(file, bucket = 'produits') {
  const filename = `${Date.now()}-${file.name}`;
  const { data, error } = await db.storage.from(bucket).upload(filename, file);
  if (error) throw error;
  return db.storage.from(bucket).getPublicUrl(filename).data.publicUrl;
}
