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

import { AfterGenesisBlockApplyContext, BaseModule, codec } from 'lisk-sdk';

import { LeaderboardModuleChainData, ModuleId, ModuleName } from '../../types';
import { getDataAccessData } from '../../utils/store';
import { PostScoreAsset } from './assets/post_score_asset';
import { LEADERBOARD_MODULE_INIT, LEADERBOARD_MODULE_KEY } from './constants';
import { leaderboardAccountSchema, leaderboardModuleSchema } from './schemas';

export class LeaderboardModule extends BaseModule {
	public name = ModuleName.Leaderboard;
	public id = ModuleId.Leaderboard;
	public accountSchema = leaderboardAccountSchema;

	public transactionAssets = [new PostScoreAsset()];

	public events = [];

	public actions = {
		getHighscores: async () =>
			(await getDataAccessData<LeaderboardModuleChainData>(this._dataAccess, ModuleId.Leaderboard)).highscores,
	};

	public reducers = {};

	public async afterGenesisBlockApply(_input: AfterGenesisBlockApplyContext) {
		await _input.stateStore.chain.set(
			LEADERBOARD_MODULE_KEY,
			codec.encode(leaderboardModuleSchema, LEADERBOARD_MODULE_INIT),
		);
	}
}
