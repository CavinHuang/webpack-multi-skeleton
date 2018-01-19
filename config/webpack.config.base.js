/**
 * webpack 基础配置
 * @type {[type]}
 */
const path = require( "path" );
const webpack = require( 'webpack' );
const glob = require( "glob" )
// 引入插件
const HTMLWebpackPlugin = require( "html-webpack-plugin" );
// 清理 dist 文件夹
const CleanWebpackPlugin = require( "clean-webpack-plugin" )
// 抽取 css
const ExtractTextPlugin = require( "extract-text-webpack-plugin" );
// 引入配置
const config = require( "./config" );
// 通过 html-webpack-plugin 生成的 HTML 集合
let HTMLPlugins = [];
// 入口文件集合
let Entries = {}

function getEntryDir() {
	let globPath = 'app/templates/**/*.' + config.tplLang
	// (\/|\\\\) 这种写法是为了兼容 windows和 mac系统目录路径的不同写法
	let pathDir = 'app(\/|\\\\)(.*?)(\/|\\\\)html'
	let files = glob.sync( globPath )
	let dirname, entries = []
	for ( let i = 0; i < files.length; i++ ) {
		dirname = path.dirname( files[ i ] )
		entries.push( dirname.replace( new RegExp( '^' + pathDir ), '$2' ) )
	}
	return entries;
}
// 生成多页面的集合
getEntryDir()
	.forEach( ( page ) => {
		let moduleName = page.split( '/' )
		let moduleNameStr = moduleName[ moduleName.length - 1 ]
		const htmlPlugin = new HTMLWebpackPlugin( {
			filename: `${moduleNameStr}.html`,
			template: path.resolve( __dirname, `../app/${page}/html/index.${config.tplLang}` ),
			chunks: [ moduleNameStr, 'vendors' ],
		} );
		HTMLPlugins.push( htmlPlugin );
		Entries[ moduleNameStr ] = path.resolve( __dirname, `../app/${page}/index.js` );
	} )

function getVendors() {
	let globPath = `app/${config.libraryDir}/**/*.*`
	let files = glob.sync( globPath )
	let libsArr = []
	files.forEach( ( v, i ) => {
		libsArr.push( './' + v )
	} )
	return libsArr
}
Entries[ 'vendors' ] = getVendors() // 第三方类库
let webpackconfig = {
	entry: Entries,
	devtool: "cheap-module-source-map",
	output: {
		filename: "static/js/[name].bundle.[hash].js",
		path: path.resolve( __dirname, config.devServerOutputPath )
	},
	// 加载器
	module: {
		rules: [ {
			test: /\.css$/,
			exclude: /node_modules/,
			use: ExtractTextPlugin.extract( {
				fallback: "style-loader",
				publicPath: config.cssPublicPath,
				use: [ {
					loader: "css-loader",
					options: {
						minimize: true, // 开启 css 压缩
					}
        }, {
					loader: "postcss-loader"
        } ]
			} )
    }, {
			test: /\.styl(us)?$/,
			use: [ 'style-loader', 'css-loader', {
				loader: "postcss-loader",
				options: {
					plugins: function () {
						return [ require( 'autoprefixer' ) ];
					}
				}
      }, 'stylus-loader' ]
    }, {
			test: /\.pug$/,
			loader: [ 'html-loader', 'pug-html-loader' ]
    }, {
			test: /\.js$/,
			exclude: /node_modules/,
			use: {
				loader: 'babel-loader',
				options: {
					presets: [ 'env' ]
				}
			}
    }, {
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
    }, {
			test: /\.(woff|woff2|eot|ttf|otf)$/,
			use: [ "file-loader" ]
    }, {
			test: /\.(htm|html)$/i,
			loader: 'html-withimg-loader'
    } ],
	},
	devtool: 'eval',
	plugins: [
    new webpack.optimize.CommonsChunkPlugin( {
			name: 'vendors',
			filename: 'vendor.bundle.js'
		} ),
    new webpack.DefinePlugin( {
			'process.env': {
				NODE_ENV: JSON.stringify( process.env.NODE_ENV )
			}
		} ),
    // 自动清理 dist 文件夹
    new CleanWebpackPlugin( [ config.devServerOutputPath ] ),
    // 将 css 抽取到某个文件夹
    new ExtractTextPlugin( {
			//生成css文件名
			filename: 'static/css/[name].[contenthash].css',
			disable: false,
			allChunks: true
		} ),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.HashedModuleIdsPlugin(),
    // 自动生成 HTML 插件
    ...HTMLPlugins
  ],
}
module.exports = webpackconfig