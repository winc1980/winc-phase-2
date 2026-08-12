import { PasswordInput } from "~/components/common/PasswordInput"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import {
	Field,
	FieldDescription,
	FieldGroup,
	FieldLabel,
	FieldSet,
} from "~/components/ui/field"
import { Input } from "~/components/ui/input"

export default function LoginPage() {
	return (
		<div className="h-full flex flex-col justify-center items-center">
			<Card className="w-full max-w-xl">
				<CardHeader>
					<CardTitle>ログイン</CardTitle>
				</CardHeader>
				<CardContent>
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
				</CardContent>
			</Card>
		</div>
	)
}
