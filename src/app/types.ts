// eslint-disable-next-line import/no-extraneous-dependencies
import { Account } from '@liskhq/lisk-chain';

// INTERFACES & TYPES
export interface DateTimeMetadata {
	unix: number;
	human: string;
}

export interface Meta {
	createdAt: DateTimeMetadata;
	lastModified: DateTimeMetadata;
}

export interface TopasApp {
	meta: Meta;
	data: {
		id: string;
		creator: TopasAccountEssentials;
		type: number;
		title: string;
		description: string;
		isPublished: boolean;
		tipsEnabled: boolean;
		entranceFee: bigint;
		numOfUses: number;
	};
}

export interface TopasUser {
	username: string;
	avatar: string;
	memberType: number;
	memberSince: DateTimeMetadata;
}

export interface TopasAccountEssentials {
	username: string;
	address: Buffer;
}

export interface TopasAppEssentials {
	id: string;
	title: string;
}

export interface HighscoreEssentials {
	appId: string;
	score: number;
}

export interface Highscore {
	user: TopasAccountEssentials;
	app: TopasAppEssentials;
	score: number;
	createdAt: DateTimeMetadata;
}

export interface Item {
	id: string;
}

export interface TopasAppModuleChainData {
	apps: TopasApp[];
}

export interface LeaderboardModuleChainData {
	highscores: Highscore[];
}

export interface MonstersModuleChainData {
	activeMonsters: Monster[];
}

export type TopasAppModuleAccountProps = Account & {
	topasApp: {
		appsCreated: TopasAppEssentials[];
		appsPurchased: TopasAppEssentials[];
	};
};

export type TopasUserModuleAccountProps = Account & {
	topasUser: TopasUser;
};

export type LeaderboardModuleAccountProps = Account & {
	leaderboard: {
		highscores: HighscoreEssentials[];
	};
};

export type TopasAccountProps = Account &
	LeaderboardModuleAccountProps &
	TopasUserModuleAccountProps &
	TopasAppModuleAccountProps;

// ENUMS
export enum TopasAppType {
	experience = 0,
	game = 1,
}

export enum MemberType {
	Unregistered = 0,
	Registered = 1,
	Basic = 1,
	Elite = 2,
}

export enum ModuleId {
	TopasApp = 1000,
	TopasUser = 1001,
	Leaderboard = 1002,
	Monsters = 1003,
}

export enum ModuleName {
	TopasApp = 'topasApp',
	TopasUser = 'topasUser',
	Leaderboard = 'leaderboard',
	Monsters = 'monsters',
}

export type Monster = {
	id: string;
	model: number;
	location: number;
	reward: bigint;
};
