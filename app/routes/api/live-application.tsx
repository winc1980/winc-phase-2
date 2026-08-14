import type { Route } from "./+types/live-application"

export default function LiveApplication({ params }: Route.ComponentProps) {
	return <div>token: {params.token}</div>
}
