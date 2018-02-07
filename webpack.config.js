// 获取环境命令，并去除首尾空格
process.env.NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV : 'product'
const env = process.env.NODE_ENV.replace( /(\s*$)|(^\s*)/ig, '' )
// 根据环境变量引用相关的配置文件
module.exports = require( `./config/webpack.config.${env}.js` )