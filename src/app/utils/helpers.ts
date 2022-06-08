import { Transaction, transactions } from 'lisk-sdk';
import { DateTime } from 'luxon';

import {
    Highscore,
    HighscoreEssentials,
    LeaderboardModuleAccountProps,
    Meta,
    TopasAccountEssentials,
    TopasApp,
    TopasAppEssentials,
    TopasAppModuleAccountProps,
    TopasUser,
} from '../types';

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
	id: app.data.id,
	title: app.data.title,
});

export const createHighscoreEssentials = (highscore: Highscore): HighscoreEssentials => ({
	appId: highscore.app.id,
	score: highscore.score,
});

export const beddowsToLsk = (input: BigInt) => transactions.convertBeddowsToLSK(input.toString());

export const buffersAreEqual = (bufferA: Buffer, bufferB: Buffer) => Buffer.compare(bufferA, bufferB) === 0;

export const senderIsAppCreator = (app: TopasApp, transaction: Transaction) =>
	buffersAreEqual(app.data.creator.address, transaction.senderAddress);

export const senderOwnsApp = (app: TopasApp, account: TopasAppModuleAccountProps) =>
	account.topasApp.appsPurchased.map(a => a.id).includes(app.data.id);

export const bufferToHex = (input: Buffer) => input.toString('hex');
