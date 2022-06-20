import { ApplyAssetContext, BaseAsset, codec, ValidateAssetContext } from 'lisk-sdk';

import { ModuleId } from '../../../types';
import {
    createDateTime,
    createHighscoreEssentials,
    createTopasAppEssentials,
    createUserEssentials,
} from '../../../utils/helpers';
import { getTopasAppById, getTopasUserData } from '../../../utils/reducer_handlers';
import { getStateStoreData } from '../../../utils/store';
import { validateHexString, validateIsPublished } from '../../../utils/validation';
import { LEADERBOARD_ASSET_IDS, LEADERBOARD_MODULE_KEY } from '../constants';
import { leaderboardModuleSchema, postScoreAssetPropsSchema } from '../schemas';
import { Highscore, LeaderboardModuleAccountProps, LeaderboardModuleChainData, PostScoreAssetProps } from '../types';

export class PostScoreAsset extends BaseAsset {
	public name = 'postScore';
	public id = LEADERBOARD_ASSET_IDS.postScore;
	public schema = postScoreAssetPropsSchema;

	public validate({ asset }: ValidateAssetContext<PostScoreAssetProps>): void {
		validateHexString(asset.appId);
	}

	public async apply({
		asset,
		transaction,
		stateStore,
		reducerHandler,
	}: ApplyAssetContext<PostScoreAssetProps>): Promise<void> {
		const account = await stateStore.account.getOrDefault<LeaderboardModuleAccountProps>(transaction.senderAddress);
		const topasUser = await getTopasUserData(reducerHandler, { address: account.address, errorOnEmpty: true });
		const topasApp = await getTopasAppById(reducerHandler, { id: asset.appId });
		validateIsPublished(topasApp);

		const stateStoreData = await getStateStoreData<LeaderboardModuleChainData>(stateStore, ModuleId.Leaderboard);

		const highscore: Highscore = {
			user: createUserEssentials(account, topasUser),
			app: createTopasAppEssentials(topasApp),
			score: asset.score,
			createdAt: createDateTime(),
		};

		const highscoreEssentials = createHighscoreEssentials(highscore);

		// Check if user has already posted highscore for app
		const moduleIndex = stateStoreData.highscores.findIndex(
			score => score.user.username === topasUser.username && score.app.id === asset.appId,
		);

		// If so, check if score is higher and update both module and account data
		if (moduleIndex !== -1) {
			if (asset.score <= stateStoreData.highscores[moduleIndex].score) {
				throw new Error(`Score is equal or less than existing score by user.`);
			}

			stateStoreData.highscores[moduleIndex] = highscore;

			const accountHighscoreIndex = account.leaderboard.highscores.findIndex(score => score.appId === asset.appId);
			account.leaderboard.highscores[accountHighscoreIndex] = highscoreEssentials;
		}

		// If not, add score to both module and account data
		if (moduleIndex === -1) {
			account.leaderboard.highscores.push(highscoreEssentials);
			stateStoreData.highscores.push(highscore);
		}

		await stateStore.account.set(account.address, account);
		await stateStore.chain.set(LEADERBOARD_MODULE_KEY, codec.encode(leaderboardModuleSchema, stateStoreData));
	}
}
