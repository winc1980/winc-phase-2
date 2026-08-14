import { useState } from "react"
import { BrandIcon } from "~/components/common/BrandIcon"
import { DateInput } from "~/components/common/DateInput"
import { TimeInput } from "~/components/common/TimeInput"
import { PlainDate } from "~/lib/plain-date"
import { PlainTime } from "~/lib/plain-time"
import { repositoryContext } from "~/middlewares/repositories"
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
	const [date, setDate] = useState(
		() => new PlainDate({ year: 2026, month: 11, day: 4 }),
	)
	const [time, setTime] = useState(
		() => new PlainTime({ hour: 23, minute: 35 }),
	)
	const [hideYear, setHideYear] = useState(false)
	return (
		<div>
			<div>
				<button
					type="button"
					onClick={() => {
						setHideYear(!hideYear)
					}}
				>
					年の表示変更
				</button>
			</div>
			<div>
				<div>{date.day}日</div>
				<div>{date.month}月</div>
				<div>{date.year}年</div>
				<DateInput
					hideYear={hideYear}
					value={date}
					onChange={setDate}
				></DateInput>
			</div>
			<div>
				<div>{time.hour}時</div>
				<div>{time.minute}分</div>
				<TimeInput value={time} onChange={setTime}></TimeInput>
			</div>
			<BrandIcon />
			{loaderData && <div>{loaderData.user.name}</div>}
		</div>
	)
}
