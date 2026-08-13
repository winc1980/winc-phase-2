import { LogOutIcon, UserIcon } from "lucide-react"
import { Link, Outlet } from "react-router"
import { BrandIcon } from "~/components/common/BrandIcon"
import { PageContainer } from "~/components/common/PageContainer"
import { Button } from "~/components/ui/button"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import type { User } from "~/domain/entities/user"
import { userContext, userMiddleware } from "~/middlewares/user"
import type { Route } from "./+types/app-layout"

export const middleware: Route.MiddlewareFunction[] = [userMiddleware]

export async function loader({ context }: Route.LoaderArgs) {
	const user = context.get(userContext)
	return { user }
}

export default function AppLayout({
	loaderData: { user },
}: Route.ComponentProps) {
	return (
		<PageContainer
			Header={
				<div className="h-16 flex items-center justify-between">
					<Button variant="ghost" className="size-12" asChild>
						<Link to="/app">
							<BrandIcon />
						</Link>
					</Button>
					<div className="flex items-center">
						<AccountMenu user={user} />
					</div>
				</div>
			}
			Body={<Outlet />}
		/>
	)
}

function AccountMenu({ user }: { user: User }) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button size="icon-lg" variant="ghost">
					<UserIcon />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuGroup>
					<DropdownMenuLabel className="text-sm">
						<div>{user.name}</div>
					</DropdownMenuLabel>
					<DropdownMenuLabel>
						<div>{user.mail}</div>
					</DropdownMenuLabel>
				</DropdownMenuGroup>

				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem>
						<Link to="/auth/logout" className="flex items-center gap-2 w-full">
							<LogOutIcon />
							ログアウト
						</Link>
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
