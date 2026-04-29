import { formatCurrency } from "@zapp/utils";
import Link from "next/link";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

interface Product {
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

export function ProductDetail({ product }: { product: Product }) {
	return (
		<div>
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
						<span>SKU: {product.sku}</span>
						<span>·</span>
						<span>
							★ {product.rating} ({product.review_count})
						</span>
					</div>
				</CardContent>
			</Card>
			<Link
				href="/products"
				className="mt-4 inline-block text-sm text-muted-foreground hover:underline"
			>
				Back to products
			</Link>
		</div>
	);
}
