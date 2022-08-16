import { AccountDefaultProps, Meta, TopasAccountEssentials } from '../../types';

export interface NftModuleChainData {
	cards: AccessCard[];
}

export type TopasAppModuleAccountProps = AccountDefaultProps & {
	nft: {
		cards: AccessCard[];
	};
};

export enum AccessCardType {
	Basic = 0,
	Elite = 1,
}

export type AccessCard = {
	meta: Meta;
	data: {
		id: string;
		type: AccessCardType;
		owned: boolean;
		owner: TopasAccountEssentials;
	};
};
