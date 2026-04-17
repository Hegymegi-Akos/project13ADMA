import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { adminOrdersAPI, isAllowedAdminUser } from '../api/apiService';

const statusLabels = {
  uj: 'Uj', feldolgozas: 'Feldolgozas alatt', fizetve: 'Fizetve', kesz: 'Kesz', storno: 'Stornozva'
};
const statusColors = {
  uj: '#3b82f6', feldolgozas: '#f59e0b', fizetve: '#10b981', kesz: '#6366f1', storno: '#ef4444'
};

const AdminOrders = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated || !isAllowedAdminUser(user)) { navigate('/admin'); return; }
    loadOrders();
  }, [isAuthenticated, user, navigate]);

  const loadOrders = async () => {
    try { const data = await adminOrdersAPI.getAll(); setOrders(Array.isArray(data) ? data : []); }
    catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const handleStatusChange = async (id, newStatus) => {
    try { await adminOrdersAPI.updateStatus(id, newStatus); loadOrders(); }
    catch (err) { setError(err.message); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Biztosan torlod ezt a rendelest?')) return;
    try { await adminOrdersAPI.delete(id); loadOrders(); }
    catch (err) { setError(err.message); }
  };

  return (
    <main className="admin-page container page">
      <h1 className="admin-page-title">Rendelesek</h1>
      {error && <div className="admin-error">{error}</div>}

      {loading ? <p style={{ textAlign: 'center', color: 'var(--color-text-secondary)' }}>Betoltes...</p> : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Felhasznalo</th>
                <th>Osszeg</th>
                <th>Statusz</th>
                <th>Datum</th>
                <th style={{ textAlign: 'center' }}>Muveletek</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: 32, color: 'var(--color-text-secondary)' }}>Nincsenek rendelesek</td></tr>
              ) : orders.map(o => (
                <tr key={o.id}>
                  <td style={{ fontWeight: 600 }}>#{o.id}</td>
                  <td>{o.felhasznalonev || o.felhasznalo_id}</td>
                  <td style={{ fontWeight: 600, color: 'var(--primary)' }}>{Number(o.vegosszeg || o.osszeg || 0).toLocaleString('hu-HU')} Ft</td>
                  <td>
                    <span className="badge" style={{ background: statusColors[o.statusz] || '#94a3b8', color: '#fff', padding: '4px 10px', fontSize: '0.75rem' }}>
                      {statusLabels[o.statusz] || o.statusz}
                    </span>
                  </td>
                  <td style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>
                    {o.letrehozva ? new Date(o.letrehozva).toLocaleDateString('hu-HU') : '-'}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap' }}>
                      <select
                        value={o.statusz}
                        onChange={(e) => handleStatusChange(o.id, e.target.value)}
                        style={{ padding: '4px 8px', fontSize: '0.8rem', borderRadius: 6, border: '1px solid var(--color-bg-alt)' }}
                      >
                        {Object.entries(statusLabels).map(([k, v]) => (
                          <option key={k} value={k}>{v}</option>
                        ))}
                      </select>
                      <button onClick={() => { const url = adminOrdersAPI.getInvoiceUrl(o.id); const token = localStorage.getItem('token'); window.open(`${url}?token=${encodeURIComponent(token)}&secret=Admin123`, '_blank'); }} className="btn-secondary" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>Szamla</button>
                      <button onClick={() => handleDelete(o.id)} className="btn-danger" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>Torles</button>
                    </div>
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

export default AdminOrders;
