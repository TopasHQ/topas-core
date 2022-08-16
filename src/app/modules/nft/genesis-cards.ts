import { createMeta } from '../../utils/helpers';
import * as ids from './access-cards-uuids.json';
import { AccessCard } from './types';

export const genesisCards: AccessCard[] = ids.map((id, i) => {
	const card: AccessCard = {
		meta: createMeta(),
		data: {
			id,
			type: i >= 100 ? 0 : 1,
			owned: false,
			owner: {
				username: '',
				address: Buffer.from(''),
			},
		},
	};

	return card;
});
