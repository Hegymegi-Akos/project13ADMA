import React from 'react';
import { useCart } from '../contexts/CartContext';

const QuickViewModal = ({ product, show, onClose }) => {
  const { addToCart } = useCart();

  if (!show || !product) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={onClose}>
      <div style={{ background: 'var(--surface-bg)', borderRadius: 20, padding: 28, maxWidth: 480, width: '100%', maxHeight: '85vh', overflow: 'auto', boxShadow: '0 25px 80px rgba(0,0,0,0.2)' }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ margin: 0, fontSize: '1.3rem' }}>{product.name}</h2>
          <button onClick={onClose} style={{ background: 'var(--color-bg-alt)', border: 'none', width: 36, height: 36, borderRadius: 10, fontSize: 16, cursor: 'pointer', fontWeight: 700 }}>X</button>
        </div>
        {product.img && <img src={product.img} alt={product.name} style={{ width: '100%', borderRadius: 16, marginBottom: 20, maxHeight: 300, objectFit: 'cover' }} />}
        {product.desc && <p style={{ color: 'var(--color-text-secondary)', marginBottom: 16 }}>{product.desc}</p>}
        <p style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--primary)', marginBottom: 16 }}>{product.price?.toLocaleString('hu-HU')} Ft</p>
        <button onClick={() => { addToCart(product); onClose(); }} className="btn-primary" style={{ width: '100%', padding: 14, fontSize: '1rem', borderRadius: 12 }}>Kosarba</button>
      </div>
    </div>
  );
};

export default QuickViewModal;
