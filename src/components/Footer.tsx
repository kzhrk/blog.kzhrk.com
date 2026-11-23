import styles from "./Footer.module.css";

export function Footer() {
	return (
		<footer className={styles.siteFooter}>
			<div className={styles.siteFooterInner}>
				<div>
					<h3 className={styles.siteFooterH}>Author</h3>
					<p className={styles.siteFooterP}>
						kzhrk
						<br />
						フロントエンドエンジニア。ブラウザというアプリケーションを使い倒して全ての人類に等しく情報を伝えることを生きがいにしている。
					</p>
				</div>
				<div>
					<h3 className={styles.siteFooterH}>Elsewhere</h3>
					<ul className={styles.siteFooterList}>
						<li>
							<a
								href="https://github.com/kzhrk"
								target="_blank"
								rel="noopener noreferrer"
							>
								GitHub ↗
							</a>
						</li>
						<li>
							<a
								href="https://twitter.com/kzhrk0430"
								target="_blank"
								rel="noopener noreferrer"
							>
								Twitter ↗
							</a>
						</li>
					</ul>
				</div>
			</div>
			<div className={styles.siteFooterBottom}>
				<span>© 2014 kzhrk</span>
			</div>
		</footer>
	);
}
