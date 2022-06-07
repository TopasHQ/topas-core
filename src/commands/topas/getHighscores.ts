import { BaseIPCClientCommand } from 'lisk-commander';

export class GetAllCommand extends BaseIPCClientCommand {
	// static args = [];

	// static examples = [];

	public async run(): Promise<any> {
		const result = await this._client?.invoke('topasApi:getHighscores');

		return this.log(JSON.stringify(result));
	}
}
