import { TopasApp } from './types';

export const TOPAS_APP_MODULE_KEY = 'topas:topasAppModuleData';

export const TOPAS_APP_MODULE_INIT = {
	apps: [] as TopasApp[],
};

export const TOPAS_APP_ASSET_IDS = {
	createApp: 1,
	updateApp: 2,
	setAppState: 3,
	enterApp: 4,
	tipCreator: 5,
};

type Fees = { [key in keyof typeof TOPAS_APP_ASSET_IDS]?: bigint };

export const TOPAS_APP_FEES: Fees = {
	createApp: BigInt('5000000000'),
	updateApp: BigInt('500000000'),
	// If asset is not listed, use min fee
};
