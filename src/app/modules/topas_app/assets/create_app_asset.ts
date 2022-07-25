import { ApplyAssetContext, BaseAsset, codec, ValidateAssetContext } from 'lisk-sdk';

import { ModuleId } from '../../../types';
import { bufferToHex, createMeta, createTopasAppEssentials, createUserEssentials } from '../../../utils/helpers';
import { getTopasUserData } from '../../../utils/reducer_handlers';
import { getStateStoreData } from '../../../utils/store';
import { validateEntranceFee, validateTransactionFee } from '../../../utils/validation';
import { TOPAS_APP_MODULE_KEY } from '../constants';
import { createAppAssetPropsSchemas, topasAppModuleSchema } from '../schemas';
import { CreateAppAssetProps, TopasApp, TopasAppModuleAccountProps, TopasAppModuleChainData } from '../types';

export class CreateAppAsset extends BaseAsset {
	public name = 'createApp';
	public id = 1;
	public fee = BigInt('5000000000');
	public schema = createAppAssetPropsSchemas;

	public validate({ transaction, asset }: ValidateAssetContext<CreateAppAssetProps>): void {
		validateTransactionFee(transaction, this.fee);
		validateEntranceFee(asset.entranceFee);
	}

	public async apply({
		asset,
		transaction,
		stateStore,
		reducerHandler,
	}: ApplyAssetContext<CreateAppAssetProps>): Promise<void> {
		const account = await stateStore.account.getOrDefault<TopasAppModuleAccountProps>(transaction.senderAddress);
		const topasUser = await getTopasUserData(reducerHandler, { address: account.address, errorOnEmpty: true });
		const stateStoreData = await getStateStoreData<TopasAppModuleChainData>(stateStore, ModuleId.TopasApp);

		const appExists = !!stateStoreData.apps.find(p => p.data.title === asset.title);
		if (appExists) {
			throw new Error(`App already exists.`);
		}

		const app: TopasApp = {
			meta: createMeta(),
			data: {
				...asset,
				id: bufferToHex(transaction.id),
				creator: createUserEssentials(account, topasUser),
				isPublished: false,
				purchases: 0,
			},
		};

		stateStoreData.apps.push(app);
		account.topasApp.appsCreated.push(createTopasAppEssentials(app));

		await stateStore.chain.set(TOPAS_APP_MODULE_KEY, codec.encode(topasAppModuleSchema, stateStoreData));
		await stateStore.account.set(account.address, account);
	}
}
