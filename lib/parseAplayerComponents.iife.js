var parseAplayerComponents=function(j,h){"use strict";const f=(e,n)=>{if(n.length>2)return n[0]in e||(e[n[0]]={}),f(e[n[0]],n.slice(1));const t=w(n[0]),s=m(n[1]);e[t]=s},w=e=>e.replace(/\-(\w)/g,function(n,t){return t.toUpperCase()}),m=e=>/true|false/.test(e)?e!=="false":e!==""&&isFinite(e)?1*e:e,C=e=>(e=e.split("#")[0],e.substring(0,e.lastIndexOf("/")+1)),x=(e,n)=>{var t=new URL(n,e);return t.href},u=(e,n)=>(n?n=C(n):n=window.location.href,x(n,e)),A=(e,n,t)=>new Promise((s,r)=>{var o=new XMLHttpRequest;o.open(n,e,!0),o.setRequestHeader("Content-Type","application/json"),o.onreadystatechange=function(){o.readyState==4&&o.status==200?s(JSON.parse(o.responseText)):o.readyState==4&&r(new Error(o.statusText))},o.send(JSON.stringify(t))}),d=async e=>new Promise(async n=>{try{const t=await A(e,"GET");n(t)}catch{console.error(`请求"${e}"过程中发生错误`),n({})}}),p=async(e,n,t=null)=>new Promise(async s=>{if(e===void 0||e===""||!e.endsWith(".json"))return s({});const r=u(e,t);t=r;const o=await d(r),a=n&&!o.audio,i={...await p(o.extends,a,t),...o};if(n){const l=await y(i,i.audio,t);i.audio=l}delete i.extends,s(i)});async function y(e,n,t=null){return new Promise(async s=>{if(n===void 0)return s([]);const r=[];for(const o of n)if(typeof o=="string"){if(o===""||!o.endsWith(".json"))return s();const a=u(o,t),c=a,i=await d(a);if(Object.keys(i).length===0)return s();const l=await y(e,i.audio,c);l.forEach(E=>{g(e,E,c)}),r.push(...l)}else g(e,o,t),r.push(o);s(r)})}function g(e,n,t){const s=["url","cover"];e.lrcType===3&&s.push("lrc");for(const r in n)n.hasOwnProperty(r)&&s.includes(r)&&(n[r]=u(n[r],t))}const P=async(e,n)=>{const t={},s=e.attributes;for(let c=0;c<s.length;c++){const i=s[c];f(t,i.name.split(".").concat(i.value))}const r=!t.audio,o=await p(t.config,r);delete t.config;const a={...o,...t,container:n};new h(a)};return function(){const e=document.querySelectorAll("aplayer");for(let n=0;n<e.length;n++){const t=e[n],s=document.createElement("div");s.id="APlayer_"+Math.random().toString(36).slice(-7),t.parentElement.replaceChild(s,t),P(t,s)}}()}(null,APlayer);