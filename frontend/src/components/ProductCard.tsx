import { useState } from 'react'; // NOVO
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
  quantityInCart: number;
  onAdd: (product: Product) => void;
}

export default function ProductCard({
  product,
  quantityInCart,
  onAdd,
}: ProductCardProps) {
  const [imageFailed, setImageFailed] = useState(false); // NOVO

  const soldOut = product.stockQuantity === 0;
  const reachedLimit = quantityInCart >= product.stockQuantity;

  let buttonLabel = 'Adicionar ao carrinho';
  if (soldOut) {
    buttonLabel = 'Indisponível';
  } else if (reachedLimit) {
    buttonLabel = 'Limite atingido';
  }

  return (
    <article className="product-card">
      {/* NOVO: área da imagem */}
      <div className="product-image">
        {product.imageUrl && !imageFailed ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            onError={() => setImageFailed(true)}
          />
        ) : (
          <span className="product-image-placeholder">{product.category}</span>
        )}
        {soldOut && <span className="product-badge">Esgotado</span>}
      </div>

      {/* ALTERADO: o texto agora fica dentro do product-body */}
      <div className="product-body">
        <span className="product-category">{product.category}</span>
        <h3>{product.name}</h3>
        <p className="product-price">
          {product.price.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          })}
        </p>
        <p>{soldOut ? 'Sem estoque' : `${product.stockQuantity} em estoque`}</p>

        {quantityInCart > 0 && <p>No carrinho: {quantityInCart}</p>}

        <button onClick={() => onAdd(product)} disabled={reachedLimit}>
          {buttonLabel}
        </button>
      </div>
    </article>
  );
}