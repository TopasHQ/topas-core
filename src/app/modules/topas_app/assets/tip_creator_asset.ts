import { ApplyAssetContext, BaseAsset, ValidateAssetContext } from 'lisk-sdk';

import { TICKER } from '../../../constants';
import { ModuleId, TopasAppModuleAccountProps, TopasAppModuleChainData } from '../../../types';
import { beddowsToLsk, senderIsAppCreator } from '../../../utils/helpers';
import { getStateStoreData, getTopasApp } from '../../../utils/store';
import { validateHexString, validateIsPublished, validateRegistration, validateTipAmount } from '../../../utils/validation';
import { TOPAS_APP_ASSET_IDS } from '../constants';

type Props = {
	appId: string;
	tipAmount: bigint;
};

export class TipCreatorAsset extends BaseAsset {
	public name = 'tipCreator';
	public id = TOPAS_APP_ASSET_IDS.tipCreator;

	public schema = {
		$id: 'topasApp/tipCreator-asset',
		title: 'TipCreatorAsset transaction asset for topasApp module',
		type: 'object',
		required: ['appId', 'tipAmount'],
		properties: {
			appId: {
				dataType: 'string',
				fieldNumber: 1,
			},
			tipAmount: {
				dataType: 'uint64',
				fieldNumber: 2,
			},
		},
	};

	public validate({ asset }: ValidateAssetContext<Props>): void {
		validateTipAmount(asset.tipAmount);
		validateHexString(asset.appId);
	}

	public async apply({ asset, transaction, stateStore, reducerHandler }: ApplyAssetContext<Props>): Promise<void> {
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
