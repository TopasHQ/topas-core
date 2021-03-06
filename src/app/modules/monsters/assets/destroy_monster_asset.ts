import { ApplyAssetContext, BaseAsset, codec, ValidateAssetContext } from 'lisk-sdk';

import { ModuleId } from '../../../types';
import { getStateStoreData } from '../../../utils/store';
import { validateHexString, validateRegistration } from '../../../utils/validation';
import { MONSTERS_MODULE_KEY } from '../constants';
import { destroyMonsterAssetPropsSchemas, monstersModuleSchema } from '../schemas';
import { DestroyMonsterAssetProps, MonstersModuleChainData } from '../types';

export const destroyMonsterAsset = destroyMonsterAssetPropsSchemas;

export class DestroyMonsterAsset extends BaseAsset {
	public name = 'destroyMonster';
	public id = 1;
	public schema = destroyMonsterAsset;

	public validate({ asset }: ValidateAssetContext<DestroyMonsterAssetProps>): void {
		validateHexString(asset.id);
	}

	public async apply({
		asset,
		transaction,
		stateStore,
		reducerHandler,
	}: ApplyAssetContext<DestroyMonsterAssetProps>): Promise<void> {
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

		await stateStore.chain.set(MONSTERS_MODULE_KEY, codec.encode(monstersModuleSchema, stateStoreData));
	}
}
