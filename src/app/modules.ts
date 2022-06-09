import { Application } from 'lisk-sdk';

import { LeaderboardModule } from './modules/leaderboard/leaderboard_module';
import { MonstersModule } from './modules/monsters/monsters_module';
import { TopasAppModule } from './modules/topas_app/topas_app_module';
import { TopasUserModule } from './modules/topas_user/topas_user_module';

export const registerModules = (app: Application): void => {
	app.registerModule(TopasAppModule);
	app.registerModule(TopasUserModule);
	app.registerModule(LeaderboardModule);
	app.registerModule(MonstersModule);
};
