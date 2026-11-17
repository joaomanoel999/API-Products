import type { CartItem } from '../types';
import { formatPrice } from '../utils/format'; // NOVO

interface CartProps {
  cart: CartItem[];
  onIncrease: (productId: number) => void;
  onDecrease: (productId: number) => void;
  onRemove: (productId: number) => void;
  onBackToStore: () => void;
  onCheckout: () => void; // NOVO
}

export default function Cart({
  cart,
  onIncrease,
  onDecrease,
  onRemove,
  onBackToStore,
  onCheckout, // NOVO
}: CartProps) {
  const total = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  if (cart.length === 0) {
    return (
      <div>
        <h1>Carrinho</h1>
        <p>Seu carrinho está vazio.</p>
        <button onClick={onBackToStore}>Ir para a loja</button>
      </div>
    );
  }

  return (
    <div>
      <h1>Carrinho</h1>

      <table>
        <thead>
          <tr>
            <th>Produto</th>
            <th>Preço</th>
            <th>Quantidade</th>
            <th>Subtotal</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {cart.map((item) => (
            <tr key={item.product.id}>
              <td>{item.product.name}</td>
              <td>{formatPrice(item.product.price)}</td>
              <td>
                <button onClick={() => onDecrease(item.product.id)}>-</button>
                {item.quantity}
                <button
                  onClick={() => onIncrease(item.product.id)}
                  disabled={item.quantity >= item.product.stockQuantity}
                >
                  +
                </button>
              </td>
              <td>{formatPrice(item.product.price * item.quantity)}</td>
              <td>
                <button onClick={() => onRemove(item.product.id)}>Remover</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Total: {formatPrice(total)}</h2>
      <button onClick={onBackToStore}>Continuar comprando</button>
      {/* NOVO: leva pro checkout */}
      <button onClick={onCheckout}>Finalizar compra</button>
    </div>
  );
}