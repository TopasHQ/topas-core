import { dateTimeSchema } from '../../schemas';

export const topasUserAccountSchema = {
	$id: '/topasUser/accountSchema',
	type: 'object',
	required: ['username', 'avatar', 'memberType', 'memberSince'],
	properties: {
		username: {
			dataType: 'string',
			fieldNumber: 1,
		},
		avatar: {
			dataType: 'string',
			fieldNumber: 2,
		},
		memberType: {
			dataType: 'uint32',
			fieldNumber: 3,
		},
		memberSince: {
			fieldNumber: 4,
			...dateTimeSchema,
		},
	},
	default: {
		username: '',
		avatar: '',
		memberType: 0,
		memberSince: {
			human: '',
			unix: 0,
		},
	},
};
