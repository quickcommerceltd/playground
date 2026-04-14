import { formatDate } from "@zapp/utils";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

interface User {
	id: number;
	name: string;
	email: string;
	role: string;
	created_at: string;
}

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:4992";

export default function UsersScreen() {
	const [users, setUsers] = useState<User[]>([]);

	useEffect(() => {
		fetch(`${API_URL}/users`)
			.then((res) => res.json())
			.then(setUsers)
			.catch(console.error);
	}, []);

	return (
		<View style={styles.container}>
			<FlatList
				data={users}
				keyExtractor={(item) => String(item.id)}
				ItemSeparatorComponent={() => <View style={styles.separator} />}
				renderItem={({ item }) => (
					<View style={styles.row}>
						<Text style={styles.name}>{item.name}</Text>
						<Text style={styles.email}>{item.email}</Text>
						<Text style={styles.meta}>
							{item.role} · {formatDate(item.created_at)}
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
	},
	row: {
		paddingHorizontal: 16,
		paddingVertical: 12,
	},
	name: {
		fontSize: 18,
		fontWeight: "600",
	},
	email: {
		marginTop: 4,
		fontSize: 14,
		color: "#374151",
	},
	meta: {
		marginTop: 6,
		fontSize: 12,
		color: "#6b7280",
	},
	separator: {
		height: StyleSheet.hairlineWidth,
		backgroundColor: "#d1d5db",
	},
});
