export function createApplicationUrl(
	token: string,
	origin: string,
	message: string,
) {
	return `${origin}/out/${message}/live-application/${encodeURIComponent(token)}`
}
