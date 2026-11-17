import { useEffect, useState } from 'react';
import { isAxiosError } from 'axios';
import { productService } from '../services/productService';
import ProductCard from '../components/ProductCard';
import type { CartItem, Product } from '../types'; // ALTERADO
import './Store.css';

// NOVO: o que a loja recebe do App
interface StoreProps {
  cart: CartItem[];
  onAdd: (product: Product) => void;
}

export default function Store({ cart, onAdd }: StoreProps) { // ALTERADO
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const categories = Array.from(new Set(products.map((p) => p.category))).sort();
  const activeCategory = categories.includes(categoryFilter) ? categoryFilter : '';

  const visibleProducts = products.filter((p) => {
    const matchesName = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === '' || p.category === activeCategory;
    return matchesName && matchesCategory;
  });

  useEffect(() => {
    async function load() {
      try {
        const data = await productService.list();
        setProducts(data);
      } catch (err) {
        if (isAxiosError(err) && !err.response) {
          setError('Não foi possível conectar ao servidor.');
        } else if (
          isAxiosError(err) &&
          (err.response?.status === 401 || err.response?.status === 403)
        ) {
          setError('Sessão expirada ou sem permissão. Saia e entre novamente.');
        } else {
          setError('Erro ao carregar os produtos.');
        }
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>{error}</p>;
  if (products.length === 0) return <p>Nenhum produto disponível.</p>;

  return (
    <div>
      <h1>Loja</h1>

      <div className="store-filters">
        <input
          placeholder="Buscar por nome..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          value={activeCategory}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="">Todas as categorias</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {visibleProducts.length === 0 ? (
        <p>Nenhum produto encontrado.</p>
      ) : (
        <div className="product-grid">
          {/* ALTERADO: agora o map tem um corpo com { } e um return */}
          {visibleProducts.map((p) => {
            const inCart = cart.find((item) => item.product.id === p.id);

            return (
              <ProductCard
                key={p.id}
                product={p}
                quantityInCart={inCart ? inCart.quantity : 0}
                onAdd={onAdd}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}