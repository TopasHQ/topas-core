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
			entranceFee: BigInt('2500000000'),
			numOfUses: 0,
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
			id: '4de9517632ddef665af29c914128fdce26987b85acf80b0ea74ddd32519672bf',
			creator: {
				username: 'John',
				address: cryptography.hexToBuffer('c9e602d023ad383f2ba0090cadad0983817f4fb7'),
			},
			mode: TopasAppMode.feeToCreatorSingular,
			type: TopasAppType.game,
			title: 'Example Game',
			description: 'Description for first app, making it a bit longer to exceed 32 chars.',
			isPublished: true,
			tipsEnabled: false,
			entranceFee: BigInt('10000000000'),
			numOfUses: 0,
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
			description: 'Have you ever wanted to fly on the moon with a jetpack? Now you can!',
			isPublished: true,
			tipsEnabled: true,
			entranceFee: BigInt('5000000000'),
			numOfUses: 0,
		},
	},
];
