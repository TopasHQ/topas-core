import { AfterGenesisBlockApplyContext, BaseModule, codec } from 'lisk-sdk';

import { ModuleId, ModuleName, TopasApp, TopasAppModuleChainData } from '../../types';
import { serializeData } from '../../utils/formats';
import { getDataAccessData } from '../../utils/store';
import { CreateAppAsset } from './assets/create_app_asset';
import { EnterAppAsset } from './assets/enter_app_asset';
import { SetAppStateAsset } from './assets/set_app_state_asset';
import { TipCreatorAsset } from './assets/tip_creator_asset';
import { UpdateAppAsset } from './assets/update_app_asset';
import { TOPAS_APP_MODULE_INIT, TOPAS_APP_MODULE_KEY } from './constants';
import { topasAppAccountSchema, topasAppModuleSchema } from './schemas';

export class TopasAppModule extends BaseModule {
	public name = ModuleName.TopasApp;
	public id = ModuleId.TopasApp;
	public accountSchema = topasAppAccountSchema;

	public transactionAssets = [
		new CreateAppAsset(),
		new UpdateAppAsset(),
		new SetAppStateAsset(),
		new EnterAppAsset(),
		new TipCreatorAsset(),
	];

	public events = [];

	public actions = {
		getApps: async (): Promise<unknown> => {
			const data = await getDataAccessData<TopasAppModuleChainData>(this._dataAccess, ModuleId.TopasApp);
			return serializeData(data.apps);
		},
	};

	public reducers = {
		getAppById: async (params: Record<string, unknown>): Promise<TopasApp> => {
			const { id } = params;

			if (typeof id !== 'string') {
				throw new Error('Id must be a string.');
			}

			const dataAccess = await getDataAccessData<TopasAppModuleChainData>(this._dataAccess, ModuleId.TopasApp);

			const app = dataAccess.apps.find(topasApp => topasApp.data.id === id);

			if (!app) {
				throw new Error('App does not exist.');
			}

			return app;
		},
	};

	public async afterGenesisBlockApply(_input: AfterGenesisBlockApplyContext) {
		await _input.stateStore.chain.set(TOPAS_APP_MODULE_KEY, codec.encode(topasAppModuleSchema, TOPAS_APP_MODULE_INIT));
	}
}
