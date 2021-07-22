import * as ts from 'typescript'
import * as path from 'path'
const fs = require('fs-extra')
const consola = require('consola')

export function getRootPath (): string {
  return path.resolve(__dirname, '../../')
}

export function getPkgVersion (): string {
  return require(path.join(getRootPath(), 'package.json')).version
}

export function printPkgVersion () {
  const version = getPkgVersion()
  console.log(`yapi-autoapi current v${version}`)
}

export const isObject = (arg): boolean => Object.prototype.toString.call(arg) === '[object Object]'

export const isArray = (arg): boolean => Array.isArray(arg)

export const sleep = (timeout) => new Promise((resolve) => setTimeout(resolve, timeout))

export const getAtiConfigs = (defaultAtiConfigs = {}) => {
  const cwd = process.cwd()
  const configPath = `${cwd}/autoapi.config.js`
  if (!fs.existsSync(configPath)) {
    consola.error('autoapi.config.js 配置文件不存在！可运行 autoapi init 初始化配置')
    process.exit(0)
  }
  const userAtiConfig = require(configPath) || {}
  const atiConfigs = Object.assign({}, defaultAtiConfigs, userAtiConfig)
  return atiConfigs
}

export const removeIndexSignature = (members: any) => {
  return (
    Array.isArray(members) &&
    members.filter((item: any) => {
      if ((item.type.kind === 177 || item.type.kind === 178) && item.type?.elementType?.members) {
        const temp = removeIndexSignature(item.type.elementType.members)
        item.type.elementType.members = temp
      }
      return item.kind !== 171
    })
  )
}

export const removeIndexSignatureMiddleWare = (sourceFile: ts.SourceFile) => {
  Array.isArray(sourceFile.statements) &&
    sourceFile.statements.forEach((item: any) => {
      if (item.name.kind === 78) {
        item.members = removeIndexSignature(item.members)
      }
    })
}

export const parseTsCode = (code: string, middleWare?: (x: any) => any) => {
  const sourceFile = ts.createSourceFile(
    'ati.ts', // fileName
    code, // sourceText
    ts.ScriptTarget.Latest // langugeVersion
  )
  if (middleWare) {
    middleWare(sourceFile)
  }
  return ts.createPrinter().printFile(sourceFile)
}
