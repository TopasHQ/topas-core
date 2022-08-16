import { Schema } from 'lisk-sdk';

import { accountEssentialsSchema, metaSchema } from '../../schemas';

export const cardSchema: Schema = {
	$id: '/nft/card',
	type: 'object',
	required: ['meta', 'data'],
	properties: {
		meta: {
			fieldNumber: 1,
			...metaSchema,
		},
		data: {
			fieldNumber: 2,
			type: 'object',
			required: ['id', 'type', 'owned', 'owner'],
			properties: {
				id: {
					dataType: 'string',
					fieldNumber: 1,
				},
				type: {
					dataType: 'uint32',
					fieldNumber: 2,
				},
				owned: {
					dataType: 'boolean',
					fieldNumber: 3,
				},
				owner: {
					...accountEssentialsSchema,
					fieldNumber: 4,
				},
			},
		},
	},
};

export const nftModuleSchema: Schema = {
	$id: '/nft/moduleSchema',
	type: 'object',
	required: ['cards'],
	properties: {
		cards: {
			fieldNumber: 1,
			type: 'array',
			items: cardSchema,
		},
	},
};

export const nftAccountSchema = {
	$id: '/nft/accountSchema',
	type: 'object',
	required: ['cards'],
	properties: {
		cards: {
			fieldNumber: 1,
			type: 'array',
			items: {
				dataType: 'string',
			},
		},
	},
	default: {
		cards: [],
	},
};
