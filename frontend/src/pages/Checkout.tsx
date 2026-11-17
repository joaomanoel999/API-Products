import { useState } from 'react';
import type { FormEvent } from 'react';
import { isAxiosError } from 'axios';
import { clientService } from '../services/clientService';
import { orderService } from '../services/orderService';
import { productService } from '../services/productService';
import { formatPrice } from '../utils/format';
import type { CartItem, Order } from '../types';

interface CheckoutProps {
  cart: CartItem[];
  onOrderPlaced: () => void;
  onBackToCart: () => void;
  onBackToStore: () => void;
}

export default function Checkout({
  cart,
  onOrderPlaced,
  onBackToCart,
  onBackToStore,
}: CheckoutProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  const total = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. Confere se o carrinho ainda bate com os produtos do back
      const products = await productService.list();

      for (const item of cart) {
        const current = products.find((p) => p.id === item.product.id);

        if (!current) {
          setError(
            `"${item.product.name}" não está mais disponível. Remova do carrinho.`
          );
          return;
        }

        if (item.quantity > current.stockQuantity) {
          setError(
            `Estoque insuficiente de "${item.product.name}" (restam ${current.stockQuantity}).`
          );
          return;
        }

        if (current.price !== item.product.price) {
          setError(
            `O preço de "${item.product.name}" mudou. Remova do carrinho e adicione de novo.`
          );
          return;
        }
      }

      // 2. Acha o cliente pelo e-mail, ou cria um novo
      const cleanEmail = email.trim().toLowerCase();
      const clients = await clientService.list();
      const existing = clients.find(
        (c) => (c.email || '').toLowerCase() === cleanEmail
      );

      let clientId: number;
      if (existing) {
        clientId = existing.id;
      } else {
        const created = await clientService.create({
          name: name.trim(),
          email: cleanEmail,
          phone: phone.trim(),
        });
        clientId = created.id;
      }

      // 3. Cria o pedido
      const order = await orderService.create({
        clientId,
        totalAmount: Math.round(total * 100) / 100,
      });

      setPlacedOrder(order);
      onOrderPlaced();
    } catch (err) {
      if (isAxiosError(err) && !err.response) {
        setError('Não foi possível conectar ao servidor.');
      } else if (
        isAxiosError(err) &&
        (err.response?.status === 401 || err.response?.status === 403)
      ) {
        setError('Sessão expirada ou sem permissão. Saia e entre novamente.');
      } else {
        setError('Erro ao finalizar a compra. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  }

  if (placedOrder) {
    return (
      <div>
        <h1>Compra realizada!</h1>
        <p>Pedido nº {placedOrder.id}</p>
        <button onClick={onBackToStore}>Voltar para a loja</button>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div>
        <h1>Finalizar compra</h1>
        <p>Seu carrinho está vazio.</p>
        <button onClick={onBackToStore}>Ir para a loja</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Finalizar compra</h1>

      <h2>Resumo</h2>
      <ul>
        {cart.map((item) => (
          <li key={item.product.id}>
            {item.quantity}x {item.product.name} -{' '}
            {formatPrice(item.product.price * item.quantity)}
          </li>
        ))}
      </ul>
      <h3>Total: {formatPrice(total)}</h3>

      <h2>Seus dados</h2>

      <label>
        Nome
        <input value={name} onChange={(e) => setName(e.target.value)} required />
      </label>

      <label>
        E-mail
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>

      <label>
        Telefone
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </label>

      {error && <p>{error}</p>}

      <button type="submit" disabled={loading}>
        {loading ? 'Finalizando...' : 'Confirmar compra'}
      </button>
      <button type="button" onClick={onBackToCart}>
        Voltar ao carrinho
      </button>
    </form>
  );
}