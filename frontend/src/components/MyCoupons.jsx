import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { couponsAPI } from '../api/apiService';
import { useNavigate } from 'react-router-dom';

const MyCoupons = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) { navigate('/auth'); return; }
    const load = async () => {
      try {
        const data = await couponsAPI.getMyCoupons();
        setCoupons(Array.isArray(data) ? data : []);
      } catch { setCoupons([]); }
      finally { setLoading(false); }
    };
    load();
  }, [isAuthenticated, navigate]);

  return (
    <main className="container page">
      <h1 className="page-title">Kuponjaim</h1>
      {loading ? <p>Betoltes...</p> : coupons.length === 0 ? (
        <section className="ui-card"><p>Nincs elerheto kuponod.</p></section>
      ) : (
        <div className="responsive-card-grid">
          {coupons.map(coupon => (
            <section key={coupon.id} className="ui-card">
              <h3 style={{ margin:'0 0 8px', color:'var(--accent-primary)' }}>{coupon.kod}</h3>
              <p>{coupon.tipus === 'szazalek' ? `${coupon.ertek}% kedvezmeny` : `${Number(coupon.ertek).toLocaleString('hu-HU')} Ft kedvezmeny`}</p>
              {coupon.min_osszeg > 0 && <p style={{ fontSize:'0.85rem', color:'var(--text-muted)' }}>Min. rendeles: {Number(coupon.min_osszeg).toLocaleString('hu-HU')} Ft</p>}
              {coupon.ervenyes_veg && <p style={{ fontSize:'0.85rem', color:'var(--text-muted)' }}>Ervenyes: {new Date(coupon.ervenyes_veg).toLocaleDateString('hu-HU')}</p>}
            </section>
          ))}
        </div>
      )}
    </main>
  );
};
export default MyCoupons;
