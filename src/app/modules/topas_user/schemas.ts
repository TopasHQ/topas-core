import config from '../../config';
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

export const registerAssetPropsSchema = {
	$id: 'topasUser/register-asset',
	title: 'RegisterAsset transaction asset for topasUser module',
	type: 'object',
	required: ['username', 'avatar'],
	properties: {
		username: {
			dataType: 'string',
			fieldNumber: 1,
			minLength: config.usernameMinLength,
			maxLength: config.usernameMaxLength,
		},
		avatar: {
			dataType: 'string',
			fieldNumber: 2,
		},
	},
};

export const updateAvatarAssetPropsSchema = {
	$id: 'topasUser/updateAvatar-asset',
	title: 'UpdateAvatarAsset transaction asset for topasUser module',
	type: 'object',
	required: ['avatar'],
	properties: {
		avatar: {
			dataType: 'string',
			fieldNumber: 1,
		},
	},
};
