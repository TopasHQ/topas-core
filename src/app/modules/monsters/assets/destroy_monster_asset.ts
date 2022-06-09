import { ApplyAssetContext, BaseAsset, ValidateAssetContext } from 'lisk-sdk';

export class DestroyMonsterAsset extends BaseAsset {
	public name = 'destroyMonster';
	public id = 1;

	// Define schema for asset
	public schema = {
		$id: 'monsters/destroyMonster-asset',
		title: 'DestroyMonsterAsset transaction asset for monsters module',
		type: 'object',
		required: [],
		properties: {},
	};

	public validate({ asset }: ValidateAssetContext<{}>): void {
		// Validate your asset
	}

	// eslint-disable-next-line @typescript-eslint/require-await
	public async apply({ asset, transaction, stateStore }: ApplyAssetContext<{}>): Promise<void> {
		throw new Error('Asset "destroyMonster" apply hook is not implemented.');
	}
}
