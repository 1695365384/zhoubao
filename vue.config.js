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
        host: '127.0.0.1',
        port: 8080,                                 // 端口号
        https: false,
        hotOnly: false,                             // https:{type:Boolean}
        proxy: {                                        // 配置跨域
            '/api': {
                //公网地址; 39.106.228.183:8081
                //http://172.18.163.14:8080/ (东软内网地址) 
                target: 'http://39.106.228.183:8080/', //源地址 http://172.18.163.14:8080/ (东软内网地址) 
                changeOrigin: true,                  //改变源
                ws: true,                            //是否代理websockets
                pathRewrite: {
                    '^/api': ''
                }
            }
        },                                           // 配置跨域处理,只有一个代理
    }
}
