import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Boutique() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/categories').then(r => r.json()).then(setCategories);
    loadProducts();
  }, []);

  const loadProducts = (cat = '', q = '') => {
    setLoading(true);
    let url = '/api/products?';
    if (cat) url += `category=${cat}&`;
    if (q) url += `search=${q}`;
    fetch(url).then(r => r.json()).then(data => {
      setProducts(data);
      setLoading(false);
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadProducts(selectedCat, search);
  };

  const addToCart = (p) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart.push(p);
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Ajoute au panier !');
  };

  const orderWA = (p) => {
    const msg = encodeURIComponent(`Je voudrais commander: *${p.name}* - ${p.price} XOF`);
    window.open(`https://wa.me/22798836601?text=${msg}`, '_blank');
  };

  return (
    <div>
      <Navbar />
      <div style={{ background: 'linear-gradient(135deg, #1e293b, #2563eb)', padding: '40px 20px', color: 'white', textAlign: 'center' }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 8 }}>Boutique</h1>
        <p style={{ opacity: 0.8 }}>Tous nos produits au meilleur prix</p>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 20px' }}>
        {/* Recherche */}
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: 12, marginBottom: 32, flexWrap: 'wrap' }}>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher un produit..."
            style={{ flex: 1, minWidth: 200, padding: '12px 16px', borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 15 }} />
          <select value={selectedCat} onChange={e => { setSelectedCat(e.target.value); loadProducts(e.target.value, search); }}
            style={{ padding: '12px 16px', borderRadius: 10, border: '1px solid #e2e8f0', minWidth: 160, fontSize: 14 }}>
            <option value="">Toutes categories</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <button type="submit" style={{ padding: '12px 24px', background: '#2563eb', color: 'white', borderRadius: 10, fontWeight: 700, border: 'none', fontSize: 14 }}>
            Rechercher
          </button>
        </form>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, color: '#64748b' }}>Chargement...</div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 60 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🛍️</div>
            <p style={{ color: '#64748b', fontSize: 18 }}>Aucun produit trouve</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20 }}>
            {products.map(p => (
              <div key={p.id} style={{ background: 'white', borderRadius: 14, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
                <div style={{ height: 180, background: '#f1f5f9', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {p.image_url ? <img src={p.image_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: 40 }}>🛍️</span>}
                </div>
                <div style={{ padding: 14 }}>
                  {p.compare_price && <span style={{ background: '#fef3c7', color: '#d97706', fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 20, marginBottom: 6, display: 'inline-block' }}>PROMO</span>}
                  <h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{p.name}</h3>
                  <p style={{ color: '#64748b', fontSize: 12, marginBottom: 10, lineHeight: 1.5 }}>{p.description?.substring(0, 50)}...</p>
                  <div style={{ marginBottom: 10 }}>
                    <span style={{ fontWeight: 800, color: '#2563eb', fontSize: 16 }}>
                      {parseFloat(p.compare_price || p.price).toLocaleString()} XOF
                    </span>
                    {p.compare_price && <span style={{ fontSize: 12, color: '#94a3b8', textDecoration: 'line-through', marginLeft: 6 }}>{parseFloat(p.price).toLocaleString()}</span>}
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => addToCart(p)} style={{ flex: 1, padding: '8px 0', background: '#f1f5f9', borderRadius: 8, fontWeight: 600, fontSize: 12, border: 'none' }}>+ Panier</button>
                    <button onClick={() => orderWA(p)} style={{ flex: 1, padding: '8px 0', background: '#25d366', color: 'white', borderRadius: 8, fontWeight: 600, fontSize: 12, border: 'none' }}>WA</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
    }
