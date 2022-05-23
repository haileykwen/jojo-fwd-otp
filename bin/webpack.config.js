const path = require('path')

module.exports = {
    mode: "production",
    entry: {
        App: "./app/dev/App.js",
        AppService: "./app/dev/AppService.js"
    },
    output: {
        path: path.resolve(__dirname, "../app/static"),
        filename: "[name].js"
    }
}