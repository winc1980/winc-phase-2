import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Separator } from "~/components/ui/separator"
import type { LiveApplication } from "~/domain/entities/live-application"
import { liveContext } from "~/middlewares/live"
import { repositoryContext } from "~/middlewares/repositories"
import type { Route } from "./+types/application"
import { ApplicationCreationFormCard } from "./application-creation-form-card"

export async function loader({ context }: Route.LoaderArgs) {
	const { live } = context.get(liveContext)

	const { liveRepository } = context.get(repositoryContext)
	const result = await liveRepository.getAllApplications(live.id)

	if (!result.success) throw result.error

	const applications = result.value

	return { live, applications }
}

export default function LiveApplicationPage({
	loaderData: { applications },
}: Route.ComponentProps) {
	const [availableApplications, suspendedApplications] = applications.reduce<
		[LiveApplication[], LiveApplication[]]
	>(
		(acc, apl) => {
			acc[apl.available ? 0 : 1].push(apl)
			return acc
		},
		[[], []],
	)

	return (
		<div className="space-y-6">
			<div className="space-y-1">
				<h1 className="text-2xl font-semibold">バンドの募集</h1>
				<p className="text-muted-foreground text-sm">
					参加を希望するバンドにこのURLを共有してください
				</p>
			</div>
			<ApplicationCreationFormCard />
			<Card>
				<CardHeader>
					<CardTitle>有効なリンク</CardTitle>
				</CardHeader>
				<CardContent>
					{availableApplications.length === 0 ? (
						<span className="text-muted-foreground text-sm">
							有効なリンクはありません
						</span>
					) : (
						availableApplications.map((apl) => (
							<div key={apl.id}>{apl.token}</div>
						))
					)}
				</CardContent>
				<Separator />
				<CardHeader>
					<CardTitle>停止されたリンク</CardTitle>
				</CardHeader>
				<CardContent>
					{suspendedApplications.length === 0 ? (
						<span className="text-muted-foreground text-sm">
							停止されたリンクはありません
						</span>
					) : (
						availableApplications.map((apl) => (
							<div key={apl.id}>{apl.token}</div>
						))
					)}
				</CardContent>
			</Card>
		</div>
	)
}

export async function action({ request }: Route.ActionArgs) {
	const formData = await request.formData()
	console.log(Object.fromEntries(formData))
}
