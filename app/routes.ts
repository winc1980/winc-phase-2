import {
	index,
	prefix,
	type RouteConfig,
	route,
} from "@react-router/dev/routes"

export default [
	index("routes/home.tsx"),
	...prefix("auth", [
		route("login", "./routes/auth/login.tsx"),
		route("logout", "./routes/auth/logout.tsx"),
		route("register", "./routes/auth/register.tsx"),
	]),
	...prefix("app", [index("./routes/app/index.tsx")]),
] satisfies RouteConfig
