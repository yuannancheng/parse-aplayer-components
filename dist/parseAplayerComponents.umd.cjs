(function(l,u){typeof exports=="object"&&typeof module<"u"?module.exports=u(require("aplayer/dist/APlayer.min.css"),require("aplayer")):typeof define=="function"&&define.amd?define(["aplayer/dist/APlayer.min.css","aplayer"],u):(l=typeof globalThis<"u"?globalThis:l||self,l.parseAplayerComponents=u(null,l.APlayer))})(this,function(l,u){"use strict";const p=(e,n)=>{if(n.length>2)return n[0]in e||(e[n[0]]={}),p(e[n[0]],n.slice(1));const t=w(n[0]),s=x(n[1]);e[t]=s},w=e=>e.replace(/\-(\w)/g,function(n,t){return t.toUpperCase()}),x=e=>/true|false/.test(e)?e!=="false":e!==""&&isFinite(e)?1*e:e,C=e=>(e=e.split("#")[0],e.substring(0,e.lastIndexOf("/")+1)),A=(e,n)=>{var t=new URL(n,e);return t.href},d=(e,n)=>(n?n=C(n):n=window.location.href,A(n,e)),P=(e,n,t)=>new Promise((s,r)=>{var o=new XMLHttpRequest;o.open(n,e,!0),o.setRequestHeader("Content-Type","application/json"),o.onreadystatechange=function(){o.readyState==4&&o.status==200?s(JSON.parse(o.responseText)):o.readyState==4&&r(new Error(o.statusText))},o.send(JSON.stringify(t))}),y=async e=>new Promise(async n=>{try{const t=await P(e,"GET");n(t)}catch{console.error(`请求"${e}"过程中发生错误`),n({})}}),m=async(e,n,t=null)=>new Promise(async s=>{if(e===void 0||e===""||!e.endsWith(".json"))return s({});const r=d(e,t);t=r;const o=await y(r),a=n&&!o.audio,i={...await m(o.extends,a,t),...o};if(n){const f=await h(i,i.audio,t);i.audio=f}delete i.extends,s(i)});async function h(e,n,t=null){return new Promise(async s=>{if(n===void 0)return s([]);const r=[];for(const o of n)if(typeof o=="string"){if(o===""||!o.endsWith(".json"))return s();const a=d(o,t),c=a,i=await y(a);if(Object.keys(i).length===0)return s();const f=await h(e,i.audio,c);f.forEach(j=>{g(e,j,c)}),r.push(...f)}else g(e,o,t),r.push(o);s(r)})}function g(e,n,t){const s=["url","cover"];e.lrcType===3&&s.push("lrc");for(const r in n)n.hasOwnProperty(r)&&s.includes(r)&&(n[r]=d(n[r],t))}const T=async(e,n)=>{const t={},s=e.attributes;for(let c=0;c<s.length;c++){const i=s[c];p(t,i.name.split(".").concat(i.value))}const r=!t.audio,o=await m(t.config,r);delete t.config;const a={...o,...t,container:n};console.log(a),new u(a)};return function(){const e=document.querySelectorAll("aplayer");for(let n=0;n<e.length;n++){const t=e[n],s=document.createElement("div");s.id="APlayer_"+Math.random().toString(36).slice(-7),t.parentElement.replaceChild(s,t),T(t,s)}}()});
