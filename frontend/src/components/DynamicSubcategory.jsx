import { useParams } from 'react-router-dom';
import ProductList from './ProductList';

const DynamicSubcategory = () => {
  const { category, subcategory } = useParams();
  const title = `${category} - ${subcategory}`.replace(/^\w/, c => c.toUpperCase());
  return <ProductList title={title} category={category} subcategory={subcategory} />;
};

export default DynamicSubcategory;