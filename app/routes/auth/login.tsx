import { LoaderCircleIcon, SendIcon } from "lucide-react"
import { Form, Link, useNavigation } from "react-router"
import { repositoryContext } from "~/auth/context"
import { PasswordInput } from "~/components/common/PasswordInput"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
	FieldSet,
} from "~/components/ui/field"
import { Input } from "~/components/ui/input"
import { type RepositoryError, UserNotFoundError } from "~/domain/data/errors"
import { fail, type Result, success } from "~/lib/result"
import type { Route } from "./+types/login"

export default function LoginPage({ actionData }: Route.ComponentProps) {
	const navigation = useNavigation()
	return (
		<div className="h-full flex flex-col justify-center items-center gap-4 w-full">
			{actionData?.success && actionData.value && (
				<Card className="w-full max-w-xl">
					<CardHeader>
						<CardTitle>ログインに成功しました</CardTitle>
					</CardHeader>
				</Card>
			)}
			<Card className="w-full max-w-xl">
				<CardHeader>
					<CardTitle>ログイン</CardTitle>
				</CardHeader>
				<CardContent>
					<Form method="POST">
						<FieldGroup>
							<FieldSet>
								<FieldGroup>
									<Field>
										<FieldLabel htmlFor="mail">早稲田メールアドレス</FieldLabel>
										<Input
											id="mail"
											name="mail"
											placeholder="waseda@asagi.waseda.jp"
											required
										/>
									</Field>
									<Field>
										<FieldLabel htmlFor="password">パスワード</FieldLabel>
										<PasswordInput id="password" name="password" required />
									</Field>
								</FieldGroup>
							</FieldSet>
							{actionData && !actionData.success && (
								<Field>
									<FieldError>{actionData.error.message}</FieldError>
								</Field>
							)}
							{actionData?.success && !actionData.value && (
								<Field>
									<FieldError>パスワードが間違っています</FieldError>
								</Field>
							)}
							<Field orientation="horizontal">
								<Button
									type="submit"
									className="w-full"
									disabled={navigation.state === "submitting"}
								>
									{navigation.state === "submitting" ? (
										<LoaderCircleIcon className="animate-spin" />
									) : (
										<SendIcon />
									)}
									ログイン
								</Button>
							</Field>
						</FieldGroup>
					</Form>
				</CardContent>
			</Card>
			<Card className="w-full max-w-xl">
				<CardContent>
					<Button variant="ghost" className="w-full">
						<Link to="/auth/register">新規アカウント登録はこちら</Link>
					</Button>
				</CardContent>
			</Card>
		</div>
	)
}

export async function action({
	request,
	context,
}: Route.ActionArgs): Promise<Result<boolean, RepositoryError>> {
	const formData = await request.formData()
	const mail = String(formData.get("mail") || "")
	const password = String(formData.get("password") || "")

	const { userRepository } = context.get(repositoryContext)
	const userResult = await userRepository.getByMail(mail)

	if (!userResult.success) return userResult

	const user = userResult.value

	if (user === null)
		return fail(
			new UserNotFoundError(
				`メール「${mail}」に一致するユーザーが見つかりませんでした`,
			),
		)

	const authResult = await userRepository.authenticateWithPassword(
		user.id,
		password,
	)

	if (!authResult.success) return authResult

	const isAuthenticated = authResult.value

	return success(isAuthenticated)
}
