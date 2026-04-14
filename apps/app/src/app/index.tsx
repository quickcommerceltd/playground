import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
	const router = useRouter();

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Zapp</Text>
			<Pressable style={styles.button} onPress={() => router.push("/users")}>
				<Text style={styles.buttonLabel}>View Users</Text>
			</Pressable>
			<Pressable style={styles.button} onPress={() => router.push("/products")}>
				<Text style={styles.buttonLabel}>View Products</Text>
			</Pressable>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		padding: 16,
		gap: 16,
	},
	title: {
		fontSize: 32,
		fontWeight: "700",
	},
	button: {
		minWidth: 180,
		borderRadius: 10,
		backgroundColor: "#111827",
		paddingHorizontal: 16,
		paddingVertical: 12,
	},
	buttonLabel: {
		color: "#ffffff",
		fontSize: 16,
		fontWeight: "600",
		textAlign: "center",
	},
});
