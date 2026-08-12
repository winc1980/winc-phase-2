import { db } from "~/db"
import { UserRepositoryImpl } from "~/repositories/user"
import type { Route } from "../../+types/root"
import { repositoryContext } from "./context"

export const repositoryDIMiddleware: Route.MiddlewareFunction = async ({
	context,
}) => {
	context.set(repositoryContext, {
		userRepository: new UserRepositoryImpl(db),
	})
}
