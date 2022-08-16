import { BasePlugin, PluginInfo } from 'lisk-sdk';
import type { BaseChannel, EventsDefinition, ActionsDefinition, SchemaWithDefault } from 'lisk-sdk';

import * as actionHandlers from './action_handlers';

/* eslint-disable  @typescript-eslint/no-empty-function */
export class TopasApiPlugin extends BasePlugin {
	private _channel!: BaseChannel;

	public static get alias(): string {
		return 'topasApi';
	}

	public static get info(): PluginInfo {
		return {
			author: 'TopasHQ &lt;info@topas.city&gt;',
			version: '0.1.0',
			name: 'topasApi',
		};
	}

	public get defaults(): SchemaWithDefault {
		return {
			$id: '/plugins/plugin-topasApi/config',
			type: 'object',
			properties: {},
			required: [],
			default: {},
		};
	}

	public get events(): EventsDefinition {
		return [
			// 'block:created',
			// 'block:missed'
		];
	}

	public get actions(): ActionsDefinition {
		return {
			getApps: async () => actionHandlers.getApps(this._channel),
			getAppById: async params => actionHandlers.getAppById(this._channel, params),
			getAppsByIds: async params => actionHandlers.getAppsByIds(this._channel, params),
			getAppsUsage: async () => actionHandlers.getAppsUsage(this._channel),
			getAppUsageById: async params => actionHandlers.getAppUsageById(this._channel, params),
			getHighscores: async () => actionHandlers.getHighscores(this._channel),
			getHighscoresByAppId: async params => actionHandlers.getHighscoresByAppId(this._channel, params),
			getHighscoresByUserAddress: async params => actionHandlers.getHighscoresByUserAddress(this._channel, params),
			getActiveMonsters: async () => actionHandlers.getActiveMonsters(this._channel),
			getCards: async () => actionHandlers.getCards(this._channel),
			getBasicCards: async () => actionHandlers.getBasicCards(this._channel),
			getEliteCards: async () => actionHandlers.getEliteCards(this._channel),
			getAvailableCards: async () => actionHandlers.getAvailableCards(this._channel),
			getUnavailableCards: async () => actionHandlers.getUnavailableCards(this._channel),
			getCardsByUserAddress: async () => actionHandlers.getCardsByUserAddress(this._channel),
		};
	}

	// eslint-disable-next-line @typescript-eslint/require-await
	public async load(channel: BaseChannel): Promise<void> {
		this._channel = channel;

		this._channel.once('app:ready', () => {
			this._logger.info('Topas API plugin up and running.');
		});
	}

	public async unload(): Promise<void> {}
}
