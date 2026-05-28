import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{
      background: '#0f172a',
      color: '#94a3b8',
      padding: '48px 20px 24px'
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 40,
          marginBottom: 40
        }}>
          <div>
            <div style={{
              fontWeight: 800, fontSize: 20,
              color: 'white', marginBottom: 12
            }}>MAM Shop</div>
            <p style={{ fontSize: 14, lineHeight: 1.6 }}>
              Votre marketplace de confiance au Niger.
              Produits de qualite, livraison rapide.
            </p>
            <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
              <a href="https://wa.me/22798836601" style={{
                background: '#25d366',
                color: 'white',
                padding: '8px 14px',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600
              }}>WhatsApp</a>
            </div>
          </div>
          <div>
            <div style={{ color: 'white', fontWeight: 700, marginBottom: 16 }}>Navigation</div>
            {[['/', 'Accueil'], ['/boutique', 'Boutique'],
              ['/antennes', 'Services'], ['/marketplace', 'Marketplace'],
              ['/a-propos', 'A propos']].map(([href, label]) => (
              <Link key={href} href={href} style={{
                display: 'block', marginBottom: 8,
                fontSize: 14, color: '#94a3b8'
              }}>{label}</Link>
            ))}
          </div>
          <div>
            <div style={{ color: 'white', fontWeight: 700, marginBottom: 16 }}>Compte</div>
            {[['/compte/connexion', 'Connexion'],
              ['/compte/inscription', 'Inscription'],
              ['/inscription-vendeur', 'Devenir vendeur'],
              ['/panier', 'Mon panier']].map(([href, label]) => (
              <Link key={href} href={href} style={{
                display: 'block', marginBottom: 8,
                fontSize: 14, color: '#94a3b8'
              }}>{label}</Link>
            ))}
          </div>
          <div>
            <div style={{ color: 'white', fontWeight: 700, marginBottom: 16 }}>Contact</div>
            <p style={{ fontSize: 14, marginBottom: 8 }}>Tahoua, Niger</p>
            <a href="https://wa.me/22798836601" style={{ fontSize: 14, color: '#25d366' }}>
              +227 98 83 66 01
            </a>
            <p style={{ fontSize: 14, marginTop: 8 }}>mamshop.niger@gmail.com</p>
          </div>
        </div>
        <div style={{
          borderTop: '1px solid #1e293b',
          paddingTop: 24,
          textAlign: 'center',
          fontSize: 13
        }}>
          © 2026 MAM Shop - Tous droits reserves | Developpe avec passion au Niger
        </div>
      </div>
    </footer>
  );
}
