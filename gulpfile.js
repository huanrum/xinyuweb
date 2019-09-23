

var fs = require('fs');
var gulp = require('gulp'); // http://www.gulpjs.com/
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var del = require('del'); // https://www.npmjs.com/package/del
var babel = require('gulp-babel'); // https://www.npmjs.com/package/gulp-babel
var sass = require('gulp-sass'); // https://www.npmjs.com/package/gulp-sass

/**
 * 提示可用命令
 */
gulp.task("default", function () {
	console.log('\x1B[34m',[
		'\r\n',
		'编译css 命令 gulp sass',
		'实时编译修改的scss文件的命令 gulp scss',
		'\r\n',
		'编辑需要打包可发布的网站的文件的命令 gulp web',
		'\r\n',
	].join('\r\n'));
	console.log('\x1B[37m');
});

/**
 * 编译出可以用于发布的web代码
 */
gulp.task("web", ['js'], function () {
	var html = __dirname + '/dist/index.html';
	gulp.src('app/require.js').pipe(gulp.dest('dist/'));
	gulp.src('base.js').pipe(gulp.dest('dist/'));
	fs.writeFileSync(html,fs.readFileSync(html).toString()
		.replace('<script>require(\'./index.js\');</script>',`<script src="base.js"></script><script>window.bundleId=${Date.now()}</script><script  data-main="index" src="require.js"></script>`));
	(function findAll(dirs,to){
		dirs.forEach(function(fullpath){
			if(fs.statSync(fullpath).isDirectory()){
				findAll(fs.readdirSync(fullpath).map(function(f){
					return fullpath+'/'+f;
				}),to);
			}else{
				to(fullpath)
			}
		});
	})([
		__dirname + '/dist/index.js',
		__dirname + '/dist/script'
	],function(file){
		fs.writeFileSync(file,[
			'define(function (require, exports, module) {\r\n\r\n',
				fs.readFileSync(file).toString(),
			'\r\n\r\n\r\n\r\n});'
		].join('\r\n'));
	})
});

/**
 * 编译出可以用于打包成APP的代码
 */
gulp.task("exe", ['js']);

/**
 * 编译出js代码
 */
gulp.task("js", ['sass'], function () {
	return gulp.src([
		'app/script*/*.js',
		'app/script*/**/*.js',
		'app/index.js'
	]).pipe(babel({ presets: ['es2015'] }))
	.pipe(uglify())
	.pipe(gulp.dest('dist/'));
});

/**
 * 清理掉上次编译的代码
 */
gulp.task('clean', function () {
	return del('dist/');
});

/**
 * 拷贝入口html
 */
gulp.task('html', ['clean'], function () {
	return gulp.src('app/index.html')
		.pipe(gulp.dest('dist/'));
});

/**
 * 拷贝资源文件
 */
gulp.task('copy', ['html'], function () {
	return Promise.all([
		gulp.src([
			'app/source*/*',
			'app/source*/**/'
		])
		.pipe(gulp.dest('dist/')),
		gulp.src([
			'app/lib*/*',
			'app/lib*/**/'
		])
		.pipe(uglify())
		.pipe(gulp.dest('dist/'))
	]);
	
});

/**
 * 编译出css代码
 */
gulp.task('sass', ['copy'], function () {
	return gulp.src([
		'app/index.scss',
		'app/script/*.scss',
		'app/script/**/*.scss'
	]).pipe(sass())
		.pipe(concat('index.css'))
		.pipe(gulp.dest('dist/'));
});

/**
 * 监视scss变化用于实时编译出css
 */
gulp.task('scss', function () {
	gulp.watch([
		'app/index.scss',
		'app/script/*.scss',
		'app/script/**/*.scss'
	], function () {

	});
});