import { Card, CardContent, CardHeader } from "@/components/ui/card";

const ProductDetailLoading = () => {
	return (
		<section className="space-y-6" aria-busy="true" aria-live="polite">
			<div className="h-5 w-32 animate-pulse rounded bg-muted" />
			<Card>
				<CardHeader className="space-y-3">
					<div className="h-8 w-56 animate-pulse rounded bg-muted" />
					<div className="h-4 w-40 animate-pulse rounded bg-muted" />
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="h-9 w-36 animate-pulse rounded bg-muted" />
					<div className="h-4 w-full animate-pulse rounded bg-muted" />
					<div className="h-4 w-5/6 animate-pulse rounded bg-muted" />
					<div className="grid gap-3 sm:grid-cols-2">
						<div className="h-4 w-40 animate-pulse rounded bg-muted" />
						<div className="h-4 w-32 animate-pulse rounded bg-muted" />
						<div className="h-4 w-36 animate-pulse rounded bg-muted" />
						<div className="h-4 w-48 animate-pulse rounded bg-muted" />
					</div>
				</CardContent>
			</Card>
		</section>
	);
};

export default ProductDetailLoading;
