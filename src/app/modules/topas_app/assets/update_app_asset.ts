import { ApplyAssetContext, BaseAsset, codec, ValidateAssetContext } from 'lisk-sdk';

import config from '../../../config';
import { ModuleId, TopasAppModuleAccountProps, TopasAppModuleChainData } from '../../../types';
import { senderIsAppCreator, updateMeta } from '../../../utils/helpers';
import { getStateStoreData, getTopasApp } from '../../../utils/store';
import { validateEntranceFee, validateHexString, validateTransactionFee } from '../../../utils/validation';
import { TOPAS_APP_ASSET_IDS, TOPAS_APP_FEES, TOPAS_APP_MODULE_KEY } from '../constants';
import { topasAppModuleSchema } from '../schemas';
import { UpdateAppAssetProps } from '../types';

export class UpdateAppAsset extends BaseAsset {
	public name = 'updateApp';
	public id = TOPAS_APP_ASSET_IDS.updateApp;
	public fee = TOPAS_APP_FEES.updateApp;

	public schema = {
		$id: 'topasApp/updateApp-asset',
		title: 'UpdateAppAsset transaction asset for topasApp module',
		type: 'object',
		required: ['id', 'description', 'tipsEnabled', 'entranceFee'],
		properties: {
			id: {
				dataType: 'string',
				fieldNumber: 1,
			},
			description: {
				dataType: 'string',
				fieldNumber: 2,
				minLength: config.appDescriptionMinLength,
				maxLength: config.appDescriptionMaxLength,
			},
			tipsEnabled: {
				fieldNumber: 3,
				dataType: 'boolean',
			},
			entranceFee: {
				fieldNumber: 4,
				dataType: 'uint64',
			},
		},
	};

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
