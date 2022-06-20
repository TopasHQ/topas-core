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
