import { css } from "@/styled-system/css";

export default function Loading() {
	return (
		<div
			className={css({
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				minHeight: "50vh",
				px: "6",
				py: "12",
			})}
		>
			<div
				className={css({
					display: "flex",
					gap: "2",
					animation: "pulse 1.5s ease-in-out infinite",
				})}
			>
				<div
					className={css({
						w: "3",
						h: "3",
						bg: "gray.400",
						borderRadius: "full",
					})}
				/>
				<div
					className={css({
						w: "3",
						h: "3",
						bg: "gray.400",
						borderRadius: "full",
					})}
				/>
				<div
					className={css({
						w: "3",
						h: "3",
						bg: "gray.400",
						borderRadius: "full",
					})}
				/>
			</div>
			<p className={css({ mt: "4", color: "gray.500" })}>読み込み中...</p>
		</div>
	);
}
