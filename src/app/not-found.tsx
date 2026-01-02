import Link from "next/link";
import { css } from "../../styled-system/css";

export default function NotFound() {
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
				textAlign: "center",
			})}
		>
			<h1
				className={css({
					fontSize: "6xl",
					fontWeight: "bold",
					mb: "2",
					color: "gray.400",
				})}
			>
				404
			</h1>
			<h2 className={css({ fontSize: "2xl", fontWeight: "bold", mb: "4" })}>
				ページが見つかりませんでした
			</h2>
			<p className={css({ fontSize: "md", color: "gray.500", mb: "8" })}>
				お探しのページは移動または削除された可能性があります。
			</p>
			<Link
				href="/"
				className={css({
					display: "inline-block",
					px: "6",
					py: "3",
					bg: "blue.600",
					color: "white",
					fontWeight: "bold",
					_hover: { bg: "blue.700" },
				})}
			>
				トップページに戻る
			</Link>
		</div>
	);
}
