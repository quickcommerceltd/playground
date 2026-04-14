import { formatCurrency } from "@zapp/utils";
import Link from "next/link";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export type ProductListItem = {
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
};

type ProductListProps = {
	products: ProductListItem[];
};

export const ProductList = ({ products }: ProductListProps) => {
	if (products.length === 0) {
		return <p>No products found.</p>;
	}

	return (
		<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{products.map((product) => (
				<Link
					key={product.id}
					href={`/products/${product.id}`}
					className="block"
				>
					<Card className="h-full transition-colors hover:bg-muted/40">
						<CardHeader>
							<CardTitle>{product.name}</CardTitle>
							<CardDescription>
								{product.brand ? `${product.brand} · ` : ""}
								{product.category}
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
							</div>
						</CardContent>
					</Card>
				</Link>
			))}
		</div>
	);
};
