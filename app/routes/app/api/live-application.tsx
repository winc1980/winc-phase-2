// export function loader({params, context, request}: Route.LoaderArgs) [

import type { Route } from "../api/+types/live-application"

export async function loader({ params, context, request }: Route.LoaderArgs) {}

export default function LiveApplication({ params }: Route.ComponentProps) {
	return <div>token: {params.token}</div>
}
