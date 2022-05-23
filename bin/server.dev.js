const express = require("express");
const path = require("path")
const app = express()
let port = 3000;
const livereload = require("livereload");
const connectLivereload = require("connect-livereload");

const liveReloadServer = livereload.createServer();
liveReloadServer.watch(path.join(__dirname, '../public'));
liveReloadServer.watch(path.join(__dirname, '../resource'));

app.use(connectLivereload());
liveReloadServer.server.once("connection", () => {
    setTimeout(() => {
        liveReloadServer.refresh();
    }, 100);
});

app.use("/app", express.static(path.resolve(__dirname, "../app")))
app.use("/resource", express.static(path.resolve(__dirname, "../resource"), {fallthrough: false}))
app.use("/public", express.static(path.resolve(__dirname, "../public")))
app.use("/favicon.ico", express.static(path.resolve(__dirname, "../public/favicon.ico")))
app.use("/robots.txt", express.static(path.resolve(__dirname, "../public/robots.txt")))

app.get("/*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../public/index.html"))
});

function runServer() {
    app.listen(process.env.PORT || port, () => {
        const successMessage = `Development server started on port ${port}`;
        console.log(`\x1b[32m${successMessage}\x1b[0m`);
        console.log(`Development server: http://127.0.0.1:${port}`);
    });
};

process.on('uncaughtException', (error) => {
    if (error.code == "EADDRINUSE" && error.port == port) {
        const errorMessage = `Port ${port} is currently in use, tyring to run server on port ${port + 1}`;
        console.log(`\x1b[33m${errorMessage}\x1b[0m`);
        port = port + 1;
        runServer();
    } else if (error.code != "EADDRINUSE") {
        console.log(error);
    };
});

runServer();