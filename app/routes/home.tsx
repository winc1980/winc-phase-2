import { repositoryContext } from "~/auth/context"
import { BrandIcon } from "~/components/common/BrandIcon"
import { verifyToken } from "~/sessions/jwt"
import { getSession } from "~/sessions/sessions"
import type { Route } from "./+types/home"

export async function loader({ request, context }: Route.LoaderArgs) {
	const session = await getSession(request.headers.get("Cookie"))
	const token = session.get("sessionToken")
	if (!token) return undefined

	const verificationResult = await verifyToken(token)

	if (!verificationResult.success) return undefined
	const payload = verificationResult.value

	const { userRepository } = context.get(repositoryContext)
	const user = await userRepository.getById(payload.id)

	if (!user.success) return undefined
	if (!user.value) return undefined

	return { user: user.value }
}

export default function ({ loaderData }: Route.ComponentProps) {
	return (
		<div>
			aaa
			<BrandIcon />
			{loaderData && <div>{loaderData.user.name}</div>}
		</div>
	)
}
