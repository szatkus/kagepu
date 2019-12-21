!function(e){var n={};function t(r){if(n[r])return n[r].exports;var o=n[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,t),o.l=!0,o.exports}t.m=e,t.c=n,t.d=function(e,n,r){t.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:r})},t.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},t.t=function(e,n){if(1&n&&(e=t(e)),8&n)return e;if(4&n&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(t.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var o in e)t.d(r,o,function(n){return e[n]}.bind(null,o));return r},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},t.p="dist/",t(t.s=12)}({12:function(e,n,t){"use strict";t.r(n),t.d(n,"title",(function(){return i})),t.d(n,"description",(function(){return u})),t.d(n,"init",(function(){return c}));var r=t(2),o=function(e,n,t,r){return new(t||(t=Promise))((function(o,i){function u(e){try{a(r.next(e))}catch(e){i(e)}}function c(e){try{a(r.throw(e))}catch(e){i(e)}}function a(e){var n;e.done?o(e.value):(n=e.value,n instanceof t?n:new t((function(e){e(n)}))).then(u,c)}a((r=r.apply(e,n||[])).next())}))};const i="Hello Triangle",u="Shows rendering a basic triangle.";function c(e){return o(this,void 0,void 0,(function*(){const n="#version 450\n      const vec2 pos[3] = vec2[3](vec2(0.0f, 0.5f), vec2(-0.5f, -0.5f), vec2(0.5f, -0.5f));\n\n      void main() {\n          gl_Position = vec4(pos[gl_VertexIndex], 0.0, 1.0);\n      }\n    ",t="#version 450\n      layout(location = 0) out vec4 outColor;\n\n      void main() {\n          outColor = vec4(1.0, 0.0, 0.0, 1.0);\n      }\n    ",o=yield navigator.gpu.requestAdapter(),i=yield o.requestDevice(),u=yield Object(r.a)(),c=e.getContext("gpupresent").configureSwapChain({device:i,format:"bgra8unorm"}),a=i.createRenderPipeline({layout:i.createPipelineLayout({bindGroupLayouts:[]}),vertexStage:{module:i.createShaderModule({code:u.compileGLSL(n,"vertex"),source:n,transform:e=>u.compileGLSL(e,"vertex")}),entryPoint:"main"},fragmentStage:{module:i.createShaderModule({code:u.compileGLSL(t,"fragment"),source:t,transform:e=>u.compileGLSL(e,"fragment")}),entryPoint:"main"},primitiveTopology:"triangle-list",colorStates:[{format:"bgra8unorm"}]});return function(){const e=i.createCommandEncoder({}),n={colorAttachments:[{attachment:c.getCurrentTexture().createView(),loadValue:{r:0,g:0,b:0,a:1}}]},t=e.beginRenderPass(n);t.setPipeline(a),t.draw(3,1,0,0),t.endPass(),i.defaultQueue.submit([e.finish()])}}))}},2:function(e,n,t){"use strict";var r=function(e,n,t,r){return new(t||(t=Promise))((function(o,i){function u(e){try{a(r.next(e))}catch(e){i(e)}}function c(e){try{a(r.throw(e))}catch(e){i(e)}}function a(e){var n;e.done?o(e.value):(n=e.value,n instanceof t?n:new t((function(e){e(n)}))).then(u,c)}a((r=r.apply(e,n||[])).next())}))};let o=void 0;n.a=function(){return r(this,void 0,void 0,(function*(){if(void 0!==o)return o;const e=yield import("https://unpkg.com/@webgpu/glslang@0.0.7/web/glslang.js");return o=yield e.default(),o}))}}});
//# sourceMappingURL=helloTriangle-bbae37.js.map