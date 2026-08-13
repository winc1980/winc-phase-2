import type { ReactNode } from "react"

export function PageContainer({
	Header,
	Body,
}: {
	Header: ReactNode
	Body: ReactNode
}) {
	return (
		<div className="flex flex-col w-full items-center h-full overflow-y-auto">
			<header className="w-full border-b">
				<div className="mx-auto w-full max-w-3xl h-full px-4">{Header}</div>
			</header>
			<main className="w-full grow">
				<div className="mx-auto w-full max-w-3xl px-4 py-6">{Body}</div>
			</main>
		</div>
	)
}
