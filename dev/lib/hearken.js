(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.hearken = factory());
}(this, (function () { 'use strict';

  function aa(d) {
      console.log('fds');
  }
  console.log(121);

  var index = {
      a: function (p) {
          console.log('11');
      },
      d: aa,
  };

  return index;

})));
//# sourceMappingURL=hearken.js.map
