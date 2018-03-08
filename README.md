# VueDoo

## Installation

```
npm install --save @ezraobiwale/vue-doo
```

## Usage

```js
import Vue from 'vue';
import VueDoo from '@ezraobiwale/voo-doo';

Vue.use(VueDoo, {
  // hellojs (social login) config object
  // @see https://adodson.com/hello.js/#helloinit
  hello: {
    // credentials object
    credentials: {
      facebook: id,
      windows: id,
      google: id,
      // ...
    },
    // options object
    options: {

    }
  },
  // trigger ajax.started and ajax.ended events
  http: {
      // trigger ajax.started and ajax.ended events
      ajaxEvents: true,
      // axios configuration object
      // @see https://github.com/axios/axios#axioscreateconfig
      axios: {
          baseUrl: 'https://api.example.com',
          headers: {
              Accept: 'application/json',
              Authorization: 'Bearer some-authentication-token'
          }
      },
      // function to call for all request errors
      catchAll(error_response) {
          // do something with error_response object
          console.error('Request error:', error_response);
      }
  },
  // vuex-persistedstate configuration object
  // @see https://github.com/robinvdvleuten/vuex-persistedstate#createpersistedstateoptions
  store: {
      name: 'some-store-name'
  },
  // vue-toasted configuration object
  // @see https://github.com/shakee93/vue-toasted#api
  toasts: {
    iconPack: 'fontawesome'
  }
});
```

### Environment Variables

Using environment variables may be sometimes necessary even for frontend.

On install, an `env.js` file is created in the root directory and the
`config/prod.env.js` file is changed to ensure the variables are processed.

### Packages

`VueDoo` is a combination of super-powerful packages needed for every Vue frontend
app. These packages include:

- axios
- hello.js
- sweetalert
- vue-social-sharing
- vue-toasted
- vuex
- vuex-persistedstate

### Available components

#### loading

Shows a loading icon.

Props:

Name | Required | Default | Description
-----|----------|---------|------------
color | no | #333 | The color of the icon
height | no | - | The height of the icon
icon | no | 1  | The type of icon. 1 - 8
width | no | - | The width of the icon

#### nav-link

A replacement for `router-link` which allows a function to be called on each link
before being used.

Name | Required | Default | Description
-----|----------|---------|------------
to | yes | - | The path to navigate to

#### page-data

Name | Required | Default | Description
-----|----------|---------|------------


### Global Properties

Two properties are added to all `Vue` instances, thereby making them available
in all components on the context `this`.

#### this.$event

A global event bus.

#### this.$hello

The [hellojs](https://adodson.com/hello.js) object.

#### this.$http

A wrapper around [axios](https://github.com/axios/axios). It operates exactly
like axios and has all the [instance methods](https://github.com/axios/axios#instance-methods).

#### Callbacks

All instance methods of `$http` return a Promise. Both the resolve and the
reject callback functions have the same parameters:

```js
this.$http.get('/path/to/resource')
    .then((data, status, headers, originalAxiosResponseObject) => {})
    .catch((data, status, headers, originalAxiosResponseObject) => {});
```

**Note**: `data` is the actual response received from the server.

#### this.$toasted

The [vue-toasted](https://github.com/shakee93/vue-toasted) object.

### Methods

Some utility functions are also provided and are available on the `this` context:

#### this.deepDelete(target, baseObject)

Safely deletes a deep key on an object (including arrays).

```js
let obj = {
    first_name: 'John',
    last_name: 'Doe',
    books: [
        {
            id: 1,
            title: 'The Tale of the Lost Man',
            year: 2008
        },
        {
            id: 2,
            title: 'Another Year Gone',
            year: 2009
        }
    ],
    contacts: {
        phone: '012345678',
        email: 'john.doe@example.com',
        facebook: 'johndoe',
        twitter: '@johndoe'
    }
};

// array
this.deepDelete('books.0.year', obj);
this.deepDelete('books.1', obj);
// object
this.deepDelete('contacts.phone', obj);
```

#### this.deepValue(target, baseObject, defaultValue)

Safely retrieves the value of a deep property on the `baseObject`. If the value
is `undefined`, the `defaultValue` is returned.

Using the [`obj` example above](#this-deepdelete-target-baseobject-),

```js
this.deepValue('books.1.year', obj); // 20009
this.deepValue('books.2.year', obj); // undefined
this.deepValue('books.2.year', obj, 'Not available'); // Not availalbe

this.deepValue('contacts.twitter', obj); // @johndoe
this.deepValue('contacts.linkedin', obj, 'N/A'); // N/A
```

#### this.env(key, defaultValue)

Get an environment variable

```js
this.env('NODE_ENV'); // development
this.env('node_env'); // development

this.env('not_defined_variable', 'Not set'); // Not set
```

#### this.findIn(data, func, defaultValue)

A unified function to search an object (including arrays) and retrieve the
first match. If no match is found, the `defaultValue` is returned.

```js

var objects = {
    first: {
        id: 1,
        time: 10,
    },
    second: {
        id: 2,
        time: 3
    }
};
this.findIn(objects, item => item.time === 3); // {id: 2, time: 3}
this.findIn(objects, item => item.time === 6, {}); // {}

// The same thing applies for arrays
```

#### this.pull(key, obj)

Removes the given key and its value from the given object. If the object is reactive,
the object is notified of the pull. Parameter `key` may be dot-denoted.

#### this.pullValue(value, obj)

Searches for the value in the object and removes it and its key from the given object.
If the object is reactive, the object is notified of the pull.

#### push(value, obj, key, ignoreDots = false)

Pushes a value to the given object (or array). If an object, the key parameter
**MUST** be provided.

Parameter `key` may be dot-denoted. However, is parameter `ignoreDots` is `true`,
then the whole key, w/ the dots, is used as a whole key.

```js
this.push([], this.data, 'contacts.lists'); // { contacts: { lists: [] } }
this.push([], this.data, 'contacts.lists', true); // { "contacts.lists" : [] }
```

#### this.range(start, end, step)

VueJS' `v-for` can be used for number ranges however, they are not zero-indexed.
This is an implementation that is zero-indexed.

```html
<!-- Creates 11 divs with contents 0 to 10  -->
<div v-for="num in range(10)">{{ num }}</div>

<!-- Creates 10 divs with contents 1 to 10  -->
<div v-for="num in range(1, 10)">{{ num }}</div>

<!-- Creates 10 divs with contents 5 to 50 in steps of 5  -->
<div v-for="num in range(5, 50, 5)">{{ num }}</div>

<!-- Creates 10 divs with contents 10 to 1  -->
<div v-for="num in range(10, 1)">{{ num }}</div>

<!-- Creates 6 divs with contents 10 to 0, in steps of -2  -->
<div v-for="num in range(10, 0, 2)">{{ num }}</div>
```

#### this.set(key, value, obj)

Adds a value to an object at the given key while ensuring reactivity.

#### this.store(key, value)

Interacts with the `Vuex` store object.

```js
let store = this.store(); // Fetches the store object
store.set('env', 'testing'); // Store object
store.get('env'); // testing
store.remove('env'); // testing
store.get('env'); // undefined

// shortcuts

this.store('env', 'testing'); // Store object
this.store('env'); // testing
```

#### this.swal( ... )

The [sweetalert function](https://sweetalert.js.org/guides/#getting-started)

#### this.toast(messae, options)

A shortcut to `this.$toasted.show(message, options)`.
