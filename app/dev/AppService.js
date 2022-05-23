import AppServiceRoot from "../../resource/route.js"

const App = new AppServiceRoot
let Routes = []
App.route().forEach(r => {
    let route = {
        path: r.path,
        view: r.view,
        type: "public_route"
    }

    if (typeof r.controller != "undefined") {
        route["controller"] = r.controller
    }

    if (typeof r.title != "undefined") {
        route["title"] = r.title
    }

    Routes.push(route)
})

if (typeof App.guest != "undefined") {
    App.guest().forEach(r => {
        let route = {
            path: r.path,
            view: r.view,
            type: "guest_route"
        }
    
        if (typeof r.controller != "undefined") {
            route["controller"] = r.controller
        }

        if (typeof r.title != "undefined") {
            route["title"] = r.title
        }
    
        Routes.push(route)
    })
}

if (typeof App.auth != "undefined") {
    App.auth().forEach(r => {
        let route = {
            path: r.path,
            view: r.view,
            type: "auth_route"
        }
    
        if (typeof r.controller != "undefined") {
            route["controller"] = r.controller
        }

        if (typeof r.title != "undefined") {
            route["title"] = r.title
        }
    
        Routes.push(route)
    })
}

if (typeof AuthMiddleware != "undefined") {
    window.Auth = new AuthMiddleware
}

window.documentLoaded = false
window._router = async () => {
    const CheckPath = Routes.map(route => {
        return {
            route: route,
            matched: location.pathname === route.path
        }
    })

    let page = CheckPath.find(isMatch => isMatch.matched)
    if (!page) {
        DOM.render('#main', App.Page_404("Page Not Found"))
        
        if (!documentLoaded) {
            document.getElementById('root').removeAttribute('loader-active');
        }

        if (resourceQueue > 0) {
            let checkQueue = setInterval(() => {
                if (resourceQueue == 0) {
                    clearInterval(checkQueue)
                    if (!documentLoaded) {
                        documentLoaded = true
                        App.controller()
                    }
                    App.pageConstruct()
                }
            }, 1);
        } else {
            if (!documentLoaded) {
                documentLoaded = true
                App.controller()
            }
            App.pageConstruct()
        }
    } else {
        if (typeof page.route.title != "undefined") {
            document.title = page.route.title
        } else {
            document.title = baseTitle
        }

        if (page.route.type == "public_route") {
            renderPage(page)
        } else {
            if (typeof AuthMiddleware != "undefined") {
                let validatePage = await Auth.validate(page.route.type)
        
                if (validatePage.valid) {
                    renderPage(page)
                } else if (!validatePage.valid) {
                    redirectPath(validatePage.redirect)
                }
            } else {
                console.log("AuthMiddleware is not defined !");
                console.log("Install AuthMiddleware using 'npm run lowcode make:auth' then import AuthMiddleware from ./Auth.js");
            }
        }
    }
}

function renderPage(page) {
    fetch(`/resource/views/${page.route.view}.html`).then(res => {
        if (res.status === 200) {
            return res.text()
        } else if (res.status === 404) {
            return App.Page_404(`View ${page.route.view} Not Found`)
        }
    }).then(htmlView => {
        DOM.render('#main', htmlView)

        if (!documentLoaded) {
            document.getElementById('root').removeAttribute('loader-active');
        }

        document.body.scrollTop = 0
        document.documentElement.scrollTop = 0

        if (resourceQueue > 0) {
            let checkQueue = setInterval(() => {
                if (resourceQueue == 0) {
                    clearInterval(checkQueue)
                    renderPageController(page)
                }
            }, 1);
        } else {
            renderPageController(page)
        }
    })
}

function renderPageController(page) {
    if (!documentLoaded) {
        documentLoaded = true
        App.controller()
    }
    
    if (typeof page.route.controller != "undefined") {
        if (page.route.controller != null) {
            let pageController = new page.route.controller()
            pageController.controller()
            App.pageConstruct()
        }
    } else {
        App.pageConstruct()
    }
}

window.addEventListener("popstate", _router)
_router()