import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Admin() {
  const [stats, setStats] = useState({ products: 0, users: 0, orders: 0, revenue: 0 });
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tab, setTab] = useState('dashboard');
  const [form, setForm] = useState({ name: '', description: '', price: '', promo_price: '', stock: '', category_id: '', image_url: '', is_featured: false });
  const [uploading, setUploading] = useState(false);
  const [pass, setPass] = useState('');
  const [auth, setAuth] = useState(false);

  const ADMIN_PASS = 'mamshop2026';

  useEffect(() => {
    const a = localStorage.getItem('admin_auth');
    if (a === ADMIN_PASS) setAuth(true);
  }, []);

  useEffect(() => {
    if (!auth) return;
    fetch('/api/products').then(r => r.json()).then(data => {
      setProducts(data);
      setStats(s => ({ ...s, products: data.length }));
    });
    fetch('/api/categories').then(r => r.json()).then(setCategories);
  }, [auth]);

  const login = () => {
    if (pass === ADMIN_PASS) {
      localStorage.setItem('admin_auth', pass);
      setAuth(true);
    } else alert('Mot de passe incorrect !');
  };

  const uploadImage = async (file) => {
    setUploading(true);
    const reader = new FileReader();
    reader.onload = async (e) => {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: e.target.result, folder: 'products' })
      });
      const data = await res.json();
      if (data.url) setForm(f => ({ ...f, image_url: data.url }));
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const saveProduct = async () => {
    if (!form.name || !form.price) return alert('Nom et prix requis !');
    await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    alert('Produit enregistre !');
    setForm({ name: '', description: '', price: '', promo_price: '', stock: '', category_id: '', image_url: '', is_featured: false });
    fetch('/api/products').then(r => r.json()).then(setProducts);
  };

  const deleteProduct = async (id) => {
    if (!confirm('Supprimer ce produit ?')) return;
    await fetch(`/api/products?id=${id}`, { method: 'DELETE' });
    setProducts(products.filter(p => p.id !== id));
  };

  if (!auth) return (
    <div style={{ minHeight: '100vh', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#1e293b', padding: 40, borderRadius: 20, width: 340, textAlign: 'center' }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>🔐</div>
        <h2 style={{ color: 'white', fontSize: 22, marginBottom: 24, fontWeight: 800 }}>Admin MAM Shop</h2>
        <input type="password" value={pass} onChange={e => setPass(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && login()}
          placeholder="Mot de passe"
          style={{ width: '100%', padding: '12px 16px', borderRadius: 10, border: 'none', marginBottom: 16, fontSize: 15 }} />
        <button onClick={login} style={{ width: '100%', padding: '13px', background: '#2563eb', color: 'white', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 16 }}>
          Connexion
        </button>
      </div>
    </div>
  );

  const tabs = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard' },
    { id: 'products', icon: '🛍️', label: 'Produits' },
    { id: 'add_product', icon: '➕', label: 'Ajouter' },
    { id: 'categories', icon: '📂', label: 'Categories' },
    { id: 'services', icon: '📡', label: 'Services' },
    { id: 'orders', icon: '📦', label: 'Commandes' },
    { id: 'sellers', icon: '🏪', label: 'Vendeurs' },
    { id: 'settings', icon: '⚙️', label: 'Parametres' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', display: 'flex' }}>
      {/* Sidebar */}
      <div style={{ width: 220, background: '#1e293b', padding: '24px 0', flexShrink: 0 }}>
        <div style={{ padding: '0 20px 24px', borderBottom: '1px solid #334155' }}>
          <div style={{ color: 'white', fontWeight: 800, fontSize: 18 }}>MAM Shop</div>
          <div style={{ color: '#94a3b8', fontSize: 12 }}>Interface Admin</div>
        </div>
        <nav style={{ padding: '16px 0' }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              width: '100%', padding: '12px 20px',
              display: 'flex', alignItems: 'center', gap: 10,
              background: tab === t.id ? '#2563eb' : 'transparent',
              color: tab === t.id ? 'white' : '#94a3b8',
              border: 'none', textAlign: 'left', fontSize: 14, fontWeight: 500,
              cursor: 'pointer', transition: 'all 0.2s'
            }}>
              <span>{t.icon}</span> {t.label}
            </button>
          ))}
        </nav>
        <div style={{ padding: '16px 20px', borderTop: '1px solid #334155', marginTop: 'auto' }}>
          <Link href="/" style={{ color: '#94a3b8', fontSize: 13 }}>Voir le site →</Link>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: 28, overflow: 'auto' }}>
        {/* Dashboard */}
        {tab === 'dashboard' && (
          <div>
            <h1 style={{ color: 'white', fontSize: 24, fontWeight: 800, marginBottom: 24 }}>Tableau de bord</h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 28 }}>
              {[
                { label: 'Produits', value: products.length, icon: '🛍️', color: '#6366f1' },
                { label: 'Categories', value: categories.length, icon: '📂', color: '#10b981' },
                { label: 'Commandes', value: '—', icon: '📦', color: '#f59e0b' },
                { label: 'Revenu XOF', value: '—', icon: '💰', color: '#ef4444' },
              ].map(s => (
                <div key={s.label} style={{ background: '#1e293b', borderRadius: 14, padding: 20, borderLeft: `4px solid ${s.color}` }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
                  <div style={{ color: 'white', fontSize: 26, fontWeight: 800 }}>{s.value}</div>
                  <div style={{ color: '#94a3b8', fontSize: 13 }}>{s.label}</div>
                </div>
              ))}
            </div>
            <div style={{ background: '#1e293b', borderRadius: 14, padding: 24 }}>
              <h2 style={{ color: 'white', fontWeight: 700, marginBottom: 16 }}>Derniers produits</h2>
              {products.slice(0, 5).map(p => (
                <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0', borderBottom: '1px solid #334155' }}>
                  <div style={{ width: 44, height: 44, background: '#334155', borderRadius: 10, overflow: 'hidden', flexShrink: 0 }}>
                    {p.image_url ? <img src={p.image_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>🛍️</div>}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: 'white', fontWeight: 600, fontSize: 14 }}>{p.name}</div>
                    <div style={{ color: '#94a3b8', fontSize: 12 }}>Stock: {p.stock}</div>
                  </div>
                  <div style={{ color: '#6366f1', fontWeight: 700 }}>{parseFloat(p.price).toLocaleString()} XOF</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Produits */}
        {tab === 'products' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h1 style={{ color: 'white', fontSize: 24, fontWeight: 800 }}>Produits ({products.length})</h1>
              <button onClick={() => setTab('add_product')} style={{ background: '#2563eb', color: 'white', padding: '10px 20px', borderRadius: 10, fontWeight: 700, border: 'none' }}>
                + Ajouter
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
              {products.map(p => (
                <div key={p.id} style={{ background: '#1e293b', borderRadius: 14, overflow: 'hidden' }}>
                  <div style={{ height: 140, background: '#334155', overflow: 'hidden' }}>
                    {p.image_url ? <img src={p.image_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: 32 }}>🛍️</div>}
                  </div>
                  <div style={{ padding: 14 }}>
                    <div style={{ color: 'white', fontWeight: 700, marginBottom: 4, fontSize: 14 }}>{p.name}</div>
                    <div style={{ color: '#6366f1', fontWeight: 700, marginBottom: 10 }}>{parseFloat(p.price).toLocaleString()} XOF</div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => deleteProduct(p.id)} style={{ flex: 1, padding: '7px', background: '#ef4444', color: 'white', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 600 }}>
                        Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Ajouter produit */}
        {tab === 'add_product' && (
          <div>
            <h1 style={{ color: 'white', fontSize: 24, fontWeight: 800, marginBottom: 24 }}>Ajouter un produit</h1>
            <div style={{ background: '#1e293b', borderRadius: 16, padding: 28, maxWidth: 600 }}>
              {/* Upload image */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ color: '#94a3b8', fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 8 }}>Photo du produit</label>
                <div style={{ border: '2px dashed #334155', borderRadius: 12, padding: 20, textAlign: 'center', cursor: 'pointer', position: 'relative' }}
                  onClick={() => document.getElementById('img-input').click()}>
                  {form.image_url ? (
                    <img src={form.image_url} style={{ maxHeight: 160, borderRadius: 8 }} />
                  ) : (
                    <div>
                      <div style={{ fontSize: 36, marginBottom: 8 }}>📸</div>
                      <p style={{ color: '#94a3b8', fontSize: 13 }}>{uploading ? 'Chargement...' : 'Cliquer pour uploader'}</p>
                    </div>
                  )}
                  <input id="img-input" type="file" accept="image/*" style={{ display: 'none' }}
                    onChange={e => e.target.files[0] && uploadImage(e.target.files[0])} />
                </div>
              </div>

              {[
                ['Nom du produit *', 'name', 'text'],
                ['Description', 'description', 'textarea'],
                ['Prix (XOF) *', 'price', 'number'],
                ['Prix promo (XOF)', 'promo_price', 'number'],
                ['Stock', 'stock', 'number'],
              ].map(([label, key, type]) => (
                <div key={key} style={{ marginBottom: 16 }}>
                  <label style={{ color: '#94a3b8', fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>{label}</label>
                  {type === 'textarea' ? (
                    <textarea value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                      rows={3}
                      style={{ width: '100%', padding: '10px 14px', background: '#334155', border: '1px solid #475569', borderRadius: 8, color: 'white', fontSize: 14, resize: 'vertical' }} />
                  ) : (
                    <input type={type} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                      style={{ width: '100%', padding: '10px 14px', background: '#334155', border: '1px solid #475569', borderRadius: 8, color: 'white', fontSize: 14 }} />
                  )}
                </div>
              ))}

              <div style={{ marginBottom: 16 }}>
                <label style={{ color: '#94a3b8', fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Categorie</label>
                <select value={form.category_id} onChange={e => setForm(f => ({ ...f, category_id: e.target.value }))}
                  style={{ width: '100%', padding: '10px 14px', background: '#334155', border: '1px solid #475569', borderRadius: 8, color: 'white', fontSize: 14 }}>
                  <option value="">Choisir une categorie</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#94a3b8', fontSize: 14, marginBottom: 20, cursor: 'pointer' }}>
                <input type="checkbox" checked={form.is_featured} onChange={e => setForm(f => ({ ...f, is_featured: e.target.checked }))} />
                Produit vedette (affiché en page d'accueil)
              </label>

              <button onClick={saveProduct} style={{ width: '100%', padding: '14px', background: '#2563eb', color: 'white', border: 'none', borderRadius: 12, fontWeight: 800, fontSize: 16 }}>
                Enregistrer le produit
              </button>
            </div>
          </div>
        )}

        {/* Categories */}
        {tab === 'categories' && (
          <div>
            <h1 style={{ color: 'white', fontSize: 24, fontWeight: 800, marginBottom: 24 }}>Categories</h1>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              <div style={{ background: '#1e293b', borderRadius: 14, padding: 24 }}>
                <h2 style={{ color: 'white', fontWeight: 700, marginBottom: 16 }}>Ajouter une categorie</h2>
                <input placeholder="Nom de la categorie"
                  id="cat-name"
                  style={{ width: '100%', padding: '10px 14px', background: '#334155', border: '1px solid #475569', borderRadius: 8, color: 'white', marginBottom: 12, fontSize: 14 }} />
                <button onClick={async () => {
                  const name = document.getElementById('cat-name').value;
                  if (!name) return;
                  await fetch('/api/categories', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name })
                  });
                  document.getElementById('cat-name').value = '';
                  fetch('/api/categories').then(r => r.json()).then(setCategories);
                }} style={{ width: '100%', padding: '11px', background: '#2563eb', color: 'white', border: 'none', borderRadius: 8, fontWeight: 700 }}>
                  Ajouter
                </button>
              </div>
              <div style={{ background: '#1e293b', borderRadius: 14, padding: 24 }}>
                <h2 style={{ color: 'white', fontWeight: 700, marginBottom: 16 }}>Categories existantes</h2>
                {categories.map(c => (
                  <div key={c.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #334155' }}>
                    <span style={{ color: 'white', fontSize: 14 }}>{c.name}</span>
                    <span style={{ color: '#94a3b8', fontSize: 12 }}>ID: {c.id}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Services */}
        {tab === 'services' && (
          <div>
            <h1 style={{ color: 'white', fontSize: 24, fontWeight: 800, marginBottom: 24 }}>Services Antennes & Starlink</h1>
            <div style={{ background: '#1e293b', borderRadius: 14, padding: 24, maxWidth: 600 }}>
              <h2 style={{ color: 'white', fontWeight: 700, marginBottom: 16 }}>Ajouter une photo d'installation</h2>
              <div style={{ border: '2px dashed #334155', borderRadius: 12, padding: 20, textAlign: 'center', marginBottom: 16, cursor: 'pointer' }}
                onClick={() => document.getElementById('svc-img').click()}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>📡</div>
                <p style={{ color: '#94a3b8', fontSize: 13 }}>Cliquer pour uploader</p>
                <input id="svc-img" type="file" accept="image/*" style={{ display: 'none' }} />
              </div>
              <input placeholder="Legende de la photo" id="svc-caption"
                style={{ width: '100%', padding: '10px 14px', background: '#334155', border: '1px solid #475569', borderRadius: 8, color: 'white', marginBottom: 12, fontSize: 14 }} />
              <button style={{ width: '100%', padding: '12px', background: '#2563eb', color: 'white', border: 'none', borderRadius: 10, fontWeight: 700 }}>
                Ajouter a la galerie
              </button>
            </div>
          </div>
        )}

        {/* Paramètres */}
        {tab === 'settings' && (
          <div>
            <h1 style={{ color: 'white', fontSize: 24, fontWeight: 800, marginBottom: 24 }}>Parametres du site</h1>
            <div style={{ background: '#1e293b', borderRadius: 14, padding: 24, maxWidth: 600 }}>
              {[
                ['Nom du site', 'MAM Shop'],
                ['Numero WhatsApp', '+227 98 83 66 01'],
                ['Email contact', 'mamshop.niger@gmail.com'],
                ['Adresse', 'Tahoua, Niger'],
                ['Mot de passe admin', ''],
              ].map(([label, val]) => (
                <div key={label} style={{ marginBottom: 16 }}>
                  <label style={{ color: '#94a3b8', fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>{label}</label>
                  <input defaultValue={val} type={label.includes('passe') ? 'password' : 'text'}
                    style={{ width: '100%', padding: '10px 14px', background: '#334155', border: '1px solid #475569', borderRadius: 8, color: 'white', fontSize: 14 }} />
                </div>
              ))}
              <button style={{ width: '100%', padding: '13px', background: '#10b981', color: 'white', border: 'none', borderRadius: 10, fontWeight: 700 }}>
                Sauvegarder les parametres
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
        }
