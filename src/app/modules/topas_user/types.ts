import { AccountDefaultProps, DateTimeMetadata } from '../../types';

export enum MemberType {
	Unregistered = 0,
	Registered = 1,
	Basic = 1,
	Elite = 2,
}

export interface TopasUser {
	username: string;
	avatar: string;
	memberType: MemberType;
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
