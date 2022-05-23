(()=>{"use strict";window.Config=new class{app_mode="production";resource=[];headers={}};let e=[],t=[];Config.resource.forEach(((n,o)=>{switch(n.type){case"css":e.push(n.src);break;case"js":t.push(n.src);break;default:console.log(`Unknown file type from resource index of ${o}`)}}));let n=`?${document.querySelector("script[runapp]").getAttribute("src").match(/_fv=\w*/g)[0]}`;window.resourceQueue=e.length+t.length;const o=()=>{resourceQueue-=1};let r=e.length;const a=()=>{r-=1,o()};e.forEach((e=>{let t=document.createElement("link");t.rel="stylesheet",t.href=`${e}${n}`,t.onload=a,document.head.append(t)}));const i=setInterval((()=>{0===r&&(clearInterval(i),function(){let e;"development"==Config.app_mode?e="app/dev":"production"==Config.app_mode&&(e="app/static");let t=document.createElement("script");t.type="module",t.src=`/${e}/AppService.js${n}`,document.head.append(t)}())}),1);let l=t.length,c=0;const d=()=>{l-=1,o(),c<t.length-1&&(c+=1,s(t[c]))};function s(e){let t=document.createElement("script");t.type="text/javascript",t.src=`${e}${n}`,t.onload=d,document.head.append(t)}function u(e){let t=document.createElement("template");return t.innerHTML=e,t.content}t.length>0&&s(t[c]),window.baseTitle=document.title,window.DOM=new class{render(e,t){let n=document.querySelector(e);if(!n)return console.log(`render error, target element with given selector "${e}" not found`);n.innerHTML=t}append(e,t){let n=document.querySelector(e),o=u(t);if(!n)return console.log(`append error, target element with given selector "${e}" not found`);n.append(o)}prepend(e,t){let n=document.querySelector(e),o=u(t);if(!n)return console.log(`prepend error, target element with given selector "${e}" not found`);n.prepend(o)}},window.redirectPath=e=>{let t,n=window.location.pathname;t=-1===e.indexOf("/")?`/${e}`:e,t!=n&&(history.pushState(null,null,t),_router())},window.GrabRunning=0,window.Grab=(e,t)=>{let n,o,r=Config.headers;void 0!==t?(n=void 0!==t.method?t.method:"GET",void 0!==t.headers&&(r={...r,...t.headers}),void 0!==t.body&&(o=JSON.stringify(t.body))):n="GET";let a={};return a.method=n,a.headers=r,void 0!==o&&(a.body=o),GrabRunning+=1,fetch(e,a).then((e=>{if(GrabRunning-=1,e.ok)return e.json();throw Error(e.statusText)})).catch((e=>{console.log(e),alert("Oops.. Something went wrong ! please try again later")}))},window.getCookie=e=>{let t=`; ${document.cookie}`.split(`; ${e}=`);if(2===t.length)return t.pop().split(";").shift()},window.createCookie=(e,t,n)=>{if(n){var o=new Date;o.setTime(o.getTime()+60*n*1e3);var r="; expires="+o.toGMTString()}else r="";document.cookie=e+"="+t+r},window.EmailValidate=/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,window.getParamURL=e=>{var t=window.location.href;return new URL(t).searchParams.get(e)},window.convertDateTime=e=>{var t=new Date(e),n=t.getHours(),o="0"+t.getMinutes();return t.getSeconds(),t.getFullYear()+"-"+(t.getMonth()+1)+"-"+t.getDate()+" "+n+":"+o.substr(-2)},window.convertTimestampToDate=e=>{var t=new Date(e),n=t.getDate();n<10&&(n="0"+parseInt(t.getDate()));var o=t.getMonth()+1;return o<10&&(o="0"+parseInt(t.getMonth()+1)),n+"/"+o+"/"+t.getFullYear()},window.convertDateToTimestamp=e=>{var t=e.split("/"),n=t[1]+"/"+t[0]+"/"+t[2];return new Date(n).getTime()}})();