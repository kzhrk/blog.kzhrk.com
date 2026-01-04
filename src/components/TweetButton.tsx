"use client";

import { useEffect, useRef } from "react";

interface TweetButtonProps {
	url: string;
	text: string;
}

export function TweetButton({ url, text }: TweetButtonProps) {
	const tweetUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
	const rootRef = useRef<HTMLAnchorElement | null>(null);

	useEffect(() => {
		if (rootRef.current !== null) {
			// @ts-expect-error
			window.twttr.widgets.load(rootRef.current);
		}
	}, []);

	return (
		<a ref={rootRef} className="twitter-share-button" href={tweetUrl}>
			Tweet
		</a>
	);
}
