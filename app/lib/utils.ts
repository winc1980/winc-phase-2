import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { PlainDateLike } from "./plain-date"
import type { PlainTimeLike } from "./plain-time"

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function formatPlainDate(
	date: PlainDateLike,
	options: { useYear?: boolean } = { useYear: false },
) {
	if (options.useYear)
		return `${date.year.toString().padStart(4, "0")}/${date.month.toString()}/${date.day.toString().padStart(2, "0")}`
	return `${date.month.toString()}/${date.day.toString().padStart(2, "0")}`
}

export function formatPlainTime(time: PlainTimeLike) {
	return `${time.hour.toString()}:${time.minute.toString().padStart(2, "0")}`
}
