import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { couponsAPI, adminUsersAPI, isAllowedAdminUser } from '../api/apiService';

const AdminCoupons = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ kod: '', tipus: 'szazalek', ertek: '', min_osszeg: 0, felhasznalasi_limit: '', ervenyes_veg: '', aktiv: 1, felhasznalo_id: '' });
  const [userSearch, setUserSearch] = useState('');
  const [userResults, setUserResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !isAllowedAdminUser(user)) { navigate('/admin'); return; }
    loadCoupons();
  }, [isAuthenticated, user, navigate]);

  const loadCoupons = async () => {
    try { const data = await couponsAPI.getAll(); setCoupons(Array.isArray(data) ? data : []); }
    catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const handleUserSearch = async (q) => {
    setUserSearch(q);
    if (q.trim().length < 2) { setUserResults([]); return; }
    setSearching(true);
    try {
      const data = await adminUsersAPI.searchUsers(q.trim());
      setUserResults(Array.isArray(data) ? data : []);
    } catch { setUserResults([]); }
    finally { setSearching(false); }
  };

  const selectUser = (u) => {
    setSelectedUser(u);
    setForm(p => ({ ...p, felhasznalo_id: u.id }));
    setUserSearch('');
    setUserResults([]);
  };

  const clearSelectedUser = () => {
    setSelectedUser(null);
    setForm(p => ({ ...p, felhasznalo_id: '' }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await couponsAPI.create(form);
      setForm({ kod: '', tipus: 'szazalek', ertek: '', min_osszeg: 0, felhasznalasi_limit: '', ervenyes_veg: '', aktiv: 1, felhasznalo_id: '' });
      setSelectedUser(null);
      loadCoupons();
    } catch (err) { setError(err.message); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Biztosan torlod?')) return;
    try { await couponsAPI.delete(id); loadCoupons(); }
    catch (err) { setError(err.message); }
  };

  return (
    <main className="admin-page container page">
      <h1 className="page-title">Admin - Kuponok</h1>
      {error && <div style={{ color: 'var(--danger)', marginBottom: 16, padding: '12px 16px', background: 'var(--danger-light)', borderRadius: 10, fontWeight: 600, fontSize: '0.9rem', textAlign: 'center' }}>{error}</div>}

      <section className="ui-card" style={{ marginBottom: 24 }}>
        <h3 style={{ margin: '0 0 16px', fontSize: '1.1rem' }}>Uj kupon</h3>
        <form onSubmit={handleCreate} className="form-grid-2">
          <div className="form-field"><label>Kod</label><input value={form.kod} onChange={(e) => setForm(p => ({ ...p, kod: e.target.value }))} required placeholder="pl. NYAR2026" /></div>
          <div className="form-field"><label>Tipus</label>
            <select value={form.tipus} onChange={(e) => setForm(p => ({ ...p, tipus: e.target.value }))}>
              <option value="szazalek">Szazalek</option>
              <option value="fix">Fix osszeg</option>
            </select>
          </div>
          <div className="form-field"><label>Ertek</label><input type="number" value={form.ertek} onChange={(e) => setForm(p => ({ ...p, ertek: e.target.value }))} required /></div>
          <div className="form-field"><label>Min. osszeg</label><input type="number" value={form.min_osszeg} onChange={(e) => setForm(p => ({ ...p, min_osszeg: e.target.value }))} /></div>
          <div className="form-field"><label>Felhasznalasi limit</label><input type="number" value={form.felhasznalasi_limit} onChange={(e) => setForm(p => ({ ...p, felhasznalasi_limit: e.target.value }))} /></div>
          <div className="form-field"><label>Ervenyes veg</label><input type="datetime-local" value={form.ervenyes_veg} onChange={(e) => setForm(p => ({ ...p, ervenyes_veg: e.target.value }))} /></div>

          <div className="form-field" style={{ gridColumn: '1 / -1' }}>
            <label>Felhasznalo hozzarendelese (opcionalis)</label>
            {selectedUser ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: '#dbeafe', borderRadius: 8 }}>
                <span style={{ fontWeight: 600 }}>{selectedUser.felhasznalonev}</span>
                <span style={{ color: '#64748b', fontSize: '0.85rem' }}>({selectedUser.email})</span>
                <span style={{ color: '#64748b', fontSize: '0.85rem' }}>ID: {selectedUser.id}</span>
                <button type="button" onClick={clearSelectedUser} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontWeight: 700, fontSize: '1.1rem' }}>X</button>
              </div>
            ) : (
              <div style={{ position: 'relative' }}>
                <input
                  value={userSearch}
                  onChange={(e) => handleUserSearch(e.target.value)}
                  placeholder="Keress email, felhasznalonev vagy ID alapjan..."
                />
                {searching && <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, padding: 8, background: '#fff', border: '1px solid #d1d5db', borderRadius: '0 0 8px 8px', color: '#64748b', fontSize: '0.85rem' }}>Kereses...</div>}
                {userResults.length > 0 && (
                  <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff', border: '1px solid #d1d5db', borderRadius: '0 0 8px 8px', maxHeight: 200, overflowY: 'auto', zIndex: 10, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                    {userResults.map(u => (
                      <div
                        key={u.id}
                        onClick={() => selectUser(u)}
                        style={{ padding: '8px 12px', cursor: 'pointer', borderBottom: '1px solid #f1f5f9', display: 'flex', gap: 8, alignItems: 'center' }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#f0f9ff'}
                        onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
                      >
                        <strong>{u.felhasznalonev}</strong>
                        <span style={{ color: '#64748b', fontSize: '0.85rem' }}>{u.email}</span>
                        <span style={{ marginLeft: 'auto', color: '#94a3b8', fontSize: '0.8rem' }}>ID: {u.id}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: 4, display: 'block' }}>Ha ures, a kupon mindenkinek szol. Ha kivalasztasz valakit, csak o hasznalhatja.</span>
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <button type="submit" className="btn-primary">Letrehozas</button>
          </div>
        </form>
      </section>

      {loading ? <p style={{ textAlign: 'center', color: 'var(--color-text-secondary)' }}>Betoltes...</p> : (
        <div style={{ overflowX: 'auto', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-sm)' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Kod</th>
                <th>Tipus</th>
                <th>Ertek</th>
                <th>Felhasznalo</th>
                <th style={{ textAlign: 'center' }}>Aktiv</th>
                <th style={{ textAlign: 'center' }}>Muveletek</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map(c => (
                <tr key={c.id}>
                  <td style={{ fontWeight: 700, fontFamily: 'monospace', letterSpacing: 1 }}>{c.kod}</td>
                  <td>
                    <span className="badge" style={{ background: c.tipus === 'szazalek' ? '#dbeafe' : '#fef3c7', color: c.tipus === 'szazalek' ? '#1d4ed8' : '#92400e' }}>
                      {c.tipus === 'szazalek' ? 'Szazalek' : 'Fix'}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600 }}>{c.tipus === 'szazalek' ? `${c.ertek}%` : `${Number(c.ertek).toLocaleString('hu-HU')} Ft`}</td>
                  <td style={{ fontSize: '0.85rem', color: c.felhasznalo_id ? 'var(--color-text)' : '#94a3b8' }}>
                    {c.felhasznalo_id ? (
                      <span style={{ background: '#dbeafe', padding: '2px 8px', borderRadius: 6, fontWeight: 600 }}>{c.felhasznalo_nev || `ID: ${c.felhasznalo_id}`}</span>
                    ) : 'Mindenki'}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <span className={`badge ${c.aktiv ? 'badge-accent' : ''}`} style={!c.aktiv ? { background: 'var(--color-bg-alt)', color: 'var(--color-muted)' } : {}}>
                      {c.aktiv ? 'Igen' : 'Nem'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button onClick={() => handleDelete(c.id)} className="btn-danger" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>Torles</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
};

export default AdminCoupons;
