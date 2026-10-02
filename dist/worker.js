var Tt=(e,t,n)=>()=>{if(e)try{t=e(e=0)}catch(r){n=[r]}if(n)throw n[0];return t};async function D(e,t){let n=await e.prepare("SELECT key, value FROM settings").all(),r=new Map;if(n.results)for(let p of n.results)r.set(p.key,p.value);let s="direct",o=r.get("outbound_mode");if(o==="socks5"||o==="backend"||o==="direct")s=o;let a=[],i=r.get("endpoints");if(i)try{let p=JSON.parse(i);if(Array.isArray(p))a=p}catch{a=[]}if(a.length===0&&t)a=[{label:"Default Edge",address:t,port:443,sni:t,host:t},{label:"MCI Clean 1 (Speed)",address:"speed.cloudflare.com",port:443,sni:t,host:t},{label:"MCI Clean 2 (Anycast)",address:"104.16.132.229",port:443,sni:t,host:t},{label:"MCI Clean 3 (CF DNS)",address:"162.159.192.1",port:443,sni:t,host:t},{label:"MCI Clean 4 (172.64)",address:"172.64.155.249",port:443,sni:t,host:t},{label:"MCI Alt Port (8443)",address:"104.17.80.1",port:8443,sni:t,host:t},{label:"MCI Alt Port (2053)",address:"104.20.74.82",port:2053,sni:t,host:t}];let d,c=r.get("socks5_config");if(c)try{d=JSON.parse(c)}catch{d=void 0}let l,m=r.get("backend_config");if(m)try{l=JSON.parse(m)}catch{l=void 0}return{outbound_mode:s,endpoints:a,socks5_config:d,backend_config:l}}async function ut(e,t){let n=[];if(t.outbound_mode!==void 0)n.push(e.prepare("INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value").bind("outbound_mode",t.outbound_mode));if(t.endpoints!==void 0)n.push(e.prepare("INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value").bind("endpoints",JSON.stringify(t.endpoints)));if(t.socks5_config!==void 0)n.push(e.prepare("INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value").bind("socks5_config",JSON.stringify(t.socks5_config)));if(t.backend_config!==void 0)n.push(e.prepare("INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value").bind("backend_config",JSON.stringify(t.backend_config)));if(n.length>0)await e.batch(n)}function Lt(e,t){if(e===0||t===0)return 0;return ae[Le[e]+Le[t]]}function Xt(e,t){let n=Array(e.length+t.length-1).fill(0);for(let r=0;r<e.length;r++)for(let s=0;s<t.length;s++)n[r+s]^=Lt(e[r],t[s]);return n}function Yt(e){let t=[1];for(let n=0;n<e;n++)t=Xt(t,[1,ae[n]]);return t}function Zt(e,t){let n=Yt(t),r=new Uint8Array(e.length+t);r.set(e,0);for(let s=0;s<e.length;s++){let o=r[s];if(o!==0)for(let a=0;a<n.length;a++)r[s+a]^=Lt(n[a],o)}return r.subarray(e.length)}function ie(e,t=256){let n=new TextEncoder().encode(e),r=n.length,s=null;for(let u of Ue){let x=u[0],E=u[1],C=u[2],O=E-C,It=4+(x<=9?8:16)+r*8;if(Math.ceil(It/8)<=O){s=u;break}}if(!s)s=Ue[Ue.length-1];let[o,a,i]=s,d=a-i,c=o*4+17,l=[],m=(u,x)=>{for(let E=x-1;E>=0;E--)l.push(u>>>E&1)};m(4,4);let p=o<=9?8:16;m(r,p);for(let u=0;u<r;u++)m(n[u],8);let f=d*8,U=Math.min(4,f-l.length);m(0,U);while(l.length%8!==0)l.push(0);let b=[236,17],v=0;while(l.length<f)m(b[v%2],8),v++;let S=new Uint8Array(d);for(let u=0;u<d;u++){let x=0;for(let E=0;E<8;E++)x=x<<1|l[u*8+E];S[u]=x}let g=Zt(S,i),L=new Uint8Array(a);L.set(S,0),L.set(g,d);let h=Array.from({length:c},()=>Array(c).fill(null)),_=(u,x)=>{for(let E=-1;E<=7;E++)for(let C=-1;C<=7;C++){let O=u+E,j=x+C;if(O<0||O>=c||j<0||j>=c)continue;if(E>=0&&E<=6&&(C===0||C===6)||C>=0&&C<=6&&(E===0||E===6)||E>=2&&E<=4&&C>=2&&C<=4)h[O][j]=1;else h[O][j]=0}};_(0,0),_(0,c-7),_(c-7,0);for(let u=8;u<c-8;u++){if(h[6][u]===null)h[6][u]=u%2===0?1:0;if(h[u][6]===null)h[u][6]=u%2===0?1:0}h[4*o+9][8]=1;for(let u=0;u<=8;u++){if(h[8][u]===null)h[8][u]=0;if(h[u][8]===null)h[u][8]=0}for(let u=c-8;u<c;u++){if(h[8][u]===null)h[8][u]=0;if(h[u][8]===null)h[u][8]=0}let y=0,w=[];for(let u=0;u<L.length;u++)for(let x=7;x>=0;x--)w.push(L[u]>>>x&1);let k=!0;for(let u=c-1;u>0;u-=2){if(u===6)u--;let x=k?Array.from({length:c},(E,C)=>c-1-C):Array.from({length:c},(E,C)=>C);for(let E of x)for(let C of[u,u-1])if(h[E][C]===null){let O=y<w.length?w[y++]:0,j=(E+C)%2===0?1:0;h[E][C]=O^j}k=!k}let I=30660;for(let u=0;u<15;u++){let x=I>>>14-u&1;if(u<=5)h[8][u]=x;else if(u===6)h[8][7]=x;else if(u===7)h[8][8]=x;else if(u===8)h[7][8]=x;else h[14-u][8]=x;if(u<8)h[c-1-u][8]=x;else h[8][c-15+u]=x}let A=4,P=c+A*2,z=[];for(let u=0;u<c;u++)for(let x=0;x<c;x++)if(h[u][x]===1)z.push(`<rect x="${x+A}" y="${u+A}" width="1" height="1"/>`);return`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${P} ${P}" width="${t}" height="${t}" fill="currentColor" shape-rendering="crispEdges">
    <rect width="${P}" height="${P}" fill="#ffffff"/>
    <g fill="#000000">
      ${z.join("")}
    </g>
  </svg>`}var ae,Le,Ue;var ce=Tt(()=>{ae=new Uint8Array(512),Le=new Uint8Array(256);(()=>{let e=1;for(let t=0;t<255;t++)ae[t]=e,ae[t+255]=e,Le[e]=t,e=e<<1^(e>=128?285:0)})();Ue=[[1,26,7,0],[2,44,10,7],[3,70,15,7],[4,100,20,7],[5,134,26,7],[6,172,36,7],[7,196,40,0],[8,242,48,0],[9,292,60,0],[10,346,72,0],[11,404,80,0],[12,466,96,0],[13,532,104,0],[14,581,120,3],[15,655,132,3]]});var Ce=Symbol();var Re=(e,t)=>new Response(e,{headers:{"Content-Type":t.replace(/^[^;]+/,(n)=>n.toLowerCase())}}).formData();var Pt=1e4,X=(e)=>("headers"in e),Pe=async(e,t=Object.create(null))=>{let{all:n=!1,dot:r=!1}=t,s=(X(e)?e.headers:e.raw.headers).get("Content-Type")?.split(";")[0].trim().toLowerCase();if(s==="multipart/form-data"||s==="application/x-www-form-urlencoded")return _t(e,{all:n,dot:r});return{}};async function _t(e,t){if(!X(e)&&e.bodyCache.formData)return Ie(await e.bodyCache.formData,t);let n=X(e)?e.headers:e.raw.headers,r=await e.arrayBuffer(),s=Re(r,n.get("Content-Type")||"");if(!X(e))e.bodyCache.formData=s;let o=await s;if(o)return Ie(o,t);return{}}function Ie(e,t){let n=Object.create(null),r={count:0};if(e.forEach((s,o)=>{if(!(t.all||o.endsWith("[]")))n[o]=s;else Dt(n,o,s)}),t.dot)Object.entries(n).forEach(([s,o])=>{if(s.includes("."))Bt(n,s,o,r),delete n[s]});return n}var Dt=(e,t,n)=>{if(e[t]!==void 0)if(Array.isArray(e[t]))e[t].push(n);else e[t]=[e[t],n];else if(!t.endsWith("[]"))e[t]=n;else e[t]=[n]},Bt=(e,t,n,r)=>{if(/(?:^|\.)__proto__\./.test(t))return;let s=e,o=t.split(".",34);if(o.length>33)Te();o.forEach((a,i)=>{if(i===o.length-1)s[a]=n;else{if(!s[a]||typeof s[a]!=="object"||Array.isArray(s[a])||s[a]instanceof File){if(r.count++>=Pt)Te();s[a]=Object.create(null)}s=s[a]}})},Te=()=>{throw Error("Nesting limit exceeded")};var le=(e)=>{let t=e.split("/");if(t[0]==="")t.shift();return t},_e=(e)=>{let{groups:t,path:n}=Ot(e),r=le(n);return Mt(r,t)},Ot=(e)=>{let t=[];return e=e.replace(/\{[^}]+\}/g,(n,r)=>{let s=`@${r}`;return t.push([s,n]),s}),{groups:t,path:e}},Mt=(e,t)=>{for(let n=t.length-1;n>=0;n--){let[r]=t[n];for(let s=e.length-1;s>=0;s--)if(e[s].includes(r)){e[s]=e[s].replace(r,t[n][1]);break}}return e},Y={},De=(e,t)=>{if(e==="*")return"*";let n=e.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);if(n){let r=`${e}#${t}`;if(!Y[r])if(n[2])Y[r]=t&&t[0]!==":"&&t[0]!=="*"?[r,n[1],new RegExp(`^${n[2]}(?=/${t})`)]:[e,n[1],new RegExp(`^${n[2]}$`)];else Y[r]=[e,n[1],!0];return Y[r]}return null},Be=(e,t)=>{try{return t(e)}catch{return e.replace(/(?:%[0-9A-Fa-f]{2})+/g,(n)=>{try{return t(n)}catch{return n}})}},Nt=(e)=>Be(e,decodeURI),ue=(e)=>{let t=e.url,n=t.indexOf("/",t.indexOf(":")+4),r=n;for(;r<t.length;r++){let s=t.charCodeAt(r);if(s===37){let o=t.indexOf("?",r),a=t.indexOf("#",r),i=o===-1?a===-1?void 0:a:a===-1?o:Math.min(o,a),d=t.slice(n,i);return Nt(d.includes("%25")?d.replace(/%25/g,"%2525"):d)}else if(s===63||s===35)break}return t.slice(n,r)};var Oe=(e)=>{let t=ue(e);return t.length>1&&t.at(-1)==="/"?t.slice(0,-1):t},M=(e,t,...n)=>{if(n.length)t=M(t,...n);return`${e?.[0]==="/"?"":"/"}${e}${t==="/"?"":`${e?.at(-1)==="/"?"":"/"}${t?.[0]==="/"?t.slice(1):t}`}`},Z=(e)=>{if(e.charCodeAt(e.length-1)!==63||!e.includes(":"))return null;let t=e.split("/"),n=[],r="";return t.forEach((s)=>{if(s!==""&&!/\:/.test(s))r+="/"+s;else if(/\:/.test(s))if(s.charCodeAt(s.length-1)===63){if(n.length===0&&r==="")n.push("/");else n.push(r);let o=s.slice(0,-1);r+="/"+o,n.push(r)}else r+="/"+s}),n.filter((s,o,a)=>a.indexOf(s)===o)},ee=(e)=>e.indexOf("%")!==-1?Be(e,qt):e,de=(e)=>{if(e.indexOf("+")!==-1)e=e.replace(/\+/g," ");return ee(e)},Me=(e,t,n)=>{let r=e.indexOf("#",8);if(r!==-1)e=e.slice(0,r);let s;if(!n&&t&&t.indexOf("%")===-1&&t.indexOf("+")===-1){let i=e.indexOf("?",8);if(i===-1)return;if(!e.startsWith(t,i+1))i=e.indexOf(`&${t}`,i+1);while(i!==-1){let d=e.charCodeAt(i+t.length+1);if(d===61){let c=i+t.length+2,l=e.indexOf("&",c);return de(e.slice(c,l===-1?void 0:l))}else if(d==38||isNaN(d))return"";i=e.indexOf(`&${t}`,i+1)}if(s=/[%+]/.test(e),!s)return}let o=Object.create(null);s??=/[%+]/.test(e);let a=e.indexOf("?",8);while(a!==-1){let i=e.indexOf("&",a+1),d=e.indexOf("=",a);if(d>i&&i!==-1)d=-1;let c=e.slice(a+1,d===-1?i===-1?void 0:i:d);if(s)c=de(c);if(a=i,c==="")continue;let l;if(d===-1)l="";else if(l=e.slice(d+1,i===-1?void 0:i),s)l=de(l);if(n){if(!(o[c]&&Array.isArray(o[c])))o[c]=[];o[c].push(l)}else o[c]??=l}return t?o[t]:o},Ne=Me,qe=(e,t)=>Me(e,t,!0),qt=decodeURIComponent;var je=class{raw;#t;#e;routeIndex=0;path;bodyCache={};constructor(e,t="/",n=[[]]){this.raw=e,this.path=t,this.#e=n}param(e){return e?this.#n(e):this.#o()}#n(e){let t=this.#e[0][this.routeIndex]?.[1][e],n=this.#r(t);return n&&ee(n)}#o(){let e={},t=Object.keys(this.#e[0][this.routeIndex]?.[1]??{});for(let n of t){let r=this.#r(this.#e[0][this.routeIndex][1][n]);if(r!==void 0)e[n]=ee(r)}return e}#r(e){return this.#e[1]?this.#e[1][e]:e}query(e){return Ne(this.url,e)}queries(e){return qe(this.url,e)}header(e){if(e)return this.raw.headers.get(e)??void 0;let t=Object.create(null);return this.raw.headers.forEach((n,r)=>{t[r]=n}),t}async parseBody(e){return Pe(this,e)}#s=(e)=>{let{bodyCache:t,raw:n}=this,r=t[e];if(r)return r;for(let s in t)return t[s].then((o)=>{if(s==="json")o=JSON.stringify(o);let a=s==="formData"?void 0:n.headers.get("content-type");return new Response(o,{headers:a?{"Content-Type":a}:void 0})[e]()});return t[e]=n[e]()};json(){return this.#s("text").then((e)=>JSON.parse(e))}text(){return this.#s("text")}arrayBuffer(){return this.#s("arrayBuffer")}bytes(){return this.#s("arrayBuffer").then((e)=>new Uint8Array(e))}blob(){return this.#s("blob")}formData(){return this.#s("formData")}addValidatedData(e,t){(this.#t??={})[e]=t}valid(e){return this.#t?.[e]}get url(){return this.raw.url}get method(){return this.raw.method}get[Ce](){return this.#e}get matchedRoutes(){return this.#e[0].map(([[,e]])=>e)}get routePath(){return this.#e[0].map(([[,e]])=>e)[this.routeIndex].path}};var $e={Stringify:1,BeforeStream:2,Stream:3},jt=(e,t)=>{let n=new String(e);return n.isEscaped=!0,n.callbacks=t,n};var me=async(e,t,n,r,s)=>{if(typeof e==="object"&&!(e instanceof String)){if(!(e instanceof Promise))e=e.toString();if(e instanceof Promise)e=await e}let o=e.callbacks;if(!o?.length)return Promise.resolve(e);if(s)s[0]+=e;else s=[e];let a=Promise.all(o.map((i)=>i({phase:t,buffer:s,context:r}))).then((i)=>Promise.all(i.filter(Boolean).map((d)=>me(d,t,!1,r,s))).then(()=>s[0]));if(n)return jt(await a,o);else return a};var $t="text/plain; charset=UTF-8",pe=(e,t)=>({"Content-Type":e,...t}),G=(e,t)=>new Response(e,t),fe=class{#t;#e;env={};#n;finalized=!1;error;#o;#r;#s;#l;#c;#d;#i;#u;#m;constructor(e,t){if(this.#t=e,t)this.#r=t.executionCtx,this.env=t.env,this.#d=t.notFoundHandler,this.#m=t.path,this.#u=t.matchResult}get req(){return this.#e??=new je(this.#t,this.#m,this.#u),this.#e}get event(){if(this.#r&&"respondWith"in this.#r)return this.#r;else throw Error("This context has no FetchEvent")}get executionCtx(){if(this.#r)return this.#r;else throw Error("This context has no ExecutionContext")}get res(){return this.#s||=G(null,{headers:this.#i??=new Headers})}set res(e){if(this.#s&&e){e=G(e.body,e);for(let[t,n]of this.#s.headers.entries()){if(t==="content-type")continue;if(t==="set-cookie"){let r=this.#s.headers.getSetCookie();e.headers.delete("set-cookie");for(let s of r)e.headers.append("set-cookie",s)}else e.headers.set(t,n)}}this.#s=e,this.finalized=!0}render=(...e)=>(this.#c??=(t)=>this.html(t),this.#c(...e));setLayout=(e)=>this.#l=e;getLayout=()=>this.#l;setRenderer=(e)=>{this.#c=e};header=(e,t,n)=>{if(this.finalized)this.#s=G(this.#s.body,this.#s);let r=this.#s?this.#s.headers:this.#i??=new Headers;if(t===void 0)r.delete(e);else if(n?.append)r.append(e,t);else r.set(e,t)};status=(e)=>{this.#o=e};set=(e,t)=>{this.#n??=new Map,this.#n.set(e,t)};get=(e)=>this.#n?this.#n.get(e):void 0;get var(){if(!this.#n)return{};return Object.fromEntries(this.#n)}#a(e,t,n){let r=this.#s?new Headers(this.#s.headers):this.#i;if(typeof t==="object"&&t.headers){r??=new Headers;for(let[o,a]of new Headers(t.headers))if(o==="set-cookie")r.append(o,a);else r.set(o,a)}if(n){if(!r){let o=0;for(let a in n)if(++o>1||typeof n[a]!=="string"){r=new Headers;break}}if(r)for(let o in n){let a=n[o];if(typeof a==="string")r.set(o,a);else{r.delete(o);for(let i of a)r.append(o,i)}}}let s=typeof t==="number"?t:t?.status??this.#o;return G(e,{status:s,headers:r??n})}newResponse=(...e)=>this.#a(...e);body=(e,t,n)=>this.#a(e,t,n);text=(e,t,n)=>!this.#i&&!this.#o&&!t&&!n&&!this.finalized?new Response(e):this.#a(e,t,pe($t,n));json=(e,t,n)=>this.#a(JSON.stringify(e),t,pe("application/json",n));html=(e,t,n)=>{let r=(s)=>this.#a(s,t,pe("text/html; charset=UTF-8",n));return typeof e==="object"?me(e,$e.Stringify,!1,{}).then(r):r(e)};redirect=(e,t)=>{let n=String(e);return this.header("Location",!/[^\x00-\xFF]/.test(n)?n:encodeURI(n)),this.newResponse(null,t??302)};notFound=()=>(this.#d??=()=>G(),this.#d(this))};var he=(e,t,n)=>(r,s)=>{let o=-1;return a(0);async function a(i){if(i<=o)throw Error("next() called multiple times");o=i;let d,c=!1,l;if(e[i])l=e[i][0][0],r.req.routeIndex=i;else l=i===e.length&&s||void 0;if(l)try{d=await l(r,()=>a(i+1))}catch(m){if(m instanceof Error&&t)r.error=m,d=await t(m,r),c=!0;else throw m}else if(r.finalized===!1&&n)d=await n(r);if(d&&(r.finalized===!1||c))r.res=d;return r}};var He=["get","post","put","delete","options","patch","query"],te="Can not add a route since the matcher is already built.",ne=class extends Error{};var Fe="__COMPOSED_HANDLER";var Ht=(e)=>e.text("404 Not Found",404),ze=(e,t)=>{if("getResponse"in e){let n=e.getResponse();return t.newResponse(n.body,n)}return console.error(e),t.text("Internal Server Error",500)},We=class e{get;post;put;delete;options;patch;query;all;on;use;router;getPath;_basePath="/";#t="/";routes=[];constructor(t={}){[...He,"all"].forEach((s)=>{this[s]=(o,...a)=>{let i=s.toUpperCase();if(typeof o==="string")this.#t=o;else this.#o(i,this.#t,o);return a.forEach((d)=>{this.#o(i,this.#t,d)}),this}}),this.on=(s,o,...a)=>{for(let i of[o].flat()){this.#t=i;for(let d of[s].flat()){let c=d.toUpperCase();for(let l of a)this.#o(c,this.#t,l)}}return this},this.use=(s,...o)=>{if(typeof s==="string")this.#t=s;else this.#t="*",o.unshift(s);return o.forEach((a)=>{this.#o("ALL",this.#t,a)}),this};let{strict:n,...r}=t;Object.assign(this,r),this.getPath=n??!0?t.getPath??ue:Oe}#e(){let t=new e({router:this.router,getPath:this.getPath});return t.errorHandler=this.errorHandler,t.#n=this.#n,t.routes=this.routes,t}#n=Ht;errorHandler=ze;route(t,n){let r=this.basePath(t);return n.routes.map((s)=>{let o;if(n.errorHandler===ze)o=s.handler;else o=async(a,i)=>(await he([],n.errorHandler)(a,()=>s.handler(a,i))).res,o[Fe]=s.handler;r.#o(s.method,s.path,o,s.basePath)}),this}basePath(t){let n=this.#e();return n._basePath=M(this._basePath,t),n}onError=(t)=>(this.errorHandler=t,this);notFound=(t)=>(this.#n=t,this);mount(t,n,r){let s,o;if(r)if(typeof r==="function")o=r;else if(o=r.optionHandler,r.replaceRequest===!1)s=(d)=>d;else s=r.replaceRequest;let a=o?(d)=>{let c=o(d);return Array.isArray(c)?c:[c]}:(d)=>{let c=void 0;try{c=d.executionCtx}catch{}return[d.env,c]};s||=(()=>{let d=M(this._basePath,t),c=d==="/"?0:d.length;return(l)=>{let m=new URL(l.url);return m.pathname=this.getPath(l).slice(c)||"/",new Request(m,l)}})();let i=async(d,c)=>{let l=await n(s(d.req.raw),...a(d));if(l)return l;await c()};return this.#o("ALL",M(t,"*"),i),this}#o(t,n,r,s){n=M(this._basePath,n);let o={basePath:s!==void 0?M(this._basePath,s):this._basePath,path:n,method:t,handler:r};this.router.add(t,n,[r,o]),this.routes.push(o)}#r(t,n){if(t instanceof Error)return this.errorHandler(t,n);throw t}#s(t,n,r,s){if(s==="HEAD")return(async()=>new Response(null,await this.#s(t,n,r,"GET")))();let o=this.getPath(t,{env:r}),a=this.router.match(s,o),i=new fe(t,{path:o,matchResult:a,env:r,executionCtx:n,notFoundHandler:this.#n});if(a[0].length===1){let c;try{c=a[0][0][0][0](i,async()=>{i.res=await this.#n(i)})}catch(l){return this.#r(l,i)}return c instanceof Promise?c.then((l)=>l||(i.finalized?i.res:this.#n(i))).catch((l)=>this.#r(l,i)):c??this.#n(i)}let d=he(a[0],this.errorHandler,this.#n);return(async()=>{try{let c=await d(i);if(!c.finalized)throw Error("Context is not finalized. Did you forget to return a Response object or `await next()`?");return c.res}catch(c){return this.#r(c,i)}})()}fetch=(t,...n)=>this.#s(t,n[1],n[0],t.method);request=(t,n,r,s)=>{if(t instanceof Request)return this.fetch(n?new Request(t,n):t,r,s);return t=t.toString(),this.fetch(new Request(/^https?:\/\//.test(t)?t:`http://localhost${M("/",t)}`,n),r,s)};fire=()=>{addEventListener("fetch",(t)=>{t.respondWith(this.#s(t.request,t,void 0,t.request.method))})}};var R=()=>Object.create(null);var re=[];function ge(e,t){let n=this.buildAllMatchers(),r=(s,o)=>{let a=n[s]||n.ALL,i=a[2][o];if(i)return i;let d=o.match(a[0]);if(!d)return[[],re];let c=d.indexOf("",1);return[a[1][c],d]};return this.match=r,r(e,t)}var be="[^/]+";var ye="(?:|/.*)",N=Symbol(),Ve=new Set(".\\+*[^]$()");function Ft(e,t){if(e.length===1)return t.length===1?e<t?-1:1:-1;if(t.length===1)return 1;if(e===".*"||e==="(?:|/.*)")return t==="(?:|/.*)"?-1:1;else if(t===".*"||t==="(?:|/.*)")return-1;if(e==="[^/]+")return 1;else if(t==="[^/]+")return-1;return e.length===t.length?e<t?-1:1:t.length-e.length}var Ge=class e{#t;#e;#n=R();insert(t,n,r,s,o){let a=this;for(let i=0,d=t.length;i<d;i++){let c=t[i],l=c.length===1?c==="*"?i===d-1?["","",".*"]:["","",be]:null:c==="/*"?["","",ye]:c.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/),m;if(l){let p=l[1],f=l[2]||"[^/]+";if(p&&l[2]){if(f===".*")throw N;if(f=f.replace(/^\((?!\?:)(?=[^)]+\)$)/,"(?:"),/\((?!\?:)/.test(f))throw N;if(f.length===1&&Ve.has(f))throw N}if(m=a.#n[f],!m){if(f!==".*"&&f!=="(?:|/.*)"){for(let U in a.#n)if((f.length>1||U.length>1)&&U!==".*"&&U!=="(?:|/.*)")throw N}m=a.#n[f]=new e}if(p!=="")m.#e??=s.varIndex++,r.push([p,m.#e])}else if(m=a.#n[c],!m){for(let p in a.#n)if(p.length>1&&p!==".*"&&p!=="(?:|/.*)")throw N;m=a.#n[c]=new e}a=m}if(a.#t!==void 0)throw N;a.#t=o?-1:n}buildRegExpStr(){let t=Object.keys(this.#n).sort(Ft).map((n)=>{let r=this.#n[n],s=r.buildRegExpStr();return s===""?"":(typeof r.#e==="number"?`(${n})@${r.#e}`:Ve.has(n)?`\\${n}`:n)+s}).filter(Boolean);if(typeof this.#t==="number"&&this.#t!==-1)t.unshift(`#${this.#t}`);if(t.length===0)return"";if(t.length===1)return t[0];return"(?:"+t.join("|")+")"}};var we=class{#t={varIndex:0};#e=new Ge;#n=0;paths=R();insert(e,t){if(t){this.#e.insert(e.split(""),0,[],this.#t,!0);return}let n=[],r=[],s=e;for(let a=0;;){let i=!1;if(s=s.replace(/\{[^}]+\}/g,(d)=>{let c=`@\\${a}`;return r[a]=[c,d],a++,i=!0,c}),!i)break}let o=s.match(/(?::[^\/]+)|(?:\/\*$)|./g)||[];for(let a=r.length-1;a>=0;a--){let[i]=r[a];for(let d=o.length-1;d>=0;d--)if(o[d].indexOf(i)!==-1){o[d]=o[d].replace(i,r[a][1]);break}}this.#e.insert(o,this.#n,n,this.#t,!1),this.paths[e]=[this.#n++,n]}buildRegExp(){let e=this.#e.buildRegExpStr();if(e==="")return[/^$/,[],[]];let t=0,n=[],r=[];return e=e.replace(/#(\d+)|@(\d+)|\.\*\$/g,(s,o,a)=>{if(o!==void 0)return n[++t]=Number(o),"$()";if(a!==void 0)return r[Number(a)]=++t,"";return""}),[new RegExp(`^${e}`),n,r]}};var Ke=R();function Qe(e){return Ke[e]??=new RegExp(`^${e.replace(/\/:[^/{}]+(?:\{\[\^\/]\+})?(?=[/{]|$)|\/?\*$|([.\\+*[^\]$()?{}|])/g,(t,n)=>n?`\\${n}`:t==="/*"?ye:t==="*"?".*":`/:${be}`)}$`)}function se(e,t){for(let n of Object.keys(e).sort((r,s)=>s.length-r.length))if(Qe(n).test(t))return[...e[n]]}var oe=class{name="RegExpRouter";#t;#e;#n;constructor(){this.#t={["ALL"]:R()},this.#e={["ALL"]:R()},this.#n={["ALL"]:new we}}#o(e,t){try{this.#n[e].insert(t,!/\*|\/:/.test(t))}catch(n){throw n===N?new ne(t):n}}add(e,t,n){let r=this.#t,s=this.#e;if(!r)throw Error(te);if(!r[e]){this.#n[e]=new we;for(let i of[r,s]){i[e]=R();for(let d in i.ALL)i[e][d]=[...i.ALL[d]],this.#o(e,d)}}if(t==="/*")t="*";let o=e==="ALL"?Object.keys(r):[e];if(/\*$/.test(t)){let i=Qe(t);for(let d of o)if(!r[d][t])this.#o(d,t),r[d][t]=se(r[d],t)||se(r.ALL,t)||[];for(let d of[r,s])for(let c of o)for(let l in d[c])i.test(l)&&d[c][l].push([n,t]);return}let a=Z(t)||[t];for(let i of a)for(let d of o){if(!s[d][i])this.#o(d,i),s[d][i]=se(r[d],i)||se(r.ALL,i)||[];s[d][i].push([n,i])}}match=ge;buildAllMatchers(){let e=R();for(let t of Object.keys(this.#e))e[t]=this.#r(t);return this.#t=this.#e=this.#n=void 0,Ke=R(),e}#r(e){let t=this.#t[e],n=this.#e[e],r=this.#n[e],s=R(),o=[],[a,i,d]=r.buildRegExp();for(let c of[t,n])for(let l in c){let m=c[l],p=r.paths[l];if(!p){s[l]=[m.map(([f])=>[f,R()]),re];continue}o[p[0]]=m.map(([f,U])=>[f,r.paths[U][1].reduceRight((b,[v],S)=>(b[v]=d[p[1][S][1]],b),R())])}return[a,i.map((c)=>o[c]),s]}};var Je=class{name="SmartRouter";#t=[];#e=[];constructor(e){this.#t=e.routers}add(e,t,n){if(!this.#e)throw Error(te);this.#e.push([e,t,n])}match(e,t){if(!this.#e)throw Error("Fatal error");let n=this.#t,r=this.#e,s=n.length,o=0,a;for(;o<s;o++){let i=n[o];try{for(let d=0,c=r.length;d<c;d++)i.add(...r[d]);a=i.match(e,t)}catch(d){if(d instanceof ne)continue;throw d}this.match=i.match.bind(i),this.#t=[i],this.#e=void 0;break}if(o===s)throw Error("Fatal error");return this.name=`SmartRouter + ${this.activeRouter.name}`,a}get activeRouter(){if(this.#e||this.#t.length!==1)throw Error("No active router has been determined yet.");return this.#t[0]}};var ve=R(),zt=0,Xe=class e{#t=[];#e=R();#n=[];#o;#r=ve;insert(t,n,r){let s=this,o=_e(n),a=new Set,i=0;for(let d of o){let c=o[++i],l=De(d,c)||(c===void 0&&d&&d.indexOf("*")===d.length-1?d:null),m=Array.isArray(l),p=m?l[0]:l||d,f=s.#e[p]||=new e;if(l&&!f.#o)f.#o=l,s.#n.push(f);if(s=f,m)a.add(l[1])}s.#t.push({[t]:{handler:r,possibleKeys:[...a],score:++zt}})}#s(t,n,r,s,o){for(let a=0,i=n.#t.length;a<i;a++){let d=n.#t[a],c=d[r]||d.ALL;if(c){c.params=R(),t.push(c);for(let l=0,m=c.possibleKeys.length;l<m;l++){let p=c.possibleKeys[l];c.params[p]=o?.[p]&&!l?o[p]:s[p]??o?.[p]}}}}search(t,n){let r=[];this.#r=ve;let s=[this],o=le(n),a=[],i=o.length,d=null;for(let c=0;c<i;c++){let l=o[c],m=c===i-1,p=[];for(let U=0,b=s.length;U<b;U++){let v=s[U],S=v.#e[l];if(S)if(S.#r=v.#r,m){if(S.#e["*"])this.#s(r,S.#e["*"],t,v.#r);this.#s(r,S,t,v.#r)}else p.push(S);for(let g of v.#n){let L=g.#o,h=v.#r===ve?{}:{...v.#r};if(typeof L==="string"){if(L==="*"||l.startsWith(L.slice(0,-1))){if(this.#s(r,g,t,v.#r),L==="*")g.#r=h,p.push(g)}continue}let[,_,y]=L;if(!l&&y===!0)continue;if(y!==!0){if(!d){d=[];let I=n[0]==="/"?1:0;for(let A=0;A<i;A++)d[A]=I,I+=o[A].length+1}let w=n.slice(d[c]),k=y.exec(w);if(k){if(h[_]=k[0],this.#s(r,g,t,v.#r,h),k[0].length===w.length&&g.#e["*"])this.#s(r,g.#e["*"],t,v.#r,h);for(let I in g.#e){g.#r=h;let A=k[0].match(/\//g)?.length??0;(a[A]||=[]).push(g);break}continue}}if(y===!0||y.test(l))if(h[_]=l,m){if(this.#s(r,g,t,h,v.#r),g.#e["*"])this.#s(r,g.#e["*"],t,h,v.#r)}else g.#r=h,p.push(g)}}let f=a.shift();s=f?p.concat(f):p}if(r[1])r.sort((c,l)=>c.score-l.score);return[r.map(({handler:c,params:l})=>[c,l])]}};var xe=class{name="TrieRouter";#t=new Xe;add(e,t,n){for(let r of Z(t)||[t])this.#t.insert(e,r,n)}match(e,t){return this.#t.search(e,t)}};var K=class extends We{constructor(e={}){super(e);this.router=e.router??new Je({routers:[new oe,new xe]})}};function Wt(e,t=0){if(e.length<t+16)throw Error("Buffer too short for UUID");let n=[];for(let r=0;r<16;r++){let s=e[t+r];n.push((s<16?"0":"")+s.toString(16))}return[n.slice(0,4).join(""),n.slice(4,6).join(""),n.slice(6,8).join(""),n.slice(8,10).join(""),n.slice(10,16).join("")].join("-").toLowerCase()}function Ye(e){if(e.length<22)return null;let t=0,n=e[t++],r=Wt(e,t);t+=16;let s=e[t++];if(t+=s,e.length<t+4)return null;let o=e[t++],i=new DataView(e.buffer,e.byteOffset+t,2).getUint16(0,!1);t+=2;let d=e[t++],c="";if(d===1){if(e.length<t+4)return null;c=[e[t++],e[t++],e[t++],e[t++]].join(".")}else if(d===2){if(e.length<t+1)return null;let m=e[t++];if(e.length<t+m)return null;c=new TextDecoder().decode(e.subarray(t,t+m)),t+=m}else if(d===3){if(e.length<t+16)return null;let m=[],p=new DataView(e.buffer,e.byteOffset+t,16);for(let f=0;f<8;f++)m.push(p.getUint16(f*2,!1).toString(16));c=m.join(":"),t+=16}else return null;let l=e.subarray(t);return{version:n,uuid:r,command:o,port:i,addressType:d,address:c,rawPayload:l}}function Ze(){return new Uint8Array([0,0])}function Ee(e){let t=Math.floor(Date.now()/1000),n=e.expires_at!==null&&e.expires_at>0&&e.expires_at<t,r=e.quota_bytes>0&&e.used_bytes>=e.quota_bytes,s=e.enabled===1&&!n&&!r;return{id:e.id,name:e.name,uuid:e.uuid,sub_token:e.sub_token,enabled:e.enabled===1,quota_bytes:e.quota_bytes,used_bytes:e.used_bytes,expires_at:e.expires_at,note:e.note,created_at:e.created_at,is_active:s}}async function B(e,t){let n=await e.prepare("SELECT * FROM users WHERE id = ?").bind(t).first();return n?Ee(n):null}async function et(e,t){let n=await e.prepare("SELECT * FROM users WHERE sub_token = ?").bind(t).first();return n?Ee(n):null}async function tt(e,t={}){let n=t.limit&&t.limit>0?t.limit:50,r=t.offset&&t.offset>=0?t.offset:0,s=t.search?`%${t.search.trim()}%`:null,o="SELECT COUNT(*) as count FROM users",a="SELECT * FROM users",i=[];if(s)o+=" WHERE name LIKE ? OR note LIKE ? OR uuid LIKE ?",a+=" WHERE name LIKE ? OR note LIKE ? OR uuid LIKE ?",i.push(s,s,s);a+=" ORDER BY id DESC LIMIT ? OFFSET ?";let c=(await e.prepare(o).bind(...i).first())?.count??0;return{users:((await e.prepare(a).bind(...i,n,r).all()).results||[]).map(Ee),total:c}}async function nt(e){let t=Math.floor(Date.now()/1000),{results:n}=await e.prepare(`SELECT uuid FROM users 
       WHERE enabled = 1 
         AND (expires_at IS NULL OR expires_at = 0 OR expires_at > ?)
         AND (quota_bytes = 0 OR used_bytes < quota_bytes)`).bind(t).all(),r=new Set;if(n){for(let s of n)if(s.uuid)r.add(s.uuid.toLowerCase())}return r}async function rt(e,t){let n=(t.uuid||crypto.randomUUID()).toLowerCase(),r=t.sub_token||crypto.randomUUID().replace(/-/g,""),s=t.enabled===!1?0:1,o=t.quota_bytes&&t.quota_bytes>0?t.quota_bytes:0,a=t.expires_at??null,i=t.note??null,d=Math.floor(Date.now()/1000),l=(await e.prepare(`INSERT INTO users (name, uuid, sub_token, enabled, quota_bytes, used_bytes, expires_at, note, created_at)
       VALUES (?, ?, ?, ?, ?, 0, ?, ?, ?)`).bind(t.name.trim(),n,r,s,o,a,i,d).run()).meta?.last_row_id;if(!l)throw Error("Failed to insert user into database");let m=await B(e,l);if(!m)throw Error("Failed to retrieve created user");return m}async function st(e,t,n){let r=[],s=[];if(n.name!==void 0)r.push("name = ?"),s.push(n.name.trim());if(n.enabled!==void 0)r.push("enabled = ?"),s.push(n.enabled?1:0);if(n.quota_bytes!==void 0)r.push("quota_bytes = ?"),s.push(Math.max(0,n.quota_bytes));if(n.expires_at!==void 0)r.push("expires_at = ?"),s.push(n.expires_at);if(n.note!==void 0)r.push("note = ?"),s.push(n.note);if(r.length===0)return B(e,t);return s.push(t),await e.prepare(`UPDATE users SET ${r.join(", ")} WHERE id = ?`).bind(...s).run(),B(e,t)}async function ot(e,t,n){if(n<=0)return;await e.prepare("UPDATE users SET used_bytes = used_bytes + ? WHERE uuid = ?").bind(n,t.toLowerCase()).run()}async function at(e,t){return await e.prepare("UPDATE users SET used_bytes = 0 WHERE id = ?").bind(t).run(),B(e,t)}async function it(e,t,n){let r=(n||crypto.randomUUID()).toLowerCase();return await e.prepare("UPDATE users SET uuid = ? WHERE id = ?").bind(r,t).run(),B(e,t)}async function ct(e,t,n){let r=n||crypto.randomUUID().replace(/-/g,"");return await e.prepare("UPDATE users SET sub_token = ? WHERE id = ?").bind(r,t).run(),B(e,t)}async function dt(e,t){return((await e.prepare("DELETE FROM users WHERE id = ?").bind(t).run()).meta?.changes??0)>0}var H=null,Se=0,Vt=30000;async function lt(e){let t=Date.now();if(H!==null&&t<Se)return H;try{return H=await nt(e),Se=t+Vt,H}catch(n){if(H!==null)return H;throw n}}function W(){H=null,Se=0}function q(){return new Response(`<!DOCTYPE html>
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
</html>`,{status:200,headers:{"Content-Type":"text/html; charset=utf-8","Cache-Control":"public, max-age=3600"}})}async function pt(){let e=await import("cloudflare:sockets");return e.connect}async function mt(e,t){let r=(await pt())({hostname:e,port:t});return{readable:r.readable,writable:r.writable,close:async()=>{try{await r.close()}catch{}}}}async function F(e,t){let n=new Uint8Array(t),r=0;while(r<t){let{value:s,done:o}=await e.read();if(o||!s)throw Error(`Connection closed before reading ${t} bytes`);let a=Math.min(s.length,t-r);if(n.set(s.subarray(0,a),r),r+=a,a<s.length);}return n}async function Kt(e,t,n,r,s,o){let i=(await pt())({hostname:n,port:r}),d=i.writable.getWriter(),c=i.readable.getReader();try{let l=!!(s&&o),m=l?new Uint8Array([5,2,0,2]):new Uint8Array([5,1,0]);await d.write(m);let p=await F(c,2);if(p[0]!==5)throw Error("Invalid SOCKS5 server version response");let f=p[1];if(f===2&&l){let g=new TextEncoder().encode(s),L=new TextEncoder().encode(o),h=new Uint8Array(3+g.length+L.length);h[0]=1,h[1]=g.length,h.set(g,2),h[2+g.length]=L.length,h.set(L,3+g.length),await d.write(h);let _=await F(c,2);if(_[0]!==1||_[1]!==0)throw Error("SOCKS5 authentication failed")}else if(f!==0)throw Error(`SOCKS5 method ${f} not supported`);let U=/^(\d{1,3}\.){3}\d{1,3}$/.test(e),b;if(U){let g=e.split(".").map(Number);b=new Uint8Array(10),b[0]=5,b[1]=1,b[2]=0,b[3]=1,b[4]=g[0],b[5]=g[1],b[6]=g[2],b[7]=g[3],new DataView(b.buffer).setUint16(8,t,!1)}else{let g=new TextEncoder().encode(e);b=new Uint8Array(5+g.length+2),b[0]=5,b[1]=1,b[2]=0,b[3]=3,b[4]=g.length,b.set(g,5),new DataView(b.buffer).setUint16(5+g.length,t,!1)}await d.write(b);let v=await F(c,4);if(v[0]!==5||v[1]!==0)throw Error(`SOCKS5 connect failed with reply code: ${v[1]}`);let S=v[3];if(S===1)await F(c,6);else if(S===3){let g=await F(c,1);await F(c,g[0]+2)}else if(S===4)await F(c,18);return d.releaseLock(),c.releaseLock(),{readable:i.readable,writable:i.writable,close:async()=>{try{await i.close()}catch{}}}}catch(l){d.releaseLock(),c.releaseLock();try{await i.close()}catch{}throw l}}async function ft(e,t,n){let r=null;try{r=await D(n)}catch{}if((r?.outbound_mode??"direct")==="socks5"&&r?.socks5_config?.host&&r?.socks5_config?.port)try{return await Kt(e,t,r.socks5_config.host,r.socks5_config.port,r.socks5_config.username,r.socks5_config.password)}catch(o){return console.warn("SOCKS5 outbound connection failed, falling back to direct:",o),mt(e,t)}return mt(e,t)}async function ht(e,t,n){let r=e.headers.get("Upgrade");if(!r||r.toLowerCase()!=="websocket")return q();let s=new WebSocketPair,o=s[0],a=s[1];return a.accept(),n.waitUntil((async()=>{let i=null,d="",c=0,l=0,m=!1,p=async()=>{if(m)return;if(m=!0,i){try{await i.close()}catch{}i=null}try{a.close()}catch{}let f=c+l;if(f>0&&d)try{await ot(t.DB,d,f)}catch(U){console.error("Failed to update user traffic usage:",U)}};try{let f=await new Promise((y)=>{let w=(A)=>{if(a.removeEventListener("message",w),a.removeEventListener("close",k),a.removeEventListener("error",I),A.data instanceof ArrayBuffer)y(A.data);else if(ArrayBuffer.isView(A.data))y(A.data);else y(null)},k=()=>y(null),I=()=>y(null);a.addEventListener("message",w),a.addEventListener("close",k),a.addEventListener("error",I)});if(!f){await p();return}let U=f instanceof Uint8Array?f:new Uint8Array(f),b=Ye(U);if(!b){await p();return}if(d=b.uuid,!(await lt(t.DB)).has(d.toLowerCase())){await p();return}let S=null;try{await Promise.resolve();S=await D(t.DB)}catch{}let g=!1;if(S?.outbound_mode==="backend"&&S.backend_config?.url)try{let w=(await fetch(S.backend_config.url,{headers:{Upgrade:"websocket"}})).webSocket;if(w){w.accept(),w.send(U),c+=U.byteLength;let k=!1,I=async()=>{if(k)return;k=!0;try{w.close()}catch{}await p()};a.addEventListener("message",(A)=>{if(k)return;let P=A.data,z=P instanceof ArrayBuffer?P.byteLength:ArrayBuffer.isView(P)?P.byteLength:0;c+=z,w.send(P)}),a.addEventListener("close",I),a.addEventListener("error",I),w.addEventListener("message",(A)=>{if(k)return;let P=A.data,z=P instanceof ArrayBuffer?P.byteLength:ArrayBuffer.isView(P)?P.byteLength:0;l+=z,a.send(P)}),w.addEventListener("close",I),w.addEventListener("error",I),g=!0;return}}catch(y){console.warn("Backend VPS forwarding failed, falling back to direct:",y)}try{i=await ft(b.address,b.port,t.DB)}catch(y){console.error(`Failed to connect to ${b.address}:${b.port}:`,y),await p();return}let L=i.writable.getWriter();if(b.rawPayload.byteLength>0)c+=b.rawPayload.byteLength,await L.write(b.rawPayload);a.addEventListener("message",async(y)=>{if(m)return;try{let w=null;if(y.data instanceof ArrayBuffer)w=new Uint8Array(y.data);else if(ArrayBuffer.isView(y.data))w=new Uint8Array(y.data.buffer,y.data.byteOffset,y.data.byteLength);if(w&&w.byteLength>0)c+=w.byteLength,await L.write(w)}catch(w){await p()}}),a.addEventListener("close",()=>{p()}),a.addEventListener("error",()=>{p()});let h=i.readable.getReader(),_=!0;while(!m){let{value:y,done:w}=await h.read();if(w||!y)break;if(l+=y.byteLength,a.bufferedAmount>131072)while(a.bufferedAmount>32768&&!m)await new Promise((k)=>setTimeout(k,20));if(_){_=!1;let k=Ze(),I=new Uint8Array(k.byteLength+y.byteLength);I.set(k,0),I.set(y,k.byteLength),a.send(I)}else a.send(y)}await p()}catch(f){console.error("Proxy session exception:",f),await p()}})()),new Response(null,{status:101,webSocket:o})}async function yt(e,t){if(e.byteLength!==t.byteLength)return!1;let n=0;for(let r=0;r<e.byteLength;r++)n|=e[r]^t[r];return n===0}async function ke(e,t){let n=new TextEncoder,r=await crypto.subtle.digest("SHA-256",n.encode(e)),s=await crypto.subtle.digest("SHA-256",n.encode(t));return yt(new Uint8Array(r),new Uint8Array(s))}async function wt(e){let t=new TextEncoder;return crypto.subtle.importKey("raw",t.encode(e),{name:"HMAC",hash:"SHA-256"},!1,["sign","verify"])}function gt(e){let t=typeof e==="string"?new TextEncoder().encode(e):e,n="";for(let r=0;r<t.length;r++)n+=String.fromCharCode(t[r]);return btoa(n).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}function bt(e){let t=e.replace(/-/g,"+").replace(/_/g,"/");while(t.length%4!==0)t+="=";let n=atob(t),r=new Uint8Array(n.length);for(let s=0;s<n.length;s++)r[s]=n.charCodeAt(s);return r}async function vt(e,t,n=604800){let r={u:e,exp:Math.floor(Date.now()/1000)+n},s=JSON.stringify(r),o=gt(s),a=await wt(t),i=await crypto.subtle.sign("HMAC",a,new TextEncoder().encode(o)),d=gt(new Uint8Array(i));return`${o}.${d}`}async function xt(e,t){let n=e.split(".");if(n.length!==2||!n[0]||!n[1])return null;let[r,s]=n;try{let o=await wt(t),a=await crypto.subtle.sign("HMAC",o,new TextEncoder().encode(r)),i=bt(s);if(!await yt(new Uint8Array(a),i))return null;let c=new TextDecoder().decode(bt(r)),l=JSON.parse(c),m=Math.floor(Date.now()/1000);if(l.exp<m)return null;return l}catch{return null}}var Q=new Map,Qt=5,Jt=900000,Et=900000;function St(e){let t=Date.now(),n=Q.get(e);if(!n)return{allowed:!0};if(n.lockedUntil>t)return{allowed:!1,retryAfterSeconds:Math.ceil((n.lockedUntil-t)/1000)};if(t-n.firstFailed>Et)return Q.delete(e),{allowed:!0};return{allowed:!0}}function kt(e){let t=Date.now(),n=Q.get(e);if(!n||t-n.firstFailed>Et){Q.set(e,{attempts:1,lockedUntil:0,firstFailed:t});return}if(n.attempts++,n.attempts>=Qt)n.lockedUntil=t+Jt}function Ut(e){Q.delete(e)}function J(e,t,n,r){return(t.length>0?t:[{label:"Default Edge",address:r,port:443,sni:r,host:r}]).map((o)=>{let a=o.address||r,i=o.port||443,d=o.sni||r,c=o.host||r,l=`${e.name} [${o.label}]`,m=new URLSearchParams({security:"tls",encryption:"none",type:"ws",headerType:"none",host:c,path:n,sni:d,fp:"chrome"}),p=`vless://${e.uuid}@${a}:${i}?${m.toString()}#${encodeURIComponent(l)}`;return{label:o.label,url:p}})}ce();ce();function en(e){let t=new TextEncoder().encode(e),n="";for(let r=0;r<t.length;r++)n+=String.fromCharCode(t[r]);return btoa(n)}function At(e){if(!e||e===0)return"0 GB";return(e/1073741824).toFixed(2)+" GB"}async function Ct(e,t,n){if(!e||e.trim().length===0)return q();let r=await et(n.DB,e.trim());if(!r||!r.is_active)return q();let s=new URL(t.url),o=s.hostname,a=n.WS_PATH||"/api/v1/ws",i=await D(n.DB,o),c=J(r,i.endpoints,a,o).map((L)=>L.url).join(`
`),l=t.headers.get("User-Agent")||"",m=t.headers.get("Accept")||"",p=/v2ray|hiddify|sing-box|clash|shadowrocket|streisand|nekobox|karing|foxray/i.test(l),f=s.searchParams.get("raw")==="1",U=s.searchParams.get("b64")==="1",b=!p&&!f&&!U&&m.includes("text/html"),v=`${s.protocol}//${s.host}/sub/${r.sub_token}`;if(b){let L=ie(v,200),h=r.quota_bytes>0?At(r.quota_bytes):"نامحدود / Unlimited",_=At(r.used_bytes),y=r.expires_at?new Date(r.expires_at*1000).toLocaleDateString():"همیشگی / Never",w=`<!DOCTYPE html>
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
          <div class="stat-val">${_}</div>
        </div>
        <div class="stat-box">
          <div class="stat-label">حجم مجاز</div>
          <div class="stat-val">${h}</div>
        </div>
        <div class="stat-box" style="grid-column: span 2;">
          <div class="stat-label">تاریخ انقضا</div>
          <div class="stat-val">${y}</div>
        </div>
      </div>

      <div class="qr-box">
        ${L}
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
</html>`;return new Response(w,{status:200,headers:{"Content-Type":"text/html; charset=utf-8","Cache-Control":"no-cache, no-store, must-revalidate"}})}let S=f?c:en(c),g={"Content-Type":"text/plain; charset=utf-8","Cache-Control":"no-cache, no-store, must-revalidate","Profile-Update-Interval":"24","Subscription-Userinfo":`upload=0; download=${r.used_bytes}; total=${r.quota_bytes}; expire=${r.expires_at??0}`};return new Response(S,{status:200,headers:g})}function Rt(e,t){return`<!DOCTYPE html>
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
</html>`}var Ae="lumen_session";function tn(e,t){let n=e.headers.get("Cookie");if(!n)return null;let r=n.split(";");for(let s of r){let[o,a]=s.trim().split("=");if(o===t&&a)return decodeURIComponent(a)}return null}function nn(e){return e.headers.get("CF-Connecting-IP")||e.headers.get("X-Forwarded-For")?.split(",")[0]?.trim()||"127.0.0.1"}var T=new K;T.use("/api/*",async(e,t)=>{let n=e.req.path;if(n==="/api/auth/login"||n==="/api/auth/logout")return t();let r=e.env.SESSION_SECRET||"lumen-default-secret-change-me",s=tn(e.req.raw,Ae);if(!s)return e.json({error:"Unauthorized"},401);let o=await xt(s,r);if(!o)return e.json({error:"Unauthorized"},401);e.set("jwtPayload",o),await t()});T.post("/api/auth/login",async(e)=>{let t=nn(e.req.raw),n=St(t);if(!n.allowed)return e.json({error:`Too many failed attempts. Try again in ${n.retryAfterSeconds}s.`},429);let r;try{r=await e.req.json()}catch{return e.json({error:"Invalid JSON"},400)}let s=e.env.ADMIN_USERNAME||"admin",o=e.env.ADMIN_PASSWORD||"lumenadmin",a=e.env.SESSION_SECRET||"lumen-default-secret-change-me",i=await ke(r.username||"",s),d=await ke(r.password||"",o);if(!i||!d)return kt(t),e.json({error:"Invalid username or password"},401);Ut(t);let c=await vt(s,a),l=new URL(e.req.url).protocol==="https:",m=[`${Ae}=${encodeURIComponent(c)}`,"Path=/","HttpOnly","SameSite=Strict","Max-Age=604800"];if(l)m.push("Secure");return e.json({success:!0,username:s},200,{"Set-Cookie":m.join("; ")})});T.post("/api/auth/logout",(e)=>{let t=new URL(e.req.url).protocol==="https:",n=[`${Ae}=`,"Path=/","HttpOnly","SameSite=Strict","Max-Age=0"];if(t)n.push("Secure");return e.json({success:!0},200,{"Set-Cookie":n.join("; ")})});T.get("/api/auth/me",(e)=>{let t=e.env.ADMIN_USERNAME||"admin";return e.json({authenticated:!0,username:t})});T.get("/api/users",async(e)=>{let t=e.req.query("search")||void 0,n=e.req.query("limit")?Number(e.req.query("limit")):50,r=e.req.query("offset")?Number(e.req.query("offset")):0,s=await tt(e.env.DB,{search:t,limit:n,offset:r});return e.json(s)});T.post("/api/users",async(e)=>{let t;try{t=await e.req.json()}catch{return e.json({error:"Invalid JSON"},400)}if(!t.name||typeof t.name!=="string"||t.name.trim().length===0)return e.json({error:"User name is required"},400);try{let n=await rt(e.env.DB,{name:t.name.trim(),quota_bytes:typeof t.quota_bytes==="number"?t.quota_bytes:0,expires_at:typeof t.expires_at==="number"?t.expires_at:null,note:typeof t.note==="string"?t.note.trim():null,enabled:t.enabled!==!1});return W(),e.json(n,201)}catch(n){return e.json({error:n.message},500)}});T.get("/api/users/:id",async(e)=>{let t=Number(e.req.param("id"));if(isNaN(t))return e.json({error:"Invalid user ID"},400);let n=await B(e.env.DB,t);if(!n)return e.json({error:"User not found"},404);let s=new URL(e.req.url).hostname,o=e.env.WS_PATH||"/api/v1/ws",a=await D(e.env.DB,s),i=J(n,a.endpoints,o,s);return e.json({user:n,links:i})});T.get("/api/users/:id/qr",async(e)=>{let t=Number(e.req.param("id"));if(isNaN(t))return e.text("Invalid user ID",400);let n=await B(e.env.DB,t);if(!n)return e.text("User not found",404);let s=new URL(e.req.url).hostname,o=e.env.WS_PATH||"/api/v1/ws",a=await D(e.env.DB,s),i=J(n,a.endpoints,o,s),d=parseInt(e.req.query("link_index")||"0")||0,c=i[d]||i[0];if(!c)return e.text("No links available",404);await Promise.resolve().then(() => ce());let m=ie(c.url,256);return new Response(m,{status:200,headers:{"Content-Type":"image/svg+xml; charset=utf-8","Cache-Control":"private, max-age=60"}})});T.put("/api/users/:id",async(e)=>{let t=Number(e.req.param("id"));if(isNaN(t))return e.json({error:"Invalid user ID"},400);let n;try{n=await e.req.json()}catch{return e.json({error:"Invalid JSON"},400)}let r=await st(e.env.DB,t,n);if(!r)return e.json({error:"User not found"},404);return W(),e.json(r)});T.post("/api/users/:id/reset",async(e)=>{let t=Number(e.req.param("id"));if(isNaN(t))return e.json({error:"Invalid user ID"},400);let n=await at(e.env.DB,t);if(!n)return e.json({error:"User not found"},404);return W(),e.json(n)});T.post("/api/users/:id/regen-uuid",async(e)=>{let t=Number(e.req.param("id"));if(isNaN(t))return e.json({error:"Invalid user ID"},400);let n=await it(e.env.DB,t);if(!n)return e.json({error:"User not found"},404);return W(),e.json(n)});T.post("/api/users/:id/regen-sub",async(e)=>{let t=Number(e.req.param("id"));if(isNaN(t))return e.json({error:"Invalid user ID"},400);let n=await ct(e.env.DB,t);if(!n)return e.json({error:"User not found"},404);return e.json(n)});T.delete("/api/users/:id",async(e)=>{let t=Number(e.req.param("id"));if(isNaN(t))return e.json({error:"Invalid user ID"},400);if(!await dt(e.env.DB,t))return e.json({error:"User not found"},404);return W(),e.json({success:!0})});T.get("/api/settings",async(e)=>{let t=new URL(e.req.url).hostname,n=await D(e.env.DB,t);return e.json(n)});T.put("/api/settings",async(e)=>{let t;try{t=await e.req.json()}catch{return e.json({error:"Invalid JSON"},400)}if(t.endpoints){if(!Array.isArray(t.endpoints))return e.json({error:"Endpoints must be an array"},400);for(let s of t.endpoints)if(!s.label||!s.address||!s.port)return e.json({error:"Each endpoint must have a label, address, and port"},400)}if(t.outbound_mode){if(!["direct","socks5","backend"].includes(t.outbound_mode))return e.json({error:"Invalid outbound_mode"},400)}await ut(e.env.DB,t);let n=new URL(e.req.url).hostname,r=await D(e.env.DB,n);return e.json({success:!0,settings:r})});var V=new K;V.all("*",async(e,t)=>{let n=e.env.WS_PATH||"/api/v1/ws";if(new URL(e.req.url).pathname===n){let s=e.req.header("Upgrade");if(!s||s.toLowerCase()!=="websocket")return q();let o={waitUntil:(a)=>{try{e.executionCtx.waitUntil(a)}catch{a.catch((i)=>console.error("Unhandled async task:",i))}}};return ht(e.req.raw,e.env,o)}await t()});V.get("/sub/:token",async(e)=>{let t=e.req.param("token");return Ct(t,e.req.raw,e.env)});V.get("*",async(e,t)=>{let n=e.env.PANEL_PATH||"/_panel",r=new URL(e.req.url);if(r.pathname===n||r.pathname===`${n}/`){let s=e.env.WS_PATH||"/api/v1/ws",o=Rt(n,s);return new Response(o,{status:200,headers:{"Content-Type":"text/html; charset=utf-8","Cache-Control":"no-cache, no-store, must-revalidate"}})}await t()});V.route("/",T);V.get("/",()=>q());var As=V;export{As as default};
