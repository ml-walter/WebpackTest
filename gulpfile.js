var gulp = require( 'gulp' ),
    $ = require( 'gulp-load-plugins' )(),
    gutil = require( "gulp-util" ),
    webpack = require( 'webpack' ),
    WebpackDevServer = require( 'webpack-dev-server' ),
    path = require( 'path' ),
    open = require( 'gulp-open' ),
    merge = require( 'merge-stream' ),
    childProcess = require( 'child_process' ),
    env = require( 'gulp-env' ),
    rimraf = require('rimraf'),
    chalk = require( 'chalk' );                 // jshint ignore:line

const DEV_MODE = gutil.env._[ 0 ] != 'p' && !gutil.env._[ 0 ] != 'pp';      // jshint ignore:line

if ( DEV_MODE ) {
    var str = `
    ########  ######## ##     ##
    ##     ## ##       ##     ##
    ##     ## ##       ##     ##
    ##     ## ######   ##     ##
    ##     ## ##        ##   ##
    ##     ## ##         ## ##
    ########  ########    ###
    `;
    console.log( chalk.black.bgYellow( str ) );
} else {
    var str = `
    ########  ########   #######
    ##     ## ##     ## ##     ##
    ##     ## ##     ## ##     ##
    ########  ########  ##     ##
    ##        ##   ##   ##     ##
    ##        ##    ##  ##     ##
    ##        ##     ##  #######   `;
    console.log( chalk.bgCyan.white.bold( str ) );
}

gulp.task( 'rimraf', function ( cb ) {
    console.log( 'rimraf' );
    rimraf( './dist', cb );
});
// 只要是底線開頭的檔案，都不壓 K ，直接搬到 src/img 資料夾下
gulp.task( 'm', () => {
    var IMG_SRC = [ 'src/img_src/**/*.+(jpg|png)', '!src/img_src/_*' ];
    var OTHER_IMG = [ '!src/img_src/**/*.(jpg|png)', 'src/img_src/_*' ];
    var DIST = 'src/img';
    var imageminPngquant = require( 'imagemin-pngquant' );
    var imageminMozjpeg = require( 'imagemin-mozjpeg' );

    var taskOtherIMG = gulp.src( OTHER_IMG )
        .pipe( $.changed( DIST ) )
        .pipe( $.size( {
            title: '',
            showFiles: true
        }) )
        .pipe( gulp.dest( DIST ) );

    var taskIMGSRC = gulp.src( IMG_SRC )
        .pipe( $.changed( DIST ) )
        .pipe( $.size( {
            title: '',
            showFiles: true
        }) )
        .pipe( $.imagemin( [
            imageminMozjpeg( { quality: 90 }),
            imageminPngquant( { quality: 90 })
        ] ) )
        .pipe( gulp.dest( DIST ) )
        .pipe( $.size( {
            title: 'dist'
        }) );
    return merge( taskOtherIMG, taskIMGSRC );
});

gulp.task( 'webpack-dev-server', ( cb ) => {
    process.env.NODE_ENV = 'development';
    var ifs = require( 'os' ).networkInterfaces();
    var host = '' + Object.keys( ifs ).map( x => ifs[ x ].filter( x => x.family === 'IPv4' && !x.internal )[ 0 ] ).filter( x => x )[ 0 ].address;
    // var host = 'localhost';
    var port = 3000;
    var URI = `http://${host}:${port}/`;

    var config = require( './webpack.config' );
    // config.devtool = "source-map";
    config.devtool = "inline-source-map";
    config.output.publicPath = URI;
    // config.devtool = 'cheap-module-eval-source-map';

     // 一定先 push 再寫 devServer.hot = true 
    // 不然會 Uncaught RangeError: Maximum call stack size exceeded
    for(var a in config.entry){
        config.entry[a].push(  'webpack/hot/dev-server' );
    }
    config.devServer.hot = true;
    config.plugins.push( new webpack.HotModuleReplacementPlugin() );
    for ( let a in config.entry ) {
        config.entry[ a ].unshift( `webpack-dev-server/client?${URI}` );
    }

    var server = new WebpackDevServer( webpack( config ), config.devServer );
    server.listen( port, host, ( err ) => {
        if ( err )
            console.log( err );
        gutil.log( "[webpack-dev-server]", URI );

        cb();
        if ( gutil.env._[ 0 ] === 'd' ) {
            return gulp.src( './' )
                .pipe( open( { uri: URI }) );
        }
    });
});

gulp.task( 'p',['rimraf','m'], ( cb ) => {
    process.env.NODE_ENV = 'production';
    var config = require( './webpack.config' );
    // config.plugins.push(
    //     new webpack.optimize.DedupePlugin(),
    //     new webpack.optimize.UglifyJsPlugin( {
    //         compress: { warnings: false }
    //     })
    // );
    webpack( config, ( err, stats ) => {
        if ( err ) {
            throw new gutil.PluginError( "webpack", err );
        }
        gutil.log( "[webpack]", stats.toString( { colors: true, progress: true, chunkModules: false }) );
        cb();
    });
});

gulp.task( 'pp', [ 'p' ], () => {
    var fileZillaBAT = path.resolve( __dirname, './___FTP.bat' );
    childProcess.exec( fileZillaBAT, ( error, stdout, stderr ) => {
        return gulp.src( './' )
            .pipe( open( { uri: 'http://push.medialand.tw/?debug=medialand' }) );
    });
});

gulp.task( 'watch', () => {    
    gulp.watch( 'src/img_src/**/*', [ 'm' ] );    
});

gulp.task( 'd', ['watch', 'webpack-dev-server' ], () => {
});

gulp.task( 'default', [ 'd' ] );