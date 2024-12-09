'use strict';

let autoprefixer = import('gulp-autoprefixer');
autoprefixer.then(r=>{
    autoprefixer = r.default;
});
let CleanCSS = require('clean-css');
let stylus = require('gulp-stylus');
let remember = require('gulp-remember');
let concat = require('gulp-concat');
let cssmin = require('gulp-cssmin');
let jsmin = require('gulp-jsmin');
const {Buffer} = require('node:buffer');
let ejsCl = require('ejs');
let rename = require('gulp-rename');
let sass = require('gulp-sass')(require('sass'));
let map = require('map-stream');
let typograf = require('gulp-typograf');
let header = require('gulp-header');
let footer = require('gulp-footer');
let browserSync = require('browser-sync').create();
let gulp = require('gulp');
let sort = require('gulp-sort');

browserSync.init({server: './'});

let way = {
    stylus: {
        basic: 'bricks/basic',
        extra: 'bricks/extra',
        tools: 'stylus',
        css: 'assets/css'
    },
    scss: {
        basic: 'bricks/basic',
        extra: 'bricks/extra',
        // tools: 'stylus',
        css: 'assets/css'
    },
    ejs: {
        in: 'ejs',
        out: './'
    },
    js: {
        in: 'bricks',
        out: 'assets/js'
    }

};

let scssBasic = () =>
    gulp.src(
        [
            way.scss.basic + '/**/*.scss'
        ],
        {since: gulp.lastRun(scssBasic)}
    )
        .pipe(
            sass().on('error', sass.logError)
        )
        .pipe(remember('basicScss'))
        .pipe(
            sort({
                comparator:
                    function (file1, file2) {
                        var fileName1 = file1.history[0].indexOf('\\')?file1.history[0].split('\\'):file1.history[0].split('\/');
                        fileName1 = fileName1[fileName1.length - 1];
                        var fileName2 = file2.history[0].indexOf('\\')?file2.history[0].split('\\'):file2.history[0].split('\/');
                        fileName2 = fileName2[fileName2.length - 1];
                        if (fileName1.match(/^__/)) {
                            return -1;
                        }
                        if (fileName2.match(/^__/)) {
                            return 1;
                        }
                        if (fileName1.match(/normalize/)) {
                            return -1;
                        }
                        if (fileName2.match(/normalize/)) {
                            return 1;
                        }
                        if (fileName1.match(/tags/)) {
                            return -1;
                        }
                        if (fileName2.match(/tags/)) {
                            return 1;
                        }
                        var lengthFor = 0;
                        if (fileName1.length > fileName2.length) {
                            lengthFor = fileName2.length;
                        } else {
                            lengthFor = fileName1.length;
                        }
                        for (var i=0; i < lengthFor; i++) {
                            if (fileName1[i] > fileName2[i] || fileName1[i] === '_') {
                                return 1;
                            } else if (fileName1[i] < fileName2[i] || fileName2[i] ==='_') {
                                return -1;
                            }
                        }
                        return 0;
                    }
            })
        )
        .pipe(concat('basic.css'))
        .pipe(autoprefixer())
        .pipe( gulp.dest(way.scss.css) )
        .on('data', function (file) {
            const buferFile = new CleanCSS({
                compatibility: '*', // (default) - Internet Explorer 10+ compatibility mode
                inline: ['all'], // enables all inlining, same as ['local', 'remote']
                level: 1 // Optimization levels. The level option can be either 0, 1 (default), or 2, e.g.
                // Please note that level 1 optimization options are generally safe while level 2 optimizations should be safe for most users.
            }).minify(file.contents)
            return file.contents = Buffer.from(buferFile.styles)
        })
        .pipe(rename({suffix: '.min'}))
        .pipe( gulp.dest(way.scss.css) )
        .pipe( browserSync.stream() ) ;
let scssExtra = () =>
    gulp.src(
        [
            way.scss.extra+ '/**/*.scss'
        ],
        {since: gulp.lastRun(scssExtra)}
    )
        .pipe(
            sass().on('error', sass.logError)
        )
        .pipe(remember('extraScss'))
        .pipe(
            sort({
                comparator:
                    function (file1, file2) {
                        var fileName1 = file1.history[0].indexOf('\\')?file1.history[0].split('\\'):file1.history[0].split('\/');
                        fileName1 = fileName1[fileName1.length - 1];
                        var fileName2 = file2.history[0].indexOf('\\')?file2.history[0].split('\\'):file2.history[0].split('\/');
                        fileName2 = fileName2[fileName2.length - 1];
                        if (fileName1.match(/^__/)) {
                            return -1;
                        }
                        if (fileName2.match(/^__/)) {
                            return 1;
                        }
                        if (fileName1.match(/normalize/)) {
                            return -1;
                        }
                        if (fileName2.match(/normalize/)) {
                            return 1;
                        }
                        if (fileName1.match(/tags/)) {
                            return -1;
                        }
                        if (fileName2.match(/tags/)) {
                            return 1;
                        }
                        var lengthFor = 0;
                        if (fileName1.length > fileName2.length) {
                            lengthFor = fileName2.length;
                        } else {
                            lengthFor = fileName1.length;
                        }
                        for (var i=0; i < lengthFor; i++) {
                            if (fileName1[i] > fileName2[i] || fileName1[i] === '_') {
                                return 1;
                            } else if (fileName1[i] < fileName2[i] || fileName2[i] ==='_') {
                                return -1;
                            }
                        }
                        return 0;
                    }
            })
        )
        .pipe(concat('extra.css'))
        .pipe(autoprefixer())
        .pipe( gulp.dest(way.scss.css) )
        .on('data', function (file) {
            const buferFile = new CleanCSS({
                compatibility: '*', // (default) - Internet Explorer 10+ compatibility mode
                inline: ['all'], // enables all inlining, same as ['local', 'remote']
                level: 1 // Optimization levels. The level option can be either 0, 1 (default), or 2, e.g.
                // Please note that level 1 optimization options are generally safe while level 2 optimizations should be safe for most users.
            }).minify(file.contents)
            return file.contents = Buffer.from(buferFile.styles)
        })
        .pipe(rename({suffix: '.min'}))
        .pipe( gulp.dest(way.scss.css) )
        .pipe( browserSync.stream() ) ;
let stylusBasic = () =>
    gulp.src(
        [
            way.stylus.basic + '/**/*.styl'
        ],
        {since: gulp.lastRun(stylusBasic)}
    )
        .pipe( stylus({
            import: [
                __dirname + '/' + way.stylus.tools + '/variables.styl',
                __dirname + '/' + way.stylus.tools + '/mixins.styl'
            ]
        }))
        .pipe(remember('basic'))
        .pipe(
            sort({
                comparator:
                    function (file1, file2) {
                        var fileName1 = file1.history[0].indexOf('\\')?file1.history[0].split('\\'):file1.history[0].split('\/');
                        fileName1 = fileName1[fileName1.length - 1];
                        var fileName2 = file2.history[0].indexOf('\\')?file2.history[0].split('\\'):file2.history[0].split('\/');
                        fileName2 = fileName2[fileName2.length - 1];
                        if (fileName1.match(/^__/)) {
                            return -1;
                        }
                        if (fileName2.match(/^__/)) {
                            return 1;
                        }
                        if (fileName1.match(/normalize/)) {
                            return -1;
                        }
                        if (fileName2.match(/normalize/)) {
                            return 1;
                        }
                        if (fileName1.match(/tags/)) {
                            return -1;
                        }
                        if (fileName2.match(/tags/)) {
                            return 1;
                        }
                        var lengthFor = 0;
                        if (fileName1.length > fileName2.length) {
                            lengthFor = fileName2.length;
                        } else {
                            lengthFor = fileName1.length;
                        }
                        for (var i=0; i < lengthFor; i++) {
                            if (fileName1[i] > fileName2[i] || fileName1[i] === '_') {
                                return 1;
                            } else if (fileName1[i] < fileName2[i] || fileName2[i] ==='_') {
                                return -1;
                            }
                        }
                        return 0;
                    }
            })
        )
    .pipe(concat('basic.css'))
    .pipe(autoprefixer())
    .pipe( gulp.dest(way.stylus.css) )
    .pipe(cssmin())
    .pipe(rename({suffix: '.min'}))
    .pipe( gulp.dest(way.stylus.css) )
        .pipe( browserSync.stream() ) ;


let js = () =>
    gulp.src(
        [   way.js.in+ '/**/*.js'],
        {since: gulp.lastRun(js)}
    )
        .pipe( remember('js') )
        .pipe( concat('scripts.js') )
        .pipe(header('\'use strict\';\n' +
            '(function ($) {\n' +
            '\n' +
            '    var px = \'\'; //\'rt--\'\n' +
            '\n' +
            '    /**\n' +
            '     * Функция для вывода набора jQuery по селектору, к селектору добавляются\n' +
            '     * префиксы\n' +
            '     *\n' +
            '     * @param {string} selector Принимает селектор для формирования набора\n' +
            '     * @return {jQuery} Возвращает новый jQuery набор по выбранным селекторам\n' +
            '     */\n' +
            '    function $x(selector) {\n' +
            '        return $(x(selector));\n' +
            '    }\n' +
            '\n' +
            '    /**\n' +
            '     * Функция для автоматического добавления префиксов к селекторы\n' +
            '     *\n' +
            '     * @param {string} selector Принимает селектор для формирования набора\n' +
            '     * @return {string} Возвращает новый jQuery набор по выбранным селекторам\n' +
            '     */\n' +
            '    function x(selector) {\n' +
            '        var arraySelectors = selector.split(\'.\'),\n' +
            '            firstNotClass = !!arraySelectors[0];\n' +
            '\n' +
            '        selector = \'\';\n' +
            '\n' +
            '        for (var i = 0; i < arraySelectors.length; i++) {\n' +
            '            if (!i) {\n' +
            '                if (firstNotClass) selector += arraySelectors[i];\n' +
            '                continue;\n' +
            '            }\n' +
            '            selector += \'.\' + px + arraySelectors[i];\n' +
            '        }\n' +
            '\n' +
            '        return selector;\n' +
            '    }\n' +
            '\n' +
            '    $(function () {')
        )
        .pipe(
            footer('});\n' +
                '\n' +
                '\n' +
                '})(jQuery);')
        )
        .pipe( gulp.dest(way.js.out) )
        .pipe( jsmin())
        .pipe( rename({suffix: '.min'}) )
        .pipe( gulp.dest(way.js.out) )
        .pipe( browserSync.stream() ) ;
let ejs = () =>
    gulp.src(
        [   way.ejs.in+ '/*.ejs']
    )
        .pipe(
            map(
                function (data, callback) {
                    ejsCl.renderFile(data.history[0], {opt: {}}, function(err, str){
                        if (!err) {
                            data._contents = Buffer.from(str);
                        }
                        callback(null, data);
                    })
                }
            )
        )
        .pipe( rename({extname:'.html'}) )
        .pipe(
            typograf({
                locale:['ru','en-US'],
                disableRule: ['ru/other/phone-number', 'common/symbols/cf'],
                safeTags: [
                    ['<ntp>', '</ntp>']
                ]
            })
        )
        .pipe(gulp.dest(way.ejs.out))
        .pipe( browserSync.stream() ) ;

let stylusExtra = () =>
    gulp.src(
        [   way.stylus.extra + '/**/*.styl'],
        {since: gulp.lastRun(stylusExtra)}
    )
        .pipe( stylus({
            import: [
                __dirname + '/' + way.stylus.tools + '/variables.styl',
                __dirname + '/' + way.stylus.tools + '/mixins.styl'
            ]
        }))
        .pipe(remember('extra'))
        .pipe(
            sort({
                comparator:
                    function (file1, file2) {
                        var fileName1 = file1.history[0].indexOf('\\')?file1.history[0].split('\\'):file1.history[0].split('\/');
                        fileName1 = fileName1[fileName1.length - 1];
                        var fileName2 = file2.history[0].indexOf('\\')?file2.history[0].split('\\'):file2.history[0].split('\/');
                        fileName2 = fileName2[fileName2.length - 1];
                        if (fileName1.match(/^__/)) {
                            return -1;
                        }
                        if (fileName2.match(/^__/)) {
                            return 1;
                        }
                        if (fileName1.match(/normalize/)) {
                            return -1;
                        }
                        if (fileName2.match(/normalize/)) {
                            return 1;
                        }
                        if (fileName1.match(/tags/)) {
                            return -1;
                        }
                        if (fileName2.match(/tags/)) {
                            return 1;
                        }
                        var lengthFor = 0;
                        if (fileName1.length > fileName2.length) {
                            lengthFor = fileName2.length;
                        } else {
                            lengthFor = fileName1.length;
                        }
                        for (var i=0; i < lengthFor; i++) {
                            if (fileName1[i] > fileName2[i] || fileName1[i] === '_') {
                                return 1;
                            } else if (fileName1[i] < fileName2[i] || fileName2[i] ==='_') {
                                return -1;
                            }
                        }
                        return 0;
                    }
            })
        )
        .pipe(concat('extra.css'))
        .pipe(autoprefixer())
        .pipe( gulp.dest(way.stylus.css) )
        .pipe(cssmin())
        .pipe(rename({suffix: '.min'}))
        .pipe( gulp.dest(way.stylus.css) )
        .pipe( browserSync.stream() ) ;


let reload = () => gulp.src(['./*.html']).pipe(browserSync.stream());


let watch = () => {

    gulp.watch(
        [   way.scss.basic + '/**/*.scss'],
        {delay: 80},
        scssBasic
    );

    gulp.watch(
        [   way.scss.extra + '/**/*.scss'],
        {delay: 80},
        scssExtra
    );

    gulp.watch(
        [   way.stylus.basic + '/**/*.styl'],
        {delay: 80},
        stylusBasic
    );

    gulp.watch(
        [   way.stylus.extra + '/**/*.styl'],
        {delay: 80},
        stylusExtra
    );
    gulp.watch(
        [   way.ejs.in+ '/**/*.ejs'],
        {delay: 80},
        ejs
    );
    gulp.watch(
        [   way.js.in+ '/**/*.js'],
        {delay: 80},
        js
    );

    gulp.watch(
        [ './*.html'],
        {delay: 80},
        reload
    );
};

gulp.task('default', gulp.series( ejs, js, stylusBasic, stylusExtra, scssBasic, scssExtra, watch));
