# AMD2CMD

transform [AMD](https://github.com/amdjs/amdjs-api/wiki/AMD) or CommonJS inspired by [require.js](http://requirejs.org/) to [CommonJS](http://www.commonjs.org/).

[![NPM version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Coverage Status][coveralls-image]][coveralls-url]
[![Dependency Status][depstat-image]][depstat-url]
[![devDependency Status][devdepstat-image]][devdepstat-url]

## Transform What

before(AMD):

```js
define(['dep1', 'dep2'], function(dep1, dep2OtherName) {
  return dep1 + dep2OtherName;
});
```

transform after(CommonJS):

```js
var dep1 = require('dep1');
var dep2OtherName = require('dep2');
module.exports = dep1 + dep2OtherName;
```

* transform `define(['dep1', 'dep2'], function() {});` to `require('dep1');require('dep2');`
* transform `define(function(){return statements;})` to `module.exports = statements;`
* transform `require('obj/xxx')` to `require('../obj/xxx')`

So, Notice this tool can not transform all require.js features.

## Usage

### cli

First, install amd2cmd:

```bash
 npm install -g amd2cmd
```

Second, cd your project, and exec cmd:

```bash
 amd2cmd --in=src/scripts/**/*.js --out=build/scripts --baseDir=src/scripts
```

### use with node.js

First, install amd2cmd:

```bash
 npm install --save amd2cmd
```

Then, you can use amd2cmd like this:

```js
import { amd2cmd } from 'amd2cmd';

amd2cmd(['src/scripts/**/*.js'], 'build/scripts', 'src/scripts')
.on('finish', function() {
  console.log('finish to transform amd code to cmd code');
});
```

or like this:

```js
import { transformCode } from 'amd2cmd';

const cmdCode = transformCode(`define(['dep1', 'dep2'], function(dep1, dep2OtherName) {
  return dep1 + dep2OtherName;
});`, 'file path', 'base path');

console.log(cmdCode);
/* print:
var dep1 = require('dep1');
var dep2OtherName = require('dep2');
module.exports = dep1 + dep2OtherName;
*/
```

### use with gulp

```js
import { transform } from 'amd2cmd';

gulp.src('app/**/*.js')
.pipe(transform({
  basedir: 'app'
}))
.pipe(gulp.dest('build/scripts'));
```

## scripts

Build the project shell:

```bash
 $ npm build
```

Test the project shell:

```bash
 $ npm test
```

Test the project with coverage result:

```bash
 $ npm coverage
```

Generate JavaScript API doc:

```bash
 $ npm esdoc
```

[npm-image]: https://badge.fury.io/js/amd2cmd.svg
[npm-url]: https://npmjs.org/package/amd2cmd
[travis-image]: https://travis-ci.org/sinolz/amd2cmd.svg?branch=master
[travis-url]: https://travis-ci.org/sinolz/amd2cmd
[coveralls-image]: https://coveralls.io/repos/github/sinolz/amd2cmd/badge.svg?branch=master
[coveralls-url]: https://coveralls.io/github/sinolz/amd2cmd?branch=master

[depstat-url]: https://david-dm.org/sinolz/amd2cmd
[depstat-image]: https://img.shields.io/david/sinolz/amd2cmd/master.svg?style=flat-square
[devdepstat-image]: https://david-dm.org/sinolz/amd2cmd/dev-status.svg
[devdepstat-url]: https://david-dm.org/sinolz/amd2cmd#info=devDependencies
