import { CopyIcon, PauseIcon, PlayIcon } from "lucide-react"
import { useFetcher } from "react-router"
import { showToast } from "~/components/common/toast"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Separator } from "~/components/ui/separator"
import { formatPlainDateTime } from "~/lib/plain-datetime-utils"
import { wrapPromise } from "~/lib/result"
import type { LiveApplicationWithUrl } from "./application"

export function ApplicationActivationCard({
	availableApplicationsWithUrl,
	suspendedApplicationsWithUrl,
}: {
	availableApplicationsWithUrl: LiveApplicationWithUrl[]
	suspendedApplicationsWithUrl: LiveApplicationWithUrl[]
}) {
	const fetcher = useFetcher()

	const handleCopy = async (url: string) => {
		const result = await wrapPromise(navigator.clipboard.writeText(url))
		if (!result.success) {
			showToast({
				type: "error",
				message: "クリップボードへのコピーが失敗しました",
			})
		}
		showToast({ type: "success", message: "申請リンクをコピーしました" })
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex gap-1 items-center">有効なリンク</CardTitle>
			</CardHeader>
			<CardContent>
				{availableApplicationsWithUrl.length === 0 ? (
					<span className="text-muted-foreground text-sm">
						有効なリンクはありません
					</span>
				) : (
					<div className="space-y-4">
						{availableApplicationsWithUrl.map((apl) => (
							<div className="space-y-1" key={apl.id}>
								<div className="w-full flex items-baseline gap-2">
									<span className="shrink-0">{apl.name}</span>
									<span className="shrink-0 text-muted-foreground text-xs">
										{formatPlainDateTime(apl.updatedAt)}
									</span>
								</div>
								<div className="flex gap-2 items-center">
									<div className="grow truncate text-muted-foreground py-2 px-4 bg-muted rounded-lg">
										{apl.url}
									</div>
									<Button
										size="icon-lg"
										variant="destructive"
										onClick={() => {
											const formData = new FormData()
											formData.append("intent", "suspend-application")
											formData.append("application-id", String(apl.id))
											fetcher.submit(formData, { method: "POST" })
										}}
									>
										<PauseIcon />
									</Button>
									<Button
										size="icon-lg"
										className="w-16"
										onClick={() => handleCopy(apl.url)}
									>
										<CopyIcon />
									</Button>
								</div>
							</div>
						))}
					</div>
				)}
			</CardContent>
			<Separator />
			<CardHeader>
				<CardTitle className="flex gap-1 items-center">
					停止されたリンク
				</CardTitle>
			</CardHeader>
			<CardContent>
				{suspendedApplicationsWithUrl.length === 0 ? (
					<span className="text-muted-foreground text-sm">
						有効なリンクはありません
					</span>
				) : (
					<div className="space-y-4">
						{suspendedApplicationsWithUrl.map((apl) => (
							<div className="space-y-1" key={apl.id}>
								<div className="shrink-0 inline-flex w-24 gap-2">
									<span className="shrink-0">{apl.name}</span>
									<span className="shrink-0 text-muted-foreground">
										{formatPlainDateTime(apl.updatedAt)}
									</span>
								</div>
								<div className="flex gap-2 items-center">
									<div className="grow truncate text-muted-foreground py-2 px-4 bg-muted rounded-lg">
										{apl.url}
									</div>
									<Button
										size="icon-lg"
										variant="destructive"
										onClick={() => {
											const formData = new FormData()
											formData.append("intent", "enable-application")
											formData.append("application-id", String(apl.id))
											fetcher.submit(formData, { method: "POST" })
										}}
									>
										<PlayIcon />
									</Button>
									<Button
										size="icon-lg"
										className="w-16"
										onClick={() => handleCopy(apl.url)}
									>
										<CopyIcon />
									</Button>
								</div>
							</div>
						))}
					</div>
				)}
			</CardContent>
		</Card>
	)
}
