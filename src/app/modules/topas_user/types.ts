import { AccountDefaultProps, DateTimeMetadata } from '../../types';

export interface TopasUser {
	username: string;
	avatar: string;

	memberSince: DateTimeMetadata;
}

export type TopasUserModuleAccountProps = AccountDefaultProps & {
	topasUser: TopasUser;
};

export type RegisterAssetProps = {
	username: string;
	avatar: string;
};

export type UpdateAvatarAssetProps = {
	avatar: string;
};
