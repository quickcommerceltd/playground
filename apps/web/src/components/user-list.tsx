import { formatDate } from "@zapp/utils";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

export type UserListItem = {
	id: number;
	name: string;
	email: string;
	phone: string | null;
	role: string;
	is_active: number;
	created_at: string;
};

type UserListProps = {
	users: UserListItem[];
};

export const UserList = ({ users }: UserListProps) => {
	if (users.length === 0) {
		return <p>No users found.</p>;
	}

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>ID</TableHead>
					<TableHead>Name</TableHead>
					<TableHead>Email</TableHead>
					<TableHead>Phone</TableHead>
					<TableHead>Role</TableHead>
					<TableHead>Active</TableHead>
					<TableHead>Created</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{users.map((user) => (
					<TableRow key={user.id}>
						<TableCell>{user.id}</TableCell>
						<TableCell>{user.name}</TableCell>
						<TableCell>{user.email}</TableCell>
						<TableCell>{user.phone || "—"}</TableCell>
						<TableCell>{user.role}</TableCell>
						<TableCell>{user.is_active ? "Yes" : "No"}</TableCell>
						<TableCell>{formatDate(user.created_at)}</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
};
