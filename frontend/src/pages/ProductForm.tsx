import { useState } from 'react';
import type { FormEvent } from 'react';
import { isAxiosError } from 'axios';
import { productService } from '../services/productService';
import type { Product, ProductInput } from '../types';

interface ProductFormProps {
  editing: Product | null;
  onCreated: (product: Product) => void;
  onUpdated: (product: Product) => void;
  onCancel: () => void;
}

export default function ProductForm({
  editing,
  onCreated,
  onUpdated,
  onCancel,
}: ProductFormProps) {
  const [name, setName] = useState(editing ? editing.name : '');
  const [category, setCategory] = useState(editing ? editing.category : '');
  const [price, setPrice] = useState(editing ? String(editing.price) : '');
  const [stockQuantity, setStockQuantity] = useState(
    editing ? String(editing.stockQuantity) : ''
  );
  // NOVO
  const [imageUrl, setImageUrl] = useState(
    editing && editing.imageUrl ? editing.imageUrl : ''
  );
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setSaving(true);

    const input: ProductInput = {
      name,
      category,
      price: Number(price),
      stockQuantity: Number(stockQuantity),
      imageUrl: imageUrl.trim() === '' ? null : imageUrl.trim(), // NOVO
    };

    try {
      if (editing) {
        const updated = await productService.update(editing.id, input);
        onUpdated(updated);
      } else {
        const created = await productService.create(input);
        onCreated(created);
        setName('');
        setCategory('');
        setPrice('');
        setStockQuantity('');
        setImageUrl(''); // NOVO
      }
    } catch (err) {
      if (isAxiosError(err) && !err.response) {
        setError('Não foi possível conectar ao servidor.');
      } else if (isAxiosError(err) && err.response?.status === 403) {
        setError('Sem permissão ou sessão expirada.');
      } else {
        setError('Erro ao salvar o produto.');
      }
    } finally {
      setSaving(false);
    }
  }

  const submitLabel = editing ? 'Salvar alterações' : 'Cadastrar';

  return (
    <form onSubmit={handleSubmit}>
      <h2>{editing ? 'Editar produto' : 'Novo produto'}</h2>

      <label>
        Nome
        <input value={name} onChange={(e) => setName(e.target.value)} required />
      </label>

      <label>
        Categoria
        <input
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />
      </label>

      <label>
        Preço
        <input
          type="number"
          min="0"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
      </label>

      <label>
        Estoque
        <input
          type="number"
          min="0"
          step="1"
          value={stockQuantity}
          onChange={(e) => setStockQuantity(e.target.value)}
          required
        />
      </label>

      {/* NOVO: campo da imagem */}
      <label>
        URL da imagem (opcional)
        <input
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://... ou /images/teclado.jpg"
        />
      </label>

      {error && <p>{error}</p>}

      <button type="submit" disabled={saving}>
        {saving ? 'Salvando...' : submitLabel}
      </button>

      {editing && (
        <button type="button" onClick={onCancel}>
          Cancelar
        </button>
      )}
    </form>
  );
}