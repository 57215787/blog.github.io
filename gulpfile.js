var gulp = require('gulp'),
  minifycss = require('gulp-minify-css'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  rename = require('gulp-rename'),
  del = require('del'),
  gulpSequence = require('gulp-sequence'),
  htmlmin = require('gulp-htmlmin'),
  htmlBeautify = require('gulp-html-beautify'),
  imagemin = require('gulp-imagemin'),
  useref = require('gulp-useref'),
  rev = require('gulp-rev'),
  revCollector = require('gulp-rev-collector');
var fontSpider = require( 'gulp-font-spider' );
var dist_dir = './dist';
var pkg_dir = 'pkg';

//clean
gulp.task('clean', function() {
  return del(['pkg']);
});


gulp.task('build', function() {
  return gulp.src(dist_dir + '/view/*.html')
    .pipe(useref())
    .pipe(gulp.dest(pkg_dir + '/view/'));
});

//img
gulp.task('min-img', function() {
  return gulp.src([dist_dir + '/img/**/*.*(jpg|png|svg)', dist_dir + '/lib/*.*(jpg|png|svg)'])
    .pipe(imagemin())
    .pipe(rev())
    .pipe(gulp.dest(pkg_dir + '/img/'))
    .pipe(rev.manifest())
    .pipe(gulp.dest(pkg_dir + '/rev/img/'));
});

//压缩css
gulp.task('minifycss', function() {
  return gulp.src(dist_dir + '/css/*.css') //压缩的文件
    .pipe(minifycss()) //执行压缩
    .pipe(rev())
    .pipe(gulp.dest(pkg_dir + '/css/')) //输出文件夹
    .pipe(rev.manifest())
    .pipe(gulp.dest(pkg_dir + '/rev/css/'));
});

// gulp.task('fontspider', function() {
//     return gulp.src(pkg_dir + '/view/*.html')
//         .pipe(fontSpider({
//            sort: true
//         }))
// });

//CSS里更新引入文件版本号
gulp.task('rev', function() {
  return gulp.src([pkg_dir + '/rev/**/*.json', pkg_dir + '/view/*.html'])
    .pipe(revCollector())
    .pipe(gulp.dest(pkg_dir + '/view/'));
});

gulp.task('revCss', function() {
  return gulp.src([pkg_dir + '/rev/img/*.json', pkg_dir + '/css/*.css'])
    .pipe(revCollector())
    .pipe(gulp.dest(pkg_dir + '/css/'));
});

// 压缩js
gulp.task('minifyjs', function() {
  return gulp.src(dist_dir + '/js/*.js')
    .pipe(uglify()) //压缩
    .pipe(rev())
    .pipe(gulp.dest(pkg_dir + '/js/')) //输出
    .pipe(rev.manifest())
    .pipe(gulp.dest(pkg_dir + '/rev/js/'));
});

//html压缩之后格式化
gulp.task('views', function() {
  gulp.src('./index.html')
    .pipe(htmlmin({
      collapseWhitespace: true, //清除空格
      collapseBooleanAttributes: false, //省略布尔值
      removeComments: true, //清除注释
      removeEmptyAttributes: false, //清除所有的空属性
      removeScriptTypeAttributes: true, //清除script type属性
      removeStyleLinkTypeAttributes: true, // 清除link type属性
      minifyJS: false, //压缩html中的js代码
      minifyCSS: false //压缩html中的css代码
    }))
    .pipe(htmlBeautify({
      indent_size: 4,
      indent_char: ' ',
      // 这里是关键，可以让一个标签独占一行
      unformatted: true,
      // 默认情况下，body | head 标签前会有一行空格
      extra_liners: []
    }))
    .pipe(gulp.dest('./'))
});

gulp.task('pkg_mobile', gulpSequence(
  'clean',
  'build',
  'min-img',
  'minifycss',
  'minifyjs',
  'rev',
  'revCss',
  // 'fontspider',
  'views'
));

gulp.task('default', gulpSequence('pkg_mobile'));
