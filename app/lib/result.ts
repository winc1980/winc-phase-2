export type Result<T, E extends Error> = Success<T> | Fail<E>

export type Success<T> = {
	success: true
	value: T
}

export type Fail<E extends Error> = {
	success: false
	error: E
}

export function success<T>(value: T): Success<T> {
	return { success: true, value }
}

export function fail<E extends Error>(error: E): Fail<E> {
	return { success: false, error }
}
