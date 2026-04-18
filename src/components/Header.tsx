import Link from "next/link";

export function Header() {
	return (
		<header className="site-header">
			<div className="site-header__inner">
				<Link className="brand" href="/" aria-label="blog.kzhrk.com">
					<span className="brand__mark" aria-hidden>
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
					<span className="brand__name">
						<span className="brand__sub">blog.</span>kzhrk
						<span className="brand__sub">.com</span>
					</span>
				</Link>

				<nav className="site-nav" aria-label="Primary">
					<a
						className="site-nav__link"
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
