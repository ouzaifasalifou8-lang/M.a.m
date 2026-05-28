import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Antennes() {
  const [form, setForm] = useState({ name: '', phone: '', address: '', service: '', message: '' });

  const sendWA = (e) => {
    e.preventDefault();
    const msg = encodeURIComponent(
      `Bonjour MAM Shop !\\n\\nDemande de service:\\nNom: ${form.name}\\nTel: ${form.phone}\\nAdresse: ${form.address}\\nService: ${form.service}\\nMessage: ${form.message}`
    );
    window.open(`https://wa.me/22798836601?text=${msg}`, '_blank');
  };

  return (
    <div>
      <Navbar />

      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #0f172a, #1e40af)', color: 'white', padding: '60px 20px', textAlign: 'center' }}>
        <div style={{ fontSize: 60, marginBottom: 16 }}>📡</div>
        <h1 style={{ fontSize: 36, fontWeight: 900, marginBottom: 12 }}>
          Installation Antennes & Starlink
        </h1>
        <p style={{ fontSize: 18, opacity: 0.85, maxWidth: 600, margin: '0 auto 28px' }}>
          Service professionnel d'installation dans tout le Niger
        </p>
        <a href="https://wa.me/22798836601" style={{
          background: '#25d366', color: 'white',
          padding: '14px 32px', borderRadius: 50,
          fontWeight: 800, fontSize: 16, display: 'inline-block'
        }}>
          Nous contacter : +227 98 83 66 01
        </a>
      </div>

      {/* Services offerts */}
      <div style={{ padding: '60px 20px', maxWidth: 1200, margin: '0 auto' }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, textAlign: 'center', marginBottom: 40 }}>
          Nos prestations
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
          {[
            ['📡', 'Antenne parabolique', 'Installation et reglage de toutes marques d\'antennes paraboliques'],
            ['🛰️', 'Starlink', 'Installation et configuration complete de Starlink'],
            ['📺', 'TNT & Câble', 'Installation de decodeurs TNT et systemes cable'],
            ['🔧', 'Maintenance', 'Depannage et entretien de vos equipements'],
          ].map(([icon, title, desc]) => (
            <div key={title} style={{ background: 'white', borderRadius: 16, padding: 28, textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
              <div style={{ fontSize: 44, marginBottom: 14 }}>{icon}</div>
              <h3 style={{ fontWeight: 700, marginBottom: 8, fontSize: 18 }}>{title}</h3>
              <p style={{ color: '#64748b', fontSize: 14, lineHeight: 1.6 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Galerie placeholder */}
      <div style={{ background: '#f1f5f9', padding: '60px 20px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, textAlign: 'center', marginBottom: 40 }}>
            Nos realisations
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
            {[1,2,3,4,5,6].map(i => (
              <div key={i} style={{ height: 180, background: '#e2e8f0', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 36 }}>📡</span>
              </div>
            ))}
          </div>
          <p style={{ textAlign: 'center', color: '#94a3b8', marginTop: 16, fontSize: 13 }}>
            Photos a venir — Ajoutez via l'interface admin
          </p>
        </div>
      </div>

      {/* Formulaire */}
      <div style={{ padding: '60px 20px', maxWidth: 600, margin: '0 auto' }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, textAlign: 'center', marginBottom: 8 }}>
          Demander un devis
        </h2>
        <p style={{ textAlign: 'center', color: '#64748b', marginBottom: 32 }}>
          Remplissez le formulaire, nous vous recontactons via WhatsApp
        </p>
        <form onSubmit={sendWA} style={{ background: 'white', padding: 28, borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
          {[
            ['Votre nom *', 'name', 'text'],
            ['Numero de telephone *', 'phone', 'tel'],
            ['Votre adresse', 'address', 'text'],
          ].map(([label, key, type]) => (
            <div key={key} style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#64748b', display: 'block', marginBottom: 6 }}>{label}</label>
              <input type={type} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                style={{ width: '100%', padding: '11px 14px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14 }} />
            </div>
          ))}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#64748b', display: 'block', marginBottom: 6 }}>Type de service</label>
            <select value={form.service} onChange={e => setForm(f => ({ ...f, service: e.target.value }))}
              style={{ width: '100%', padding: '11px 14px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14 }}>
              <option value="">Choisir...</option>
              <option>Antenne parabolique</option>
              <option>Starlink</option>
              <option>TNT / Cable</option>
              <option>Maintenance</option>
            </select>
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#64748b', display: 'block', marginBottom: 6 }}>Message</label>
            <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
              rows={3}
              style={{ width: '100%', padding: '11px 14px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14, resize: 'vertical' }} />
          </div>
          <button type="submit" style={{ width: '100%', padding: '14px', background: '#25d366', color: 'white', border: 'none', borderRadius: 12, fontWeight: 800, fontSize: 16 }}>
            Envoyer via WhatsApp
          </button>
        </form>
      </div>

      <Footer />
    </div>
  );
                }
