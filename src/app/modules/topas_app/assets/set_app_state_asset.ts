import { ApplyAssetContext, BaseAsset, codec, cryptography } from 'lisk-sdk';

import config from '../../../config';
import { ModuleId, TopasAppModuleChainData } from '../../../types';
import { updateMeta } from '../../../utils/helpers';
import { getStateStoreData, getTopasApp } from '../../../utils/store';
import { TOPAS_APP_ASSET_IDS } from '../constants';
import { TOPAS_APP_KEY, topasAppModuleSchema } from '../schemas';

type Props = {
	appId: string;
	isPublished: boolean;
};

export class SetAppStateAsset extends BaseAsset {
	public name = 'setAppState';
	public id = TOPAS_APP_ASSET_IDS.setAppState;

	public schema = {
		$id: 'topasApp/setAppState-asset',
		title: 'SetAppStateAsset transaction asset for topasApp module',
		type: 'object',
		required: ['appId', 'isPublished'],
		properties: {
			appId: {
				dataType: 'string',
				fieldNumber: 1,
			},
			isPublished: {
				fieldNumber: 2,
				dataType: 'boolean',
			},
		},
	};

	public async apply({ asset, transaction, stateStore }: ApplyAssetContext<Props>): Promise<void> {
		const stateStoreData = await getStateStoreData<TopasAppModuleChainData>(stateStore, ModuleId.TopasApp);
		const app = getTopasApp(stateStoreData, asset.appId);

		if (app.data.isPublished === asset.isPublished) {
			throw new Error(`App's isPublished state is already set to ${String(asset.isPublished)}.`);
		}

		// TODO: Research and fix potential security risk
		const isAdmin = config.adminAccounts.includes(cryptography.bufferToHex(transaction.senderAddress));
		if (!isAdmin) {
			throw new Error(`Sender is not privileged to set app state.`);
		}

		app.meta = updateMeta(app.meta);
		app.data = {
			...app.data,
			isPublished: asset.isPublished,
		};

		await stateStore.chain.set(TOPAS_APP_KEY, codec.encode(topasAppModuleSchema, stateStoreData));
	}
}
