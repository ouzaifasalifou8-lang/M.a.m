import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function APropos() {
  return (
    <div>
      <Navbar />
      <div style={{ background: 'linear-gradient(135deg, #1e293b, #0f172a)', color: 'white', padding: '60px 20px', textAlign: 'center' }}>
        <h1 style={{ fontSize: 36, fontWeight: 900, marginBottom: 12 }}>A propos de MAM Shop</h1>
        <p style={{ fontSize: 18, opacity: 0.8, maxWidth: 600, margin: '0 auto' }}>
          Votre marketplace de confiance au Niger depuis 2026
        </p>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '60px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24, marginBottom: 48 }}>
          {[
            ['🎯', 'Notre mission', 'Connecter acheteurs et vendeurs au Niger avec une plateforme simple, rapide et de confiance.'],
            ['🌍', 'Notre vision', 'Devenir la premiere marketplace du Niger et de l\'Afrique de l\'Ouest.'],
            ['💪', 'Nos valeurs', 'Confiance, transparence, innovation et service client exceptionnel.'],
          ].map(([icon, title, text]) => (
            <div key={title} style={{ background: 'white', borderRadius: 16, padding: 28, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', textAlign: 'center' }}>
              <div style={{ fontSize: 44, marginBottom: 14 }}>{icon}</div>
              <h3 style={{ fontWeight: 800, marginBottom: 10, fontSize: 18 }}>{title}</h3>
              <p style={{ color: '#64748b', lineHeight: 1.6, fontSize: 14 }}>{text}</p>
            </div>
          ))}
        </div>

        <div style={{ background: 'white', borderRadius: 20, padding: 36, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', textAlign: 'center', marginBottom: 40 }}>
          <h2 style={{ fontSize: 26, fontWeight: 800, marginBottom: 20 }}>Contactez-nous</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
            {[
              ['📍', 'Adresse', 'Tahoua, Niger'],
              ['📞', 'Telephone', '+227 98 83 66 01'],
              ['📧', 'Email', 'mamshop.niger@gmail.com'],
              ['💬', 'WhatsApp', '+227 98 83 66 01'],
            ].map(([icon, label, value]) => (
              <div key={label} style={{ padding: 16 }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{icon}</div>
                <div style={{ fontWeight: 700, marginBottom: 4 }}>{label}</div>
                <div style={{ color: '#64748b', fontSize: 14 }}>{value}</div>
              </div>
            ))}
          </div>
          <a href="https://wa.me/22798836601" style={{ display: 'inline-block', marginTop: 20, background: '#25d366', color: 'white', padding: '13px 32px', borderRadius: 50, fontWeight: 800 }}>
            Nous ecrire sur WhatsApp
          </a>
        </div>
      </div>

      <Footer />
    </div>
  );
}
