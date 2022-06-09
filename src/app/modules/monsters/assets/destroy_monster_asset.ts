import { ApplyAssetContext, BaseAsset, codec, ValidateAssetContext } from 'lisk-sdk';

import { ModuleId, MonstersModuleChainData } from '../../../types';
import { getStateStoreData } from '../../../utils/store';
import { validateHexString, validateRegistration } from '../../../utils/validation';
import { MONSTERS_ASSET_IDS } from '../constants';
import { MONSTERS_KEY, monstersModuleSchema } from '../schemas';

type Props = {
	id: string;
};

export class DestroyMonsterAsset extends BaseAsset {
	public name = 'destroyMonster';
	public id = MONSTERS_ASSET_IDS.destroyMonster;

	public schema = {
		$id: 'monsters/destroyMonster-asset',
		title: 'DestroyMonsterAsset transaction asset for monsters module',
		type: 'object',
		required: ['id'],
		properties: {
			id: {
				dataType: 'string',
				fieldNumber: 1,
			},
		},
	};
	public validate({ asset }: ValidateAssetContext<Props>): void {
		validateHexString(asset.id);
	}

	public async apply({ asset, transaction, stateStore, reducerHandler }: ApplyAssetContext<Props>): Promise<void> {
		await validateRegistration(reducerHandler, transaction.senderAddress);
		const stateStoreData = await getStateStoreData<MonstersModuleChainData>(stateStore, ModuleId.Monsters);

		const monster = stateStoreData.activeMonsters.find(m => m.id === asset.id);

		if (!monster) {
			throw Error('Monster does not exist.');
		}

		stateStoreData.activeMonsters = stateStoreData.activeMonsters.filter(m => m.id !== asset.id);

		await reducerHandler.invoke('token:credit', {
			address: transaction.senderAddress,
			amount: monster.reward,
		});

		await stateStore.chain.set(MONSTERS_KEY, codec.encode(monstersModuleSchema, stateStoreData));
	}
}
