import type { Product } from "@/f/types/product";

export type ProductCardProps = {
  product: Product;
  onClick?: (product: Product) => void;
  className?: string;
  children?: React.ReactNode;
  lang: string;
  t?: any;
} & React.HTMLAttributes<HTMLDivElement>;
