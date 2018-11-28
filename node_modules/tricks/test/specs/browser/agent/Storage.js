const Stores = {
	sessionStorage: require('../../../../browser/agent/sessionStorage.js'),
	localStorage: require('../../../../browser/agent/localStorage.js'),
	cookieStorage: require('../../../../browser/agent/cookieStorage.js')
};

describe('Storage', () => {

	Object.keys(Stores).forEach(label => {

		const store = Stores[label];

		describe(`browser/agent/${ label}`, () => {

			const data = {
				key: 'value',
				key1: 'value1'
			};
			const label = 'test';

			// Store data for retrieval
			beforeEach(() => {
				store(label, data);
			});

			afterEach(() => {
				store(label, null);
			});

			it('should return the data placed into the store', () => {

				expect(store(label)).to.eql(data);

			});

			it('should update data placed into the store', () => {

				const update = {
					updated: 'update'
				};

				store(label, update);

				expect(store(label)).to.eql(update);

			});

			it('should delete data placed into the store', () => {

				store(label, null);

				expect(store(label)).to.equal(null);

			});

			it('should return undefined if data not found', () => {

				expect(store('notfound')).to.equal(null);

			});

			it('should store strings', () => {

				store(label, 'hello');

				expect(store(label)).to.equal('hello');

			});

			it('should store numbers', () => {

				store(label, 1);
				expect(store(label)).to.equal(1);

				store(label, 0);
				expect(store(label)).to.equal(0);

			});

			it('should accept a hash to store multiple items simultaneously', () => {

				store({
					a: 1,
					b: 2
				});

				expect(store('a')).to.equal(1);
				expect(store('b')).to.equal(2);

			});


			describe('getItem', () => {
				it('should expose getItem', () => {
					const x = store.getItem(label);
					expect(x).to.eql(data);
				});
			});

			describe('setItem', () => {
				it('should expose setItem', () => {
					store.setItem(label, 1);
					const x = store.getItem(label);
					expect(x).to.eql(1);
				});
			});

			describe('removeItem', () => {
				it('should expose setItem', () => {
					store.removeItem(label);
					const x = store.getItem(label);
					expect(x).to.eql(null);
				});
			});
		});
	});
});
