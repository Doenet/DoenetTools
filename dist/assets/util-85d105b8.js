import{a as i,d as o}from"./util-38d8e238.js";function s(e){const r=/\d/gm,n=[...e.matchAll(r)];var a=n[0][0];n[1]!==void 0&&(a+=n[1][0]);const t=parseInt(a);return i[t-1].Name}function m(e){for(let r=0;r<o.length;r++)if(o[r].Color==e)return o[r].Name;return"some color"}export{m as a,s as f};