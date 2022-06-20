import {
    AccountDefaultProps,
    DateTimeMetadata,
    HighscoreEssentials,
    TopasAccountEssentials,
    TopasAppEssentials,
} from '../../types';

export interface LeaderboardModuleChainData {
	highscores: Highscore[];
}

export type LeaderboardModuleAccountProps = AccountDefaultProps & {
	leaderboard: {
		highscores: HighscoreEssentials[];
	};
};

export interface Highscore {
	user: TopasAccountEssentials;
	app: TopasAppEssentials;
	score: number;
	createdAt: DateTimeMetadata;
}

export type PostScoreAssetProps = {
	score: number;
	appId: string;
};
