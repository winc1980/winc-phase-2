import { redirect } from "react-router"
import { bandContext } from "~/middlewares/band"
import { liveContext } from "~/middlewares/live"
import {
	createSessionCommittedHeader,
	getSessionFromRequest,
} from "~/sessions/sessions"
import type { Route } from "./+types/availability"

export async function loader({ context, request }: Route.LoaderArgs) {
	const { live } = context.get(liveContext)
	const { isApproved, band, isLeader } = context.get(bandContext)

	const session = await getSessionFromRequest(request)

	if (!isLeader) {
		session.flash("toastPayload", {
			type: "error",
			message: "あなたはバンドリーダーではありません",
		})
		return redirect(`/app/live/${live.id}/band/${band.id}`, {
			headers: await createSessionCommittedHeader(session),
		})
	}

	if (!isApproved) {
		session.flash("toastPayload", {
			type: "error",
			message: "申請中です。アクセスできません。",
		})
		return redirect(`/app/live/${live.id}/band/${band.id}`, {
			headers: await createSessionCommittedHeader(session),
		})
	}
}

export default function BandAvailabilityPage() {
	return <div>availability</div>
}
