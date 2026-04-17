import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import emailjs from '@emailjs/browser';

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_u97w4rk';
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_mcjlomk';
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost/frobacksql/backend/api';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [kod, setKod] = useState('');
  const [ujJelszo, setUjJelszo] = useState('');
  const [ujJelszoUjra, setUjJelszoUjra] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRequestCode = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(''); setLoading(true);
    try {
      const response = await fetch(`${API_URL}/password-reset.php/request`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      if (data.success && data.kod) {
        if (!EMAILJS_PUBLIC_KEY) {
          setError('Hiányzik a Public Key. Add meg a VITE_EMAILJS_PUBLIC_KEY értéket a .env fájlban.');
          return;
        }

        try {
          await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
            email, jelszo: data.kod, time: new Date(data.lejar).toLocaleString('hu-HU')
          }, EMAILJS_PUBLIC_KEY);
          setSuccess('A kodot elkuldtuk az email cimedre!');
          setStep(2);
        } catch {
          setError('Email kuldesi hiba. Ellenorizd az EmailJS beallitasokat.');
        }
      } else {
        setError(data.message || 'Hiba tortent');
      }
    } catch { setError('Szerver hiba'); }
    finally { setLoading(false); }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const response = await fetch(`${API_URL}/password-reset.php/verify`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, kod })
      });
      const data = await response.json();
      if (data.valid) { setSuccess('Kod ervenyes!'); setStep(3); }
      else { setError(data.message || 'Ervenytelen kod'); }
    } catch { setError('Szerver hiba'); }
    finally { setLoading(false); }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (ujJelszo !== ujJelszoUjra) { setError('A ket jelszo nem egyezik'); return; }
    setError(''); setLoading(true);
    try {
      const response = await fetch(`${API_URL}/password-reset.php/reset`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, kod, uj_jelszo: ujJelszo })
      });
      const data = await response.json();
      if (data.success) { setSuccess('Jelszo sikeresen megvaltoztatva!'); setTimeout(() => navigate('/auth'), 2000); }
      else { setError(data.message || 'Hiba tortent'); }
    } catch { setError('Szerver hiba'); }
    finally { setLoading(false); }
  };

  return (
    <main className="container page">
      <h1 className="page-title">Elfelejtett jelszo</h1>
      <section className="ui-card centered-card">
        {error && <div style={{ color:'#ef4444', padding:12, background:'#fef2f2', borderRadius:8, marginBottom:12 }}>{error}</div>}
        {success && <div style={{ color:'#22c55e', padding:12, background:'#f0fdf4', borderRadius:8, marginBottom:12 }}>{success}</div>}

        {step === 1 && !EMAILJS_PUBLIC_KEY && (
          <div style={{ color:'#92400e', padding:12, background:'#fffbeb', borderRadius:8, marginBottom:12, fontSize:'0.9rem' }}>
            A jelszo-visszaallitashoz add meg a .env-ben: VITE_EMAILJS_PUBLIC_KEY.
          </div>
        )}

        {step === 1 && (
          <form onSubmit={handleRequestCode} className="form-grid">
            <div className="form-field"><label>Email cim</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
            <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Kuldes...' : 'Kod kerese'}</button>
          </form>
        )}
        {step === 2 && (
          <form onSubmit={handleVerifyCode} className="form-grid">
            <div className="form-field"><label>Kod (6 szamjegy)</label><input value={kod} onChange={(e) => setKod(e.target.value)} maxLength={6} required /></div>
            <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Ellenorzes...' : 'Kod ellenorzese'}</button>
          </form>
        )}
        {step === 3 && (
          <form onSubmit={handleResetPassword} className="form-grid">
            <div className="form-field"><label>Uj jelszo</label><input type="password" value={ujJelszo} onChange={(e) => setUjJelszo(e.target.value)} required minLength={6} /></div>
            <div className="form-field"><label>Uj jelszo ujra</label><input type="password" value={ujJelszoUjra} onChange={(e) => setUjJelszoUjra(e.target.value)} required /></div>
            <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Mentes...' : 'Jelszo megvaltoztatasa'}</button>
          </form>
        )}
        <p style={{ marginTop: 16, textAlign: 'center' }}><Link to="/auth">Vissza a bejelentkezeshez</Link></p>
      </section>
    </main>
  );
};

export default ForgotPassword;
