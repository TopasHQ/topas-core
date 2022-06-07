/* eslint-disable @typescript-eslint/no-empty-function */
import { Application } from 'lisk-sdk';

import { TopasApiPlugin } from './plugins/topas_api/topas_api_plugin';

export const registerPlugins = (app: Application): void => {
	app.registerPlugin(TopasApiPlugin);
};
