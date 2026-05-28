const TURSO_URL = "https://mam-ouzaif.aws-eu-west-1.turso.io/v2/pipeline";
const TURSO_TOKEN = "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3Nzk5MjQ3MzgsImlkIjoiMDE5ZTZiYmYtN2IwMS03ODAwLTgxMjAtMmIxYWU3ZmY5NDhiIiwicmlkIjoiNTc5N2IxMTMtYWJkNS00NzNmLWE0ZDQtMjg3NDczZmYxOTFiIn0.XbdprTEP9RO1kuQywjbrwcLpTjyf5k4avD6UZrG7Ht54tYEq2_yu-dCmdAfdXvJiUC5M55DjeEf-EdwXvsa8CQ";

async function dbQuery(sql) {
  const res = await fetch(TURSO_URL, {
    method: "POST",
    headers: {"Authorization": `Bearer ${TURSO_TOKEN}`, "Content-Type": "application/json"},
    body: JSON.stringify({requests:[{type:"execute",stmt:{sql}},{type:"close"}]})
  });
  const data = await res.json();
  const result = data.results[0].response.result;
  const cols = result.cols.map(c => c.name);
  return result.rows.map(row => Object.fromEntries(cols.map((c,i) => [c, row[i].value])));
}

async function dbExec(sql) {
  const res = await fetch(TURSO_URL, {
    method: "POST",
    headers: {"Authorization": `Bearer ${TURSO_TOKEN}`, "Content-Type": "application/json"},
    body: JSON.stringify({requests:[{type:"execute",stmt:{sql}},{type:"close"}]})
  });
  return res.json();
}

// Cart
function getCart() { return JSON.parse(localStorage.getItem('mam_cart')||'[]'); }
function saveCart(c) { localStorage.setItem('mam_cart', JSON.stringify(c)); updateCartCount(); }
function addToCart(p) {
  const c = getCart();
  const ex = c.find(x => x.id === p.id);
  if (ex) ex.qty = (ex.qty||1) + 1;
  else c.push({...p, qty:1});
  saveCart(c);
  showToast('Produit ajoute au panier !', 'success');
}
function updateCartCount() {
  const c = getCart();
  const total = c.reduce((s,x) => s+(x.qty||1), 0);
  document.querySelectorAll('.cart-count').forEach(el => {
    el.textContent = total;
    el.style.display = total > 0 ? 'flex' : 'none';
  });
}

// Toast
function showToast(msg, type='info') {
  const t = document.createElement('div');
  t.style.cssText = `position:fixed;bottom:20px;right:20px;background:${type==='success'?'#25d366':'#2563eb'};color:white;padding:13px 20px;border-radius:10px;font-weight:600;font-size:14px;z-index:9999;box-shadow:0 4px 12px rgba(0,0,0,.2);animation:slideIn .3s ease`;
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3000);
}

// WhatsApp order
function orderWhatsApp(product) {
  const msg = encodeURIComponent(`Bonjour MAM Shop !\\n\\nJe voudrais commander:\\n*${product.name}*\\nPrix: ${parseFloat(product.compare_price||product.price).toLocaleString()} XOF\\n\\nMerci !`);
  window.open(`https://wa.me/22798836601?text=${msg}`, '_blank');
}

function orderCartWhatsApp() {
  const cart = getCart();
  if (!cart.length) { showToast('Panier vide !', 'error'); return; }
  const items = cart.map(p => `- ${p.name} x${p.qty||1}: ${(parseFloat(p.compare_price||p.price)*(p.qty||1)).toLocaleString()} XOF`).join('\\n');
  const total = cart.reduce((s,p) => s+parseFloat(p.compare_price||p.price||0)*(p.qty||1), 0);
  const msg = encodeURIComponent(`Bonjour MAM Shop !\\n\\nMa commande:\\n${items}\\n\\nTotal: ${total.toLocaleString()} XOF\\n\\nMerci !`);
  window.open(`https://wa.me/22798836601?text=${msg}`, '_blank');
}

// Render products
function renderProducts(products, containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;
  if (!products.length) { el.innerHTML = '<div style="text-align:center;padding:40px;color:#64748b;grid-column:1/-1">Aucun produit disponible</div>'; return; }
  el.innerHTML = products.map(p => `
    <div class="card">
      <div class="card-img">${p.image_url ? `<img src="${p.image_url}" alt="${p.name}">` : '🛍️'}</div>
      <div class="card-body">
        ${p.compare_price ? '<span class="promo-badge">PROMO</span>' : ''}
        <div class="card-name">${p.name}</div>
        <div class="card-desc">${(p.description||'').substring(0,55)}...</div>
        <div class="card-price">
          ${parseFloat(p.compare_price||p.price).toLocaleString()} XOF
          ${p.compare_price ? `<span class="card-price-old">${parseFloat(p.price).toLocaleString()}</span>` : ''}
        </div>
        <div class="card-actions">
          <button class="btn-cart" onclick='addToCart(${JSON.stringify(p)})'>+ Panier</button>
          <button class="btn-whatsapp" onclick='orderWhatsApp(${JSON.stringify(p)})'>WhatsApp</button>
        </div>
      </div>
    </div>`).join('');
}

document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  const style = document.createElement('style');
  style.textContent = '@keyframes slideIn{from{transform:translateX(100px);opacity:0}to{transform:translateX(0);opacity:1}}';
  document.head.appendChild(style);
});
"""

files["index.html"] = """<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>MAM Shop - Votre Marketplace au Niger</title>
<link rel="stylesheet" href="css/style.css">
</head>
<body>

<nav>
  <div class="nav-inner">
    <a href="index.html" class="logo">
      <div class="logo-icon">M</div>
      MAM Shop
    </a>
    <div class="nav-links">
      <a href="index.html">Accueil</a>
      <a href="boutique.html">Boutique</a>
      <a href="antennes.html">Services</a>
      <a href="marketplace.html">Marketplace</a>
      <a href="a-propos.html">A propos</a>
    </div>
    <div class="nav-actions">
      <a href="panier.html" class="cart-btn">
        🛒 Panier
        <span class="cart-count" style="display:none">0</span>
      </a>
      <a href="compte.html" class="btn btn-primary">Connexion</a>
    </div>
  </div>
</nav>

<div class="hero">
  <div style="font-size:56px;margin-bottom:16px">🛍️</div>
  <h1>Bienvenue sur <span style="color:#fbbf24">MAM Shop</span></h1>
  <p>Votre marketplace de confiance au Niger</p>
  <div class="hero-btns">
    <a href="boutique.html" class="btn btn-primary" style="font-size:16px;padding:14px 28px">Voir la boutique</a>
    <a href="https://wa.me/22798836601" class="btn btn-wa" style="font-size:16px;padding:14px 28px" target="_blank">Commander sur WhatsApp</a>
  </div>
</div>

<div class="stats-bar">
  <div class="stats-grid">
    <div><div class="stat-num" id="nb-products">...</div><div class="stat-label">Produits</div></div>
    <div><div class="stat-num" id="nb-categories">...</div><div class="stat-label">Categories</div></div>
    <div><div class="stat-num">500+</div><div class="stat-label">Clients</div></div>
    <div><div class="stat-num">98%</div><div class="stat-label">Satisfaction</div></div>
  </div>
</div>

<div class="section">
  <div class="container">
    <h2 class="section-title">Produits vedettes</h2>
    <p class="section-sub">Selection du moment</p>
    <div class="grid-cards" id="featured-products">
      <div style="grid-column:1/-1;text-align:center;padding:40px;color:#64748b">Chargement...</div>
    </div>
    <div style="text-align:center;margin-top:36px">
      <a href="boutique.html" class="btn btn-primary" style="font-size:15px;padding:13px 32px">Voir tous les produits</a>
    </div>
  </div>
</div>

<div class="section" style="background:#f1f5f9">
  <div class="container">
    <h2 class="section-title">Nos Services</h2>
    <p class="section-sub">Tout ce dont vous avez besoin</p>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:20px">
      <div style="background:white;border-radius:16px;padding:28px;text-align:center;box-shadow:0 2px 8px rgba(0,0,0,.06)">
        <div style="font-size:44px;margin-bottom:12px">📡</div>
        <h3 style="font-weight:700;margin-bottom:8px">Antennes & Starlink</h3>
        <p style="color:#64748b;font-size:14px;line-height:1.6">Installation professionnelle dans tout le Niger</p>
        <a href="antennes.html" style="display:inline-block;margin-top:14px;color:#2563eb;font-weight:600;font-size:13px">En savoir plus →</a>
      </div>
      <div style="background:white;border-radius:16px;padding:28px;text-align:center;box-shadow:0 2px 8px rgba(0,0,0,.06)">
        <div style="font-size:44px;margin-bottom:12px">🛍️</div>
        <h3 style="font-weight:700;margin-bottom:8px">Boutique en ligne</h3>
        <p style="color:#64748b;font-size:14px;line-height:1.6">Large catalogue au meilleur prix</p>
        <a href="boutique.html" style="display:inline-block;margin-top:14px;color:#2563eb;font-weight:600;font-size:13px">Voir la boutique →</a>
      </div>
      <div style="background:white;border-radius:16px;padding:28px;text-align:center;box-shadow:0 2px 8px rgba(0,0,0,.06)">
        <div style="font-size:44px;margin-bottom:12px">🏪</div>
        <h3 style="font-weight:700;margin-bottom:8px">Marketplace</h3>
        <p style="color:#64748b;font-size:14px;line-height:1.6">Vendez vos produits et touchez plus de clients</p>
        <a href="marketplace.html" style="display:inline-block;margin-top:14px;color:#2563eb;font-weight:600;font-size:13px">Rejoindre →</a>
      </div>
      <div style="background:white;border-radius:16px;padding:28px;text-align:center;box-shadow:0 2px 8px rgba(0,0,0,.06)">
        <div style="font-size:44px;margin-bottom:12px">🚀</div>
        <h3 style="font-weight:700;margin-bottom:8px">Livraison rapide</h3>
        <p style="color:#64748b;font-size:14px;line-height:1.6">Livraison dans tout le Niger</p>
        <a href="a-propos.html" style="display:inline-block;margin-top:14px;color:#2563eb;font-weight:600;font-size:13px">En savoir plus →</a>
      </div>
    </div>
  </div>
</div>

<div class="cta-wa">
  <h2>Commandez directement sur WhatsApp !</h2>
  <p>Contactez-nous pour passer votre commande rapidement</p>
  <a href="https://wa.me/22798836601" target="_blank" style="background:white;color:#25d366;padding:15px 40px;border-radius:50px;font-weight:900;font-size:17px;display:inline-block">
    +227 98 83 66 01
  </a>
</div>

<footer>
  <div class="footer-grid">
    <div>
      <div style="color:white;font-weight:800;font-size:19px;margin-bottom:10px">MAM Shop</div>
      <p style="font-size:13px;line-height:1.6">Votre marketplace de confiance au Niger. Produits de qualite.</p>
      <a href="https://wa.me/22798836601" target="_blank" style="display:inline-block;margin-top:14px;background:#25d366;color:white;padding:8px 16px;border-radius:8px;font-weight:700;font-size:13px">WhatsApp</a>
    </div>
    <div>
      <div class="footer-title">Navigation</div>
      <a class="footer-link" href="index.html">Accueil</a>
      <a class="footer-link" href="boutique.html">Boutique</a>
      <a class="footer-link" href="antennes.html">Services</a>
      <a class="footer-link" href="marketplace.html">Marketplace</a>
      <a class="footer-link" href="a-propos.html">A propos</a>
    </div>
    <div>
      <div class="footer-title">Compte</div>
      <a class="footer-link" href="compte.html">Connexion</a>
      <a class="footer-link" href="inscription.html">Inscription</a>
      <a class="footer-link" href="vendeur.html">Espace vendeur</a>
      <a class="footer-link" href="panier.html">Mon panier</a>
    </div>
    <div>
      <div class="footer-title">Contact</div>
      <p style="font-size:13px;margin-bottom:6px">📍 Tahoua, Niger</p>
      <a href="https://wa.me/22798836601" style="font-size:13px;color:#25d366;display:block;margin-bottom:6px">📞 +227 98 83 66 01</a>
      <p style="font-size:13px">✉️ mamshop.niger@gmail.com</p>
    </div>
  </div>
  <div class="footer-bottom">© 2026 MAM Shop - Tous droits reserves | Tahoua, Niger</div>
</footer>

<script src="js/api.js"></script>
<script>
async function loadHome() {
  try {
    const products = await dbQuery("SELECT * FROM products WHERE is_active=1 AND is_featured=1 ORDER BY created_at DESC LIMIT 8");
    renderProducts(products, 'featured-products');
    const cats = await dbQuery("SELECT COUNT(*) as n FROM categories WHERE is_active=1");
    const prods = await dbQuery("SELECT COUNT(*) as n FROM products WHERE is_active=1");
    document.getElementById('nb-products').textContent = prods[0]?.n || '0';
    document.getElementById('nb-categories').textContent = cats[0]?.n || '0';
  } catch(e) {
    document.getElementById('featured-products').innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:40px;color:#64748b">Aucun produit pour le moment</div>';
  }
}
loadHome();
</script>
</body>
</html>
