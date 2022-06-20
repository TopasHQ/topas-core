import { Schema } from 'lisk-sdk';

import { accountEssentialsSchema, metaSchema, topasAppEssentialsSchema } from '../../schemas';

export const topasAppSchema: Schema = {
	$id: '/topasApp/app',
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
			required: [
				'id',
				'creator',
				'type',
				'title',
				'description',
				'isPublished',
				'tipsEnabled',
				'entranceFee',
				'numOfUses',
			],
			properties: {
				id: {
					dataType: 'string',
					fieldNumber: 1,
				},
				creator: {
					fieldNumber: 2,
					...accountEssentialsSchema,
				},
				type: {
					dataType: 'uint32',
					fieldNumber: 3,
				},
				title: {
					dataType: 'string',
					fieldNumber: 4,
				},
				description: {
					dataType: 'string',
					fieldNumber: 5,
				},
				isPublished: {
					dataType: 'boolean',
					fieldNumber: 6,
				},
				tipsEnabled: {
					dataType: 'boolean',
					fieldNumber: 7,
				},
				entranceFee: {
					dataType: 'uint64',
					fieldNumber: 8,
				},
				numOfUses: {
					dataType: 'uint32',
					fieldNumber: 9,
				},
			},
		},
	},
};

export const topasAppModuleSchema: Schema = {
	$id: '/topasApp/moduleSchema',
	type: 'object',
	required: ['apps'],
	properties: {
		apps: {
			fieldNumber: 1,
			type: 'array',
			items: topasAppSchema,
		},
	},
};

export const topasAppAccountSchema = {
	$id: '/topasApp/accountSchema',
	type: 'object',
	required: ['appsCreated', 'appsPurchased'],
	properties: {
		appsCreated: {
			fieldNumber: 1,
			type: 'array',
			items: topasAppEssentialsSchema,
		},
		appsPurchased: {
			fieldNumber: 2,
			type: 'array',
			items: topasAppEssentialsSchema,
		},
	},
	default: {
		appsCreated: [],
		appsPurchased: [],
	},
};
