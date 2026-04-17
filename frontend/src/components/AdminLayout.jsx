import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { isAllowedAdminUser } from '../api/apiService';

const AdminLayout = ({ children }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = isAllowedAdminUser(user);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!isAuthenticated) {
    return (
      <main className="container page" style={{ textAlign: 'center', padding: '80px 24px' }}>
        <h1 className="page-title">Bejelentkezes szukseges</h1>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: 24 }}>Jelentkezz be az admin panel elerese erdekeben.</p>
        <Link to="/auth" className="btn-primary" style={{ display: 'inline-block', padding: '12px 32px', textDecoration: 'none' }}>Bejelentkezes</Link>
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="container page" style={{ textAlign: 'center', padding: '80px 24px' }}>
        <h1 className="page-title">Hozzaferes megtagadva</h1>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: 24 }}>Nincs admin jogosultsagod ehhez az oldalhoz.</p>
        <Link to="/" className="btn-primary" style={{ display: 'inline-block', padding: '12px 32px', textDecoration: 'none' }}>Kezdolap</Link>
      </main>
    );
  }

  const navItems = [
    { path: '/admin', label: 'Attekintes', icon: '📊' },
    { path: '/admin/products', label: 'Termekek', icon: '📦' },
    { path: '/admin/users', label: 'Felhasznalok', icon: '👥' },
    { path: '/admin/orders', label: 'Rendelesek', icon: '🛒' },
    { path: '/admin/coupons', label: 'Kuponok', icon: '🎫' },
    { path: '/admin/categories', label: 'Kategoriak', icon: '📂' },
  ];

  const pageTitleMap = {
    '/admin': 'Admin attekintes',
    '/admin/products': 'Termek kezeles',
    '/admin/users': 'Felhasznalo kezeles',
    '/admin/orders': 'Rendeles kezeles',
    '/admin/coupons': 'Kupon kezeles',
    '/admin/categories': 'Kategoria kezeles',
  };

  const isActive = (path) => location.pathname === path;
  const currentTitle = pageTitleMap[location.pathname] || 'Admin panel';

  return (
    <div className="admin-layout">
      {sidebarOpen && <div className="admin-sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-header">
          <div className="admin-sidebar-brand">
            <span className="admin-sidebar-icon">⚙️</span>
            <span>Admin Panel</span>
          </div>
          <div className="admin-sidebar-user">
            <span className="admin-sidebar-username">{user?.felhasznalonev}</span>
            <span className="admin-sidebar-email">{user?.email}</span>
          </div>
        </div>

        <nav className="admin-sidebar-nav">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`admin-sidebar-link ${isActive(item.path) ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <span className="admin-sidebar-link-icon">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <Link to="/" className="admin-sidebar-link admin-sidebar-back" onClick={() => setSidebarOpen(false)}>
            <span className="admin-sidebar-link-icon">←</span>
            <span>Vissza a boltba</span>
          </Link>
          <button onClick={() => { logout(); navigate('/'); }} className="admin-sidebar-link admin-sidebar-logout">
            <span className="admin-sidebar-link-icon">🚪</span>
            <span>Kijelentkezes</span>
          </button>
        </div>
      </aside>

      <div className="admin-content">
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <button className="admin-sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Admin menu">
              {sidebarOpen ? (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
              ) : (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
              )}
            </button>
            <div className="admin-topbar-title-wrap">
              <p className="admin-topbar-label">Kezeloi felulet</p>
              <h1 className="admin-topbar-title">{currentTitle}</h1>
            </div>
          </div>
          <div className="admin-topbar-actions">
            <Link to="/" className="admin-topbar-link">Bolt nezete</Link>
            <button onClick={() => { logout(); navigate('/'); }} className="admin-topbar-logout">Kijelentkezes</button>
          </div>
        </header>

        <main className="admin-content-main">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
