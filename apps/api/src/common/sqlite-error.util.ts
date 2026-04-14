export const isSqliteUniqueConstraintError = (
	error: unknown,
	columnName?: string,
) => {
	const code =
		typeof error === "object" &&
		error !== null &&
		"code" in error &&
		typeof error.code === "string"
			? error.code
			: undefined;

	const message = error instanceof Error ? error.message : "";
	const isUniqueConstraint =
		code === "SQLITE_CONSTRAINT_UNIQUE" ||
		code === "SQLITE_CONSTRAINT_PRIMARYKEY" ||
		message.includes("UNIQUE constraint failed");

	if (!isUniqueConstraint) {
		return false;
	}

	return columnName ? message.includes(columnName) : true;
};
