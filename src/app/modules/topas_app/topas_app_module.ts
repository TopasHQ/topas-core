import { AfterBlockApplyContext, AfterGenesisBlockApplyContext, BaseModule, codec, cryptography } from 'lisk-sdk';

import config from '../../config';
import { ModuleId, ModuleName, TopasAppPurchase } from '../../types';
import { serializeData } from '../../utils/formats';
import { senderOwnsValidPurchase } from '../../utils/helpers';
import { getHighscores } from '../../utils/reducer_handlers';
import { getDataAccessData, getStateStoreData } from '../../utils/store';
import { CreateAppAsset } from './assets/create_app_asset';
import { PurchaseAppEntranceAsset } from './assets/purchase_app_entrance_asset';
import { SetAppStateAsset } from './assets/set_app_state_asset';
import { TipCreatorAsset } from './assets/tip_creator_asset';
import { UpdateAppAsset } from './assets/update_app_asset';
import { TOPAS_APP_MODULE_INIT, TOPAS_APP_MODULE_KEY } from './constants';
import { topasAppAccountSchema, topasAppModuleSchema } from './schemas';
import { TopasApp, TopasAppMode, TopasAppModuleAccountProps, TopasAppModuleChainData } from './types';

export class TopasAppModule extends BaseModule {
	public name = ModuleName.TopasApp;
	public id = ModuleId.TopasApp;
	public accountSchema = topasAppAccountSchema;

	public transactionAssets = [
		new CreateAppAsset(),
		new UpdateAppAsset(),
		new SetAppStateAsset(),
		new PurchaseAppEntranceAsset(),
		new TipCreatorAsset(),
	];

	public events = [];

	public actions = {
		getApps: async (): Promise<unknown> => {
			const data = await getDataAccessData<TopasAppModuleChainData>(this._dataAccess, ModuleId.TopasApp);
			return serializeData(data.apps);
		},
		userCanEnterApp: async (params: Record<string, unknown>): Promise<unknown> => {
			const { address, appId } = params;

			const app = (await getDataAccessData<TopasAppModuleChainData>(this._dataAccess, ModuleId.TopasApp)).apps.find(
				a => a.data.id === appId,
			);

			const account = await this._dataAccess.getAccountByAddress<TopasAppModuleAccountProps>(
				cryptography.hexToBuffer(address as string),
			);

			if (!app || !account) {
				return false;
			}

			return senderOwnsValidPurchase(app, account);
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
		getAccountPurchases: async (params: Record<string, unknown>): Promise<TopasAppPurchase[]> => {
			const { address } = params;

			if (!Buffer.isBuffer(address)) {
				throw new Error('Address must be a buffer');
			}

			const account = await this._dataAccess.getAccountByAddress<TopasAppModuleAccountProps>(address);

			return account.topasApp.appsPurchases;
		},
	};

	public async beforeBlockApply({ stateStore, block, reducerHandler }: AfterBlockApplyContext) {
		// Logic to pay out prizes and reset chests / leaderboard
		if (block.header.height % config.appLeaderboardDuration !== 0) {
			return;
		}

		const stateStoreData = await getStateStoreData<TopasAppModuleChainData>(stateStore, ModuleId.TopasApp);
		const apps = stateStoreData.apps.filter(a => a.data.mode === TopasAppMode.feeToChest);
		const highscores = await getHighscores(reducerHandler);

		for (const app of apps) {
			if (app.data.chest === BigInt('0')) {
				return;
			}

			const scores = highscores.filter(s => s.app.appId === app.data.id).sort((x, y) => y.score - x.score);

			if (!scores.length) {
				return;
			}

			this._logger.debug(scores[0]);

			await reducerHandler.invoke('token:credit', {
				address: cryptography.hexToBuffer((scores[0].user.address as unknown) as string),
				amount: app.data.chest,
			});

			app.data.chest = BigInt('0');
		}

		await stateStore.chain.set(TOPAS_APP_MODULE_KEY, codec.encode(topasAppModuleSchema, stateStoreData));
		this._logger.info('App leaderboard duration reached; prizes have been sent out and chests are reset');
	}

	public async afterGenesisBlockApply(_input: AfterGenesisBlockApplyContext) {
		await _input.stateStore.chain.set(TOPAS_APP_MODULE_KEY, codec.encode(topasAppModuleSchema, TOPAS_APP_MODULE_INIT));
	}
}
