import { Link } from "react-router"
import { PasswordInput } from "~/components/common/PasswordInput"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Field, FieldGroup, FieldLabel, FieldSet } from "~/components/ui/field"
import { Input } from "~/components/ui/input"
import type { Route } from "./+types/login"

export const loader = () => {
	const message = "server string"
	return { message }
}

export default function LoginPage({ loaderData }: Route.ComponentProps) {
	loaderData.message
	return (
		<div className="h-full flex flex-col justify-center items-center gap-4 w-full">
			<Card className="w-full max-w-xl">
				<CardHeader>
					<CardTitle>ログイン</CardTitle>
				</CardHeader>
				<CardContent>
					<FieldGroup>
						<FieldSet>
							<FieldGroup>
								<Field>
									<FieldLabel htmlFor="mail">早稲田メールアドレス</FieldLabel>
									<Input id="mail" placeholder="waseda@asagi.waseda.jp" />
								</Field>
								<Field>
									<FieldLabel htmlFor="password">パスワード</FieldLabel>
									<PasswordInput id="password" />
								</Field>
							</FieldGroup>
						</FieldSet>
						<Field orientation="horizontal">
							<Button type="submit" className="w-full">
								ログイン
							</Button>
						</Field>
					</FieldGroup>
				</CardContent>
			</Card>
			<form></form>
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
