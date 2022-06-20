import { Monster } from './types';

export const MONSTERS_MODULE_KEY = 'topas:monstersModuleData';

export const MONSTERS_MODULE_INIT = {
	activeMonsters: [] as Monster[],
};

export const MONSTERS_ASSET_IDS = {
	destroyMonster: 1,
};

type Fees = { [key in keyof typeof MONSTERS_ASSET_IDS]?: bigint };

export const MONSTERS_FEES: Fees = {
	// If asset is not listed, use min fee
};
