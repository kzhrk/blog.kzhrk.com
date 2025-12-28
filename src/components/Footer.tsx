import Link from "next/link";

export function Footer() {
	return (
		<footer className="px-6 py-8 sm:px-12 sm:py-16 bg-gray-200 dark:bg-gray-800">
			<div className="w-auto sm:w-10/12 mx-auto">
				<h2 className="text-xl font-bold">Author</h2>
				<div className="mt-4 flex items-center">
					<p className="mr-2">kzhrk</p>
					<a
						href="https://twitter.com/kzhrk0430"
						className="twitter-follow-button"
						data-show-screen-name="true"
					>
						Follow @kzhrk0430
					</a>
				</div>
				<p className="mt-2">
					フロントエンドエンジニア。ブラウザというアプリケーションを使い倒して全ての人類に等しく情報を伝えることを生きがいにしている。
				</p>
			</div>
			<p className="mt-16 text-sm text-center">
				&copy; 2014{" "}
				<Link className="link underline hover:no-underline" href="/">
					kzhrk
				</Link>
			</p>
		</footer>
	);
}
