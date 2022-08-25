import fs from 'fs';
import ejs from 'ejs';
import path from 'path';
import parser from '@babel/parser';
import traverse from '@babel/traverse';
import { transformFromAst } from 'babel-core'
import {jsonLoader} from './jsonLoader.js'
const webpackConfig = {
    module: {
        rules: [
            { test: /\.json$/, use: [jsonLoader] },
        ],
    },

}

let id = 0
function createAsset(filePath) {
    // 1. 获取文件内容
    let source = fs.readFileSync(filePath, {
        encoding: 'utf-8'
    })


    // console.log(source)

    // initLoader

    const loaders = webpackConfig.module.rules
    const loaderContext={
        addDeps(dep){
            console.log("addDeps:",dep)
        }
    }

    loaders.forEach(({test,use}) => {
        if(test.test(filePath)){
            use.reverse().forEach(fn=>{
                source= fn.call(loaderContext, source)
            })
        }
    });


    // 2. 获取依赖关系
    // ast => 抽象语法树
    const ast = parser.parse(source, {
        sourceType: 'module'
    })
    // 保存依赖关系
    const deps = []
    // 遍历树
    traverse.default(ast, {
        // 当节点是 ImportDeclaration 就会进入
        ImportDeclaration({ node }) {
            // console.log(node.source.value)
            deps.push(node.source.value)
        }
    })
    // console.log(ast)

    const { code } = transformFromAst(ast, null, {
        presets: ["env"]
    })
    // console.log(code)
    return {
        filePath,
        code,
        deps,
        mapping: {},
        id: id++
    }
}

// const asset = createAsset()
// console.log(asset)

function createGraph() {
    const mainAsset = createAsset('./example/main.js')

    // 创建一个队列(其实是就是数组)
    const queue = [mainAsset]
    for (const asset of queue) {
        asset.deps.forEach(relativePath => {
            const child = createAsset(path.resolve('./example', relativePath))
            asset.mapping[relativePath] = child.id
            queue.push(child)
        });
    }

    return queue
}
const graph = createGraph()
// console.log(graph)

function build(graph) {
    // 导入ejs模板文件
    const template = fs.readFileSync('./bunble.ejs', { encoding: 'utf-8' })

    const data = graph.map(asset => {
        const { id, code, mapping } = asset
        return {
            id, code, mapping
        }
    })
    const code = ejs.render(template, { data })
    // console.log('code=>',code)

    // console.log('data=>',data)
    // 将生成的代码写入文件
    fs.writeFileSync("./dist/bundle.js", code)
}

// 执行函数
build(graph)