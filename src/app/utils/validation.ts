import { ReducerHandler, Transaction } from 'lisk-sdk';
import { validate as uuidValidate, version as uuidVersion } from 'uuid';

import config from '../config';
import { TICKER } from '../constants';
import { TopasApp } from '../types';
import { beddowsToLsk } from './helpers';
import { getTopasUserData } from './reducer_handlers';

export const validateUuid = (uuid: string) => {
	if (!uuidValidate(uuid) || uuidVersion(uuid) !== 4) {
		throw new Error(`Invalid id, must be uuid v4.`);
	}
};

export const validateFee = (transaction: Transaction, requiredFee?: bigint) => {
	if (!requiredFee) {
		return;
	}

	if (transaction.fee < requiredFee) {
		throw new Error(`Fee must be ${beddowsToLsk(requiredFee)} ${TICKER} or higher.`);
	}
};

export const validateEntranceFee = (entranceFee: bigint) => {
	const { appEntranceFeeMin, appEntranceFeeMax } = config;

	if (entranceFee < appEntranceFeeMin || entranceFee > appEntranceFeeMax) {
		throw new Error(
			`Invalid fee, must be between ${beddowsToLsk(appEntranceFeeMin)} and ${beddowsToLsk(appEntranceFeeMax)}.`,
		);
	}
};

export const validateTipAmount = (tipAmount: bigint) => {
	const { tipAmountMin, tipAmountMax } = config;

	if (tipAmount < tipAmountMin || tipAmount > tipAmountMax) {
		throw new Error(
			`Invalid tip amount, must be between ${beddowsToLsk(tipAmountMin)} ${TICKER} and ${beddowsToLsk(
				tipAmountMax,
			)} ${TICKER}.`,
		);
	}
};

export const validateIsPublished = (app: TopasApp) => {
	if (!app.data.isPublished) {
		throw new Error(`App is not published.`);
	}
};

// Validate for uuid temporarily (use different ID mechanism later)
export const validateAvatar = (avatar: string) => {
	if (!uuidValidate(avatar) || uuidVersion(avatar) !== 4) {
		throw new Error(`Invalid avatar, must be uuid v4.`);
	}
};

// Attempts to fetch TopasUser data. Throws error when empty.
export const validateRegistration = async (reducerHandler: ReducerHandler, address: Buffer) => {
	await getTopasUserData(reducerHandler, { address, errorOnEmpty: true });
};
