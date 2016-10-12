const path = require( "path" ),
    webpack = require( 'webpack' ),
    chalk = require( 'chalk' ),
    gutil = require( 'gulp-util' ),
    ExtractTextPlugin = require( "extract-text-webpack-plugin" ),
    HtmlWebpackPlugin = require( 'html-webpack-plugin' );

const DEV_MODE = process.env.NODE_ENV === 'development';
var colorFun;
if( DEV_MODE ){
    colorFun = chalk.black.bgYellow;
}else{
    colorFun = chalk.bgCyan.white;
}
console.log( colorFun( 'process.env.NODE_ENV = ' + process.env.NODE_ENV ) );

// 存成實體的 html 檔，同時支援 ~xxx.jpg 的寫法
var htmlExtractText = new ExtractTextPlugin( "[name].html" );
// 存在實體的 css 檔，同時支援 ~xxx.jpg 的寫法
var cssExtractText = new ExtractTextPlugin( "asset/css/[name].css" );

/*var commonsChunk = new webpack.optimize.CommonsChunkPlugin({
  name: 'vendor',
  filename: 'asset/js/[name].js',
  minChunks: Infinity
});*/

var config = {
    context: path.resolve( 'src' ),
    entry: {
        index: [ 'js/entry.js' ],
        // vendor: ['jquery', 'TweenMax']
    },
    output: {
        publicPath: '',   // css?sourceMap 會讓 background-image url 失效，所以要加網址
        path: path.resolve( "dist" ),
        filename: "asset/js/[name].js"
    },
    resolve: {
        alias: {    // 遇到程式 require 或 webpack.config.js 內提到 'jquery' 這個 module 的時候
            "jquery": "lib/jquery.min.js",
            "TweenMax": "lib/TweenMax.min.js"
        },
        root: [
            path.resolve( 'src/js' ),
            path.resolve( 'src/html' ),
            path.resolve( 'src/img' ),
            path.resolve( 'src/scss' ),
            path.resolve( 'src/' ),
        ],
        extensions: [ "", ".js" ] // require 不用打副檔名
    },
    // webpack 不處理這些 module, 僅將其視為 dependencies, 這樣就不會把以下的 lib 打包進程式
    externals: {
        'jquery': '$',
        'TweenMax': 'TweenMax'
    }
};
config.plugins = [
    // commonsChunk,
    htmlExtractText,
    new webpack.DefinePlugin( {
        __DEV__: DEV_MODE,
        'process.env.NODE_ENV': DEV_MODE ? "'development'" : '"production"'
    })
];
// webpack css hotreload 一定要用 inject 的方式
if ( !DEV_MODE ) {
    config.plugins.push( cssExtractText );
}

config.devServer = {
    /*proxy: {
        '/*.ashx': {
            target: 'http://music.heineken.com.tw/201607ooh',
            changeOrigin: true
        }
    },*/
    historyApiFallback: false,
    inline: true,
    progress: true,
    stats: {
        colors: true,
        hash: false, // add the hash of the compilation
        version: false, // add webpack version information
        timings: true, // add timing information
        assets: true, // add assets information
        chunks: false, // add chunk information
        chunkModules: false, // add built modules information to chunk information
        modules: false, // add built modules information
        cached: false, // add also information about cached (not built) modules
        reasons: false, // add information about the reasons why modules are included
        source: false, // add the source code of modules
        errorDetails: true, // add details to errors (like resolving log)
        chunkOrigins: false // add the origins of chunks and chunk merging info
    }
};

var sassLoader = cssExtractText.extract( `css?sourceMap!autoprefixer!sass?sourceMap`, {  // 這樣 background:url 就可以吃 url-loader, 但就不支援 hotreload
    publicPath: '../../'
});
if ( DEV_MODE ) {
    sassLoader = `style!css?sourceMap=${DEV_MODE}!autoprefixer!sass?sourceMap=${DEV_MODE}`;
}

config.module = {
    noParse: path.resolve( 'src/lib' ),    
    loaders: [
        {
            test: /\.html$/,
            include: path.resolve( 'src/html' ),
            exclude: /node_modules/,
            loader: htmlExtractText.extract(
                `html?name=[name].html&interpolate=require`,
                {
                    publicPath: '' // html 圖檔路徑
                }
            )
        },
        {
            test: /\.scss$/,
            include: path.resolve( 'src/scss' ),
            exclude: /node_modules/,
            loader: sassLoader
        },
        {
            test: /\.js$/,
            include: path.resolve( 'src/js' ),
            exclude: /node_modules/,
            loader: 'babel',
            query: {
                presets: [ "es2015", "stage-2" ]
            }
        },
        {
            //url-loader, 小於 4 K 的圖片會變 base64, 其他就搬到 dist/asset/img/
            test: /\.(png|jpg|PNG|JPG)$/,
            include: path.resolve( 'src/img' ),
            exclude: /node_modules/,
            loader: 'url-loader?limit=4096&name=asset/[path][name].[ext]?[hash:6]'
        },
        {
            // 搬動有用到的 asset 檔案
            include: path.resolve( 'src/asset' ),
            loader: 'file-loader?name=[path][name].[ext]'
        }
    ]
};


module.exports = config;
