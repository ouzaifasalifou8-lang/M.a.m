import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Link from 'next/link';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/products?featured=1')
      .then(r => r.json())
      .then(data => { setProducts(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Produit ajoute au panier !');
  };

  const orderWhatsApp = (product) => {
    const msg = encodeURIComponent(
      `Bonjour ! Je voudrais commander:\\n*${product.name}*\\nPrix: ${product.price} XOF\\nMerci !`
    );
    window.open(`https://wa.me/22798836601?text=${msg}`, '_blank');
  };

  return (
    <div>
      <Navbar />

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #2563eb 50%, #7c3aed 100%)',
        color: 'white',
        padding: '80px 20px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <h1 style={{ fontSize: 48, fontWeight: 900, marginBottom: 16, lineHeight: 1.2 }}>
            Bienvenue sur <span style={{ color: '#fbbf24' }}>MAM Shop</span>
          </h1>
          <p style={{ fontSize: 20, opacity: 0.9, marginBottom: 32 }}>
            Votre marketplace de confiance au Niger
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/boutique" style={{
              background: '#fbbf24', color: '#1e293b',
              padding: '14px 28px', borderRadius: 12,
              fontWeight: 700, fontSize: 16
            }}>Voir la boutique</Link>
            <a href="https://wa.me/22798836601" style={{
              background: '#25d366', color: 'white',
              padding: '14px 28px', borderRadius: 12,
              fontWeight: 700, fontSize: 16
            }}>Commander sur WhatsApp</a>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{
        background: 'white',
        padding: '32px 20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
      }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: 20, textAlign: 'center'
        }}>
          {[
            ['100+', 'Produits'],
            ['50+', 'Vendeurs'],
            ['500+', 'Clients'],
            ['98%', 'Satisfaction']
          ].map(([num, label]) => (
            <div key={label}>
              <div style={{ fontSize: 32, fontWeight: 800, color: '#2563eb' }}>{num}</div>
              <div style={{ color: '#64748b', fontSize: 14 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Produits vedettes */}
      <div style={{ padding: '60px 20px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, textAlign: 'center' }}>
            Produits vedettes
          </h2>
          <p style={{ color: '#64748b', textAlign: 'center', marginBottom: 40 }}>
            Selection des meilleurs produits du moment
          </p>

          {loading ? (
            <div style={{ textAlign: 'center', padding: 40, color: '#64748b' }}>
              Chargement...
            </div>
          ) : products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 40 }}>
              <p style={{ color: '#64748b', marginBottom: 20 }}>
                Aucun produit pour le moment
              </p>
              <Link href="/admin" style={{
                background: '#2563eb', color: 'white',
                padding: '12px 24px', borderRadius: 8, fontWeight: 600
              }}>Ajouter des produits</Link>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: 24
            }}>
              {products.map(p => (
                <div key={p.id} style={{
                  background: 'white',
                  borderRadius: 16,
                  overflow: 'hidden',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  transition: 'transform 0.2s',
                }}>
                  <div style={{
                    height: 200,
                    background: '#f1f5f9',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    overflow: 'hidden'
                  }}>
                    {p.image_url ? (
                      <img src={p.image_url} alt={p.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span style={{ fontSize: 48 }}>🛍️</span>
                    )}
                  </div>
                  <div style={{ padding: 16 }}>
                    {p.promo_price && (
                      <span style={{
                        background: '#fef3c7', color: '#d97706',
                        fontSize: 11, fontWeight: 700,
                        padding: '2px 8px', borderRadius: 20,
                        marginBottom: 8, display: 'inline-block'
                      }}>PROMO</span>
                    )}
                    <h3 style={{ fontWeight: 700, marginBottom: 4, fontSize: 16 }}>{p.name}</h3>
                    <p style={{ color: '#64748b', fontSize: 13, marginBottom: 12, lineHeight: 1.5 }}>
                      {p.description?.substring(0, 60)}...
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                      <span style={{ fontSize: 18, fontWeight: 800, color: '#2563eb' }}>
                        {parseFloat(p.promo_price || p.price).toLocaleString()} XOF
                      </span>
                      {p.promo_price && (
                        <span style={{ fontSize: 13, color: '#94a3b8', textDecoration: 'line-through' }}>
                          {parseFloat(p.price).toLocaleString()}
                        </span>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => addToCart(p)} style={{
                        flex: 1, padding: '9px 0',
                        background: '#f1f5f9', color: '#1e293b',
                        borderRadius: 8, fontWeight: 600, fontSize: 13, border: 'none'
                      }}>+ Panier</button>
                      <button onClick={() => orderWhatsApp(p)} style={{
                        flex: 1, padding: '9px 0',
                        background: '#25d366', color: 'white',
                        borderRadius: 8, fontWeight: 600, fontSize: 13, border: 'none'
                      }}>WhatsApp</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <Link href="/boutique" style={{
              background: '#2563eb', color: 'white',
              padding: '14px 32px', borderRadius: 12, fontWeight: 700
            }}>Voir tous les produits</Link>
          </div>
        </div>
      </div>

      {/* Services */}
      <div style={{ background: '#f1f5f9', padding: '60px 20px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 40 }}>
            Nos Services
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: 24
          }}>
            {[
              ['📡', 'Installation Antennes', 'Installation professionnelle d\'antennes paraboliques et Starlink'],
              ['🛍️', 'Boutique en ligne', 'Large catalogue de produits au meilleur prix'],
              ['🏪', 'Marketplace', 'Vendez vos produits et touchez plus de clients'],
              ['🚀', 'Livraison rapide', 'Livraison dans tout le Niger']
            ].map(([icon, title, desc]) => (
              <div key={title} style={{
                background: 'white',
                borderRadius: 16,
                padding: 28,
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
              }}>
                <div style={{ fontSize: 40, marginBottom: 16 }}>{icon}</div>
                <h3 style={{ fontWeight: 700, marginBottom: 8 }}>{title}</h3>
                <p style={{ color: '#64748b', fontSize: 14, lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA WhatsApp */}
      <div style={{
        background: 'linear-gradient(135deg, #25d366, #128c7e)',
        padding: '60px 20px',
        textAlign: 'center',
        color: 'white'
      }}>
        <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 16 }}>
          Commandez directement sur WhatsApp !
        </h2>
        <p style={{ fontSize: 18, opacity: 0.9, marginBottom: 32 }}>
          Contactez-nous pour passer votre commande rapidement
        </p>
        <a href="https://wa.me/22798836601" style={{
          background: 'white', color: '#25d366',
          padding: '16px 40px', borderRadius: 50,
          fontWeight: 800, fontSize: 18,
          display: 'inline-block'
        }}>+227 98 83 66 01</a>
      </div>

      <Footer />
    </div>
  );
                     }
