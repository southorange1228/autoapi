import { formatCode } from '../utils'
import * as path from 'path'

;(async () => {
  const code = 'var a=123;var b="test"'
  const formatedCode = await formatCode(
    code,
    path.join(__dirname, '../defaultConfig/prettierConfig.js')
  )
  console.log(formatedCode)
})()
