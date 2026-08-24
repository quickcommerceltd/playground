import { formatCurrency } from "@zapp/utils";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList } from "react-native";
import { Card, H4, Paragraph, Separator, Text, XStack, YStack } from "tamagui";
import { API_URL } from "@/constant";

export default function ProductsScreen() {
	const [products, setProducts] = useState<Product[]>([]);

	useEffect(() => {
		const controller = new AbortController();

		fetch(`${API_URL}/products`, { signal: controller.signal })
			.then((res) => res.json())
			.then(setProducts)
			.catch(console.error);

		return () => {
			controller.abort();
		};
	}, []);

	return (
		<YStack flex={1} padding="$2">
			<FlatList
				data={products}
				keyExtractor={(item) => String(item.id)}
				ItemSeparatorComponent={() => <Separator marginVertical="$2" />}
				renderItem={({ item }) => (
					<Card padding="$4">
						<Link
							href={{
								pathname: "/products/[id]",
								params: { id: item.id, name: item.name },
							}}
						>
							<H4>{item.name}</H4>
							<XStack gap="$2" alignItems="center">
								<Text fontSize="$6" fontWeight="bold">
									{formatCurrency(item.price)}
								</Text>
								<Text fontSize="$2" color="$gray10">
									{item.brand} · {item.category}
								</Text>
							</XStack>
							{item.description && (
								<Paragraph size="$2" color="$gray11" marginTop="$1">
									{item.description}
								</Paragraph>
							)}
							<Text
								fontSize="$2"
								marginTop="$2"
								color={item.in_stock ? "$green10" : "$red10"}
							>
								{item.in_stock ? "In Stock" : "Out of Stock"}
							</Text>
						</Link>
					</Card>
				)}
			/>
		</YStack>
	);
}
