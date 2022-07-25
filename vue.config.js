const { defineConfig } = require("@vue/cli-service");
const path = require("path");
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false, // 关闭语法检查 // 写原生webpack的配置项
  configureWebpack: {
    devServer: {
      open: true,
      port: 8888,
      host: "127.0.0.1",
      // 代理跨域的配置
      proxy: {
        "/ips": {
          target: "http://www-wms-java.itheima.net", // 我们要代理的地址
          changeOrigin: true,
        },
        "/api": {
          target: "http://www-wms-java.itheima.net", // 我们要代理的地址
          changeOrigin: true,
        },
      },
    },
    resolve: {
      alias: {
        "#": path.join(__dirname, "src/components"),
      },
    },
  },
});
