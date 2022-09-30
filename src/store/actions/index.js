/*
* @author cr
* @describe 自动化配置，不要更改
* */

const files = require.context('.', false, /\.js$/)
let actions = {};

files.keys().forEach(key => {
  if(key.indexOf('index') === -1){
    actions = Object.assign({}, files(key).default, actions)
  }
})
export default actions
