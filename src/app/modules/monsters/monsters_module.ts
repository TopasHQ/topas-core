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

import { AfterBlockApplyContext, AfterGenesisBlockApplyContext, BaseModule, codec, TransactionApplyContext } from 'lisk-sdk';

import config from '../../config';
import { ModuleId, ModuleName, Monster, MonstersModuleChainData } from '../../types';
import { serializeData } from '../../utils/formats';
import {
    bufferToHex,
    chunkSubstr,
    getPseudoRandomBigIntInRange,
    getPseudoRandomNumberInRange,
    popFromArray,
} from '../../utils/helpers';
import { getDataAccessData, getStateStoreData } from '../../utils/store';
import { DestroyMonsterAsset, destroyMonsterAsset } from './assets/destroy_monster_asset';
import { MONSTERS_ASSET_IDS, MONSTERS_MODULE_INIT, MONSTERS_MODULE_KEY } from './constants';
import { monstersModuleSchema } from './schemas';


export class MonstersModule extends BaseModule {
	public name = ModuleName.Monsters;
	public id = ModuleId.Monsters;

	public transactionAssets = [new DestroyMonsterAsset()];

	public events = ['monsterSpawned', 'monsterDestroyed'];

	public actions = {
		getActiveMonsters: async () => {
			const data = await getDataAccessData<MonstersModuleChainData>(this._dataAccess, ModuleId.Monsters);
			return serializeData(data.activeMonsters);
		},
		getActiveMonstersDev: async () => {
			const data = await getDataAccessData<MonstersModuleChainData>(this._dataAccess, ModuleId.Monsters);
			return serializeData(data.activeMonsters);
		},
	};

	public reducers = {};

	// eslint-disable-next-line @typescript-eslint/require-await
	public async afterTransactionApply({ transaction }: TransactionApplyContext) {
		if (transaction.moduleID === ModuleId.Monsters && transaction.assetID === MONSTERS_ASSET_IDS.destroyMonster) {
			const monster = codec.decode<Monster>(destroyMonsterAsset, transaction.asset);

			this._channel.publish('monsters:monsterDestroyed', { id: monster.id });
			this._logger.info('Monster destroyed!');
		}
	}

	public async afterBlockApply({ stateStore, block }: AfterBlockApplyContext) {
		if (block.header.height % config.monsterSpawnRate !== 0) {
			this._logger.debug('Monster not spawned. Block height does not match spawn rate.');
			return;
		}
		const id = bufferToHex(block.header.id);
		const seeds = chunkSubstr(id); // Use the block id to generate multiple 'random' seeds

		const stateStoreData = await getStateStoreData<MonstersModuleChainData>(stateStore, ModuleId.Monsters);

		const locationsTaken = stateStoreData.activeMonsters.map(monster => monster.location);
		const locationsAvailable = Array.from(Array(config.monsterLocations).keys()).filter(
			location => !locationsTaken.includes(location),
		);

		if (!locationsAvailable.length) {
			this._logger.debug('Monster not spawned. All locations taken.');
			return;
		}

		const monster: Monster = {
			id,
			model: getPseudoRandomNumberInRange(0, config.monsterModels - 1, popFromArray(seeds)),
			location: locationsAvailable[getPseudoRandomNumberInRange(0, locationsAvailable.length - 1, popFromArray(seeds))],
			reward: getPseudoRandomBigIntInRange(config.monsterMinReward, config.monsterMaxReward, popFromArray(seeds)),
		};

		stateStoreData.activeMonsters.push(monster);

		await stateStore.chain.set(MONSTERS_MODULE_KEY, codec.encode(monstersModuleSchema, stateStoreData));

		this._channel.publish('monsters:monsterSpawned', { monster: serializeData(monster) });
		this._logger.info('Monster spawned!');
	}

	public async afterGenesisBlockApply(_input: AfterGenesisBlockApplyContext) {
		await _input.stateStore.chain.set(MONSTERS_MODULE_KEY, codec.encode(monstersModuleSchema, MONSTERS_MODULE_INIT));
	}
}
