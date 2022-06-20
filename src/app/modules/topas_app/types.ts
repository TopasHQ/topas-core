import { AccountDefaultProps, Meta, TopasAccountEssentials, TopasAppEssentials } from '../../types';

export interface TopasAppModuleChainData {
	apps: TopasApp[];
}

export type TopasAppModuleAccountProps = AccountDefaultProps & {
	topasApp: {
		appsCreated: TopasAppEssentials[];
		appsPurchased: TopasAppEssentials[];
	};
};

export enum TopasAppType {
	experience = 0,
	game = 1,
}

export interface TopasApp {
	meta: Meta;
	data: {
		id: string;
		creator: TopasAccountEssentials;
		type: TopasAppType;
		title: string;
		description: string;
		isPublished: boolean;
		tipsEnabled: boolean;
		entranceFee: bigint;
		numOfUses: number;
	};
}

export type CreateAppAssetProps = {
	type: number;
	title: string;
	description: string;
	tipsEnabled: boolean;
	entranceFee: bigint;
};

export type EnterAppAssetProps = {
	appId: string;
};

export type SetAppStateAssetProps = {
	appId: string;
	isPublished: boolean;
};

export type TipCreatorAssetProps = {
	appId: string;
	tipAmount: bigint;
};

export type UpdateAppAssetProps = {
	id: string;
	description: string;
	tipsEnabled: boolean;
	entranceFee: bigint;
};
