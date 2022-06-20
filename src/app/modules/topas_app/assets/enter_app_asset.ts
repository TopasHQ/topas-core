import { ApplyAssetContext, BaseAsset, codec, ValidateAssetContext } from 'lisk-sdk';

import { TICKER } from '../../../constants';
import { ModuleId } from '../../../types';
import { beddowsToLsk, createTopasAppEssentials, senderIsAppCreator, senderOwnsApp } from '../../../utils/helpers';
import { getStateStoreData, getTopasApp } from '../../../utils/store';
import { validateHexString, validateIsPublished, validateRegistration } from '../../../utils/validation';
import { TOPAS_APP_ASSET_IDS, TOPAS_APP_MODULE_KEY } from '../constants';
import { topasAppModuleSchema } from '../schemas';
import { EnterAppAssetProps, TopasAppModuleAccountProps, TopasAppModuleChainData } from '../types';

export class EnterAppAsset extends BaseAsset {
	public name = 'enterApp';
	public id = TOPAS_APP_ASSET_IDS.enterApp;

	public schema = {
		$id: 'topasApp/enterApp-asset',
		title: 'EnterAppAsset transaction asset for topasApp module',
		type: 'object',
		required: ['appId'],
		properties: {
			appId: {
				dataType: 'string',
				fieldNumber: 1,
			},
		},
	};

	public validate({ asset }: ValidateAssetContext<EnterAppAssetProps>): void {
		validateHexString(asset.appId);
	}

	public async apply({
		asset,
		transaction,
		stateStore,
		reducerHandler,
	}: ApplyAssetContext<EnterAppAssetProps>): Promise<void> {
		const account = await stateStore.account.getOrDefault<TopasAppModuleAccountProps>(transaction.senderAddress);
		await validateRegistration(reducerHandler, account.address);

		const stateStoreData = await getStateStoreData<TopasAppModuleChainData>(stateStore, ModuleId.TopasApp);

		const app = getTopasApp(stateStoreData, asset.appId);
		validateIsPublished(app);

		const isCreator = senderIsAppCreator(app, transaction);
		if (!isCreator) {
			if (senderOwnsApp(app, account)) {
				throw new Error(`Sender already owns app.`);
			}

			const { entranceFee } = app.data;
			const totalCost = entranceFee + transaction.fee;

			const accountBalance: bigint = await reducerHandler.invoke('token:getBalance', {
				address: transaction.senderAddress,
			});

			if (totalCost > accountBalance) {
				throw new Error(`Sender balance is too low. Required ${beddowsToLsk(totalCost)} ${TICKER}.`);
			}

			await reducerHandler.invoke('token:debit', {
				address: transaction.senderAddress,
				amount: entranceFee,
			});

			await reducerHandler.invoke('token:credit', {
				address: app.data.creator.address,
				amount: entranceFee,
			});

			app.data.numOfUses += 1;
			account.topasApp.appsPurchased.push(createTopasAppEssentials(app));
		}

		await stateStore.chain.set(TOPAS_APP_MODULE_KEY, codec.encode(topasAppModuleSchema, stateStoreData));
		await stateStore.account.set(account.address, account);
	}
}
