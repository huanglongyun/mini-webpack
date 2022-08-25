
// 包含多个文件的内容
(function (moudles) {
    function require(id) {
        const [fn, mapping ] = moudles[id]

        const module = {
            exports: {}
        }
        function localRequire (filePath) {
            const id = mapping[filePath]
            return require(id)
        }
        fn(localRequire, module, module.exports)

        return module.exports
    }

    // 执行入口函数mainjs
    require(0)
})({
    
        0: [function (require, module, exports) {
            "use strict";

var _foo = require("./foo.js");

(0, _foo.foo)();
console.log("main");
        },{"./foo.js":1}],
    
        1: [function (require, module, exports) {
            "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.foo = foo;

var _bar = require("./bar.js");

var _bar2 = _interopRequireDefault(_bar);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function foo() {
  console.log("foo");
  (0, _bar2.default)();
}
        },{"./bar.js":2}],
    
        2: [function (require, module, exports) {
            "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = bar;

/*
 * @Author: hly
 * @Date: 2022-08-23 14:20:25
 * @LastEditors: hly
 * @LastEditTime: 2022-08-23 17:38:31
 * @Description:
 */function bar() {
  console.log('bar');
}

;
        },{}],
    
})
