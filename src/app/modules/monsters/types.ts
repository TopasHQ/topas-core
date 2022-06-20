export interface MonstersModuleChainData {
	activeMonsters: Monster[];
}

export type Monster = {
	id: string;
	model: number;
	location: number;
	reward: bigint;
};

export type DestroyMonsterAssetProps = {
	id: string;
};
