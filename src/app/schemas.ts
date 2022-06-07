// LISTED BELOW ARE SHARED SCHEMAS USED IN MULTIPLE MODULES
// SEE MODULE FOLDERS FOR MODULE-SPECIFIC SCHEMAS

export const dateTimeSchema = {
	type: 'object',
	required: ['unix', 'human'],
	properties: {
		unix: {
			fieldNumber: 1,
			dataType: 'uint32',
		},
		human: {
			fieldNumber: 2,
			dataType: 'string',
		},
	},
};

export const metaSchema = {
	type: 'object',
	required: ['createdAt', 'lastModified'],
	properties: {
		createdAt: {
			fieldNumber: 1,
			...dateTimeSchema,
		},
		lastModified: {
			fieldNumber: 2,
			...dateTimeSchema,
		},
	},
};

export const accountEssentialsSchema = {
	type: 'object',
	required: ['username', 'address'],
	properties: {
		username: {
			fieldNumber: 1,
			dataType: 'string',
		},
		address: {
			fieldNumber: 2,
			dataType: 'bytes',
		},
	},
};

export const topasAppEssentialsSchema = {
	type: 'object',
	required: ['id', 'title'],
	properties: {
		id: {
			fieldNumber: 1,
			dataType: 'string',
		},
		title: {
			fieldNumber: 2,
			dataType: 'string',
		},
	},
};

export const leaderboardEssentialsSchema = {
	type: 'object',
	required: ['appId', 'score'],
	properties: {
		appId: {
			fieldNumber: 1,
			dataType: 'string',
		},
		score: {
			fieldNumber: 2,
			dataType: 'uint32',
		},
	},
};
