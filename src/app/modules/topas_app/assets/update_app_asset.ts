import { ApplyAssetContext, BaseAsset, codec, ValidateAssetContext } from 'lisk-sdk';

import { ModuleId } from '../../../types';
import { senderIsAppCreator, updateMeta } from '../../../utils/helpers';
import { getStateStoreData, getTopasApp } from '../../../utils/store';
import { validateEntranceFee, validateHexString, validateTransactionFee } from '../../../utils/validation';
import { TOPAS_APP_MODULE_KEY } from '../constants';
import { topasAppModuleSchema, updateAppAssetPropsSchema } from '../schemas';
import { TopasAppModuleAccountProps, TopasAppModuleChainData, UpdateAppAssetProps } from '../types';

export class UpdateAppAsset extends BaseAsset {
	public name = 'updateApp';
	public id = 2;
	public fee = BigInt('500000000');
	public schema = updateAppAssetPropsSchema;

	public validate({ transaction, asset }: ValidateAssetContext<UpdateAppAssetProps>): void {
		validateTransactionFee(transaction, this.fee);
		validateEntranceFee(asset.entranceFee);
		validateHexString(asset.id);
	}

	public async apply({ asset, transaction, stateStore }: ApplyAssetContext<UpdateAppAssetProps>): Promise<void> {
		const account = await stateStore.account.getOrDefault<TopasAppModuleAccountProps>(transaction.senderAddress);
		const stateStoreData = await getStateStoreData<TopasAppModuleChainData>(stateStore, ModuleId.TopasApp);

		const app = getTopasApp(stateStoreData, asset.id);

		const isCreator = senderIsAppCreator(app, transaction);
		if (!isCreator) {
			throw new Error(`Sender is not creator of app.`);
		}

		app.meta = updateMeta(app.meta);
		app.data = {
			...app.data,
			...asset,
		};

		await stateStore.chain.set(TOPAS_APP_MODULE_KEY, codec.encode(topasAppModuleSchema, stateStoreData));
		await stateStore.account.set(account.address, account);
	}
}
