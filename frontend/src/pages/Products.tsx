import { useEffect, useState } from 'react';
import { isAxiosError } from 'axios';
import { productService } from '../services/productService';
import { authService } from '../services/authService';
import ProductForm from './ProductForm';
import type { Product } from '../types';

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState<Product | null>(null);
  const [search, setSearch] = useState(''); // NOVO
  const [categoryFilter, setCategoryFilter] = useState(''); // NOVO

  const isAdmin = authService.isAdmin();

  // NOVO: categorias sem repetição, em ordem alfabética
  const categories = Array.from(new Set(products.map((p) => p.category))).sort();

  // NOVO: se a categoria escolhida não existe mais, volta pra "todas"
  const activeCategory = categories.includes(categoryFilter) ? categoryFilter : '';

  // NOVO: a lista que aparece na tela, já filtrada
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

  function handleCreated(product: Product) {
    setProducts((prev) => [...prev, product]);
  }

  function handleUpdated(updated: Product) {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    setEditing(null);
  }

  function handleEdit(product: Product) {
    setEditing(product);
  }

  function handleCancelEdit() {
    setEditing(null);
  }

  async function handleDelete(product: Product) {
    const confirmed = window.confirm(`Excluir "${product.name}"?`);
    if (!confirmed) return;

    try {
      await productService.remove(product.id);
      setProducts((prev) => prev.filter((p) => p.id !== product.id));
      if (editing && editing.id === product.id) {
        setEditing(null);
      }
    } catch {
      alert('Não foi possível excluir o produto.');
    }
  }

  function renderList() {
    if (loading) return <p>Carregando...</p>;
    if (error) return <p>{error}</p>;
    if (products.length === 0) return <p>Nenhum produto cadastrado.</p>;

    return (
      <div>
        {/* NOVO: barra de busca e filtro */}
        <div>
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

        {/* ALTERADO: mostra a mensagem ou a tabela, conforme o filtro */}
        {visibleProducts.length === 0 ? (
          <p>Nenhum produto encontrado.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Categoria</th>
                <th>Preço</th>
                <th>Estoque</th>
                {isAdmin && <th>Ações</th>}
              </tr>
            </thead>
            <tbody>
              {visibleProducts.map((p) => ( // ALTERADO: era products.map
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.category}</td>
                  <td>
                    {p.price.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </td>
                  <td>{p.stockQuantity}</td>
                  {isAdmin && (
                    <td>
                      <button onClick={() => handleEdit(p)}>Editar</button>
                      <button onClick={() => handleDelete(p)}>Excluir</button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
  }

  return (
    <div>
      {isAdmin && (
        <ProductForm
          key={editing ? editing.id : 'new'}
          editing={editing}
          onCreated={handleCreated}
          onUpdated={handleUpdated}
          onCancel={handleCancelEdit}
        />
      )}
      {renderList()}
    </div>
  );
}