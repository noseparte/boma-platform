var bone = require('bone'),
	proxy = require('bone-cli-proxy'),
	connect = require('bone-connect'),
	less = require('bone-act-less'),
	sass = require('bone-act-sass'),
	concat = require('bone-act-concat'),
	// 混淆
	uglify = require('bone-act-uglify'),
	build = require('bone-cli-build'),
	cleancss = require('bone-act-cleancss'),
	// 定义生成文件夹dist， 用来存放最终的文件
	dist, buildPath,
	seajs;
dist = bone.dest('dist');
buildPath = bone.dest('build');
var page = buildPath.dest('js/page')
	.src('~/js/page/*.js');
var module = buildPath.dest('js/module')
	.src('~/js/module/*.js');
var seajs = buildPath.dest('js/lib')
	.src('~/js/lib/sea.js')
	.act(concat({
		files: [
			'js/lib/sea.js',
			'js/lib/sea.config.js'
		]
	}));
var artTemplate = buildPath.dest('js/util')
	.src('~/js/util/artTemplate.js')
	.act(concat({
		files: [
			'js/util/artTemplate.source.js',
			'__self__'
		]
	}));
var util = buildPath.dest('js/util')
	.src('~/js/util/!(artTemplate).js');
var sass = buildPath.dest('css')
	.src('~/scss/*.scss')
	.act(sass)
	.rename(function(filename) {
		return filename.replace(/\.scss$/, '.css');
	});
var css = buildPath.dest('css')
	.src('~/css/**/*.css');
bone.cli(build(), {
	alias: 'my_build'
});
if(bone.cli.argv.command === 'my_build') {
	seajs.act(uglify);
	page.act(uglify);
	module.act(uglify);
	artTemplate.act(uglify);
	util.act(uglify);
	sass.act(cleancss);
	css.act(cleancss);
}
// 加载代理
bone.cli(proxy({
	pac: true,
	replaceRules: [
		[
			/http:\/\/(?:\d+\.){3}\d+:\d+\/xmbl\/js\/([^_]+)_([\w]+)\.js/,
			'~/build/js/{$1}.js'
		],
		[
			/http:\/\/(?:\d+\.){3}\d+:\d+\/xmbl\/css\/(common)_([\w]+)\.css/,
			'~/build/css/{$1}.css'
		]
	]
}));
// 加载支持connect的插件
bone.cli(connect({
	base: './dist',
	port: 8085
}));
