import { ApplyAssetContext, BaseAsset, ValidateAssetContext } from 'lisk-sdk';

import config from '../../../config';
import { MemberType, TopasUser, TopasUserModuleAccountProps } from '../../../types';
import { createDateTime } from '../../../utils/helpers';
import { validateTransactionFee, validateUuid } from '../../../utils/validation';
import { TOPAS_USER_ASSET_IDS, TOPAS_USER_FEES } from '../constants';

type Props = {
	username: string;
	avatar: string;
};

export class RegisterAsset extends BaseAsset {
	public name = 'register';
	public id = TOPAS_USER_ASSET_IDS.register;
	public fee = TOPAS_USER_FEES.register;

	public schema = {
		$id: 'topasUser/register-asset',
		title: 'RegisterAsset transaction asset for topasUser module',
		type: 'object',
		required: ['username', 'avatar'],
		properties: {
			username: {
				dataType: 'string',
				fieldNumber: 1,
				minLength: config.usernameMinLength,
				maxLength: config.usernameMaxLength,
			},
			avatar: {
				dataType: 'string',
				fieldNumber: 2,
			},
		},
	};

	public validate({ transaction, asset }: ValidateAssetContext<Props>): void {
		validateTransactionFee(transaction, this.fee);
		validateUuid(asset.avatar);
	}

	public async apply({ asset, transaction, stateStore }: ApplyAssetContext<Props>): Promise<void> {
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
