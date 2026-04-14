import { formatCurrency } from "@zapp/utils";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

interface Product {
	id: number;
	name: string;
	description: string | null;
	price: number;
	category: string;
	brand: string | null;
	in_stock: number;
}

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:4992";

export default function ProductsScreen() {
	const [products, setProducts] = useState<Product[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		setLoading(true);
		setError(null);
		fetch(`${API_URL}/v2/products`)
			.then((res) => {
				if (!res.ok) throw new Error(`HTTP ${res.status}`);
				return res.json();
			})
			.then(setProducts)
			.catch(() => setError("Failed to load products. Please try again later."))
			.finally(() => setLoading(false));
	}, []);

	if (loading) {
		return (
			<View style={styles.centeredState}>
				<Text>Loading products...</Text>
			</View>
		);
	}

	if (error) {
		return (
			<View style={styles.centeredState}>
				<Text style={styles.errorText}>{error}</Text>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<FlatList
				data={products}
				keyExtractor={(item) => String(item.id)}
				ItemSeparatorComponent={() => <View style={styles.separator} />}
				renderItem={({ item }) => (
					<View style={styles.card}>
						<Text style={styles.name}>{item.name}</Text>
						<Text style={styles.price}>{formatCurrency(item.price)}</Text>
						<Text style={styles.meta}>
							{item.brand ?? "Unknown brand"} · {item.category}
						</Text>
						{item.description ? (
							<Text style={styles.description}>{item.description}</Text>
						) : null}
						<Text
							style={[
								styles.stock,
								item.in_stock ? styles.inStock : styles.outOfStock,
							]}
						>
							{item.in_stock ? "In Stock" : "Out of Stock"}
						</Text>
					</View>
				)}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 8,
	},
	centeredState: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		padding: 16,
	},
	card: {
		borderRadius: 12,
		borderWidth: 1,
		borderColor: "#d1d5db",
		backgroundColor: "#ffffff",
		padding: 16,
	},
	name: {
		fontSize: 20,
		fontWeight: "600",
	},
	price: {
		marginTop: 8,
		fontSize: 24,
		fontWeight: "700",
	},
	meta: {
		marginTop: 6,
		fontSize: 12,
		color: "#6b7280",
	},
	description: {
		marginTop: 8,
		fontSize: 14,
		color: "#374151",
	},
	stock: {
		marginTop: 10,
		fontSize: 12,
		fontWeight: "600",
	},
	inStock: {
		color: "#166534",
	},
	outOfStock: {
		color: "#b91c1c",
	},
	errorText: {
		color: "#b91c1c",
	},
	separator: {
		height: 8,
	},
});
