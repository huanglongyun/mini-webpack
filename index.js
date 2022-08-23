/*
 * @Author: hly
 * @Date: 2022-08-23 09:14:06
 * @LastEditors: hly
 * @LastEditTime: 2022-08-23 11:26:38
 * @Description:
 */
import fs from 'fs';
import path from 'path';
import parser from '@babel/parser';
import traverse from '@babel/traverse';
function createAsset(filePath) {
    // 1. 获取文件内容
    const source = fs.readFileSync(filePath, {
        encoding: 'utf-8'
    })
    // console.log(source)
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
    return {
        filePath,
        source,
        deps
    }
}

// const asset = createAsset()
// console.log(asset)

function createGraph () {
    const mainAsset = createAsset('./example/main.js')

    // 创建一个队列(其实是就是数组)
    const queue =[mainAsset]
    for (const asset of queue) {
        asset.deps.forEach(relativePath => {
            const child = createAsset(path.resolve('./example',relativePath))
            queue.push(child)
        });
    }

    return queue
}
const graph = createGraph()
console.log(graph)