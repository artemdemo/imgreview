(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[421],{3905:function(e,t,r){"use strict";r.d(t,{kt:function(){return f}});var n=r(7294);function i(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function o(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function a(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?o(Object(r),!0).forEach((function(t){i(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function c(e,t){if(null==e)return{};var r,n,i=function(e,t){if(null==e)return{};var r,n,i={},o=Object.keys(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||(i[r]=e[r]);return i}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(i[r]=e[r])}return i}var l=n.createContext({}),u=function(e){var t=n.useContext(l),r=t;return e&&(r="function"===typeof e?e(t):a(a({},t),e)),r},s={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},d=n.forwardRef((function(e,t){var r=e.components,i=e.mdxType,o=e.originalType,l=e.parentName,d=c(e,["components","mdxType","originalType","parentName"]),f=u(r),p=i,m=f["".concat(l,".").concat(p)]||f[p]||s[p]||o;return r?n.createElement(m,a(a({ref:t},d),{},{components:r})):n.createElement(m,a({ref:t},d))}));function f(e,t){var r=arguments,i=t&&t.mdxType;if("string"===typeof e||i){var o=r.length,a=new Array(o);a[0]=d;var c={};for(var l in t)hasOwnProperty.call(t,l)&&(c[l]=t[l]);c.originalType=e,c.mdxType="string"===typeof e?e:i,a[1]=c;for(var u=2;u<o;u++)a[u]=r[u];return n.createElement.apply(null,a)}return n.createElement.apply(null,r)}d.displayName="MDXCreateElement"},8045:function(e,t,r){"use strict";function n(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}function i(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function o(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var r=null==e?null:"undefined"!==typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=r){var n,i,o=[],a=!0,c=!1;try{for(r=r.call(e);!(a=(n=r.next()).done)&&(o.push(n.value),!t||o.length!==t);a=!0);}catch(l){c=!0,i=l}finally{try{a||null==r.return||r.return()}finally{if(c)throw i}}return o}}(e,t)||c(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function a(e){return function(e){if(Array.isArray(e))return n(e)}(e)||function(e){if("undefined"!==typeof Symbol&&null!=e[Symbol.iterator]||null!=e["@@iterator"])return Array.from(e)}(e)||c(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function c(e,t){if(e){if("string"===typeof e)return n(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);return"Object"===r&&e.constructor&&(r=e.constructor.name),"Map"===r||"Set"===r?Array.from(r):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?n(e,t):void 0}}t.default=function(e){var t,r=e.src,n=e.sizes,a=e.unoptimized,c=void 0!==a&&a,l=e.priority,d=void 0!==l&&l,p=e.loading,g=e.lazyRoot,h=void 0===g?null:g,v=e.lazyBoundary,w=void 0===v?"200px":v,O=e.className,j=e.quality,A=e.width,E=e.height,z=e.objectFit,P=e.objectPosition,I=e.onLoadingComplete,D=e.loader,_=void 0===D?k:D,R=e.placeholder,L=void 0===R?"empty":R,C=e.blurDataURL,q=function(e,t){if(null==e)return{};var r,n,i=function(e,t){if(null==e)return{};var r,n,i={},o=Object.keys(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||(i[r]=e[r]);return i}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(i[r]=e[r])}return i}(e,["src","sizes","unoptimized","priority","loading","lazyRoot","lazyBoundary","className","quality","width","height","objectFit","objectPosition","onLoadingComplete","loader","placeholder","blurDataURL"]),N=u.useRef(null),T=q,M=n?"responsive":"intrinsic";"layout"in T&&(T.layout&&(M=T.layout),delete T.layout);var W="";if(function(e){return"object"===typeof e&&(b(e)||function(e){return void 0!==e.src}(e))}(r)){var U=b(r)?r.default:r;if(!U.src)throw new Error("An object should only be passed to the image component src parameter if it comes from a static image import. It must include src. Received ".concat(JSON.stringify(U)));if(C=C||U.blurDataURL,W=U.src,(!M||"fill"!==M)&&(E=E||U.height,A=A||U.width,!U.height||!U.width))throw new Error("An object should only be passed to the image component src parameter if it comes from a static image import. It must include height and width. Received ".concat(JSON.stringify(U)))}r="string"===typeof r?r:W;var B=x(A),H=x(E),F=x(j),V=!d&&("lazy"===p||"undefined"===typeof p);(r.startsWith("data:")||r.startsWith("blob:"))&&(c=!0,V=!1);(null===(t=N.current)||void 0===t?void 0:t.complete)&&(V=!1);0;var J,G=o(f.useIntersection({rootRef:h,rootMargin:w,disabled:!V}),2),Q=G[0],X=G[1],$=!V||X,K={boxSizing:"border-box",display:"block",overflow:"hidden",width:"initial",height:"initial",background:"none",opacity:1,border:0,margin:0,padding:0},Y={boxSizing:"border-box",display:"block",width:"initial",height:"initial",background:"none",opacity:1,border:0,margin:0,padding:0},Z=!1,ee={position:"absolute",top:0,left:0,bottom:0,right:0,boxSizing:"border-box",padding:0,border:"none",margin:"auto",display:"block",width:0,height:0,minWidth:"100%",maxWidth:"100%",minHeight:"100%",maxHeight:"100%",objectFit:z,objectPosition:P},te="blur"===L?{filter:"blur(20px)",backgroundSize:z||"cover",backgroundImage:'url("'.concat(C,'")'),backgroundPosition:P||"0% 0%"}:{};if("fill"===M)K.display="block",K.position="absolute",K.top=0,K.left=0,K.bottom=0,K.right=0;else if("undefined"!==typeof B&&"undefined"!==typeof H){var re=H/B,ne=isNaN(re)?"100%":"".concat(100*re,"%");"responsive"===M?(K.display="block",K.position="relative",Z=!0,Y.paddingTop=ne):"intrinsic"===M?(K.display="inline-block",K.position="relative",K.maxWidth="100%",Z=!0,Y.maxWidth="100%",J="data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 version=%271.1%27 width=%27".concat(B,"%27 height=%27").concat(H,"%27/%3e")):"fixed"===M&&(K.display="inline-block",K.position="relative",K.width=B,K.height=H)}else 0;var ie={src:y,srcSet:void 0,sizes:void 0};$&&(ie=S({src:r,unoptimized:c,layout:M,width:B,quality:F,sizes:n,loader:_}));var oe=r;0;var ae;0;var ce=(i(ae={},"imagesrcset",ie.srcSet),i(ae,"imagesizes",ie.sizes),ae),le=u.default.useLayoutEffect,ue=u.useRef(I);return u.useEffect((function(){ue.current=I}),[I]),le((function(){Q(N.current)}),[Q]),u.useEffect((function(){!function(e,t,r,n,i){var o=function(){var t=e.current;t&&(t.src!==y&&("decode"in t?t.decode():Promise.resolve()).catch((function(){})).then((function(){if(e.current&&("blur"===n&&(t.style.filter="",t.style.backgroundSize="",t.style.backgroundImage="",t.style.backgroundPosition=""),i.current)){var r=t.naturalWidth,o=t.naturalHeight;i.current({naturalWidth:r,naturalHeight:o})}})))};e.current&&(e.current.complete?o():e.current.onload=o)}(N,0,0,L,ue)}),[oe,M,L,$]),u.default.createElement("span",{style:K},Z?u.default.createElement("span",{style:Y},J?u.default.createElement("img",{style:{display:"block",maxWidth:"100%",width:"initial",height:"initial",background:"none",opacity:1,border:0,margin:0,padding:0},alt:"","aria-hidden":!0,src:J}):null):null,u.default.createElement("img",Object.assign({},T,ie,{decoding:"async","data-nimg":M,className:O,ref:N,style:m({},ee,te)})),V&&u.default.createElement("noscript",null,u.default.createElement("img",Object.assign({},T,S({src:r,unoptimized:c,layout:M,width:B,quality:F,sizes:n,loader:_}),{decoding:"async","data-nimg":M,style:ee,className:O,loading:p||"lazy"}))),d?u.default.createElement(s.default,null,u.default.createElement("link",Object.assign({key:"__nimg-"+ie.src+ie.srcSet+ie.sizes,rel:"preload",as:"image",href:ie.srcSet?void 0:ie.src},ce))):null)};var l,u=function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var r in e)if(Object.prototype.hasOwnProperty.call(e,r)){var n=Object.defineProperty&&Object.getOwnPropertyDescriptor?Object.getOwnPropertyDescriptor(e,r):{};n.get||n.set?Object.defineProperty(t,r,n):t[r]=e[r]}return t.default=e,t}(r(7294)),s=(l=r(5443))&&l.__esModule?l:{default:l},d=r(5809),f=r(7190);function p(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function m(e){for(var t=arguments,r=function(r){var n=null!=t[r]?t[r]:{},i=Object.keys(n);"function"===typeof Object.getOwnPropertySymbols&&(i=i.concat(Object.getOwnPropertySymbols(n).filter((function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable})))),i.forEach((function(t){p(e,t,n[t])}))},n=1;n<arguments.length;n++)r(n);return e}new Map;var y="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";var g=new Map([["default",function(e){var t=e.root,r=e.src,n=e.width,i=e.quality;0;return"".concat(t,"?url=").concat(encodeURIComponent(r),"&w=").concat(n,"&q=").concat(i||75)}],["imgix",function(e){var t=e.root,r=e.src,n=e.width,i=e.quality,o=new URL("".concat(t).concat(E(r))),a=o.searchParams;a.set("auto",a.get("auto")||"format"),a.set("fit",a.get("fit")||"max"),a.set("w",a.get("w")||n.toString()),i&&a.set("q",i.toString());return o.href}],["cloudinary",function(e){var t=e.root,r=e.src,n=e.width,i=e.quality,o=["f_auto","c_limit","w_"+n,"q_"+(i||"auto")].join(",")+"/";return"".concat(t).concat(o).concat(E(r))}],["akamai",function(e){var t=e.root,r=e.src,n=e.width;return"".concat(t).concat(E(r),"?imwidth=").concat(n)}],["custom",function(e){var t=e.src;throw new Error('Image with src "'.concat(t,'" is missing "loader" prop.')+"\nRead more: https://nextjs.org/docs/messages/next-image-missing-loader")}]]);function b(e){return void 0!==e.default}var h={deviceSizes:[640,750,828,1080,1200,1920,2048,3840],imageSizes:[16,32,48,64,96,128,256,384],path:"/_next/image/",loader:"custom"}||d.imageConfigDefault,v=h.deviceSizes,w=h.imageSizes,O=h.loader,j=h.path,A=(h.domains,a(v).concat(a(w)));function S(e){var t=e.src,r=e.unoptimized,n=e.layout,i=e.width,o=e.quality,c=e.sizes,l=e.loader;if(r)return{src:t,srcSet:void 0,sizes:void 0};var u=function(e,t,r){if(r&&("fill"===t||"responsive"===t)){for(var n,i=/(^|\s)(1?\d?\d)vw/g,o=[];n=i.exec(r);n)o.push(parseInt(n[2]));if(o.length){var c,l=.01*(c=Math).min.apply(c,a(o));return{widths:A.filter((function(e){return e>=v[0]*l})),kind:"w"}}return{widths:A,kind:"w"}}return"number"!==typeof e||"fill"===t||"responsive"===t?{widths:v,kind:"w"}:{widths:a(new Set([e,2*e].map((function(e){return A.find((function(t){return t>=e}))||A[A.length-1]})))),kind:"x"}}(i,n,c),s=u.widths,d=u.kind,f=s.length-1;return{sizes:c||"w"!==d?c:"100vw",srcSet:s.map((function(e,r){return"".concat(l({src:t,quality:o,width:e})," ").concat("w"===d?e:r+1).concat(d)})).join(", "),src:l({src:t,quality:o,width:s[f]})}}function x(e){return"number"===typeof e?e:"string"===typeof e?parseInt(e,10):void 0}function k(e){var t=g.get(O);if(t)return t(m({root:j},e));throw new Error('Unknown "loader" found in "next.config.js". Expected: '.concat(d.VALID_LOADERS.join(", "),". Received: ").concat(O))}function E(e){return"/"===e[0]?e.slice(1):e}v.sort((function(e,t){return e-t})),A.sort((function(e,t){return e-t}))},5809:function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.imageConfigDefault=t.VALID_LOADERS=void 0;t.VALID_LOADERS=["default","imgix","cloudinary","akamai","custom"];t.imageConfigDefault={deviceSizes:[640,750,828,1080,1200,1920,2048,3840],imageSizes:[16,32,48,64,96,128,256,384],path:"/_next/image",loader:"default",domains:[],disableStaticImages:!1,minimumCacheTTL:60,formats:["image/webp"]}},5675:function(e,t,r){e.exports=r(8045)}}]);