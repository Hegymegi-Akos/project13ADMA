import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { reviewsAPI, productsAPI, isAllowedAdminUser } from '../api/apiService';

function Wall() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const isAdmin = isAllowedAdminUser(user);
  const [activeTab, setActiveTab] = useState('wall');
  const [wallPosts, setWallPosts] = useState([]);
  const [wallLoading, setWallLoading] = useState(false);
  const [wallError, setWallError] = useState('');
  const [newPost, setNewPost] = useState('');
  const [posting, setPosting] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState('');
  const [products, setProducts] = useState([]);
  const [productSearch, setProductSearch] = useState('');
  const [reviewForm, setReviewForm] = useState({ termek_id: '', ertekeles: 5, cim: '', velemeny: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');

  useEffect(() => { if (!isAuthenticated) navigate('/login'); }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (isAuthenticated && activeTab === 'wall') loadWallPosts();
    if (isAuthenticated && activeTab === 'reviews') loadReviews();
    if (isAuthenticated && activeTab === 'write') loadProducts();
  }, [isAuthenticated, activeTab]);

  const loadWallPosts = async () => {
    setWallLoading(true); setWallError('');
    try { const data = await reviewsAPI.getWallPosts(); setWallPosts(Array.isArray(data) ? data : []); }
    catch (err) { setWallError(err.message); }
    finally { setWallLoading(false); }
  };

  const loadReviews = async () => {
    setReviewsLoading(true); setReviewsError('');
    try { const data = await reviewsAPI.getAll(); setReviews(Array.isArray(data) ? data : []); }
    catch (err) { setReviewsError(err.message); }
    finally { setReviewsLoading(false); }
  };

  const loadProducts = async () => {
    try { const data = await productsAPI.getAll(1, 200); setProducts(Array.isArray(data.products || data) ? (data.products || data) : []); }
    catch {}
  };

  const filteredProducts = useMemo(() => {
    if (!productSearch.trim()) return products;
    const q = productSearch.toLowerCase();
    return products.filter(p => p.nev?.toLowerCase().includes(q));
  }, [products, productSearch]);

  const handlePostSubmit = async (e) => {
    e.preventDefault(); if (!newPost.trim()) return;
    setPosting(true); setWallError('');
    try { await reviewsAPI.createWallPost(newPost.trim()); setNewPost(''); loadWallPosts(); }
    catch (err) { setWallError(err.message); }
    finally { setPosting(false); }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Biztosan torlod?')) return;
    try { await reviewsAPI.deleteWallPost(postId); setWallPosts(prev => prev.filter(p => p.id !== postId)); }
    catch (err) { setWallError(err.message); }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Biztosan torlod ezt a velemenyt?')) return;
    try { await reviewsAPI.deleteReview(reviewId); setReviews(prev => prev.filter(r => r.id !== reviewId)); }
    catch (err) { setReviewsError(err.message); }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault(); setSubmitError(''); setSubmitSuccess('');
    if (!reviewForm.termek_id || !reviewForm.cim.trim() || !reviewForm.velemeny.trim()) { setSubmitError('Minden mezo kitoltese kotelezo!'); return; }
    setSubmitting(true);
    try {
      await reviewsAPI.create({ termek_id: Number(reviewForm.termek_id), ertekeles: reviewForm.ertekeles, cim: reviewForm.cim.trim(), velemeny: reviewForm.velemeny.trim() });
      setSubmitSuccess('Velemeny sikeresen elkuldve!');
      setReviewForm({ termek_id: '', ertekeles: 5, cim: '', velemeny: '' });
    } catch (err) { setSubmitError(err.message); }
    finally { setSubmitting(false); }
  };

  if (!isAuthenticated) return <main className="container page"><h1 className="page-title">Velemenyek & Fal</h1><section className="ui-card"><p>Be kell jelentkezned.</p><Link to="/login">Bejelentkezes</Link></section></main>;

  return (
    <main className="container page">
      <h1 className="page-title">Velemenyek & Fal</h1>
      <nav style={{ display:'flex', gap:8, marginBottom:20, flexWrap:'wrap' }}>
        <button onClick={() => setActiveTab('wall')} className={activeTab === 'wall' ? 'btn-primary' : 'btn-secondary'}>Fal</button>
        <button onClick={() => setActiveTab('reviews')} className={activeTab === 'reviews' ? 'btn-primary' : 'btn-secondary'}>Velemenyek</button>
        <button onClick={() => setActiveTab('write')} className={activeTab === 'write' ? 'btn-primary' : 'btn-secondary'}>Uj velemeny</button>
      </nav>

      {activeTab === 'wall' && (
        <section className="ui-card">
          <h2 className="section-title">Kozossegi Fal</h2>
          <form onSubmit={handlePostSubmit} style={{ marginBottom:20 }}>
            <textarea value={newPost} onChange={(e) => setNewPost(e.target.value)} placeholder="Mi jar a fejedben?" maxLength={1000} style={{ width:'100%', minHeight:80, padding:12, borderRadius:8, border:'1px solid #d1d5db', marginBottom:8, resize:'vertical' }} />
            <button type="submit" className="btn-primary" disabled={posting || !newPost.trim()}>{posting ? 'Kuldes...' : 'Kozzetetetel'}</button>
          </form>
          {wallError && <div style={{ color:'#ef4444', marginBottom:12 }}>{wallError}</div>}
          {wallLoading ? <p>Betoltes...</p> : wallPosts.length === 0 ? <p>Meg nincsenek bejegyzesek.</p> : (
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              {wallPosts.map(post => (
                <div key={post.id} style={{ padding:16, borderRadius:12, background:'rgba(59,130,246,0.03)', border:'1px solid rgba(59,130,246,0.1)' }}>
                  <div style={{ display:'flex', justifyContent:'space-between' }}>
                    <div><strong>{post.felhasznalonev || 'Felhasznalo'}</strong> <span style={{ color:'#666', fontSize:'0.8rem' }}>{new Date(post.letrehozva).toLocaleString('hu-HU')}</span></div>
                    {(user?.id === post.felhasznalo_id || user?.admin) && <button onClick={() => handleDeletePost(post.id)} style={{ background:'none', border:'none', cursor:'pointer' }}>Torles</button>}
                  </div>
                  <p style={{ marginTop:8, whiteSpace:'pre-wrap' }}>{post.szoveg}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {activeTab === 'reviews' && (
        <section className="ui-card">
          <h2 className="section-title">Termek Velemenyek</h2>
          {reviewsError && <div style={{ color:'#ef4444', marginBottom:12 }}>{reviewsError}</div>}
          {reviewsLoading ? <p>Betoltes...</p> : reviews.length === 0 ? <p>Meg nincsenek velemenyek.</p> : (
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              {reviews.map(review => (
                <div key={review.id} style={{ padding:16, borderRadius:12, background:'rgba(59,130,246,0.03)', border:'1px solid rgba(59,130,246,0.1)' }}>
                  <strong>{review.cim}</strong>
                  <div style={{ color:'#f59e0b' }}>{'*'.repeat(review.ertekeles)}</div>
                  <p style={{ marginTop:8 }}>{review.velemeny}</p>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <span style={{ fontSize:'0.8rem', color:'#666' }}>{review.felhasznalonev || review.vendeg_nev || 'Nevtelen'} - {new Date(review.datum).toLocaleDateString('hu-HU')}</span>
                    {isAdmin && <button onClick={() => handleDeleteReview(review.id)} style={{ background:'none', border:'none', cursor:'pointer', color:'#ef4444', fontSize:'0.85rem' }}>Torles</button>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {activeTab === 'write' && (
        <section className="ui-card">
          <h2 className="section-title">Uj Velemeny Irasa</h2>
          {submitError && <div style={{ color:'#ef4444', marginBottom:12, padding:12, background:'#fef2f2', borderRadius:8 }}>{submitError}</div>}
          {submitSuccess && <div style={{ color:'#22c55e', marginBottom:12, padding:12, background:'#f0fdf4', borderRadius:8 }}>{submitSuccess}</div>}
          <form onSubmit={handleReviewSubmit} className="form-grid">
            <div className="form-field">
              <label>Termek keresese</label>
              <input value={productSearch} onChange={(e) => setProductSearch(e.target.value)} placeholder="Ird be a termek nevet..." />
              <select value={reviewForm.termek_id} onChange={(e) => setReviewForm(prev => ({...prev, termek_id: e.target.value}))} size={5}>
                <option value="">-- Valassz tereket ({filteredProducts.length}) --</option>
                {filteredProducts.map(p => <option key={p.id} value={p.id}>{p.nev} - {Number(p.ar).toLocaleString('hu-HU')} Ft</option>)}
              </select>
            </div>
            <div className="form-field">
              <label>Ertekeles</label>
              <div style={{ display:'flex', gap:8 }}>
                {[1,2,3,4,5].map(star => (
                  <button key={star} type="button" onClick={() => setReviewForm(prev => ({...prev, ertekeles: star}))} style={{ background:'none', border:'none', fontSize:28, cursor:'pointer', color: star <= reviewForm.ertekeles ? '#f59e0b' : '#d1d5db' }}>*</button>
                ))}
              </div>
            </div>
            <div className="form-field"><label>Cim</label><input value={reviewForm.cim} onChange={(e) => setReviewForm(prev => ({...prev, cim: e.target.value}))} maxLength={100} /></div>
            <div className="form-field"><label>Velemeny</label><textarea value={reviewForm.velemeny} onChange={(e) => setReviewForm(prev => ({...prev, velemeny: e.target.value}))} maxLength={2000} /></div>
            <button type="submit" className="btn-primary" disabled={submitting}>{submitting ? 'Kuldes...' : 'Velemeny Bekuldese'}</button>
          </form>
        </section>
      )}
    </main>
  );
}

export default Wall;
