import { AfterGenesisBlockApplyContext, BaseModule, codec } from 'lisk-sdk';

import { ModuleId, ModuleName } from '../../types';
import { serializeData } from '../../utils/formats';
import { getDataAccessData } from '../../utils/store';
import { NFT_MODULE_INIT, NFT_MODULE_KEY } from './constants';
import { nftAccountSchema, nftModuleSchema } from './schemas';
import { NftModuleChainData } from './types';

/* eslint-disable class-methods-use-this */
export class NftModule extends BaseModule {
	public name = ModuleName.Nft;
	public id = ModuleId.Nft;
	public accountSchema = nftAccountSchema;

	public transactionAssets = [];

	public events = [];

	public actions = {
		getCards: async (): Promise<unknown> => {
			const data = await getDataAccessData<NftModuleChainData>(this._dataAccess, ModuleId.Nft);
			return serializeData(data.cards);
		},
	};

	public reducers = {};

	public async afterGenesisBlockApply(_input: AfterGenesisBlockApplyContext) {
		await _input.stateStore.chain.set(NFT_MODULE_KEY, codec.encode(nftModuleSchema, NFT_MODULE_INIT));
	}
}
