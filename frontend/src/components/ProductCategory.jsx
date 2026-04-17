import React from 'react';
import ProductList from './ProductList';

const categoryConfig = {
  dogfood: { title: 'Kutya Tapok', category: 'kutya', subcategory: 'tap' },
  leash: { title: 'Kutyaporazak', category: 'kutya', subcategory: 'poraz' },
  collar: { title: 'Kutya Nyakorvek', category: 'kutya', subcategory: 'nyakorv' },
  flea: { title: 'Bolhairto Termekek', category: 'kutya', subcategory: 'bolha' },
  dogbowl: { title: 'Kutya Talak', category: 'kutya', subcategory: 'tal' },
  dogharness: { title: 'Kutya Hamok', category: 'kutya', subcategory: 'ham' },
  catfood: { title: 'Macska Tapok', category: 'macska', subcategory: 'tapm' },
  cattoy: { title: 'Macska Jatekok', category: 'macska', subcategory: 'jatek' },
  rodentfood: { title: 'Ragcsalo Tapok', category: 'ragcsalo', subcategory: 'tap' },
  rodentcage: { title: 'Ragcsalo Ketrecek', category: 'ragcsalo', subcategory: 'ketrec' },
  reptilefood: { title: 'Hullo Tapok', category: 'hullo', subcategory: 'tap' },
  terrarium: { title: 'Terrariumok', category: 'hullo', subcategory: 'terrarium' },
  birdfood: { title: 'Madar Tapok', category: 'madar', subcategory: 'tap' },
  birdcage: { title: 'Madar Ketrecek', category: 'madar', subcategory: 'ketrec' },
  rodentbedding: { title: 'Ragcsalo Almok', category: 'ragcsalo', subcategory: 'alom' },
  rodenttoy: { title: 'Ragcsalo Jatekok', category: 'ragcsalo', subcategory: 'jatek' },
  reptilelamp: { title: 'Melegito Lampak', category: 'hullo', subcategory: 'lampa' },
  birdtoy: { title: 'Madar Jatekok', category: 'madar', subcategory: 'jatek' },
  fishfood: { title: 'Hal Tapok', category: 'hal', subcategory: 'tap' },
  aquarium: { title: 'Akvariumok', category: 'hal', subcategory: 'akvariumok' },
  fishfilter: { title: 'Szurok es tartozekok', category: 'hal', subcategory: 'szuro' },
};

const ProductCategory = ({ type }) => {
  const config = categoryConfig[type];
  if (!config) return <div className="container"><h2>Kategoria nem talalhato</h2></div>;
  return <ProductList title={config.title} category={config.category} subcategory={config.subcategory} />;
};

export default ProductCategory;
export { categoryConfig };
