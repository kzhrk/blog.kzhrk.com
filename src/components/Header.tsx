import Image from "next/image";
import Link from "next/link";
import { css } from "../../styled-system/css";

export function Header() {
	return (
		<header
			className={css({ color: "white" })}
			style={{ textShadow: "0 1px 5px black" }}
		>
			<div
				className={css({
					px: "6",
					py: "4",
					sm: { px: "12", py: "8" },
					bg: "slate.800/75",
				})}
			>
				<div
					className={css({
						width: "auto",
						sm: { width: "10/12" },
						mx: "auto",
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
					})}
				>
					<h1
						className={css({
							fontSize: "xl",
							sm: { fontSize: "3xl" },
							fontWeight: "bold",
						})}
					>
						<Link className={css({ fontWeight: "normal" })} href="/">
							blog.kzhrk.com
						</Link>
					</h1>
					<a
						href="https://github.com/kzhrk/blog.kzhrk.com"
						className={css({ width: "8" })}
					>
						<figure>
							<Image
								src="/images/github-logo.png"
								alt="GitHub Logo"
								width={32}
								height={32}
							/>
						</figure>
					</a>
				</div>
			</div>
		</header>
	);
}
