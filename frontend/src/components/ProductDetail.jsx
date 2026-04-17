import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productsAPI, reviewsAPI, resolveMediaUrl } from '../api/apiService';
import { useCart } from '../contexts/CartContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { useAuth } from '../contexts/AuthContext';

const StarRating = ({ rating, interactive, onRate }) => (
  <div style={{ display: 'flex', gap: 2 }}>
    {[1,2,3,4,5].map(i => (
      <span key={i} onClick={() => interactive && onRate?.(i)} style={{ cursor: interactive ? 'pointer' : 'default', fontSize: '1.3rem', color: i <= rating ? '#f59e0b' : '#d1d5db' }}>★</span>
    ))}
  </div>
);

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ ertekeles: 5, szoveg: '' });
  const [reviewMsg, setReviewMsg] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const data = await productsAPI.getById(id);
        setProduct(data);
        try {
          const r = await reviewsAPI.getByProduct(id);
          setReviews(Array.isArray(r) ? r : []);
        } catch {}
      } catch { setProduct(null); }
      finally { setLoading(false); }
    };
    load();
  }, [id]);

  if (loading) return <div className="container page" style={{ textAlign: 'center', padding: 60 }}>Betoltes...</div>;
  if (!product) return <div className="container page" style={{ textAlign: 'center', padding: 60 }}>Termek nem talalhato. <button onClick={() => navigate(-1)} className="btn-secondary" style={{ marginTop: 16 }}>Vissza</button></div>;

  const effectivePrice = Number(product.akcios_ar) > 0 && Number(product.akcios_ar) < Number(product.ar) ? Number(product.akcios_ar) : Number(product.ar);
  const hasDiscount = Number(product.akcios_ar) > 0 && Number(product.akcios_ar) < Number(product.ar);
  const avgRating = reviews.length > 0 ? (reviews.reduce((s, r) => s + Number(r.ertekeles), 0) / reviews.length) : 0;
  const favorite = isFavorite(product.id);
  const cartProduct = { id: product.id, name: product.nev, price: effectivePrice, img: product.fo_kep };

  const handleAddToCart = () => {
    addToCart(cartProduct, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
    setQuantity(1);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!newReview.szoveg.trim()) return;
    try {
      await reviewsAPI.create({ termek_id: product.id, ...newReview });
      setReviewMsg('Velemeny elkuldve!');
      setNewReview({ ertekeles: 5, szoveg: '' });
      const r = await reviewsAPI.getByProduct(id);
      setReviews(Array.isArray(r) ? r : []);
    } catch (err) { setReviewMsg(err.message); }
    setTimeout(() => setReviewMsg(''), 3000);
  };

  return (
    <div className="container page">
      <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', fontWeight: 600, cursor: 'pointer', fontSize: '0.95rem', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
        ← Vissza
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 32, marginBottom: 40 }}>
        {/* Kep */}
        <div style={{ borderRadius: 16, overflow: 'hidden', background: 'rgba(59,130,246,0.03)' }}>
          <img src={resolveMediaUrl(product.fo_kep)} alt={product.nev} style={{ width: '100%', maxHeight: 450, objectFit: 'contain' }} onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = '/images/kutya.png'; }} />
        </div>

        {/* Reszletek */}
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 900, margin: '0 0 8px' }}>{product.nev}</h1>
          {reviews.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <StarRating rating={Math.round(avgRating)} />
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>({reviews.length} velemeny)</span>
            </div>
          )}
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.7, marginBottom: 20 }}>{product.rovid_leiras}</p>
          {product.leiras && <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: 20 }}>{product.leiras}</p>}

          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 8 }}>
            {hasDiscount && <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)', fontSize: '1.1rem' }}>{Number(product.ar).toLocaleString('hu-HU')} Ft</span>}
            <span style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--accent-primary)' }}>{effectivePrice.toLocaleString('hu-HU')} Ft</span>
            {hasDiscount && <span style={{ background: '#ef4444', color: '#fff', padding: '3px 10px', borderRadius: 999, fontSize: '0.8rem', fontWeight: 700 }}>-{Math.round((1 - Number(product.akcios_ar) / Number(product.ar)) * 100)}%</span>}
          </div>

          <p style={{ fontSize: '0.9rem', color: product.keszlet > 0 ? '#10b981' : '#ef4444', fontWeight: 600, marginBottom: 20 }}>
            {product.keszlet > 0 ? `${product.keszlet} db raktaron` : 'Elfogyott'}
          </p>

          {product.keszlet > 0 && (
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} style={{ width: 40, height: 40, borderRadius: '50%', border: '2px solid rgba(15,23,42,0.15)', background: 'transparent', fontSize: '1.3rem', fontWeight: 700, cursor: 'pointer' }}>−</button>
                <input type="number" min="1" max={product.keszlet} value={quantity} onChange={e => setQuantity(Math.min(product.keszlet, Math.max(1, parseInt(e.target.value) || 1)))} style={{ width: 55, padding: 8, borderRadius: 10, border: '2px solid rgba(15,23,42,0.1)', textAlign: 'center', fontSize: '1.1rem', fontWeight: 600 }} />
                <button onClick={() => setQuantity(q => Math.min(product.keszlet, q + 1))} style={{ width: 40, height: 40, borderRadius: '50%', border: '2px solid rgba(15,23,42,0.15)', background: 'transparent', fontSize: '1.3rem', fontWeight: 700, cursor: 'pointer' }}>+</button>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginLeft: 4 }}>db</span>
              </div>
              <button onClick={handleAddToCart} style={{ flex: 1, minWidth: 180, padding: '14px 24px', borderRadius: 12, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '1rem', color: '#fff', background: added ? 'linear-gradient(135deg,#10b981,#059669)' : 'linear-gradient(135deg, var(--accent-primary, #6366f1), var(--accent-secondary, #8b5cf6))' }}>
                {added ? 'Hozzaadva!' : 'Kosarba'}
              </button>
              <button onClick={() => toggleFavorite(cartProduct)} style={{ width: 48, height: 48, borderRadius: '50%', border: 'none', background: favorite ? '#ef4444' : 'rgba(0,0,0,0.05)', color: favorite ? '#fff' : '#6b7280', fontSize: '1.3rem', cursor: 'pointer' }}>♥</button>
            </div>
          )}
        </div>
      </div>

      {/* Velemenyek */}
      <div style={{ borderTop: '2px solid rgba(0,0,0,0.06)', paddingTop: 32 }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: 20 }}>Velemenyek ({reviews.length})</h2>

        {isAuthenticated && (
          <form onSubmit={handleSubmitReview} className="ui-card" style={{ marginBottom: 24, padding: 20 }}>
            <h3 style={{ margin: '0 0 12px', fontSize: '1rem' }}>Velemeny irasa</h3>
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 4, display: 'block' }}>Ertekeles</label>
              <StarRating rating={newReview.ertekeles} interactive onRate={v => setNewReview(prev => ({ ...prev, ertekeles: v }))} />
            </div>
            <textarea value={newReview.szoveg} onChange={e => setNewReview(prev => ({ ...prev, szoveg: e.target.value }))} rows={3} placeholder="Ird le a velemenyed..." style={{ width: '100%', marginBottom: 12 }} required />
            <button type="submit" className="btn-primary" style={{ padding: '10px 24px' }}>Kuldes</button>
            {reviewMsg && <p style={{ marginTop: 8, fontSize: '0.85rem', fontWeight: 600, color: reviewMsg.includes('elkuldve') ? '#10b981' : '#ef4444' }}>{reviewMsg}</p>}
          </form>
        )}

        {reviews.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 20 }}>Meg nincs velemeny errol a termekrol.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {reviews.map((r, i) => (
              <div key={i} className="ui-card" style={{ padding: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <strong style={{ fontSize: '0.9rem' }}>{r.felhasznalonev || 'Felhasznalo'}</strong>
                  <StarRating rating={Number(r.ertekeles)} />
                </div>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{r.szoveg}</p>
                {r.letrehozva && <p style={{ margin: '8px 0 0', fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(r.letrehozva).toLocaleDateString('hu-HU')}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;