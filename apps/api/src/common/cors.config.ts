const defaultCorsOrigins = [
	"http://localhost:4991",
	"http://127.0.0.1:4991",
	"http://localhost:4994",
	"http://127.0.0.1:4994",
	"http://localhost:8081",
	"http://127.0.0.1:8081",
];

export const resolveCorsOrigins = (originsEnv = process.env.CORS_ORIGINS) => {
	if (!originsEnv?.trim()) {
		return defaultCorsOrigins;
	}

	return originsEnv
		.split(",")
		.map((origin) => origin.trim())
		.filter(Boolean);
};

export const createCorsOptions = (originsEnv = process.env.CORS_ORIGINS) => ({
	origin: resolveCorsOrigins(originsEnv),
	methods: ["GET", "POST", "OPTIONS"],
	allowedHeaders: ["Content-Type"],
	maxAge: 3600,
});
