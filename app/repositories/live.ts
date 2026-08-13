import { eq } from "drizzle-orm"
import type { DrizzleDB } from "~/db"
import { type LiveTable, liveTable } from "~/db/schema"
import { RepositoryError } from "~/domain/data/errors"
import type { Live } from "~/domain/entities/live"
import { fail, type Result, success, wrapPromise } from "~/lib/result"

export interface LiveRepository {
	getById(id: number): Promise<Result<Live | null, RepositoryError>>
	getByOwnerId(ownerId: number): Promise<Result<Live[], RepositoryError>>
}

export class LiveRepositoryImpl implements LiveRepository {
	private readonly db: DrizzleDB
	constructor(db: DrizzleDB) {
		this.db = db
	}
	async getByOwnerId(
		ownerId: number,
	): Promise<Result<Live[], RepositoryError>> {
		const result = await wrapPromise(
			this.db.select().from(liveTable).where(eq(liveTable.ownerId, ownerId)),
		)

		if (!result.success)
			return fail(new RepositoryError("LiveTableの処理が失敗しました"))

		const lives: Live[] = result.value.map((row) => ({
			id: row.id,
			name: row.name,
			description: row.description,
			ownerId: row.ownerId,
		}))

		return success(lives)
	}

	async getById(id: number): Promise<Result<Live | null, RepositoryError>> {
		const result = await wrapPromise(
			this.db.select().from(liveTable).where(eq(liveTable.id, id)).limit(1),
		)
		if (!result.success)
			return fail(new RepositoryError("LiveTableの処理が失敗しました"))

		const liveRow = result.value[0] as LiveTable | undefined

		if (!liveRow) return success(null)

		const live: Live = {
			id: liveRow.id,
			name: liveRow.name,
			description: liveRow.description,
			ownerId: liveRow.ownerId,
		}

		return success(live)
	}
}
