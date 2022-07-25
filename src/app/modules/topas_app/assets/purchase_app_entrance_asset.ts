import { ApplyAssetContext, BaseAsset, codec, ValidateAssetContext } from 'lisk-sdk';

import { TICKER } from '../../../constants';
import { ModuleId, TopasAppPurchase } from '../../../types';
import {
    beddowsToLsk,
    bufferToHex,
    createDateTime,
    createTopasAppEssentials,
    senderIsAppCreator,
} from '../../../utils/helpers';
import { getStateStoreData, getTopasApp } from '../../../utils/store';
import { validateHexString, validateIsPublished, validateRegistration } from '../../../utils/validation';
import { TOPAS_APP_MODULE_KEY } from '../constants';
import { purchaseAppEntranceAssetPropsSchema, topasAppModuleSchema } from '../schemas';
import { PurchaseAppEntranceAssetProps, TopasAppMode, TopasAppModuleAccountProps, TopasAppModuleChainData } from '../types';

export class PurchaseAppEntranceAsset extends BaseAsset {
	public name = 'purchaseAppEntrance';
	public id = 4;
	public schema = purchaseAppEntranceAssetPropsSchema;

	public validate({ asset }: ValidateAssetContext<PurchaseAppEntranceAssetProps>): void {
		validateHexString(asset.appId);
	}

	public async apply({
		asset,
		transaction,
		stateStore,
		reducerHandler,
	}: ApplyAssetContext<PurchaseAppEntranceAssetProps>): Promise<void> {
		const account = await stateStore.account.getOrDefault<TopasAppModuleAccountProps>(transaction.senderAddress);
		await validateRegistration(reducerHandler, account.address);

		const stateStoreData = await getStateStoreData<TopasAppModuleChainData>(stateStore, ModuleId.TopasApp);

		const app = getTopasApp(stateStoreData, asset.appId);
		validateIsPublished(app);

		if (senderIsAppCreator(app, transaction)) {
			throw new Error('Sender is creator of app.');
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

		if (app.data.mode === TopasAppMode.feeToChest) {
			app.data.prize += entranceFee;
		}

		if (app.data.mode !== TopasAppMode.feeToChest) {
			await reducerHandler.invoke('token:credit', {
				address: app.data.creator.address,
				amount: entranceFee,
			});
		}

		app.data.numOfUses += 1;
		await stateStore.chain.set(TOPAS_APP_MODULE_KEY, codec.encode(topasAppModuleSchema, stateStoreData));

		const appPurchase: TopasAppPurchase = {
			...createTopasAppEssentials(app),
			purchaseId: bufferToHex(transaction.id),
			createdAt: createDateTime(),
		};
		account.topasApp.appsPurchases.push(appPurchase);
		await stateStore.account.set(account.address, account);
	}
}
