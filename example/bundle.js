// 包含多个文件的内容
(function (moudles) {
    // 写一个require方法
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
        // main.js
        const { foo } = require('./foo.js')
        foo()
        console.log("main")
    }, { './foo.js': 1 }],
    1: [function (require, module, exports) {
        // foo.js
        function foo() {
            console.log("foo")
        }
        module.exports = { foo }
    }, {}]
})
