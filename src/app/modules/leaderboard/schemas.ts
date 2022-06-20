import { Schema } from 'lisk-sdk';

import {
    accountEssentialsSchema,
    dateTimeSchema,
    leaderboardEssentialsSchema,
    topasAppEssentialsSchema,
} from '../../schemas';

export const highscoreSchema: Schema = {
	$id: '/leaderboard/highscore',
	type: 'object',
	required: ['user', 'app', 'score', 'createdAt'],
	properties: {
		user: {
			fieldNumber: 1,
			...accountEssentialsSchema,
		},
		app: {
			fieldNumber: 2,
			...topasAppEssentialsSchema,
		},
		score: {
			dataType: 'uint32',
			fieldNumber: 3,
		},
		createdAt: {
			fieldNumber: 4,
			...dateTimeSchema,
		},
	},
};

export const leaderboardModuleSchema: Schema = {
	$id: '/leaderboard/moduleSchema',
	type: 'object',
	required: ['highscores'],
	properties: {
		highscores: {
			fieldNumber: 1,
			type: 'array',
			items: highscoreSchema,
		},
	},
};

export const leaderboardAccountSchema = {
	$id: '/leaderboard/accountSchema',
	type: 'object',
	required: ['highscores'],
	properties: {
		highscores: {
			type: 'array',
			fieldNumber: 1,
			items: leaderboardEssentialsSchema,
		},
	},
	default: {
		highscores: [],
	},
};

export const postScoreAssetPropsSchema = {
	$id: 'leaderboard/postScore-asset',
	title: 'PostScoreAsset transaction asset for leaderboard module',
	type: 'object',
	required: ['appId', 'score'],
	properties: {
		appId: {
			dataType: 'string',
			fieldNumber: 1,
		},
		score: {
			dataType: 'uint32',
			fieldNumber: 2,
		},
	},
};
