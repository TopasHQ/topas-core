import { ApplyAssetContext, BaseAsset, codec, ValidateAssetContext } from 'lisk-sdk';

import config from '../../../config';
import { ModuleId, TopasApp, TopasAppModuleAccountProps, TopasAppModuleChainData } from '../../../types';
import { createMeta, createTopasAppEssentials, createUserEssentials } from '../../../utils/helpers';
import { getTopasUserData } from '../../../utils/reducer_handlers';
import { getStateStoreData } from '../../../utils/store';
import { validateEntranceFee, validateFee, validateUuid } from '../../../utils/validation';
import { TOPAS_APP_ASSET_IDS, TOPAS_APP_FEES } from '../constants';
import { TOPAS_APP_KEY, topasAppModuleSchema } from '../schemas';

type Props = {
	id: string;
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
		required: ['id', 'type', 'title', 'description', 'tipsEnabled', 'entranceFee'],
		properties: {
			id: {
				dataType: 'string',
				fieldNumber: 1,
			},
			type: {
				dataType: 'uint32',
				fieldNumber: 2,
			},
			title: {
				dataType: 'string',
				fieldNumber: 3,
				minLength: config.appTitleMinLength,
				maxLength: config.appTitleMaxLength,
			},
			description: {
				dataType: 'string',
				fieldNumber: 4,
				minLength: config.appDescriptionMinLength,
				maxLength: config.appDescriptionMaxLength,
			},
			tipsEnabled: {
				fieldNumber: 5,
				dataType: 'boolean',
			},
			entranceFee: {
				fieldNumber: 6,
				dataType: 'uint64',
			},
		},
	};

	public validate({ transaction, asset }: ValidateAssetContext<Props>): void {
		validateFee(transaction, this.fee);
		validateUuid(asset.id);
		validateEntranceFee(asset.entranceFee);
	}

	public async apply({ asset, transaction, stateStore, reducerHandler }: ApplyAssetContext<Props>): Promise<void> {
		const account = await stateStore.account.getOrDefault<TopasAppModuleAccountProps>(transaction.senderAddress);
		const topasUser = await getTopasUserData(reducerHandler, { address: account.address, errorOnEmpty: true });
		const stateStoreData = await getStateStoreData<TopasAppModuleChainData>(stateStore, ModuleId.TopasApp);

		const appExists = !!stateStoreData.apps.find(p => p.data.id === asset.id || p.data.title === asset.title);
		if (appExists) {
			throw new Error(`App already exists.`);
		}

		const app: TopasApp = {
			meta: createMeta(),
			data: {
				...asset,
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
