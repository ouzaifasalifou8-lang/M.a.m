import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [cart, setCart] = useState(0);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    const c = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(c.length);
  }, []);

  return (
    <nav style={{
      background: 'white',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      padding: '0 20px'
    }}>
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 64
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 36, height: 36,
            background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
            borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: 800, fontSize: 16
          }}>M</div>
          <span style={{ fontWeight: 800, fontSize: 20, color: '#1e293b' }}>MAM Shop</span>
        </Link>

        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          <Link href="/" style={{ color: '#64748b', fontSize: 14, fontWeight: 500 }}>Accueil</Link>
          <Link href="/boutique" style={{ color: '#64748b', fontSize: 14, fontWeight: 500 }}>Boutique</Link>
          <Link href="/antennes" style={{ color: '#64748b', fontSize: 14, fontWeight: 500 }}>Services</Link>
          <Link href="/marketplace" style={{ color: '#64748b', fontSize: 14, fontWeight: 500 }}>Marketplace</Link>
          <Link href="/a-propos" style={{ color: '#64748b', fontSize: 14, fontWeight: 500 }}>A propos</Link>
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Link href="/panier" style={{
            position: 'relative',
            background: '#f1f5f9',
            padding: '8px 14px',
            borderRadius: 8,
            fontWeight: 600,
            fontSize: 14,
            color: '#1e293b'
          }}>
            Panier {cart > 0 && (
              <span style={{
                position: 'absolute',
                top: -6, right: -6,
                background: '#ef4444',
                color: 'white',
                borderRadius: '50%',
                width: 18, height: 18,
                fontSize: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>{cart}</span>
            )}
          </Link>
          <Link href="/compte/connexion" style={{
            background: '#2563eb',
            color: 'white',
            padding: '8px 16px',
            borderRadius: 8,
            fontWeight: 600,
            fontSize: 14
          }}>Connexion</Link>
        </div>
      </div>
    </nav>
  );
  }
