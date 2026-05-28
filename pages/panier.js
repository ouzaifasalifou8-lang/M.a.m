import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Panier() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem('cart') || '[]'));
  }, []);

  const remove = (i) => {
    const c = [...cart];
    c.splice(i, 1);
    setCart(c);
    localStorage.setItem('cart', JSON.stringify(c));
  };

  const total = cart.reduce((s, p) => s + parseFloat(p.compare_price || p.price || 0), 0);

  const orderAll = () => {
    if (cart.length === 0) return alert('Panier vide !');
    const items = cart.map(p => `- ${p.name}: ${parseFloat(p.compare_price || p.price).toLocaleString()} XOF`).join('\\n');
    const msg = encodeURIComponent(`Bonjour MAM Shop !\\n\\nJe voudrais commander:\\n${items}\\n\\nTotal: ${total.toLocaleString()} XOF\\n\\nMerci !`);
    window.open(`https://wa.me/22798836601?text=${msg}`, '_blank');
  };

  return (
    <div>
      <Navbar />
      <div style={{ maxWidth: 800, margin: '40px auto', padding: '0 20px' }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 24 }}>Mon Panier</h1>
        {cart.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 60, background: 'white', borderRadius: 16 }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🛒</div>
            <p style={{ color: '#64748b', fontSize: 18, marginBottom: 20 }}>Panier vide</p>
            <a href="/boutique" style={{ background: '#2563eb', color: 'white', padding: '12px 28px', borderRadius: 10, fontWeight: 700 }}>Continuer les achats</a>
          </div>
        ) : (
          <div>
            {cart.map((p, i) => (
              <div key={i} style={{ background: 'white', borderRadius: 14, padding: 16, marginBottom: 12, display: 'flex', gap: 16, alignItems: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.06)' }}>
                <div style={{ width: 72, height: 72, background: '#f1f5f9', borderRadius: 10, overflow: 'hidden', flexShrink: 0 }}>
                  {p.image_url ? <img src={p.image_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: 28 }}>🛍️</div>}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, marginBottom: 4 }}>{p.name}</div>
                  <div style={{ color: '#2563eb', fontWeight: 800 }}>{parseFloat(p.compare_price || p.price).toLocaleString()} XOF</div>
                </div>
                <button onClick={() => remove(i)} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '6px 12px', borderRadius: 8, fontWeight: 700 }}>✕</button>
              </div>
            ))}
            <div style={{ background: 'white', borderRadius: 14, padding: 24, marginTop: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                <span style={{ fontWeight: 600, fontSize: 18 }}>Total</span>
                <span style={{ fontWeight: 900, fontSize: 22, color: '#2563eb' }}>{total.toLocaleString()} XOF</span>
              </div>
              <button onClick={orderAll} style={{ width: '100%', padding: '14px', background: '#25d366', color: 'white', border: 'none', borderRadius: 12, fontWeight: 800, fontSize: 16 }}>
                Commander sur WhatsApp
              </button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
  }
