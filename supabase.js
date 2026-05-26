// ============================================
// M.A.M Eshop — Configuration Supabase
// ============================================
// ⚠️ Remplace ces valeurs par tes nouvelles clés
// après avoir régénéré dans Supabase Dashboard

const SUPABASE_URL = 'https://myxxcaaveqbwsujckxhj.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_A-8fk-zlmgdcTc3WAcx7fA_A0Z0SSJy';

const { createClient } = supabase;
const db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ── AUTH ──────────────────────────────────────
async function loginAdmin(email, password) {
  const { data, error } = await db.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

async function logoutAdmin() {
  await db.auth.signOut();
  window.location.href = 'auth.html';
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

async function modifierProduit(id, updates) {
  const { data, error } = await db.from('produits').update(updates).eq('id', id).select();
  if (error) throw error;
  return data[0];
}

async function supprimerProduit(id) {
  const { error } = await db.from('produits').delete().eq('id', id);
  if (error) throw error;
}

// ── SERVICES ──────────────────────────────────
async function getServices() {
  const { data, error } = await db.from('services').select('*').order('ordre');
  if (error) throw error;
  return data;
}

async function modifierService(id, updates) {
  const { data, error } = await db.from('services').update(updates).eq('id', id).select();
  if (error) throw error;
  return data[0];
}

// ── DEVIS ─────────────────────────────────────
async function getDevis() {
  const { data, error } = await db.from('devis').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

async function soumettreDevis(devis) {
  const { data, error } = await db.from('devis').insert([devis]).select();
  if (error) throw error;
  return data[0];
}

async function marquerDevisLu(id) {
  const { error } = await db.from('devis').update({ lu: true }).eq('id', id);
  if (error) throw error;
}

// ── REALISATIONS ──────────────────────────────
async function getRealisations() {
  const { data, error } = await db.from('realisations').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

async function ajouterRealisation(realisation) {
  const { data, error } = await db.from('realisations').insert([realisation]).select();
  if (error) throw error;
  return data[0];
}

async function supprimerRealisation(id) {
  const { error } = await db.from('realisations').delete().eq('id', id);
  if (error) throw error;
}

// ── UPLOAD IMAGE ──────────────────────────────
async function uploadImage(file, bucket = 'produits') {
  const ext = file.name.split('.').pop();
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { data, error } = await db.storage.from(bucket).upload(filename, file);
  if (error) throw error;
  const { data: urlData } = db.storage.from(bucket).getPublicUrl(filename);
  return urlData.publicUrl;
}

// ── INFOS SITE ────────────────────────────────
async function getInfosSite() {
  const { data, error } = await db.from('infos_site').select('*').single();
  if (error) throw error;
  return data;
}

async function modifierInfosSite(updates) {
  const { data, error } = await db.from('infos_site').update(updates).eq('id', 1).select();
  if (error) throw error;
  return data[0];
}
