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

import { ModuleId, ModuleName, MonstersModuleChainData } from '../../types';
import { getDataAccessData } from '../../utils/store';
import { DestroyMonsterAsset } from './assets/destroy_monster_asset';
import { MONSTERS_INIT, MONSTERS_KEY, monstersModuleSchema } from './schemas';

export class MonstersModule extends BaseModule {
	public name = ModuleName.Monsters;
	public id = ModuleId.Monsters;

	public transactionAssets = [new DestroyMonsterAsset()];

	public events = [];

	public actions = {
		getActiveMonsters: async () =>
			(await getDataAccessData<MonstersModuleChainData>(this._dataAccess, ModuleId.Monsters)).activeMonsters,
	};

	public reducers = {};

	public async afterBlockApply(_input: AfterBlockApplyContext) {
		// wip
	}

	public async afterGenesisBlockApply(_input: AfterGenesisBlockApplyContext) {
		await _input.stateStore.chain.set(MONSTERS_KEY, codec.encode(monstersModuleSchema, MONSTERS_INIT));
	}
}
