import { BaseError } from "~/lib/error"

export class RepositoryError extends BaseError {
	name = "RepositoryError"
}

export class UserNotFoundError extends BaseError {
	name = "UserNotFoundError"
}
