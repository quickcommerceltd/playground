import Link from "next/link";

export default function NotFound() {
	return (
		<div>
			<h1 className="mb-6 text-2xl font-bold">Product not found</h1>
			<p className="mb-4 text-sm text-muted-foreground">
				We couldn't find the product you were looking for.
			</p>
			<Link
				href="/products"
				className="text-sm text-muted-foreground hover:underline"
			>
				Back to products
			</Link>
		</div>
	);
}
