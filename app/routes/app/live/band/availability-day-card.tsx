import { LoaderCircleIcon, PlusIcon, Trash2Icon } from "lucide-react"
import { useState } from "react"
import { useFetcher } from "react-router"
import { TimeInput } from "~/components/common/TimeInput"
import { Button } from "~/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "~/components/ui/card"
import { FieldSeparator } from "~/components/ui/field"
import type { PlainDateLike } from "~/lib/plain-date"
import { formatPlainDate, formatPlainTime } from "~/lib/plain-datetime-utils"
import { PlainTime, type PlainTimeLike } from "~/lib/plain-time"

// loader から渡ってくる時点で PlainDate / PlainTime はプレーンなオブジェクトに
// なっているので、構造的な型で受け取る
type AvailabilityDayCardProps = {
	liveDay: {
		id: number
		date: PlainDateLike
		start: PlainTimeLike
		end: PlainTimeLike
	}
	availabilities: {
		id: number
		start: PlainTimeLike
		end: PlainTimeLike
	}[]
}

export function AvailabilityDayCard({
	liveDay,
	availabilities,
}: AvailabilityDayCardProps) {
	const fetcher = useFetcher()
	const [start, setStart] = useState(
		() =>
			new PlainTime({ hour: liveDay.start.hour, minute: liveDay.start.minute }),
	)
	const [end, setEnd] = useState(
		() => new PlainTime({ hour: liveDay.end.hour, minute: liveDay.end.minute }),
	)

	return (
		<Card>
			<CardHeader>
				<CardTitle>{formatPlainDate(liveDay.date)}</CardTitle>
				<CardDescription>
					開催時間 {formatPlainTime(liveDay.start)}〜
					{formatPlainTime(liveDay.end)}
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				{availabilities.length === 0 ? (
					<p className="text-muted-foreground text-sm">
						この日の出演可能時間はまだ登録されていません
					</p>
				) : (
					<ul className="space-y-2">
						{availabilities.map((availability) => (
							<li
								key={availability.id}
								className="flex items-center justify-between rounded-md border px-3 py-2"
							>
								<span className="text-sm">
									{formatPlainTime(availability.start)}〜
									{formatPlainTime(availability.end)}
								</span>
								<fetcher.Form method="POST">
									<input
										type="hidden"
										name="intent"
										value="delete-availability"
									/>
									<input
										type="hidden"
										name="availability-id"
										value={availability.id}
									/>
									<Button
										type="submit"
										variant="ghost"
										size="icon-sm"
										aria-label="この出演可能時間を削除"
									>
										<Trash2Icon />
									</Button>
								</fetcher.Form>
							</li>
						))}
					</ul>
				)}

				<FieldSeparator />

				<fetcher.Form
					method="POST"
					className="flex gap-4 flex-col md:flex-row md:items-end"
				>
					<input type="hidden" name="intent" value="create-availability" />
					<input type="hidden" name="live-day-id" value={liveDay.id} />
					<input
						type="hidden"
						name="start"
						value={PlainTime.serde.serialize(start)}
					/>
					<input
						type="hidden"
						name="end"
						value={PlainTime.serde.serialize(end)}
					/>
					<div className="flex gap-4">
						<TimeInput label="開始時刻" value={start} onChange={setStart} />
						<TimeInput label="終了時刻" value={end} onChange={setEnd} />
					</div>
					<Button
						type="submit"
						className="min-w-24"
						disabled={fetcher.state === "submitting"}
					>
						{fetcher.state === "submitting" ? (
							<LoaderCircleIcon className="animate-spin" />
						) : (
							<PlusIcon />
						)}
						追加
					</Button>
				</fetcher.Form>
			</CardContent>
		</Card>
	)
}
