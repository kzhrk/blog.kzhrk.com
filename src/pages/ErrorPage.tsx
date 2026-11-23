import type { ErrorComponentProps } from "@tanstack/react-router";
import { useEffect } from "react";
import styles from "./ErrorPage.module.css";

export function ErrorPage({ error, reset }: ErrorComponentProps) {
	useEffect(() => {
		console.error("Application error:", error);
	}, [error]);

	return (
		<div className={styles.root}>
			<h1 className={styles.title}>エラーが発生しました</h1>
			<p className={styles.message}>
				申し訳ありません。予期しないエラーが発生しました。
			</p>
			<button type="button" onClick={reset} className={styles.action}>
				再試行
			</button>
		</div>
	);
}
