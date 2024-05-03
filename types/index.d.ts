interface Metadata {
	actorIds: string[];
	audioFilePath: string;
	audioFileSize: string;
	date: string;
	description: string;
	duration: string;
	layout: string;
	title: string;
	chapters?: {
		value: string;
		time: string;
	}[];
}
