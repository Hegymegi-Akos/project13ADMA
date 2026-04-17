import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { ordersAPI, couponsAPI } from '../api/apiService';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, getTotalPrice } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponMsg, setCouponMsg] = useState('');
  const [orderForm, setOrderForm] = useState({ szallitasi_nev: '', szallitasi_cim: '', szallitasi_varos: '', szallitasi_irsz: '', szallitasi_mod: 'GLS futar', fizetesi_mod: 'Bankkartya', megjegyzes: '' });
  const [orderSuccess, setOrderSuccess] = useState('');
  const [orderError, setOrderError] = useState('');
  const [ordering, setOrdering] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const total = getTotalPrice();
  const finalTotal = Math.max(0, total - couponDiscount);

  const handleApplyCoupon = async () => {
    setCouponMsg('');
    try {
      const data = await couponsAPI.apply(couponCode, total);
      if (data.success) { setCouponDiscount(data.kedvezmeny); setCouponMsg(`Kupon alkalmazva! Kedvezmeny: ${Math.round(data.kedvezmeny)} Ft`); }
      else { setCouponMsg(data.message || 'Ervenytelen kupon'); }
    } catch { setCouponMsg('Hiba a kupon alkalmazasakor'); }
  };

  const handleOrder = async (e) => {
    e.preventDefault();
    setOrderError(''); setOrderSuccess(''); setOrdering(true);
    if (!isAuthenticated) { setOrderError('Bejelentkezes szukseges a rendeleshez'); setOrdering(false); return; }
    try {
      const orderData = {
        ...orderForm, osszeg: finalTotal,
        tetelek: cartItems.map(item => ({ termek_id: item.id, mennyiseg: item.quantity }))
      };
      const data = await ordersAPI.create(orderData);
      if (data.rendeles_id || data.message?.includes('siker')) {
        setOrderSuccess(`Rendeles sikeresen leadva! Rendeleszam: ${data.rendeles_szam || ''}`);
        clearCart(); setCouponDiscount(0);
        setShowSuccess(true);
      } else { setOrderError(data.message || 'Hiba tortent'); }
    } catch (err) { setOrderError(err.message || 'Szerver hiba'); }
    finally { setOrdering(false); }
  };

  // Redirect to home after success
  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => navigate('/'), 4000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess, navigate]);

  // Success screen with animation
  if (showSuccess) return (
    <main className="container page" style={{ textAlign: 'center', paddingTop: 80 }}>
      <div style={{ animation: 'fadeInUp 0.6s ease-out' }}>
        <div style={{
          width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, #10b981, #059669)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px',
          animation: 'scaleIn 0.5s ease-out', boxShadow: '0 8px 32px rgba(16,185,129,0.3)'
        }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#059669', marginBottom: 12 }}>Sikeres rendeles!</h2>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: 8 }}>{orderSuccess}</p>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Atiranyitas a kezdolapra...</p>
        <div style={{ marginTop: 24 }}>
          <button onClick={() => navigate('/')} className="btn-primary" style={{ padding: '12px 32px' }}>
            Vissza a kezdolapra
          </button>
        </div>
      </div>
      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes scaleIn { from { transform: scale(0); } to { transform: scale(1); } }
      `}</style>
    </main>
  );

  if (cartItems.length === 0) return (
    <main className="container page">
      <h1 className="page-title">Kosar</h1>
      <section className="ui-card" style={{ textAlign: 'center', padding: 48 }}>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>A kosarad ures.</p>
      </section>
    </main>
  );

  return (
    <main className="container page">
      <h1 className="page-title">Kosar</h1>
      {orderError && <div style={{ color: '#ef4444', padding: '16px 20px', background: 'rgba(239,68,68,0.1)', borderRadius: 12, marginBottom: 20, fontWeight: 600, textAlign: 'center' }}>{orderError}</div>}

      <section className="ui-card" style={{ marginBottom: 24 }}>
        {cartItems.map((item, i) => (
          <div key={item.id} className="cart-line-item" style={{ borderBottom: i < cartItems.length - 1 ? '1px solid var(--color-bg-alt)' : 'none' }}>
            {item.img && <img src={item.img} alt={item.name} className="cart-line-img" />}
            <div style={{ flex: 1, minWidth: 0 }}>
              <strong className="cart-line-name">{item.name}</strong>
              <div style={{ color: 'var(--accent-primary)', fontWeight: 700, fontSize: '1.1rem', marginTop: 4 }}>{item.price?.toLocaleString('hu-HU')} Ft</div>
            </div>
            <div className="cart-line-actions">
              <input type="number" value={item.quantity} min={1} onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)} className="cart-qty-input" />
              <button onClick={() => removeFromCart(item.id)} className="btn-danger cart-remove-btn">Torles</button>
            </div>
          </div>
        ))}

        <div style={{ marginTop: 20, padding: 16, background: 'linear-gradient(135deg, rgba(99,102,241,0.06), rgba(139,92,246,0.06))', borderRadius: 12, border: '1px dashed rgba(99,102,241,0.3)' }}>
          <p style={{ margin: '0 0 8px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-primary)' }}>🎟️ Van kupon kodod?</p>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input value={couponCode} onChange={(e) => setCouponCode(e.target.value)} placeholder="Ird be a kupon kododat..." style={{ flex: 1, padding: '10px 14px', borderRadius: 10, border: '2px solid rgba(99,102,241,0.2)', fontSize: '0.95rem', fontWeight: 600 }} />
            <button onClick={handleApplyCoupon} style={{ padding: '10px 20px', borderRadius: 10, border: 'none', background: 'var(--accent-primary, #6366f1)', color: '#fff', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>Bevaltas</button>
          </div>
          {couponMsg && <p style={{ marginTop: 8, fontSize: '0.85rem', fontWeight: 600, color: couponDiscount > 0 ? '#059669' : '#ef4444' }}>{couponMsg}</p>}
        </div>

        <div style={{ marginTop: 20, textAlign: 'right', padding: '16px 0 0', borderTop: '2px solid rgba(15,23,42,0.06)' }}>
          {couponDiscount > 0 && <p style={{ color: '#059669', fontWeight: 600 }}>Kedvezmeny: -{Math.round(couponDiscount).toLocaleString('hu-HU')} Ft</p>}
          <p style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--accent-primary)' }}>Vegosszeg: {finalTotal.toLocaleString('hu-HU')} Ft</p>
        </div>
      </section>

      <section className="ui-card">
        <h3 style={{ margin: '0 0 20px', fontSize: '1.2rem' }}>Szallitasi adatok</h3>
        <form onSubmit={handleOrder} className="form-grid">
          <div className="responsive-grid-2-1">
            <div className="form-field"><label>Nev</label><input value={orderForm.szallitasi_nev} onChange={(e) => setOrderForm(prev => ({ ...prev, szallitasi_nev: e.target.value }))} required placeholder="Teljes nev" /></div>
            <div className="form-field"><label>Iranyitoszam</label><input value={orderForm.szallitasi_irsz} onChange={(e) => setOrderForm(prev => ({ ...prev, szallitasi_irsz: e.target.value }))} required placeholder="1234" /></div>
          </div>
          <div className="responsive-grid-2">
            <div className="form-field"><label>Varos</label><input value={orderForm.szallitasi_varos} onChange={(e) => setOrderForm(prev => ({ ...prev, szallitasi_varos: e.target.value }))} required placeholder="Budapest" /></div>
            <div className="form-field"><label>Cim</label><input value={orderForm.szallitasi_cim} onChange={(e) => setOrderForm(prev => ({ ...prev, szallitasi_cim: e.target.value }))} required placeholder="Utca, hazszam" /></div>
          </div>
          <div className="responsive-grid-2">
            <div className="form-field">
              <label>Szallitasi mod</label>
              <select value={orderForm.szallitasi_mod} onChange={(e) => setOrderForm(prev => ({ ...prev, szallitasi_mod: e.target.value }))}>
                <option>GLS futar</option><option>Foxpost</option><option>Szemelyes atvetel</option>
              </select>
            </div>
            <div className="form-field">
              <label>Fizetesi mod</label>
              <select value={orderForm.fizetesi_mod} onChange={(e) => setOrderForm(prev => ({ ...prev, fizetesi_mod: e.target.value }))}>
                <option>Bankkartya</option><option>Utanvet</option><option>Atutalas</option>
              </select>
            </div>
          </div>
          <div className="form-field"><label>Megjegyzes (opcionalis)</label><textarea value={orderForm.megjegyzes} onChange={(e) => setOrderForm(prev => ({ ...prev, megjegyzes: e.target.value }))} rows={3} placeholder="Pl. csengessen ketszer..." /></div>
          <button type="submit" className="btn-primary" disabled={ordering} style={{ width: '100%', padding: 16, fontSize: '1.05rem', borderRadius: 14 }}>
            {ordering ? 'Feldolgozas...' : `Rendeles leadasa - ${finalTotal.toLocaleString('hu-HU')} Ft`}
          </button>
        </form>
      </section>
    </main>
  );
};

export default Cart;