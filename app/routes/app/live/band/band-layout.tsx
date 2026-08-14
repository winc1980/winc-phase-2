import { ChevronRight } from "lucide-react"
import { Link, Outlet } from "react-router"
import { AccountDropdownMenu } from "~/components/common/AccountDropdownMenu"
import { BrandIcon } from "~/components/common/BrandIcon"
import { PageContainer } from "~/components/common/PageContainer"
import { Button } from "~/components/ui/button"
import { bandContext } from "~/middlewares/band"
import { liveContext } from "~/middlewares/live"
import { userContext } from "~/middlewares/user"
import type { Route } from "./+types/band-layout"

export async function loader({ context }: Route.LoaderArgs) {
	const user = context.get(userContext)

	const liveInfo = context.get(liveContext)
	const bandInfo = context.get(bandContext)

	return { user, ...liveInfo, ...bandInfo }
}

export default function BandLayout({
	loaderData: { user, live, band },
}: Route.ComponentProps) {
	return (
		<PageContainer
			Header={
				<div>
					<div className="h-16 flex items-center justify-between">
						<div className="flex items-center gap-2">
							<Button variant="ghost" className="size-12" asChild>
								<Link to="/app">
									<BrandIcon />
								</Link>
							</Button>
							<ChevronRight size="16" className="text-muted-foreground" />
							<Button variant="ghost" asChild>
								<Link to={`/app/live/${live.id}`}>{live.name}</Link>
							</Button>
							<ChevronRight size="16" className="text-muted-foreground" />
							<Button variant="ghost" asChild>
								<Link to={`/app/live/${live.id}/band/${band.id}`}>
									{band.name}
								</Link>
							</Button>
						</div>
						<AccountDropdownMenu user={user} />
					</div>
					<div className="h-12">bottom header</div>
				</div>
			}
			Body={<Outlet />}
		/>
	)
}
