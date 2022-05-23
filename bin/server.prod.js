const express = require("express");
const path = require("path")
const app = express()
const port = 3000

app.use("/app", express.static(path.resolve(__dirname, "../app")))
app.use("/resource", express.static(path.resolve(__dirname, "../resource"), {fallthrough: false}))
app.use("/public", express.static(path.resolve(__dirname, "../public")))
app.use("/favicon.ico", express.static(path.resolve(__dirname, "../public/favicon.ico")))
app.use("/robots.txt", express.static(path.resolve(__dirname, "../public/robots.txt")))

app.get("/*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../public/index.html"))
})

app.listen(process.env.PORT || port, () => {
    console.log('Development server started ...')
    console.log(`Server : http://127.0.0.1:${port}`)
})