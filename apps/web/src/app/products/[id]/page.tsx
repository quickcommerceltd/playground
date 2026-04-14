import { formatCurrency } from "@zapp/utils";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

type Product = {
	id: number;
	name: string;
	description: string | null;
	price: number;
	sku: string;
	category: string;
	brand: string | null;
	image_url: string | null;
	thumbnail_url: string | null;
	weight: number | null;
	rating: number;
	review_count: number;
	in_stock: number;
	stock_quantity: number;
	discount_percent: number;
	tags: string | null;
	created_at: string;
	updated_at: string;
};

type ProductDetailPageProps = {
	params: Promise<{ id: string }>;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4992";

const getProduct = async (id: string): Promise<Product | null> => {
	const response = await fetch(`${API_URL}/v2/products/${id}`, {
		cache: "no-store",
	});

	if (response.status === 404) {
		return null;
	}

	if (!response.ok) {
		throw new Error("Failed to fetch product details.");
	}

	return response.json();
};

export default async function ProductDetailPage({
	params,
}: ProductDetailPageProps) {
	const { id } = await params;
	const parsedId = Number(id);

	if (!Number.isInteger(parsedId) || parsedId < 1) {
		notFound();
	}

	const product = await getProduct(id);

	if (!product) {
		notFound();
	}

	return (
		<section className="space-y-6">
			<Link
				href="/products"
				className="inline-flex text-sm text-muted-foreground hover:text-foreground"
			>
				Back to products
			</Link>
			<Card>
				<CardHeader>
					<CardTitle className="text-3xl">{product.name}</CardTitle>
					<CardDescription>
						{product.brand ? `${product.brand} · ` : ""}
						{product.category}
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="flex items-center gap-3">
						<span className="text-3xl font-bold">
							{formatCurrency(product.price)}
						</span>
						{product.discount_percent > 0 && (
							<span className="text-sm text-destructive">
								-{product.discount_percent}% off
							</span>
						)}
					</div>
					<p className="text-muted-foreground">
						{product.description || "No description provided."}
					</p>
					<div className="grid gap-2 text-sm sm:grid-cols-2">
						<p>
							<span className="font-medium">SKU:</span> {product.sku}
						</p>
						<p>
							<span className="font-medium">Stock:</span>{" "}
							{product.in_stock ? "In stock" : "Out of stock"}
						</p>
						<p>
							<span className="font-medium">Quantity:</span>{" "}
							{product.stock_quantity}
						</p>
						<p>
							<span className="font-medium">Rating:</span> {product.rating} (
							{product.review_count} reviews)
						</p>
					</div>
				</CardContent>
			</Card>
		</section>
	);
}
