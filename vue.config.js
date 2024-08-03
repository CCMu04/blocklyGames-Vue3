const {defineConfig} = require('@vue/cli-service');
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

module.exports = defineConfig({
    transpileDependencies: true,
    lintOnSave: false,
    configureWebpack: {
        resolve: {
            fallback: {
                "vm": require.resolve("vm-browserify")
            }
        },
        plugins: [new NodePolyfillPlugin()]
    },
})
