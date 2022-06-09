/*
 * LiskHQ/lisk-commander
 * Copyright © 2021 Lisk Foundation
 *
 * See the LICENSE file at the top-level directory of this distribution
 * for licensing information.
 *
 * Unless otherwise agreed in a custom licensing agreement with the Lisk Foundation,
 * no part of this software, including this file, may be copied, modified,
 * propagated, or distributed except according to the terms contained in the
 * LICENSE file.
 *
 * Removal or modification of this copyright notice is prohibited.
 *
 */
import { AfterBlockApplyContext, AfterGenesisBlockApplyContext, BaseModule, codec } from 'lisk-sdk';

import config from '../../config';
import { ModuleId, ModuleName, Monster, MonstersModuleChainData } from '../../types';
import { parseChainData } from '../../utils/formats';
import { bufferToHex } from '../../utils/helpers';
import { getDataAccessData, getStateStoreData } from '../../utils/store';
import { DestroyMonsterAsset } from './assets/destroy_monster_asset';
import { MONSTERS_INIT, MONSTERS_KEY, monstersModuleSchema } from './schemas';

export class MonstersModule extends BaseModule {
	public name = ModuleName.Monsters;
	public id = ModuleId.Monsters;

	public transactionAssets = [new DestroyMonsterAsset()];

	public events = ['monsterSpawned'];

	public actions = {
		getActiveMonsters: async () => {
			const data = await getDataAccessData<MonstersModuleChainData>(this._dataAccess, ModuleId.Monsters);
			return data.activeMonsters;
		},
		getActiveMonstersDev: async () => {
			const data = await getDataAccessData<MonstersModuleChainData>(this._dataAccess, ModuleId.Monsters);
			return parseChainData(data.activeMonsters);
		},
	};

	public reducers = {};

	public async afterBlockApply({ stateStore, block }: AfterBlockApplyContext) {
		if (block.header.height % config.monsterSpawnRate !== 0) {
			this._logger.debug('Monster not spawned.');
			return;
		}

		const stateStoreData = await getStateStoreData<MonstersModuleChainData>(stateStore, ModuleId.Monsters);

		const id = bufferToHex(block.header.id);
		const monster: Monster = {
			id,
			model: 1,
			location: 1,
			reward: BigInt('1'),
		};

		stateStoreData.activeMonsters.push(monster);

		await stateStore.chain.set(MONSTERS_KEY, codec.encode(monstersModuleSchema, stateStoreData));

		this._channel.publish('monsters:monsterSpawned', { id });
		this._logger.info('Monster spawned!');
	}

	public async afterGenesisBlockApply(_input: AfterGenesisBlockApplyContext) {
		await _input.stateStore.chain.set(MONSTERS_KEY, codec.encode(monstersModuleSchema, MONSTERS_INIT));
	}
}
