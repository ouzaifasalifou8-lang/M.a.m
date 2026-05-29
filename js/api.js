const SUPA_URL = "https://rqoaclfelpezlbbnjwrl.supabase.co";
const SUPA_KEY = "sb_publishable_DkkNbLwrx_k_JItaGhYzgw_JBWeflei";

async function sbGet(table, params = "") {
  const res = await fetch(`${SUPA_URL}/rest/v1/${table}?${params}`, {
    headers: {
      "apikey": SUPA_KEY,
      "Authorization": `Bearer ${SUPA_KEY}`
    }
  });
  return res.json();
}

async function sbPost(table, data) {
  const res = await fetch(`${SUPA_URL}/rest/v1/${table}`, {
    method: "POST",
    headers: {
      "apikey": SUPA_KEY,
      "Authorization": `Bearer ${SUPA_KEY}`,
      "Content-Type": "application/json",
      "Prefer": "return=representation"
    },
    body: JSON.stringify(data)
  });
  return res.json();
}

async function sbPatch(table, id, data) {
  const res = await fetch(`${SUPA_URL}/rest/v1/${table}?id=eq.${id}`, {
    method: "PATCH",
    headers: {
      "apikey": SUPA_KEY,
      "Authorization": `Bearer ${SUPA_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });
  return res.json();
}

async function sbDelete(table, id) {
  await fetch(`${SUPA_URL}/rest/v1/${table}?id=eq.${id}`, {
    method: "DELETE",
    headers: {
      "apikey": SUPA_KEY,
      "Authorization": `Bearer ${SUPA_KEY}`
    }
  });
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
  const total = getCart().reduce((s,x) => s+(x.qty||1), 0);
  document.querySelectorAll('.cart-count').forEach(el => {
    el.textContent = total;
    el.style.display = total > 0 ? 'flex' : 'none';
  });
}

function showToast(msg, type='info') {
  const t = document.createElement('div');
  t.style.cssText = `position:fixed;bottom:20px;right:20px;background:${type==='success'?'#25d366':'#2563eb'};color:white;padding:13px 20px;border-radius:10px;font-weight:600;font-size:14px;z-index:9999;box-shadow:0 4px 12px rgba(0,0,0,.2)`;
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3000);
}

function orderWhatsApp(product) {
  const msg = encodeURIComponent(`Bonjour MAM Shop !\n\nJe voudrais commander:\n*${product.name}*\nPrix: ${parseFloat(product.promo_price||product.price).toLocaleString()} XOF\n\nMerci !`);
  window.open(`https://wa.me/22798836601?text=${msg}`, '_blank');
}

function orderCartWhatsApp() {
  const cart = getCart();
  if (!cart.length) { showToast('Panier vide !'); return; }
  const items = cart.map(p => `- ${p.name} x${p.qty||1}: ${(parseFloat(p.promo_price||p.price||0)*(p.qty||1)).toLocaleString()} XOF`).join('\n');
  const total = cart.reduce((s,p) => s+parseFloat(p.promo_price||p.price||0)*(p.qty||1), 0);
  const msg = encodeURIComponent(`Bonjour MAM Shop !\n\nMa commande:\n${items}\n\nTotal: ${total.toLocaleString()} XOF\n\nMerci !`);
  window.open(`https://wa.me/22798836601?text=${msg}`, '_blank');
}

function renderProducts(products, containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;
  if (!products.length) {
    el.innerHTML = '<div style="text-align:center;padding:40px;color:#64748b;grid-column:1/-1">Aucun produit disponible</div>';
    return;
  }
  el.innerHTML = products.map(p => `
    <div class="card">
      <div class="card-img">${p.image_url ? `<img src="${p.image_url}" alt="${p.name}">` : '🛍️'}</div>
      <div class="card-body">
        ${p.promo_price ? '<span class="promo-badge">PROMO</span>' : ''}
        <div class="card-name">${p.name}</div>
        <div class="card-desc">${(p.description||'').substring(0,55)}...</div>
        <div class="card-price">
          ${parseFloat(p.promo_price||p.price).toLocaleString()} XOF
          ${p.promo_price ? `<span class="card-price-old">${parseFloat(p.price).toLocaleString()}</span>` : ''}
        </div>
        <div class="card-actions">
          <button class="btn-cart" onclick='addToCart(${JSON.stringify(p)})'>+ Panier</button>
          <button class="btn-whatsapp" onclick='orderWhatsApp(${JSON.stringify(p)})'>WhatsApp</button>
        </div>
      </div>
    </div>`).join('');
                                 }
