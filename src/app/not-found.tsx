import Link from "next/link";
import { css } from "../../styled-system/css";

export default function NotFound() {
	return (
		<div className={css({ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "50vh", px: "6", py: "12" })}>
			<h1 className={css({ fontSize: "4xl", fontWeight: "bold", mb: "4" })}>404</h1>
			<p className={css({ fontSize: "xl", mb: "8" })}>ページが見つかりませんでした</p>
			<Link href="/" className="link">
				トップページに戻る
			</Link>
		</div>
	);
}
