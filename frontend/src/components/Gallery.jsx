import React, { useEffect, useState } from 'react';

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/images/manifest.json')
      .then(res => res.json())
      .then(data => { setImages(data); setLoading(false); })
      .catch(() => { setImages([]); setLoading(false); });
  }, []);

  if (loading) return <div className="container page"><p>Betoltes...</p></div>;

  return (
    <div className="container page">
      <h1 className="page-title">Galeria</h1>
      {images.length === 0 ? <p>Nincs kep.</p> : (
        <div className="gallery-grid">
          {images.map((src, i) => (
            <div key={i} className="gallery-item">
              <img src={src} alt={`kep-${i}`} loading="lazy" className="gallery-img" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
