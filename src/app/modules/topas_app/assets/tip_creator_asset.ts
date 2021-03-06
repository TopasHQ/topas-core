import { ApplyAssetContext, BaseAsset, ValidateAssetContext } from 'lisk-sdk';

import { TICKER } from '../../../constants';
import { ModuleId } from '../../../types';
import { beddowsToLsk, senderIsAppCreator } from '../../../utils/helpers';
import { getStateStoreData, getTopasApp } from '../../../utils/store';
import { validateHexString, validateIsPublished, validateRegistration, validateTipAmount } from '../../../utils/validation';
import { tipCreatorAssetPropsSchema } from '../schemas';
import { TipCreatorAssetProps, TopasAppModuleAccountProps, TopasAppModuleChainData } from '../types';

export class TipCreatorAsset extends BaseAsset {
	public name = 'tipCreator';
	public id = 5;
	public schema = tipCreatorAssetPropsSchema;

	public validate({ asset }: ValidateAssetContext<TipCreatorAssetProps>): void {
		validateTipAmount(asset.tipAmount);
		validateHexString(asset.appId);
	}

	public async apply({
		asset,
		transaction,
		stateStore,
		reducerHandler,
	}: ApplyAssetContext<TipCreatorAssetProps>): Promise<void> {
		const account = await stateStore.account.getOrDefault<TopasAppModuleAccountProps>(transaction.senderAddress);
		await validateRegistration(reducerHandler, account.address);

		const stateStoreData = await getStateStoreData<TopasAppModuleChainData>(stateStore, ModuleId.TopasApp);

		const app = getTopasApp(stateStoreData, asset.appId);
		validateIsPublished(app);

		const isCreator = senderIsAppCreator(app, transaction);
		if (isCreator) {
			throw new Error(`Sender is creator of app.`);
		}

		const { tipAmount } = asset;
		const totalCost = tipAmount + transaction.fee;

		const accountBalance: bigint = await reducerHandler.invoke('token:getBalance', {
			address: transaction.senderAddress,
		});

		if (totalCost > accountBalance) {
			throw new Error(`Sender balance is too low. Required ${beddowsToLsk(totalCost)} ${TICKER}.`);
		}

		await reducerHandler.invoke('token:debit', {
			address: transaction.senderAddress,
			amount: tipAmount,
		});

		await reducerHandler.invoke('token:credit', {
			address: app.data.creator.address,
			amount: tipAmount,
		});

		await stateStore.account.set(account.address, account);
	}
}
