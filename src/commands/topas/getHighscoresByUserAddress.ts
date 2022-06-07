import { BaseIPCClientCommand } from 'lisk-commander';

export class GetAllCommand extends BaseIPCClientCommand {
	public async run(): Promise<any> {
		const result = await this._client?.invoke('topasApi:getHighscoresByUserAddress', {
			address: '686aedfb805bb407a3abbf7e95b9d5a4b88b8ffb',
		});

		return this.log(JSON.stringify(result));
	}
}
