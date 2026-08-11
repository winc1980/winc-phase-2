import type { NamedError } from "./error"

export type Result<T, E extends NamedError> = Success<T> | Fail<E>

export type Success<T> = {
	success: true
	value: T
}

export type Fail<E extends NamedError> = {
	success: false
	error: E
}

export function success<T>(value: T): Success<T> {
	return { success: true, value }
}

export function fail<E extends NamedError>(error: E): Fail<E> {
	return { success: false, error }
}
