import { createContext, type MiddlewareFunction } from "react-router"
import { db } from "~/db"
import { type LiveRepository, LiveRepositoryImpl } from "~/repositories/live"
import { type UserRepository, UserRepositoryImpl } from "~/repositories/user"

export const repositoryContext = createContext<{
	userRepository: UserRepository
	liveRepository: LiveRepository
}>()

export const repositoryMiddleware: MiddlewareFunction<Response> = async ({
	context,
}) => {
	context.set(repositoryContext, {
		userRepository: new UserRepositoryImpl(db),
		liveRepository: new LiveRepositoryImpl(db),
	})
}
