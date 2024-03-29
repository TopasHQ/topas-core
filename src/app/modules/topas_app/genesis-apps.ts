import { cryptography } from 'lisk-sdk';

import { TopasApp, TopasAppMode, TopasAppType } from './types';

export const genesisApps: TopasApp[] = [
	{
		meta: {
			createdAt: {
				unix: 1649929011,
				human: '2022-06-20T12:43:27Z',
			},
			lastModified: {
				unix: 1649929011,
				human: '2022-06-20T12:43:27Z',
			},
		},
		data: {
			id: '5ba7040e8acb282f5a36989169d08a16acf0b30fc187d8fdeefdf0688a3e0b93',
			creator: {
				username: 'Maxima',
				address: cryptography.hexToBuffer('686aedfb805bb407a3abbf7e95b9d5a4b88b8ffb'),
			},
			type: TopasAppType.game,
			mode: TopasAppMode.feeToChest,
			title: 'Octa Blaster',
			description: 'Blast gems in a shiny shooting range >_>',
			isPublished: true,
			tipsEnabled: true,
			entranceFee: BigInt('1000000000'),
			chest: BigInt('0'),
			purchases: 0,
		},
	},
	{
		meta: {
			createdAt: {
				unix: 1649929011,
				human: '2022-06-20T12:43:27Z',
			},
			lastModified: {
				unix: 1649929011,
				human: '2022-06-20T12:43:27Z',
			},
		},
		data: {
			id: '006a166b92a0fe77d65622baa08a0514ccbb37aba8e1c4c378d55ba80461a1c1',
			creator: {
				username: 'Olivia',
				address: cryptography.hexToBuffer('48f798ee1977b70c09c729238d482f195da3882a'),
			},
			mode: TopasAppMode.feeToCreatorLifetime,
			type: TopasAppType.experience,
			title: 'Moon Jump',
			description: 'Have you ever wanted to fly on the moon with a jet pack? Now you can!',
			isPublished: true,
			tipsEnabled: true,
			entranceFee: BigInt('500000000'),
			chest: BigInt('0'),
			purchases: 0,
		},
	},
	{
		meta: {
			createdAt: {
				unix: 1649929011,
				human: '2022-06-20T12:43:27Z',
			},
			lastModified: {
				unix: 1649929011,
				human: '2022-06-20T12:43:27Z',
			},
		},
		data: {
			id: 'a14ceecfd6661bce927c231670c2ab34487872e46a90e7c891016594dfca2105',
			creator: {
				username: 'John',
				address: cryptography.hexToBuffer('c9e602d023ad383f2ba0090cadad0983817f4fb7'),
			},
			mode: TopasAppMode.feeToCreatorLifetime,
			type: TopasAppType.experience,
			title: 'Back Rooms',
			description: 'Find out what happens in the backrooms, based on a popular urban legend.',
			isPublished: true,
			tipsEnabled: true,
			entranceFee: BigInt('5000000000'),
			chest: BigInt('0'),
			purchases: 0,
		},
	},
	{
		meta: {
			createdAt: {
				unix: 1649929011,
				human: '2022-06-20T12:43:27Z',
			},
			lastModified: {
				unix: 1649929011,
				human: '2022-06-20T12:43:27Z',
			},
		},
		data: {
			id: 'c04a86b038008445bbcb9c3471797f673e29d77a12e1da58b947b2fa4fc5d60a',
			creator: {
				username: 'Alice',
				address: cryptography.hexToBuffer('ea9c5c0dd9e67757a06d4830b23e84c8d60bd64e'),
			},
			mode: TopasAppMode.feeToChest,
			type: TopasAppType.game,
			title: 'Topas Run',
			description: 'Catch as many Topas tokens as you can while avoiding the bombs.',
			isPublished: true,
			tipsEnabled: true,
			entranceFee: BigInt('1000000000'),
			chest: BigInt('0'),
			purchases: 0,
		},
	},
];
