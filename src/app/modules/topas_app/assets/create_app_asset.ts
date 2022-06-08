import { ApplyAssetContext, BaseAsset, codec, ValidateAssetContext } from 'lisk-sdk';

import config from '../../../config';
import { ModuleId, TopasApp, TopasAppModuleAccountProps, TopasAppModuleChainData } from '../../../types';
import { bufferToHex, createMeta, createTopasAppEssentials, createUserEssentials } from '../../../utils/helpers';
import { getTopasUserData } from '../../../utils/reducer_handlers';
import { getStateStoreData } from '../../../utils/store';
import { validateEntranceFee, validateTransactionFee } from '../../../utils/validation';
import { TOPAS_APP_ASSET_IDS, TOPAS_APP_FEES } from '../constants';
import { TOPAS_APP_KEY, topasAppModuleSchema } from '../schemas';

type Props = {
	type: number;
	title: string;
	description: string;
	tipsEnabled: boolean;
	entranceFee: bigint;
};

export class CreateAppAsset extends BaseAsset {
	public name = 'createApp';
	public id = TOPAS_APP_ASSET_IDS.createApp;
	public fee = TOPAS_APP_FEES.createApp;

	public schema = {
		$id: 'topasApp/createApp-asset',
		title: 'CreateAppAsset transaction asset for topasApp module',
		type: 'object',
		required: ['type', 'title', 'description', 'tipsEnabled', 'entranceFee'],
		properties: {
			type: {
				dataType: 'uint32',
				fieldNumber: 1,
			},
			title: {
				dataType: 'string',
				fieldNumber: 2,
				minLength: config.appTitleMinLength,
				maxLength: config.appTitleMaxLength,
			},
			description: {
				dataType: 'string',
				fieldNumber: 3,
				minLength: config.appDescriptionMinLength,
				maxLength: config.appDescriptionMaxLength,
			},
			tipsEnabled: {
				fieldNumber: 4,
				dataType: 'boolean',
			},
			entranceFee: {
				fieldNumber: 5,
				dataType: 'uint64',
			},
		},
	};

	public validate({ transaction, asset }: ValidateAssetContext<Props>): void {
		validateTransactionFee(transaction, this.fee);
		validateEntranceFee(asset.entranceFee);
	}

	public async apply({ asset, transaction, stateStore, reducerHandler }: ApplyAssetContext<Props>): Promise<void> {
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
				numOfUses: 0,
			},
		};

		stateStoreData.apps.push(app);
		account.topasApp.appsCreated.push(createTopasAppEssentials(app));

		await stateStore.chain.set(TOPAS_APP_KEY, codec.encode(topasAppModuleSchema, stateStoreData));
		await stateStore.account.set(account.address, account);
	}
}
