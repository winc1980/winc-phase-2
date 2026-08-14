import { PlusIcon } from "lucide-react"
import { Form } from "react-router"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import {
	Field,
	FieldDescription,
	FieldGroup,
	FieldLabel,
} from "~/components/ui/field"
import { Input } from "~/components/ui/input"
import { Textarea } from "~/components/ui/textarea"
import { useLiveDayFormData } from "~/hooks/useLiveDayFormData"
import { formatPlainDate } from "~/lib/utils"

export default function LiveCreatePage() {
	const { liveDays, addLiveDay, removeLiveDay } = useLiveDayFormData()
	return (
		<div className="space-y-6">
			<div className="space-y-1">
				<h1 className="text-2xl font-semibold">ライブの作成</h1>
				<p className="text-muted-foreground text-sm">
					ライブを作成してください
				</p>
			</div>

			<Card>
				<CardContent>
					<Form method="POST">
						<FieldGroup>
							<Field>
								<FieldLabel htmlFor="live-name">ライブの名前</FieldLabel>
								<Input
									id="live-name"
									name="live-name"
									placeholder="Summer Live 2026"
								/>
							</Field>
							<Field>
								<FieldLabel htmlFor="live-description">説明文</FieldLabel>
								<Textarea id="live-description" name="live-description" />
							</Field>
							<Field>
								<FieldLabel htmlFor="live-days">開催日</FieldLabel>
								<FieldDescription>複数日指定できます</FieldDescription>

								<div className="space-y-4">
									{liveDays.map((liveDay) => (
										<Card key={liveDay.id}>
											<CardHeader>
												<CardTitle>{formatPlainDate(liveDay.date)}</CardTitle>
											</CardHeader>
										</Card>
									))}
									<div className="flex gap-4 flex-col md:flex-row md:items-end">
										<div className="w-full grid grid-cols-[1fr_1fr_1fr] gap-y-1 gap-x-4">
											<div className="text-muted-foreground text-xs">日付</div>
											<div className="text-muted-foreground text-xs">
												開始時刻
											</div>
											<div className="text-muted-foreground text-xs">
												終了時刻
											</div>
											<Input />
											<Input />
											<Input />
										</div>
										<Button className="min-w-24">
											<PlusIcon />
											追加
										</Button>
									</div>
								</div>
							</Field>
						</FieldGroup>
					</Form>
				</CardContent>
			</Card>
		</div>
	)
}
