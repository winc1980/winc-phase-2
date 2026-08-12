import "dotenv"
import { createCookieSessionStorage } from "react-router"

const SESSION_SECRET = process.env.SESSION_SECRET
if (!SESSION_SECRET)
	throw new Error("環境変数「SESSION_SECRET」が設定されていません")

type SessionData = {
	sessionToken: string
}

type SessionFlashData = {
	error: string
}

export const { getSession, commitSession, destroySession } =
	createCookieSessionStorage<SessionData, SessionFlashData>({
		cookie: {
			name: "__session",
			httpOnly: true,
			sameSite: "lax",
			secrets: [SESSION_SECRET],
			secure: true,
		},
	})
