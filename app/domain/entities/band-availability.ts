import type { PlainTime } from "~/lib/plain-time"

export type BandAvailability = {
	id: number
	bandId: string
	liveId: string
	liveDayId: string
	start: PlainTime
	end: PlainTime
}
