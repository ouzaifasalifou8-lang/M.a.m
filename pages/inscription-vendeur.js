import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function InscriptionVendeur() {
  const [form, setForm] = useState({ shop_name: '', name: '', phone: '', email: '', description: '', address: '' });
  const [sent, setSent] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    const msg = encodeURIComponent(
      `Nouvelle demande vendeur MAM Shop:\\n\\nBoutique: ${form.shop_name}\\nNom: ${form.name}\\nTel: ${form.phone}\\nEmail: ${form.email}\\nAdresse: ${form.address}\\nDescription: ${form.description}`
    );
    window.open(`https://wa.me/22798836601?text=${msg}`, '_blank');
    setSent(true);
  };

  return (
    <div>
      <Navbar />
      <div style={{ maxWidth: 600, margin: '48px auto', padding: '0 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ fontSize: 56, marginBottom: 12 }}>🏪</div>
          <h1 style={{ fontSize: 30, fontWeight: 800, marginBottom: 8 }}>Devenir vendeur</h1>
          <p style={{ color: '#64748b' }}>Rejoignez la communaute MAM Shop et vendez vos produits</p>
        </div>

        {sent ? (
          <div style={{ background: '#dcfce7', padding: 32, borderRadius: 16, textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
            <h2 style={{ color: '#16a34a', fontWeight: 700 }}>Demande envoyee !</h2>
            <p style={{ color: '#15803d', marginTop: 8 }}>Nous vous contacterons dans les 24h.</p>
          </div>
        ) : (
          <form onSubmit={submit} style={{ background: 'white', padding: 32, borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
            {[
              ['Nom de votre boutique *', 'shop_name'],
              ['Votre nom complet *', 'name'],
              ['Telephone *', 'phone'],
              ['Email', 'email'],
              ['Ville / Adresse', 'address'],
            ].map(([label, key]) => (
              <div key={key} style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#64748b', display: 'block', marginBottom: 6 }}>{label}</label>
                <input value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  style={{ width: '100%', padding: '11px 14px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14 }} />
              </div>
            ))}
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#64748b', display: 'block', marginBottom: 6 }}>Description de vos produits</label>
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                rows={3}
                style={{ width: '100%', padding: '11px 14px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14, resize: 'vertical' }} />
            </div>
            <button type="submit" style={{ width: '100%', padding: '14px', background: '#7c3aed', color: 'white', border: 'none', borderRadius: 12, fontWeight: 800, fontSize: 16 }}>
              Envoyer ma demande
            </button>
          </form>
        )}
      </div>
      <Footer />
    </div>
  );
                  }
