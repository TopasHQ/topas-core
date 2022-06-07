import { BaseIPCClientCommand } from 'lisk-commander';

export class GetAllCommand extends BaseIPCClientCommand {
	// static args = [];

	// static examples = [];

	public async run(): Promise<any> {
		// const result = await this._client?.invoke('topasApi:getAppsByIds', {
		// 	ids: 'hi',
		// });
		const result = await this._client?.invoke('topasApi:getAppsByIds', {
			ids: ['951db0d3-583d-420c-b8b4-abb4f540aca78', '951db0d3-583d-420c-b8b4-abb4f540aca9'],
		});

		return this.log(JSON.stringify(result));
	}
}
