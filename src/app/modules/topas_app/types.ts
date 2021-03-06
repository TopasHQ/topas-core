import { AccountDefaultProps, Meta, TopasAccountEssentials, TopasAppEssentials, TopasAppPurchase } from '../../types';

export interface TopasAppModuleChainData {
	apps: TopasApp[];
}

export type TopasAppModuleAccountProps = AccountDefaultProps & {
	topasApp: {
		appsCreated: TopasAppEssentials[];
		appsPurchases: TopasAppPurchase[];
	};
};

export enum TopasAppType {
	experience = 0,
	game = 1,
}

export enum TopasAppMode {
	feeToCreatorSingular = 0,
	feeToCreatorLifetime = 1,
	feeToChest = 2,
}

export interface TopasApp {
	meta: Meta;
	data: {
		id: string;
		creator: TopasAccountEssentials;
		type: TopasAppType;
		mode: TopasAppMode;
		title: string;
		description: string;
		isPublished: boolean;
		tipsEnabled: boolean;
		entranceFee: bigint;
		purchases: number;
		chest: bigint;
	};
}

export type CreateAppAssetProps = {
	type: TopasAppType;
	mode: TopasAppMode;
	title: string;
	description: string;
	tipsEnabled: boolean;
	entranceFee: bigint;
};

export type PurchaseAppEntranceAssetProps = {
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
