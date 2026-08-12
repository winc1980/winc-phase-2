import { createContext } from "react-router"
import type { UserRepository } from "~/repositories/user"

export const repositoryContext = createContext<{
	userRepository: UserRepository
}>()
