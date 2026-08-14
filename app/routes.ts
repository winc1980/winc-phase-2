import {
	index,
	layout,
	prefix,
	type RouteConfig,
	route,
} from "@react-router/dev/routes"

export default [
	layout("./routes/root-layout.tsx", [
		index("routes/home.tsx"),
		...prefix("auth", [
			route("login", "./routes/auth/login.tsx"),
			route("logout", "./routes/auth/logout.tsx"),
			route("register", "./routes/auth/register.tsx"),
		]),
		...prefix("app", [
			layout("./routes/app/app-middleware.tsx", [
				layout("./routes/app/app-layout.tsx", [
					index("./routes/app/home.tsx"),
					...prefix("live", [route("create", "./routes/app/live/create.tsx")]),
				]),

				...prefix("live/:liveId", [
					layout("./routes/app/live/live-middleware.tsx", [
						layout("./routes/app/live/live-layout.tsx", [
							index("./routes/app/live/home.tsx"),
							route("application", "./routes/app/live/application.tsx"),
						]),
						...prefix("band/:bandId", [
							layout("./routes/app/live/band/band-middleware.tsx", [
								layout("./routes/app/live/band/band-layout.tsx", [
									index("./routes/app/live/band/home.tsx"),
								]),
							]),
						]),
					]),
				]),
			]),
		]),
	]),
	route("*", "./routes/not-found.tsx"),
] satisfies RouteConfig
