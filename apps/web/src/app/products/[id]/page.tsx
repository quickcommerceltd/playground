import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/product-detail";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4992";

export default async function ProductDetailPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const res = await fetch(`${API_URL}/products/${id}`, { cache: "no-store" });

	if (res.status === 404) {
		notFound();
	}

	if (!res.ok) {
		throw new Error(`Failed to fetch product ${id}: ${res.status}`);
	}

	const text = await res.text();
	const product = text ? JSON.parse(text) : null;
	if (!product) {
		notFound();
	}

	return (
		<div>
			<ProductDetail product={product} />
		</div>
	);
}
