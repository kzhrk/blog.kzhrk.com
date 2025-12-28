import Link from "next/link";

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
			<time className="text-sm" dateTime={dateTimeValue}>
				{formattedDate}
			</time>
			{tags && tags.length > 0 && (
				<ul className="flex gap-4 items-center ml-4">
					{tags.map((tag) => (
						<li key={tag}>
							<Link
								href={`/?tag=${tag}`}
								className="text-xs block px-2 py-1 text-gray-700 bg-blue-100 hover:bg-blue-200"
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
