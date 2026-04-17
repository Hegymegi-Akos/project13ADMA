import { useState } from 'react';
import emailjs from '@emailjs/browser';

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_u97w4rk';
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'NJmnYNngkcWACR6G4';
// Kontakt template - ha van kulon, hasznald azt, kulonben az altalanos
const EMAILJS_CONTACT_TEMPLATE = import.meta.env.VITE_EMAILJS_CONTACT_TEMPLATE_ID || 'template_mcjlomk';

const Contact = () => {
  const [form, setForm] = useState({ nev: '', email: '', targy: '', uzenet: '' });
  const [status, setStatus] = useState(''); // '' | 'sending' | 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMsg('');
    try {
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_CONTACT_TEMPLATE, {
        from_name: form.nev,
        from_email: form.email,
        subject: form.targy || 'Kapcsolat - Kisallat Webshop',
        message: form.uzenet,
        reply_to: form.email,
      }, EMAILJS_PUBLIC_KEY);
      setStatus('success');
      setForm({ nev: '', email: '', targy: '', uzenet: '' });
      setTimeout(() => setStatus(''), 5000);
    } catch (err) {
      setStatus('error');
      setErrorMsg('Nem sikerult elkuldeni az uzenetet. Probald ujra kesobb!');
      setTimeout(() => { setStatus(''); setErrorMsg(''); }, 5000);
    }
  };

  const inputStyle = {
    width: '100%', padding: '12px 16px', borderRadius: 12,
    border: '2px solid rgba(0,0,0,0.08)', fontSize: '0.95rem',
    transition: 'border-color 200ms, box-shadow 200ms',
    outline: 'none', background: 'var(--surface-bg, #fff)',
    color: 'var(--text-primary, #1e293b)',
  };

  const labelStyle = {
    display: 'block', fontSize: '0.85rem', fontWeight: 700,
    marginBottom: 6, color: 'var(--text-primary, #334155)',
  };

  return (
    <main className="container page">
      <h1 className="page-title">Kapcsolat</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 32, marginBottom: 40 }}>
        {/* Bal oldal - info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="ui-card" style={{ padding: 24 }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '1.15rem', fontWeight: 800 }}>Elerhetosegeink</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: 2 }}>Cim</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.5 }}>1234 Budapest, Kisallat utca 12.</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: 'linear-gradient(135deg, #10b981, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: 2 }}>Telefon</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>+36 1 234 5678</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: 'linear-gradient(135deg, #f59e0b, #d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: 2 }}>Email</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>info@kisallatwebshopproject.hu</div>
                </div>
              </div>
            </div>
          </div>

          <div className="ui-card" style={{ padding: 24 }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '1.15rem', fontWeight: 800 }}>Nyitvatartas</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.9rem' }}>
              {[
                { nap: 'Hetfo - Pentek', ora: '9:00 - 18:00', active: true },
                { nap: 'Szombat', ora: '9:00 - 14:00', active: true },
                { nap: 'Vasarnap', ora: 'Zarva', active: false },
              ].map(({ nap, ora, active }) => (
                <div key={nap} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', borderRadius: 8, background: active ? 'rgba(16,185,129,0.06)' : 'rgba(239,68,68,0.06)' }}>
                  <span style={{ fontWeight: 600 }}>{nap}</span>
                  <span style={{ fontWeight: 700, color: active ? '#10b981' : '#ef4444' }}>{ora}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="ui-card" style={{ padding: 0, overflow: 'hidden', borderRadius: 16, height: 200 }}>
            <iframe
              title="Terkep"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2695.5!2d19.04!3d47.49!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sBudapest!5e0!3m2!1shu!2shu!4v1"
              width="100%" height="200" style={{ border: 0 }} allowFullScreen loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        {/* Jobb oldal - uzenetkuldos form */}
        <div className="ui-card" style={{ padding: 0, overflow: 'hidden' }}>
          {/* Header */}
          <div style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', padding: '24px 28px', color: '#fff' }}>
            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>Irj nekunk!</h3>
            <p style={{ margin: '6px 0 0', fontSize: '0.85rem', opacity: 0.85 }}>Kerdesed van? Szivesen segitunk!</p>
          </div>

          <div style={{ padding: '24px 28px' }}>
            {/* Statusz uzenetek */}
            {status === 'success' && (
              <div style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(5,150,105,0.1))', color: '#059669', padding: '16px 20px', borderRadius: 12, marginBottom: 20, fontWeight: 700, textAlign: 'center', border: '1px solid rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                Uzenet sikeresen elkuldve! Hamarosan valaszolunk.
              </div>
            )}
            {status === 'error' && (
              <div style={{ background: 'rgba(239,68,68,0.08)', color: '#dc2626', padding: '16px 20px', borderRadius: 12, marginBottom: 20, fontWeight: 600, textAlign: 'center', border: '1px solid rgba(239,68,68,0.2)' }}>
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={labelStyle}>Nev *</label>
                  <input value={form.nev} onChange={e => setForm(p => ({ ...p, nev: e.target.value }))} required placeholder="Teljes nev" style={inputStyle} onFocus={e => e.target.style.borderColor = '#6366f1'} onBlur={e => e.target.style.borderColor = 'rgba(0,0,0,0.08)'} />
                </div>
                <div>
                  <label style={labelStyle}>Email *</label>
                  <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required placeholder="pelda@email.com" style={inputStyle} onFocus={e => e.target.style.borderColor = '#6366f1'} onBlur={e => e.target.style.borderColor = 'rgba(0,0,0,0.08)'} />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Targy</label>
                <input value={form.targy} onChange={e => setForm(p => ({ ...p, targy: e.target.value }))} placeholder="Miben segithetunk?" style={inputStyle} onFocus={e => e.target.style.borderColor = '#6366f1'} onBlur={e => e.target.style.borderColor = 'rgba(0,0,0,0.08)'} />
              </div>

              <div>
                <label style={labelStyle}>Uzenet *</label>
                <textarea value={form.uzenet} onChange={e => setForm(p => ({ ...p, uzenet: e.target.value }))} required rows={5} placeholder="Ird le az uzeneted reszletesen..." style={{ ...inputStyle, resize: 'vertical', minHeight: 120 }} onFocus={e => e.target.style.borderColor = '#6366f1'} onBlur={e => e.target.style.borderColor = 'rgba(0,0,0,0.08)'} />
              </div>

              <button
                type="submit"
                disabled={status === 'sending'}
                style={{
                  width: '100%', padding: 16, borderRadius: 14, border: 'none', cursor: status === 'sending' ? 'not-allowed' : 'pointer',
                  fontWeight: 800, fontSize: '1.05rem', color: '#fff', letterSpacing: '0.02em',
                  background: status === 'sending' ? '#94a3b8' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  boxShadow: status === 'sending' ? 'none' : '0 4px 16px rgba(99,102,241,0.3)',
                  transition: 'all 200ms', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}
              >
                {status === 'sending' ? (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" style={{ animation: 'spin 1s linear infinite' }}><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
                    Kuldes...
                  </>
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                    Uzenet kuldese
                  </>
                )}
              </button>
            </form>

            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Contact;