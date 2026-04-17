import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { productsAPI, resolveMediaUrl } from '../api/apiService';
import QuickViewModal from './QuickViewModal';

const ProductList = ({ title, category, subcategory }) => {
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [quantities, setQuantities] = useState({});
  const [addedItems, setAddedItems] = useState({});
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  const sortBy = searchParams.get('sort') || '';
  const minPrice = searchParams.get('min') || '';
  const maxPrice = searchParams.get('max') || '';

  const [localSort, setLocalSort] = useState(sortBy);
  const [localMin, setLocalMin] = useState(minPrice);
  const [localMax, setLocalMax] = useState(maxPrice);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true); setError(null);
        const data = await productsAPI.getByCategory(category, subcategory);
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        setError('Nem sikerult betolteni a termekeket');
        setProducts([]);
      } finally { setLoading(false); }
    };
    fetchProducts();
  }, [category, subcategory]);

  const getEffectivePrice = (p) => Number(p.akcios_ar) > 0 && Number(p.akcios_ar) < Number(p.ar) ? Number(p.akcios_ar) : Number(p.ar);

  const handleAddToCart = (product) => {
    const quantity = quantities[product.id] || 1;
    addToCart({ id: product.id, name: product.nev, price: getEffectivePrice(product), img: product.fo_kep }, quantity);
    setAddedItems(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => setAddedItems(prev => ({ ...prev, [product.id]: false })), 1000);
    setQuantities(prev => ({ ...prev, [product.id]: 1 }));
  };

  let filteredProducts = [...products];
  if (minPrice) filteredProducts = filteredProducts.filter(p => getEffectivePrice(p) >= parseFloat(minPrice));
  if (maxPrice) filteredProducts = filteredProducts.filter(p => getEffectivePrice(p) <= parseFloat(maxPrice));
  if (sortBy === 'low') filteredProducts.sort((a, b) => getEffectivePrice(a) - getEffectivePrice(b));
  else if (sortBy === 'high') filteredProducts.sort((a, b) => getEffectivePrice(b) - getEffectivePrice(a));

  if (loading) return <div className="container" style={{ textAlign:'center', padding:'60px 20px' }}><p>Termekek betoltese...</p></div>;
  if (error) return <div className="container" style={{ textAlign:'center', padding:'60px 20px' }}><p style={{ color:'#ef4444' }}>{error}</p></div>;

  const applyLocalFilters = () => {
    const params = new URLSearchParams(searchParams);
    localSort ? params.set('sort', localSort) : params.delete('sort');
    localMin ? params.set('min', localMin) : params.delete('min');
    localMax ? params.set('max', localMax) : params.delete('max');
    window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
    window.location.reload();
  };

  const clearLocalFilters = () => {
    setLocalSort(''); setLocalMin(''); setLocalMax('');
    window.history.replaceState({}, '', window.location.pathname);
    window.location.reload();
  };

  return (
    <div className="container">
      <h1 className="page-title" style={{ marginTop: 32 }}>{title}</h1>

      {/* Szuro sav */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{filteredProducts.length} termek talalt</p>
        <button onClick={() => setShowFilters(f => !f)} style={{ background: 'none', border: '2px solid var(--accent-primary, #6366f1)', color: 'var(--accent-primary)', padding: '6px 16px', borderRadius: 999, fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
          {showFilters ? 'Szurok elrejtese' : 'Szurok'}
        </button>
      </div>
      {showFilters && (
        <div className="ui-card" style={{ padding: 16, marginBottom: 20, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'end' }}>
          <div style={{ minWidth: 140 }}>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 4 }}>Rendezes</label>
            <select value={localSort} onChange={e => setLocalSort(e.target.value)} style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid rgba(0,0,0,0.1)' }}>
              <option value="">Alapertelmezett</option>
              <option value="low">Ar: Alacsony → Magas</option>
              <option value="high">Ar: Magas → Alacsony</option>
            </select>
          </div>
          <div style={{ minWidth: 100 }}>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 4 }}>Min ar (Ft)</label>
            <input type="number" value={localMin} onChange={e => setLocalMin(e.target.value)} placeholder="0" style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid rgba(0,0,0,0.1)' }} />
          </div>
          <div style={{ minWidth: 100 }}>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 4 }}>Max ar (Ft)</label>
            <input type="number" value={localMax} onChange={e => setLocalMax(e.target.value)} placeholder="999999" style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid rgba(0,0,0,0.1)' }} />
          </div>
          <button onClick={applyLocalFilters} style={{ padding: '8px 20px', borderRadius: 8, border: 'none', background: 'var(--accent-primary, #6366f1)', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>Alkalmaz</button>
          {(localSort || localMin || localMax) && <button onClick={clearLocalFilters} style={{ padding: '8px 20px', borderRadius: 8, border: 'none', background: '#ef4444', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>Torles</button>}
        </div>
      )}

      {filteredProducts.length === 0 ? (
        <div style={{ textAlign:'center', padding:'60px 20px', color:'var(--text-muted)' }}>Nincs talalt</div>
      ) : (
        <div className="content">
          {filteredProducts.map(product => {
            const cartProduct = { id: product.id, name: product.nev, price: getEffectivePrice(product), img: product.fo_kep };
            const favorite = isFavorite(product.id);
            return (
              <div key={product.id} className="box" style={{ position:'relative' }}>
                <div style={{ position: 'absolute', top: 10, left: 10, right: 10, display: 'flex', justifyContent: 'space-between', zIndex: 5 }}>
                  <button
                    onClick={() => setQuickViewProduct(product)}
                    className="btn-secondary"
                    style={{ padding: '6px 10px', fontSize: '0.75rem', borderRadius: 999 }}
                  >
                    Gyors nezet
                  </button>
                  <button
                    onClick={() => toggleFavorite(cartProduct)}
                    className={favorite ? 'btn-danger' : 'btn-secondary'}
                    style={{ padding: '6px 10px', fontSize: '0.75rem', borderRadius: 999 }}
                  >
                    {favorite ? 'Kedvenc -' : 'Kedvenc +'}
                  </button>
                </div>
                <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <img
                    src={resolveMediaUrl(product.fo_kep)}
                    alt={product.nev}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/images/kutya.png';
                    }}
                  />
                  <h2>{product.nev}</h2>
                </Link>
                {Number(product.akcios_ar) > 0 && Number(product.akcios_ar) < Number(product.ar) && <p style={{ textDecoration:'line-through', color:'var(--text-muted)', fontSize:'0.9rem' }}>{Number(product.ar).toLocaleString('hu-HU')} Ft</p>}
                <p style={{ fontSize:'1.3rem', fontWeight:800, color:'var(--accent-primary)', margin:'8px 0' }}>{getEffectivePrice(product).toLocaleString('hu-HU')} Ft</p>
                <p style={{ fontSize:'0.85rem', color: product.keszlet > 0 ? 'var(--text-secondary)' : '#ef4444', fontWeight:600, margin:'4px 0 8px' }}>
                  {product.keszlet > 0 ? `${product.keszlet} db raktaron` : 'Elfogyott'}
                </p>
                {product.keszlet > 0 && (
                  <>
                    <div style={{ display:'flex', gap:4, alignItems:'center', justifyContent:'center', marginBottom:12 }}>
                      <button
                        onClick={() => setQuantities(prev => ({...prev, [product.id]: Math.max(1, (prev[product.id] || 1) - 1)}))}
                        style={{ width:36, height:36, borderRadius:'50%', border:'2px solid rgba(15,23,42,0.15)', background:'transparent', fontSize:'1.2rem', fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--text-secondary)' }}
                      >−</button>
                      <input type="number" min="1" max={product.keszlet} value={quantities[product.id] || 1} onChange={(e) => setQuantities(prev => ({...prev, [product.id]: Math.min(product.keszlet, Math.max(1, parseInt(e.target.value) || 1))}))} style={{ width:50, padding:6, borderRadius:8, border:'2px solid rgba(15,23,42,0.1)', textAlign:'center', fontSize:'1rem', fontWeight:600 }} />
                      <button
                        onClick={() => setQuantities(prev => ({...prev, [product.id]: Math.min(product.keszlet, (prev[product.id] || 1) + 1)}))}
                        style={{ width:36, height:36, borderRadius:'50%', border:'2px solid rgba(15,23,42,0.15)', background:'transparent', fontSize:'1.2rem', fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--text-secondary)' }}
                      >+</button>
                      <span style={{ fontSize:'0.9rem', color:'var(--text-muted)', marginLeft:4 }}>db</span>
                    </div>
                    <button onClick={() => handleAddToCart(product)} style={{ background: addedItems[product.id] ? 'linear-gradient(135deg,#10b981,#059669)' : undefined }}>
                      {addedItems[product.id] ? 'Hozzaadva!' : 'Kosarba'}
                    </button>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Leiras felugro menu */}
      {quickViewProduct && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', backdropFilter:'blur(4px)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }} onClick={() => setQuickViewProduct(null)}>
          <div style={{ background:'var(--surface-bg, #fff)', borderRadius:20, padding:28, maxWidth:480, width:'100%', maxHeight:'85vh', overflow:'auto', boxShadow:'0 25px 80px rgba(0,0,0,0.2)' }} onClick={e => e.stopPropagation()}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
              <h2 style={{ margin:0, fontSize:'1.3rem' }}>{quickViewProduct.nev}</h2>
              <button onClick={() => setQuickViewProduct(null)} style={{ background:'var(--color-bg-alt, #f3f4f6)', border:'none', width:36, height:36, borderRadius:10, fontSize:16, cursor:'pointer', fontWeight:700 }}>✕</button>
            </div>
            {quickViewProduct.fo_kep && <img src={resolveMediaUrl(quickViewProduct.fo_kep)} alt={quickViewProduct.nev} style={{ width:'100%', borderRadius:16, marginBottom:16, maxHeight:300, objectFit:'cover' }} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/images/kutya.png'; }} />}
            <p style={{ color:'var(--text-secondary, #666)', fontSize:'0.95rem', lineHeight:1.6, margin:0 }}>{quickViewProduct.rovid_leiras}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
