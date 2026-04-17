import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { adminProductsAPI, categoriesAPI, isAllowedAdminUser, resolveMediaUrl, uploadAPI } from '../api/apiService';

const AdminProducts = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [editProduct, setEditProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [stockFilter, setStockFilter] = useState('all');
  const [uploading, setUploading] = useState(false);
  const [togglingProductId, setTogglingProductId] = useState(null);
  const [form, setForm] = useState({ nev: '', ar: '', akcios_ar: '', rovid_leiras: '', alkategoria_id: '', fo_kep: '', keszlet: 999, aktiv: 1 });

  useEffect(() => {
    if (!isAuthenticated || !isAllowedAdminUser(user)) { navigate('/admin'); return; }
    loadInitialData();
  }, [isAuthenticated, user, navigate]);

  const loadInitialData = async () => {
    try {
      const [productsData, categoriesData] = await Promise.all([
        adminProductsAPI.getAll(),
        categoriesAPI.getAll()
      ]);

      let normalizedCategories = Array.isArray(categoriesData) ? categoriesData : [];
      const hasEmbeddedSubcategories = normalizedCategories.every((c) => Array.isArray(c.alkategoriak));
      if (!hasEmbeddedSubcategories) {
        normalizedCategories = await Promise.all(
          normalizedCategories.map(async (c) => ({
            ...c,
            alkategoriak: await categoriesAPI.getSubcategories(c.id)
          }))
        );
      }

      setProducts(Array.isArray(productsData) ? productsData : []);
      setCategories(normalizedCategories);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    try { const data = await adminProductsAPI.getAll(); setProducts(Array.isArray(data) ? data : []); }
    catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const resetForm = () => {
    setEditProduct(null);
    setSelectedCategoryId('');
    setForm({ nev: '', ar: '', akcios_ar: '', rovid_leiras: '', alkategoria_id: '', fo_kep: '', keszlet: 999, aktiv: 1 });
  };

  const handleImageUpload = async (file) => {
    if (!file) return;
    setInfo('');
    setError('');
    setUploading(true);
    try {
      const data = await uploadAPI.uploadImage(file);
      const uploadedUrl = data.absolute_url || resolveMediaUrl(data.url);
      setForm((prev) => ({ ...prev, fo_kep: uploadedUrl }));
      setInfo('Kep feltoltve es beallitva a termekhez.');
    } catch (err) {
      setError(err.message || 'Kep feltoltes sikertelen');
    } finally {
      setUploading(false);
    }
  };

  const getSubcategories = () => {
    if (!selectedCategoryId) return [];
    const category = categories.find((c) => Number(c.id) === Number(selectedCategoryId));
    return category?.alkategoriak || [];
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.alkategoria_id) {
      setError('Kerlek valassz alkategoriat.');
      return;
    }
    try {
      if (editProduct) { await adminProductsAPI.update(editProduct.id, form); }
      else { await adminProductsAPI.create(form); }
      setInfo(editProduct ? 'Termek frissitve.' : 'Termek letrehozva.');
      resetForm();
      loadProducts();
    } catch (err) { setError(err.message); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Biztosan torlod?')) return;
    try { await adminProductsAPI.delete(id); loadProducts(); }
    catch (err) { setError(err.message); }
  };

  const toggleActive = async (product) => {
    setError('');
    setInfo('');
    setTogglingProductId(product.id);
    try {
      await adminProductsAPI.update(product.id, {
        ...product,
        aktiv: Number(product.aktiv) === 1 ? 0 : 1
      });
      setInfo(Number(product.aktiv) === 1 ? 'Termek inaktivalva.' : 'Termek aktivalva.');
      await loadProducts();
    } catch (err) {
      setError(err.message || 'Statusz valtas sikertelen');
    } finally {
      setTogglingProductId(null);
    }
  };

  const startEdit = (product) => {
    const ownerCategory = categories.find((c) => (c.alkategoriak || []).some((a) => Number(a.id) === Number(product.alkategoria_id)));
    setEditProduct(product);
    setSelectedCategoryId(ownerCategory ? String(ownerCategory.id) : '');
    setForm({ nev: product.nev, ar: product.ar, akcios_ar: product.akcios_ar || '', rovid_leiras: product.rovid_leiras || '', alkategoria_id: product.alkategoria_id, fo_kep: product.fo_kep, keszlet: product.keszlet, aktiv: product.aktiv });
  };

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredProducts = products.filter((p) => {
    const matchesSearch = normalizedSearch === ''
      || (p.nev || '').toLowerCase().includes(normalizedSearch)
      || String(p.id).includes(normalizedSearch);

    const stockValue = Number(p.keszlet || 0);
    const matchesStock = stockFilter === 'all'
      || (stockFilter === 'low' && stockValue > 0 && stockValue <= 5)
      || (stockFilter === 'out' && stockValue === 0);

    return matchesSearch && matchesStock;
  });

  return (
    <main className="admin-page container page">
      <h1 className="page-title">Admin - Termekek</h1>
      {error && <div style={{ color: 'var(--danger)', marginBottom: 16, padding: '12px 16px', background: 'var(--danger-light)', borderRadius: 10, fontWeight: 600, fontSize: '0.9rem', textAlign: 'center' }}>{error}</div>}
      {info && <div style={{ color: '#166534', marginBottom: 16, padding: '12px 16px', background: '#dcfce7', borderRadius: 10, fontWeight: 600, fontSize: '0.9rem', textAlign: 'center' }}>{info}</div>}

      <section className="ui-card" style={{ marginBottom: 24 }}>
        <h3 style={{ margin: '0 0 16px', fontSize: '1.1rem' }}>{editProduct ? 'Termek szerkesztese' : 'Uj termek'}</h3>
        <form onSubmit={handleSave} className="form-grid-2">
          <div className="form-field"><label>Nev</label><input value={form.nev} onChange={(e) => setForm(p => ({ ...p, nev: e.target.value }))} required /></div>
          <div className="form-field"><label>Ar (Ft)</label><input type="number" value={form.ar} onChange={(e) => setForm(p => ({ ...p, ar: e.target.value }))} required /></div>
          <div className="form-field"><label>Akcios ar (Ft)</label><input type="number" value={form.akcios_ar} onChange={(e) => setForm(p => ({ ...p, akcios_ar: e.target.value }))} /></div>
          <div className="form-field">
            <label>Kategoria</label>
            <select
              value={selectedCategoryId}
              onChange={(e) => {
                const nextCategory = e.target.value;
                setSelectedCategoryId(nextCategory);
                setForm((p) => ({ ...p, alkategoria_id: '' }));
              }}
              required
            >
              <option value="">Valassz kategoriat</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.nev}</option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label>Alkategoria</label>
            <select
              value={form.alkategoria_id}
              onChange={(e) => setForm((p) => ({ ...p, alkategoria_id: e.target.value }))}
              required
              disabled={!selectedCategoryId}
            >
              <option value="">Valassz alkategoriat</option>
              {getSubcategories().map((sub) => (
                <option key={sub.id} value={sub.id}>{sub.nev}</option>
              ))}
            </select>
          </div>
          <div className="form-field"><label>Fo kep URL</label><input value={form.fo_kep} onChange={(e) => setForm(p => ({ ...p, fo_kep: e.target.value }))} required /></div>
          <div className="form-field">
            <label>Kep feltoltes (fajl)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e.target.files?.[0])}
              disabled={uploading}
            />
            <small style={{ color: 'var(--color-text-secondary)' }}>{uploading ? 'Feltoltes folyamatban...' : 'JPG/PNG/GIF/WEBP, max 5MB'}</small>
          </div>
          <div className="form-field"><label>Keszlet</label><input type="number" value={form.keszlet} onChange={(e) => setForm(p => ({ ...p, keszlet: e.target.value }))} /></div>
          <div className="form-field">
            <label>Aktiv</label>
            <select value={form.aktiv} onChange={(e) => setForm((p) => ({ ...p, aktiv: Number(e.target.value) }))}>
              <option value={1}>Igen</option>
              <option value={0}>Nem</option>
            </select>
          </div>
          <div className="form-field form-span-2"><label>Rovid leiras</label><textarea value={form.rovid_leiras} onChange={(e) => setForm(p => ({ ...p, rovid_leiras: e.target.value }))} rows={3} /></div>
          {form.fo_kep && (
            <div className="form-field form-span-2">
              <label>Elonezet</label>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <img
                  src={resolveMediaUrl(form.fo_kep)}
                  alt="Termek elonezet"
                  style={{ width: 96, height: 96, objectFit: 'cover', borderRadius: 10, border: '1px solid var(--color-bg-alt)' }}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = '/images/kutya.png';
                  }}
                />
                <button type="button" className="btn-secondary" onClick={() => window.open(resolveMediaUrl(form.fo_kep), '_blank')}>Megnyitas uj lapon</button>
              </div>
            </div>
          )}
          <div style={{ display: 'flex', gap: 10, gridColumn: '1 / -1' }}>
            <button type="submit" className="btn-primary">{editProduct ? 'Mentes' : 'Letrehozas'}</button>
            {editProduct && <button type="button" className="btn-secondary" onClick={resetForm}>Megse</button>}
          </div>
        </form>
      </section>

      <section className="ui-card" style={{ marginBottom: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px', gap: 12 }}>
          <div className="form-field">
            <label>Kereses</label>
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Termek nev vagy ID"
            />
          </div>
          <div className="form-field">
            <label>Keszlet szuro</label>
            <select value={stockFilter} onChange={(e) => setStockFilter(e.target.value)}>
              <option value="all">Mind</option>
              <option value="low">Alacsony keszlet (1-5)</option>
              <option value="out">Elfogyott (0)</option>
            </select>
          </div>
        </div>
      </section>

      {loading ? <p style={{ textAlign: 'center', color: 'var(--color-text-secondary)' }}>Betoltes...</p> : (
        <div style={{ overflowX: 'auto', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-sm)' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Kep</th>
                <th>Nev</th>
                <th>Ar</th>
                <th>Keszlet</th>
                <th>Aktiv</th>
                <th style={{ textAlign: 'center' }}>Muveletek</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(p => (
                <tr key={p.id}>
                  <td style={{ fontWeight: 600 }}>{p.id}</td>
                  <td>
                    <img
                      src={resolveMediaUrl(p.fo_kep)}
                      alt={p.nev}
                      style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 8, border: '1px solid var(--color-bg-alt)' }}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/images/kutya.png';
                      }}
                    />
                  </td>
                  <td>{p.nev}</td>
                  <td style={{ fontWeight: 600, color: 'var(--primary)' }}>{Number(p.ar).toLocaleString('hu-HU')} Ft</td>
                  <td style={Number(p.keszlet) <= 5 ? { color: 'var(--danger)', fontWeight: 700 } : {}}>{p.keszlet}</td>
                  <td>
                    <span className="badge" style={Number(p.aktiv) === 1 ? { background: '#dcfce7', color: '#166534' } : { background: '#fee2e2', color: '#991b1b' }}>
                      {Number(p.aktiv) === 1 ? 'Aktiv' : 'Inaktiv'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                      <button onClick={() => startEdit(p)} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>Szerk</button>
                      <button onClick={() => toggleActive(p)} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }} disabled={togglingProductId === p.id}>
                        {togglingProductId === p.id ? 'Varj...' : Number(p.aktiv) === 1 ? 'Inaktival' : 'Aktival'}
                      </button>
                      <button onClick={() => handleDelete(p.id)} className="btn-danger" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>Torles</button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: 24, color: 'var(--color-text-secondary)' }}>
                    Nincs talalat a szurokre.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
};

export default AdminProducts;
