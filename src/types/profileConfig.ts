export type ProfileConfig = {
	avatar?: string;
	name: string;
	bio?: string;
	signature?: string;
	links: {
		name: string;
		url: string;
		icon: string;
		showName?: boolean;
	}[];
};
