import Link from "next/link";

export default function NotFound() {
	return (
		<div className="flex flex-col items-center justify-center min-h-[50vh] px-6 py-12">
			<h1 className="text-4xl font-bold mb-4">404</h1>
			<p className="text-xl mb-8">ページが見つかりませんでした</p>
			<Link href="/" className="link underline hover:no-underline">
				トップページに戻る
			</Link>
		</div>
	);
}
