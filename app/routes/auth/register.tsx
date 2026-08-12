import { CheckCircleIcon, LoaderCircleIcon, SendIcon } from "lucide-react"
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
import {
	PasswordConfirmationMismatchError,
	type RepositoryError,
	type UserMailAlreadyExistsError,
} from "~/domain/data/errors"
import type { User } from "~/domain/entities/user"
import { fail, type Result, success } from "~/lib/result"
import type { Route } from "./+types/register"

export default function RegisterPage({ actionData }: Route.ComponentProps) {
	const navigation = useNavigation()

	if (actionData?.success) {
		return (
			<div className="h-full flex flex-col justify-center items-center gap-4 w-full">
				<Card className="w-full max-w-xl">
					<CardHeader>
						<CardTitle>新規アカウント登録</CardTitle>
					</CardHeader>
					<CardContent className="flex flex-col items-center gap-4 text-center">
						<CheckCircleIcon className="size-10 text-primary" />
						<p>登録が完了しました。</p>
						<Button variant="ghost" className="w-full">
							<Link to="/auth/login">ログインはこちら</Link>
						</Button>
					</CardContent>
				</Card>
			</div>
		)
	}

	return (
		<div className="h-full flex flex-col justify-center items-center gap-4 w-full">
			<Card className="w-full max-w-xl">
				<CardHeader>
					<CardTitle>新規アカウント登録</CardTitle>
				</CardHeader>
				<CardContent>
					<Form method="POST">
						<FieldGroup>
							<FieldSet>
								<FieldGroup>
									<Field>
										<FieldLabel htmlFor="name">名前</FieldLabel>
										<Input id="name" name="name" required />
									</Field>
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
									<Field>
										<FieldLabel htmlFor="passwordConfirm">
											パスワード（確認）
										</FieldLabel>
										<PasswordInput
											id="passwordConfirm"
											name="passwordConfirm"
											required
										/>
									</Field>
								</FieldGroup>
							</FieldSet>
							{actionData && !actionData.success && (
								<Field>
									<FieldError>{actionData.error.message}</FieldError>
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
									登録する
								</Button>
							</Field>
						</FieldGroup>
					</Form>
				</CardContent>
			</Card>
			<Card className="w-full max-w-xl">
				<CardContent>
					<Button variant="ghost" className="w-full">
						<Link to="/auth/login">既にアカウントをお持ちの方はこちら</Link>
					</Button>
				</CardContent>
			</Card>
		</div>
	)
}

export async function action({
	request,
	context,
}: Route.ActionArgs): Promise<
	Result<
		User,
		| RepositoryError
		| UserMailAlreadyExistsError
		| PasswordConfirmationMismatchError
	>
> {
	const formData = await request.formData()
	const name = String(formData.get("name") || "")
	const mail = String(formData.get("mail") || "")
	const password = String(formData.get("password") || "")
	const passwordConfirm = String(formData.get("passwordConfirm") || "")

	if (password !== passwordConfirm)
		return fail(
			new PasswordConfirmationMismatchError(
				"パスワードとパスワード（確認）が一致しません",
			),
		)

	const { userRepository } = context.get(repositoryContext)

	const createResult = await userRepository.create({ name, mail, password })

	if (!createResult.success) return createResult

	return success(createResult.value)
}
