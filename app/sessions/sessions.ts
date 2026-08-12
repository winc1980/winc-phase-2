import "dotenv"
import { createCookieSessionStorage } from "react-router"
import type { ToastPayload } from "~/components/common/toast"

const SESSION_SECRET = process.env.SESSION_SECRET
if (!SESSION_SECRET)
	throw new Error("環境変数「SESSION_SECRET」が設定されていません")

type SessionData = {
	sessionToken: string
}

type SessionFlashData = {
	error: string
	toastPayload: ToastPayload
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
