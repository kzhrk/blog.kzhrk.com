export interface Metadata {
	title: string;
	date: string | Date;
	tags?: string[];
	draft?: boolean;
}

export interface Post {
	metadata: Metadata;
	content: string;
	html: string;
	path: string;
	slug: string;
	formattedDate: string;
}

export interface PostSummary extends Metadata {
	path: string;
	slug: string;
	formattedDate: string;
}
