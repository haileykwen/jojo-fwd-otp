#!/usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");

const type = process.argv[2];
const file_name = process.argv[3];
let file_dir;
let file_template;
let file_ext;

let controller_template =
`export default class {
    controller(){
        
    };
};`;

    let component_template =
`export default class {
    
};`;

    let oneset_controller_template =
`import ${file_name + "Component"} from "../components/${file_name + "Component"}.js";
const Component = new ${file_name + "Component"};

export default class {
    controller(){
        
    };
};`;

function initialProject() {
    const repoName = process.argv[2];
    const gitCheckoutCommand = `git clone --depth 1 git@bitbucket.org:jojocoders/jojo-low-code-library.git ${repoName}`;
    const installDepsCommand = `cd ${repoName} && npm install && rm -fr .git`;

    console.log(`Cloning the repository with name ${repoName}`);
    const checked_out = runCommand(gitCheckoutCommand);
    if (!checked_out) process.exit(-1);

    console.log(`Installing dependencies for ${repoName}`);
    const installDeps = runCommand(installDepsCommand);
    if (!installDeps) process.exit(-1);

    const data = package_template;
    data.name = repoName; 
    fs.writeFileSync(`./${repoName}/package.json`, JSON.stringify(data, null, 4));

    console.log("Congratulations! You are ready. Follow the following commands to start");
    console.log(`cd ${repoName} && npm start`);
    // console.log("this initial project feature is still in development, available soon");
};

function runCommand(command) {
    try {
        execSync(`${command}`, {stdio: 'inherit'});
    } catch (error) {
        console.log(`Failed to execute ${command}`, e);
        return false;
    };
    return true;
};

function validateFile() {
    let fileType;
    let fileName;
    let targetdir;
    let ext;

    function validate() {
        let filenames = fs.readdirSync(`./resource/${targetdir}`);
        let filenamesWithoutExt = [];
        filenames.forEach((filename) => filenamesWithoutExt.push(filename.replace(ext, "")));
        if (filenamesWithoutExt.includes(fileName)) {
            console.log(`File with name ${fileName} already exist as a ${fileType}`);
            process.exit(-1);
        };
    };

    switch(type) {
        case "make:controller":
            fileType = "controller";
            fileName = file_name;
            targetdir = "controllers";
            ext = ".js";
            validate();
            break;
        case "make:component":
            fileType = "component";
            fileName = file_name;
            targetdir = "components";
            ext = ".js";
            validate();
            break;
        case "make:view":
            fileType = "view";
            fileName = file_name;
            targetdir = "views";
            ext = ".html";
            validate();
            break;
        case "make:oneset":
            let set = ["views", "components", "controllers"];
            for (let x = 0; x <= set.length - 1; x++) {
                switch(set[x]) {
                    case "views":
                        fileType = "view";
                        fileName = file_name;
                        targetdir = "views";
                        ext = ".html";
                        validate();
                        break;
                    case "components":
                        fileType = "component";
                        fileName = file_name + "Component";
                        targetdir = "components";
                        ext = ".js";
                        validate();
                        break;
                    case "controllers":
                        fileType = "controller";
                        fileName = file_name + "Controller";
                        targetdir = "controllers";
                        ext = ".js";
                        validate();
                        break;
                };
            };
            break;
        default:
            console.log("Unrecognize type");
            process.exit(-1);
    };
};

function generateFileBaseOnActionType() {
    switch(type) {
        case "make:view":
            file_ext = ".html";
            file_dir = "views";
            file_template = "";
            createFile(file_dir, file_name, file_ext, file_template);
            break;
        case "make:component":
            file_ext = ".js";
            file_dir = "components";
            file_template = component_template;
            createFile(file_dir, file_name, file_ext, file_template);
            break;
        case "make:controller":
            file_ext = ".js";
            file_dir = "controllers";
            file_template = controller_template;
            createFile(file_dir, file_name, file_ext, file_template);
            break;
        case "make:oneset":
            let set = ["views", "components", "controllers"];
            for (let x = 0; x <= set.length - 1; x++) {
                switch(set[x]) {
                    case "views":
                        file_ext = ".html";
                        file_dir = set[x];
                        file_template = "";
                        break;
                    case "components":
                        file_ext = ".js";
                        file_dir = set[x];
                        file_template = component_template;
                        break;
                    case "controllers":
                        file_ext = ".js";
                        file_dir = set[x];
                        file_template = oneset_controller_template;
                        break;
                };
                createFile(file_dir, file_name, file_ext, file_template);
            };
            break;
        default:
            commandNotFound();
    };
};

function createFile(dir, name, ext, template) {
    let file_type;

    if (type == "make:oneset") {
        switch(dir) {
            case "views":
                file_type = "view";
                break;
            case "components":
                file_type = "component";
                name = name + "Component";
                break;
            case "controllers":
                file_type = "controller";
                name = name + "Controller";
                break;
        };
    } else {
        file_type = type;
    };

    fs.writeFile(`./resource/${dir}/${name + ext}`, template, function() {
        console.log(`New ${file_type.replace("make:", "")} with file name ${name + ext} created in /resource/${dir}`);
    });
};

function renderHelp() {
    console.log("command list:");
    console.log(`npm run lowcode make:view "FileName" = create a view file with given name`);
    console.log(`npm run lowcode make:component "FileName" = create a component file with given name`);
    console.log(`npm run lowcode make:controller "FileName" = create a controller file with given name`);
    console.log(`npm run lowcode make:oneset "FileName" = create view, component and controller file with given name`);
    console.log(`npm run lowcode make:auth = create AuthMiddleware for user authentication`);
    console.log(`that's all`);
};

function commandNotFound() {
    console.log(`Command not found. Please run "npm run lowcode help" for more information.`);
};

// If u want to see the arguments
// process.argv.forEach((argv, index) => console.log(index, argv));

if (process.argv.length == 3 && process.argv[2] == "help") {
    renderHelp();
};

if (process.argv.length == 3 && process.argv[2] != "help") {
    // initialProject();

    if (process.argv[2] == "make:auth") {
        makeAuth()
    } else {
        commandNotFound()
    }
};

if (process.argv.length == 4 && process.argv[2].includes("make:")) {
    validateFile();
    generateFileBaseOnActionType();
};

function makeAuth() {
    if (fs.existsSync('./app/dev/Auth.js')) {
        return console.log('Unable to process make:auth because file Auth.js already exist !');
    }
    fs.writeFile(`./app/dev/Auth.js`, authFileTemplate(), function() {
        console.log(`Auth.js has been created in /app/dev/Auth.js`);
    });
}

function authFileTemplate() {
    return `const AuthConfig = {
    redirect: {
        "if_authenticated": "",
        "if_not_authenticated": ""
    },
    url: {
        "login": "",
        "token_validate": ""
    }
}

/*
    ---------------------------------------------------------------------------------------------------
    USAGE
    ---------------------------------------------------------------------------------------------------
    import AuthMiddleware from "./Auth.js" -> in ./app/dev/AppService.js
    ---------------------------------------------------------------------------------------------------

    * AuthConfig

    ----- redirect -----
    - if_authenticated = define path to redirect if user is authenticated
    - if_not_authenticated = define path to redirect if user is not authenticated
    ----- url -----
    - login = define api url for login
    - token_validate = define api url for token validation

    ---------------------------------------------------------------------------------------------------
    * Login Function
    
    Auth.login(params)

    ----- login params (type = object) -----
    - payload: | type = object | body for login api.
    - redirect: | type = boolean | determine wether redirect or not after successfully logged in, default is true means the page will be redirected base on AuthConfig.redirect.if_authenticated.
    - age: | type = number | define age for user session cookie, default is 120 minutes, or you can define it from api response using age keys.
    - onSuccess: | type = function | callback on success logged in
    - onError: | type = function | callback on failed logged in

    ---------------------------------------------------------------------------------------------------
    * Logout Function

    Auth.logout(params)

    ----- logout params (type = object) -----
    - redirect: | type = boolean | determine wether redirect or not after logged out, default is true means the peage will be redirected base on AuthConfig.redirect.if_not_authenticated
    - onSuccess: | type = function | callback after logged out

    ---------------------------------------------------------------------------------------------------
    * Sample Response API Login
    {
        status: | type = string | "success" or "failed",
        token: | type = string | used for user session cookie,
        data: | type = object | user data for global state management,
        age: (optional) | type = number | age of session cookie, define by minute,
    }

    ---------------------------------------------------------------------------------------------------
    * Sample Response API Validate
    {
        is_valid: | type = boolean | true or false, is user valid or not ?,
        data: | type = object | user data for global state management,
    }
*/

export default class {
    async validate(page){
        switch (page) {
            case "guest_route":
                if (!getCookie("session")) {
                    delete Config.headers.Authorization
                    return {
                        redirect: null,
                        valid: true
                    }
                }

                Config.headers.Authorization = getCookie("session")
                if (AuthConfig.url.token_validate != "") {
                    let isValid = await Grab(AuthConfig.url.token_validate).then(res => {
                        this.user = res.data
                        return res.is_valid
                    })
                    if (isValid == true) {
                        return {
                            redirect: AuthConfig.redirect.if_authenticated,
                            valid: false
                        }
                    } else if (isValid == false) {
                        delete Config.headers.Authorization
                        this.user = {}
                        document.cookie = "session=; expires=Thu, 01 Jan 1970 00:00:00 UTC;"
                        return {
                            redirect: null,
                            valid: true
                        }
                    }
                } else {
                    return {
                        redirect: AuthConfig.redirect.if_authenticated,
                        valid: false
                    }
                }
                break;

            case "auth_route":
                if (!getCookie("session")) {
                    delete Config.headers.Authorization
                    return {
                        redirect: AuthConfig.redirect.if_not_authenticated,
                        valid: false
                    }
                }

                Config.headers.Authorization = getCookie("session")
                if (AuthConfig.url.token_validate != "") {
                    let isValid = await Grab(AuthConfig.url.token_validate).then(res => {
                        this.user = res.data
                        return res.is_valid
                    })
                    if (isValid == true) {
                        return {
                            redirect: null,
                            valid: true
                        }
                    } else if (isValid == false) {
                        delete Config.headers.Authorization
                        this.user = {}
                        document.cookie = "session=; expires=Thu, 01 Jan 1970 00:00:00 UTC;"
                        return {
                            redirect: AuthConfig.redirect.if_not_authenticated,
                            valid: false
                        }
                    }
                } else {
                    return {
                        redirect: null,
                        valid: true
                    }
                }
                break;
        
            default:
                return {
                    redirect: null,
                    valid: true
                }
        }
    }

    login(params){
        let age = 120
        let opt = {
            method: "POST",
            body: params.payload
        }

        if (typeof params.age != "undefined") {
            age = params.age
        }

        if (typeof params.redirect == "undefined") {
            params.redirect = true
        }

        if (AuthConfig.url.login == "") {
            console.log("Cannot send login request because of undefined URL !");
        } else {
            Grab(AuthConfig.url.login, opt).then(res => {
                if (res.status == "success") {
                    if (typeof res.age != "undefined") {
                        age = res.age
                    }
    
                    this.user = res.data
                    createCookie("session", res.token, age)
                    Config.headers.Authorization = getCookie("session")
    
                    if (typeof params.onSuccess != "undefined") {
                        if (typeof params.onSuccess == "function") {
                            params.onSuccess(res)
                        } else {
                            console.log("onSuccess must be type of function !");
                        }
                    }
    
                    if (params.redirect == true) {
                        if (AuthConfig.redirect.if_authenticated != "") {
                            redirectPath(AuthConfig.redirect.if_authenticated)
                        } else {
                            console.log("Login success !");
                            console.log("Unable to redirect path because of undefined route.");
                        }
                    }
                } else if (res.status == "failed") {
                    if (typeof params.onError != "undefined") {
                        if (typeof params.onError == "function") {
                            params.onError(res)
                        } else {
                            console.log("onError must be type of function !");
                        }
                    }
                }
            })
        }
    }

    logout(params){
        if (typeof params == "undefined") {
            params = {}
        }

        if (typeof params.redirect == "undefined") {
            params.redirect = true
        }

        delete Config.headers.Authorization
        this.user = {}
        document.cookie = "session=; expires=Thu, 01 Jan 1970 00:00:00 UTC;"

        if (typeof params.onSuccess != "undefined") {
            if (typeof params.onSuccess == "function") {
                params.onSuccess()
            } else {
                console.log("onSuccess must be type of function !");
            }
        }

        if (params.redirect) {
            if (AuthConfig.redirect.if_not_authenticated != "") {
                redirectPath(AuthConfig.redirect.if_not_authenticated)
            } else {
                console.log("Unable to redirect path because of undefined route.");
            }
        }
    }

    status(){
        if (getCookie("session")) {
            return "auth"
        }
        return "guest"
    }

    user = {}
}`
}