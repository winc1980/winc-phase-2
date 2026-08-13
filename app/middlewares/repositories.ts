import { createContext } from "react-router"
import { db } from "~/db"
import { type UserRepository, UserRepositoryImpl } from "~/repositories/user"
import type { RootMiddleWareFunction } from "~/root"

export const repositoryContext = createContext<{
	userRepository: UserRepository
}>()

export const repositoryMiddleware: RootMiddleWareFunction = async ({
	context,
}) => {
	context.set(repositoryContext, {
		userRepository: new UserRepositoryImpl(db),
	})
}
