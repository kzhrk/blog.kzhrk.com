export function Footer() {
	return (
		<footer className="site-footer">
			<div className="site-footer__inner">
				<div className="site-footer__block">
					<h3 className="site-footer__h">Author</h3>
					<p className="site-footer__p">
						kzhrk
						<br />
						フロントエンドエンジニア。ブラウザというアプリケーションを使い倒して全ての人類に等しく情報を伝えることを生きがいにしている。
					</p>
				</div>
				<div className="site-footer__block">
					<h3 className="site-footer__h">Elsewhere</h3>
					<ul className="site-footer__list">
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
			<div className="site-footer__bottom">
				<span>© 2014 kzhrk</span>
			</div>
		</footer>
	);
}
