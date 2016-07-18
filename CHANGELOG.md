# CHANGELOG

## v0.2.0

* feat(core): support dependency-free module can define a direct object literal

  for example:

  ```js
  define({
    add: function(x, y){
      return x + y;
    }
  });
  ```

  transform after:

  ```js
  module.exports = {
    add: function(x, y){
      return x + y;
    }
  };
  ```

* feat(core): skip commonjs keywords: require, module, exports.

  for example:

  ```js
  define(['require', 'module', 'exports'], function(require, module, exports) {
    exports = require('beta');
  });
  ```

  tranform after:

  ```js
  exports = require('beta');
  ```

## v0.1.1

fix(core): cli transform module name error in windows: `require('module/path')` -> `require('.\\module\\path')`.
