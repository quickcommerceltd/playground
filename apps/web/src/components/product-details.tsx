"use client";

import { API_URL } from "@/lib/utils";
import { useCallback, useEffect, useState } from "react";
import { Product } from "./types/product";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { formatCurrency } from "@zapp/utils";

type ProductDetailProp = {
  id: string;
};

type ProductState = {
  product: Product | undefined;
  loading: boolean;
  error: boolean;
};

export default function ProductDetails({ id }: ProductDetailProp) {
  const [state, setState] = useState<ProductState>({
    product: undefined,
    loading: true,
    error: false,
  });

  const fetchProduct = useCallback(() => {
    setState((prev) => ({ ...prev, loading: true, error: false }));
    fetch(`${API_URL}/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((product) => setState({ product, loading: false, error: false }))
      .catch(() =>
        setState({ product: undefined, loading: false, error: true })
      );
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  if (state.loading) {
    return <p className="text-muted-foreground">Loading...</p>;
  }

  if (state.error || !state.product) {
    return (
      <div>
        <p className="text-muted-foreground">Something went wrong.</p>
        <button onClick={fetchProduct} className="mt-4 text-sm underline">
          Retry
        </button>
      </div>
    );
  }

  const { product } = state;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{product.name}</CardTitle>
        <CardDescription>
          {product.brand} · {product.category}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold">
            {formatCurrency(product.price)}
          </span>
          {product.discount_percent > 0 && (
            <span className="text-sm text-destructive">
              -{product.discount_percent}%
            </span>
          )}
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          {product.description}
        </p>
        <div className="mt-3 flex items-center gap-2 text-sm">
          <span>{product.in_stock ? "In Stock" : "Out of Stock"}</span>
          <span>·</span>
          <span>Stock: {product.stock_quantity}</span>
          <span>·</span>
          <span>SKU: {product.sku}</span>
        </div>
        <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
          <span>{product.rating} / 5</span>
          <span>·</span>
          <span>{product.review_count} reviews</span>
        </div>
      </CardContent>
    </Card>
  );
}
