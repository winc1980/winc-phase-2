import { Link, Outlet } from "react-router"
import { BrandIcon } from "~/components/common/BrandIcon"
import { PageContainer } from "~/components/common/PageContainer"
import { Button } from "~/components/ui/button"

export default function AppLayout() {
	return (
		<PageContainer
			Header={
				<div className="h-16 flex items-center justify-between">
					<Button variant="ghost" className="size-12" asChild>
						<Link to="/app">
							<BrandIcon />
						</Link>
					</Button>
				</div>
			}
			Body={<Outlet />}
		/>
	)
}
