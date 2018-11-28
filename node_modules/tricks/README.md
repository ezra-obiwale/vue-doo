# Tricks

Herein lies some tricks to pull out of the hat for faster backfront development.

[![Greenkeeper badge](https://badges.greenkeeper.io/MrSwitch/tricks.svg)](https://greenkeeper.io/)
[![Build Status][travis-image]][travis-url]
[![NPM Version][npm-image]][npm-url]
[![Known Vulnerabilities](https://snyk.io/test/github/mrswitch/tricks/badge.svg)](https://snyk.io/test/github/mrswitch/tricks)

## Go Deep

After installing tricks ...

```bash
npm i tricks
```

Incorporate a trick by pointing deep into the library... e.g.

```javascript
let createUrl = require('tricks/string/createUrl');

module.exports = createUrl('https://test.com/?name=dodson', {name: 'andrew', extra: 1});

// 'https://test.com/?name=andrew&extra=1'
```

Helping to keep your projects bundled size to a minimum.

## Docs

Do explore the [directory](https://github.com/MrSwitch/tricks) of functions.

More info and specs are available in the [test/](https://github.com/MrSwitch/tricks/tree/master/test) directory.


[travis-image]: https://img.shields.io/travis/MrSwitch/tricks.svg?style=flat
[travis-url]: https://travis-ci.org/MrSwitch/tricks
[npm-image]: https://img.shields.io/npm/v/tricks.svg?style=flat&branch=master
[npm-url]: https://npmjs.org/package/tricks
