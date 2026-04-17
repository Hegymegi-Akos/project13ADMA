import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productsAPI } from '../api/apiService';
import { useCart } from '../contexts/CartContext';

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    if (!query.trim()) return;
    const doSearch = async () => {
      setLoading(true);
      try {
        const data = await productsAPI.search(query);
        setResults(Array.isArray(data) ? data : (data.products || []));
      } catch { setResults([]); }
      finally { setLoading(false); }
    };
    doSearch();
  }, [query]);

  return (
    <div className="container page">
      <h1 className="page-title">Kereses: "{query}"</h1>
      {loading ? <p>Betoltes...</p> : results.length === 0 ? <p>Nincs talalt.</p> : (
        <div className="content">
          {results.map(product => (
            <div key={product.id} className="box">
              <img src={product.fo_kep} alt={product.nev} loading="lazy" />
              <h2>{product.nev}</h2>
              <p>{product.rovid_leiras}</p>
              <p style={{ fontSize:'1.2rem', fontWeight:800, color:'var(--accent-primary)' }}>{(product.akcios_ar || product.ar)?.toLocaleString('hu-HU')} Ft</p>
              <button onClick={() => addToCart({ id: product.id, name: product.nev, price: product.akcios_ar || product.ar, img: product.fo_kep })}>Kosarba</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default Search;
