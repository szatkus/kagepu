!function(e){function t(t){for(var n,i,r=t[0],u=t[1],c=0,a=[];c<r.length;c++)i=r[c],Object.prototype.hasOwnProperty.call(o,i)&&o[i]&&a.push(o[i][0]),o[i]=0;for(n in u)Object.prototype.hasOwnProperty.call(u,n)&&(e[n]=u[n]);for(d&&d(t);a.length;)a.shift()()}var n={},o={7:0};function i(t){if(n[t])return n[t].exports;var o=n[t]={i:t,l:!1,exports:{}};return e[t].call(o.exports,o,o.exports,i),o.l=!0,o.exports}i.e=function(e){var t=[],n=o[e];if(0!==n)if(n)t.push(n[2]);else{var r=new Promise((function(t,i){n=o[e]=[t,i]}));t.push(n[2]=r);var u,c=document.createElement("script");c.charset="utf-8",c.timeout=120,i.nc&&c.setAttribute("nonce",i.nc),c.src=function(e){return i.p+""+({0:"common"}[e]||e)+".js"}(e);var d=new Error;u=function(t){c.onerror=c.onload=null,clearTimeout(a);var n=o[e];if(0!==n){if(n){var i=t&&("load"===t.type?"missing":t.type),r=t&&t.target&&t.target.src;d.message="Loading chunk "+e+" failed.\n("+i+": "+r+")",d.name="ChunkLoadError",d.type=i,d.request=r,n[1](d)}o[e]=void 0}};var a=setTimeout((function(){u({type:"timeout",target:c})}),12e4);c.onerror=c.onload=u,document.head.appendChild(c)}return Promise.all(t)},i.m=e,i.c=n,i.d=function(e,t,n){i.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},i.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},i.t=function(e,t){if(1&t&&(e=i(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(i.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)i.d(n,o,function(t){return e[t]}.bind(null,o));return n},i.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return i.d(t,"a",t),t},i.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},i.p="dist/",i.oe=function(e){throw console.error(e),e};var r=window.webpackJsonp=window.webpackJsonp||[],u=r.push.bind(r);r.push=t,r=r.slice();for(var c=0;c<r.length;c++)t(r[c]);var d=u;i(i.s=20)}({10:function(e,t,n){"use strict";n.d(t,"a",(function(){return r})),n.d(t,"b",(function(){return u}));var o=function(e,t,n,o){return new(n||(n=Promise))((function(i,r){function u(e){try{d(o.next(e))}catch(e){r(e)}}function c(e){try{d(o.throw(e))}catch(e){r(e)}}function d(e){var t;e.done?i(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(u,c)}d((o=o.apply(e,t||[])).next())}))};let i=!1;function r(){return navigator.gpu||(document.getElementById("not-supported").style.display="block",i||alert("WebGPU not supported! Please visit webgpu.io to see the current implementation status."),i=!0),!!navigator.gpu}function u(e,t,n){return o(this,void 0,void 0,(function*(){const o=document.createElement("img");o.src=t,yield o.decode();const i=document.createElement("canvas");i.width=o.width,i.height=o.height;const r=i.getContext("2d");r.translate(0,o.height),r.scale(1,-1),r.drawImage(o,0,0,o.width,o.height);const u=r.getImageData(0,0,o.width,o.height);let c=null;const d=256*Math.ceil(4*o.width/256);if(d==4*o.width)c=u.data;else{c=new Uint8Array(d*o.height);for(let e=0;e<o.height;++e)for(let t=0;t<o.width;++t){let n=4*t+e*d;c[n]=u.data[n],c[n+1]=u.data[n+1],c[n+2]=u.data[n+2],c[n+3]=u.data[n+3]}}const a=e.createTexture({size:{width:o.width,height:o.height,depth:1},format:"rgba8unorm",usage:GPUTextureUsage.COPY_DST|n}),l=e.createBuffer({size:c.byteLength,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.COPY_SRC});l.setSubData(0,c);const s=e.createCommandEncoder({});return s.copyBufferToTexture({buffer:l,rowPitch:d,imageHeight:0},{texture:a},{width:o.width,height:o.height,depth:1}),e.getQueue().submit([s.finish()]),a}))}},20:function(e,t,n){"use strict";n.r(t);var o={};n.r(o),n.d(o,"helloTriangle",(function(){return r})),n.d(o,"helloTriangleMSAA",(function(){return u})),n.d(o,"rotatingCube",(function(){return c})),n.d(o,"twoCubes",(function(){return d})),n.d(o,"instancedCube",(function(){return a})),n.d(o,"texturedCube",(function(){return l})),n.d(o,"fractalCube",(function(){return s})),n.d(o,"computeBoids",(function(){return f})),n.d(o,"animometer",(function(){return h}));var i=function(e,t,n,o){return new(n||(n=Promise))((function(i,r){function u(e){try{d(o.next(e))}catch(e){r(e)}}function c(e){try{d(o.throw(e))}catch(e){r(e)}}function d(e){var t;e.done?i(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(u,c)}d((o=o.apply(e,t||[])).next())}))};const r=()=>i(void 0,void 0,void 0,(function*(){return yield n.e(0).then(n.bind(null,11))})),u=()=>i(void 0,void 0,void 0,(function*(){return yield n.e(0).then(n.bind(null,12))})),c=()=>i(void 0,void 0,void 0,(function*(){return yield n.e(0).then(n.bind(null,13))})),d=()=>i(void 0,void 0,void 0,(function*(){return yield n.e(0).then(n.bind(null,14))})),a=()=>i(void 0,void 0,void 0,(function*(){return yield n.e(0).then(n.bind(null,15))})),l=()=>i(void 0,void 0,void 0,(function*(){return yield n.e(0).then(n.bind(null,16))})),s=()=>i(void 0,void 0,void 0,(function*(){return yield n.e(0).then(n.bind(null,17))})),f=()=>i(void 0,void 0,void 0,(function*(){return yield n.e(0).then(n.bind(null,18))})),h=()=>i(void 0,void 0,void 0,(function*(){return yield n.e(0).then(n.bind(null,19))}));var v=n(10),p=function(e,t,n,o){return new(n||(n=Promise))((function(i,r){function u(e){try{d(o.next(e))}catch(e){r(e)}}function c(e){try{d(o.throw(e))}catch(e){r(e)}}function d(e){var t;e.done?i(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(u,c)}d((o=o.apply(e,t||[])).next())}))};const m=document.querySelector("main"),g=document.getElementById("description-container"),y=document.getElementById("canvas-container"),b=document.getElementById("source-container");function w(e,t){e.className=(e.className||"").replace(t,"")}let P=void 0;function x(e){return p(this,void 0,void 0,(function*(){if(!Object(v.a)())return void(m.className+=" no-demo");const t=e.substring(1);g.innerHTML="",y.innerHTML="",b.innerHTML="",P=void 0;const n=o[t];if(!n)return void(m.className+=" no-demo");w(m,"no-demo");const i=yield n(),r=document.createElement("canvas");r.width=600,r.height=600,y.appendChild(r);const u=yield i.init(r);if(!u)return;const c=document.createElement("h1");c.innerHTML=i.title,g.appendChild(c),g.appendChild(document.createTextNode(i.description)),fetch(`./src/examples/${t}.ts`).then(e=>p(this,void 0,void 0,(function*(){const t=document.createElement("pre");t.innerHTML=yield e.text(),b.appendChild(t)}))),P=r,requestAnimationFrame((function e(t){P===r&&(u(t),requestAnimationFrame(e))}))}))}const T=document.querySelectorAll("a.nav-link");let C=void 0;T.forEach(e=>{e.addEventListener("click",()=>{void 0!==C&&w(C,"selected"),e.className+=" selected",C=e})}),window.addEventListener("popstate",()=>{x(window.location.hash)}),x(window.location.hash)}});
//# sourceMappingURL=main.js.map