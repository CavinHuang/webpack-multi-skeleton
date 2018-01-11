/**
 * 配置文件
 * @type {[type]}
 */
module.exports = {
  cssPublicPath: "../static",
  imgOutputPath: "img/", // 图片
  cssOutputPath: "./static/css/styles.css", // bulid 后的css路径
  devServerOutputPath: "../dist", // build后的目录
  tplLang: 'pug', // 模板语法，暂时只支持html、pug
  library: ['./app/libs/common.js', './app/libs/test.css'],
}
