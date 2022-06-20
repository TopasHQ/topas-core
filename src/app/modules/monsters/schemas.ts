import { Schema } from 'lisk-sdk';

export const monsterSchema: Schema = {
	$id: '/monsters/monster',
	type: 'object',
	required: ['id', 'model', 'location', 'reward'],
	properties: {
		id: { fieldNumber: 1, dataType: 'string' },
		model: { fieldNumber: 2, dataType: 'uint32' },
		location: { fieldNumber: 3, dataType: 'uint32' },
		reward: { fieldNumber: 4, dataType: 'uint64' },
	},
};

export const monstersModuleSchema: Schema = {
	$id: '/monsters/moduleSchema',
	type: 'object',
	required: ['activeMonsters'],
	properties: {
		activeMonsters: {
			fieldNumber: 1,
			type: 'array',
			items: monsterSchema,
		},
	},
};

export const destroyMonsterAssetPropsSchemas = {
	$id: 'monsters/destroyMonster-asset',
	title: 'DestroyMonsterAsset transaction asset for monsters module',
	type: 'object',
	required: ['id'],
	properties: {
		id: {
			dataType: 'string',
			fieldNumber: 1,
		},
	},
};
