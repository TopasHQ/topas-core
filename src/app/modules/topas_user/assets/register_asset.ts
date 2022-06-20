import { ApplyAssetContext, BaseAsset, ValidateAssetContext } from 'lisk-sdk';

import { createDateTime } from '../../../utils/helpers';
import { validateTransactionFee, validateUuid } from '../../../utils/validation';
import { TOPAS_USER_ASSET_IDS, TOPAS_USER_FEES } from '../constants';
import { registerAssetPropsSchema } from '../schemas';
import { MemberType, RegisterAssetProps, TopasUser, TopasUserModuleAccountProps } from '../types';

export class RegisterAsset extends BaseAsset {
	public name = 'register';
	public id = TOPAS_USER_ASSET_IDS.register;
	public fee = TOPAS_USER_FEES.register;
	public schema = registerAssetPropsSchema;

	public validate({ transaction, asset }: ValidateAssetContext<RegisterAssetProps>): void {
		validateTransactionFee(transaction, this.fee);
		validateUuid(asset.avatar);
	}

	public async apply({ asset, transaction, stateStore }: ApplyAssetContext<RegisterAssetProps>): Promise<void> {
		const account = await stateStore.account.getOrDefault<TopasUserModuleAccountProps>(transaction.senderAddress);

		if (account.topasUser.username) {
			throw new Error(`Sender is already registered.`);
		}

		const user: TopasUser = {
			...asset,
			memberType: MemberType.Registered,
			memberSince: createDateTime(),
		};

		account.topasUser = user;

		await stateStore.account.set(account.address, account);
	}
}
