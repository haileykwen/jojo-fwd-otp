import AppConfig from "../../resource/config.js"

// ===== Run App =====
window.Config = new AppConfig
let Resource_css = [];
let Resource_js = [];
Config.resource.forEach((resource, i) => {
    switch (resource.type) {
        case "css":
            Resource_css.push(resource.src)
            break;

        case "js":
            Resource_js.push(resource.src)
            break;
    
        default:
            console.log(`Unknown file type from resource index of ${i}`);
            break;
    }
});

let _fv = `?${document.querySelector('script[runapp]').getAttribute('src').match(/_fv=\w*/g)[0]}`

window.resourceQueue = Resource_css.length + Resource_js.length
const removeResourceQueue = () => {
    resourceQueue -= 1
}
// Process Resource css
let cssQueue = Resource_css.length
const removeCssQueue = () => {
    cssQueue -= 1
    removeResourceQueue()
}
Resource_css.forEach(css => {
    let style = document.createElement('link')
    style.rel = "stylesheet"
    style.href = `${css}${_fv}`
    style.onload = removeCssQueue
    document.head.append(style)
})

// Run Service
const is_resource_css_ready = setInterval(() => {
    if (cssQueue === 0) {
        clearInterval(is_resource_css_ready)
        startAppService()
    }
}, 1);

function startAppService() {
    let AppModePath
    if (Config.app_mode == "development") {
        AppModePath = "app/dev"
    } else if (Config.app_mode == "production") {
        AppModePath = "app/static"
    }

    let appServiceJs = document.createElement('script')
    appServiceJs.type = "module"
    appServiceJs.src = `/${AppModePath}/AppService.js${_fv}`
    document.head.append(appServiceJs)
}

// Process Resource js
let jsQueue = Resource_js.length, jsRendered = 0
const removeJsQueue = () => {
    jsQueue -= 1
    removeResourceQueue()
    if (jsRendered < Resource_js.length - 1) {
        jsRendered += 1
        renderResourceJs(Resource_js[jsRendered])
    }
}

function renderResourceJs(src) {
    let script = document.createElement('script')
    script.type = "text/javascript"
    script.src = `${src}${_fv}`
    script.onload = removeJsQueue
    document.head.append(script)
}

if (Resource_js.length > 0) {
    renderResourceJs(Resource_js[jsRendered])
}

// =====

// ===== Public Scripts =====
window.baseTitle = document.title

function text_to_element(text) {
    let template = document.createElement('template');
    template.innerHTML = text;
    let converted_text = template.content;
    return converted_text;
};

class DOMS {
    render(target_element_selector, element_to_be_embed) {
        let target_element = document.querySelector(target_element_selector);
        if (!target_element) return console.log(`render error, target element with given selector "${target_element_selector}" not found`);
        target_element.innerHTML = element_to_be_embed;
    };

    append(target_element_selector, element_to_be_embed) {
        let target_element = document.querySelector(target_element_selector);
        let converted_element = text_to_element(element_to_be_embed);
        if (!target_element) return console.log(`append error, target element with given selector "${target_element_selector}" not found`);
        target_element.append(converted_element);
    };

    prepend(target_element_selector, element_to_be_embed) {
        let target_element = document.querySelector(target_element_selector);
        let converted_element = text_to_element(element_to_be_embed);
        if (!target_element) return console.log(`prepend error, target element with given selector "${target_element_selector}" not found`);
        target_element.prepend(converted_element);
    };
};

window.DOM = new DOMS;

window.redirectPath = (url) => {
    let redirectTo, currentPath = window.location.pathname
    if (url.indexOf('/') === -1) {
        redirectTo = `/${url}`
    } else {
        redirectTo = url
    }

    if (redirectTo != currentPath) {
        history.pushState(null, null, redirectTo)
        _router()
    }
}

window.GrabRunning = 0
window.Grab = (url, options) => {
    let method, headers = Config.headers, body
    if (typeof options != "undefined") {
        if (typeof options.method != "undefined") {
            method = options.method
        } else {
            method = "GET"
        }

        if (typeof options.headers != "undefined") {
            headers = {...headers, ...options.headers}
        }

        if (typeof options.body != "undefined") {
            body = JSON.stringify(options.body)
        }
    } else {
        method = "GET"
    }

    let opt = {}
    opt.method = method
    opt.headers = headers
    if (typeof body != "undefined") {
        opt.body = body
    }

    GrabRunning += 1
    return fetch(url, opt).then(res => {
        GrabRunning -= 1
        if (res.ok) {
            return res.json()
        } else {
            throw Error(res.statusText)
        }
    }).catch(err => {
        console.log(err);
        alert('Oops.. Something went wrong ! please try again later')
    })
}

window.getCookie = (name) => {
    let value = `; ${document.cookie}`;
    let parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

window.createCookie = (name, value, minutes) => {
    if (minutes) {
        var date = new Date();
        date.setTime(date.getTime() + (minutes * 60 * 1000));
        var expires = "; expires=" + date.toGMTString();
    } else {
        var expires = "";
    }
    document.cookie = name + "=" + value + expires;
}

window.EmailValidate = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/

window.getParamURL = (param) => {
    var url_string = window.location.href;
    var url = new URL(url_string);
    var valueParam = url.searchParams.get(param);
    return valueParam;
}

window.convertDateTime = (timestamp) => {
    var date = new Date(timestamp);
    var hours = date.getHours();
    var minutes = "0" + date.getMinutes();
    var seconds = "0" + date.getSeconds();
    var formattedTime = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + hours + ':' + minutes.substr(-2);

    return formattedTime;
}

window.convertTimestampToDate = (timestamp) => {
    var date = new Date(timestamp);
    var dates = date.getDate();
    if (dates < 10) {
        dates = '0' + parseInt(date.getDate());
    }
    var month = date.getMonth() + 1;
    if (month < 10) {
        month = '0' + parseInt(date.getMonth() + 1);
    }
    var formattedTime = dates + '/' + month + '/' + date.getFullYear();

    return formattedTime;
}

window.convertDateToTimestamp = (date) => {
    var dates = date;
    var dates1 = dates.split("/");
    var newDate = dates1[1] + "/" + dates1[0] + "/" + dates1[2];
    return (new Date(newDate).getTime());
}