import Link from "next/link";

const ProductNotFoundPage = () => {
	return (
		<section className="space-y-4">
			<Link
				href="/products"
				className="inline-flex text-sm text-muted-foreground hover:text-foreground"
			>
				Back to products
			</Link>
			<h1 className="text-2xl font-bold">Product not found</h1>
			<p className="text-muted-foreground">
				The product URL is invalid or the item does not exist.
			</p>
		</section>
	);
};

export default ProductNotFoundPage;
