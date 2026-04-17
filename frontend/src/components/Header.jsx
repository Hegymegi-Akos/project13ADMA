import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { useTheme } from '../contexts/ThemeContext';
import { isAllowedAdminUser, productsAPI, resolveMediaUrl } from '../api/apiService';

const Header = () => {
  const { getTotalItems } = useCart();
  const itemCount = getTotalItems();
  const { user, logout, isAuthenticated } = useAuth();
  const { favoritesCount } = useFavorites();
  const { darkMode, toggleDarkMode } = useTheme();
  const isAdmin = isAllowedAdminUser(user);
  const [searchTerm, setSearchTerm] = useState('');
  const [openMenu, setOpenMenu] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setOpenMenu(false);
    setMobileNav(false);
  }, [location.pathname]);

  useEffect(() => {
    const close = (e) => {
      if (!e.target.closest('.user-menu')) setOpenMenu(false);
    };
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileNav ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileNav]);

  // Elo kereses - gepeles kozben talalatok
  useEffect(() => {
    if (searchTerm.trim().length < 2) { setSuggestions([]); setShowSuggestions(false); return; }
    const timer = setTimeout(async () => {
      try {
        const data = await productsAPI.search(searchTerm.trim());
        const results = Array.isArray(data) ? data : (data.products || []);
        setSuggestions(results.slice(0, 5));
        setShowSuggestions(results.length > 0);
      } catch { setSuggestions([]); }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setMobileNav(false);
      setShowSuggestions(false);
    }
  };

  const navTo = (path) => {
    navigate(path);
    setOpenMenu(false);
    setMobileNav(false);
  };

  return (
    <>
      <header className="site-header" role="banner">
        <div className="container header-inner">
          <div className="header-left">
            <h1 className="site-title"><Link to="/">Kisallat webshop</Link></h1>
            <form onSubmit={handleSearch} className="header-search desktop-only" style={{ flex: 1, maxWidth: 400, position: 'relative' }}>
              <input className="search-input" aria-label="Kereses" placeholder="Kereses (tap, poraz...)" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onFocus={() => suggestions.length > 0 && setShowSuggestions(true)} onBlur={() => setTimeout(() => setShowSuggestions(false), 200)} />
              <button type="submit" className="search-btn">Keres</button>
              {showSuggestions && (
                <div style={{ position:'absolute', top:'100%', left:0, right:0, background:'var(--surface-bg, #fff)', borderRadius:'0 0 12px 12px', boxShadow:'0 8px 24px rgba(0,0,0,0.15)', zIndex:100, overflow:'hidden' }}>
                  {suggestions.map(p => (
                    <div key={p.id} onClick={() => { navigate(`/product/${p.id}`); setShowSuggestions(false); setSearchTerm(''); }} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 14px', cursor:'pointer', borderBottom:'1px solid rgba(0,0,0,0.05)', transition:'background 150ms' }} onMouseEnter={e => e.currentTarget.style.background='rgba(59,130,246,0.06)'} onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                      <img src={resolveMediaUrl(p.fo_kep)} alt={p.nev} style={{ width:36, height:36, objectFit:'cover', borderRadius:6 }} onError={e => { e.currentTarget.onerror=null; e.currentTarget.src='/images/kutya.png'; }} />
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontWeight:600, fontSize:'0.85rem', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{p.nev}</div>
                        <div style={{ fontSize:'0.8rem', fontWeight:700, color:'var(--accent-primary)' }}>{(Number(p.akcios_ar) > 0 && Number(p.akcios_ar) < Number(p.ar) ? Number(p.akcios_ar) : Number(p.ar)).toLocaleString('hu-HU')} Ft</div>
                      </div>
                    </div>
                  ))}
                  <div onClick={() => { navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`); setShowSuggestions(false); }} style={{ padding:'10px 14px', textAlign:'center', fontSize:'0.85rem', fontWeight:600, color:'var(--accent-primary)', cursor:'pointer' }}>
                    Osszes talalat megtekintese
                  </div>
                </div>
              )}
            </form>
          </div>

          <nav className="site-nav desktop-only" role="navigation">
            <ul>
              <li><Link className="klink" to="/">Kezdolap</Link></li>
              <li><Link className="klink" to="/about">Rolunk</Link></li>
              <li><Link className="klink" to="/tips">Tippek</Link></li>
              <li><Link className="klink" to="/contact">Kapcsolat</Link></li>
              {!isAuthenticated && (
                <li><Link className="klink auth-btn" to="/auth">Bejelentkezes</Link></li>
              )}
              {isAuthenticated && (
                <li className="user-menu" style={{ position: 'relative' }}>
                  <button onClick={() => setOpenMenu(prev => !prev)} className="user-menu-btn">
                    {isAdmin && <span className="admin-dot" />}
                    {user?.felhasznalonev || 'Fiok'}
                  </button>
                  {openMenu && (
                    <div className="dropdown-menu">
                      <div className="dropdown-header">
                        <p className="dropdown-name">{user?.felhasznalonev}</p>
                        <p className="dropdown-email">{user?.email}</p>
                        {isAdmin && <span className="dropdown-admin-badge">Admin</span>}
                      </div>
                      <div className="dropdown-divider" />
                      {isAdmin && (
                        <>
                          <button onClick={() => navTo('/admin')} className="dropdown-item dropdown-item-admin">Admin panel</button>
                          <button onClick={() => navTo('/admin/products')} className="dropdown-item dropdown-item-admin">Termekek kezelese</button>
                          <button onClick={() => navTo('/admin/users')} className="dropdown-item dropdown-item-admin">Felhasznalok</button>
                          <button onClick={() => navTo('/admin/coupons')} className="dropdown-item dropdown-item-admin">Kuponok kezelese</button>
                          <div className="dropdown-divider" />
                        </>
                      )}
                      <button onClick={() => navTo('/messages')} className="dropdown-item">Uzeneteim</button>
                      <button onClick={() => navTo('/orders')} className="dropdown-item">Rendeleseim</button>
                      <button onClick={() => navTo('/coupons')} className="dropdown-item">Kuponjaim</button>
                      <button onClick={() => navTo('/wall')} className="dropdown-item">Fal & Velemenyek</button>
                      <div className="dropdown-divider" />
                      <button onClick={() => { logout(); navTo('/'); }} className="dropdown-item dropdown-item-danger">Kijelentkezes</button>
                    </div>
                  )}
                </li>
              )}
              <li>
                <Link className="klink" to="/favorites" style={{ position: 'relative' }}>
                  Kedvencek
                  {favoritesCount > 0 && <span className="badge badge-danger" style={{ position: 'absolute', top: -6, right: -10 }}>{favoritesCount}</span>}
                </Link>
              </li>
              <li>
                <button onClick={toggleDarkMode} className="klink theme-toggle" title={darkMode ? 'Vilagos mod' : 'Sotet mod'} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  {darkMode ? (
                    <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg> Vilagos</>
                  ) : (
                    <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg> Sotet</>
                  )}
                </button>
              </li>
              <li>
                <Link className="klink" to="/cart" style={{ position: 'relative' }}>
                  Kosar
                  {itemCount > 0 && <span className="badge badge-primary" style={{ position: 'absolute', top: -6, right: -10 }}>{itemCount > 99 ? '99+' : itemCount}</span>}
                </Link>
              </li>
            </ul>
          </nav>

          {/* Mobile: right side icons */}
          <div className="mobile-header-right mobile-only">
            <button onClick={toggleDarkMode} className="mobile-icon-btn" title={darkMode ? 'Vilagos mod' : 'Sotet mod'}>
              {darkMode ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
              )}
            </button>
            <button className="hamburger-btn" onClick={() => setMobileNav(prev => !prev)} aria-label="Menu">
              {mobileNav ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile navigation overlay */}
      {mobileNav && (
        <div className="mobile-nav-overlay" onClick={() => setMobileNav(false)}>
          <nav className="mobile-nav" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleSearch} className="mobile-search">
              <input className="search-input" placeholder="Kereses..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              <button type="submit" className="search-btn">Keres</button>
            </form>

            <div className="mobile-nav-section">
              <button onClick={() => navTo('/')} className="mobile-nav-item">Kezdolap</button>
              <button onClick={() => navTo('/about')} className="mobile-nav-item">Rolunk</button>
              <button onClick={() => navTo('/tips')} className="mobile-nav-item">Tippek</button>
              <button onClick={() => navTo('/gallery')} className="mobile-nav-item">Galeria</button>
              <button onClick={() => navTo('/wall')} className="mobile-nav-item">Fal & Velemenyek</button>
              <button onClick={() => navTo('/contact')} className="mobile-nav-item">Kapcsolat</button>
            </div>

            {isAuthenticated && (
              <>
                <div className="mobile-nav-section">
                  <div className="mobile-nav-user">
                    <strong>{user?.felhasznalonev}</strong>
                    <span>{user?.email}</span>
                  </div>
                  <button onClick={() => navTo('/messages')} className="mobile-nav-item">Uzeneteim</button>
                  <button onClick={() => navTo('/orders')} className="mobile-nav-item">Rendeleseim</button>
                  <button onClick={() => navTo('/coupons')} className="mobile-nav-item">Kuponjaim</button>
                </div>

                {isAdmin && (
                  <div className="mobile-nav-section mobile-nav-admin">
                    <p className="mobile-nav-label">Admin</p>
                    <button onClick={() => navTo('/admin')} className="mobile-nav-item">Admin panel</button>
                    <button onClick={() => navTo('/admin/products')} className="mobile-nav-item">Termekek kezelese</button>
                    <button onClick={() => navTo('/admin/users')} className="mobile-nav-item">Felhasznalok</button>
                    <button onClick={() => navTo('/admin/coupons')} className="mobile-nav-item">Kuponok kezelese</button>
                    <button onClick={() => navTo('/admin/orders')} className="mobile-nav-item">Rendelesek</button>
                  </div>
                )}

                <div className="mobile-nav-section">
                  <button onClick={() => { logout(); navTo('/'); }} className="mobile-nav-item mobile-nav-logout">Kijelentkezes</button>
                </div>
              </>
            )}
          </nav>
        </div>
      )}

      {/* Mobile bottom navigation bar */}
      <nav className="mobile-bottom-bar mobile-only">
        <Link to="/" className={`mobile-bottom-item ${location.pathname === '/' ? 'active' : ''}`}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          <span>Kezdolap</span>
        </Link>
        <Link to="/favorites" className={`mobile-bottom-item ${location.pathname === '/favorites' ? 'active' : ''}`}>
          <div style={{ position: 'relative' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            {favoritesCount > 0 && <span className="mobile-bottom-badge">{favoritesCount}</span>}
          </div>
          <span>Kedvencek</span>
        </Link>
        <Link to="/cart" className={`mobile-bottom-item ${location.pathname === '/cart' ? 'active' : ''}`}>
          <div style={{ position: 'relative' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            {itemCount > 0 && <span className="mobile-bottom-badge">{itemCount > 99 ? '99+' : itemCount}</span>}
          </div>
          <span>Kosar</span>
        </Link>
        {isAuthenticated ? (
          <Link to="/orders" className={`mobile-bottom-item ${location.pathname === '/orders' ? 'active' : ''}`}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
            <span>Rendelesek</span>
          </Link>
        ) : (
          <Link to="/auth" className={`mobile-bottom-item ${location.pathname === '/auth' ? 'active' : ''}`}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            <span>Belepes</span>
          </Link>
        )}
      </nav>
    </>
  );
};

export default Header;