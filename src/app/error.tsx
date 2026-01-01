"use client";

import { useEffect } from "react";
import { css } from "../../styled-system/css";

export default function ErrorPage({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		console.error("Application error:", error);
	}, [error]);

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
			<h1 className={css({ fontSize: "4xl", fontWeight: "bold", mb: "4" })}>
				エラーが発生しました
			</h1>
			<p className={css({ fontSize: "xl", mb: "8", textAlign: "center" })}>
				申し訳ありません。予期しないエラーが発生しました。
			</p>
			<button
				type="button"
				onClick={reset}
				className={css({
					px: "6",
					py: "3",
					bg: "blue.600",
					color: "white",
					fontWeight: "bold",
					cursor: "pointer",
					_hover: { bg: "blue.700" },
				})}
			>
				再試行
			</button>
		</div>
	);
}
