(()=>{"use strict";const e=new class extends class extends class{Page_404(e){return`<div class="_page-status">\n                    <h5>404 &nbsp; <span>{</span> ${e} <span>}</span></h5>\n                </div>`}}{controller(){document.body.addEventListener("click",(e=>{if(null!=e.target.closest("a[page-link]")){e.preventDefault();let t=e.target.closest("a[page-link]").getAttribute("href");null!=t&&t.includes("#")?e.preventDefault():redirectPath(t)}else if(null!=e.target.closest("a")){let t=e.target.closest("a").getAttribute("href");null!=t&&t.includes("#")&&e.preventDefault()}}))}pageConstruct(){}}{route(){return[{path:"/",view:"welcome"}]}};let t=[];function o(t){fetch(`/resource/views/${t.route.view}.html`).then((o=>200===o.status?o.text():404===o.status?e.Page_404(`View ${t.route.view} Not Found`):void 0)).then((e=>{if(DOM.render("#main",e),documentLoaded||document.getElementById("root").removeAttribute("loader-active"),document.body.scrollTop=0,document.documentElement.scrollTop=0,resourceQueue>0){let e=setInterval((()=>{0==resourceQueue&&(clearInterval(e),r(t))}),1)}else r(t)}))}function r(t){documentLoaded||(documentLoaded=!0,e.controller()),void 0!==t.route.controller?null!=t.route.controller&&((new t.route.controller).controller(),e.pageConstruct()):e.pageConstruct()}e.route().forEach((e=>{let o={path:e.path,view:e.view,type:"public_route"};void 0!==e.controller&&(o.controller=e.controller),void 0!==e.title&&(o.title=e.title),t.push(o)})),void 0!==e.guest&&e.guest().forEach((e=>{let o={path:e.path,view:e.view,type:"guest_route"};void 0!==e.controller&&(o.controller=e.controller),void 0!==e.title&&(o.title=e.title),t.push(o)})),void 0!==e.auth&&e.auth().forEach((e=>{let o={path:e.path,view:e.view,type:"auth_route"};void 0!==e.controller&&(o.controller=e.controller),void 0!==e.title&&(o.title=e.title),t.push(o)})),"undefined"!=typeof AuthMiddleware&&(window.Auth=new AuthMiddleware),window.documentLoaded=!1,window._router=async()=>{let r=t.map((e=>({route:e,matched:location.pathname===e.path}))).find((e=>e.matched));if(r)if(void 0!==r.route.title?document.title=r.route.title:document.title=baseTitle,"public_route"==r.route.type)o(r);else if("undefined"!=typeof AuthMiddleware){let e=await Auth.validate(r.route.type);e.valid?o(r):e.valid||redirectPath(e.redirect)}else console.log("AuthMiddleware is not defined !"),console.log("Install AuthMiddleware using 'npm run lowcode make:auth' then import AuthMiddleware from ./Auth.js");else if(DOM.render("#main",e.Page_404("Page Not Found")),documentLoaded||document.getElementById("root").removeAttribute("loader-active"),resourceQueue>0){let t=setInterval((()=>{0==resourceQueue&&(clearInterval(t),documentLoaded||(documentLoaded=!0,e.controller()),e.pageConstruct())}),1)}else documentLoaded||(documentLoaded=!0,e.controller()),e.pageConstruct()},window.addEventListener("popstate",_router),_router()})();