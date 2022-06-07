export const TOPAS_USER_ASSET_IDS = {
	register: 1,
	updateAvatar: 2,
};

type Fees = { [key in keyof typeof TOPAS_USER_ASSET_IDS]?: bigint };

export const TOPAS_USER_FEES: Fees = {
	register: BigInt('1000000000'),
	updateAvatar: BigInt('500000000'),
	// If asset is not listed, use min fee
};
