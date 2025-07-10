import React from 'react';
import { trackGAEvent } from "@/f/utils/track";
import { messages } from "@/f/config/messageConfig";

type Product = {
  id: string | number;
  name: string;
  image: string;
  price: number;
  description?: string;
  [key: string]: any;
};

type ProductCardProps = {
  product: Product;
  onClick?: (product: Product) => void;
  className?: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onClick,
  className = "",
  children,
  ...rest
}) => {

  return (
    <div 
      className="rounded-2xl shadow-md p-4 bg-white hover:shadow-lg transition"
      onClick={() => onClick && onClick(product)}
      {...rest}
    >
      <img src={product.image} alt={product.name} className="product-card-img" />
      <div className="product-card-body">
        <h2 className="product-card-title">{product.name}</h2>
        {product.description && (
          <p className="product-card-description">{product.description}</p>
        )}
        <div className="product-card-price">{product.price.toLocaleString()}</div>
        {children}
      </div>
    </div>
  );
};