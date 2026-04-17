import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/slider.css';

const Home = () => {
  const [sortBy, setSortBy] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const navigate = useNavigate();

  const applyFilters = (category) => {
    const params = new URLSearchParams();
    if (sortBy) params.set('sort', sortBy);
    if (minPrice) params.set('min', minPrice);
    if (maxPrice) params.set('max', maxPrice);
    navigate(`${category}?${params.toString()}`);
  };

  const clearFilters = () => { setSortBy(''); setMinPrice(''); setMaxPrice(''); };

  const categories = [
    { path: '/dog', img: '/images/kutya.png', name: 'Kutya', desc: 'Jatekok, tapok, felszerelesek', color: '#fef3c7' },
    { path: '/cat', img: '/images/macska.png', name: 'Macska', desc: 'Jatekok es macskatapok', color: '#fce7f3' },
    { path: '/rodent', img: '/images/ragcsalo.png', name: 'Ragcsalo', desc: 'Allvanyok, alom, kaja', color: '#dcfce7' },
    { path: '/reptile', img: '/images/hullo.png', name: 'Hullo', desc: 'Terrarium felszerelesek', color: '#e0e7ff' },
    { path: '/bird', img: '/images/madar.png', name: 'Madar', desc: 'Kalitkak, eleseg', color: '#fef9c3' },
    { path: '/fish', img: '/images/hal.png', name: 'Hal', desc: 'Akvarisztikai kellekek', color: '#cffafe' }
  ];

  return (
    <div>
      <main className="container" id="main" style={{ paddingTop: 24 }}>
        {/* Hero slider */}
        <section className="hero">
          <div className="continuous-slider" aria-hidden="true">
            <div className="slider-track">
              <img src="/images/carousel/akcio1.png" alt="slide-1" />
              <img src="/images/carousel/kep1.jpg" alt="slide-2" />
              <img src="/images/carousel/kep2.jpg" alt="slide-3" />
              <img src="/images/carousel/kep3.jpg" alt="slide-4" />
              <img src="/images/carousel/akcio1.png" alt="slide-1-dup" />
              <img src="/images/carousel/kep1.jpg" alt="slide-2-dup" />
              <img src="/images/carousel/kep2.jpg" alt="slide-3-dup" />
              <img src="/images/carousel/kep3.jpg" alt="slide-4-dup" />
            </div>
          </div>
        </section>

        {/* Filter bar */}
        <div className="filter-bar">
          <div>
            <label>Rendezes</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="">Alapertelmezett</option>
              <option value="low">Ar: Alacsony - Magas</option>
              <option value="high">Ar: Magas - Alacsony</option>
            </select>
          </div>
          <div>
            <label>Min. ar (Ft)</label>
            <input type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} placeholder="0" />
          </div>
          <div>
            <label>Max. ar (Ft)</label>
            <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="999999" />
          </div>
          {(sortBy || minPrice || maxPrice) && (
            <button onClick={clearFilters} style={{
              padding: '10px 20px', background: 'var(--danger-light)', color: 'var(--danger)',
              border: 'none', borderRadius: 10, cursor: 'pointer', fontWeight: 700, alignSelf: 'end'
            }}>Szurok torlese</button>
          )}
        </div>

        {/* Category grid */}
        <section className="content">
          {categories.map(cat => (
            <article key={cat.path} className="box" style={{ overflow: 'hidden' }}>
              <div onClick={() => applyFilters(cat.path)} style={{ cursor: 'pointer' }}>
                <div className="category-card-img-wrap" style={{ background: cat.color }}>
                  <img src={cat.img} alt={cat.name} loading="lazy" className="category-card-img" />
                </div>
                <h2>{cat.name}</h2>
                <p>{cat.desc}</p>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
};

export default Home;
