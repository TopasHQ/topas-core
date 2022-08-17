import { cryptography } from 'lisk-sdk';
import { createMeta } from '../../utils/helpers';
import * as ids from './access-cards-uuids.json';
import { AccessCard } from './types';

const genesisCards: AccessCard[] = ids.map((id, i) => {
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

/** TEMPORARY HARDCODING OF CARD OWNERSHIP */
genesisCards[0].data.owner = {
	username: 'Maxima',
	address: cryptography.hexToBuffer('686aedfb805bb407a3abbf7e95b9d5a4b88b8ffb'),
};
genesisCards[0].data.owned = true;

genesisCards[100].data.owner = {
	username: 'Olivia',
	address: cryptography.hexToBuffer('48f798ee1977b70c09c729238d482f195da3882a'),
};
genesisCards[100].data.owned = true;

export { genesisCards };
