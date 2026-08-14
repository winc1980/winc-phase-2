import { eq } from "drizzle-orm"
import type { DrizzleDB } from "~/db"
import {
	type BandTable,
	bandParticipationTable,
	bandTable,
	liveTable,
} from "~/db/schema"
import { RepositoryError } from "~/domain/data/errors"
import type { Band } from "~/domain/entities/band"
import type { BandParticipation } from "~/domain/entities/band-participation"
import { fail, type Result, success, wrapPromise } from "~/lib/result"

export interface BandRepository {
	getById(id: number): Promise<Result<Band | null, RepositoryError>>
	getByLiveId(
		liveId: number,
	): Promise<Result<BandParticipation[], RepositoryError>>
	create(
		bandName: string,
		leaderId: number,
		liveId: number,
	): Promise<Result<Band, RepositoryError>>
}

export class BandRepositoryImpl implements BandRepository {
	private readonly db: DrizzleDB
	constructor(db: DrizzleDB) {
		this.db = db
	}
	async create(
		bandName: string,
		leaderId: number,
		liveId: number,
	): Promise<Result<Band, RepositoryError>> {
		const result = await wrapPromise(
			this.db.transaction(async (tx) => {
				const [band] = await tx
					.insert(bandTable)
					.values({ name: bandName, leaderId })
					.returning()

				await tx
					.insert(bandParticipationTable)
					.values({ bandId: band.id, liveId, approved: false })

				return band
			}),
		)

		if (!result.success)
			return fail(new RepositoryError("BandTableの処理が失敗しました"))

		const row = result.value
		const band: Band = {
			id: row.id,
			name: row.name,
			leaderId: row.leaderId,
		}

		return success(band)
	}
	async getByLiveId(
		liveId: number,
	): Promise<Result<BandParticipation[], RepositoryError>> {
		const result = await wrapPromise(
			this.db
				.select()
				.from(bandParticipationTable)
				.innerJoin(bandTable, eq(bandParticipationTable.bandId, bandTable.id))
				.innerJoin(liveTable, eq(bandParticipationTable.liveId, liveTable.id))
				.where(eq(bandParticipationTable.liveId, liveId)),
		)

		if (!result.success) {
			return fail(new RepositoryError("BandTableの処理が失敗しました"))
		}

		const rows = result.value

		const bandParticipations: BandParticipation[] = rows.map(
			(row) =>
				({
					id: row.band_participation.id,
					live: {
						id: row.live.id,
						name: row.live.name,
						description: row.live.description,
						ownerId: row.live.ownerId,
					},
					band: {
						id: row.band.id,
						name: row.band.name,
						leaderId: row.band.leaderId,
					},
					approved: row.band_participation.approved,
				}) satisfies BandParticipation,
		)

		return success(bandParticipations)
	}

	async getById(id: number): Promise<Result<Band | null, RepositoryError>> {
		const result = await wrapPromise(
			this.db.select().from(bandTable).where(eq(bandTable.id, id)),
		)

		if (!result.success) {
			return fail(new RepositoryError("BandTableの処理が失敗しました"))
		}

		const bandRow = result.value[0] as BandTable | undefined

		if (!bandRow) return success(null)

		const band: Band = {
			id: bandRow.id,
			name: bandRow.name,
			leaderId: bandRow.leaderId,
		}

		return success(band)
	}
}
