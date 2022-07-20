// USE THE ROOT .ENV FILE TO USE CUSTOMIZE THE CONFIGURATION

export default {
	appEntranceFeeMin: BigInt(process.env.APP_ENTRANCE_FEE_MIN ?? '100000000'),
	appEntranceFeeMax: BigInt(process.env.APP_ENTRANCE_FEE_MAX ?? '1000000000000'),
	tipAmountMin: BigInt(process.env.TIP_AMOUNT_MIN ?? '10000000'),
	tipAmountMax: BigInt(process.env.TIP_AMOUNT_MAX ?? '1000000000000'),
	appTitleMinLength: Number(process.env.APP_TITLE_MIN_LENGTH ?? '3'),
	appTitleMaxLength: Number(process.env.APP_TITLE_MAX_LENGTH ?? '32'),
	appDescriptionMinLength: Number(process.env.APP_DESCRIPTION_MIN_LENGTH ?? '32'),
	appDescriptionMaxLength: Number(process.env.APP_DESCRIPTION_MAX_LENGTH ?? '800'),
	appPurchaseDuration: Number(process.env.APP_PURCHASE_DURATION ?? '5'),
	usernameMinLength: Number(process.env.USERNAME_MIN_LENGTH ?? '3'),
	usernameMaxLength: Number(process.env.USERNAME_MAX_LENGTH ?? '16'),
	adminAccounts: ['6bac0c7b36607b2cceed4071f435b1c1bec031a4', 'a3c40a2cdb1802ba7ab80fa43f15887536a6ccda'],
	monsterSpawnRate: Number(process.env.MONSTER_SPAWN_RATE) ?? 5,
	monsterLocations: Number(process.env.MONSTER_LOCATIONS) ?? 20,
	monsterModels: Number(process.env.MONSTER_MODELS) ?? 5,
	monsterMinReward: BigInt(process.env.MONSTER_MIN_REWARD ?? '100000000'),
	monsterMaxReward: BigInt(process.env.MONSTER_MAX_REWARD ?? '1000000000'),
};
