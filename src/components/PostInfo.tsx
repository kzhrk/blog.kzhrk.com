import Link from "next/link";
import { css } from "../../styled-system/css";

interface PostInfoProps {
	tags?: string[];
	date: string | Date;
	formattedDate: string;
}

export function PostInfo({ tags, date, formattedDate }: PostInfoProps) {
	const dateTimeValue =
		typeof date === "string" ? date : date.toISOString().split("T")[0];

	return (
		<>
			<time className={css({ fontSize: "sm" })} dateTime={dateTimeValue}>
				{formattedDate}
			</time>
			{tags && tags.length > 0 && (
				<ul
					className={css({
						display: "flex",
						gap: "4",
						alignItems: "center",
						ml: "4",
					})}
				>
					{tags.map((tag) => (
						<li key={tag}>
							<Link
								href={`/?tag=${tag}`}
								className={css({
									fontSize: "xs",
									display: "block",
									px: "2",
									py: "1",
									color: "rgb(55 65 81)",
									bg: "rgb(219 234 254)",
									_hover: { bg: "rgb(191 219 254)" },
								})}
							>
								{tag}
							</Link>
						</li>
					))}
				</ul>
			)}
		</>
	);
}
