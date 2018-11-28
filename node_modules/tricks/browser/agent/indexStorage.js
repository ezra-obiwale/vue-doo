// indexStorage
// This wraps an interface around IndexDB to create an object store
const indexedDB = require('../../support/indexedDB.js');

// Create an instance of the db
// The Cache name is optional, it will allow us to group various datasets (the default is __tricks__)

class DB {
	constructor(name, version, schema) {

		// Define the schema to use in the connection
		this.db_name = name || '__tricks__';
		if (typeof version === 'object') {
			this.version = 1;
			this.schema = version;
		}
		else {
			this.version = version || 1;
			this.schema = schema;
		}

		// Return a function
		return Object.assign(this.scope.bind(this), this);
	}

	static delete(db_name) {
		// Delete all the current open connections

		return requestToPromise(indexedDB.deleteDatabase(db_name));

		// return new Promise((accept, reject) => {
		// 	const db = conn[db_name].result;
		// 	db.onclose = () => {
		// 	};
		// 	db.onerror = (event) => {
		// 		console.log(event);
		// 	};
		// 	db.onblocked = (event) => {
		// 		console.log(event);
		// 	};
		// 	db.onabort = (event) => {
		// 		console.log(event);
		// 	};
		// 	db.onversionchange = (event) => {
		// 		console.log(event);
		// 	};
		// 	db.close();
		// });
	}

	scope(name) {
		// Create a new store instance
		const inst = Object.create(this);
		inst.table_name = name || '__tricks__';
		return inst;
	}

	open(mode = 'readonly') {
		return new Promise((accept, reject) => {

			const db = indexedDB.open(this.db_name, this.version);
			db.onsuccess = event => {
				accept(event.target.result);
			};
			db.onerror = reject;
			db.onupgradeneeded = event => {
				const db = event.target.result;

				// this should probably do something;
				for (const x in this.schema) {
					if (!db.objectStoreNames.contains(x)) {
						db.createObjectStore(x, this.schema[x]);
					}
				}
			};
		})
			.then(db => {

			// The DB connection has been established
			// Lets create a connection to it
				const transaction = db.transaction([this.table_name], mode);

				// Return the API for the Object Store
				return transaction.objectStore(this.table_name);
			});
	}

	get(key) {

		// We've got all the information to make a request to IndexDB
		return this.open().then(
			objectStore => requestToPromise(objectStore.get(key))
		);
	}

	all() {

		// We've got all the information to make a request to IndexDB
		return new Promise((accept, reject) => {
			this.open().then(objectStore => {
				// Find items in this table by Key
				const request = objectStore.openCursor();
				request.onerror = event => {
					reject(event.target.result);
				};

				const a = [];
				request.onsuccess = event => {
					const cursor = event.target.result;
					if (cursor) {
						a.push(cursor.value);
						cursor.continue();
					}
					else {
						accept(a);
					}
				};
			})
				.catch(reject);
		});
	}

	put(key, data) {

		// Allow data as a thing on its own.
		if (typeof key === 'object') {
			data = key;
		}
		else if (typeof data === 'object') {
			data.key = key;
		}

		// Open up a connection to indexdb
		return this.open('readwrite').then(
			objectStore => requestToPromise(objectStore.put(data))
		);
	}
}

function requestToPromise(request) {
	return new Promise((accept, reject) => {
		request.onsuccess = event => {
			accept(event.target.result);
		};
		request.onerror = event => {
			reject(event.target.result);
		};
		request.onblocked = event => {
			reject(event.target.result);
		};
	});
}

module.exports = DB;


