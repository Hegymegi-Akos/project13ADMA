import React from 'react';
import { useFavorites } from '../contexts/FavoritesContext';
import { useCart } from '../contexts/CartContext';
import { resolveMediaUrl } from '../api/apiService';

const Favorites = () => {
  const { favorites, toggleFavorite, clearFavorites } = useFavorites();
  const { addToCart } = useCart();

  return (
    <main className="container page">
      <h1 className="page-title">Kedvencek ({favorites.length})</h1>
      {favorites.length === 0 ? (
        <section className="ui-card"><p>Meg nincsenek kedvenceid.</p></section>
      ) : (
        <>
          <div style={{ textAlign: 'right', marginBottom: 16 }}>
            <button onClick={clearFavorites} className="btn-danger" style={{ padding: '10px 20px', fontSize: '0.85rem' }}>Osszes torles</button>
          </div>
          <div className="content">
            {favorites.map(product => (
              <div key={product.id} className="fav-card">
                {product.img && (
                  <div className="fav-card-img-wrap">
                    <img
                      src={resolveMediaUrl(product.img)}
                      alt={product.name}
                      loading="lazy"
                      className="fav-card-img"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/images/kutya.png';
                      }}
                    />
                  </div>
                )}
                <div className="fav-card-body">
                  <h3 className="fav-card-name">{product.name}</h3>
                  <p className="fav-card-price">{product.price?.toLocaleString('hu-HU')} Ft</p>
                  <div className="fav-card-actions">
                    <button onClick={() => addToCart(product)} className="btn-primary fav-btn-cart">Kosarba</button>
                    <button onClick={() => toggleFavorite(product)} className="btn-danger fav-btn-remove">Torles</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </main>
  );
};
export default Favorites;
