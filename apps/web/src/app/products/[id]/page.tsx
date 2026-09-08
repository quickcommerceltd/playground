import ProductDetails from "@/components/product-details";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailsPage({ params }: Props) {
  const { id } = await params;
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Products</h1>
      <ProductDetails id={id} />
    </div>
  );
}
