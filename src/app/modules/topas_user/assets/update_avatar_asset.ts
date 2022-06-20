import { ApplyAssetContext, BaseAsset, ValidateAssetContext } from 'lisk-sdk';

import { TopasUserModuleAccountProps } from '../../../types';
import { validateTransactionFee, validateUuid } from '../../../utils/validation';
import { TOPAS_USER_ASSET_IDS, TOPAS_USER_FEES } from '../constants';
import { UpdateAvatarAssetProps } from '../types';

export class UpdateAvatarAsset extends BaseAsset {
	public name = 'updateAvatar';
	public id = TOPAS_USER_ASSET_IDS.updateAvatar;
	public fee = TOPAS_USER_FEES.updateAvatar;

	public schema = {
		$id: 'topasUser/updateAvatar-asset',
		title: 'UpdateAvatarAsset transaction asset for topasUser module',
		type: 'object',
		required: ['avatar'],
		properties: {
			avatar: {
				dataType: 'string',
				fieldNumber: 1,
			},
		},
	};

	public validate({ transaction, asset }: ValidateAssetContext<UpdateAvatarAssetProps>): void {
		validateTransactionFee(transaction, this.fee);
		validateUuid(asset.avatar);
	}

	public async apply({ asset, transaction, stateStore }: ApplyAssetContext<UpdateAvatarAssetProps>): Promise<void> {
		const account = await stateStore.account.getOrDefault<TopasUserModuleAccountProps>(transaction.senderAddress);

		if (account.topasUser.avatar === asset.avatar) {
			throw new Error(`Avatar id is already assigned to user.`);
		}

		account.topasUser.avatar = asset.avatar;

		await stateStore.account.set(account.address, account);
	}
}
