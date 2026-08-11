export abstract class NamedError extends Error {
	public readonly name: string
	public readonly message: string

	constructor(name: string, message: string) {
		super(message)
		this.name = name
		this.message = message
	}
}
