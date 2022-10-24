import { ReducerHandler } from 'lisk-sdk';

import { Highscore } from '../modules/leaderboard/types';
import { TopasApp } from '../modules/topas_app/types';
import { TopasUser } from '../modules/topas_user/types';
import { TopasAppPurchase } from '../types';

// TYPED REDUCER HANDLER ABSTRACTIONS

export const getTopasUserData = async (
	reducerHandler: ReducerHandler,
	{ address, errorOnEmpty }: { address: Buffer; errorOnEmpty?: boolean },
) => reducerHandler.invoke<TopasUser>('topasUser:getTopasUserData', { address, errorOnEmpty });

export const getTopasAppById = async (reducerHandler: ReducerHandler, { id }: { id: string }) =>
	reducerHandler.invoke<TopasApp>('topasApp:getAppById', { id });

export const getAccountPurchases = async (reducerHandler: ReducerHandler, { address }: { address: Buffer }) =>
	reducerHandler.invoke<TopasAppPurchase[]>('topasApp:getAccountPurchases', { address });

export const getHighscores = async (reducerHandler: ReducerHandler) =>
	reducerHandler.invoke<Highscore[]>('leaderboard:getHighscores');
