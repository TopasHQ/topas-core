export type AccountDefaultProps = {
	address: Buffer;
};

export interface DateTimeMetadata {
	unix: number;
	human: string;
}

export interface Meta {
	createdAt: DateTimeMetadata;
	lastModified: DateTimeMetadata;
}

export interface TopasAccountEssentials {
	username: string;
	address: Buffer;
}

export interface TopasAppEssentials {
	appId: string;
	title: string;
}

export interface TopasAppPurchase extends TopasAppEssentials {
	purchaseId: string;
	createdAt: DateTimeMetadata;
}

export interface HighscoreEssentials {
	appId: string;
	score: number;
}

export enum ModuleId {
	TopasApp = 1000,
	TopasUser = 1001,
	Leaderboard = 1002,
	Monsters = 1003,
	Nft = 1004,
}

export enum ModuleName {
	TopasApp = 'topasApp',
	TopasUser = 'topasUser',
	Leaderboard = 'leaderboard',
	Monsters = 'monsters',
	Nft = 'nft',
}
