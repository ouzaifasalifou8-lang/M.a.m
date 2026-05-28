import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Link from 'next/link';

export default function Marketplace() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('/api/products').then(r => r.json()).then(setProducts);
  }, []);

  return (
    <div>
      <Navbar />
      <div style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)', color: 'white', padding: '60px 20px', textAlign: 'center' }}>
        <h1 style={{ fontSize: 36, fontWeight: 900, marginBottom: 12 }}>Marketplace</h1>
        <p style={{ fontSize: 18, opacity: 0.85, marginBottom: 28 }}>Achetez et vendez dans toute la communaute</p>
        <Link href="/inscription-vendeur" style={{ background: '#fbbf24', color: '#1e293b', padding: '14px 28px', borderRadius: 50, fontWeight: 800 }}>
          Devenir vendeur
        </Link>
      </div>

      <div style={{ maxWidth: 1200, margin: '40px auto', padding: '0 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20 }}>
          {products.map(p => (
            <div key={p.id} style={{ background: 'white', borderRadius: 14, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
              <div style={{ height: 180, background: '#f1f5f9', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {p.image_url ? <img src={p.image_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: 40 }}>🛍️</span>}
              </div>
              <div style={{ padding: 14 }}>
                <h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>{p.name}</h3>
                <div style={{ fontWeight: 800, color: '#7c3aed', marginBottom: 10 }}>{parseFloat(p.price).toLocaleString()} XOF</div>
                <a href={`https://wa.me/22798836601?text=${encodeURIComponent('Je veux: ' + p.name)}`}
                  target="_blank"
                  style={{ display: 'block', textAlign: 'center', padding: '9px', background: '#25d366', color: 'white', borderRadius: 8, fontWeight: 700, fontSize: 13 }}>
                  Commander WA
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
