module.exports = {
    // 输出文件目录
    outputDir: 'dist',
    // eslint-loader 是否在保存的时候检查
    lintOnSave: false,
    // webpack配置
    chainWebpack: () => {
    },
    configureWebpack: () => {
    },
    // 生产环境是否生成 sourceMap 文件
    productionSourceMap: true,
    parallel: require('os').cpus().length > 1,
    pwa: {},
    // webpack-dev-server 相关配置
    devServer: {
        open: true,                                 //配置自动启动浏览器
        host: 'localhost',
        port: 8080,                                 // 端口号
        https: false,
        hotOnly: false,                             // https:{type:Boolean}
        proxy: {                                        // 配置跨域
            '/api': {
                target: 'http://172.20.10.2:8080', //源地址
                changeOrigin: true,                  //改变源
                ws: true,                            //是否代理websockets
                pathRewrite: {
                    '^/api': ''
                }
            }
        },                                           // 配置跨域处理,只有一个代理
    }
}
