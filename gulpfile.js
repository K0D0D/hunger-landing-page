const { src, dest, watch, parallel, series } = require("gulp");//наделение src, dest и watch мощностями gulp, parallel - для нескольких тасков одновременно
const scss         = require("gulp-sass");//наделение scss мощностью gulp-sass
const concat       = require("gulp-concat");//и по аналогии
const browserSync  = require("browser-sync").create();
const uglify       = require("gulp-uglify-es").default;
const autoprefixer = require("gulp-autoprefixer");
const imagemin     = require("gulp-imagemin");
const del          = require("del");

function browsersync(){//функция для автообновления страницы
    browserSync.init({
        server: {
            baseDir: "app/"//указание корневой папки
        }
    });
}

function cleanDist(){//функция для очистки папки dist
    return del("dist");
}

function images(){//функция для сжатия изображений
    return src("app/images/**/*")//указание того что будет сжиматься (все изображения из всех папок)
        .pipe(imagemin([
            imagemin.gifsicle({interlaced: true}),//оптимизация для gif
            imagemin.mozjpeg({quality: 75, progressive: true}),//jpeg
            imagemin.optipng({optimizationLevel: 5}),//png
            imagemin.svgo({//svg
                plugins: [
                    {removeViewBox: true},
                    {cleanupIDs: false}
                ]
            })
        ]))//сжатие
        .pipe(dest("dist/images"))//сохранение в папку dist/images
}

function scripts(){//функция для минимизации js
    return src([
        "app/js/main.js"//указание пути к js файлу
    ])
    .pipe(concat("main.min.js"))//конкатинация всех файлов в один
    .pipe(uglify())
    .pipe(dest("app/js"))//сохранение в папку
    .pipe(browserSync.stream());
}

function styles(){//функция для конвертации scss
    return src("app/scss/style.scss")//указание пути конвертируемого файла
        .pipe(scss({outputStyle: "compressed"}))//указание типа конечного файла (compressed - минифицированный)
        .pipe(concat("style.min.css"))//переименование минифицированного файла 
        .pipe(autoprefixer({
            overrideBrowserslist: ["last 10 version"],//совместимость с последними 10-ю версиями браузеров
            grid: true//акцент на гриды
        }))
        .pipe(dest("app/css"))//указание пути к конечному файлу
        .pipe(browserSync.stream());
}

function build(){//функция для сборки проекта
    return src([//указание файлов, которые нужно сохранить
        "app/css/style.min.css",
        "app/fonts/**/*",
        "app/js/main.min.js",
        "app/*.html"
    ], {base: "app"})//указание корневой папки, относительно которой будут создаваться другие при сборке
    .pipe(dest("dist"));//сохранение в папку dist
}

function watching(){//функция для слежкой за изменениями в файлах
    watch(["app/scss/**/*.scss"], styles);//** - слежка во всех папках из всех файлов с расширением .scss
    watch(["app/js/**/*.js", "!app/js/main.min.js"], scripts);//! - слежение за всеми файлами, кроме min.js (чтобы не было зацикливания)
    watch(["app/*.html"]).on("change", browserSync.reload);
}

exports.styles = styles;//при вызове gulp styles будет вызываться одноименная функция
exports.watching = watching;
exports.browsersync = browsersync;
exports.scripts = scripts;
exports.images = images;
exports.cleanDist = cleanDist;

exports.build = series(cleanDist, images, build);//series указывает на строгую последовательность - сперва очистка папки, потом сохранение сжатых картинок, и затем сборка
exports.default = parallel(styles, scripts, browsersync, watching);//при вызове gulp эти таски запустятся одновременно 