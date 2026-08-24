import { formatCurrency } from "@zapp/utils";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { H4, Paragraph, Text, XStack, YStack } from "tamagui";
import { API_URL } from "@/constant";

export default function ProductScreen() {
	const { id, name } = useLocalSearchParams<{ id: string; name?: string }>();
	const [product, setProduct] = useState<Product>();

	useEffect(() => {
		const controller = new AbortController();

		fetch(`${API_URL}/products/${id}`, { signal: controller.signal })
			.then((res) => res.json())
			.then(setProduct)
			.catch(console.error);

		return () => {
			controller.abort();
		};
	}, [id]);

	return (
		<YStack flex={1} gap="$2" padding="$4">
			<Stack.Screen options={{ title: product?.name ?? name ?? "Product" }} />
			{product ? (
				<>
					<H4>{product.name}</H4>
					<XStack gap="$2" alignItems="center">
						<Text>{formatCurrency(product.price)}</Text>
						<Text>
							{product.brand} · {product.category}
						</Text>
					</XStack>
					{product.description ? (
						<Paragraph size="$3" color="$gray10">
							{product.description}
						</Paragraph>
					) : null}
					<Text fontSize="$3" color={product.in_stock ? "$green10" : "$red10"}>
						{product.in_stock ? "In Stock" : "Out of Stock"}
					</Text>
				</>
			) : null}
		</YStack>
	);
}
