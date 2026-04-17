import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { categoriesAPI } from '../api/apiService';

const categoryMeta = {
  dog:     { slug: 'kutya',    title: 'Kutya Termekek',    fallbackImg: '/images/kutya.png' },
  cat:     { slug: 'macska',   title: 'Macska Termekek',   fallbackImg: '/images/macska.png' },
  rodent:  { slug: 'ragcsalo', title: 'Ragcsalo Termekek', fallbackImg: '/images/ragcsalo.png' },
  reptile: { slug: 'hullo',    title: 'Hullo Termekek',    fallbackImg: '/images/hullo.png' },
  bird:    { slug: 'madar',    title: 'Madar Termekek',    fallbackImg: '/images/madar.png' },
  fish:    { slug: 'hal',      title: 'Hal Termekek',      fallbackImg: '/images/hal.png' },
};

// Map subcategory slug -> route path
const subcategoryRoutes = {
  // kutya
  poraz: '/leash', tal: '/dogbowl', ham: '/dogharness', bolha: '/flea', nyakorv: '/collar', tap: '/dogfood',
  // macska
  jatek: '/cattoy', tapm: '/catfood',
  // ragcsalo
  ketrec: '/rodentcage', alom: '/rodentbedding',
  // hullo
  terrarium: '/terrarium',
  // madar
  // hal
  akvariumok: '/aquarium', szuro: '/fishfilter',
};

// Build route from category + subcategory
const getSubcategoryRoute = (catSlug, subSlug) => {
  // Known hardcoded routes
  const knownRoutes = {
    'kutya_poraz': '/leash', 'kutya_tal': '/dogbowl', 'kutya_ham': '/dogharness',
    'kutya_bolha': '/flea', 'kutya_nyakorv': '/collar', 'kutya_tap': '/dogfood',
    'macska_jatek': '/cattoy', 'macska_tapm': '/catfood',
    'ragcsalo_tap': '/rodentfood', 'ragcsalo_ketrec': '/rodentcage', 'ragcsalo_alom': '/rodentbedding', 'ragcsalo_jatek': '/rodenttoy',
    'hullo_tap': '/reptilefood', 'hullo_terrarium': '/terrarium', 'hullo_lampa': '/reptilelamp',
    'madar_tap': '/birdfood', 'madar_ketrec': '/birdcage', 'madar_jatek': '/birdtoy',
    'hal_tap': '/fishfood', 'hal_akvariumok': '/aquarium', 'hal_szuro': '/fishfilter',
  };
  const key = `${catSlug}_${subSlug}`;
  if (knownRoutes[key]) return knownRoutes[key];
  // Fallback: use generic product category route
  return `/products/${catSlug}/${subSlug}`;
};

const CategoryPage = ({ type }) => {
  const meta = categoryMeta[type];
  const [searchParams] = useSearchParams();
  const params = searchParams.toString() ? `?${searchParams.toString()}` : '';
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const cats = await categoriesAPI.getAll();
        const cat = (Array.isArray(cats) ? cats : []).find(c => c.slug === meta?.slug);
        if (cat?.alkategoriak) {
          setSubcategories(cat.alkategoriak);
        }
      } catch {}
      finally { setLoading(false); }
    };
    load();
  }, [meta?.slug]);

  if (!meta) return <div className="container"><h2>Kategoria nem talalhato</h2></div>;

  if (loading) return (
    <div className="container" style={{ textAlign: 'center', padding: '60px 20px' }}>
      <p style={{ color: 'var(--text-secondary)' }}>Betoltes...</p>
    </div>
  );

  return (
    <div className="container">
      <h1 className="page-title" style={{ marginTop: 32 }}>{meta.title}</h1>
      {subcategories.length === 0 ? (
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 40 }}>Nincs alkategoria ebben a kategoriaban.</p>
      ) : (
        <div className="content">
          {subcategories.map(sub => (
            <div key={sub.id} className="box">
              <Link to={`${getSubcategoryRoute(meta.slug, sub.slug)}${params}`}>
                {sub.kep ? (
                  <img src={sub.kep} alt={sub.nev} loading="lazy" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = meta.fallbackImg; }} />
                ) : (
                  <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(59,130,246,0.05)' }}>
                    <img src={meta.fallbackImg} alt={sub.nev} style={{ height: 100, objectFit: 'contain' }} />
                  </div>
                )}
                <h2>{sub.nev}</h2>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;