import { Link } from "@tanstack/react-router";
import styles from "./NotFoundPage.module.css";

export function NotFoundPage() {
	return (
		<div className={styles.root}>
			<h1 className={styles.code}>404</h1>
			<h2 className={styles.title}>ページが見つかりませんでした</h2>
			<p className={styles.message}>
				お探しのページは移動または削除された可能性があります。
			</p>
			<Link to="/" className={styles.action}>
				トップページに戻る
			</Link>
		</div>
	);
}
