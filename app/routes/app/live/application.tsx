import { liveContext } from "~/middlewares/live"
import type { Route } from "./+types/application"

export function loader({ context }: Route.LoaderArgs) {
	const live = context.get(liveContext)
	return { live }
}

export default function LiveApplicationPage({
	loaderData,
}: Route.ComponentProps) {
	return <div>application</div>
}
