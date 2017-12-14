/**
 * 配置文件
 * @type {[type]}
 */
const htmlEntry = require('./htmlEntry');
module.exports = {
  HTMLDirs: htmlEntry,
  cssPublicPath: "../",
  imgOutputPath: "img/", // 图片
  cssOutputPath: "./css/styles.css", // bulid 后的css路径
  devServerOutputPath: "../dist", // build后的目录
}
