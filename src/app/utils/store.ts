import { BaseModuleDataAccess, codec, Schema, StateStore } from 'lisk-sdk';

import { LEADERBOARD_MODULE_INIT, LEADERBOARD_MODULE_KEY } from '../modules/leaderboard/constants';
import { leaderboardModuleSchema } from '../modules/leaderboard/schemas';
import { MONSTERS_MODULE_INIT, MONSTERS_MODULE_KEY } from '../modules/monsters/constants';
import { monstersModuleSchema } from '../modules/monsters/schemas';
import { TOPAS_APP_MODULE_INIT, TOPAS_APP_MODULE_KEY } from '../modules/topas_app/constants';
import { topasAppModuleSchema } from '../modules/topas_app/schemas';
import { TopasAppModuleChainData } from '../modules/topas_app/types';
import { ModuleId } from '../types';

const getModuleInfo = <T>(module: ModuleId) => {
	const modules = {
		[ModuleId.TopasApp]: {
			key: TOPAS_APP_MODULE_KEY,
			init: TOPAS_APP_MODULE_INIT,
			schema: topasAppModuleSchema,
		},
		[ModuleId.Leaderboard]: {
			key: LEADERBOARD_MODULE_KEY,
			init: LEADERBOARD_MODULE_INIT,
			schema: leaderboardModuleSchema,
		},
		[ModuleId.Monsters]: {
			key: MONSTERS_MODULE_KEY,
			init: MONSTERS_MODULE_INIT,
			schema: monstersModuleSchema,
		},
	};

	const data = modules[module] as unknown;

	if (!data) {
		throw new Error(`Module does not exist.`);
	}

	return data as { key: string; init: T; schema: Schema };
};

// Generic module data getter. Gets called from custom assets.
export const getDataAccessData = async <T>(dataAccess: BaseModuleDataAccess, module: ModuleId): Promise<T> => {
	const { key, init, schema } = getModuleInfo<T>(module);
	const dataAccessDataBuffer = await dataAccess.getChainState(key);
	return dataAccessDataBuffer ? codec.decode<T>(schema, dataAccessDataBuffer) : init;
};

// Generic chain data getter. Gets called from the module itself.
export const getStateStoreData = async <T>(stateStore: StateStore, module: ModuleId): Promise<T> => {
	const { key, init, schema } = getModuleInfo<T>(module);
	const stateStoreDataBuffer = await stateStore.chain.get(key);
	return stateStoreDataBuffer ? codec.decode<T>(schema, stateStoreDataBuffer) : init;
};

export const getTopasApp = (stateStoreData: TopasAppModuleChainData, id: string) => {
	const app = stateStoreData.apps.find(p => p.data.id === id);

	if (!app) {
		throw new Error(`App does not exist.`);
	}

	return app;
};
