import { Schema } from 'lisk-sdk';

import config from '../../config';
import { accountEssentialsSchema, metaSchema, topasAppEssentialsSchema, topasAppPurchaseSchema } from '../../schemas';

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
				'mode',
				'title',
				'description',
				'isPublished',
				'tipsEnabled',
				'entranceFee',
				'chest',
				'purchases',
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
				mode: {
					dataType: 'uint32',
					fieldNumber: 4,
				},
				title: {
					dataType: 'string',
					fieldNumber: 5,
				},
				description: {
					dataType: 'string',
					fieldNumber: 6,
				},
				isPublished: {
					dataType: 'boolean',
					fieldNumber: 7,
				},
				tipsEnabled: {
					dataType: 'boolean',
					fieldNumber: 8,
				},
				entranceFee: {
					dataType: 'uint64',
					fieldNumber: 9,
				},
				chest: {
					dataType: 'uint64',
					fieldNumber: 10,
				},
				purchases: {
					dataType: 'uint32',
					fieldNumber: 11,
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
	required: ['appsCreated', 'appsPurchases'],
	properties: {
		appsCreated: {
			fieldNumber: 1,
			type: 'array',
			items: topasAppEssentialsSchema,
		},
		appsPurchases: {
			fieldNumber: 2,
			type: 'array',
			items: topasAppPurchaseSchema,
		},
	},
	default: {
		appsCreated: [],
		appsPurchases: [],
	},
};

export const createAppAssetPropsSchemas = {
	$id: 'topasApp/createApp-asset',
	title: 'CreateAppAsset transaction asset for topasApp module',
	type: 'object',
	required: ['type', 'mode', 'title', 'description', 'tipsEnabled', 'entranceFee'],
	properties: {
		type: {
			dataType: 'uint32',
			fieldNumber: 1,
		},
		mode: {
			dataType: 'uint32',
			fieldNumber: 2,
		},
		title: {
			dataType: 'string',
			fieldNumber: 3,
			minLength: config.appTitleMinLength,
			maxLength: config.appTitleMaxLength,
		},
		description: {
			dataType: 'string',
			fieldNumber: 4,
			minLength: config.appDescriptionMinLength,
			maxLength: config.appDescriptionMaxLength,
		},
		tipsEnabled: {
			fieldNumber: 5,
			dataType: 'boolean',
		},
		entranceFee: {
			fieldNumber: 6,
			dataType: 'uint64',
		},
	},
};

export const purchaseAppEntranceAssetPropsSchema = {
	$id: 'topasApp/purchaseAppEntrance-asset',
	title: 'PurchaseAppEntrance transaction asset for topasApp module',
	type: 'object',
	required: ['appId'],
	properties: {
		appId: {
			dataType: 'string',
			fieldNumber: 1,
		},
	},
};

export const setAppStateAssetPropsSchema = {
	$id: 'topasApp/setAppState-asset',
	title: 'SetAppStateAsset transaction asset for topasApp module',
	type: 'object',
	required: ['appId', 'isPublished'],
	properties: {
		appId: {
			dataType: 'string',
			fieldNumber: 1,
		},
		isPublished: {
			fieldNumber: 2,
			dataType: 'boolean',
		},
	},
};

export const tipCreatorAssetPropsSchema = {
	$id: 'topasApp/tipCreator-asset',
	title: 'TipCreatorAsset transaction asset for topasApp module',
	type: 'object',
	required: ['appId', 'tipAmount'],
	properties: {
		appId: {
			dataType: 'string',
			fieldNumber: 1,
		},
		tipAmount: {
			dataType: 'uint64',
			fieldNumber: 2,
		},
	},
};

export const updateAppAssetPropsSchema = {
	$id: 'topasApp/updateApp-asset',
	title: 'UpdateAppAsset transaction asset for topasApp module',
	type: 'object',
	required: ['id', 'description', 'tipsEnabled', 'entranceFee'],
	properties: {
		id: {
			dataType: 'string',
			fieldNumber: 1,
		},
		description: {
			dataType: 'string',
			fieldNumber: 2,
			minLength: config.appDescriptionMinLength,
			maxLength: config.appDescriptionMaxLength,
		},
		tipsEnabled: {
			fieldNumber: 3,
			dataType: 'boolean',
		},
		entranceFee: {
			fieldNumber: 4,
			dataType: 'uint64',
		},
	},
};
