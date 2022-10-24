import { Transaction, transactions } from 'lisk-sdk';
import { DateTime } from 'luxon';
import * as seedrandom from 'seedrandom';

import config from '../config';
import { Highscore, LeaderboardModuleAccountProps } from '../modules/leaderboard/types';
import { TopasApp, TopasAppMode, TopasAppModuleAccountProps } from '../modules/topas_app/types';
import { TopasUser } from '../modules/topas_user/types';
import { HighscoreEssentials, Meta, TopasAccountEssentials, TopasAppEssentials } from '../types';

export const createDateTime = () => {
	const date = DateTime.now().toUTC();

	return {
		unix: date.toUnixInteger(),
		human: date.toString(),
	};
};

export const createMeta = (): Meta => ({
	createdAt: createDateTime(),
	lastModified: createDateTime(),
});

export const updateMeta = (metaObject: Meta): Meta => ({
	...metaObject,
	lastModified: createDateTime(),
});

export const createUserEssentials = (
	account: TopasAppModuleAccountProps | LeaderboardModuleAccountProps,
	topasUser: TopasUser,
): TopasAccountEssentials => ({ username: topasUser.username, address: account.address });

export const createTopasAppEssentials = (app: TopasApp): TopasAppEssentials => ({
	appId: app.data.id,
	title: app.data.title,
});

export const createHighscoreEssentials = (highscore: Highscore): HighscoreEssentials => ({
	appId: highscore.app.appId,
	score: highscore.score,
});

export const beddowsToLsk = (input: BigInt) => transactions.convertBeddowsToLSK(input.toString());

export const buffersAreEqual = (bufferA: Buffer, bufferB: Buffer) => Buffer.compare(bufferA, bufferB) === 0;

export const senderIsAppCreator = (app: TopasApp, transaction: Transaction) =>
	buffersAreEqual(app.data.creator.address, transaction.senderAddress);

export const getDiffInMinutes = (dateA: DateTime, dateB = DateTime.now().toUTC()) =>
	dateB.diff(dateA, 'minutes').minutes;

export const senderOwnsValidPurchase = (app: TopasApp, account: TopasAppModuleAccountProps) => {
	if (app.data.mode === TopasAppMode.feeToCreatorLifetime) {
		return account.topasApp.appsPurchases.map(a => a.appId).includes(app.data.id);
	}

	return account.topasApp.appsPurchases
		.filter(
			p =>
				p.appId === app.data.id &&
				getDiffInMinutes(DateTime.fromSeconds(p.createdAt.unix)) < config.appPurchaseDuration,
		)
		.map(p => p.appId)
		.includes(app.data.id);
};

export const bufferToHex = (input: Buffer) => input.toString('hex');

// Inspired by: https://stackoverflow.com/a/29202760
export const chunkSubstr = (str: string, size = 8) => {
	const numChunks = Math.ceil(str.length / size);
	const chunks = new Array(numChunks);

	for (let i = 0, o = 0; i < numChunks; i += 1, o += size) {
		chunks[i] = str.substr(o, size);
	}

	return chunks as string[];
};

export const getPseudoRandomFloat = (seed: string): number => {
	const rng = seedrandom(seed);
	return rng();
};

export const getPseudoRandomNumberInRange = (min: number, max: number, seed: string): number => {
	const rng = getPseudoRandomFloat(seed);
	return Math.floor(rng * (max - min + 1)) + min;
};

export const getPseudoRandomBigIntInRange = (minBigInt: bigint, maxBigInt: bigint, seed: string): bigint => {
	const multiplier = BigInt('100000000');

	const min = Number(minBigInt / multiplier);
	const max = Number(maxBigInt / multiplier);

	const rng = getPseudoRandomFloat(seed);
	const randomNumber = Math.floor(rng * (max - min + 1)) + min;

	return BigInt(randomNumber) * multiplier;
};

export const getRandomArrayElement = <T>(array: T[]): T => array[Math.floor(Math.random() * array.length)];

export const popFromArray = <T>(array: T[]) => {
	const element = array.pop();

	if (!element) {
		throw new Error('Array is empty');
	}

	return element;
};
