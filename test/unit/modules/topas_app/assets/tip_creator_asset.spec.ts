import { TipCreatorAsset } from '../../../../../src/app/modules/topasApp/assets/tip_creator_asset';

describe('TipCreatorAsset', () => {
  let transactionAsset: TipCreatorAsset;

	beforeEach(() => {
		transactionAsset = new TipCreatorAsset();
	});

	describe('constructor', () => {
		it('should have valid id', () => {
			expect(transactionAsset.id).toEqual(5);
		});

		it('should have valid name', () => {
			expect(transactionAsset.name).toEqual('tipCreator');
		});

		it('should have valid schema', () => {
			expect(transactionAsset.schema).toMatchSnapshot();
		});
	});

	describe('validate', () => {
		describe('schema validation', () => {
      it.todo('should throw errors for invalid schema');
      it.todo('should be ok for valid schema');
    });
	});

	describe('apply', () => {
    describe('valid cases', () => {
      it.todo('should update the state store');
    });

    describe('invalid cases', () => {
      it.todo('should throw error');
    });
	});
});
