import { ChevronsUpDownIcon, LoaderCircleIcon, SendIcon } from "lucide-react"
import { useRef, useState } from "react"
import { useFetcher } from "react-router"
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "~/components/ui/alert-dialog"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "~/components/ui/collapsible"
import {
	Field,
	FieldDescription,
	FieldGroup,
	FieldLabel,
} from "~/components/ui/field"
import { Input } from "~/components/ui/input"
import { Switch } from "~/components/ui/switch"

export function ApplicationCreationFormCard() {
	const [openCreateDialog, setOpenCreateDialog] = useState(false)
	const [initialAvailability, setInitialAvailability] = useState(false)

	const formRef = useRef<HTMLFormElement>(null)
	const fetcher = useFetcher()

	return (
		<Collapsible>
			<Card>
				<CardHeader>
					<CardTitle className="flex justify-between items-center">
						<div>新しいバンド募集リンクを作成</div>
						<CollapsibleTrigger asChild>
							<Button size="icon" variant="ghost">
								<ChevronsUpDownIcon />
							</Button>
						</CollapsibleTrigger>
					</CardTitle>
				</CardHeader>
				<CollapsibleContent asChild>
					<CardContent>
						<fetcher.Form method="POST" ref={formRef}>
							<input type="hidden" name="intent" value="create" />
							<FieldGroup>
								<Field>
									<FieldLabel htmlFor="application-name">
										募集名（任意）
									</FieldLabel>
									<FieldDescription>
										ライブ管理者の識別のためにのみ使用します
									</FieldDescription>
									<Input
										id="application-name"
										name="application-name"
										placeholder="募集"
									/>
								</Field>
								<Field>
									<FieldLabel>初期設定</FieldLabel>
									<div className="inline-flex gap-2">
										<Switch
											id="available"
											checked={initialAvailability}
											onCheckedChange={setInitialAvailability}
										/>
										<input
											type="hidden"
											name="initial-available"
											value={Number(initialAvailability)}
										/>
										<FieldLabel htmlFor="available">停止・有効</FieldLabel>
									</div>
								</Field>
								<Field>
									<Button
										type="button"
										className="w-full"
										onClick={() => setOpenCreateDialog(true)}
										disabled={fetcher.state === "submitting"}
									>
										{fetcher.state === "submitting" ? (
											<LoaderCircleIcon className="animate-spin" />
										) : (
											<SendIcon />
										)}
										作成
									</Button>
								</Field>
							</FieldGroup>
						</fetcher.Form>
					</CardContent>
				</CollapsibleContent>
			</Card>
			<AlertDialog open={openCreateDialog} onOpenChange={setOpenCreateDialog}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							本当に募集を始めてもいいですか？
						</AlertDialogTitle>
						<AlertDialogDescription>
							<span>
								現在の初期設定は「{initialAvailability ? "有効" : "停止"}
								」です。
							</span>
							<span>いつでも停止・再開できます。</span>
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>キャンセル</AlertDialogCancel>
						<AlertDialogAction
							type="button"
							onClick={() => {
								// if (formRef.current) fetcher.submit(formRef.current)
							}}
						>
							募集を始める
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</Collapsible>
	)
}
