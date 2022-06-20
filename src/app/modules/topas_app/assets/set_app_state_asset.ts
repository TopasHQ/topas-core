import { ApplyAssetContext, BaseAsset, codec, cryptography, ValidateAssetContext } from 'lisk-sdk';

import config from '../../../config';
import { ModuleId } from '../../../types';
import { updateMeta } from '../../../utils/helpers';
import { getStateStoreData, getTopasApp } from '../../../utils/store';
import { validateHexString } from '../../../utils/validation';
import { TOPAS_APP_MODULE_KEY } from '../constants';
import { setAppStateAssetPropsSchema, topasAppModuleSchema } from '../schemas';
import { SetAppStateAssetProps, TopasAppModuleChainData } from '../types';

export class SetAppStateAsset extends BaseAsset {
	public name = 'setAppState';
	public id = 3;
	public schema = setAppStateAssetPropsSchema;

	public validate({ asset }: ValidateAssetContext<SetAppStateAssetProps>): void {
		validateHexString(asset.appId);
	}

	public async apply({ asset, transaction, stateStore }: ApplyAssetContext<SetAppStateAssetProps>): Promise<void> {
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

		await stateStore.chain.set(TOPAS_APP_MODULE_KEY, codec.encode(topasAppModuleSchema, stateStoreData));
	}
}
