import { useState } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import Store from './pages/Store';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import { authService } from './services/authService';
import type { CartItem, Product } from './types';

type View = 'store' | 'admin' | 'cart' | 'checkout';

const STORE_NAME = 'NOVA'; // NOVO: troque pelo nome da sua loja

export default function App() {
  const [logged, setLogged] = useState(authService.isLogged());
  const [showRegister, setShowRegister] = useState(false);
  const [view, setView] = useState<View>('store');
  const [cart, setCart] = useState<CartItem[]>([]);

  const isAdmin = authService.isAdmin();

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  // NOVO: qual aba do menu está ativa
  const storeClass = view === 'store' ? 'nav-link active' : 'nav-link';
  const adminClass = view === 'admin' ? 'nav-link active' : 'nav-link';
  const cartClass =
    view === 'cart' || view === 'checkout' ? 'nav-link active' : 'nav-link';

  function addToCart(product: Product) {
    if (product.stockQuantity === 0) return;

    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);

      if (!existing) {
        return [...prev, { product, quantity: 1 }];
      }

      if (existing.quantity >= product.stockQuantity) {
        return prev;
      }

      return prev.map((item) =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    });
  }

  function increaseItem(productId: number) {
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId &&
        item.quantity < item.product.stockQuantity
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  }

  function decreaseItem(productId: number) {
    setCart((prev) => {
      const updated = prev.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );
      return updated.filter((item) => item.quantity > 0);
    });
  }

  function removeItem(productId: number) {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  }

  function handleOrderPlaced() {
    setCart([]);
  }

  function handleLogout() {
    authService.logout();
    setView('store');
    setCart([]);
    setLogged(false);
  }

  if (!logged) {
    if (showRegister) {
      return <Register onBack={() => setShowRegister(false)} />;
    }

    return (
      <Login
        onLogin={() => setLogged(true)}
        onGoToRegister={() => setShowRegister(true)}
      />
    );
  }

  // ALTERADO: agora tem barra de aviso, cabeçalho, conteúdo e rodapé
  return (
    <>
      <div className="announcement">
        <div className="container announcement-inner">
          <span>Loja de demonstração</span>
          <span>Pagamento simulado</span>
          <span>Projeto acadêmico</span>
        </div>
      </div>

      <header className="site-header">
        <div className="container header-inner">
          <div className="brand">
            <span className="brand-mark">{STORE_NAME.charAt(0)}</span>
            <span className="brand-text">
              <strong>{STORE_NAME}</strong>
              <small>HARDWARE</small>
            </span>
          </div>

          <nav className="main-nav">
            <button className={storeClass} onClick={() => setView('store')}>
              Loja
            </button>
            {isAdmin && (
              <button className={adminClass} onClick={() => setView('admin')}>
                Gerenciar produtos
              </button>
            )}
          </nav>

          <div className="header-actions">
            <button className={cartClass} onClick={() => setView('cart')}>
              Carrinho ({cartCount})
            </button>
            <button className="nav-link" onClick={handleLogout}>
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="container">
        {view === 'store' && <Store cart={cart} onAdd={addToCart} />}
        {view === 'admin' && <Products />}
        {view === 'cart' && (
          <Cart
            cart={cart}
            onIncrease={increaseItem}
            onDecrease={decreaseItem}
            onRemove={removeItem}
            onBackToStore={() => setView('store')}
            onCheckout={() => setView('checkout')}
          />
        )}
        {view === 'checkout' && (
          <Checkout
            cart={cart}
            onOrderPlaced={handleOrderPlaced}
            onBackToCart={() => setView('cart')}
            onBackToStore={() => setView('store')}
          />
        )}
      </main>

      <footer className="site-footer">
        <div className="container footer-inner">
          <p>
            Projeto acadêmico de loja virtual, feito com React, TypeScript e uma
            API em Spring Boot.
          </p>
          <span className="mono-label">
            © {new Date().getFullYear()} {STORE_NAME} HARDWARE
          </span>
        </div>
      </footer>
    </>
  );
}