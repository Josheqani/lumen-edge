var _t=(e,t,r)=>()=>{if(e)try{t=e(e=0)}catch(n){r=[n]}if(r)throw r[0];return t};async function B(e,t){let r=await e.prepare("SELECT key, value FROM settings").all(),n=new Map;if(r.results)for(let f of r.results)n.set(f.key,f.value);let o="direct",s=n.get("outbound_mode");if(s==="socks5"||s==="backend"||s==="direct")o=s;let a=[],c=n.get("endpoints");if(c)try{let f=JSON.parse(c);if(Array.isArray(f))a=f}catch{a=[]}if(a.length===0&&t)a=[{label:"Default Edge",address:t,port:443,sni:t,host:t},{label:"MCI Clean 1 (Speed)",address:"speed.cloudflare.com",port:443,sni:t,host:t},{label:"MCI Clean 2 (Anycast)",address:"104.16.132.229",port:443,sni:t,host:t},{label:"MCI Clean 3 (CF DNS)",address:"162.159.192.1",port:443,sni:t,host:t},{label:"MCI Clean 4 (172.64)",address:"172.64.155.249",port:443,sni:t,host:t},{label:"MCI Alt Port (8443)",address:"104.17.80.1",port:8443,sni:t,host:t},{label:"MCI Alt Port (2053)",address:"104.20.74.82",port:2053,sni:t,host:t}];let i=n.get("proxy_ip")||void 0,l,d=n.get("socks5_config");if(d)try{l=JSON.parse(d)}catch{l=void 0}let p,h=n.get("backend_config");if(h)try{p=JSON.parse(h)}catch{p=void 0}return{outbound_mode:o,endpoints:a,proxy_ip:i,socks5_config:l,backend_config:p}}async function pt(e,t){let r=[];if(t.outbound_mode!==void 0)r.push(e.prepare("INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value").bind("outbound_mode",t.outbound_mode));if(t.proxy_ip!==void 0)r.push(e.prepare("INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value").bind("proxy_ip",t.proxy_ip));if(t.endpoints!==void 0)r.push(e.prepare("INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value").bind("endpoints",JSON.stringify(t.endpoints)));if(t.socks5_config!==void 0)r.push(e.prepare("INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value").bind("socks5_config",JSON.stringify(t.socks5_config)));if(t.backend_config!==void 0)r.push(e.prepare("INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value").bind("backend_config",JSON.stringify(t.backend_config)));if(r.length>0)await e.batch(r)}function At(e,t){if(e===0||t===0)return 0;return ie[Ae[e]+Ae[t]]}function er(e,t){let r=Array(e.length+t.length-1).fill(0);for(let n=0;n<e.length;n++)for(let o=0;o<t.length;o++)r[n+o]^=At(e[n],t[o]);return r}function tr(e){let t=[1];for(let r=0;r<e;r++)t=er(t,[1,ie[r]]);return t}function rr(e,t){let r=tr(t),n=new Uint8Array(e.length+t);n.set(e,0);for(let o=0;o<e.length;o++){let s=n[o];if(s!==0)for(let a=0;a<r.length;a++)n[o+a]^=At(r[a],s)}return n.subarray(e.length)}function ce(e,t=256){let r=new TextEncoder().encode(e),n=r.length,o=null;for(let u of Le){let b=u[0],x=u[1],L=u[2],N=x-L,It=4+(b<=9?8:16)+n*8;if(Math.ceil(It/8)<=N){o=u;break}}if(!o)o=Le[Le.length-1];let[s,a,c]=o,i=a-c,l=s*4+17,d=[],p=(u,b)=>{for(let x=b-1;x>=0;x--)d.push(u>>>x&1)};p(4,4);let h=s<=9?8:16;p(n,h);for(let u=0;u<n;u++)p(r[u],8);let f=i*8,A=Math.min(4,f-d.length);p(0,A);while(d.length%8!==0)d.push(0);let w=[236,17],v=0;while(d.length<f)p(w[v%2],8),v++;let U=new Uint8Array(i);for(let u=0;u<i;u++){let b=0;for(let x=0;x<8;x++)b=b<<1|d[u*8+x];U[u]=b}let g=rr(U,c),k=new Uint8Array(a);k.set(U,0),k.set(g,i);let m=Array.from({length:l},()=>Array(l).fill(null)),y=(u,b)=>{for(let x=-1;x<=7;x++)for(let L=-1;L<=7;L++){let N=u+x,H=b+L;if(N<0||N>=l||H<0||H>=l)continue;if(x>=0&&x<=6&&(L===0||L===6)||L>=0&&L<=6&&(x===0||x===6)||x>=2&&x<=4&&L>=2&&L<=4)m[N][H]=1;else m[N][H]=0}};y(0,0),y(0,l-7),y(l-7,0);for(let u=8;u<l-8;u++){if(m[6][u]===null)m[6][u]=u%2===0?1:0;if(m[u][6]===null)m[u][6]=u%2===0?1:0}m[4*s+9][8]=1;for(let u=0;u<=8;u++){if(m[8][u]===null)m[8][u]=0;if(m[u][8]===null)m[u][8]=0}for(let u=l-8;u<l;u++){if(m[8][u]===null)m[8][u]=0;if(m[u][8]===null)m[u][8]=0}let _=0,P=[];for(let u=0;u<k.length;u++)for(let b=7;b>=0;b--)P.push(k[u]>>>b&1);let D=!0;for(let u=l-1;u>0;u-=2){if(u===6)u--;let b=D?Array.from({length:l},(x,L)=>l-1-L):Array.from({length:l},(x,L)=>L);for(let x of b)for(let L of[u,u-1])if(m[x][L]===null){let N=_<P.length?P[_++]:0,H=(x+L)%2===0?1:0;m[x][L]=N^H}D=!D}let S=30660;for(let u=0;u<15;u++){let b=S>>>14-u&1;if(u<=5)m[8][u]=b;else if(u===6)m[8][7]=b;else if(u===7)m[8][8]=b;else if(u===8)m[7][8]=b;else m[14-u][8]=b;if(u<8)m[l-1-u][8]=b;else m[8][l-15+u]=b}let E=4,T=l+E*2,I=[];for(let u=0;u<l;u++)for(let b=0;b<l;b++)if(m[u][b]===1)I.push(`<rect x="${b+E}" y="${u+E}" width="1" height="1"/>`);return`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${T} ${T}" width="${t}" height="${t}" fill="currentColor" shape-rendering="crispEdges">
    <rect width="${T}" height="${T}" fill="#ffffff"/>
    <g fill="#000000">
      ${I.join("")}
    </g>
  </svg>`}var ie,Ae,Le;var le=_t(()=>{ie=new Uint8Array(512),Ae=new Uint8Array(256);(()=>{let e=1;for(let t=0;t<255;t++)ie[t]=e,ie[t+255]=e,Ae[e]=t,e=e<<1^(e>=128?285:0)})();Le=[[1,26,7,0],[2,44,10,7],[3,70,15,7],[4,100,20,7],[5,134,26,7],[6,172,36,7],[7,196,40,0],[8,242,48,0],[9,292,60,0],[10,346,72,0],[11,404,80,0],[12,466,96,0],[13,532,104,0],[14,581,120,3],[15,655,132,3]]});var Ce=Symbol();var Te=(e,t)=>new Response(e,{headers:{"Content-Type":t.replace(/^[^;]+/,(r)=>r.toLowerCase())}}).formData();var Pt=1e4,Y=(e)=>("headers"in e),Pe=async(e,t=Object.create(null))=>{let{all:r=!1,dot:n=!1}=t,o=(Y(e)?e.headers:e.raw.headers).get("Content-Type")?.split(";")[0].trim().toLowerCase();if(o==="multipart/form-data"||o==="application/x-www-form-urlencoded")return Dt(e,{all:r,dot:n});return{}};async function Dt(e,t){if(!Y(e)&&e.bodyCache.formData)return Ie(await e.bodyCache.formData,t);let r=Y(e)?e.headers:e.raw.headers,n=await e.arrayBuffer(),o=Te(n,r.get("Content-Type")||"");if(!Y(e))e.bodyCache.formData=o;let s=await o;if(s)return Ie(s,t);return{}}function Ie(e,t){let r=Object.create(null),n={count:0};if(e.forEach((o,s)=>{if(!(t.all||s.endsWith("[]")))r[s]=o;else Bt(r,s,o)}),t.dot)Object.entries(r).forEach(([o,s])=>{if(o.includes("."))Ot(r,o,s,n),delete r[o]});return r}var Bt=(e,t,r)=>{if(e[t]!==void 0)if(Array.isArray(e[t]))e[t].push(r);else e[t]=[e[t],r];else if(!t.endsWith("[]"))e[t]=r;else e[t]=[r]},Ot=(e,t,r,n)=>{if(/(?:^|\.)__proto__\./.test(t))return;let o=e,s=t.split(".",34);if(s.length>33)_e();s.forEach((a,c)=>{if(c===s.length-1)o[a]=r;else{if(!o[a]||typeof o[a]!=="object"||Array.isArray(o[a])||o[a]instanceof File){if(n.count++>=Pt)_e();o[a]=Object.create(null)}o=o[a]}})},_e=()=>{throw Error("Nesting limit exceeded")};var ue=(e)=>{let t=e.split("/");if(t[0]==="")t.shift();return t},De=(e)=>{let{groups:t,path:r}=Nt(e),n=ue(r);return Mt(n,t)},Nt=(e)=>{let t=[];return e=e.replace(/\{[^}]+\}/g,(r,n)=>{let o=`@${n}`;return t.push([o,r]),o}),{groups:t,path:e}},Mt=(e,t)=>{for(let r=t.length-1;r>=0;r--){let[n]=t[r];for(let o=e.length-1;o>=0;o--)if(e[o].includes(n)){e[o]=e[o].replace(n,t[r][1]);break}}return e},Z={},Be=(e,t)=>{if(e==="*")return"*";let r=e.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);if(r){let n=`${e}#${t}`;if(!Z[n])if(r[2])Z[n]=t&&t[0]!==":"&&t[0]!=="*"?[n,r[1],new RegExp(`^${r[2]}(?=/${t})`)]:[e,r[1],new RegExp(`^${r[2]}$`)];else Z[n]=[e,r[1],!0];return Z[n]}return null},Oe=(e,t)=>{try{return t(e)}catch{return e.replace(/(?:%[0-9A-Fa-f]{2})+/g,(r)=>{try{return t(r)}catch{return r}})}},qt=(e)=>Oe(e,decodeURI),pe=(e)=>{let t=e.url,r=t.indexOf("/",t.indexOf(":")+4),n=r;for(;n<t.length;n++){let o=t.charCodeAt(n);if(o===37){let s=t.indexOf("?",n),a=t.indexOf("#",n),c=s===-1?a===-1?void 0:a:a===-1?s:Math.min(s,a),i=t.slice(r,c);return qt(i.includes("%25")?i.replace(/%25/g,"%2525"):i)}else if(o===63||o===35)break}return t.slice(r,n)};var Ne=(e)=>{let t=pe(e);return t.length>1&&t.at(-1)==="/"?t.slice(0,-1):t},M=(e,t,...r)=>{if(r.length)t=M(t,...r);return`${e?.[0]==="/"?"":"/"}${e}${t==="/"?"":`${e?.at(-1)==="/"?"":"/"}${t?.[0]==="/"?t.slice(1):t}`}`},ee=(e)=>{if(e.charCodeAt(e.length-1)!==63||!e.includes(":"))return null;let t=e.split("/"),r=[],n="";return t.forEach((o)=>{if(o!==""&&!/\:/.test(o))n+="/"+o;else if(/\:/.test(o))if(o.charCodeAt(o.length-1)===63){if(r.length===0&&n==="")r.push("/");else r.push(n);let s=o.slice(0,-1);n+="/"+s,r.push(n)}else n+="/"+o}),r.filter((o,s,a)=>a.indexOf(o)===s)},te=(e)=>e.indexOf("%")!==-1?Oe(e,$t):e,de=(e)=>{if(e.indexOf("+")!==-1)e=e.replace(/\+/g," ");return te(e)},Me=(e,t,r)=>{let n=e.indexOf("#",8);if(n!==-1)e=e.slice(0,n);let o;if(!r&&t&&t.indexOf("%")===-1&&t.indexOf("+")===-1){let c=e.indexOf("?",8);if(c===-1)return;if(!e.startsWith(t,c+1))c=e.indexOf(`&${t}`,c+1);while(c!==-1){let i=e.charCodeAt(c+t.length+1);if(i===61){let l=c+t.length+2,d=e.indexOf("&",l);return de(e.slice(l,d===-1?void 0:d))}else if(i==38||isNaN(i))return"";c=e.indexOf(`&${t}`,c+1)}if(o=/[%+]/.test(e),!o)return}let s=Object.create(null);o??=/[%+]/.test(e);let a=e.indexOf("?",8);while(a!==-1){let c=e.indexOf("&",a+1),i=e.indexOf("=",a);if(i>c&&c!==-1)i=-1;let l=e.slice(a+1,i===-1?c===-1?void 0:c:i);if(o)l=de(l);if(a=c,l==="")continue;let d;if(i===-1)d="";else if(d=e.slice(i+1,c===-1?void 0:c),o)d=de(d);if(r){if(!(s[l]&&Array.isArray(s[l])))s[l]=[];s[l].push(d)}else s[l]??=d}return t?s[t]:s},qe=Me,$e=(e,t)=>Me(e,t,!0),$t=decodeURIComponent;var je=class{raw;#t;#e;routeIndex=0;path;bodyCache={};constructor(e,t="/",r=[[]]){this.raw=e,this.path=t,this.#e=r}param(e){return e?this.#r(e):this.#s()}#r(e){let t=this.#e[0][this.routeIndex]?.[1][e],r=this.#n(t);return r&&te(r)}#s(){let e={},t=Object.keys(this.#e[0][this.routeIndex]?.[1]??{});for(let r of t){let n=this.#n(this.#e[0][this.routeIndex][1][r]);if(n!==void 0)e[r]=te(n)}return e}#n(e){return this.#e[1]?this.#e[1][e]:e}query(e){return qe(this.url,e)}queries(e){return $e(this.url,e)}header(e){if(e)return this.raw.headers.get(e)??void 0;let t=Object.create(null);return this.raw.headers.forEach((r,n)=>{t[n]=r}),t}async parseBody(e){return Pe(this,e)}#o=(e)=>{let{bodyCache:t,raw:r}=this,n=t[e];if(n)return n;for(let o in t)return t[o].then((s)=>{if(o==="json")s=JSON.stringify(s);let a=o==="formData"?void 0:r.headers.get("content-type");return new Response(s,{headers:a?{"Content-Type":a}:void 0})[e]()});return t[e]=r[e]()};json(){return this.#o("text").then((e)=>JSON.parse(e))}text(){return this.#o("text")}arrayBuffer(){return this.#o("arrayBuffer")}bytes(){return this.#o("arrayBuffer").then((e)=>new Uint8Array(e))}blob(){return this.#o("blob")}formData(){return this.#o("formData")}addValidatedData(e,t){(this.#t??={})[e]=t}valid(e){return this.#t?.[e]}get url(){return this.raw.url}get method(){return this.raw.method}get[Ce](){return this.#e}get matchedRoutes(){return this.#e[0].map(([[,e]])=>e)}get routePath(){return this.#e[0].map(([[,e]])=>e)[this.routeIndex].path}};var He={Stringify:1,BeforeStream:2,Stream:3},jt=(e,t)=>{let r=new String(e);return r.isEscaped=!0,r.callbacks=t,r};var me=async(e,t,r,n,o)=>{if(typeof e==="object"&&!(e instanceof String)){if(!(e instanceof Promise))e=e.toString();if(e instanceof Promise)e=await e}let s=e.callbacks;if(!s?.length)return Promise.resolve(e);if(o)o[0]+=e;else o=[e];let a=Promise.all(s.map((c)=>c({phase:t,buffer:o,context:n}))).then((c)=>Promise.all(c.filter(Boolean).map((i)=>me(i,t,!1,n,o))).then(()=>o[0]));if(r)return jt(await a,s);else return a};var Ht="text/plain; charset=UTF-8",fe=(e,t)=>({"Content-Type":e,...t}),G=(e,t)=>new Response(e,t),he=class{#t;#e;env={};#r;finalized=!1;error;#s;#n;#o;#d;#c;#l;#i;#u;#p;constructor(e,t){if(this.#t=e,t)this.#n=t.executionCtx,this.env=t.env,this.#l=t.notFoundHandler,this.#p=t.path,this.#u=t.matchResult}get req(){return this.#e??=new je(this.#t,this.#p,this.#u),this.#e}get event(){if(this.#n&&"respondWith"in this.#n)return this.#n;else throw Error("This context has no FetchEvent")}get executionCtx(){if(this.#n)return this.#n;else throw Error("This context has no ExecutionContext")}get res(){return this.#o||=G(null,{headers:this.#i??=new Headers})}set res(e){if(this.#o&&e){e=G(e.body,e);for(let[t,r]of this.#o.headers.entries()){if(t==="content-type")continue;if(t==="set-cookie"){let n=this.#o.headers.getSetCookie();e.headers.delete("set-cookie");for(let o of n)e.headers.append("set-cookie",o)}else e.headers.set(t,r)}}this.#o=e,this.finalized=!0}render=(...e)=>(this.#c??=(t)=>this.html(t),this.#c(...e));setLayout=(e)=>this.#d=e;getLayout=()=>this.#d;setRenderer=(e)=>{this.#c=e};header=(e,t,r)=>{if(this.finalized)this.#o=G(this.#o.body,this.#o);let n=this.#o?this.#o.headers:this.#i??=new Headers;if(t===void 0)n.delete(e);else if(r?.append)n.append(e,t);else n.set(e,t)};status=(e)=>{this.#s=e};set=(e,t)=>{this.#r??=new Map,this.#r.set(e,t)};get=(e)=>this.#r?this.#r.get(e):void 0;get var(){if(!this.#r)return{};return Object.fromEntries(this.#r)}#a(e,t,r){let n=this.#o?new Headers(this.#o.headers):this.#i;if(typeof t==="object"&&t.headers){n??=new Headers;for(let[s,a]of new Headers(t.headers))if(s==="set-cookie")n.append(s,a);else n.set(s,a)}if(r){if(!n){let s=0;for(let a in r)if(++s>1||typeof r[a]!=="string"){n=new Headers;break}}if(n)for(let s in r){let a=r[s];if(typeof a==="string")n.set(s,a);else{n.delete(s);for(let c of a)n.append(s,c)}}}let o=typeof t==="number"?t:t?.status??this.#s;return G(e,{status:o,headers:n??r})}newResponse=(...e)=>this.#a(...e);body=(e,t,r)=>this.#a(e,t,r);text=(e,t,r)=>!this.#i&&!this.#s&&!t&&!r&&!this.finalized?new Response(e):this.#a(e,t,fe(Ht,r));json=(e,t,r)=>this.#a(JSON.stringify(e),t,fe("application/json",r));html=(e,t,r)=>{let n=(o)=>this.#a(o,t,fe("text/html; charset=UTF-8",r));return typeof e==="object"?me(e,He.Stringify,!1,{}).then(n):n(e)};redirect=(e,t)=>{let r=String(e);return this.header("Location",!/[^\x00-\xFF]/.test(r)?r:encodeURI(r)),this.newResponse(null,t??302)};notFound=()=>(this.#l??=()=>G(),this.#l(this))};var ge=(e,t,r)=>(n,o)=>{let s=-1;return a(0);async function a(c){if(c<=s)throw Error("next() called multiple times");s=c;let i,l=!1,d;if(e[c])d=e[c][0][0],n.req.routeIndex=c;else d=c===e.length&&o||void 0;if(d)try{i=await d(n,()=>a(c+1))}catch(p){if(p instanceof Error&&t)n.error=p,i=await t(p,n),l=!0;else throw p}else if(n.finalized===!1&&r)i=await r(n);if(i&&(n.finalized===!1||l))n.res=i;return n}};var Fe=["get","post","put","delete","options","patch","query"],re="Can not add a route since the matcher is already built.",ne=class extends Error{};var We="__COMPOSED_HANDLER";var Ft=(e)=>e.text("404 Not Found",404),ze=(e,t)=>{if("getResponse"in e){let r=e.getResponse();return t.newResponse(r.body,r)}return console.error(e),t.text("Internal Server Error",500)},Ve=class e{get;post;put;delete;options;patch;query;all;on;use;router;getPath;_basePath="/";#t="/";routes=[];constructor(t={}){[...Fe,"all"].forEach((o)=>{this[o]=(s,...a)=>{let c=o.toUpperCase();if(typeof s==="string")this.#t=s;else this.#s(c,this.#t,s);return a.forEach((i)=>{this.#s(c,this.#t,i)}),this}}),this.on=(o,s,...a)=>{for(let c of[s].flat()){this.#t=c;for(let i of[o].flat()){let l=i.toUpperCase();for(let d of a)this.#s(l,this.#t,d)}}return this},this.use=(o,...s)=>{if(typeof o==="string")this.#t=o;else this.#t="*",s.unshift(o);return s.forEach((a)=>{this.#s("ALL",this.#t,a)}),this};let{strict:r,...n}=t;Object.assign(this,n),this.getPath=r??!0?t.getPath??pe:Ne}#e(){let t=new e({router:this.router,getPath:this.getPath});return t.errorHandler=this.errorHandler,t.#r=this.#r,t.routes=this.routes,t}#r=Ft;errorHandler=ze;route(t,r){let n=this.basePath(t);return r.routes.map((o)=>{let s;if(r.errorHandler===ze)s=o.handler;else s=async(a,c)=>(await ge([],r.errorHandler)(a,()=>o.handler(a,c))).res,s[We]=o.handler;n.#s(o.method,o.path,s,o.basePath)}),this}basePath(t){let r=this.#e();return r._basePath=M(this._basePath,t),r}onError=(t)=>(this.errorHandler=t,this);notFound=(t)=>(this.#r=t,this);mount(t,r,n){let o,s;if(n)if(typeof n==="function")s=n;else if(s=n.optionHandler,n.replaceRequest===!1)o=(i)=>i;else o=n.replaceRequest;let a=s?(i)=>{let l=s(i);return Array.isArray(l)?l:[l]}:(i)=>{let l=void 0;try{l=i.executionCtx}catch{}return[i.env,l]};o||=(()=>{let i=M(this._basePath,t),l=i==="/"?0:i.length;return(d)=>{let p=new URL(d.url);return p.pathname=this.getPath(d).slice(l)||"/",new Request(p,d)}})();let c=async(i,l)=>{let d=await r(o(i.req.raw),...a(i));if(d)return d;await l()};return this.#s("ALL",M(t,"*"),c),this}#s(t,r,n,o){r=M(this._basePath,r);let s={basePath:o!==void 0?M(this._basePath,o):this._basePath,path:r,method:t,handler:n};this.router.add(t,r,[n,s]),this.routes.push(s)}#n(t,r){if(t instanceof Error)return this.errorHandler(t,r);throw t}#o(t,r,n,o){if(o==="HEAD")return(async()=>new Response(null,await this.#o(t,r,n,"GET")))();let s=this.getPath(t,{env:n}),a=this.router.match(o,s),c=new he(t,{path:s,matchResult:a,env:n,executionCtx:r,notFoundHandler:this.#r});if(a[0].length===1){let l;try{l=a[0][0][0][0](c,async()=>{c.res=await this.#r(c)})}catch(d){return this.#n(d,c)}return l instanceof Promise?l.then((d)=>d||(c.finalized?c.res:this.#r(c))).catch((d)=>this.#n(d,c)):l??this.#r(c)}let i=ge(a[0],this.errorHandler,this.#r);return(async()=>{try{let l=await i(c);if(!l.finalized)throw Error("Context is not finalized. Did you forget to return a Response object or `await next()`?");return l.res}catch(l){return this.#n(l,c)}})()}fetch=(t,...r)=>this.#o(t,r[1],r[0],t.method);request=(t,r,n,o)=>{if(t instanceof Request)return this.fetch(r?new Request(t,r):t,n,o);return t=t.toString(),this.fetch(new Request(/^https?:\/\//.test(t)?t:`http://localhost${M("/",t)}`,r),n,o)};fire=()=>{addEventListener("fetch",(t)=>{t.respondWith(this.#o(t.request,t,void 0,t.request.method))})}};var R=()=>Object.create(null);var oe=[];function be(e,t){let r=this.buildAllMatchers(),n=(o,s)=>{let a=r[o]||r.ALL,c=a[2][s];if(c)return c;let i=s.match(a[0]);if(!i)return[[],oe];let l=i.indexOf("",1);return[a[1][l],i]};return this.match=n,n(e,t)}var ye="[^/]+";var we="(?:|/.*)",q=Symbol(),Ge=new Set(".\\+*[^]$()");function Wt(e,t){if(e.length===1)return t.length===1?e<t?-1:1:-1;if(t.length===1)return 1;if(e===".*"||e==="(?:|/.*)")return t==="(?:|/.*)"?-1:1;else if(t===".*"||t==="(?:|/.*)")return-1;if(e==="[^/]+")return 1;else if(t==="[^/]+")return-1;return e.length===t.length?e<t?-1:1:t.length-e.length}var Qe=class e{#t;#e;#r=R();insert(t,r,n,o,s){let a=this;for(let c=0,i=t.length;c<i;c++){let l=t[c],d=l.length===1?l==="*"?c===i-1?["","",".*"]:["","",ye]:null:l==="/*"?["","",we]:l.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/),p;if(d){let h=d[1],f=d[2]||"[^/]+";if(h&&d[2]){if(f===".*")throw q;if(f=f.replace(/^\((?!\?:)(?=[^)]+\)$)/,"(?:"),/\((?!\?:)/.test(f))throw q;if(f.length===1&&Ge.has(f))throw q}if(p=a.#r[f],!p){if(f!==".*"&&f!=="(?:|/.*)"){for(let A in a.#r)if((f.length>1||A.length>1)&&A!==".*"&&A!=="(?:|/.*)")throw q}p=a.#r[f]=new e}if(h!=="")p.#e??=o.varIndex++,n.push([h,p.#e])}else if(p=a.#r[l],!p){for(let h in a.#r)if(h.length>1&&h!==".*"&&h!=="(?:|/.*)")throw q;p=a.#r[l]=new e}a=p}if(a.#t!==void 0)throw q;a.#t=s?-1:r}buildRegExpStr(){let t=Object.keys(this.#r).sort(Wt).map((r)=>{let n=this.#r[r],o=n.buildRegExpStr();return o===""?"":(typeof n.#e==="number"?`(${r})@${n.#e}`:Ge.has(r)?`\\${r}`:r)+o}).filter(Boolean);if(typeof this.#t==="number"&&this.#t!==-1)t.unshift(`#${this.#t}`);if(t.length===0)return"";if(t.length===1)return t[0];return"(?:"+t.join("|")+")"}};var ve=class{#t={varIndex:0};#e=new Qe;#r=0;paths=R();insert(e,t){if(t){this.#e.insert(e.split(""),0,[],this.#t,!0);return}let r=[],n=[],o=e;for(let a=0;;){let c=!1;if(o=o.replace(/\{[^}]+\}/g,(i)=>{let l=`@\\${a}`;return n[a]=[l,i],a++,c=!0,l}),!c)break}let s=o.match(/(?::[^\/]+)|(?:\/\*$)|./g)||[];for(let a=n.length-1;a>=0;a--){let[c]=n[a];for(let i=s.length-1;i>=0;i--)if(s[i].indexOf(c)!==-1){s[i]=s[i].replace(c,n[a][1]);break}}this.#e.insert(s,this.#r,r,this.#t,!1),this.paths[e]=[this.#r++,r]}buildRegExp(){let e=this.#e.buildRegExpStr();if(e==="")return[/^$/,[],[]];let t=0,r=[],n=[];return e=e.replace(/#(\d+)|@(\d+)|\.\*\$/g,(o,s,a)=>{if(s!==void 0)return r[++t]=Number(s),"$()";if(a!==void 0)return n[Number(a)]=++t,"";return""}),[new RegExp(`^${e}`),r,n]}};var Ke=R();function Je(e){return Ke[e]??=new RegExp(`^${e.replace(/\/:[^/{}]+(?:\{\[\^\/]\+})?(?=[/{]|$)|\/?\*$|([.\\+*[^\]$()?{}|])/g,(t,r)=>r?`\\${r}`:t==="/*"?we:t==="*"?".*":`/:${ye}`)}$`)}function se(e,t){for(let r of Object.keys(e).sort((n,o)=>o.length-n.length))if(Je(r).test(t))return[...e[r]]}var ae=class{name="RegExpRouter";#t;#e;#r;constructor(){this.#t={["ALL"]:R()},this.#e={["ALL"]:R()},this.#r={["ALL"]:new ve}}#s(e,t){try{this.#r[e].insert(t,!/\*|\/:/.test(t))}catch(r){throw r===q?new ne(t):r}}add(e,t,r){let n=this.#t,o=this.#e;if(!n)throw Error(re);if(!n[e]){this.#r[e]=new ve;for(let c of[n,o]){c[e]=R();for(let i in c.ALL)c[e][i]=[...c.ALL[i]],this.#s(e,i)}}if(t==="/*")t="*";let s=e==="ALL"?Object.keys(n):[e];if(/\*$/.test(t)){let c=Je(t);for(let i of s)if(!n[i][t])this.#s(i,t),n[i][t]=se(n[i],t)||se(n.ALL,t)||[];for(let i of[n,o])for(let l of s)for(let d in i[l])c.test(d)&&i[l][d].push([r,t]);return}let a=ee(t)||[t];for(let c of a)for(let i of s){if(!o[i][c])this.#s(i,c),o[i][c]=se(n[i],c)||se(n.ALL,c)||[];o[i][c].push([r,c])}}match=be;buildAllMatchers(){let e=R();for(let t of Object.keys(this.#e))e[t]=this.#n(t);return this.#t=this.#e=this.#r=void 0,Ke=R(),e}#n(e){let t=this.#t[e],r=this.#e[e],n=this.#r[e],o=R(),s=[],[a,c,i]=n.buildRegExp();for(let l of[t,r])for(let d in l){let p=l[d],h=n.paths[d];if(!h){o[d]=[p.map(([f])=>[f,R()]),oe];continue}s[h[0]]=p.map(([f,A])=>[f,n.paths[A][1].reduceRight((w,[v],U)=>(w[v]=i[h[1][U][1]],w),R())])}return[a,c.map((l)=>s[l]),o]}};var Xe=class{name="SmartRouter";#t=[];#e=[];constructor(e){this.#t=e.routers}add(e,t,r){if(!this.#e)throw Error(re);this.#e.push([e,t,r])}match(e,t){if(!this.#e)throw Error("Fatal error");let r=this.#t,n=this.#e,o=r.length,s=0,a;for(;s<o;s++){let c=r[s];try{for(let i=0,l=n.length;i<l;i++)c.add(...n[i]);a=c.match(e,t)}catch(i){if(i instanceof ne)continue;throw i}this.match=c.match.bind(c),this.#t=[c],this.#e=void 0;break}if(s===o)throw Error("Fatal error");return this.name=`SmartRouter + ${this.activeRouter.name}`,a}get activeRouter(){if(this.#e||this.#t.length!==1)throw Error("No active router has been determined yet.");return this.#t[0]}};var xe=R(),zt=0,Ye=class e{#t=[];#e=R();#r=[];#s;#n=xe;insert(t,r,n){let o=this,s=De(r),a=new Set,c=0;for(let i of s){let l=s[++c],d=Be(i,l)||(l===void 0&&i&&i.indexOf("*")===i.length-1?i:null),p=Array.isArray(d),h=p?d[0]:d||i,f=o.#e[h]||=new e;if(d&&!f.#s)f.#s=d,o.#r.push(f);if(o=f,p)a.add(d[1])}o.#t.push({[t]:{handler:n,possibleKeys:[...a],score:++zt}})}#o(t,r,n,o,s){for(let a=0,c=r.#t.length;a<c;a++){let i=r.#t[a],l=i[n]||i.ALL;if(l){l.params=R(),t.push(l);for(let d=0,p=l.possibleKeys.length;d<p;d++){let h=l.possibleKeys[d];l.params[h]=s?.[h]&&!d?s[h]:o[h]??s?.[h]}}}}search(t,r){let n=[];this.#n=xe;let o=[this],s=ue(r),a=[],c=s.length,i=null;for(let l=0;l<c;l++){let d=s[l],p=l===c-1,h=[];for(let A=0,w=o.length;A<w;A++){let v=o[A],U=v.#e[d];if(U)if(U.#n=v.#n,p){if(U.#e["*"])this.#o(n,U.#e["*"],t,v.#n);this.#o(n,U,t,v.#n)}else h.push(U);for(let g of v.#r){let k=g.#s,m=v.#n===xe?{}:{...v.#n};if(typeof k==="string"){if(k==="*"||d.startsWith(k.slice(0,-1))){if(this.#o(n,g,t,v.#n),k==="*")g.#n=m,h.push(g)}continue}let[,y,_]=k;if(!d&&_===!0)continue;if(_!==!0){if(!i){i=[];let S=r[0]==="/"?1:0;for(let E=0;E<c;E++)i[E]=S,S+=s[E].length+1}let P=r.slice(i[l]),D=_.exec(P);if(D){if(m[y]=D[0],this.#o(n,g,t,v.#n,m),D[0].length===P.length&&g.#e["*"])this.#o(n,g.#e["*"],t,v.#n,m);for(let S in g.#e){g.#n=m;let E=D[0].match(/\//g)?.length??0;(a[E]||=[]).push(g);break}continue}}if(_===!0||_.test(d))if(m[y]=d,p){if(this.#o(n,g,t,m,v.#n),g.#e["*"])this.#o(n,g.#e["*"],t,m,v.#n)}else g.#n=m,h.push(g)}}let f=a.shift();o=f?h.concat(f):h}if(n[1])n.sort((l,d)=>l.score-d.score);return[n.map(({handler:l,params:d})=>[l,d])]}};var Ee=class{name="TrieRouter";#t=new Ye;add(e,t,r){for(let n of ee(t)||[t])this.#t.insert(e,n,r)}match(e,t){return this.#t.search(e,t)}};var Q=class extends Ve{constructor(e={}){super(e);this.router=e.router??new Xe({routers:[new ae,new Ee]})}};function Vt(e,t=0){if(e.length<t+16)throw Error("Buffer too short for UUID");let r=[];for(let n=0;n<16;n++){let o=e[t+n];r.push((o<16?"0":"")+o.toString(16))}return[r.slice(0,4).join(""),r.slice(4,6).join(""),r.slice(6,8).join(""),r.slice(8,10).join(""),r.slice(10,16).join("")].join("-").toLowerCase()}function Ze(e){if(e.length<22)return null;let t=0,r=e[t++],n=Vt(e,t);t+=16;let o=e[t++];if(t+=o,e.length<t+4)return null;let s=e[t++],c=new DataView(e.buffer,e.byteOffset+t,2).getUint16(0,!1);t+=2;let i=e[t++],l="";if(i===1){if(e.length<t+4)return null;l=[e[t++],e[t++],e[t++],e[t++]].join(".")}else if(i===2){if(e.length<t+1)return null;let p=e[t++];if(e.length<t+p)return null;l=new TextDecoder().decode(e.subarray(t,t+p)),t+=p}else if(i===3){if(e.length<t+16)return null;let p=[],h=new DataView(e.buffer,e.byteOffset+t,16);for(let f=0;f<8;f++)p.push(h.getUint16(f*2,!1).toString(16));l=p.join(":"),t+=16}else return null;let d=e.subarray(t);return{version:r,uuid:n,command:s,port:c,addressType:i,address:l,rawPayload:d}}function et(){return new Uint8Array([0,0])}function Se(e){let t=Math.floor(Date.now()/1000),r=e.expires_at!==null&&e.expires_at>0&&e.expires_at<t,n=e.quota_bytes>0&&e.used_bytes>=e.quota_bytes,o=e.enabled===1&&!r&&!n;return{id:e.id,name:e.name,uuid:e.uuid,sub_token:e.sub_token,enabled:e.enabled===1,quota_bytes:e.quota_bytes,used_bytes:e.used_bytes,expires_at:e.expires_at,note:e.note,created_at:e.created_at,is_active:o}}async function O(e,t){let r=await e.prepare("SELECT * FROM users WHERE id = ?").bind(t).first();return r?Se(r):null}async function tt(e,t){let r=await e.prepare("SELECT * FROM users WHERE sub_token = ?").bind(t).first();return r?Se(r):null}async function rt(e,t={}){let r=t.limit&&t.limit>0?t.limit:50,n=t.offset&&t.offset>=0?t.offset:0,o=t.search?`%${t.search.trim()}%`:null,s="SELECT COUNT(*) as count FROM users",a="SELECT * FROM users",c=[];if(o)s+=" WHERE name LIKE ? OR note LIKE ? OR uuid LIKE ?",a+=" WHERE name LIKE ? OR note LIKE ? OR uuid LIKE ?",c.push(o,o,o);a+=" ORDER BY id DESC LIMIT ? OFFSET ?";let l=(await e.prepare(s).bind(...c).first())?.count??0;return{users:((await e.prepare(a).bind(...c,r,n).all()).results||[]).map(Se),total:l}}async function nt(e){let t=Math.floor(Date.now()/1000),{results:r}=await e.prepare(`SELECT uuid FROM users 
       WHERE enabled = 1 
         AND (expires_at IS NULL OR expires_at = 0 OR expires_at > ?)
         AND (quota_bytes = 0 OR used_bytes < quota_bytes)`).bind(t).all(),n=new Set;if(r){for(let o of r)if(o.uuid)n.add(o.uuid.toLowerCase())}return n}async function ot(e,t){let r=(t.uuid||crypto.randomUUID()).toLowerCase(),n=t.sub_token||crypto.randomUUID().replace(/-/g,""),o=t.enabled===!1?0:1,s=t.quota_bytes&&t.quota_bytes>0?t.quota_bytes:0,a=t.expires_at??null,c=t.note??null,i=Math.floor(Date.now()/1000),d=(await e.prepare(`INSERT INTO users (name, uuid, sub_token, enabled, quota_bytes, used_bytes, expires_at, note, created_at)
       VALUES (?, ?, ?, ?, ?, 0, ?, ?, ?)`).bind(t.name.trim(),r,n,o,s,a,c,i).run()).meta?.last_row_id;if(!d)throw Error("Failed to insert user into database");let p=await O(e,d);if(!p)throw Error("Failed to retrieve created user");return p}async function st(e,t,r){let n=[],o=[];if(r.name!==void 0)n.push("name = ?"),o.push(r.name.trim());if(r.enabled!==void 0)n.push("enabled = ?"),o.push(r.enabled?1:0);if(r.quota_bytes!==void 0)n.push("quota_bytes = ?"),o.push(Math.max(0,r.quota_bytes));if(r.expires_at!==void 0)n.push("expires_at = ?"),o.push(r.expires_at);if(r.note!==void 0)n.push("note = ?"),o.push(r.note);if(n.length===0)return O(e,t);return o.push(t),await e.prepare(`UPDATE users SET ${n.join(", ")} WHERE id = ?`).bind(...o).run(),O(e,t)}async function at(e,t,r){if(r<=0)return;await e.prepare("UPDATE users SET used_bytes = used_bytes + ? WHERE uuid = ?").bind(r,t.toLowerCase()).run()}async function it(e,t){return await e.prepare("UPDATE users SET used_bytes = 0 WHERE id = ?").bind(t).run(),O(e,t)}async function ct(e,t,r){let n=(r||crypto.randomUUID()).toLowerCase();return await e.prepare("UPDATE users SET uuid = ? WHERE id = ?").bind(n,t).run(),O(e,t)}async function lt(e,t,r){let n=r||crypto.randomUUID().replace(/-/g,"");return await e.prepare("UPDATE users SET sub_token = ? WHERE id = ?").bind(n,t).run(),O(e,t)}async function dt(e,t){return((await e.prepare("DELETE FROM users WHERE id = ?").bind(t).run()).meta?.changes??0)>0}var F=null,ke=0,Gt=30000;async function ut(e){let t=Date.now();if(F!==null&&t<ke)return F;try{return F=await nt(e),ke=t+Gt,F}catch(r){if(F!==null)return F;throw r}}function z(){F=null,ke=0}function j(){return new Response(`<!DOCTYPE html>
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
</html>`,{status:200,headers:{"Content-Type":"text/html; charset=utf-8","Cache-Control":"public, max-age=3600"}})}async function ft(){let e=await import("cloudflare:sockets");return e.connect}async function mt(e,t,r){let n=await ft();async function o(a,c){let i=n({hostname:a,port:c});if(i.opened)await Promise.race([i.opened,new Promise((l,d)=>setTimeout(()=>d(Error(`TCP connect timeout to ${a}:${c}`)),4000))]);return i}let s;try{s=await o(e,t)}catch(a){if(r&&r!==e)try{s=await o(r,t)}catch{throw a}else throw a}return{readable:s.readable,writable:s.writable,close:async()=>{try{await s.close()}catch{}}}}async function W(e,t){let r=new Uint8Array(t),n=0;while(n<t){let{value:o,done:s}=await e.read();if(s||!o)throw Error(`Connection closed before reading ${t} bytes`);let a=Math.min(o.length,t-n);if(r.set(o.subarray(0,a),n),n+=a,a<o.length);}return r}async function Kt(e,t,r,n,o,s){let c=(await ft())({hostname:r,port:n}),i=c.writable.getWriter(),l=c.readable.getReader();try{let d=!!(o&&s),p=d?new Uint8Array([5,2,0,2]):new Uint8Array([5,1,0]);await i.write(p);let h=await W(l,2);if(h[0]!==5)throw Error("Invalid SOCKS5 server version response");let f=h[1];if(f===2&&d){let g=new TextEncoder().encode(o),k=new TextEncoder().encode(s),m=new Uint8Array(3+g.length+k.length);m[0]=1,m[1]=g.length,m.set(g,2),m[2+g.length]=k.length,m.set(k,3+g.length),await i.write(m);let y=await W(l,2);if(y[0]!==1||y[1]!==0)throw Error("SOCKS5 authentication failed")}else if(f!==0)throw Error(`SOCKS5 method ${f} not supported`);let A=/^(\d{1,3}\.){3}\d{1,3}$/.test(e),w;if(A){let g=e.split(".").map(Number);w=new Uint8Array(10),w[0]=5,w[1]=1,w[2]=0,w[3]=1,w[4]=g[0],w[5]=g[1],w[6]=g[2],w[7]=g[3],new DataView(w.buffer).setUint16(8,t,!1)}else{let g=new TextEncoder().encode(e);w=new Uint8Array(5+g.length+2),w[0]=5,w[1]=1,w[2]=0,w[3]=3,w[4]=g.length,w.set(g,5),new DataView(w.buffer).setUint16(5+g.length,t,!1)}await i.write(w);let v=await W(l,4);if(v[0]!==5||v[1]!==0)throw Error(`SOCKS5 connect failed with reply code: ${v[1]}`);let U=v[3];if(U===1)await W(l,6);else if(U===3){let g=await W(l,1);await W(l,g[0]+2)}else if(U===4)await W(l,18);return i.releaseLock(),l.releaseLock(),{readable:c.readable,writable:c.writable,close:async()=>{try{await c.close()}catch{}}}}catch(d){i.releaseLock(),l.releaseLock();try{await c.close()}catch{}throw d}}async function ht(e,t,r){let n=null;try{n=await B(r)}catch{}if((n?.outbound_mode??"direct")==="socks5"&&n?.socks5_config?.host&&n?.socks5_config?.port)try{return await Kt(e,t,n.socks5_config.host,n.socks5_config.port,n.socks5_config.username,n.socks5_config.password)}catch(s){return console.warn("SOCKS5 outbound connection failed, falling back to direct:",s),mt(e,t,n?.proxy_ip)}return mt(e,t,n?.proxy_ip)}function Jt(e){if(!e)return null;try{let t=e.replace(/-/g,"+").replace(/_/g,"/"),r=t.length%4;if(r)t+="=".repeat(4-r);let n=atob(t),o=new Uint8Array(n.length);for(let s=0;s<n.length;s++)o[s]=n.charCodeAt(s);return o}catch{return null}}function K(e){try{if(e.readyState===1||e.readyState===2)e.close()}catch{}}function Xt(e,t){let r=!1;return new ReadableStream({start(n){if(e.addEventListener("message",(o)=>{if(r)return;let s=o.data;if(s instanceof ArrayBuffer)n.enqueue(new Uint8Array(s));else if(ArrayBuffer.isView(s))n.enqueue(new Uint8Array(s.buffer,s.byteOffset,s.byteLength))}),e.addEventListener("close",()=>{if(r)return;K(e);try{n.close()}catch{}}),e.addEventListener("error",(o)=>{if(r)return;K(e);try{n.error(o)}catch{}}),t&&t.byteLength>0)n.enqueue(t)},cancel(){if(r)return;r=!0,K(e)}})}async function gt(e,t,r){let n=e.headers.get("Upgrade");if(!n||n.toLowerCase()!=="websocket")return j();let o=e.headers.get("sec-websocket-protocol"),s=Jt(o),a=new WebSocketPair,c=a[0],i=a[1];i.accept();let l=Xt(i,s);return r.waitUntil((async()=>{let d=null,p="",h=0,f=0,A=!1,w=!1,v=et(),U=async()=>{let m=h+f;if(m>0&&p)try{await at(t.DB,p,m)}catch(y){console.error("Traffic accounting error:",y)}},g=async()=>{if(d){try{await d.close()}catch{}d=null}K(i),await U()},k=async(m)=>{for(let y=0;y<m.byteLength;){if(m.byteLength<y+2)break;let _=m[y]<<8|m[y+1];if(y+=2,m.byteLength<y+_)break;let P=m.subarray(y,y+_);y+=_;try{let D=await fetch("https://1.1.1.1/dns-query",{method:"POST",headers:{"content-type":"application/dns-message"},body:P}),S=new Uint8Array(await D.arrayBuffer()),E=S.byteLength,T=new Uint8Array([E>>8&255,E&255]);if(f+=E,i.readyState===1)if(!w){w=!0;let I=new Uint8Array(4+E);I.set(v,0),I.set(T,2),I.set(S,4),i.send(I)}else{let I=new Uint8Array(2+E);I.set(T,0),I.set(S,2),i.send(I)}}catch(D){console.warn("DNS over HTTPS resolution error:",D)}}};try{await l.pipeTo(new WritableStream({async write(m){if(h+=m.byteLength,A){await k(m);return}if(d){let S=d.writable.getWriter();try{await S.write(m)}finally{S.releaseLock()}return}let y=Ze(m);if(!y)throw Error("Invalid VLESS header format");if(p=y.uuid,!(await ut(t.DB)).has(p.toLowerCase()))throw Error(`Unauthorized user UUID: ${p}`);if(y.command===2)if(y.port===53){if(A=!0,y.rawPayload.byteLength>0)await k(y.rawPayload);return}else throw Error(`Unsupported UDP port ${y.port}`);let P=null;try{await Promise.resolve();P=await B(t.DB)}catch{}if(P?.outbound_mode==="backend"&&P.backend_config?.url)try{let E=(await fetch(P.backend_config.url,{headers:{Upgrade:"websocket"}})).webSocket;if(E){E.accept(),E.send(m);let T=!1,I=async()=>{if(T)return;T=!0,K(E),await g()};i.addEventListener("message",(u)=>{if(T)return;let b=u.data,x=b instanceof ArrayBuffer?b.byteLength:ArrayBuffer.isView(b)?b.byteLength:0;h+=x,E.send(b)}),i.addEventListener("close",I),i.addEventListener("error",I),E.addEventListener("message",(u)=>{if(T)return;let b=u.data,x=b instanceof ArrayBuffer?b.byteLength:ArrayBuffer.isView(b)?b.byteLength:0;f+=x,i.send(b)}),E.addEventListener("close",I),E.addEventListener("error",I);return}}catch(S){console.warn("Backend VPS relay failed, falling back to direct:",S)}if(d=await ht(y.address,y.port,t.DB),y.rawPayload.byteLength>0){let S=d.writable.getWriter();try{await S.write(y.rawPayload)}finally{S.releaseLock()}}let D=d.readable.getReader();r.waitUntil((async()=>{try{while(!0){let{value:S,done:E}=await D.read();if(E||!S)break;if(f+=S.byteLength,i.readyState!==1)break;if(!w){w=!0;let T=new Uint8Array(v.byteLength+S.byteLength);T.set(v,0),T.set(S,v.byteLength),i.send(T)}else i.send(S)}}catch{}finally{try{D.releaseLock()}catch{}await g()}})())},close(){g()},abort(){g()}}))}catch(m){console.error("VLESS session error:",m),await g()}})()),new Response(null,{status:101,webSocket:c,headers:{"Sec-WebSocket-Extensions":""}})}async function wt(e,t){if(e.byteLength!==t.byteLength)return!1;let r=0;for(let n=0;n<e.byteLength;n++)r|=e[n]^t[n];return r===0}async function Ue(e,t){let r=new TextEncoder,n=await crypto.subtle.digest("SHA-256",r.encode(e)),o=await crypto.subtle.digest("SHA-256",r.encode(t));return wt(new Uint8Array(n),new Uint8Array(o))}async function vt(e){let t=new TextEncoder;return crypto.subtle.importKey("raw",t.encode(e),{name:"HMAC",hash:"SHA-256"},!1,["sign","verify"])}function bt(e){let t=typeof e==="string"?new TextEncoder().encode(e):e,r="";for(let n=0;n<t.length;n++)r+=String.fromCharCode(t[n]);return btoa(r).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}function yt(e){let t=e.replace(/-/g,"+").replace(/_/g,"/");while(t.length%4!==0)t+="=";let r=atob(t),n=new Uint8Array(r.length);for(let o=0;o<r.length;o++)n[o]=r.charCodeAt(o);return n}async function xt(e,t,r=604800){let n={u:e,exp:Math.floor(Date.now()/1000)+r},o=JSON.stringify(n),s=bt(o),a=await vt(t),c=await crypto.subtle.sign("HMAC",a,new TextEncoder().encode(s)),i=bt(new Uint8Array(c));return`${s}.${i}`}async function Et(e,t){let r=e.split(".");if(r.length!==2||!r[0]||!r[1])return null;let[n,o]=r;try{let s=await vt(t),a=await crypto.subtle.sign("HMAC",s,new TextEncoder().encode(n)),c=yt(o);if(!await wt(new Uint8Array(a),c))return null;let l=new TextDecoder().decode(yt(n)),d=JSON.parse(l),p=Math.floor(Date.now()/1000);if(d.exp<p)return null;return d}catch{return null}}var J=new Map,Yt=5,Zt=900000,St=900000;function kt(e){let t=Date.now(),r=J.get(e);if(!r)return{allowed:!0};if(r.lockedUntil>t)return{allowed:!1,retryAfterSeconds:Math.ceil((r.lockedUntil-t)/1000)};if(t-r.firstFailed>St)return J.delete(e),{allowed:!0};return{allowed:!0}}function Ut(e){let t=Date.now(),r=J.get(e);if(!r||t-r.firstFailed>St){J.set(e,{attempts:1,lockedUntil:0,firstFailed:t});return}if(r.attempts++,r.attempts>=Yt)r.lockedUntil=t+Zt}function Lt(e){J.delete(e)}function X(e,t,r,n){return(t.length>0?t:[{label:"Default Edge",address:n,port:443,sni:n,host:n}]).map((s)=>{let a=s.address||n,c=s.port||443,i=s.sni||n,l=s.host||n,d=`${e.name} [${s.label}]`,p=r.includes("ed=")?r:r.includes("?")?`${r}&ed=2560`:`${r}?ed=2560`,h=new URLSearchParams({security:"tls",encryption:"none",type:"ws",headerType:"none",host:l,path:p,sni:i,fp:"chrome"}),f=`vless://${e.uuid}@${a}:${c}?${h.toString()}#${encodeURIComponent(d)}`;return{label:s.label,url:f}})}le();le();function nr(e){let t=new TextEncoder().encode(e),r="";for(let n=0;n<t.length;n++)r+=String.fromCharCode(t[n]);return btoa(r)}function Rt(e){if(!e||e===0)return"0 GB";return(e/1073741824).toFixed(2)+" GB"}async function Ct(e,t,r){if(!e||e.trim().length===0)return j();let n=await tt(r.DB,e.trim());if(!n||!n.is_active)return j();let o=new URL(t.url),s=o.hostname,a=r.WS_PATH||"/api/v1/ws",c=await B(r.DB,s),l=X(n,c.endpoints,a,s).map((k)=>k.url).join(`
`),d=t.headers.get("User-Agent")||"",p=t.headers.get("Accept")||"",h=/v2ray|hiddify|sing-box|clash|shadowrocket|streisand|nekobox|karing|foxray/i.test(d),f=o.searchParams.get("raw")==="1",A=o.searchParams.get("b64")==="1",w=!h&&!f&&!A&&p.includes("text/html"),v=`${o.protocol}//${o.host}/sub/${n.sub_token}`;if(w){let k=ce(v,200),m=n.quota_bytes>0?Rt(n.quota_bytes):"نامحدود / Unlimited",y=Rt(n.used_bytes),_=n.expires_at?new Date(n.expires_at*1000).toLocaleDateString():"همیشگی / Never",P=`<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>اشتراک کاربر ${n.name} | Lumen Edge</title>
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
      <h1>اشتراک اختصاصی ${n.name}</h1>
      <span class="badge">وضعیت: فعال (Active)</span>

      <div class="stats-grid">
        <div class="stat-box">
          <div class="stat-label">میزان مصرف</div>
          <div class="stat-val">${y}</div>
        </div>
        <div class="stat-box">
          <div class="stat-label">حجم مجاز</div>
          <div class="stat-val">${m}</div>
        </div>
        <div class="stat-box" style="grid-column: span 2;">
          <div class="stat-label">تاریخ انقضا</div>
          <div class="stat-val">${_}</div>
        </div>
      </div>

      <div class="qr-box">
        ${k}
      </div>
      <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 1.25rem;">
        بارکد را در نرم‌افزار خود اسکن کنید یا روی دکمه‌های زیر بزنید
      </p>

      <a href="hiddify://install-sub?url=${encodeURIComponent(v)}" class="btn btn-hiddify">
        افزودن به هیدیفای (Hiddify)
      </a>
      <a href="v2rayng://install-sub?url=${encodeURIComponent(v)}" class="btn btn-v2ray">
        افزودن به v2rayNG
      </a>
      <a href="sing-box://import-remote-profile?url=${encodeURIComponent(v)}" class="btn btn-singbox">
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
      navigator.clipboard.writeText("${v}").then(() => {
        const t = document.getElementById("toast");
        t.style.display = "block";
        setTimeout(() => t.style.display = "none", 2500);
      });
    }
  </script>
</body>
</html>`;return new Response(P,{status:200,headers:{"Content-Type":"text/html; charset=utf-8","Cache-Control":"no-cache, no-store, must-revalidate"}})}let U=f?l:nr(l),g={"Content-Type":"text/plain; charset=utf-8","Cache-Control":"no-cache, no-store, must-revalidate","Profile-Update-Interval":"24","Subscription-Userinfo":`upload=0; download=${n.used_bytes}; total=${n.quota_bytes}; expire=${n.expires_at??0}`};return new Response(U,{status:200,headers:g})}function Tt(e,t){return`<!DOCTYPE html>
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
          <div class="form-group" style="margin-top: 0.75rem;">
            <label>Proxy IP (Fallback IP for Direct Mode)</label>
            <input type="text" id="proxy-ip" class="form-control" placeholder="e.g. 1.2.3.4 (Optional)">
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

          document.getElementById("proxy-ip").value = globalSettings.proxy_ip || "";

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
      const proxy_ip = document.getElementById("proxy-ip").value.trim() || undefined;
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
        proxy_ip,
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
</html>`}var Re="lumen_session";function or(e,t){let r=e.headers.get("Cookie");if(!r)return null;let n=r.split(";");for(let o of n){let[s,a]=o.trim().split("=");if(s===t&&a)return decodeURIComponent(a)}return null}function sr(e){return e.headers.get("CF-Connecting-IP")||e.headers.get("X-Forwarded-For")?.split(",")[0]?.trim()||"127.0.0.1"}var C=new Q;C.use("/api/*",async(e,t)=>{let r=e.req.path;if(r==="/api/auth/login"||r==="/api/auth/logout")return t();let n=e.env.SESSION_SECRET||"lumen-default-secret-change-me",o=or(e.req.raw,Re);if(!o)return e.json({error:"Unauthorized"},401);let s=await Et(o,n);if(!s)return e.json({error:"Unauthorized"},401);e.set("jwtPayload",s),await t()});C.post("/api/auth/login",async(e)=>{let t=sr(e.req.raw),r=kt(t);if(!r.allowed)return e.json({error:`Too many failed attempts. Try again in ${r.retryAfterSeconds}s.`},429);let n;try{n=await e.req.json()}catch{return e.json({error:"Invalid JSON"},400)}let o=e.env.ADMIN_USERNAME||"admin",s=e.env.ADMIN_PASSWORD||"lumenadmin",a=e.env.SESSION_SECRET||"lumen-default-secret-change-me",c=await Ue(n.username||"",o),i=await Ue(n.password||"",s);if(!c||!i)return Ut(t),e.json({error:"Invalid username or password"},401);Lt(t);let l=await xt(o,a),d=new URL(e.req.url).protocol==="https:",p=[`${Re}=${encodeURIComponent(l)}`,"Path=/","HttpOnly","SameSite=Strict","Max-Age=604800"];if(d)p.push("Secure");return e.json({success:!0,username:o},200,{"Set-Cookie":p.join("; ")})});C.post("/api/auth/logout",(e)=>{let t=new URL(e.req.url).protocol==="https:",r=[`${Re}=`,"Path=/","HttpOnly","SameSite=Strict","Max-Age=0"];if(t)r.push("Secure");return e.json({success:!0},200,{"Set-Cookie":r.join("; ")})});C.get("/api/auth/me",(e)=>{let t=e.env.ADMIN_USERNAME||"admin";return e.json({authenticated:!0,username:t})});C.get("/api/users",async(e)=>{let t=e.req.query("search")||void 0,r=e.req.query("limit")?Number(e.req.query("limit")):50,n=e.req.query("offset")?Number(e.req.query("offset")):0,o=await rt(e.env.DB,{search:t,limit:r,offset:n});return e.json(o)});C.post("/api/users",async(e)=>{let t;try{t=await e.req.json()}catch{return e.json({error:"Invalid JSON"},400)}if(!t.name||typeof t.name!=="string"||t.name.trim().length===0)return e.json({error:"User name is required"},400);try{let r=await ot(e.env.DB,{name:t.name.trim(),quota_bytes:typeof t.quota_bytes==="number"?t.quota_bytes:0,expires_at:typeof t.expires_at==="number"?t.expires_at:null,note:typeof t.note==="string"?t.note.trim():null,enabled:t.enabled!==!1});return z(),e.json(r,201)}catch(r){return e.json({error:r.message},500)}});C.get("/api/users/:id",async(e)=>{let t=Number(e.req.param("id"));if(isNaN(t))return e.json({error:"Invalid user ID"},400);let r=await O(e.env.DB,t);if(!r)return e.json({error:"User not found"},404);let o=new URL(e.req.url).hostname,s=e.env.WS_PATH||"/api/v1/ws",a=await B(e.env.DB,o),c=X(r,a.endpoints,s,o);return e.json({user:r,links:c})});C.get("/api/users/:id/qr",async(e)=>{let t=Number(e.req.param("id"));if(isNaN(t))return e.text("Invalid user ID",400);let r=await O(e.env.DB,t);if(!r)return e.text("User not found",404);let o=new URL(e.req.url).hostname,s=e.env.WS_PATH||"/api/v1/ws",a=await B(e.env.DB,o),c=X(r,a.endpoints,s,o),i=parseInt(e.req.query("link_index")||"0")||0,l=c[i]||c[0];if(!l)return e.text("No links available",404);await Promise.resolve().then(() => le());let p=ce(l.url,256);return new Response(p,{status:200,headers:{"Content-Type":"image/svg+xml; charset=utf-8","Cache-Control":"private, max-age=60"}})});C.put("/api/users/:id",async(e)=>{let t=Number(e.req.param("id"));if(isNaN(t))return e.json({error:"Invalid user ID"},400);let r;try{r=await e.req.json()}catch{return e.json({error:"Invalid JSON"},400)}let n=await st(e.env.DB,t,r);if(!n)return e.json({error:"User not found"},404);return z(),e.json(n)});C.post("/api/users/:id/reset",async(e)=>{let t=Number(e.req.param("id"));if(isNaN(t))return e.json({error:"Invalid user ID"},400);let r=await it(e.env.DB,t);if(!r)return e.json({error:"User not found"},404);return z(),e.json(r)});C.post("/api/users/:id/regen-uuid",async(e)=>{let t=Number(e.req.param("id"));if(isNaN(t))return e.json({error:"Invalid user ID"},400);let r=await ct(e.env.DB,t);if(!r)return e.json({error:"User not found"},404);return z(),e.json(r)});C.post("/api/users/:id/regen-sub",async(e)=>{let t=Number(e.req.param("id"));if(isNaN(t))return e.json({error:"Invalid user ID"},400);let r=await lt(e.env.DB,t);if(!r)return e.json({error:"User not found"},404);return e.json(r)});C.delete("/api/users/:id",async(e)=>{let t=Number(e.req.param("id"));if(isNaN(t))return e.json({error:"Invalid user ID"},400);if(!await dt(e.env.DB,t))return e.json({error:"User not found"},404);return z(),e.json({success:!0})});C.get("/api/settings",async(e)=>{let t=new URL(e.req.url).hostname,r=await B(e.env.DB,t);return e.json(r)});C.put("/api/settings",async(e)=>{let t;try{t=await e.req.json()}catch{return e.json({error:"Invalid JSON"},400)}if(t.endpoints){if(!Array.isArray(t.endpoints))return e.json({error:"Endpoints must be an array"},400);for(let o of t.endpoints)if(!o.label||!o.address||!o.port)return e.json({error:"Each endpoint must have a label, address, and port"},400)}if(t.outbound_mode){if(!["direct","socks5","backend"].includes(t.outbound_mode))return e.json({error:"Invalid outbound_mode"},400)}await pt(e.env.DB,t);let r=new URL(e.req.url).hostname,n=await B(e.env.DB,r);return e.json({success:!0,settings:n})});var V=new Q;V.all("*",async(e,t)=>{let r=e.env.WS_PATH||"/api/v1/ws";if(new URL(e.req.url).pathname===r){let o=e.req.header("Upgrade");if(!o||o.toLowerCase()!=="websocket")return j();let s={waitUntil:(a)=>{try{e.executionCtx.waitUntil(a)}catch{a.catch((c)=>console.error("Unhandled async task:",c))}}};return gt(e.req.raw,e.env,s)}await t()});V.get("/sub/:token",async(e)=>{let t=e.req.param("token");return Ct(t,e.req.raw,e.env)});V.get("*",async(e,t)=>{let r=e.env.PANEL_PATH||"/_panel",n=new URL(e.req.url);if(n.pathname===r||n.pathname===`${r}/`){let o=e.env.WS_PATH||"/api/v1/ws",s=Tt(r,o);return new Response(s,{status:200,headers:{"Content-Type":"text/html; charset=utf-8","Cache-Control":"no-cache, no-store, must-revalidate"}})}await t()});V.route("/",C);V.get("/",()=>j());var Io=V;export{Io as default};
