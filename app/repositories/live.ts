import { eq } from "drizzle-orm"
import type { DrizzleDB } from "~/db"
import { type LiveTable, liveApplicationTable, liveTable } from "~/db/schema"
import { RepositoryError } from "~/domain/data/errors"
import type { Live } from "~/domain/entities/live"
import type { LiveApplication } from "~/domain/entities/live-application"
import { PlainDate } from "~/lib/plain-date"
import { PlainDateTimeSerde } from "~/lib/plain-datetime-utils"
import { PlainTime } from "~/lib/plain-time"
import { fail, type Result, success, wrapPromise } from "~/lib/result"

export interface LiveRepository {
	getById(id: number): Promise<Result<Live | null, RepositoryError>>
	getByOwnerId(ownerId: number): Promise<Result<Live[], RepositoryError>>
	getAllApplications(
		id: number,
	): Promise<Result<LiveApplication[], RepositoryError>>
	createApplication(
		liveId: number,
		name: string,
		available: boolean,
	): Promise<Result<null, RepositoryError>>

	suspendApplication(
		applicationId: number,
	): Promise<Result<null, RepositoryError>>
	enableApplication(
		applicationId: number,
	): Promise<Result<null, RepositoryError>>
}

export class LiveRepositoryImpl implements LiveRepository {
	private readonly db: DrizzleDB
	constructor(db: DrizzleDB) {
		this.db = db
	}
	async suspendApplication(
		applicationId: number,
	): Promise<Result<null, RepositoryError>> {
		const result = await wrapPromise(
			this.db
				.update(liveApplicationTable)
				.set({ available: false })
				.where(eq(liveApplicationTable.id, applicationId)),
		)

		if (!result.success)
			return fail(
				new RepositoryError("LiveApplicationTableの処理が失敗しました"),
			)
		return success(null)
	}
	async enableApplication(
		applicationId: number,
	): Promise<Result<null, RepositoryError>> {
		const result = await wrapPromise(
			this.db
				.update(liveApplicationTable)
				.set({ available: true })
				.where(eq(liveApplicationTable.id, applicationId)),
		)

		if (!result.success)
			return fail(
				new RepositoryError("LiveApplicationTableの処理が失敗しました"),
			)
		return success(null)
	}
	async createApplication(
		liveId: number,
		name: string,
		available: boolean,
	): Promise<Result<null, RepositoryError>> {
		const now = PlainDateTimeSerde.serialize([PlainDate.now(), PlainTime.now()])
		const result = await wrapPromise(
			this.db.insert(liveApplicationTable).values({
				name,
				liveId,
				available,
				token: crypto.randomUUID(),
				updatedAt: now,
			}),
		)

		if (!result.success) {
			return fail(
				new RepositoryError("LiveApplicationTableの処理が失敗しました"),
			)
		}

		return success(null)
	}
	async getAllApplications(
		id: number,
	): Promise<Result<LiveApplication[], RepositoryError>> {
		const result = await wrapPromise(
			this.db
				.select()
				.from(liveApplicationTable)
				.where(eq(liveApplicationTable.liveId, id)),
		)

		if (!result.success)
			return fail(new RepositoryError("LiveTableの処理が失敗しました"))

		const rows = result.value

		const applications = rows.map(
			(row) =>
				({
					id: row.id,
					name: row.name,
					liveId: row.liveId,
					token: row.token,
					available: row.available,
					updatedAt: PlainDateTimeSerde.deserialize(row.updatedAt),
				}) satisfies LiveApplication,
		)

		return success(applications)
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
