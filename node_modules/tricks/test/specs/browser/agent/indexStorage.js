const DB = require('../../../../browser/agent/indexStorage.js');
const indexedDB = require('../../../../support/indexedDB.js');

describe('browser/agent/indexStorage', () => {

	it('should throw an error if the store does not exist', done => {

		// Define the database and schema
		const db = new DB();

		// Define the store
		db('mylist').all().then(() => done('should not return true'), () => done());

	});

	// Run these functions outside of PhantonJS
});

describe('browser/agent/indexStorage - supported', () => {

	before(function() {
		// Not running all tests because of Lack of support for indexedDB
		if (!indexedDB) this.skip();
	});

	it('should create a store', done => {

		// Define the database and schema
		const db = new DB('test', 1, {
			mylist: {
				autoIncrement: true
			}
		});

		// Define the store
		db('mylist').all().then(a => {
			expect(a).to.be.an('array');
			done();
		}).
			catch(done);

	});

	it('should let things be inserted into the store', done => {

		// Define the database and schema
		const db = new DB('test', 1, {
			mylist: {
				autoIncrement: true
			}
		});

		const list = db('mylist');

		list.put({a: 1}).then(key => {

			// Expect this to return the key
			expect(key).to.be.a('number');

			// Define the store
			return list.all().then(a => {
				expect(a.pop()).to.eql({a: 1});
				done();
			});
		})
			.catch(done);

	});


	it('should create a store with a keyPath, and be able to read the content with db.get', done => {

		// Define the database and schema
		const db = new DB('testKey', 1, {
			myDictionary: {
				keyPath: 'key'
			}
		});

		const dict = db('myDictionary');

		const key = 'apple';
		const description = 'A tasty fruit';

		dict.put({key, description}).then(resp => {

			// Expect this to return the key
			expect(resp).to.eql(key);

			// Define the store
			return dict.get(key).then(a => {
				expect(a.description).to.eql(description);
				done();
			});
		})
			.catch(done);

	});

	xit('should delete the database', done => {

		DB.delete('test')
			.then(() => done())
			.catch(done);

	});
});

/*
	// Get all the items in the store...
	store.then(resp => {
		console.log(resp);
	});

	// Alternatively get an item by its key
	store('my_uuid').then((item) => {
		console.log('GET mylist.my_uuid', item);
	});

	// Put an item to the store [key, data]
	store.put('my other uuid', {id: 123, name: 'Andrew'}).then((resp) => {
		console.log('successfully wrote to the store', resp);
	});

	// Or put an item where the key is contained in the object
	store.put({
		id: '321',
		name: 'Dodson'
	})
	.then(resp => {
		console.log(resp);
	});

	// Find an item in the store
	// This is a map reduce operation
	//store.find(filter).then(item => ...)
	//store.findAll(filter).then(items => ...)


	// let DB = self.indexedDB.open(CACHE_NAME, 4);
	// let db;

	// // these two event handlers act on the database being opened successfully, or not
	// DB.onerror = function(event) {
	//   // could not load DB
	//   console.error('indexedDB error', event.target.errorCode)
	// };

	// DB.onupgradeneeded = function(event) {

	//   // reference to the open db
	//   db = event.target.result;

	//   // Do something with the DB connection
	//   db.createObjectStore("falloverList", {autoIncrement: true});
	// };

	// DB.onsuccess = function(event) {
	//   // reference to the open db
	//   db = event.target.result;
	// }
/**/
