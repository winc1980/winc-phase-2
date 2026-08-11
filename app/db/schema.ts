import { integer, text } from "drizzle-orm/sqlite-core/columns"
import { sqliteTable } from "drizzle-orm/sqlite-core/table"

const primaryId = integer({ mode: "number" })
	.notNull()
	.primaryKey({ autoIncrement: true })

export const liveTable = sqliteTable("live", {
	id: primaryId,
	name: text().notNull(),
	description: text(),
	ownerId: text().references(() => userTable.id),
	createdAt: integer({ mode: "timestamp" }).notNull(),
})

export const liveDayTable = sqliteTable("live_day", {
	id: primaryId,
	liveId: integer()
		.notNull()
		.references(() => liveTable.id),
	date: text().notNull(), // yyyy/mm/dd
	start: text().notNull(), // hh:mm 24時間表示
	end: text().notNull(), // hh:mm 24時間表示
})

export const userTable = sqliteTable("user", {
	id: primaryId,
	name: text().notNull(),
	mail: text().notNull(),
	createdAt: integer({ mode: "timestamp" }).notNull(),
})

export const bandTable = sqliteTable("band", {
	id: primaryId,
	name: text().notNull(),
	leaderId: text()
		.notNull()
		.references(() => userTable.id),
})

export const bandAvailabilityTable = sqliteTable("band_availability", {
	id: primaryId,
	bandId: text()
		.notNull()
		.references(() => bandTable.id),
	liveId: text()
		.notNull()
		.references(() => liveTable.id),
	liveDayId: text()
		.notNull()
		.references(() => liveDayTable.id),
	start: text().notNull(), // hh:mm 24時間表示
	end: text().notNull(), // hh:mm 24時間表示
})
