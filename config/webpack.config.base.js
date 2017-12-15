/**
 * webpack 基础配置
 * @type {[type]}
 */
const path = require( "path" );
const webpack = require( 'webpack' );
// 引入插件
const HTMLWebpackPlugin = require( "html-webpack-plugin" );
// 清理 dist 文件夹
const CleanWebpackPlugin = require( "clean-webpack-plugin" )
// 抽取 css
const ExtractTextPlugin = require( "extract-text-webpack-plugin" );
// 引入多页面文件列表
const config = require( "./config" );
const srcDir = path.resolve( process.cwd(), 'app' );
const nodeModPath = path.resolve( __dirname, './node_modules' );
// 通过 html-webpack-plugin 生成的 HTML 集合
let HTMLPlugins = [];
// 入口文件集合
let Entries = {}

// 生成多页面的集合
config.HTMLDirs.forEach( ( page ) => {
  const htmlPlugin = new HTMLWebpackPlugin( {
    filename: `${page}.html`,
    template: path.resolve( __dirname, `../app/templates/${page}.${config.tplLang}` ),
    chunks: [ page, 'vendors' ],
  } );
  HTMLPlugins.push( htmlPlugin );
  Entries[ page ] = path.resolve( __dirname, `../app/static/js/${page}.js` );
} )
Entries[ 'vendors' ] = config.library // 第三方类库
module.exports = {
  entry: Entries,
  devtool: "cheap-module-source-map",
  output: {
    filename: "static/js/[name].bundle.[hash].js",
    path: path.resolve( __dirname, "../dist/" )
  },
  // 加载器
  module: {
    rules: [
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: ExtractTextPlugin.extract( {
          fallback: "style-loader",
          publicPath: config.cssPublicPath,
          use: [
            {
              loader: "css-loader",
              options: {
                minimize: true, // 开启 css 压缩
              }
            },
            { loader: "postcss-loader" } ]
        } )
      },
      {
        test: /\.styl(us)?$/,
        use: [
                'style-loader', 'css-loader', {
            loader: "postcss-loader",
            options: {
              plugins: function () {
                return [ require( 'autoprefixer' ) ];
              }
            }
          }, 'stylus-loader'
        ]
      },
      {
        test: /\.pug$/,
        loader: [ 'html-loader', 'pug-html-loader' ]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [ 'env' ]
          }
        }
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: {
          loader: "file-loader",
          options: {
            // 打包生成图片的名字
            name: "[name].[ext]",
            // 图片的生成路径
            outputPath: config.imgOutputPath
          }
        }
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [ "file-loader" ]
      },
      {
        test: /\.(htm|html)$/i,
        loader: 'html-withimg-loader'
      } ],
  },
  devtool: 'eval',
  plugins: [
    new webpack.optimize.CommonsChunkPlugin( { name: 'vendors', filename: 'vendor.bundle.js' } ),
    new webpack.DefinePlugin( {
      'process.env': {
        NODE_ENV: JSON.stringify( process.env.NODE_ENV )
      }
    } ),
      // 自动清理 dist 文件夹
      new CleanWebpackPlugin( [ "dist" ] ),
      // 将 css 抽取到某个文件夹
      new ExtractTextPlugin( config.cssOutputPath ),
      new webpack.NoEmitOnErrorsPlugin(),
      new webpack.HashedModuleIdsPlugin(),
      // 自动生成 HTML 插件
      ...HTMLPlugins
    ],
}
