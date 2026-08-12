import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router"

import type { Route } from "./+types/root"
import "./app.css"
import { repositoryDIMiddleware } from "./middlewares/repositories/middleware"

export const links: Route.LinksFunction = () => [
	{ rel: "preconnect", href: "https://fonts.googleapis.com" },
	{
		rel: "preconnect",
		href: "https://fonts.gstatic.com",
		crossOrigin: "anonymous",
	},
	{
		rel: "stylesheet",
		href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
	},
	{
		rel: "icon",
		href: "/favicon.svg",
		type: "image/svg+xml",
	},
]

export function Layout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="ja">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<title>軽音タイムテーブル</title>
				<Meta />
				<Links />
			</head>
			<body className="h-svh">
				{children}
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	)
}

export type RootMiddleWareFunction = Route.MiddlewareFunction
export const middleware: RootMiddleWareFunction[] = [repositoryDIMiddleware]

export default function App() {
	return <Outlet />
}
