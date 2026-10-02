var Tt=(e,t,n)=>()=>{if(e)try{t=e(e=0)}catch(r){n=[r]}if(n)throw n[0];return t};async function D(e,t){let n=await e.prepare("SELECT key, value FROM settings").all(),r=new Map;if(n.results)for(let p of n.results)r.set(p.key,p.value);let o="direct",s=r.get("outbound_mode");if(s==="socks5"||s==="backend"||s==="direct")o=s;let i=[],c=r.get("endpoints");if(c)try{let p=JSON.parse(c);if(Array.isArray(p))i=p}catch{i=[]}if(i.length===0&&t)i=[{label:"Default Edge",address:t,port:443,sni:t,host:t},{label:"MCI Clean 1 (Speed)",address:"speed.cloudflare.com",port:443,sni:t,host:t},{label:"MCI Clean 2 (Anycast)",address:"104.16.132.229",port:443,sni:t,host:t},{label:"MCI Clean 3 (CF DNS)",address:"162.159.192.1",port:443,sni:t,host:t},{label:"MCI Clean 4 (172.64)",address:"172.64.155.249",port:443,sni:t,host:t},{label:"MCI Alt Port (8443)",address:"104.17.80.1",port:8443,sni:t,host:t},{label:"MCI Alt Port (2053)",address:"104.20.74.82",port:2053,sni:t,host:t}];let a,l=r.get("socks5_config");if(l)try{a=JSON.parse(l)}catch{a=void 0}let d,m=r.get("backend_config");if(m)try{d=JSON.parse(m)}catch{d=void 0}return{outbound_mode:o,endpoints:i,socks5_config:a,backend_config:d}}async function ut(e,t){let n=[];if(t.outbound_mode!==void 0)n.push(e.prepare("INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value").bind("outbound_mode",t.outbound_mode));if(t.endpoints!==void 0)n.push(e.prepare("INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value").bind("endpoints",JSON.stringify(t.endpoints)));if(t.socks5_config!==void 0)n.push(e.prepare("INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value").bind("socks5_config",JSON.stringify(t.socks5_config)));if(t.backend_config!==void 0)n.push(e.prepare("INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value").bind("backend_config",JSON.stringify(t.backend_config)));if(n.length>0)await e.batch(n)}function Lt(e,t){if(e===0||t===0)return 0;return ae[Le[e]+Le[t]]}function Yt(e,t){let n=Array(e.length+t.length-1).fill(0);for(let r=0;r<e.length;r++)for(let o=0;o<t.length;o++)n[r+o]^=Lt(e[r],t[o]);return n}function Zt(e){let t=[1];for(let n=0;n<e;n++)t=Yt(t,[1,ae[n]]);return t}function en(e,t){let n=Zt(t),r=new Uint8Array(e.length+t);r.set(e,0);for(let o=0;o<e.length;o++){let s=r[o];if(s!==0)for(let i=0;i<n.length;i++)r[o+i]^=Lt(n[i],s)}return r.subarray(e.length)}function ie(e,t=256){let n=new TextEncoder().encode(e),r=n.length,o=null;for(let u of Ue){let y=u[0],v=u[1],x=u[2],P=v-x,It=4+(y<=9?8:16)+r*8;if(Math.ceil(It/8)<=P){o=u;break}}if(!o)o=Ue[Ue.length-1];let[s,i,c]=o,a=i-c,l=s*4+17,d=[],m=(u,y)=>{for(let v=y-1;v>=0;v--)d.push(u>>>v&1)};m(4,4);let p=s<=9?8:16;m(r,p);for(let u=0;u<r;u++)m(n[u],8);let g=a*8,U=Math.min(4,g-d.length);m(0,U);while(d.length%8!==0)d.push(0);let w=[236,17],b=0;while(d.length<g)m(w[b%2],8),b++;let S=new Uint8Array(a);for(let u=0;u<a;u++){let y=0;for(let v=0;v<8;v++)y=y<<1|d[u*8+v];S[u]=y}let f=en(S,c),L=new Uint8Array(i);L.set(S,0),L.set(f,a);let h=Array.from({length:l},()=>Array(l).fill(null)),I=(u,y)=>{for(let v=-1;v<=7;v++)for(let x=-1;x<=7;x++){let P=u+v,H=y+x;if(P<0||P>=l||H<0||H>=l)continue;if(v>=0&&v<=6&&(x===0||x===6)||x>=0&&x<=6&&(v===0||v===6)||v>=2&&v<=4&&x>=2&&x<=4)h[P][H]=1;else h[P][H]=0}};I(0,0),I(0,l-7),I(l-7,0);for(let u=8;u<l-8;u++){if(h[6][u]===null)h[6][u]=u%2===0?1:0;if(h[u][6]===null)h[u][6]=u%2===0?1:0}h[4*s+9][8]=1;for(let u=0;u<=8;u++){if(h[8][u]===null)h[8][u]=0;if(h[u][8]===null)h[u][8]=0}for(let u=l-8;u<l;u++){if(h[8][u]===null)h[8][u]=0;if(h[u][8]===null)h[u][8]=0}let R=0,B=[];for(let u=0;u<L.length;u++)for(let y=7;y>=0;y--)B.push(L[u]>>>y&1);let _=!0;for(let u=l-1;u>0;u-=2){if(u===6)u--;let y=_?Array.from({length:l},(v,x)=>l-1-x):Array.from({length:l},(v,x)=>x);for(let v of y)for(let x of[u,u-1])if(h[v][x]===null){let P=R<B.length?B[R++]:0,H=(v+x)%2===0?1:0;h[v][x]=P^H}_=!_}let j=30660;for(let u=0;u<15;u++){let y=j>>>14-u&1;if(u<=5)h[8][u]=y;else if(u===6)h[8][7]=y;else if(u===7)h[8][8]=y;else if(u===8)h[7][8]=y;else h[14-u][8]=y;if(u<8)h[l-1-u][8]=y;else h[8][l-15+u]=y}let T=4,E=l+T*2,k=[];for(let u=0;u<l;u++)for(let y=0;y<l;y++)if(h[u][y]===1)k.push(`<rect x="${y+T}" y="${u+T}" width="1" height="1"/>`);return`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${E} ${E}" width="${t}" height="${t}" fill="currentColor" shape-rendering="crispEdges">
    <rect width="${E}" height="${E}" fill="#ffffff"/>
    <g fill="#000000">
      ${k.join("")}
    </g>
  </svg>`}var ae,Le,Ue;var ce=Tt(()=>{ae=new Uint8Array(512),Le=new Uint8Array(256);(()=>{let e=1;for(let t=0;t<255;t++)ae[t]=e,ae[t+255]=e,Le[e]=t,e=e<<1^(e>=128?285:0)})();Ue=[[1,26,7,0],[2,44,10,7],[3,70,15,7],[4,100,20,7],[5,134,26,7],[6,172,36,7],[7,196,40,0],[8,242,48,0],[9,292,60,0],[10,346,72,0],[11,404,80,0],[12,466,96,0],[13,532,104,0],[14,581,120,3],[15,655,132,3]]});var Ce=Symbol();var Re=(e,t)=>new Response(e,{headers:{"Content-Type":t.replace(/^[^;]+/,(n)=>n.toLowerCase())}}).formData();var Pt=1e4,X=(e)=>("headers"in e),Pe=async(e,t=Object.create(null))=>{let{all:n=!1,dot:r=!1}=t,o=(X(e)?e.headers:e.raw.headers).get("Content-Type")?.split(";")[0].trim().toLowerCase();if(o==="multipart/form-data"||o==="application/x-www-form-urlencoded")return _t(e,{all:n,dot:r});return{}};async function _t(e,t){if(!X(e)&&e.bodyCache.formData)return Ie(await e.bodyCache.formData,t);let n=X(e)?e.headers:e.raw.headers,r=await e.arrayBuffer(),o=Re(r,n.get("Content-Type")||"");if(!X(e))e.bodyCache.formData=o;let s=await o;if(s)return Ie(s,t);return{}}function Ie(e,t){let n=Object.create(null),r={count:0};if(e.forEach((o,s)=>{if(!(t.all||s.endsWith("[]")))n[s]=o;else Dt(n,s,o)}),t.dot)Object.entries(n).forEach(([o,s])=>{if(o.includes("."))Bt(n,o,s,r),delete n[o]});return n}var Dt=(e,t,n)=>{if(e[t]!==void 0)if(Array.isArray(e[t]))e[t].push(n);else e[t]=[e[t],n];else if(!t.endsWith("[]"))e[t]=n;else e[t]=[n]},Bt=(e,t,n,r)=>{if(/(?:^|\.)__proto__\./.test(t))return;let o=e,s=t.split(".",34);if(s.length>33)Te();s.forEach((i,c)=>{if(c===s.length-1)o[i]=n;else{if(!o[i]||typeof o[i]!=="object"||Array.isArray(o[i])||o[i]instanceof File){if(r.count++>=Pt)Te();o[i]=Object.create(null)}o=o[i]}})},Te=()=>{throw Error("Nesting limit exceeded")};var de=(e)=>{let t=e.split("/");if(t[0]==="")t.shift();return t},_e=(e)=>{let{groups:t,path:n}=Ot(e),r=de(n);return Mt(r,t)},Ot=(e)=>{let t=[];return e=e.replace(/\{[^}]+\}/g,(n,r)=>{let o=`@${r}`;return t.push([o,n]),o}),{groups:t,path:e}},Mt=(e,t)=>{for(let n=t.length-1;n>=0;n--){let[r]=t[n];for(let o=e.length-1;o>=0;o--)if(e[o].includes(r)){e[o]=e[o].replace(r,t[n][1]);break}}return e},Y={},De=(e,t)=>{if(e==="*")return"*";let n=e.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);if(n){let r=`${e}#${t}`;if(!Y[r])if(n[2])Y[r]=t&&t[0]!==":"&&t[0]!=="*"?[r,n[1],new RegExp(`^${n[2]}(?=/${t})`)]:[e,n[1],new RegExp(`^${n[2]}$`)];else Y[r]=[e,n[1],!0];return Y[r]}return null},Be=(e,t)=>{try{return t(e)}catch{return e.replace(/(?:%[0-9A-Fa-f]{2})+/g,(n)=>{try{return t(n)}catch{return n}})}},Nt=(e)=>Be(e,decodeURI),ue=(e)=>{let t=e.url,n=t.indexOf("/",t.indexOf(":")+4),r=n;for(;r<t.length;r++){let o=t.charCodeAt(r);if(o===37){let s=t.indexOf("?",r),i=t.indexOf("#",r),c=s===-1?i===-1?void 0:i:i===-1?s:Math.min(s,i),a=t.slice(n,c);return Nt(a.includes("%25")?a.replace(/%25/g,"%2525"):a)}else if(o===63||o===35)break}return t.slice(n,r)};var Oe=(e)=>{let t=ue(e);return t.length>1&&t.at(-1)==="/"?t.slice(0,-1):t},M=(e,t,...n)=>{if(n.length)t=M(t,...n);return`${e?.[0]==="/"?"":"/"}${e}${t==="/"?"":`${e?.at(-1)==="/"?"":"/"}${t?.[0]==="/"?t.slice(1):t}`}`},Z=(e)=>{if(e.charCodeAt(e.length-1)!==63||!e.includes(":"))return null;let t=e.split("/"),n=[],r="";return t.forEach((o)=>{if(o!==""&&!/\:/.test(o))r+="/"+o;else if(/\:/.test(o))if(o.charCodeAt(o.length-1)===63){if(n.length===0&&r==="")n.push("/");else n.push(r);let s=o.slice(0,-1);r+="/"+s,n.push(r)}else r+="/"+o}),n.filter((o,s,i)=>i.indexOf(o)===s)},ee=(e)=>e.indexOf("%")!==-1?Be(e,qt):e,le=(e)=>{if(e.indexOf("+")!==-1)e=e.replace(/\+/g," ");return ee(e)},Me=(e,t,n)=>{let r=e.indexOf("#",8);if(r!==-1)e=e.slice(0,r);let o;if(!n&&t&&t.indexOf("%")===-1&&t.indexOf("+")===-1){let c=e.indexOf("?",8);if(c===-1)return;if(!e.startsWith(t,c+1))c=e.indexOf(`&${t}`,c+1);while(c!==-1){let a=e.charCodeAt(c+t.length+1);if(a===61){let l=c+t.length+2,d=e.indexOf("&",l);return le(e.slice(l,d===-1?void 0:d))}else if(a==38||isNaN(a))return"";c=e.indexOf(`&${t}`,c+1)}if(o=/[%+]/.test(e),!o)return}let s=Object.create(null);o??=/[%+]/.test(e);let i=e.indexOf("?",8);while(i!==-1){let c=e.indexOf("&",i+1),a=e.indexOf("=",i);if(a>c&&c!==-1)a=-1;let l=e.slice(i+1,a===-1?c===-1?void 0:c:a);if(o)l=le(l);if(i=c,l==="")continue;let d;if(a===-1)d="";else if(d=e.slice(a+1,c===-1?void 0:c),o)d=le(d);if(n){if(!(s[l]&&Array.isArray(s[l])))s[l]=[];s[l].push(d)}else s[l]??=d}return t?s[t]:s},Ne=Me,qe=(e,t)=>Me(e,t,!0),qt=decodeURIComponent;var je=class{raw;#t;#e;routeIndex=0;path;bodyCache={};constructor(e,t="/",n=[[]]){this.raw=e,this.path=t,this.#e=n}param(e){return e?this.#n(e):this.#s()}#n(e){let t=this.#e[0][this.routeIndex]?.[1][e],n=this.#r(t);return n&&ee(n)}#s(){let e={},t=Object.keys(this.#e[0][this.routeIndex]?.[1]??{});for(let n of t){let r=this.#r(this.#e[0][this.routeIndex][1][n]);if(r!==void 0)e[n]=ee(r)}return e}#r(e){return this.#e[1]?this.#e[1][e]:e}query(e){return Ne(this.url,e)}queries(e){return qe(this.url,e)}header(e){if(e)return this.raw.headers.get(e)??void 0;let t=Object.create(null);return this.raw.headers.forEach((n,r)=>{t[r]=n}),t}async parseBody(e){return Pe(this,e)}#o=(e)=>{let{bodyCache:t,raw:n}=this,r=t[e];if(r)return r;for(let o in t)return t[o].then((s)=>{if(o==="json")s=JSON.stringify(s);let i=o==="formData"?void 0:n.headers.get("content-type");return new Response(s,{headers:i?{"Content-Type":i}:void 0})[e]()});return t[e]=n[e]()};json(){return this.#o("text").then((e)=>JSON.parse(e))}text(){return this.#o("text")}arrayBuffer(){return this.#o("arrayBuffer")}bytes(){return this.#o("arrayBuffer").then((e)=>new Uint8Array(e))}blob(){return this.#o("blob")}formData(){return this.#o("formData")}addValidatedData(e,t){(this.#t??={})[e]=t}valid(e){return this.#t?.[e]}get url(){return this.raw.url}get method(){return this.raw.method}get[Ce](){return this.#e}get matchedRoutes(){return this.#e[0].map(([[,e]])=>e)}get routePath(){return this.#e[0].map(([[,e]])=>e)[this.routeIndex].path}};var $e={Stringify:1,BeforeStream:2,Stream:3},jt=(e,t)=>{let n=new String(e);return n.isEscaped=!0,n.callbacks=t,n};var me=async(e,t,n,r,o)=>{if(typeof e==="object"&&!(e instanceof String)){if(!(e instanceof Promise))e=e.toString();if(e instanceof Promise)e=await e}let s=e.callbacks;if(!s?.length)return Promise.resolve(e);if(o)o[0]+=e;else o=[e];let i=Promise.all(s.map((c)=>c({phase:t,buffer:o,context:r}))).then((c)=>Promise.all(c.filter(Boolean).map((a)=>me(a,t,!1,r,o))).then(()=>o[0]));if(n)return jt(await i,s);else return i};var $t="text/plain; charset=UTF-8",pe=(e,t)=>({"Content-Type":e,...t}),G=(e,t)=>new Response(e,t),fe=class{#t;#e;env={};#n;finalized=!1;error;#s;#r;#o;#d;#c;#l;#i;#u;#m;constructor(e,t){if(this.#t=e,t)this.#r=t.executionCtx,this.env=t.env,this.#l=t.notFoundHandler,this.#m=t.path,this.#u=t.matchResult}get req(){return this.#e??=new je(this.#t,this.#m,this.#u),this.#e}get event(){if(this.#r&&"respondWith"in this.#r)return this.#r;else throw Error("This context has no FetchEvent")}get executionCtx(){if(this.#r)return this.#r;else throw Error("This context has no ExecutionContext")}get res(){return this.#o||=G(null,{headers:this.#i??=new Headers})}set res(e){if(this.#o&&e){e=G(e.body,e);for(let[t,n]of this.#o.headers.entries()){if(t==="content-type")continue;if(t==="set-cookie"){let r=this.#o.headers.getSetCookie();e.headers.delete("set-cookie");for(let o of r)e.headers.append("set-cookie",o)}else e.headers.set(t,n)}}this.#o=e,this.finalized=!0}render=(...e)=>(this.#c??=(t)=>this.html(t),this.#c(...e));setLayout=(e)=>this.#d=e;getLayout=()=>this.#d;setRenderer=(e)=>{this.#c=e};header=(e,t,n)=>{if(this.finalized)this.#o=G(this.#o.body,this.#o);let r=this.#o?this.#o.headers:this.#i??=new Headers;if(t===void 0)r.delete(e);else if(n?.append)r.append(e,t);else r.set(e,t)};status=(e)=>{this.#s=e};set=(e,t)=>{this.#n??=new Map,this.#n.set(e,t)};get=(e)=>this.#n?this.#n.get(e):void 0;get var(){if(!this.#n)return{};return Object.fromEntries(this.#n)}#a(e,t,n){let r=this.#o?new Headers(this.#o.headers):this.#i;if(typeof t==="object"&&t.headers){r??=new Headers;for(let[s,i]of new Headers(t.headers))if(s==="set-cookie")r.append(s,i);else r.set(s,i)}if(n){if(!r){let s=0;for(let i in n)if(++s>1||typeof n[i]!=="string"){r=new Headers;break}}if(r)for(let s in n){let i=n[s];if(typeof i==="string")r.set(s,i);else{r.delete(s);for(let c of i)r.append(s,c)}}}let o=typeof t==="number"?t:t?.status??this.#s;return G(e,{status:o,headers:r??n})}newResponse=(...e)=>this.#a(...e);body=(e,t,n)=>this.#a(e,t,n);text=(e,t,n)=>!this.#i&&!this.#s&&!t&&!n&&!this.finalized?new Response(e):this.#a(e,t,pe($t,n));json=(e,t,n)=>this.#a(JSON.stringify(e),t,pe("application/json",n));html=(e,t,n)=>{let r=(o)=>this.#a(o,t,pe("text/html; charset=UTF-8",n));return typeof e==="object"?me(e,$e.Stringify,!1,{}).then(r):r(e)};redirect=(e,t)=>{let n=String(e);return this.header("Location",!/[^\x00-\xFF]/.test(n)?n:encodeURI(n)),this.newResponse(null,t??302)};notFound=()=>(this.#l??=()=>G(),this.#l(this))};var he=(e,t,n)=>(r,o)=>{let s=-1;return i(0);async function i(c){if(c<=s)throw Error("next() called multiple times");s=c;let a,l=!1,d;if(e[c])d=e[c][0][0],r.req.routeIndex=c;else d=c===e.length&&o||void 0;if(d)try{a=await d(r,()=>i(c+1))}catch(m){if(m instanceof Error&&t)r.error=m,a=await t(m,r),l=!0;else throw m}else if(r.finalized===!1&&n)a=await n(r);if(a&&(r.finalized===!1||l))r.res=a;return r}};var He=["get","post","put","delete","options","patch","query"],te="Can not add a route since the matcher is already built.",ne=class extends Error{};var Fe="__COMPOSED_HANDLER";var Ht=(e)=>e.text("404 Not Found",404),ze=(e,t)=>{if("getResponse"in e){let n=e.getResponse();return t.newResponse(n.body,n)}return console.error(e),t.text("Internal Server Error",500)},We=class e{get;post;put;delete;options;patch;query;all;on;use;router;getPath;_basePath="/";#t="/";routes=[];constructor(t={}){[...He,"all"].forEach((o)=>{this[o]=(s,...i)=>{let c=o.toUpperCase();if(typeof s==="string")this.#t=s;else this.#s(c,this.#t,s);return i.forEach((a)=>{this.#s(c,this.#t,a)}),this}}),this.on=(o,s,...i)=>{for(let c of[s].flat()){this.#t=c;for(let a of[o].flat()){let l=a.toUpperCase();for(let d of i)this.#s(l,this.#t,d)}}return this},this.use=(o,...s)=>{if(typeof o==="string")this.#t=o;else this.#t="*",s.unshift(o);return s.forEach((i)=>{this.#s("ALL",this.#t,i)}),this};let{strict:n,...r}=t;Object.assign(this,r),this.getPath=n??!0?t.getPath??ue:Oe}#e(){let t=new e({router:this.router,getPath:this.getPath});return t.errorHandler=this.errorHandler,t.#n=this.#n,t.routes=this.routes,t}#n=Ht;errorHandler=ze;route(t,n){let r=this.basePath(t);return n.routes.map((o)=>{let s;if(n.errorHandler===ze)s=o.handler;else s=async(i,c)=>(await he([],n.errorHandler)(i,()=>o.handler(i,c))).res,s[Fe]=o.handler;r.#s(o.method,o.path,s,o.basePath)}),this}basePath(t){let n=this.#e();return n._basePath=M(this._basePath,t),n}onError=(t)=>(this.errorHandler=t,this);notFound=(t)=>(this.#n=t,this);mount(t,n,r){let o,s;if(r)if(typeof r==="function")s=r;else if(s=r.optionHandler,r.replaceRequest===!1)o=(a)=>a;else o=r.replaceRequest;let i=s?(a)=>{let l=s(a);return Array.isArray(l)?l:[l]}:(a)=>{let l=void 0;try{l=a.executionCtx}catch{}return[a.env,l]};o||=(()=>{let a=M(this._basePath,t),l=a==="/"?0:a.length;return(d)=>{let m=new URL(d.url);return m.pathname=this.getPath(d).slice(l)||"/",new Request(m,d)}})();let c=async(a,l)=>{let d=await n(o(a.req.raw),...i(a));if(d)return d;await l()};return this.#s("ALL",M(t,"*"),c),this}#s(t,n,r,o){n=M(this._basePath,n);let s={basePath:o!==void 0?M(this._basePath,o):this._basePath,path:n,method:t,handler:r};this.router.add(t,n,[r,s]),this.routes.push(s)}#r(t,n){if(t instanceof Error)return this.errorHandler(t,n);throw t}#o(t,n,r,o){if(o==="HEAD")return(async()=>new Response(null,await this.#o(t,n,r,"GET")))();let s=this.getPath(t,{env:r}),i=this.router.match(o,s),c=new fe(t,{path:s,matchResult:i,env:r,executionCtx:n,notFoundHandler:this.#n});if(i[0].length===1){let l;try{l=i[0][0][0][0](c,async()=>{c.res=await this.#n(c)})}catch(d){return this.#r(d,c)}return l instanceof Promise?l.then((d)=>d||(c.finalized?c.res:this.#n(c))).catch((d)=>this.#r(d,c)):l??this.#n(c)}let a=he(i[0],this.errorHandler,this.#n);return(async()=>{try{let l=await a(c);if(!l.finalized)throw Error("Context is not finalized. Did you forget to return a Response object or `await next()`?");return l.res}catch(l){return this.#r(l,c)}})()}fetch=(t,...n)=>this.#o(t,n[1],n[0],t.method);request=(t,n,r,o)=>{if(t instanceof Request)return this.fetch(n?new Request(t,n):t,r,o);return t=t.toString(),this.fetch(new Request(/^https?:\/\//.test(t)?t:`http://localhost${M("/",t)}`,n),r,o)};fire=()=>{addEventListener("fetch",(t)=>{t.respondWith(this.#o(t.request,t,void 0,t.request.method))})}};var A=()=>Object.create(null);var re=[];function ge(e,t){let n=this.buildAllMatchers(),r=(o,s)=>{let i=n[o]||n.ALL,c=i[2][s];if(c)return c;let a=s.match(i[0]);if(!a)return[[],re];let l=a.indexOf("",1);return[i[1][l],a]};return this.match=r,r(e,t)}var be="[^/]+";var ye="(?:|/.*)",N=Symbol(),Ve=new Set(".\\+*[^]$()");function Ft(e,t){if(e.length===1)return t.length===1?e<t?-1:1:-1;if(t.length===1)return 1;if(e===".*"||e==="(?:|/.*)")return t==="(?:|/.*)"?-1:1;else if(t===".*"||t==="(?:|/.*)")return-1;if(e==="[^/]+")return 1;else if(t==="[^/]+")return-1;return e.length===t.length?e<t?-1:1:t.length-e.length}var Ge=class e{#t;#e;#n=A();insert(t,n,r,o,s){let i=this;for(let c=0,a=t.length;c<a;c++){let l=t[c],d=l.length===1?l==="*"?c===a-1?["","",".*"]:["","",be]:null:l==="/*"?["","",ye]:l.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/),m;if(d){let p=d[1],g=d[2]||"[^/]+";if(p&&d[2]){if(g===".*")throw N;if(g=g.replace(/^\((?!\?:)(?=[^)]+\)$)/,"(?:"),/\((?!\?:)/.test(g))throw N;if(g.length===1&&Ve.has(g))throw N}if(m=i.#n[g],!m){if(g!==".*"&&g!=="(?:|/.*)"){for(let U in i.#n)if((g.length>1||U.length>1)&&U!==".*"&&U!=="(?:|/.*)")throw N}m=i.#n[g]=new e}if(p!=="")m.#e??=o.varIndex++,r.push([p,m.#e])}else if(m=i.#n[l],!m){for(let p in i.#n)if(p.length>1&&p!==".*"&&p!=="(?:|/.*)")throw N;m=i.#n[l]=new e}i=m}if(i.#t!==void 0)throw N;i.#t=s?-1:n}buildRegExpStr(){let t=Object.keys(this.#n).sort(Ft).map((n)=>{let r=this.#n[n],o=r.buildRegExpStr();return o===""?"":(typeof r.#e==="number"?`(${n})@${r.#e}`:Ve.has(n)?`\\${n}`:n)+o}).filter(Boolean);if(typeof this.#t==="number"&&this.#t!==-1)t.unshift(`#${this.#t}`);if(t.length===0)return"";if(t.length===1)return t[0];return"(?:"+t.join("|")+")"}};var we=class{#t={varIndex:0};#e=new Ge;#n=0;paths=A();insert(e,t){if(t){this.#e.insert(e.split(""),0,[],this.#t,!0);return}let n=[],r=[],o=e;for(let i=0;;){let c=!1;if(o=o.replace(/\{[^}]+\}/g,(a)=>{let l=`@\\${i}`;return r[i]=[l,a],i++,c=!0,l}),!c)break}let s=o.match(/(?::[^\/]+)|(?:\/\*$)|./g)||[];for(let i=r.length-1;i>=0;i--){let[c]=r[i];for(let a=s.length-1;a>=0;a--)if(s[a].indexOf(c)!==-1){s[a]=s[a].replace(c,r[i][1]);break}}this.#e.insert(s,this.#n,n,this.#t,!1),this.paths[e]=[this.#n++,n]}buildRegExp(){let e=this.#e.buildRegExpStr();if(e==="")return[/^$/,[],[]];let t=0,n=[],r=[];return e=e.replace(/#(\d+)|@(\d+)|\.\*\$/g,(o,s,i)=>{if(s!==void 0)return n[++t]=Number(s),"$()";if(i!==void 0)return r[Number(i)]=++t,"";return""}),[new RegExp(`^${e}`),n,r]}};var Ke=A();function Qe(e){return Ke[e]??=new RegExp(`^${e.replace(/\/:[^/{}]+(?:\{\[\^\/]\+})?(?=[/{]|$)|\/?\*$|([.\\+*[^\]$()?{}|])/g,(t,n)=>n?`\\${n}`:t==="/*"?ye:t==="*"?".*":`/:${be}`)}$`)}function oe(e,t){for(let n of Object.keys(e).sort((r,o)=>o.length-r.length))if(Qe(n).test(t))return[...e[n]]}var se=class{name="RegExpRouter";#t;#e;#n;constructor(){this.#t={["ALL"]:A()},this.#e={["ALL"]:A()},this.#n={["ALL"]:new we}}#s(e,t){try{this.#n[e].insert(t,!/\*|\/:/.test(t))}catch(n){throw n===N?new ne(t):n}}add(e,t,n){let r=this.#t,o=this.#e;if(!r)throw Error(te);if(!r[e]){this.#n[e]=new we;for(let c of[r,o]){c[e]=A();for(let a in c.ALL)c[e][a]=[...c.ALL[a]],this.#s(e,a)}}if(t==="/*")t="*";let s=e==="ALL"?Object.keys(r):[e];if(/\*$/.test(t)){let c=Qe(t);for(let a of s)if(!r[a][t])this.#s(a,t),r[a][t]=oe(r[a],t)||oe(r.ALL,t)||[];for(let a of[r,o])for(let l of s)for(let d in a[l])c.test(d)&&a[l][d].push([n,t]);return}let i=Z(t)||[t];for(let c of i)for(let a of s){if(!o[a][c])this.#s(a,c),o[a][c]=oe(r[a],c)||oe(r.ALL,c)||[];o[a][c].push([n,c])}}match=ge;buildAllMatchers(){let e=A();for(let t of Object.keys(this.#e))e[t]=this.#r(t);return this.#t=this.#e=this.#n=void 0,Ke=A(),e}#r(e){let t=this.#t[e],n=this.#e[e],r=this.#n[e],o=A(),s=[],[i,c,a]=r.buildRegExp();for(let l of[t,n])for(let d in l){let m=l[d],p=r.paths[d];if(!p){o[d]=[m.map(([g])=>[g,A()]),re];continue}s[p[0]]=m.map(([g,U])=>[g,r.paths[U][1].reduceRight((w,[b],S)=>(w[b]=a[p[1][S][1]],w),A())])}return[i,c.map((l)=>s[l]),o]}};var Je=class{name="SmartRouter";#t=[];#e=[];constructor(e){this.#t=e.routers}add(e,t,n){if(!this.#e)throw Error(te);this.#e.push([e,t,n])}match(e,t){if(!this.#e)throw Error("Fatal error");let n=this.#t,r=this.#e,o=n.length,s=0,i;for(;s<o;s++){let c=n[s];try{for(let a=0,l=r.length;a<l;a++)c.add(...r[a]);i=c.match(e,t)}catch(a){if(a instanceof ne)continue;throw a}this.match=c.match.bind(c),this.#t=[c],this.#e=void 0;break}if(s===o)throw Error("Fatal error");return this.name=`SmartRouter + ${this.activeRouter.name}`,i}get activeRouter(){if(this.#e||this.#t.length!==1)throw Error("No active router has been determined yet.");return this.#t[0]}};var ve=A(),zt=0,Xe=class e{#t=[];#e=A();#n=[];#s;#r=ve;insert(t,n,r){let o=this,s=_e(n),i=new Set,c=0;for(let a of s){let l=s[++c],d=De(a,l)||(l===void 0&&a&&a.indexOf("*")===a.length-1?a:null),m=Array.isArray(d),p=m?d[0]:d||a,g=o.#e[p]||=new e;if(d&&!g.#s)g.#s=d,o.#n.push(g);if(o=g,m)i.add(d[1])}o.#t.push({[t]:{handler:r,possibleKeys:[...i],score:++zt}})}#o(t,n,r,o,s){for(let i=0,c=n.#t.length;i<c;i++){let a=n.#t[i],l=a[r]||a.ALL;if(l){l.params=A(),t.push(l);for(let d=0,m=l.possibleKeys.length;d<m;d++){let p=l.possibleKeys[d];l.params[p]=s?.[p]&&!d?s[p]:o[p]??s?.[p]}}}}search(t,n){let r=[];this.#r=ve;let o=[this],s=de(n),i=[],c=s.length,a=null;for(let l=0;l<c;l++){let d=s[l],m=l===c-1,p=[];for(let U=0,w=o.length;U<w;U++){let b=o[U],S=b.#e[d];if(S)if(S.#r=b.#r,m){if(S.#e["*"])this.#o(r,S.#e["*"],t,b.#r);this.#o(r,S,t,b.#r)}else p.push(S);for(let f of b.#n){let L=f.#s,h=b.#r===ve?{}:{...b.#r};if(typeof L==="string"){if(L==="*"||d.startsWith(L.slice(0,-1))){if(this.#o(r,f,t,b.#r),L==="*")f.#r=h,p.push(f)}continue}let[,I,R]=L;if(!d&&R===!0)continue;if(R!==!0){if(!a){a=[];let j=n[0]==="/"?1:0;for(let T=0;T<c;T++)a[T]=j,j+=s[T].length+1}let B=n.slice(a[l]),_=R.exec(B);if(_){if(h[I]=_[0],this.#o(r,f,t,b.#r,h),_[0].length===B.length&&f.#e["*"])this.#o(r,f.#e["*"],t,b.#r,h);for(let j in f.#e){f.#r=h;let T=_[0].match(/\//g)?.length??0;(i[T]||=[]).push(f);break}continue}}if(R===!0||R.test(d))if(h[I]=d,m){if(this.#o(r,f,t,h,b.#r),f.#e["*"])this.#o(r,f.#e["*"],t,h,b.#r)}else f.#r=h,p.push(f)}}let g=i.shift();o=g?p.concat(g):p}if(r[1])r.sort((l,d)=>l.score-d.score);return[r.map(({handler:l,params:d})=>[l,d])]}};var xe=class{name="TrieRouter";#t=new Xe;add(e,t,n){for(let r of Z(t)||[t])this.#t.insert(e,r,n)}match(e,t){return this.#t.search(e,t)}};var K=class extends We{constructor(e={}){super(e);this.router=e.router??new Je({routers:[new se,new xe]})}};function Wt(e,t=0){if(e.length<t+16)throw Error("Buffer too short for UUID");let n=[];for(let r=0;r<16;r++){let o=e[t+r];n.push((o<16?"0":"")+o.toString(16))}return[n.slice(0,4).join(""),n.slice(4,6).join(""),n.slice(6,8).join(""),n.slice(8,10).join(""),n.slice(10,16).join("")].join("-").toLowerCase()}function Ye(e){if(e.length<22)return null;let t=0,n=e[t++],r=Wt(e,t);t+=16;let o=e[t++];if(t+=o,e.length<t+4)return null;let s=e[t++],c=new DataView(e.buffer,e.byteOffset+t,2).getUint16(0,!1);t+=2;let a=e[t++],l="";if(a===1){if(e.length<t+4)return null;l=[e[t++],e[t++],e[t++],e[t++]].join(".")}else if(a===2){if(e.length<t+1)return null;let m=e[t++];if(e.length<t+m)return null;l=new TextDecoder().decode(e.subarray(t,t+m)),t+=m}else if(a===3){if(e.length<t+16)return null;let m=[],p=new DataView(e.buffer,e.byteOffset+t,16);for(let g=0;g<8;g++)m.push(p.getUint16(g*2,!1).toString(16));l=m.join(":"),t+=16}else return null;let d=e.subarray(t);return{version:n,uuid:r,command:s,port:c,addressType:a,address:l,rawPayload:d}}function Ze(){return new Uint8Array([0,0])}function Ee(e){let t=Math.floor(Date.now()/1000),n=e.expires_at!==null&&e.expires_at>0&&e.expires_at<t,r=e.quota_bytes>0&&e.used_bytes>=e.quota_bytes,o=e.enabled===1&&!n&&!r;return{id:e.id,name:e.name,uuid:e.uuid,sub_token:e.sub_token,enabled:e.enabled===1,quota_bytes:e.quota_bytes,used_bytes:e.used_bytes,expires_at:e.expires_at,note:e.note,created_at:e.created_at,is_active:o}}async function O(e,t){let n=await e.prepare("SELECT * FROM users WHERE id = ?").bind(t).first();return n?Ee(n):null}async function et(e,t){let n=await e.prepare("SELECT * FROM users WHERE sub_token = ?").bind(t).first();return n?Ee(n):null}async function tt(e,t={}){let n=t.limit&&t.limit>0?t.limit:50,r=t.offset&&t.offset>=0?t.offset:0,o=t.search?`%${t.search.trim()}%`:null,s="SELECT COUNT(*) as count FROM users",i="SELECT * FROM users",c=[];if(o)s+=" WHERE name LIKE ? OR note LIKE ? OR uuid LIKE ?",i+=" WHERE name LIKE ? OR note LIKE ? OR uuid LIKE ?",c.push(o,o,o);i+=" ORDER BY id DESC LIMIT ? OFFSET ?";let l=(await e.prepare(s).bind(...c).first())?.count??0;return{users:((await e.prepare(i).bind(...c,n,r).all()).results||[]).map(Ee),total:l}}async function nt(e){let t=Math.floor(Date.now()/1000),{results:n}=await e.prepare(`SELECT uuid FROM users 
       WHERE enabled = 1 
         AND (expires_at IS NULL OR expires_at = 0 OR expires_at > ?)
         AND (quota_bytes = 0 OR used_bytes < quota_bytes)`).bind(t).all(),r=new Set;if(n){for(let o of n)if(o.uuid)r.add(o.uuid.toLowerCase())}return r}async function rt(e,t){let n=(t.uuid||crypto.randomUUID()).toLowerCase(),r=t.sub_token||crypto.randomUUID().replace(/-/g,""),o=t.enabled===!1?0:1,s=t.quota_bytes&&t.quota_bytes>0?t.quota_bytes:0,i=t.expires_at??null,c=t.note??null,a=Math.floor(Date.now()/1000),d=(await e.prepare(`INSERT INTO users (name, uuid, sub_token, enabled, quota_bytes, used_bytes, expires_at, note, created_at)
       VALUES (?, ?, ?, ?, ?, 0, ?, ?, ?)`).bind(t.name.trim(),n,r,o,s,i,c,a).run()).meta?.last_row_id;if(!d)throw Error("Failed to insert user into database");let m=await O(e,d);if(!m)throw Error("Failed to retrieve created user");return m}async function ot(e,t,n){let r=[],o=[];if(n.name!==void 0)r.push("name = ?"),o.push(n.name.trim());if(n.enabled!==void 0)r.push("enabled = ?"),o.push(n.enabled?1:0);if(n.quota_bytes!==void 0)r.push("quota_bytes = ?"),o.push(Math.max(0,n.quota_bytes));if(n.expires_at!==void 0)r.push("expires_at = ?"),o.push(n.expires_at);if(n.note!==void 0)r.push("note = ?"),o.push(n.note);if(r.length===0)return O(e,t);return o.push(t),await e.prepare(`UPDATE users SET ${r.join(", ")} WHERE id = ?`).bind(...o).run(),O(e,t)}async function st(e,t,n){if(n<=0)return;await e.prepare("UPDATE users SET used_bytes = used_bytes + ? WHERE uuid = ?").bind(n,t.toLowerCase()).run()}async function at(e,t){return await e.prepare("UPDATE users SET used_bytes = 0 WHERE id = ?").bind(t).run(),O(e,t)}async function it(e,t,n){let r=(n||crypto.randomUUID()).toLowerCase();return await e.prepare("UPDATE users SET uuid = ? WHERE id = ?").bind(r,t).run(),O(e,t)}async function ct(e,t,n){let r=n||crypto.randomUUID().replace(/-/g,"");return await e.prepare("UPDATE users SET sub_token = ? WHERE id = ?").bind(r,t).run(),O(e,t)}async function lt(e,t){return((await e.prepare("DELETE FROM users WHERE id = ?").bind(t).run()).meta?.changes??0)>0}var F=null,Se=0,Vt=30000;async function dt(e){let t=Date.now();if(F!==null&&t<Se)return F;try{return F=await nt(e),Se=t+Vt,F}catch(n){if(F!==null)return F;throw n}}function W(){F=null,Se=0}function q(){return new Response(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Edge API Gateway | Status & Documentation</title>
  <style>
    :root {
      --bg: #0a0c10;
      --card-bg: #141721;
      --border: #242b3b;
      --text: #e1e7f0;
      --text-muted: #8b9bb4;
      --accent: #3b82f6;
      --success: #10b981;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background-color: var(--bg);
      color: var(--text);
      line-height: 1.6;
      padding: 2rem 1rem;
      display: flex;
      justify-content: center;
      min-height: 100vh;
    }
    .container {
      max-width: 720px;
      width: 100%;
    }
    header {
      margin-bottom: 2rem;
      border-bottom: 1px solid var(--border);
      padding-bottom: 1.5rem;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      background: rgba(16, 185, 129, 0.1);
      color: var(--success);
      padding: 0.25rem 0.6rem;
      border-radius: 9999px;
      font-size: 0.8rem;
      font-weight: 500;
      margin-bottom: 0.8rem;
    }
    .dot {
      width: 8px;
      height: 8px;
      background-color: var(--success);
      border-radius: 50%;
    }
    h1 {
      font-size: 1.75rem;
      font-weight: 600;
      letter-spacing: -0.02em;
      margin-bottom: 0.5rem;
    }
    p.lead {
      color: var(--text-muted);
      font-size: 1rem;
    }
    .card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 1.25rem;
      margin-bottom: 1.5rem;
    }
    .card h2 {
      font-size: 1.1rem;
      margin-bottom: 0.5rem;
    }
    .card p {
      color: var(--text-muted);
      font-size: 0.9rem;
    }
    code {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      background: rgba(255, 255, 255, 0.06);
      padding: 0.2rem 0.4rem;
      border-radius: 4px;
      font-size: 0.85rem;
    }
    footer {
      margin-top: 2rem;
      text-align: center;
      font-size: 0.8rem;
      color: var(--text-muted);
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <div class="badge"><span class="dot"></span> Operational</div>
      <h1>Global Edge Dispatcher</h1>
      <p class="lead">High-throughput HTTP/3 and WebSocket edge routing infrastructure.</p>
    </header>
    <main>
      <div class="card">
        <h2>Telemetry & Routing</h2>
        <p>Active nodes negotiate anycast peering via regional clusters. Direct client telemetry stream connections require mutual handshake authentication.</p>
      </div>
      <div class="card">
        <h2>Integration Specs</h2>
        <p>Endpoints enforce standard binary protocol encapsulation. For specification schemas and client libraries, refer to internal distribution channels.</p>
      </div>
    </main>
    <footer>
      &copy; 2026 CloudEdge Network Infrastructure &bull; All systems normal
    </footer>
  </div>
</body>
</html>`,{status:200,headers:{"Content-Type":"text/html; charset=utf-8","Cache-Control":"public, max-age=3600"}})}async function pt(){let e=await import("cloudflare:sockets");return e.connect}async function mt(e,t){let r=(await pt())({hostname:e,port:t});return{readable:r.readable,writable:r.writable,close:async()=>{try{await r.close()}catch{}}}}async function z(e,t){let n=new Uint8Array(t),r=0;while(r<t){let{value:o,done:s}=await e.read();if(s||!o)throw Error(`Connection closed before reading ${t} bytes`);let i=Math.min(o.length,t-r);if(n.set(o.subarray(0,i),r),r+=i,i<o.length);}return n}async function Kt(e,t,n,r,o,s){let c=(await pt())({hostname:n,port:r}),a=c.writable.getWriter(),l=c.readable.getReader();try{let d=!!(o&&s),m=d?new Uint8Array([5,2,0,2]):new Uint8Array([5,1,0]);await a.write(m);let p=await z(l,2);if(p[0]!==5)throw Error("Invalid SOCKS5 server version response");let g=p[1];if(g===2&&d){let f=new TextEncoder().encode(o),L=new TextEncoder().encode(s),h=new Uint8Array(3+f.length+L.length);h[0]=1,h[1]=f.length,h.set(f,2),h[2+f.length]=L.length,h.set(L,3+f.length),await a.write(h);let I=await z(l,2);if(I[0]!==1||I[1]!==0)throw Error("SOCKS5 authentication failed")}else if(g!==0)throw Error(`SOCKS5 method ${g} not supported`);let U=/^(\d{1,3}\.){3}\d{1,3}$/.test(e),w;if(U){let f=e.split(".").map(Number);w=new Uint8Array(10),w[0]=5,w[1]=1,w[2]=0,w[3]=1,w[4]=f[0],w[5]=f[1],w[6]=f[2],w[7]=f[3],new DataView(w.buffer).setUint16(8,t,!1)}else{let f=new TextEncoder().encode(e);w=new Uint8Array(5+f.length+2),w[0]=5,w[1]=1,w[2]=0,w[3]=3,w[4]=f.length,w.set(f,5),new DataView(w.buffer).setUint16(5+f.length,t,!1)}await a.write(w);let b=await z(l,4);if(b[0]!==5||b[1]!==0)throw Error(`SOCKS5 connect failed with reply code: ${b[1]}`);let S=b[3];if(S===1)await z(l,6);else if(S===3){let f=await z(l,1);await z(l,f[0]+2)}else if(S===4)await z(l,18);return a.releaseLock(),l.releaseLock(),{readable:c.readable,writable:c.writable,close:async()=>{try{await c.close()}catch{}}}}catch(d){a.releaseLock(),l.releaseLock();try{await c.close()}catch{}throw d}}async function ft(e,t,n){let r=null;try{r=await D(n)}catch{}if((r?.outbound_mode??"direct")==="socks5"&&r?.socks5_config?.host&&r?.socks5_config?.port)try{return await Kt(e,t,r.socks5_config.host,r.socks5_config.port,r.socks5_config.username,r.socks5_config.password)}catch(s){return console.warn("SOCKS5 outbound connection failed, falling back to direct:",s),mt(e,t)}return mt(e,t)}function Qt(e){if(!e)return null;try{let t=e.replace(/-/g,"+").replace(/_/g,"/"),n=t.length%4;if(n)t+="=".repeat(4-n);let r=atob(t),o=new Uint8Array(r.length);for(let s=0;s<r.length;s++)o[s]=r.charCodeAt(s);return o}catch{return null}}async function ht(e,t,n){let r=e.headers.get("Upgrade");if(!r||r.toLowerCase()!=="websocket")return q();let o=e.headers.get("sec-websocket-protocol"),s=Qt(o),i=new WebSocketPair,c=i[0],a=i[1];a.accept(),n.waitUntil((async()=>{let d=null,m="",p=0,g=0,U=!1,w=async()=>{if(U)return;if(U=!0,d){try{await d.close()}catch{}d=null}try{a.close()}catch{}let b=p+g;if(b>0&&m)try{await st(t.DB,m,b)}catch(S){console.error("Failed to update user traffic usage:",S)}};try{let b=s;if(!b)b=await new Promise((E)=>{let k=(v)=>{if(a.removeEventListener("message",k),a.removeEventListener("close",u),a.removeEventListener("error",y),v.data instanceof ArrayBuffer)E(v.data);else if(ArrayBuffer.isView(v.data))E(v.data);else E(null)},u=()=>E(null),y=()=>E(null);a.addEventListener("message",k),a.addEventListener("close",u),a.addEventListener("error",y)});if(!b){await w();return}let S=b instanceof Uint8Array?b:new Uint8Array(b),f=Ye(S);if(!f){await w();return}if(m=f.uuid,!(await dt(t.DB)).has(m.toLowerCase())){await w();return}let h=f.command===2&&f.port===53?"1.1.1.1":f.address,I=f.port,R=null;try{await Promise.resolve();R=await D(t.DB)}catch{}let B=!1;if(R?.outbound_mode==="backend"&&R.backend_config?.url)try{let k=(await fetch(R.backend_config.url,{headers:{Upgrade:"websocket"}})).webSocket;if(k){k.accept(),k.send(S),p+=S.byteLength;let u=!1,y=async()=>{if(u)return;u=!0;try{k.close()}catch{}await w()};a.addEventListener("message",(v)=>{if(u)return;let x=v.data,P=x instanceof ArrayBuffer?x.byteLength:ArrayBuffer.isView(x)?x.byteLength:0;p+=P,k.send(x)}),a.addEventListener("close",y),a.addEventListener("error",y),k.addEventListener("message",(v)=>{if(u)return;let x=v.data,P=x instanceof ArrayBuffer?x.byteLength:ArrayBuffer.isView(x)?x.byteLength:0;g+=P,a.send(x)}),k.addEventListener("close",y),k.addEventListener("error",y),B=!0;return}}catch(E){console.warn("Backend VPS forwarding failed, falling back to direct:",E)}try{d=await ft(h,I,t.DB)}catch(E){console.error(`Failed to connect to ${h}:${I}:`,E),await w();return}let _=d.writable.getWriter();if(f.rawPayload.byteLength>0)p+=f.rawPayload.byteLength,await _.write(f.rawPayload);a.addEventListener("message",async(E)=>{if(U)return;try{let k=null;if(E.data instanceof ArrayBuffer)k=new Uint8Array(E.data);else if(ArrayBuffer.isView(E.data))k=new Uint8Array(E.data.buffer,E.data.byteOffset,E.data.byteLength);if(k&&k.byteLength>0)p+=k.byteLength,await _.write(k)}catch(k){await w()}}),a.addEventListener("close",()=>{w()}),a.addEventListener("error",()=>{w()});let j=d.readable.getReader(),T=!0;while(!U){let{value:E,done:k}=await j.read();if(k||!E)break;if(g+=E.byteLength,a.bufferedAmount>131072)while(a.bufferedAmount>32768&&!U)await new Promise((u)=>setTimeout(u,20));if(T){T=!1;let u=Ze(),y=new Uint8Array(u.byteLength+E.byteLength);y.set(u,0),y.set(E,u.byteLength),a.send(y)}else a.send(E)}await w()}catch(b){console.error("Proxy session exception:",b),await w()}})());let l={};if(o)l["Sec-WebSocket-Protocol"]=o;return new Response(null,{status:101,webSocket:c,headers:l})}async function yt(e,t){if(e.byteLength!==t.byteLength)return!1;let n=0;for(let r=0;r<e.byteLength;r++)n|=e[r]^t[r];return n===0}async function ke(e,t){let n=new TextEncoder,r=await crypto.subtle.digest("SHA-256",n.encode(e)),o=await crypto.subtle.digest("SHA-256",n.encode(t));return yt(new Uint8Array(r),new Uint8Array(o))}async function wt(e){let t=new TextEncoder;return crypto.subtle.importKey("raw",t.encode(e),{name:"HMAC",hash:"SHA-256"},!1,["sign","verify"])}function gt(e){let t=typeof e==="string"?new TextEncoder().encode(e):e,n="";for(let r=0;r<t.length;r++)n+=String.fromCharCode(t[r]);return btoa(n).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}function bt(e){let t=e.replace(/-/g,"+").replace(/_/g,"/");while(t.length%4!==0)t+="=";let n=atob(t),r=new Uint8Array(n.length);for(let o=0;o<n.length;o++)r[o]=n.charCodeAt(o);return r}async function vt(e,t,n=604800){let r={u:e,exp:Math.floor(Date.now()/1000)+n},o=JSON.stringify(r),s=gt(o),i=await wt(t),c=await crypto.subtle.sign("HMAC",i,new TextEncoder().encode(s)),a=gt(new Uint8Array(c));return`${s}.${a}`}async function xt(e,t){let n=e.split(".");if(n.length!==2||!n[0]||!n[1])return null;let[r,o]=n;try{let s=await wt(t),i=await crypto.subtle.sign("HMAC",s,new TextEncoder().encode(r)),c=bt(o);if(!await yt(new Uint8Array(i),c))return null;let l=new TextDecoder().decode(bt(r)),d=JSON.parse(l),m=Math.floor(Date.now()/1000);if(d.exp<m)return null;return d}catch{return null}}var Q=new Map,Jt=5,Xt=900000,Et=900000;function St(e){let t=Date.now(),n=Q.get(e);if(!n)return{allowed:!0};if(n.lockedUntil>t)return{allowed:!1,retryAfterSeconds:Math.ceil((n.lockedUntil-t)/1000)};if(t-n.firstFailed>Et)return Q.delete(e),{allowed:!0};return{allowed:!0}}function kt(e){let t=Date.now(),n=Q.get(e);if(!n||t-n.firstFailed>Et){Q.set(e,{attempts:1,lockedUntil:0,firstFailed:t});return}if(n.attempts++,n.attempts>=Jt)n.lockedUntil=t+Xt}function Ut(e){Q.delete(e)}function J(e,t,n,r){return(t.length>0?t:[{label:"Default Edge",address:r,port:443,sni:r,host:r}]).map((s)=>{let i=s.address||r,c=s.port||443,a=s.sni||r,l=s.host||r,d=`${e.name} [${s.label}]`,m=new URLSearchParams({security:"tls",encryption:"none",type:"ws",headerType:"none",host:l,path:n,sni:a,fp:"chrome"}),p=`vless://${e.uuid}@${i}:${c}?${m.toString()}#${encodeURIComponent(d)}`;return{label:s.label,url:p}})}ce();ce();function tn(e){let t=new TextEncoder().encode(e),n="";for(let r=0;r<t.length;r++)n+=String.fromCharCode(t[r]);return btoa(n)}function At(e){if(!e||e===0)return"0 GB";return(e/1073741824).toFixed(2)+" GB"}async function Ct(e,t,n){if(!e||e.trim().length===0)return q();let r=await et(n.DB,e.trim());if(!r||!r.is_active)return q();let o=new URL(t.url),s=o.hostname,i=n.WS_PATH||"/api/v1/ws",c=await D(n.DB,s),l=J(r,c.endpoints,i,s).map((L)=>L.url).join(`
`),d=t.headers.get("User-Agent")||"",m=t.headers.get("Accept")||"",p=/v2ray|hiddify|sing-box|clash|shadowrocket|streisand|nekobox|karing|foxray/i.test(d),g=o.searchParams.get("raw")==="1",U=o.searchParams.get("b64")==="1",w=!p&&!g&&!U&&m.includes("text/html"),b=`${o.protocol}//${o.host}/sub/${r.sub_token}`;if(w){let L=ie(b,200),h=r.quota_bytes>0?At(r.quota_bytes):"نامحدود / Unlimited",I=At(r.used_bytes),R=r.expires_at?new Date(r.expires_at*1000).toLocaleDateString():"همیشگی / Never",B=`<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>اشتراک کاربر ${r.name} | Lumen Edge</title>
  <style>
    :root {
      --bg: #0b0f19;
      --card: #141c2e;
      --border: #222f4b;
      --text: #e2e8f0;
      --text-muted: #94a3b8;
      --primary: #3b82f6;
      --success: #10b981;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Vazirmatn", Tahoma, sans-serif;
      background: var(--bg);
      color: var(--text);
      line-height: 1.6;
      padding: 1.5rem 1rem;
      display: flex;
      justify-content: center;
      min-height: 100vh;
    }
    .container {
      max-width: 480px;
      width: 100%;
    }
    .card {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 1.5rem;
      margin-bottom: 1rem;
      text-align: center;
    }
    h1 { font-size: 1.35rem; margin-bottom: 0.25rem; }
    .badge {
      display: inline-block;
      padding: 0.2rem 0.6rem;
      border-radius: 9999px;
      font-size: 0.8rem;
      font-weight: 600;
      background: rgba(16, 185, 129, 0.15);
      color: var(--success);
      margin-bottom: 1rem;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.5rem;
      margin-bottom: 1.25rem;
      text-align: right;
    }
    .stat-box {
      background: rgba(0, 0, 0, 0.2);
      border: 1px solid var(--border);
      padding: 0.75rem;
      border-radius: 8px;
    }
    .stat-label { font-size: 0.75rem; color: var(--text-muted); }
    .stat-val { font-size: 0.95rem; font-weight: 600; margin-top: 0.2rem; }
    .qr-box {
      background: #ffffff;
      padding: 0.75rem;
      border-radius: 10px;
      display: inline-block;
      margin: 0.75rem auto;
    }
    .btn {
      display: block;
      width: 100%;
      padding: 0.75rem 1rem;
      border-radius: 8px;
      font-size: 0.95rem;
      font-weight: 600;
      text-decoration: none;
      margin-bottom: 0.6rem;
      cursor: pointer;
      border: none;
      transition: opacity 0.2s ease;
    }
    .btn-hiddify { background: #6366f1; color: #fff; }
    .btn-v2ray { background: #3b82f6; color: #fff; }
    .btn-singbox { background: #ec4899; color: #fff; }
    .btn-copy { background: #334155; color: #fff; }
    .btn:hover { opacity: 0.9; }
    .toast {
      position: fixed;
      bottom: 2rem;
      left: 50%;
      transform: translateX(-50%);
      background: var(--primary);
      color: #fff;
      padding: 0.6rem 1.2rem;
      border-radius: 8px;
      font-size: 0.9rem;
      display: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <h1>اشتراک اختصاصی ${r.name}</h1>
      <span class="badge">وضعیت: فعال (Active)</span>

      <div class="stats-grid">
        <div class="stat-box">
          <div class="stat-label">میزان مصرف</div>
          <div class="stat-val">${I}</div>
        </div>
        <div class="stat-box">
          <div class="stat-label">حجم مجاز</div>
          <div class="stat-val">${h}</div>
        </div>
        <div class="stat-box" style="grid-column: span 2;">
          <div class="stat-label">تاریخ انقضا</div>
          <div class="stat-val">${R}</div>
        </div>
      </div>

      <div class="qr-box">
        ${L}
      </div>
      <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 1.25rem;">
        بارکد را در نرم‌افزار خود اسکن کنید یا روی دکمه‌های زیر بزنید
      </p>

      <a href="hiddify://install-sub?url=${encodeURIComponent(b)}" class="btn btn-hiddify">
        افزودن به هیدیفای (Hiddify)
      </a>
      <a href="v2rayng://install-sub?url=${encodeURIComponent(b)}" class="btn btn-v2ray">
        افزودن به v2rayNG
      </a>
      <a href="sing-box://import-remote-profile?url=${encodeURIComponent(b)}" class="btn btn-singbox">
        افزودن به Sing-box
      </a>
      <button onclick="copySub()" class="btn btn-copy">
        کپی کردن لینک اشتراک (Copy URL)
      </button>
    </div>
  </div>

  <div id="toast" class="toast">لینک اشتراک با موفقیت کپی شد!</div>

  <script>
    function copySub() {
      navigator.clipboard.writeText("${b}").then(() => {
        const t = document.getElementById("toast");
        t.style.display = "block";
        setTimeout(() => t.style.display = "none", 2500);
      });
    }
  </script>
</body>
</html>`;return new Response(B,{status:200,headers:{"Content-Type":"text/html; charset=utf-8","Cache-Control":"no-cache, no-store, must-revalidate"}})}let S=g?l:tn(l),f={"Content-Type":"text/plain; charset=utf-8","Cache-Control":"no-cache, no-store, must-revalidate","Profile-Update-Interval":"24","Subscription-Userinfo":`upload=0; download=${r.used_bytes}; total=${r.quota_bytes}; expire=${r.expires_at??0}`};return new Response(S,{status:200,headers:f})}function Rt(e,t){return`<!DOCTYPE html>
<html lang="en" dir="ltr" data-theme="dark">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Lumen Edge | Admin Panel</title>
  <style>
    :root {
      --bg: #0c0f17;
      --card: #151a27;
      --card-hover: #1c2233;
      --border: #232c42;
      --text: #e6edf8;
      --text-muted: #8493ad;
      --primary: #3b82f6;
      --primary-hover: #2563eb;
      --success: #10b981;
      --warning: #f59e0b;
      --danger: #ef4444;
      --danger-hover: #dc2626;
      --input-bg: #090c14;
      --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Vazirmatn", Helvetica, Arial, sans-serif;
      --radius: 8px;
    }

    [data-theme="light"] {
      --bg: #f4f6fa;
      --card: #ffffff;
      --card-hover: #f9fafb;
      --border: #e2e8f0;
      --text: #0f172a;
      --text-muted: #64748b;
      --primary: #2563eb;
      --primary-hover: #1d4ed8;
      --input-bg: #f8fafc;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: var(--font-family);
      background-color: var(--bg);
      color: var(--text);
      line-height: 1.5;
      min-height: 100vh;
    }

    html[dir="rtl"] {
      text-align: right;
    }

    .container {
      max-width: 1100px;
      margin: 0 auto;
      padding: 1.5rem 1rem;
    }

    /* Top Navigation */
    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 0;
      margin-bottom: 1.5rem;
      border-bottom: 1px solid var(--border);
    }
    .logo-box {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      font-size: 1.25rem;
      font-weight: 700;
      letter-spacing: -0.02em;
    }
    .logo-badge {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: var(--primary);
      box-shadow: 0 0 10px var(--primary);
    }
    .nav-actions {
      display: flex;
      align-items: center;
      gap: 0.6rem;
    }

    /* Buttons */
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.4rem;
      padding: 0.5rem 0.9rem;
      font-size: 0.875rem;
      font-weight: 500;
      border-radius: var(--radius);
      border: 1px solid var(--border);
      background: var(--card);
      color: var(--text);
      cursor: pointer;
      transition: all 0.15s ease;
      text-decoration: none;
    }
    .btn:hover { background: var(--card-hover); }
    .btn-primary {
      background: var(--primary);
      border-color: var(--primary);
      color: #ffffff;
    }
    .btn-primary:hover { background: var(--primary-hover); }
    .btn-danger {
      background: transparent;
      border-color: var(--danger);
      color: var(--danger);
    }
    .btn-danger:hover { background: var(--danger); color: #fff; }
    .btn-sm { padding: 0.3rem 0.6rem; font-size: 0.8rem; }
    .btn-icon { padding: 0.4rem; }

    /* Tabs */
    .tabs {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
      border-bottom: 1px solid var(--border);
      padding-bottom: 0.5rem;
    }
    .tab-btn {
      padding: 0.5rem 1rem;
      background: none;
      border: none;
      border-bottom: 2px solid transparent;
      color: var(--text-muted);
      font-weight: 600;
      cursor: pointer;
      font-size: 0.95rem;
    }
    .tab-btn.active {
      color: var(--primary);
      border-bottom-color: var(--primary);
    }

    /* Cards */
    .card {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 1.25rem;
      margin-bottom: 1.25rem;
    }

    /* Table */
    .table-container {
      overflow-x: auto;
      border: 1px solid var(--border);
      border-radius: var(--radius);
      background: var(--card);
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.875rem;
    }
    th, td {
      padding: 0.75rem 1rem;
      text-align: left;
      border-bottom: 1px solid var(--border);
    }
    html[dir="rtl"] th, html[dir="rtl"] td {
      text-align: right;
    }
    th {
      background: rgba(0, 0, 0, 0.05);
      color: var(--text-muted);
      font-weight: 600;
    }
    tr:last-child td { border-bottom: none; }
    tr:hover td { background: var(--card-hover); }

    /* Progress bar */
    .progress-bar {
      width: 100%;
      height: 6px;
      background: var(--border);
      border-radius: 9999px;
      overflow: hidden;
      margin-top: 0.3rem;
    }
    .progress-fill {
      height: 100%;
      background: var(--primary);
      transition: width 0.3s ease;
    }
    .progress-fill.warning { background: var(--warning); }
    .progress-fill.danger { background: var(--danger); }

    /* Badges */
    .badge {
      display: inline-block;
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 600;
    }
    .badge-active { background: rgba(16, 185, 129, 0.15); color: var(--success); }
    .badge-disabled { background: rgba(100, 116, 139, 0.2); color: var(--text-muted); }
    .badge-expired { background: rgba(239, 68, 68, 0.15); color: var(--danger); }
    .badge-quota { background: rgba(245, 158, 11, 0.15); color: var(--warning); }

    /* Form Controls */
    .form-group {
      margin-bottom: 1rem;
    }
    .form-group label {
      display: block;
      font-size: 0.85rem;
      font-weight: 500;
      margin-bottom: 0.4rem;
      color: var(--text-muted);
    }
    .form-control {
      width: 100%;
      padding: 0.6rem 0.8rem;
      background: var(--input-bg);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      color: var(--text);
      font-size: 0.9rem;
    }
    .form-control:focus {
      outline: none;
      border-color: var(--primary);
    }

    /* Modal */
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.7);
      backdrop-filter: blur(2px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      z-index: 1000;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.2s ease;
    }
    .modal-overlay.open {
      opacity: 1;
      pointer-events: auto;
    }
    .modal-card {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      max-width: 500px;
      width: 100%;
      padding: 1.5rem;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
    }
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      border-bottom: 1px solid var(--border);
      padding-bottom: 0.75rem;
    }
    .modal-header h3 { font-size: 1.15rem; font-weight: 600; }
    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 0.6rem;
      margin-top: 1.25rem;
      border-top: 1px solid var(--border);
      padding-top: 0.75rem;
    }

    /* Toast */
    .toast {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      background: var(--primary);
      color: #fff;
      padding: 0.6rem 1.2rem;
      border-radius: var(--radius);
      font-size: 0.9rem;
      font-weight: 500;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.4);
      transform: translateY(100px);
      opacity: 0;
      transition: all 0.25s ease;
      z-index: 2000;
    }
    html[dir="rtl"] .toast {
      right: auto;
      left: 2rem;
    }
    .toast.show {
      transform: translateY(0);
      opacity: 1;
    }

    /* QR Code Display */
    .qr-container {
      display: flex;
      justify-content: center;
      padding: 1rem;
      background: #ffffff;
      border-radius: var(--radius);
      margin: 1rem 0;
    }
    .qr-container svg {
      width: 220px;
      height: 220px;
    }

    .hidden { display: none !important; }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <div class="logo-box">
        <div class="logo-badge"></div>
        <span>Lumen Edge</span>
      </div>
      <div class="nav-actions">
        <button class="btn btn-sm" id="btn-lang" onclick="toggleLanguage()">فا / EN</button>
        <button class="btn btn-sm" id="btn-theme" onclick="toggleTheme()">☀️ / \uD83C\uDF19</button>
        <button class="btn btn-sm btn-danger hidden" id="btn-logout" onclick="logout()" data-i18n="logout">Logout</button>
      </div>
    </header>

    <!-- Login View -->
    <div id="view-login" class="card" style="max-width: 400px; margin: 3rem auto;">
      <h2 style="margin-bottom: 1.25rem; font-size: 1.25rem;" data-i18n="loginTitle">Admin Authentication</h2>
      <div id="login-error" style="color: var(--danger); font-size: 0.85rem; margin-bottom: 1rem;" class="hidden"></div>
      <form onsubmit="handleLogin(event)">
        <div class="form-group">
          <label data-i18n="username">Username</label>
          <input type="text" id="login-username" class="form-control" required autocomplete="username">
        </div>
        <div class="form-group">
          <label data-i18n="password">Password</label>
          <input type="password" id="login-password" class="form-control" required autocomplete="current-password">
        </div>
        <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 0.5rem;" data-i18n="signIn">Sign In</button>
      </form>
    </div>

    <!-- Main Dashboard View -->
    <div id="view-dashboard" class="hidden">
      <div class="tabs">
        <button class="tab-btn active" id="tab-users" onclick="switchTab('users')" data-i18n="usersTab">Users</button>
        <button class="tab-btn" id="tab-settings" onclick="switchTab('settings')" data-i18n="settingsTab">Settings</button>
      </div>

      <!-- Users Tab Content -->
      <div id="content-users">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; gap: 0.5rem; flex-wrap: wrap;">
          <input type="text" id="search-input" class="form-control" style="max-width: 320px;" placeholder="Search users..." oninput="handleSearch(this.value)">
          <button class="btn btn-primary" onclick="openCreateUserModal()" data-i18n="addUser">+ Add User</button>
        </div>

        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th data-i18n="name">Name</th>
                <th data-i18n="status">Status</th>
                <th data-i18n="usage">Data Usage</th>
                <th data-i18n="expires">Expires</th>
                <th data-i18n="actions">Actions</th>
              </tr>
            </thead>
            <tbody id="users-tbody">
              <!-- Rendered via JS -->
            </tbody>
          </table>
        </div>
      </div>

      <!-- Settings Tab Content -->
      <div id="content-settings" class="hidden">
        <div class="card">
          <h3 style="margin-bottom: 1rem;" data-i18n="endpointsTitle">Endpoints & Clean IPs</h3>
          <p style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 1rem;" data-i18n="endpointsDesc">
            Configure custom addresses (e.g. clean Cloudflare IPs or custom domain names) for generating optimized client configs.
          </p>
          <div id="endpoints-list" style="margin-bottom: 1rem;"></div>
          <button class="btn btn-sm" onclick="addEndpointRow()" data-i18n="addEndpoint">+ Add Endpoint</button>
        </div>

        <div class="card">
          <h3 style="margin-bottom: 1rem;" data-i18n="outboundTitle">Outbound Proxy Mode</h3>
          <div class="form-group">
            <label data-i18n="mode">Egress Mode</label>
            <select id="setting-outbound-mode" class="form-control" onchange="toggleOutboundInputs(this.value)">
              <option value="direct">Direct (Edge Egress)</option>
              <option value="socks5">SOCKS5 Proxy Tunnel</option>
              <option value="backend">Backend VPS Forwarding</option>
            </select>
          </div>

          <div id="socks5-fields" class="hidden" style="border-top: 1px solid var(--border); padding-top: 1rem; margin-top: 1rem;">
            <h4 style="margin-bottom: 0.5rem; font-size: 0.95rem;">SOCKS5 Configuration</h4>
            <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 0.5rem;">
              <div class="form-group">
                <label>Host / IP</label>
                <input type="text" id="socks5-host" class="form-control" placeholder="1.2.3.4">
              </div>
              <div class="form-group">
                <label>Port</label>
                <input type="number" id="socks5-port" class="form-control" placeholder="1080">
              </div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem;">
              <div class="form-group">
                <label>Username (Optional)</label>
                <input type="text" id="socks5-user" class="form-control">
              </div>
              <div class="form-group">
                <label>Password (Optional)</label>
                <input type="password" id="socks5-pass" class="form-control">
              </div>
            </div>
          </div>

          <div id="backend-fields" class="hidden" style="border-top: 1px solid var(--border); padding-top: 1rem; margin-top: 1rem;">
            <h4 style="margin-bottom: 0.5rem; font-size: 0.95rem;">Backend VPS Configuration</h4>
            <div class="form-group">
              <label>Backend URL</label>
              <input type="url" id="backend-url" class="form-control" placeholder="https://vps.example.com/ws">
            </div>
          </div>

          <button class="btn btn-primary" onclick="saveSettings()" style="margin-top: 1rem;" data-i18n="saveSettings">Save Settings</button>
        </div>
      </div>
    </div>
  </div>

  <!-- User Modal (Create / Edit) -->
  <div class="modal-overlay" id="modal-user">
    <div class="modal-card">
      <div class="modal-header">
        <h3 id="modal-user-title" data-i18n="addUser">User Details</h3>
        <button class="btn btn-sm btn-icon" onclick="closeModal('modal-user')">&times;</button>
      </div>
      <form onsubmit="handleSaveUser(event)">
        <input type="hidden" id="user-id">
        <div class="form-group">
          <label data-i18n="name">Name</label>
          <input type="text" id="user-name" class="form-control" required>
        </div>
        <div class="form-group">
          <label data-i18n="quotaGb">Quota (GB, 0 for unlimited)</label>
          <input type="number" step="0.1" min="0" id="user-quota" class="form-control" value="0">
        </div>
        <div class="form-group">
          <label data-i18n="expiryDate">Expiry Date (optional)</label>
          <input type="date" id="user-expiry" class="form-control">
        </div>
        <div class="form-group">
          <label data-i18n="note">Note / Remarks</label>
          <input type="text" id="user-note" class="form-control" placeholder="e.g. Phone, friend, location">
        </div>
        <div class="modal-footer">
          <button type="button" class="btn" onclick="closeModal('modal-user')" data-i18n="cancel">Cancel</button>
          <button type="submit" class="btn btn-primary" data-i18n="save">Save</button>
        </div>
      </form>
    </div>
  </div>

  <!-- QR & Share Link Modal -->
  <div class="modal-overlay" id="modal-qr">
    <div class="modal-card">
      <div class="modal-header">
        <h3 id="modal-qr-title" data-i18n="shareConfig">Share Connection</h3>
        <button class="btn btn-sm btn-icon" onclick="closeModal('modal-qr')">&times;</button>
      </div>
      <div class="form-group">
        <label data-i18n="selectEndpoint">Endpoint</label>
        <select id="qr-endpoint-select" class="form-control" onchange="renderSelectedLink()"></select>
      </div>

      <div class="qr-container" id="qr-svg-box">
        <!-- SVG QR code rendered here -->
      </div>

      <div class="form-group">
        <label data-i18n="vlessLink">VLESS Link</label>
        <div style="display: flex; gap: 0.4rem;">
          <input type="text" id="qr-vless-url" class="form-control" readonly>
          <button class="btn btn-sm" onclick="copyInput('qr-vless-url')" data-i18n="copy">Copy</button>
        </div>
      </div>

      <div class="form-group">
        <label data-i18n="subLink">Subscription URL</label>
        <div style="display: flex; gap: 0.4rem;">
          <input type="text" id="qr-sub-url" class="form-control" readonly>
          <button class="btn btn-sm" onclick="copyInput('qr-sub-url')" data-i18n="copy">Copy</button>
        </div>
      </div>

      <div class="modal-footer">
        <button type="button" class="btn" onclick="closeModal('modal-qr')" data-i18n="close">Close</button>
      </div>
    </div>
  </div>

  <!-- Toast Notification -->
  <div id="toast" class="toast"></div>

  <script>
    // --- Internationalization & Translations ---
    const I18N = {
      en: {
        logout: "Logout",
        loginTitle: "Admin Authentication",
        username: "Username",
        password: "Password",
        signIn: "Sign In",
        usersTab: "Users",
        settingsTab: "Settings",
        addUser: "Add User",
        name: "Name",
        status: "Status",
        usage: "Data Usage",
        expires: "Expires",
        actions: "Actions",
        endpointsTitle: "Endpoints & Clean IPs",
        endpointsDesc: "Configure custom addresses (e.g. clean Cloudflare IPs or custom domain names) for generating client configs.",
        addEndpoint: "+ Add Endpoint",
        outboundTitle: "Outbound Proxy Mode",
        mode: "Egress Mode",
        saveSettings: "Save Settings",
        quotaGb: "Quota (GB, 0 for unlimited)",
        expiryDate: "Expiry Date (optional)",
        note: "Note / Remarks",
        cancel: "Cancel",
        save: "Save",
        shareConfig: "Share Connection",
        selectEndpoint: "Endpoint",
        vlessLink: "VLESS Link",
        subLink: "Subscription URL",
        close: "Close",
        active: "Active",
        disabled: "Disabled",
        expired: "Expired",
        overQuota: "Over Quota",
        copied: "Copied to clipboard!",
        unlimited: "Unlimited",
        never: "Never",
        confirmDelete: "Are you sure you want to delete this user?",
        resetUsageConfirm: "Reset used traffic for this user?",
        regenUuidConfirm: "Regenerate UUID? Old links will stop working.",
        regenSubConfirm: "Regenerate subscription token? Old subscription links will stop working."
      },
      fa: {
        logout: "خروج",
        loginTitle: "ورود به پنل مدیریت",
        username: "نام کاربری",
        password: "رمز عبور",
        signIn: "ورود",
        usersTab: "کاربران",
        settingsTab: "تنظیمات",
        addUser: "افزودن کاربر",
        name: "نام",
        status: "وضعیت",
        usage: "میزان مصرف",
        expires: "تاریخ انقضا",
        actions: "عملیات",
        endpointsTitle: "اندپوینت‌ها و آی‌پی تمیز",
        endpointsDesc: "آدرس‌های اختصاصی و آی‌پی‌های تمیز کلودفلر را برای اتصال بهینه کاربران ثبت کنید.",
        addEndpoint: "+ افزودن اندپوینت",
        outboundTitle: "حالت خروجی پروکسی",
        mode: "نوع خروجی اینترنت",
        saveSettings: "ذخیره تنظیمات",
        quotaGb: "حجم مجاز (گیگابایت، ۰ یعنی نامحدود)",
        expiryDate: "تاریخ انقضا (اختیاری)",
        note: "یادداشت / توضیحات",
        cancel: "انصراف",
        save: "ذخیره",
        shareConfig: "اشتراک‌گذاری اتصال",
        selectEndpoint: "انتخاب اندپوینت",
        vlessLink: "لینک VLESS",
        subLink: "لینک اشتراک",
        close: "بستن",
        active: "فعال",
        disabled: "غیرفعال",
        expired: "منقضی شده",
        overQuota: "پایان حجم",
        copied: "کپی شد!",
        unlimited: "نامحدود",
        never: "نامحدود",
        confirmDelete: "آیا از حذف این کاربر اطمینان دارید؟",
        resetUsageConfirm: "آیا میزان مصرف این کاربر صفر شود؟",
        regenUuidConfirm: "شناسه UUID جدید ایجاد شود؟ لینک‌های قبلی از کار خواهند افتاد.",
        regenSubConfirm: "توکن اشتراک جدید ایجاد شود؟ لینک اشتراک قبلی از کار خواهد افتاد."
      }
    };

    let currentLang = localStorage.getItem("lumen_lang") || "en";
    let currentTheme = localStorage.getItem("lumen_theme") || "dark";
    let currentUserLinks = [];
    let currentActiveUser = null;
    let globalSettings = { endpoints: [], outbound_mode: "direct" };

    function applyLanguage(lang) {
      currentLang = lang;
      localStorage.setItem("lumen_lang", lang);
      document.documentElement.dir = lang === "fa" ? "rtl" : "ltr";
      document.documentElement.lang = lang;

      const dict = I18N[lang] || I18N.en;
      document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        if (dict[key]) el.textContent = dict[key];
      });
      document.getElementById("search-input").placeholder = lang === "fa" ? "جستجوی کاربر..." : "Search users...";
    }

    function toggleLanguage() {
      applyLanguage(currentLang === "en" ? "fa" : "en");
      renderUsers();
    }

    function applyTheme(theme) {
      currentTheme = theme;
      localStorage.setItem("lumen_theme", theme);
      document.documentElement.setAttribute("data-theme", theme);
    }

    function toggleTheme() {
      applyTheme(currentTheme === "dark" ? "light" : "dark");
    }

    function showToast(msg) {
      const toast = document.getElementById("toast");
      toast.textContent = msg;
      toast.classList.add("show");
      setTimeout(() => toast.classList.remove("show"), 2500);
    }

    function copyInput(id) {
      const el = document.getElementById(id);
      el.select();
      navigator.clipboard.writeText(el.value).then(() => {
        showToast(I18N[currentLang].copied);
      });
    }

    // --- State & Navigation ---
    let usersList = [];

    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          showDashboard();
        } else {
          showLogin();
        }
      } catch {
        showLogin();
      }
    }

    function showLogin() {
      document.getElementById("view-login").classList.remove("hidden");
      document.getElementById("view-dashboard").classList.add("hidden");
      document.getElementById("btn-logout").classList.add("hidden");
    }

    function showDashboard() {
      document.getElementById("view-login").classList.add("hidden");
      document.getElementById("view-dashboard").classList.remove("hidden");
      document.getElementById("btn-logout").classList.remove("hidden");
      loadUsers();
      loadSettings();
    }

    async function handleLogin(e) {
      e.preventDefault();
      const username = document.getElementById("login-username").value;
      const password = document.getElementById("login-password").value;
      const errBox = document.getElementById("login-error");
      errBox.classList.add("hidden");

      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password })
        });
        const data = await res.json();
        if (res.ok) {
          showDashboard();
        } else {
          errBox.textContent = data.error || "Login failed";
          errBox.classList.remove("hidden");
        }
      } catch (err) {
        errBox.textContent = "Network error. Try again.";
        errBox.classList.remove("hidden");
      }
    }

    async function logout() {
      await fetch("/api/auth/logout", { method: "POST" });
      showLogin();
    }

    function switchTab(tab) {
      if (tab === "users") {
        document.getElementById("tab-users").classList.add("active");
        document.getElementById("tab-settings").classList.remove("active");
        document.getElementById("content-users").classList.remove("hidden");
        document.getElementById("content-settings").classList.add("hidden");
      } else {
        document.getElementById("tab-settings").classList.add("active");
        document.getElementById("tab-users").classList.remove("active");
        document.getElementById("content-settings").classList.remove("hidden");
        document.getElementById("content-users").classList.add("hidden");
      }
    }

    // --- Users Management ---
    async function loadUsers() {
      const search = document.getElementById("search-input").value;
      const q = search ? "?search=" + encodeURIComponent(search) : "";
      try {
        const res = await fetch("/api/users" + q);
        if (res.ok) {
          const data = await res.json();
          usersList = data.users || [];
          renderUsers();
        }
      } catch (err) {
        console.error("Failed to load users:", err);
      }
    }

    function handleSearch() {
      loadUsers();
    }

    function formatBytes(bytes) {
      if (!bytes || bytes === 0) return "0 B";
      const units = ["B", "KB", "MB", "GB", "TB"];
      const i = Math.floor(Math.log(bytes) / Math.log(1024));
      return (bytes / Math.pow(1024, i)).toFixed(2) + " " + units[i];
    }

    function renderUsers() {
      const tbody = document.getElementById("users-tbody");
      tbody.innerHTML = "";
      const dict = I18N[currentLang];

      if (usersList.length === 0) {
        tbody.innerHTML = "<tr><td colspan='5' style='text-align:center; color:var(--text-muted); padding:2rem;'>No users found</td></tr>";
        return;
      }

      usersList.forEach(u => {
        const tr = document.createElement("tr");

        let statusBadge = '<span class="badge badge-active">' + dict.active + '</span>';
        const now = Math.floor(Date.now() / 1000);
        if (!u.enabled) {
          statusBadge = '<span class="badge badge-disabled">' + dict.disabled + '</span>';
        } else if (u.expires_at && u.expires_at < now) {
          statusBadge = '<span class="badge badge-expired">' + dict.expired + '</span>';
        } else if (u.quota_bytes > 0 && u.used_bytes >= u.quota_bytes) {
          statusBadge = '<span class="badge badge-quota">' + dict.overQuota + '</span>';
        }

        // Usage percentage
        let percent = 0;
        let fillClass = "";
        if (u.quota_bytes > 0) {
          percent = Math.min(100, Math.round((u.used_bytes / u.quota_bytes) * 100));
          if (percent > 90) fillClass = "danger";
          else if (percent > 75) fillClass = "warning";
        }
        const usageText = formatBytes(u.used_bytes) + " / " + (u.quota_bytes > 0 ? formatBytes(u.quota_bytes) : dict.unlimited);

        // Expiry text
        const expiryText = u.expires_at ? new Date(u.expires_at * 1000).toLocaleDateString() : dict.never;

        tr.innerHTML = \`
          <td>
            <div style="font-weight:600;">\${escapeHtml(u.name)}</div>
            <div style="font-size:0.75rem; color:var(--text-muted);">\${escapeHtml(u.note || "")}</div>
          </td>
          <td>\${statusBadge}</td>
          <td style="min-width: 140px;">
            <div style="font-size:0.8rem;">\${usageText}</div>
            \${u.quota_bytes > 0 ? '<div class="progress-bar"><div class="progress-fill ' + fillClass + '" style="width:' + percent + '%"></div></div>' : ''}
          </td>
          <td>\${expiryText}</td>
          <td>
            <div style="display:flex; gap:0.3rem; flex-wrap:wrap;">
              <button class="btn btn-sm btn-primary" onclick="openShareModal(\${u.id})">\uD83D\uDD17</button>
              <button class="btn btn-sm" onclick="toggleUserStatus(\${u.id}, \${!u.enabled})">\${u.enabled ? '⏸' : '▶'}</button>
              <button class="btn btn-sm" onclick="openEditUserModal(\${u.id})">✏️</button>
              <button class="btn btn-sm btn-danger" onclick="deleteUserPrompt(\${u.id})">\uD83D\uDDD1️</button>
            </div>
          </td>
        \`;
        tbody.appendChild(tr);
      });
    }

    function escapeHtml(str) {
      return (str || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }

    // Modal helpers
    function openModal(id) {
      document.getElementById(id).classList.add("open");
    }
    function closeModal(id) {
      document.getElementById(id).classList.remove("open");
    }

    function openCreateUserModal() {
      document.getElementById("modal-user-title").textContent = I18N[currentLang].addUser;
      document.getElementById("user-id").value = "";
      document.getElementById("user-name").value = "";
      document.getElementById("user-quota").value = "0";
      document.getElementById("user-expiry").value = "";
      document.getElementById("user-note").value = "";
      openModal("modal-user");
    }

    function openEditUserModal(id) {
      const user = usersList.find(u => u.id === id);
      if (!user) return;
      document.getElementById("modal-user-title").textContent = "Edit " + user.name;
      document.getElementById("user-id").value = user.id;
      document.getElementById("user-name").value = user.name;
      document.getElementById("user-quota").value = user.quota_bytes > 0 ? (user.quota_bytes / (1024 * 1024 * 1024)).toFixed(1) : "0";
      if (user.expires_at) {
        const d = new Date(user.expires_at * 1000);
        document.getElementById("user-expiry").value = d.toISOString().split("T")[0];
      } else {
        document.getElementById("user-expiry").value = "";
      }
      document.getElementById("user-note").value = user.note || "";
      openModal("modal-user");
    }

    async function handleSaveUser(e) {
      e.preventDefault();
      const id = document.getElementById("user-id").value;
      const name = document.getElementById("user-name").value;
      const quotaGb = parseFloat(document.getElementById("user-quota").value) || 0;
      const quota_bytes = Math.round(quotaGb * 1024 * 1024 * 1024);
      const expiryVal = document.getElementById("user-expiry").value;
      const expires_at = expiryVal ? Math.floor(new Date(expiryVal).getTime() / 1000) : null;
      const note = document.getElementById("user-note").value;

      const payload = { name, quota_bytes, expires_at, note };

      try {
        const res = await fetch(id ? "/api/users/" + id : "/api/users", {
          method: id ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          closeModal("modal-user");
          loadUsers();
          showToast(I18N[currentLang].saved || "User saved!");
        } else {
          const err = await res.json();
          alert(err.error || "Save failed");
        }
      } catch (err) {
        alert("Network error");
      }
    }

    async function toggleUserStatus(id, enabled) {
      await fetch("/api/users/" + id, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled })
      });
      loadUsers();
    }

    async function deleteUserPrompt(id) {
      if (confirm(I18N[currentLang].confirmDelete)) {
        await fetch("/api/users/" + id, { method: "DELETE" });
        loadUsers();
      }
    }

    // --- Share / QR Modal ---
    async function openShareModal(id) {
      try {
        const res = await fetch("/api/users/" + id);
        if (!res.ok) return;
        const data = await res.json();
        currentActiveUser = data.user;
        currentUserLinks = data.links || [];

        const select = document.getElementById("qr-endpoint-select");
        select.innerHTML = "";
        currentUserLinks.forEach((l, idx) => {
          const opt = document.createElement("option");
          opt.value = idx;
          opt.textContent = l.label;
          select.appendChild(opt);
        });

        const subUrl = window.location.origin + "/sub/" + currentActiveUser.sub_token;
        document.getElementById("qr-sub-url").value = subUrl;

        renderSelectedLink();
        openModal("modal-qr");
      } catch (err) {
        console.error(err);
      }
    }

    function renderSelectedLink() {
      const select = document.getElementById("qr-endpoint-select");
      const idx = parseInt(select.value) || 0;
      const link = currentUserLinks[idx] ? currentUserLinks[idx].url : "";
      document.getElementById("qr-vless-url").value = link;

      // Render QR code
      const qrBox = document.getElementById("qr-svg-box");
      qrBox.innerHTML = "";
      if (link) {
        // Generate QR code using inline generator
        qrBox.innerHTML = generateQrSvgClient(link, 220);
      }
    }

    // Minimal In-Browser SVG QR code generator (identical mathematical formulation)
    function generateQrSvgClient(text, size) {
      return \`<img src="/api/users/\${currentActiveUser.id}/qr?link_index=\${document.getElementById("qr-endpoint-select").value || 0}" width="\${size}" height="\${size}" alt="QR Code">\`;
    }

    // --- Settings Management ---
    async function loadSettings() {
      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          globalSettings = await res.json();
          document.getElementById("setting-outbound-mode").value = globalSettings.outbound_mode || "direct";
          toggleOutboundInputs(globalSettings.outbound_mode);

          if (globalSettings.socks5_config) {
            document.getElementById("socks5-host").value = globalSettings.socks5_config.host || "";
            document.getElementById("socks5-port").value = globalSettings.socks5_config.port || "";
            document.getElementById("socks5-user").value = globalSettings.socks5_config.username || "";
            document.getElementById("socks5-pass").value = globalSettings.socks5_config.password || "";
          }

          if (globalSettings.backend_config) {
            document.getElementById("backend-url").value = globalSettings.backend_config.url || "";
          }

          renderEndpointsList();
        }
      } catch (err) {
        console.error(err);
      }
    }

    function toggleOutboundInputs(mode) {
      document.getElementById("socks5-fields").classList.toggle("hidden", mode !== "socks5");
      document.getElementById("backend-fields").classList.toggle("hidden", mode !== "backend");
    }

    function renderEndpointsList() {
      const container = document.getElementById("endpoints-list");
      container.innerHTML = "";
      const endpoints = globalSettings.endpoints || [];

      endpoints.forEach((ep, idx) => {
        const row = document.createElement("div");
        row.style.cssText = "display:grid; grid-template-columns: 2fr 3fr 1fr 2fr 1fr; gap:0.4rem; margin-bottom:0.5rem; align-items:center;";
        row.innerHTML = \`
          <input type="text" class="form-control form-control-sm" placeholder="Label" value="\${escapeHtml(ep.label)}" onchange="updateEndpointField(\${idx}, 'label', this.value)">
          <input type="text" class="form-control form-control-sm" placeholder="Address/IP" value="\${escapeHtml(ep.address)}" onchange="updateEndpointField(\${idx}, 'address', this.value)">
          <input type="number" class="form-control form-control-sm" placeholder="Port" value="\${ep.port || 443}" onchange="updateEndpointField(\${idx}, 'port', parseInt(this.value))">
          <input type="text" class="form-control form-control-sm" placeholder="SNI / Host" value="\${escapeHtml(ep.sni || '')}" onchange="updateEndpointField(\${idx}, 'sni', this.value)">
          <button class="btn btn-sm btn-danger" onclick="removeEndpointRow(\${idx})">&times;</button>
        \`;
        container.appendChild(row);
      });
    }

    function updateEndpointField(idx, field, val) {
      if (globalSettings.endpoints[idx]) {
        globalSettings.endpoints[idx][field] = val;
        if (field === "sni") {
          globalSettings.endpoints[idx]["host"] = val;
        }
      }
    }

    function addEndpointRow() {
      if (!globalSettings.endpoints) globalSettings.endpoints = [];
      globalSettings.endpoints.push({
        label: "Node " + (globalSettings.endpoints.length + 1),
        address: window.location.hostname,
        port: 443,
        sni: window.location.hostname,
        host: window.location.hostname
      });
      renderEndpointsList();
    }

    function removeEndpointRow(idx) {
      globalSettings.endpoints.splice(idx, 1);
      renderEndpointsList();
    }

    async function saveSettings() {
      const mode = document.getElementById("setting-outbound-mode").value;
      const socks5_config = {
        host: document.getElementById("socks5-host").value.trim(),
        port: parseInt(document.getElementById("socks5-port").value) || 1080,
        username: document.getElementById("socks5-user").value.trim() || undefined,
        password: document.getElementById("socks5-pass").value || undefined,
      };
      const backend_config = {
        url: document.getElementById("backend-url").value.trim(),
      };

      const payload = {
        outbound_mode: mode,
        endpoints: globalSettings.endpoints,
        socks5_config,
        backend_config
      };

      try {
        const res = await fetch("/api/settings", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          showToast(I18N[currentLang].saveSettings + " - OK!");
        } else {
          alert("Failed to save settings");
        }
      } catch {
        alert("Network error");
      }
    }

    // Initialize UI
    applyLanguage(currentLang);
    applyTheme(currentTheme);
    checkAuth();
  </script>
</body>
</html>`}var Ae="lumen_session";function nn(e,t){let n=e.headers.get("Cookie");if(!n)return null;let r=n.split(";");for(let o of r){let[s,i]=o.trim().split("=");if(s===t&&i)return decodeURIComponent(i)}return null}function rn(e){return e.headers.get("CF-Connecting-IP")||e.headers.get("X-Forwarded-For")?.split(",")[0]?.trim()||"127.0.0.1"}var C=new K;C.use("/api/*",async(e,t)=>{let n=e.req.path;if(n==="/api/auth/login"||n==="/api/auth/logout")return t();let r=e.env.SESSION_SECRET||"lumen-default-secret-change-me",o=nn(e.req.raw,Ae);if(!o)return e.json({error:"Unauthorized"},401);let s=await xt(o,r);if(!s)return e.json({error:"Unauthorized"},401);e.set("jwtPayload",s),await t()});C.post("/api/auth/login",async(e)=>{let t=rn(e.req.raw),n=St(t);if(!n.allowed)return e.json({error:`Too many failed attempts. Try again in ${n.retryAfterSeconds}s.`},429);let r;try{r=await e.req.json()}catch{return e.json({error:"Invalid JSON"},400)}let o=e.env.ADMIN_USERNAME||"admin",s=e.env.ADMIN_PASSWORD||"lumenadmin",i=e.env.SESSION_SECRET||"lumen-default-secret-change-me",c=await ke(r.username||"",o),a=await ke(r.password||"",s);if(!c||!a)return kt(t),e.json({error:"Invalid username or password"},401);Ut(t);let l=await vt(o,i),d=new URL(e.req.url).protocol==="https:",m=[`${Ae}=${encodeURIComponent(l)}`,"Path=/","HttpOnly","SameSite=Strict","Max-Age=604800"];if(d)m.push("Secure");return e.json({success:!0,username:o},200,{"Set-Cookie":m.join("; ")})});C.post("/api/auth/logout",(e)=>{let t=new URL(e.req.url).protocol==="https:",n=[`${Ae}=`,"Path=/","HttpOnly","SameSite=Strict","Max-Age=0"];if(t)n.push("Secure");return e.json({success:!0},200,{"Set-Cookie":n.join("; ")})});C.get("/api/auth/me",(e)=>{let t=e.env.ADMIN_USERNAME||"admin";return e.json({authenticated:!0,username:t})});C.get("/api/users",async(e)=>{let t=e.req.query("search")||void 0,n=e.req.query("limit")?Number(e.req.query("limit")):50,r=e.req.query("offset")?Number(e.req.query("offset")):0,o=await tt(e.env.DB,{search:t,limit:n,offset:r});return e.json(o)});C.post("/api/users",async(e)=>{let t;try{t=await e.req.json()}catch{return e.json({error:"Invalid JSON"},400)}if(!t.name||typeof t.name!=="string"||t.name.trim().length===0)return e.json({error:"User name is required"},400);try{let n=await rt(e.env.DB,{name:t.name.trim(),quota_bytes:typeof t.quota_bytes==="number"?t.quota_bytes:0,expires_at:typeof t.expires_at==="number"?t.expires_at:null,note:typeof t.note==="string"?t.note.trim():null,enabled:t.enabled!==!1});return W(),e.json(n,201)}catch(n){return e.json({error:n.message},500)}});C.get("/api/users/:id",async(e)=>{let t=Number(e.req.param("id"));if(isNaN(t))return e.json({error:"Invalid user ID"},400);let n=await O(e.env.DB,t);if(!n)return e.json({error:"User not found"},404);let o=new URL(e.req.url).hostname,s=e.env.WS_PATH||"/api/v1/ws",i=await D(e.env.DB,o),c=J(n,i.endpoints,s,o);return e.json({user:n,links:c})});C.get("/api/users/:id/qr",async(e)=>{let t=Number(e.req.param("id"));if(isNaN(t))return e.text("Invalid user ID",400);let n=await O(e.env.DB,t);if(!n)return e.text("User not found",404);let o=new URL(e.req.url).hostname,s=e.env.WS_PATH||"/api/v1/ws",i=await D(e.env.DB,o),c=J(n,i.endpoints,s,o),a=parseInt(e.req.query("link_index")||"0")||0,l=c[a]||c[0];if(!l)return e.text("No links available",404);await Promise.resolve().then(() => ce());let m=ie(l.url,256);return new Response(m,{status:200,headers:{"Content-Type":"image/svg+xml; charset=utf-8","Cache-Control":"private, max-age=60"}})});C.put("/api/users/:id",async(e)=>{let t=Number(e.req.param("id"));if(isNaN(t))return e.json({error:"Invalid user ID"},400);let n;try{n=await e.req.json()}catch{return e.json({error:"Invalid JSON"},400)}let r=await ot(e.env.DB,t,n);if(!r)return e.json({error:"User not found"},404);return W(),e.json(r)});C.post("/api/users/:id/reset",async(e)=>{let t=Number(e.req.param("id"));if(isNaN(t))return e.json({error:"Invalid user ID"},400);let n=await at(e.env.DB,t);if(!n)return e.json({error:"User not found"},404);return W(),e.json(n)});C.post("/api/users/:id/regen-uuid",async(e)=>{let t=Number(e.req.param("id"));if(isNaN(t))return e.json({error:"Invalid user ID"},400);let n=await it(e.env.DB,t);if(!n)return e.json({error:"User not found"},404);return W(),e.json(n)});C.post("/api/users/:id/regen-sub",async(e)=>{let t=Number(e.req.param("id"));if(isNaN(t))return e.json({error:"Invalid user ID"},400);let n=await ct(e.env.DB,t);if(!n)return e.json({error:"User not found"},404);return e.json(n)});C.delete("/api/users/:id",async(e)=>{let t=Number(e.req.param("id"));if(isNaN(t))return e.json({error:"Invalid user ID"},400);if(!await lt(e.env.DB,t))return e.json({error:"User not found"},404);return W(),e.json({success:!0})});C.get("/api/settings",async(e)=>{let t=new URL(e.req.url).hostname,n=await D(e.env.DB,t);return e.json(n)});C.put("/api/settings",async(e)=>{let t;try{t=await e.req.json()}catch{return e.json({error:"Invalid JSON"},400)}if(t.endpoints){if(!Array.isArray(t.endpoints))return e.json({error:"Endpoints must be an array"},400);for(let o of t.endpoints)if(!o.label||!o.address||!o.port)return e.json({error:"Each endpoint must have a label, address, and port"},400)}if(t.outbound_mode){if(!["direct","socks5","backend"].includes(t.outbound_mode))return e.json({error:"Invalid outbound_mode"},400)}await ut(e.env.DB,t);let n=new URL(e.req.url).hostname,r=await D(e.env.DB,n);return e.json({success:!0,settings:r})});var V=new K;V.all("*",async(e,t)=>{let n=e.env.WS_PATH||"/api/v1/ws";if(new URL(e.req.url).pathname===n){let o=e.req.header("Upgrade");if(!o||o.toLowerCase()!=="websocket")return q();let s={waitUntil:(i)=>{try{e.executionCtx.waitUntil(i)}catch{i.catch((c)=>console.error("Unhandled async task:",c))}}};return ht(e.req.raw,e.env,s)}await t()});V.get("/sub/:token",async(e)=>{let t=e.req.param("token");return Ct(t,e.req.raw,e.env)});V.get("*",async(e,t)=>{let n=e.env.PANEL_PATH||"/_panel",r=new URL(e.req.url);if(r.pathname===n||r.pathname===`${n}/`){let o=e.env.WS_PATH||"/api/v1/ws",s=Rt(n,o);return new Response(s,{status:200,headers:{"Content-Type":"text/html; charset=utf-8","Cache-Control":"no-cache, no-store, must-revalidate"}})}await t()});V.route("/",C);V.get("/",()=>q());var Ro=V;export{Ro as default};
