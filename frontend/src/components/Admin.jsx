import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { isAllowedAdminUser, adminUsersAPI } from '../api/apiService';

const StatCard = ({ label, value, sub, color }) => (
  <div className="ui-card" style={{ textAlign: 'center', borderTop: `4px solid ${color}`, padding: '20px 16px' }}>
    <div style={{ fontSize: '2rem', fontWeight: 800, color }}>{value ?? '-'}</div>
    <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-text)', marginTop: 4 }}>{label}</div>
    {sub && <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: 4 }}>{sub}</div>}
  </div>
);

const AdminCard = ({ to, title, desc, color }) => (
  <Link to={to} style={{ textDecoration: 'none' }}>
    <div className="ui-card" style={{ textAlign: 'center', cursor: 'pointer', transition: 'all 300ms ease', borderTop: `4px solid ${color}` }}>
      <h2 style={{ margin: '0 0 8px', fontSize: '1.3rem', color: 'var(--color-text)' }}>{title}</h2>
      <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>{desc}</p>
    </div>
  </Link>
);

const statusLabels = { uj: 'Uj', feldolgozas: 'Feldolgozas', kesz: 'Kesz', storno: 'Storno' };
const statusColors = { uj: '#3b82f6', feldolgozas: '#f59e0b', kesz: '#22c55e', storno: '#ef4444' };

const Admin = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const isAdmin = isAllowedAdminUser(user);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { if (!isAuthenticated) navigate('/auth'); }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (isAdmin) {
      adminUsersAPI.getStats()
        .then(data => setStats(data))
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [isAdmin]);

  if (!isAdmin) return (
    <main className="admin-page container page">
      <section className="ui-card" style={{ textAlign: 'center', padding: 48 }}>
        <p style={{ fontSize: '1.1rem', color: 'var(--color-text-secondary)' }}>Nincs admin jogosultsagod.</p>
      </section>
    </main>
  );

  return (
    <main className="admin-page container page">
      {loading ? (
        <p style={{ textAlign: 'center', color: 'var(--color-text-secondary)', padding: 40 }}>Statisztikak betoltese...</p>
      ) : stats ? (
        <>
          {/* Summary stats */}
          <h2 className="admin-section-title">Attekintes</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16, marginBottom: 28 }}>
            <StatCard label="Felhasznalok" value={stats.users?.total} sub={stats.users?.banned > 0 ? `${stats.users.banned} kitiltva` : null} color="var(--primary)" />
            <StatCard label="Termekek" value={stats.products?.total} sub={`${stats.products?.active || 0} aktiv`} color="var(--secondary)" />
            <StatCard label="Rendelesek" value={stats.orders?.total} sub={stats.orders?.new_orders > 0 ? `${stats.orders.new_orders} uj` : null} color="var(--accent)" />
            <StatCard label="Bevetel" value={`${Number(stats.orders?.revenue || 0).toLocaleString('hu-HU')} Ft`} color="#22c55e" />
            <StatCard label="Velemenyek" value={stats.reviews?.total} sub={`Atlag: ${Number(stats.reviews?.avg_rating || 0).toFixed(1)} / 5`} color="#f59e0b" />
            <StatCard label="Kuponok" value={stats.coupons?.total} sub={`${stats.coupons?.active || 0} aktiv`} color="#8b5cf6" />
          </div>

          {/* Order status + stock alerts */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 400px), 1fr))', gap: 20, marginBottom: 28 }}>
            {/* Order status breakdown */}
            <div className="ui-card">
              <h3 style={{ margin: '0 0 16px', fontSize: '1.05rem' }}>Rendeles statuszok</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {Object.entries(statusLabels).map(([key, label]) => {
                  const count = Number(stats.orders?.[key === 'uj' ? 'new_orders' : key === 'feldolgozas' ? 'processing' : key] || 0);
                  const total = Number(stats.orders?.total || 1);
                  const pct = total > 0 ? (count / total * 100) : 0;
                  return (
                    <div key={key}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: 4 }}>
                        <span style={{ fontWeight: 600 }}>{label}</span>
                        <span style={{ color: 'var(--color-text-secondary)' }}>{count} ({pct.toFixed(0)}%)</span>
                      </div>
                      <div style={{ height: 8, background: '#e2e8f0', borderRadius: 4, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${pct}%`, background: statusColors[key], borderRadius: 4, transition: 'width 500ms ease' }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Stock alerts */}
            <div className="ui-card">
              <h3 style={{ margin: '0 0 16px', fontSize: '1.05rem' }}>Keszlet figyelmeztetes</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: '#fef2f2', borderRadius: 8 }}>
                  <span style={{ fontWeight: 600, color: '#991b1b' }}>Elfogyott (0 db)</span>
                  <span style={{ fontWeight: 800, fontSize: '1.2rem', color: '#ef4444' }}>{stats.products?.out_of_stock || 0}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: '#fffbeb', borderRadius: 8 }}>
                  <span style={{ fontWeight: 600, color: '#92400e' }}>Alacsony (1-5 db)</span>
                  <span style={{ fontWeight: 800, fontSize: '1.2rem', color: '#f59e0b' }}>{stats.products?.low_stock || 0}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: '#f0fdf4', borderRadius: 8 }}>
                  <span style={{ fontWeight: 600, color: '#166534' }}>Aktiv termekek</span>
                  <span style={{ fontWeight: 800, fontSize: '1.2rem', color: '#22c55e' }}>{stats.products?.active || 0}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Top products + recent orders side by side */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 400px), 1fr))', gap: 20, marginBottom: 28 }}>
            {/* Top products */}
            {stats.top_products?.length > 0 && (
              <div className="ui-card">
                <h3 style={{ margin: '0 0 16px', fontSize: '1.05rem' }}>Top 5 termek (eladva)</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {stats.top_products.map((p, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: i === 0 ? 'rgba(59,130,246,0.06)' : 'transparent', borderRadius: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontWeight: 800, color: i === 0 ? 'var(--primary)' : 'var(--color-text-secondary)', fontSize: '1.1rem', minWidth: 24 }}>#{i + 1}</span>
                        <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{p.nev}</span>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{p.total_sold} db</div>
                        <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.75rem' }}>{Number(p.total_revenue).toLocaleString('hu-HU')} Ft</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent orders */}
            {stats.recent_orders?.length > 0 && (
              <div className="ui-card">
                <h3 style={{ margin: '0 0 16px', fontSize: '1.05rem' }}>Legutabbi rendelesek</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {stats.recent_orders.map(o => (
                    <div key={o.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{o.rendeles_szam}</div>
                        <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.8rem' }}>{o.felhasznalonev || 'Torolt user'} - {new Date(o.rendeles_datum).toLocaleDateString('hu-HU')}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{Number(o.vegosszeg).toLocaleString('hu-HU')} Ft</div>
                        <span className="badge" style={{ background: statusColors[o.statusz] || '#94a3b8', color: '#fff', fontSize: '0.7rem' }}>
                          {statusLabels[o.statusz] || o.statusz}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <Link to="/admin/orders" style={{ display: 'block', textAlign: 'center', marginTop: 12, fontSize: '0.85rem', color: 'var(--primary)' }}>Osszes rendeles &rarr;</Link>
              </div>
            )}
          </div>
        </>
      ) : null}

      {/* Quick actions */}
      <h2 className="admin-section-title">Gyors muveletek</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20, maxWidth: 900, margin: '0 auto' }}>
        <AdminCard to="/admin/products" title="Termekek" desc="Termekek hozzaadasa, szerkesztese, torlese" color="var(--primary)" />
        <AdminCard to="/admin/users" title="Felhasznalok" desc="Felhasznalok kezelese, torles, tiltas" color="var(--secondary)" />
        <AdminCard to="/admin/coupons" title="Kuponok" desc="Kuponok kezelese, felhasznalokhoz rendeles" color="var(--accent)" />
        <AdminCard to="/admin/orders" title="Rendelesek" desc="Rendelesek attekintese, statusz frissites" color="#22c55e" />
      </div>
    </main>
  );
};

export default Admin;
