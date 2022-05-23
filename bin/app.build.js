const { execSync } = require("child_process");
const fs = require("fs");

function randomStr(length) {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

if (process.argv[2] == "mode:dev" || process.argv[2] == "mode:development") {
    fs.readFile('./resource/config.js', 'utf-8', (err, data) => {
        if (err) {
            console.log(err);
            return
        }
        let configJs = data
        configJs = configJs.replace(`app_mode = "production"`, `app_mode = "development"`)
        configJs = configJs.replace(`app_mode= "production"`, `app_mode = "development"`)
        configJs = configJs.replace(`app_mode ="production"`, `app_mode = "development"`)
        configJs = configJs.replace(`app_mode="production"`, `app_mode = "development"`)
        
        fs.writeFile(`./resource/config.js`, configJs, function() {
            console.log(`App mode changed to development`);
        });
    })
    
    fs.readFile('./public/index.html', 'utf-8', (err, data) => {
        if (err) {
            console.log(err);
            return
        }
        let new_fv = randomStr(8)
        let indexHtml = data
        indexHtml = indexHtml.replaceAll(/_fv=\w*/g, `_fv=${new_fv}`)
        indexHtml = indexHtml.replace("/app/static/App.js", "/app/dev/App.js")
        
        fs.writeFile(`./public/index.html`, indexHtml, function() {
            console.log(`File Version generated successfully !`);
        });
    })
} else if (process.argv[2] == "mode:prod" || process.argv[2] == "mode:production") {
    fs.readFile('./resource/config.js', 'utf-8', (err, data) => {
        if (err) {
            console.log(err);
            return
        }
        let configJs = data
        configJs = configJs.replace(`app_mode = "development"`, `app_mode = "production"`)
        configJs = configJs.replace(`app_mode= "development"`, `app_mode = "production"`)
        configJs = configJs.replace(`app_mode ="development"`, `app_mode = "production"`)
        configJs = configJs.replace(`app_mode="development"`, `app_mode = "production"`)
        
        fs.writeFile(`./resource/config.js`, configJs, function() {
            console.log(`App mode changed to production`);
            execSync('webpack --config ./bin/webpack.config.js', {stdio: 'inherit'});
        });
    })
    
    fs.readFile('./public/index.html', 'utf-8', (err, data) => {
        if (err) {
            console.log(err);
            return
        }
        let new_fv = randomStr(8)
        let indexHtml = data
        indexHtml = indexHtml.replaceAll(/_fv=\w*/g, `_fv=${new_fv}`)
        indexHtml = indexHtml.replace("/app/dev/App.js", "/app/static/App.js")
        
        fs.writeFile(`./public/index.html`, indexHtml, function() {
            console.log(`File Version generated successfully !`);
        });
    })
} else if (process.argv[2] == "help") {
    console.log(`"npm run build mode:dev or mode:development" -> setup for development environment with ./app/dev source`);
    console.log(`"npm run build mode:prod or mode:production" -> build app for production environment with ./app/static source`);
} else {
    console.log(`Failed to execute "npm run build". Please run "npm run build help" for more information.`);
}

