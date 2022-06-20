import { Highscore } from './types';

export const LEADERBOARD_MODULE_KEY = 'topas:leaderboardModuleData';

export const LEADERBOARD_MODULE_INIT = {
	highscores: [] as Highscore[],
};

export const LEADERBOARD_ASSET_IDS = {
	postScore: 1,
};

type Fees = { [key in keyof typeof LEADERBOARD_ASSET_IDS]?: bigint };

export const LEADERBOARD_FEES: Fees = {
	// If asset is not listed, use min fee
};
