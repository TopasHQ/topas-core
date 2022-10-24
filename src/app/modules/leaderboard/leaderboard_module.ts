import { AfterBlockApplyContext, AfterGenesisBlockApplyContext, BaseModule, codec } from 'lisk-sdk';

import config from '../../config';
import { ModuleId, ModuleName } from '../../types';
import { getDataAccessData } from '../../utils/store';
import { PostScoreAsset } from './assets/post_score_asset';
import { LEADERBOARD_MODULE_INIT, LEADERBOARD_MODULE_KEY } from './constants';
import { leaderboardAccountSchema, leaderboardModuleSchema } from './schemas';
import { Highscore, LeaderboardModuleChainData } from './types';

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

	public reducers = {
		getHighscores: async (): Promise<Highscore[]> =>
			(await getDataAccessData<LeaderboardModuleChainData>(this._dataAccess, ModuleId.Leaderboard)).highscores,
	};

	public async afterBlockApply({ stateStore, block }: AfterBlockApplyContext) {
		// Logic to reset leaderboard
		if (block.header.height % config.appLeaderboardDuration !== 0) {
			return;
		}

		const stateStoreData = await getDataAccessData<LeaderboardModuleChainData>(this._dataAccess, ModuleId.Leaderboard);
		stateStoreData.highscores = [];
		await stateStore.chain.set(LEADERBOARD_MODULE_KEY, codec.encode(leaderboardModuleSchema, stateStoreData));

		this._logger.info('App leaderboard duration reached; highscores have been reset');
	}

	public async afterGenesisBlockApply(_input: AfterGenesisBlockApplyContext) {
		await _input.stateStore.chain.set(
			LEADERBOARD_MODULE_KEY,
			codec.encode(leaderboardModuleSchema, LEADERBOARD_MODULE_INIT),
		);
	}
}
