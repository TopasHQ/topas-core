import { BaseChannel, cryptography } from 'lisk-sdk';

import { Highscore } from '../../modules/leaderboard/types';
import { Monster } from '../../modules/monsters/types';
import { TopasApp } from '../../modules/topas_app/types';
import { ModuleName } from '../../types';
import { isArrayOfStrings } from '../../utils/formats';
import { buffersAreEqual } from '../../utils/helpers';

const moduleActions = {
	getApps: `${ModuleName.TopasApp}:getApps`,
	getHighscores: `${ModuleName.Leaderboard}:getHighscores`,
	getActiveMonsters: `${ModuleName.Monsters}:getActiveMonsters`,
};

export const getApps = async (channel: BaseChannel) => {
	const apps = await channel.invoke<TopasApp[]>(moduleActions.getApps);

	return apps;
};

export const getAppById = async (channel: BaseChannel, params?: Record<string, unknown>) => {
	if (typeof params?.id !== 'string') {
		throw new Error('Id param must be a string.');
	}

	const apps = await channel.invoke<TopasApp[]>(moduleActions.getApps);

	const app = apps.find(a => a.data.id === params.id);

	if (!app) {
		throw new Error('App does not exist.');
	}

	return apps;
};

export const getAppsByIds = async (channel: BaseChannel, params?: Record<string, unknown>) => {
	const ids = isArrayOfStrings(params?.ids, 'Ids param must be an array of string.');

	const apps = await channel.invoke<TopasApp[]>(moduleActions.getApps);

	return apps.filter(app => ids.includes(app.data.id));
};

export const getAppsUsage = async (channel: BaseChannel) => {
	const apps = await channel.invoke<TopasApp[]>(moduleActions.getApps);

	const result: { [key: string]: number } = {};

	apps.forEach(app => {
		result[app.data.id] = app.data.numOfUses;
	});

	return result;
};

export const getAppUsageById = async (channel: BaseChannel, params?: Record<string, unknown>) => {
	if (typeof params?.id !== 'string') {
		throw new Error('Id param must be a string.');
	}

	const apps = await channel.invoke<TopasApp[]>(moduleActions.getApps);

	const app = apps.find(a => a.data.id === params.id);

	if (!app) {
		throw new Error('App does not exist.');
	}

	return app.data.numOfUses;
};

export const getHighscores = async (channel: BaseChannel) => {
	const result: { [key: string]: Highscore[] } = {};

	const highscores = await channel.invoke<Highscore[]>(moduleActions.getHighscores);

	highscores.forEach(score => {
		if (result[score.app.appId]) {
			result[score.app.appId] = [...result[score.app.appId], score];
		} else {
			result[score.app.appId] = [score];
		}
	});

	return result;
};

export const getHighscoresByAppId = async (channel: BaseChannel, params?: Record<string, unknown>) => {
	if (typeof params?.id !== 'string') {
		throw new Error('Id param must be a string.');
	}

	const highscores = await channel.invoke<Highscore[]>(moduleActions.getHighscores);

	return highscores.filter(score => score.app.appId === params.id).map(score => ({ ...score, app: undefined }));
};

// TODO: support buffer address param
export const getHighscoresByUserAddress = async (channel: BaseChannel, params?: Record<string, unknown>) => {
	if (typeof params?.address !== 'string') {
		throw new Error('Address param must be a string.');
	}

	let addressBuffer: Buffer;

	if (typeof params.address === 'string') {
		addressBuffer = cryptography.hexToBuffer(params.address);
	}

	const highscores = await channel.invoke<Highscore[]>(moduleActions.getHighscores);

	return highscores
		.filter(score => buffersAreEqual(score.user.address, addressBuffer))
		.map(score => ({ ...score, user: undefined }));
};

export const getActiveMonsters = async (channel: BaseChannel) => {
	const apps = await channel.invoke<Monster[]>(moduleActions.getActiveMonsters);

	return apps;
};
