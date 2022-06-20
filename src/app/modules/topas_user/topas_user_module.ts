import { BaseModule, StateStore } from 'lisk-sdk';

import { ModuleId, ModuleName } from '../../types';
import { RegisterAsset } from './assets/register_asset';
import { UpdateAvatarAsset } from './assets/update_avatar_asset';
import { topasUserAccountSchema } from './schemas';
import { TopasUser, TopasUserModuleAccountProps } from './types';

export class TopasUserModule extends BaseModule {
	public name = ModuleName.TopasUser;
	public id = ModuleId.TopasUser;
	public accountSchema = topasUserAccountSchema;

	public transactionAssets = [new RegisterAsset(), new UpdateAvatarAsset()];

	public events = [];

	public reducers = {
		getTopasUserData: async (params: Record<string, unknown>, stateStore: StateStore): Promise<TopasUser> => {
			const { address, errorOnEmpty } = params;

			if (!Buffer.isBuffer(address)) {
				throw new Error('Address must be a buffer');
			}

			const account = await stateStore.account.getOrDefault<TopasUserModuleAccountProps>(address);

			if (errorOnEmpty && !account.topasUser.username) {
				throw new Error('Account is not registered.');
			}

			return account.topasUser;
		},
	};
}
