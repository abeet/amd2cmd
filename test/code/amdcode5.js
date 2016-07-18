define("alpha", ["require", "exports", "beta"], function (require, exports, beta) {
  exports.verb = function() {
    return require('beta').verb();
  }
});
