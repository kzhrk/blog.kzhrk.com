import { Link } from "@tanstack/react-router";
import styles from "./Header.module.css";

export function Header() {
	return (
		<header className={styles.siteHeader}>
			<div className={styles.siteHeaderInner}>
				<Link className={styles.brand} to="/" aria-label="blog.kzhrk.com">
					<span className={styles.brandMark} aria-hidden>
						<svg
							viewBox="0 0 24 24"
							width="18"
							height="18"
							role="img"
							aria-label="blog mark"
						>
							<circle
								cx="12"
								cy="12"
								r="10"
								fill="none"
								stroke="currentColor"
								strokeWidth="1.25"
							/>
							<path
								d="M7 15 L12 8 L17 15"
								fill="none"
								stroke="currentColor"
								strokeWidth="1.25"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
					</span>
					<span className={styles.brandName}>
						<span className={styles.brandSub}>blog.</span>kzhrk
						<span className={styles.brandSub}>.com</span>
					</span>
				</Link>

				<nav className={styles.siteNav} aria-label="Primary">
					<a
						className={styles.siteNavLink}
						href="https://github.com/kzhrk/blog.kzhrk.com"
						target="_blank"
						rel="noopener noreferrer"
					>
						GitHub ↗
					</a>
				</nav>
			</div>
		</header>
	);
}
