import { useState, useEffect } from 'react';
import { adminCategoriesAPI } from '../api/apiService';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [newCatName, setNewCatName] = useState('');
  const [newCatKep, setNewCatKep] = useState('');

  const [newSubName, setNewSubName] = useState('');
  const [newSubKep, setNewSubKep] = useState('');
  const [newSubCatId, setNewSubCatId] = useState('');

  const [expandedCat, setExpandedCat] = useState(null);
  const [editingSubId, setEditingSubId] = useState(null);
  const [editSubKep, setEditSubKep] = useState('');

  const loadCategories = async () => {
    try {
      const data = await adminCategoriesAPI.getAll();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadCategories(); }, []);

  const showMsg = (msg, isError = false) => {
    if (isError) { setError(msg); setSuccess(''); }
    else { setSuccess(msg); setError(''); }
    setTimeout(() => { setError(''); setSuccess(''); }, 3000);
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    try {
      await adminCategoriesAPI.createCategory({ nev: newCatName.trim(), kep: newCatKep.trim() || null });
      setNewCatName(''); setNewCatKep('');
      showMsg('Kategoria letrehozva!');
      loadCategories();
    } catch (err) { showMsg(err.message, true); }
  };

  const handleCreateSubcategory = async (e) => {
    e.preventDefault();
    if (!newSubName.trim() || !newSubCatId) return;
    try {
      await adminCategoriesAPI.createSubcategory({ nev: newSubName.trim(), kategoria_id: Number(newSubCatId), kep: newSubKep.trim() || null });
      setNewSubName(''); setNewSubKep('');
      showMsg('Alkategoria letrehozva!');
      loadCategories();
    } catch (err) { showMsg(err.message, true); }
  };

  const handleDeleteCategory = async (id, nev) => {
    if (!window.confirm(`Biztosan torlod a "${nev}" kategoriat?`)) return;
    try {
      await adminCategoriesAPI.deleteCategory(id);
      showMsg('Kategoria torolve!');
      loadCategories();
    } catch (err) { showMsg(err.message, true); }
  };

  const handleUpdateSubcategoryKep = async (id) => {
    try {
      await adminCategoriesAPI.updateSubcategory(id, { kep: editSubKep.trim() || null });
      setEditingSubId(null); setEditSubKep('');
      showMsg('Alkategoria kep frissitve!');
      loadCategories();
    } catch (err) { showMsg(err.message, true); }
  };

  const handleDeleteSubcategory = async (id, nev) => {
    if (!window.confirm(`Biztosan torlod a "${nev}" alkategoriat?`)) return;
    try {
      await adminCategoriesAPI.deleteSubcategory(id);
      showMsg('Alkategoria torolve!');
      loadCategories();
    } catch (err) { showMsg(err.message, true); }
  };

  if (loading) return <div className="admin-card" style={{ textAlign: 'center', padding: 40 }}>Betoltes...</div>;

  const inputStyle = { padding: '8px 12px', border: '1px solid var(--color-border, #ddd)', borderRadius: 6, fontSize: '0.9rem', background: 'var(--color-bg, #fff)', color: 'var(--color-text, #333)' };
  const btnStyle = { padding: '8px 18px', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 };
  const btnPrimary = { ...btnStyle, background: '#3b82f6', color: '#fff' };
  const btnDanger = { ...btnStyle, background: '#ef4444', color: '#fff', padding: '4px 12px', fontSize: '0.8rem' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {error && <div style={{ background: '#fef2f2', color: '#dc2626', padding: '12px 16px', borderRadius: 8, border: '1px solid #fecaca' }}>{error}</div>}
      {success && <div style={{ background: '#f0fdf4', color: '#16a34a', padding: '12px 16px', borderRadius: 8, border: '1px solid #bbf7d0' }}>{success}</div>}

      {/* Uj kategoria */}
      <div className="admin-card" style={{ padding: 20 }}>
        <h3 style={{ margin: '0 0 16px', fontSize: '1.1rem' }}>Uj kategoria letrehozasa</h3>
        <form onSubmit={handleCreateCategory} style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'end' }}>
          <div style={{ flex: 1, minWidth: 180 }}>
            <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: 4, color: 'var(--color-text-secondary)' }}>Nev *</label>
            <input value={newCatName} onChange={e => setNewCatName(e.target.value)} placeholder="pl. Kutya" style={{ ...inputStyle, width: '100%' }} required />
          </div>
          <div style={{ flex: 1, minWidth: 180 }}>
            <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: 4, color: 'var(--color-text-secondary)' }}>Kep URL (opcionalis)</label>
            <input value={newCatKep} onChange={e => setNewCatKep(e.target.value)} placeholder="/images/kutya.png" style={{ ...inputStyle, width: '100%' }} />
          </div>
          <button type="submit" style={btnPrimary}>Letrehozas</button>
        </form>
      </div>

      {/* Uj alkategoria */}
      <div className="admin-card" style={{ padding: 20 }}>
        <h3 style={{ margin: '0 0 16px', fontSize: '1.1rem' }}>Uj alkategoria letrehozasa</h3>
        <form onSubmit={handleCreateSubcategory} style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'end' }}>
          <div style={{ minWidth: 160 }}>
            <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: 4, color: 'var(--color-text-secondary)' }}>Kategoria *</label>
            <select value={newSubCatId} onChange={e => setNewSubCatId(e.target.value)} style={{ ...inputStyle, width: '100%' }} required>
              <option value="">Valassz...</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.nev}</option>)}
            </select>
          </div>
          <div style={{ flex: 1, minWidth: 180 }}>
            <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: 4, color: 'var(--color-text-secondary)' }}>Nev *</label>
            <input value={newSubName} onChange={e => setNewSubName(e.target.value)} placeholder="pl. Tapok" style={{ ...inputStyle, width: '100%' }} required />
          </div>
          <div style={{ flex: 1, minWidth: 180 }}>
            <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: 4, color: 'var(--color-text-secondary)' }}>Kep URL (opcionalis)</label>
            <input value={newSubKep} onChange={e => setNewSubKep(e.target.value)} placeholder="/images/tap.png" style={{ ...inputStyle, width: '100%' }} />
          </div>
          <button type="submit" style={btnPrimary}>Letrehozas</button>
        </form>
      </div>

      {/* Kategoria lista */}
      <div className="admin-card" style={{ padding: 20 }}>
        <h3 style={{ margin: '0 0 16px', fontSize: '1.1rem' }}>Kategoriak ({categories.length})</h3>
        {categories.length === 0 ? (
          <p style={{ color: 'var(--color-text-secondary)', textAlign: 'center', padding: 20 }}>Nincsenek kategoriak.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {categories.map(cat => (
              <div key={cat.id} style={{ border: '1px solid var(--color-border, #e5e7eb)', borderRadius: 8, overflow: 'hidden' }}>
                <div
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', cursor: 'pointer', background: expandedCat === cat.id ? 'rgba(59,130,246,0.05)' : 'transparent' }}
                  onClick={() => setExpandedCat(expandedCat === cat.id ? null : cat.id)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: '1.2rem' }}>{expandedCat === cat.id ? '▼' : '▶'}</span>
                    <div>
                      <strong>{cat.nev}</strong>
                      <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', marginLeft: 8 }}>({cat.slug})</span>
                      <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', marginLeft: 8 }}>
                        {cat.alkategoriak?.length || 0} alkategoria
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDeleteCategory(cat.id, cat.nev); }}
                    style={btnDanger}
                    title={cat.alkategoriak?.length > 0 ? 'Elobb torold az alkategoriakat' : 'Torles'}
                  >
                    Torles
                  </button>
                </div>

                {expandedCat === cat.id && (
                  <div style={{ padding: '0 16px 16px', borderTop: '1px solid var(--color-border, #e5e7eb)' }}>
                    {(!cat.alkategoriak || cat.alkategoriak.length === 0) ? (
                      <p style={{ color: 'var(--color-text-secondary)', padding: '12px 0', fontSize: '0.9rem' }}>Nincs alkategoria.</p>
                    ) : (
                      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 8 }}>
                        <thead>
                          <tr style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', textAlign: 'left' }}>
                            <th style={{ padding: '8px 4px' }}>Kep</th>
                            <th style={{ padding: '8px 4px' }}>Nev</th>
                            <th style={{ padding: '8px 4px' }}>Slug</th>
                            <th style={{ padding: '8px 4px', textAlign: 'center' }}>Termekek</th>
                            <th style={{ padding: '8px 4px', textAlign: 'right' }}>Muvelet</th>
                          </tr>
                        </thead>
                        <tbody>
                          {cat.alkategoriak.map(sub => (
                            <tr key={sub.id} style={{ borderTop: '1px solid var(--color-border, #f0f0f0)' }}>
                              <td style={{ padding: '8px 4px', width: 60 }}>
                                {sub.kep ? (
                                  <img src={sub.kep} alt={sub.nev} style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 6 }} />
                                ) : (
                                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Nincs</span>
                                )}
                              </td>
                              <td style={{ padding: '8px 4px', fontSize: '0.9rem' }}>{sub.nev}</td>
                              <td style={{ padding: '8px 4px', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>{sub.slug}</td>
                              <td style={{ padding: '8px 4px', textAlign: 'center', fontSize: '0.85rem' }}>{sub.termek_count || 0}</td>
                              <td style={{ padding: '8px 4px', textAlign: 'right' }}>
                                <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end', alignItems: 'center', flexWrap: 'wrap' }}>
                                  {editingSubId === sub.id ? (
                                    <>
                                      <input
                                        value={editSubKep}
                                        onChange={e => setEditSubKep(e.target.value)}
                                        placeholder="Kep URL"
                                        style={{ ...inputStyle, width: 160, fontSize: '0.8rem', padding: '4px 8px' }}
                                      />
                                      <button onClick={() => handleUpdateSubcategoryKep(sub.id)} style={{ ...btnStyle, background: '#10b981', color: '#fff', padding: '4px 10px', fontSize: '0.8rem' }}>Mentes</button>
                                      <button onClick={() => { setEditingSubId(null); setEditSubKep(''); }} style={{ ...btnStyle, background: '#6b7280', color: '#fff', padding: '4px 10px', fontSize: '0.8rem' }}>Megse</button>
                                    </>
                                  ) : (
                                    <button
                                      onClick={() => { setEditingSubId(sub.id); setEditSubKep(sub.kep || ''); }}
                                      style={{ ...btnStyle, background: '#f59e0b', color: '#fff', padding: '4px 12px', fontSize: '0.8rem' }}
                                    >Kep</button>
                                  )}
                                  <button
                                    onClick={() => handleDeleteSubcategory(sub.id, sub.nev)}
                                    style={btnDanger}
                                    title={Number(sub.termek_count) > 0 ? 'Elobb torold a termekeket' : 'Torles'}
                                  >
                                    Torles
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCategories;