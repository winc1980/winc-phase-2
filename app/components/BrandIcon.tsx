import { Music4Icon } from "lucide-react";
import { useId } from "react";

export function BrandIcon() {
    const id = useId();
	return (
		<Music4Icon className="size-6" color="url(#brand-icon-gradient)">
			<defs>
				<linearGradient id="brand-icon-gradient" x1="3" y1="3" x2="21" y2="21" gradientUnits="userSpaceOnUse">
					<stop stopColor="#e2bfd2" />
					<stop offset="50%" stopColor="#a66ce3" />
					<stop offset="100%" stopColor="#603bf4" />
				</linearGradient>
			</defs>
		</Music4Icon>
	);
};
