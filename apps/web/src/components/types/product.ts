export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  sku: string;
  category: string;
  brand: string | null;
  rating: number;
  review_count: number;
  in_stock: number;
  stock_quantity: number;
  discount_percent: number;
}
