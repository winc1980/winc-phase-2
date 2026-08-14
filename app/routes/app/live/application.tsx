import { redirect } from "react-router"
import * as v from "valibot"
import type { LiveApplication } from "~/domain/entities/live-application"
import { createApplicationUrl } from "~/domain/service/create-application-url"
import { wrapPromise } from "~/lib/result"
import { liveContext } from "~/middlewares/live"
import { repositoryContext } from "~/middlewares/repositories"
import {
	createSessionCommittedHeader,
	getSessionFromRequest,
} from "~/sessions/sessions"
import type { Route } from "./+types/application"
import { ApplicationActivationCard } from "./application-activation-card"
import { ApplicationCreationFormCard } from "./application-creation-form-card"

export type LiveApplicationWithUrl = LiveApplication & { url: string }

export async function loader({ context, request }: Route.LoaderArgs) {
	const { live, isOwner } = context.get(liveContext)

	const session = await getSessionFromRequest(request)

	if (!isOwner) {
		session.flash("toastPayload", {
			type: "error",
			message: "ライブ管理者ではないのでアクセスできません",
		})
		return redirect(`/app/live/${live.id}`)
	}

	const { liveRepository } = context.get(repositoryContext)
	const result = await liveRepository.getAllApplications(live.id)

	if (!result.success) throw result.error

	const applications = result.value

	const [availableApplicationsWithUrl, suspendedApplicationsWithUrl] =
		applications
			.map<LiveApplicationWithUrl>((apl) => ({
				...apl,
				url: createApplicationUrl(
					apl.token,
					new URL(request.url).origin,
					`${live.name}への参加の申請を受け付けています！`,
				),
			}))
			.reduce<[LiveApplicationWithUrl[], LiveApplicationWithUrl[]]>(
				(acc, apl) => {
					acc[apl.available ? 0 : 1].push(apl)
					return acc
				},
				[[], []],
			)

	return {
		availableApplicationsWithUrl,
		suspendedApplicationsWithUrl,
	}
}

export default function LiveApplicationPage({
	loaderData: { availableApplicationsWithUrl, suspendedApplicationsWithUrl },
}: Route.ComponentProps) {
	return (
		<div className="space-y-6">
			<div className="space-y-1">
				<h1 className="text-2xl font-semibold">バンドの募集</h1>
				<p className="text-muted-foreground text-sm">
					参加を希望するバンドにこのURLを共有してください
				</p>
			</div>
			<ApplicationCreationFormCard />
			<ApplicationActivationCard
				availableApplicationsWithUrl={availableApplicationsWithUrl}
				suspendedApplicationsWithUrl={suspendedApplicationsWithUrl}
			/>
		</div>
	)
}

const FormDataSchema = v.variant("intent", [
	v.pipe(
		v.object({
			intent: v.literal("create"),
			"application-name": v.pipe(
				v.string(),
				v.transform((input) => (input === "" ? "募集" : input)),
			),
			"initial-available": v.pipe(
				v.string(),
				v.transform((input) => input === "1"),
				v.boolean(),
			),
		}),
		v.transform((input) => ({
			intent: input.intent,
			applicationName: input["application-name"],
			initialAvailable: input["initial-available"],
		})),
	),
	v.pipe(
		v.object({
			intent: v.picklist(["suspend-application", "enable-application"]),
			"application-id": v.pipe(
				v.string(),
				v.transform((input) => Number(input)),
			),
		}),
		v.transform((input) => ({
			intent: input.intent,
			applicationId: input["application-id"],
		})),
	),
])

export async function action({ request, context }: Route.ActionArgs) {
	const session = await getSessionFromRequest(request)

	const formData = await request.formData()
	const parseResult = await wrapPromise(
		v.parseAsync(FormDataSchema, Object.fromEntries(formData)),
	)

	if (!parseResult.success) {
		session.flash("toastPayload", {
			type: "error",
			message: "エラー：フォームの形式が不明です",
		})
		return new Response(null, {
			headers: await createSessionCommittedHeader(session),
		})
	}

	const formPayload = parseResult.value

	if (formPayload.intent === "create") {
		const { liveRepository } = context.get(repositoryContext)
		const { live } = context.get(liveContext)

		const creationResult = await liveRepository.createApplication(
			live.id,
			formPayload.applicationName,
			formPayload.initialAvailable,
		)

		if (!creationResult.success) {
			session.flash("toastPayload", {
				type: "error",
				message: "データベースエラー",
			})
			return new Response(null, {
				headers: await createSessionCommittedHeader(session),
			})
		}
		return
	}

	if (formPayload.intent === "suspend-application") {
		const { liveRepository } = context.get(repositoryContext)
		const result = await liveRepository.suspendApplication(
			formPayload.applicationId,
		)
		if (!result.success) {
			session.flash("toastPayload", {
				type: "error",
				message: "データベースエラー",
			})
			return new Response(null, {
				headers: await createSessionCommittedHeader(session),
			})
		}
		session.flash("toastPayload", {
			type: "info",
			message: "一つの募集を停止しました",
		})
		return new Response(null, {
			headers: await createSessionCommittedHeader(session),
		})
	}

	if (formPayload.intent === "enable-application") {
		const { liveRepository } = context.get(repositoryContext)
		const result = await liveRepository.enableApplication(
			formPayload.applicationId,
		)
		if (!result.success) {
			session.flash("toastPayload", {
				type: "error",
				message: "データベースエラー",
			})
			return new Response(null, {
				headers: await createSessionCommittedHeader(session),
			})
		}
		session.flash("toastPayload", {
			type: "info",
			message: "一つの募集を再開しました",
		})
		return new Response(null, {
			headers: await createSessionCommittedHeader(session),
		})
	}
}
