import { ApplyAssetContext, BaseAsset, ValidateAssetContext } from 'lisk-sdk';

import { validateTransactionFee, validateUuid } from '../../../utils/validation';
import { updateAvatarAssetPropsSchema } from '../schemas';
import { TopasUserModuleAccountProps, UpdateAvatarAssetProps } from '../types';

export class UpdateAvatarAsset extends BaseAsset {
	public name = 'updateAvatar';
	public id = 2;
	public fee = BigInt('500000000');
	public schema = updateAvatarAssetPropsSchema;

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
