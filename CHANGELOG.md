# Changelog

## 3.1.0

- PageData now overwriting default implementation with the default slot

## 3.0.6

- PageData component will not load the url if currentPage prop is 0

## 3.0.5

- Check properties `computed` and `methods` exist on components before attaching store

## 3.0.4

- Accept boolean for `hasNext` prop in component `page-data`.
- Added prop `data` to component `page-data`.
- Use real vuex store flow
- Create function to map vuex to components

## 3.0.1

- Check if **config** directory exists before trying to copy the **prod.env.js** file to it.

## 2.0.0

- Replaced component `a-link` with `nav-link`
- Options object now take key `navPath` which is a function

## 1.3.3

Changed properties `svg-width` and `svg-height` to `width` and `height` respectively on the loading component
Removed surrounding  span tag on the loading component's svg

## 1.3.2

Added properties `svg-width` and `svg-height` to the loading component

## 1.3.1

Fixed components registration issue
## 1.3.0

- Added sweetalert
- Added vue-social-sharing
- Added vue-toasted
- Added components

## 1.2.0

- Added a third parameter to mixin method `pullValue`, a function to call on each item in the object/array.
- Added method `reset` to `$http`

## 1.1.5

Ensure mixin method `pullValue()` returns the pulled value.

## 1.1.4

Allowed values in the `env.js` file to be overwritten by those set in the command
line.

## 1.1.3

Copy existing `env.example.js` file instead of default.

## 1.1.2

Allowed passing of options object for [hellojs](https://adodson.com/hello.js)

## 1.1.1

- Added property `$hello` to hold the [hellojs](https://adodson.com/hello.js) object.
- Added method `onHello`, a shortcut to `this.$hello.on('auth.login')`.

## 1.1.0

Added [hellojs](https://adodson.com/hello.js) implementation