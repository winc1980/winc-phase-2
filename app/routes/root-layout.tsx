import { useEffect } from "react"
import { data, Outlet } from "react-router"
import { showToast } from "~/components/common/toast"
import { Toaster } from "~/components/ui/sonner"
import { repositoryMiddleware } from "~/middlewares/repositories"
import { commitSession, getSession } from "~/sessions/sessions"
import type { Route } from "./+types/root-layout"

export const middleware: Route.MiddlewareFunction[] = [repositoryMiddleware]

export async function loader({ request }: Route.LoaderArgs) {
	const session = await getSession(request.headers.get("Cookie"))
	const toastPayload = session.get("toastPayload")
	return data(
		{ toastPayload },
		{ headers: { "Set-Cookie": await commitSession(session) } },
	)
}

export default function RootLayout({ loaderData }: Route.ComponentProps) {
	useEffect(() => {
		if (loaderData.toastPayload) {
			showToast(loaderData.toastPayload)
		}
	}, [loaderData.toastPayload])
	return (
		<>
			<Toaster />
			<Outlet />
		</>
	)
}
