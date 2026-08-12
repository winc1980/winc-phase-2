import { eq } from "drizzle-orm"
import type { DrizzleDB } from "~/db"
import { type UserTable, userTable } from "~/db/schema"
import { RepositoryError } from "~/domain/data/errors"
import type { User } from "~/domain/entities/user"
import { compareHashedPassword } from "~/lib/hash"
import { fail, type Result, success, wrapPromise } from "~/lib/result"

export interface UserRepository {
	getByMail(mail: string): Promise<Result<User | null, RepositoryError>>
	authenticateWithPassword(
		userId: number,
		password: string,
	): Promise<Result<boolean, RepositoryError>>
}

export class UserRepositoryImpl implements UserRepository {
	private readonly drift: DrizzleDB
	constructor(drift: DrizzleDB) {
		this.drift = drift
	}

	async getByMail(mail: string): Promise<Result<User | null, RepositoryError>> {
		const result = await wrapPromise(
			this.drift
				.select()
				.from(userTable)
				.where(eq(userTable.mail, mail))
				.limit(1),
		)

		if (!result.success)
			return fail(new RepositoryError("UserTableの処理が失敗しました"))

		const userRow = result.value[0] as UserTable | undefined

		if (!userRow) return success(null)

		const user: User = {
			id: userRow.id,
			name: userRow.name,
			mail: userRow.mail,
		}

		return success(user)
	}

	async authenticateWithPassword(userId: number, password: string) {
		const result = await wrapPromise(
			this.drift
				.select()
				.from(userTable)
				.where(eq(userTable.id, userId))
				.limit(1),
		)

		if (!result.success)
			return fail(new RepositoryError("UserTableの処理が失敗しました"))

		const user = result.value[0] as UserTable | undefined

		if (!user) return success(false)

		const isAuthenticated = await compareHashedPassword(
			password,
			user.passwordHash,
		)

		return success(isAuthenticated)
	}
}
