import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';
const $ = id => document.getElementById(id);
// Curated versioned reference data; no unauthorised scraping or claimed live updates.
const CATALOG_CHECKED='2026-10-28';
const CURATED_CATALOG=[
 {"name":"マイジャグラーV","aliases":["マイジャグラー5","マイジャグラーⅤ","SマイジャグラーVKD","SマイジャグラーⅤKD","マイジャグ5","SマイジャグラーV-KD"],"url":"https://www.kitadenshi.co.jp/fun/","sourceType":"official","bb":[273.1,270.8,266.4,254,240.1,229.1],"rb":[409.6,385.5,336.1,290,268.6,229.1],"payout":[97,98,99.9,102.8,105.3,109.4]},
 {"name":"マイジャグラーVI","aliases":["マイジャグラー6","マイジャグラーⅥ","マイジャグVI","マイジャグ6","SマイジャグラーVIKK","SマイジャグラーVI-KK","SマイジャグラーⅥKK","SマイジャグラーⅥ-KK"],"url":"https://www.kitadenshi.co.jp/fun/","sourceType":"official","bb":[273.1,270.8,266.4,254,240.1,229.1],"rb":[409.6,385.5,336.1,290,268.6,229.1],"payout":[97,98,99.9,102.8,105.3,109.4]},
 {"name":"アイムジャグラーEX","aliases":["SアイムジャグラーEX","アイムジャグラーＥＸ","SアイムジャグラーEX-TP","SアイムジャグラーEXTP","SアイムジャグラーEX-KK","SアイムジャグラーEXKK","アイムEX"],"url":"https://pachislot-memo.online/juggler-all","sourceType":"secondary","bb":[273.1,269.7,269.7,259,259,255],"rb":[439.8,399.6,331,315.1,255,255],"payout":[97,98,99.5,101.1,103.3,105.5]},
 {"name":"ネオアイムジャグラーEX","aliases":["ネオアイムジャグラー","ネオアイム","ネオアイムEX","SネオアイムジャグラーEX-KK","SネオアイムジャグラーEXKK","SネオアイムジャグラーEX"],"url":"https://tsumoreru.com/machines/juggler_neo_im_ex/","sourceType":"secondary","bb":[273.1,269.7,269.7,259,259,255],"rb":[439.8,399.6,331,315.1,255,255],"payout":[97,98,99.5,101.1,103.3,105.5]},
 {"name":"ゴーゴージャグラー3","aliases":["ゴーゴージャグラーⅢ","Sゴーゴージャグラー3","Sゴーゴージャグラー3KA","ゴーゴージャグラー3KA","ゴージャグ3","Sゴーゴージャグラー3-KA"],"url":"https://pachislot-memo.online/juggler-all","sourceType":"secondary","bb":[259,258,257,254,247.3,234.9],"rb":[354.2,332.7,306.2,268.6,247.3,234.9],"payout":[97.2,98.2,99.4,101.6,103.8,106.5]},
 {"name":"ファンキージャグラー2","aliases":["ファンキージャグラーⅡ","ファンキー2","ファンキー","Sファンキージャグラー2KT","Sファンキージャグラー2-KT"],"url":"https://pachislot-memo.online/juggler-all","sourceType":"secondary","bb":[266.4,259,256,249.2,240.1,219.9],"rb":[439.8,407.1,366.1,322.8,299.3,262.1]},
 {"name":"ハッピージャグラーVⅢ","aliases":["ハッピージャグラーVIII","ハッピージャグラーV3","ハッピージャグラー3","ハッピー3","SハッピージャグラーVⅢEA","SハッピージャグラーVⅢ-EA","SハッピージャグラーVIIIEA","SハッピージャグラーVIII-EA"],"url":"https://pachislot-memo.online/juggler-all","sourceType":"secondary","bb":[273.1,270.8,263.2,254,239.2,226],"rb":[397.2,362.1,332.7,300.6,273.1,256]},
 {"name":"ジャグラーガールズSS","aliases":["ジャグラーガールズ","ガールズSS","ジャグラーガールズＳＳ","SジャグラーガールズSS-KH","SジャグラーガールズSSKH"],"url":"https://pachislot-memo.online/juggler-all","sourceType":"secondary","bb":[273.1,270.8,260.1,250.1,243.6,226],"rb":[381,350.5,316.6,281.3,270.8,252.1]},
 {"name":"ウルトラミラクルジャグラー","aliases":["ウルトラミラクル","ミラクルジャグラー","ウルミラ","SウルトラミラクルジャグラーKT","Sウルトラミラクルジャグラー-KT"],"url":"https://pachislot-memo.online/juggler-all","sourceType":"secondary","bb":[267.5,261.1,256,242.7,233.2,216.3],"rb":[425.6,402.1,350.5,322.8,297.9,277.7]},
 {"name":"ミスタージャグラー","aliases":["ミスター","ミスタージャグ","SミスタージャグラーKK","Sミスタージャグラー-KK"],"url":"https://pachislot-memo.online/juggler-all","sourceType":"secondary","bb":[268.6,267.5,260.1,249.2,240.9,237.4],"rb":[374.5,354.2,331,291.3,257,237.4]},
];
// Distinguish machine identity from the manufacturer type suffix. Known model aliases
// are checked first; avoid fuzzy substring matching across different Juggler generations.
const normalizeMachine=s=>String(s||'').normalize('NFKC').toLowerCase()
 .replace(/[\s　・_\-]/g,'').replace(/^(s|l)(?=[ァ-ヶ])/,'')
 .replace(/(kk|kd|tp|ka|kt|kh|ea)$/,'');
function catalogFor(s){const key=normalizeMachine(s);return CURATED_CATALOG.find(m=>[m.name,...m.aliases].some(a=>normalizeMachine(a)===key))||null;}
function modelFor(s){
 const entry=catalogFor(s);
 // VI and V have equal published BB/RB rates, but their small-role profiles remain separate.
 const canonical=normalizeMachine(entry?.name||s);
 // Users may already have saved a model under an older Teramoba type name.
 return models.find(m=>normalizeMachine(m.name)===canonical)
   ||models.find(m=>catalogFor(m.name)?.name===entry?.name)
   ||null;
}
function effectiveMachineName(s){return catalogFor(s)?.name||s;}
async function seedKnownModels(){
 if(!user)return;
 const missing=CURATED_CATALOG.filter(c=>!models.some(m=>catalogFor(m.name)?.name===c.name));
 if(!missing.length)return;
 const payload=missing.map(c=>({user_id:user.id,name:c.name,source_type:'estimated',source_url:c.url,checked_on:CATALOG_CHECKED,settings:c.bb.map((bb,i)=>({setting:i+1,bb,rb:c.rb[i],payout:c.payout?.[i]??null}))}));
 const {error}=await db.from('machine_models').upsert(payload,{onConflict:'user_id,name',ignoreDuplicates:true});
 if(error)console.warn('カタログ登録保留:',error.message);
}
// Model sources: BB/RB from curated machine catalog, grapes from cited analysis resources.
// Where overlap probabilities are unverified, use a marginal-only provisional model:
// means are additive; bonus/cherry covariance is not claimed to be exact.
const ROLE_PROFILES={
 'マイジャグラーV':{
  version:'myv-overlap-reference-20261029',source:'https://nana-press.com/kaiseki/machine/191/6660/',
  grape:[5.900,5.855,5.825,5.790,5.770,5.670],
  cherry:[38.43,38.29,37.04,35.89,35.82,35.79],
  cherryBB:[1418.43,1406.46,1393.39,1297.56,1210.64,1165.49],
  cherryRB:[1091.69,1094.48,1046.38,1026.68,888.35,759.10],
  replay:7.298,bbPayout:240,rbPayout:96,cherryPayout:1,grapePayout:8,verifiedOverlap:true
 },
 'アイムジャグラーEX':{
  version:'im-grape-estimate-20261029',source:'https://pekasen.com/machines/neo-im-juggler-ex',
  grape:[6.02,6.02,6.02,6.02,6.02,5.80],replay:7.298,
  bbPayout:252,rbPayout:96,grapePayout:8,verifiedOverlap:false
 },
 'ネオアイムジャグラーEX':{
  version:'neo-im-grape-estimate-20261029',source:'https://pekasen.com/machines/neo-im-juggler-ex',
  grape:[6.02,6.02,6.02,6.02,6.02,5.80],replay:7.298,
  bbPayout:252,rbPayout:96,grapePayout:8,verifiedOverlap:false
 },
 'ゴーゴージャグラー3':{
  version:'gogo3-grape-estimate-20261029',source:'https://www.slo-map.com/juggler/budou/gogo-juggler-3',
  grape:[6.25,6.20,6.15,6.07,6.00,5.92],replay:7.298,
  bbPayout:240,rbPayout:96,grapePayout:8,verifiedOverlap:false
 },
 'ファンキージャグラー2':{
  version:'funky2-grape-estimate-20261029',source:'https://slometer.com/tools/juggler/funky-2/',
  grape:[5.94,5.92,5.88,5.83,5.76,5.67],replay:7.298,
  bbPayout:240,rbPayout:96,grapePayout:8,verifiedOverlap:false
 }

 , 'ハッピージャグラーVⅢ':{
  version:'happy-v3-nanapress-app-sample-20261029',source:'https://nana-press.com/kaiseki/machine/445/11637/',
  grape:[6.07,6.03,6.00,5.86,5.84,5.80],
  // non-bonus cherries published separately; the total below includes cherry/bonus overlap
  cherry:[55.5,55.5,55.5,55.5,55.5,55.5],
  cherryBB:[1149.75,1149.75,1074.36,992.97,949.8,936.23],
  cherryRB:[1057.03,992.97,885.62,809.09,728.18,642.51],
  replay:7.3,bbPayout:240,rbPayout:96,cherryPayout:2,grapePayout:8,verifiedOverlap:true
 },
 'ウルトラミラクルジャグラー':{
  version:'ultra-miracle-pachinavi-20261029',source:'https://pachinavi.net/machines/ultra-miracle-juggler/settei/',
  grape:[5.94,5.94,5.94,5.93,5.93,5.93],
  cherry:[35.5,35.5,34.9,34.8,34.1,33.4],
  cherryBB:[1337.5,1213.6,1149.8,1110.8,993.0,936.2],
  cherryRB:[1489.5,1524.1,1236.5,1236.5,1057,1040.3],
  replay:7.298,bbPayout:240,rbPayout:96,cherryPayout:2,grapePayout:8,verifiedOverlap:true
 },
 'ミスタージャグラー':{
  version:'mrjuggler-pokoslot-20261029',source:'https://www.nankaikoya.jp/mrjuggler/',
  grape:[6.29,6.22,6.15,6.09,6.02,5.96],
  cherry:[37.2,37.2,37.2,37.2,37.2,37.2],
  cherryBB:[1689,1682,1655,1508,1410,1385],
  cherryRB:[1621,1600,1503,1412,1357,1331],
  replay:7.298,bbPayout:240,rbPayout:96,cherryPayout:2,grapePayout:8,
  // Additional pierrot+bonus overlap is not yet represented in the likelihood.
  verifiedOverlap:false
 },
 'ジャグラーガールズSS':{
  version:'girls-ss-pekasen-inferred-20261029',source:'https://pekasen.com/machines/juggler-girls-ss',
  grape:[6.01,6.01,6.01,6.01,5.92,5.89],
  replay:7.298,bbPayout:240,rbPayout:96,grapePayout:8,verifiedOverlap:false
 }
};
const aimCapture=()=>Math.min(1,Math.max(0,(cherryAimShare/100)*.98+(1-cherryAimShare/100)*.667));
const gaussLog=(x,mu,variance)=>-0.5*(Math.log(2*Math.PI*Math.max(variance,1e-8))+(x-mu)**2/Math.max(variance,1e-8));
const normalCDF=x=>{let t=1/(1+.2316419*Math.abs(x));let d=.3989422804*Math.exp(-x*x/2);let y=1-d*t*(.319381530+t*(-.356563782+t*(1.781477937+t*(-1.821255978+t*1.330274429))));return x>=0?y:1-y;};
function analyzeStat(r,model){
 if(!r.games||r.bb+r.rb>r.games)throw Error('総回転数/ボーナス回数が不正です');
 const profile=ROLE_PROFILES[catalogFor(r.machine_name)?.name]||null;
 const B=r.bb,R=r.rb,N=r.games,D=r.diff_medals;
 const entries=model.settings.map((row,i)=>{
  const pb=1/row.bb,pr=1/row.rb,pnone=1-pb-pr;
  if(!(pb>0&&pr>0&&pnone>0))throw Error('機種の確率データが不正です');
  const bonusLog=B*Math.log(pb)+R*Math.log(pr)+(N-B-R)*Math.log(pnone);
  if(!profile||D===null||D===undefined){return {setting:i+1,log:bonusLog,bonusLog,mu:null,sd:null,overallMu:null,overallSd:null};}
  const pg=1/profile.grape[i],preplay=1/profile.replay;
  const free=1-pb-pr,cap=aimCapture();
  const cPayout=profile.cherryPayout||0;
  const pc=profile.cherry?1/profile.cherry[i]:0;
  const pbc=profile.cherryBB?1/profile.cherryBB[i]:0;
  const prc=profile.cherryRB?1/profile.cherryRB[i]:0;
  const cNon=Math.max(0,pc-pbc-prc)/free;
  const grape=pg/free,replay=preplay/free;
  const cherryWin=cNon*cap;
  const gr=profile.grapePayout;
  const meanOther=cPayout*cherryWin+gr*grape+3*replay;
  const varOther=cPayout*cPayout*cherryWin+gr*gr*grape+9*replay-meanOther**2;
  const cherryOnBonus=cPayout*cap*(B*pbc/pb+R*prc/pr);
  const cherryOnBonusVar=cPayout*cPayout*(B*(cap*pbc/pb)*(1-cap*pbc/pb)+R*(cap*prc/pr)*(1-cap*prc/pr));
  const mu=profile.bbPayout*B+profile.rbPayout*R-3*N+(N-B-R)*meanOther+cherryOnBonus;
  // Published grape probabilities are estimates, not exact slot internals.
  // Unmodelled rare roles and bonus-entry effects cause further deviation.
  const variance=Math.max(1,(N-B-R)*varOther+cherryOnBonusVar);
  const overallReward=profile.bbPayout*pb+profile.rbPayout*pr+cap*cPayout*pc+gr*pg+3*preplay;
  const overallSecond=profile.bbPayout**2*pb+profile.rbPayout**2*pr+cap*cPayout*cPayout*pc+gr*gr*pg+9*preplay+2*cap*cPayout*(profile.bbPayout*pbc+profile.rbPayout*prc);
  const overallMu=N*(overallReward-3),overallSd=Math.sqrt(Math.max(1,N*(overallSecond-overallReward**2)));
  // Discrete medal outcomes: normal density approximates the conditional small-role distribution, not exact likelihood.
  const diffLog=gaussLog(D,mu,variance);
  return {setting:i+1,log:bonusLog+diffLog,bonusLog,mu,sd:Math.sqrt(variance),overallMu,overallSd};
 });
 const max=Math.max(...entries.map(x=>x.log)),unnormalized=entries.map(x=>Math.exp(x.log-max)),sum=unnormalized.reduce((a,b)=>a+b,0);
 return {profile,entries:entries.map((x,i)=>({...x,prob:unnormalized[i]/sum})),mode:profile&&D!==null&&D!==undefined?'bonus+medals':'bonus-only'};
}
function plotAnalysis(r,result){
 const N=r.games||1,D=r.diff_medals;
 const width=960,height=480,margin={left:75,right:20,top:25,bottom:53};
 const domain=[...result.entries.flatMap(e=>e.overallMu===null?[]:[e.overallMu-1.96*e.overallSd,e.overallMu+1.96*e.overallSd]),D??0,0];
 const ymin=Math.min(...domain)*1.15-100,ymax=Math.max(...domain)*1.15+100;
 const X=x=>margin.left+(width-margin.left-margin.right)*x/N;
 const Y=y=>height-margin.bottom-(height-margin.bottom-margin.top)*(y-ymin)/(ymax-ymin);
 const colors=['#94a3b8','#60a5fa','#34d399','#eab308','#fb923c','#a78bfa'];
 let paths='';
 for(const [i,e] of result.entries.entries()){
  if(e.overallMu===null)continue;
  const avg=e.overallMu,band=1.96*e.overallSd;
  const points=[];for(let t=0;t<=50;t++){const ratio=t/50;points.push([X(N*ratio),Y(avg*ratio),Y(avg*ratio+band*Math.sqrt(ratio)),Y(avg*ratio-band*Math.sqrt(ratio))]);}
  const poly=[...points.map(z=>`${z[0]},${z[2]}`),...points.slice().reverse().map(z=>`${z[0]},${z[3]}`)].join(' ');
  paths+=`<polygon points="${poly}" fill="${colors[i]}" fill-opacity=".10"/><polyline points="${points.map(z=>`${z[0]},${z[1]}`).join(' ')}" fill="none" stroke="${colors[i]}" stroke-width="3"/>`;
 }
 if(D!==null&&D!==undefined)paths+=`<line x1="${X(0)}" y1="${Y(0)}" x2="${X(N)}" y2="${Y(D)}" stroke="#ef4444" stroke-width="4"/><circle cx="${X(N)}" cy="${Y(D)}" r="5" fill="#ef4444"/>`;
 let bands='';if(result.mode==='bonus+medals')for(const [i,e] of result.entries.entries()){
  bands+=`<line x1="${X(N)-12+i*4}" x2="${X(N)-12+i*4}" y1="${Y(e.mu-1.96*e.sd)}" y2="${Y(e.mu+1.96*e.sd)}" stroke="${colors[i]}" stroke-width="4" opacity=".9"/>`;
 }
 const ticks=Array.from({length:5},(_,i)=>ymin+(ymax-ymin)*i/4).map(v=>`<text x="${margin.left-8}" y="${Y(v)+4}" text-anchor="end" font-size="16" fill="currentColor">${Math.round(v).toLocaleString('ja-JP')}</text><line x1="${margin.left}" x2="${width-margin.right}" y1="${Y(v)}" y2="${Y(v)}" stroke="currentColor" stroke-opacity=".12"/>`).join('');
 return `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="設定別理論差枚95%予測範囲と実測直線" style="width:100%;height:auto;max-width:100%;background:rgba(120,120,120,.04);border-radius:12px"><text x="${margin.left}" y="18" font-size="16" fill="currentColor">差枚（枚）</text>${ticks}<line x1="${margin.left}" x2="${width-margin.right}" y1="${Y(0)}" y2="${Y(0)}" stroke="currentColor" stroke-opacity=".4"/>${paths}${bands}<text x="${margin.left}" y="${height-18}" fill="currentColor" font-size="16">0</text><text x="${X(N)}" y="${height-18}" text-anchor="end" fill="currentColor" font-size="16">${N.toLocaleString('ja-JP')}G</text></svg><p class="hint">赤線：実測差枚を原点と結んだ補助線（途中経過ではありません）。色線・淡色帯：設定1〜6の理論平均と約95%範囲。右端の短い縦線：BB/RB固定時の予測範囲。順に設定1（灰）・2（青）・3（緑）・4（黄）・5（橙）・6（紫）。</p>`;
}
function inferenceMetrics(r){const m=modelFor(r.machine_name);if(!m)return {model:null,high:null,expected:null,likely:null};try{const ps=infer(r,m);return {model:m,high:ps.filter(p=>Number(p.setting)>=4).reduce((v,p)=>v+p.prob,0),expected:ps.reduce((v,p)=>v+Number(p.setting)*p.prob,0),likely:ps.reduce((a,b)=>a.prob>=b.prob?a:b).setting};}catch{return {model:m,high:null,expected:null,likely:null};}}

const config=window.APP_CONFIG||{};
let db=null, user=null, records=[], models=[], pending=[], membership=null, initialized=false;
const SETTINGS_KEY='juggler-cherry-aim-v1';let cherryAimShare=Math.max(0,Math.min(100,Number(localStorage.getItem(SETTINGS_KEY)??50)||0));
const uniqueKey=r=>[r.user_id||user?.id||'',r.business_date, String(r.store_name||'').trim().normalize('NFKC'), String(r.machine_number||'').trim().normalize('NFKC')].join('\u001f');
function uniqueRecords(items){const map=new Map();for(const r of items){const key=uniqueKey(r),old=map.get(key);if(!old||((Date.parse(r.imported_at)||0)>(Date.parse(old.imported_at)||0))||((Date.parse(r.imported_at)||0)===(Date.parse(old.imported_at)||0)&&(r.games||0)>(old.games||0)))map.set(key,r);}return [...map.values()];}

// Safari share handoff. Payload stays in the URL fragment (never in HTTP requests).
// Remove it from address/history immediately; parse only after authenticated sign-in.
let incomingShare=null;
function decodeSharedV06(fragment){
 // Safari/Shortcuts may percent-escape or reformat the URL fragment.
 let value=fragment;
 try { value=decodeURIComponent(value); } catch (_) { /* retain original */ }
 value=value.replace(/\s/g,'').replace(/ /g,'+');
 // Remove any extra hash/query suffix; only one payload is permitted.
 if(!/^[A-Za-z0-9_\-+/=]+$/.test(value)){
   throw Error('共有URLにBase64以外の文字が含まれています（長さ '+value.length+' 文字）');
 }
 const unpadded=value.replace(/=+$/,'');
 if(unpadded.length>16000)throw Error('共有URLが上限の16000文字を超えています');
 if(unpadded.length%4===1)throw Error('共有URLの末尾が欠けています（長さ '+unpadded.length+' 文字）');
 const normalized=unpadded.replace(/-/g,'+').replace(/_/g,'/')+'='.repeat((4-unpadded.length%4)%4);
 let binary;
 try{binary=atob(normalized);}
 catch(e){throw Error('Base64復元失敗（長さ '+unpadded.length+' 文字、余り '+(unpadded.length%4)+'）。URLが途中で欠けている可能性があります');}
 let packed;
 try{packed=JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(Uint8Array.from(binary,c=>c.charCodeAt(0))));}
 catch(e){throw Error('UTF-8/JSONの復元に失敗。URLが途中で欠けた可能性があります: '+e.message);}
 if(!Array.isArray(packed)||packed[0]!==6||!Array.isArray(packed[4])||packed[4].length>500){throw Error('共有データの構造が不正です');}
 return packed;
}
// Accept JSON directly (v0.9) and older shared-link text (v0.6–0.8) for compatibility.
function decodeSharedLinkText(text){
 const value=String(text||'').trim();
 const prefix='https://masaya0206.github.io/juggler-analyzer/';
 if(value.startsWith(prefix)){
  const hash=value.indexOf('#ja06=');
  if(hash<0)throw Error('共有リンクに台データがありません');
  const packed=decodeSharedV06(value.slice(hash+6));
  return JSON.stringify({source:'safari-shortcuts-teramoba-v6',store:packed[1],machine:packed[2],businessDate:packed[3],rows:packed[4].map(r=>({'台番号':r[0],'総回転数':r[1],BB:r[2],RB:r[3],'差玉':r[4],'最大持玉':r[5],'スタート':r[6],'状態':r[7]}))});
 }
 return value;
}
function captureShare(){
 const hash=location.hash;
 if(!hash.startsWith('#ja06='))return;
 // Remove fragment promptly to avoid retaining captured data in history.
 history.replaceState(null,'',location.pathname+location.search);
 try{
  const packed=decodeSharedV06(hash.slice(6));
  incomingShare=JSON.stringify({source:'safari-shortcuts-teramoba-v6',store:packed[1],machine:packed[2],businessDate:packed[3],rows:packed[4].map(r=>({'台番号':r[0],'総回転数':r[1],BB:r[2],RB:r[3],'差玉':r[4],'最大持玉':r[5],'スタート':r[6],'状態':r[7]}))});
 }catch(e){incomingShare=JSON.stringify({error:'共有データを読み取れません: '+e.message});}
}

function showIncomingShare(){
 if(!user||!incomingShare)return;
 const raw=incomingShare;incomingShare=null;
 tab('import');$('rawData').value=raw;
 try{const obj=JSON.parse(raw);if(obj?.error){msg('importMessage',obj.error,true);$('saveRows').disabled=true;return;}}catch(_){}
 applyShortcutMetadata(raw);$('preview').click();
}
captureShare();
window.addEventListener('hashchange',()=>{captureShare();showIncomingShare();});

const text=(el,v)=>{el.textContent=v;};
const msg=(id,v,error=false)=>{const el=$(id);text(el,v);el.classList.toggle('error',error);};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const num=v=>Number(String(v??'').replaceAll(',','').replace(/G$/i,'').trim());
const optionalInt=v=>{if(v===undefined||v===null||String(v).trim()===''||String(v).trim()==='-'||String(v).trim()==='－')return null;const x=String(v).replace(/[,+，枚玉個\s]/g,'').replace(/[−ー－]/g,'-');return /^[-+]?\d+$/.test(x)?Number(x):NaN;};
const displayOptional=v=>v===null||v===undefined?'未取得':String(v);
const signed=v=>v===null||v===undefined?'未取得':(v>0?'+':'')+v.toLocaleString('ja-JP');
const show=id=>{for(const x of ['setup','login','register','app']) $(x).classList.toggle('hidden',x!==id);};
const tab=name=>{document.querySelectorAll('[data-tab]').forEach(b=>b.classList.toggle('active',b.dataset.tab===name));document.querySelectorAll('.tab-page').forEach(p=>p.classList.toggle('hidden',p.id!==name));$('pageTitle').textContent=({dashboard:'ダッシュボード',import:'データ取込',analyze:'設定分析',comparison:'ランキング・履歴',models:'機種設定',users:'ユーザー管理'})[name];};
const today=new Date();$('businessDate').value=[today.getFullYear(),String(today.getMonth()+1).padStart(2,'0'),String(today.getDate()).padStart(2,'0')].join('-');$('modelChecked').value=$('businessDate').value;
for(let i=1;i<=6;i++){$('modelInputs').insertAdjacentHTML('beforeend',`<tr><th>${i}</th><td><input type="number" inputmode="decimal" min="1" step="any" id="bb${i}" placeholder="273.1" aria-label="設定${i}のBB分母"></td><td><input type="number" inputmode="decimal" min="1" step="any" id="rb${i}" placeholder="409.6" aria-label="設定${i}のRB分母"></td></tr>`);}
function render(){text($('userLabel'),user?.email||'');text($('metricRecords'),records.length);text($('metricModels'),models.length);
 const recent=$('recentRows');recent.replaceChildren();for(const r of records.slice(0,100)){const tr=document.createElement('tr');for(const v of [r.business_date,r.store_name,r.machine_name,r.machine_number,r.games,r.bb,r.rb,signed(r.diff_medals)]){const td=document.createElement('td');td.textContent=v;tr.appendChild(td);}const td=document.createElement('td'),b=document.createElement('button');b.className='secondary';b.textContent='表示';b.onclick=()=>{tab('analyze');$('analysisRecord').value=r.id;$('analysisModel').value=modelFor(r.machine_name)?.id||'';};td.appendChild(b);tr.appendChild(td);recent.appendChild(tr);}
 if(!records.length)recent.innerHTML='<tr><td colspan="9">データはまだありません</td></tr>';
 $('analysisRecord').innerHTML='<option value="">台データを選択</option>'+records.map(r=>`<option value="${esc(r.id)}">${esc(r.business_date+' '+r.machine_name+' '+r.machine_number+'番台 ('+r.games+'G)')}</option>`).join('');
 renderComparison();
 $('analysisModel').innerHTML='<option value="">機種モデルを選択</option>'+models.map(m=>`<option value="${esc(m.id)}">${esc(m.name)}</option>`).join('');
 $('modelList').innerHTML='<h3>保存済みモデル</h3>'+(models.length?models.map(m=>`<div class="model-entry"><b>${esc(m.name)}</b><div class="hint">${esc(({official:'公式公表値',estimated:'推定・解析値',manual:'個人入力'})[m.source_type]||m.source_type)} · 確認日 ${esc(m.checked_on||'未設定')}</div>${m.source_url?`<a href="${esc(m.source_url)}" target="_blank" rel="noopener noreferrer">出典リンク</a>`:''}</div>`).join(''):'未登録');
}
// The reference is calculated from saved records on the preceding 7 calendar days.
// It is an activity benchmark, NOT the probability that a setting prediction is correct.
function rollingMaxReference(targetDate,storeName){
 if(!/^\d{4}-\d{2}-\d{2}$/.test(targetDate))return null;
 const start=new Date(targetDate+'T12:00:00Z');
 if(Number.isNaN(start.getTime()))return null;
 const permitted=new Set();
 for(let d=1;d<=7;d++){
  const dt=new Date(start.getTime()-d*86400000);
  permitted.add(dt.toISOString().slice(0,10));
 }
 const maxima=new Map();
 for(const r of records){
  if(!permitted.has(r.business_date)|| (storeName && r.store_name!==storeName))continue;
  const games=Number(r.games);
  if(!Number.isFinite(games)||games<=0)continue;
  maxima.set(r.business_date,Math.max(maxima.get(r.business_date)||0,games));
 }
 const daily=[...maxima.values()];
 return daily.length?{reference:daily.reduce((a,b)=>a+b,0)/daily.length,days:daily.length}:null;
}
function renderComparison(){
 const body=$('compareRows');if(!body)return;body.replaceChildren();
 const date=$('comparisonDate')?.value||[...new Set(records.map(r=>r.business_date))].sort().reverse()[0]||'',machine=$('comparisonMachine')?.value||'';
 const key=$('comparisonSort')?.value||'expected_setting';
 const availableDate=[...new Set(records.map(r=>r.business_date))].sort().reverse();
 const availableMachine=[...new Set(records.map(r=>r.machine_name))].sort();
 for(const [id,values,current] of [['comparisonDate',availableDate,date],['comparisonMachine',availableMachine,machine]]){
  const select=$(id);const first=select.options[0].cloneNode(true);select.replaceChildren(first);
  for(const value of values){const option=document.createElement('option');option.value=value;option.textContent=value;select.append(option);}
  select.value=values.includes(current)?current:'';
 }
 const evaluated=records.filter(r=>(!date||r.business_date===date)&&(!machine||r.machine_name===machine)).map(r=>{
  const metrics=inferenceMetrics(r);return {r,...metrics};
 });
 // High-setting candidates: expected setting >= 4.0, ordered by machine number.
 // Machines without a validated model are excluded from this candidate view.
 const visible = key==='high_number' ? evaluated.filter(x=>x.expected!==null && x.expected>=4.0) : evaluated;
 visible.sort((a,b)=>{
  if(key==='number'||key==='high_number')return Number(a.r.machine_number)-Number(b.r.machine_number)||String(a.r.machine_number).localeCompare(String(b.r.machine_number),'ja',{numeric:true});
  if(key==='expected_setting')return (b.expected??-1)-(a.expected??-1)||Number(a.r.machine_number)-Number(b.r.machine_number);
  if(key==='high_prob')return (b.high??-1)-(a.high??-1);
  if(key==='games')return (b.r.games||0)-(a.r.games||0);
  return (b.r.diff_medals??-Infinity)-(a.r.diff_medals??-Infinity);
 });
 // Experimental empirical-Bayes estimate of the store/day setting mix.
 // Each machine contributes an entire likelihood vector; a 6-cell Dirichlet
 // regularizer prevents low-sample days from producing zero/one probabilities.
 // Use leave-one-out group composition to avoid a machine reinforcing itself.
 function empiricalMix(rows){
  const data=rows.map(x=>{
   if(!x.model)return null;
   try{const p=infer(x.r,x.model).map(a=>Number(a.prob));
    if(p.length!==6||p.some(v=>!Number.isFinite(v)||v<0))return null;
    const total=p.reduce((a,b)=>a+b,0);return total>0?p.map(v=>v/total):null;
   }catch{return null;}
  });
  const valid=data.filter(Boolean),k=valid.length;
  if(k<8)return null; // Too little cross-machine evidence for a mix estimate.
  const prior=Array(6).fill(1/6),strength=12; // regularizing pseudo-counts; hypothetical, not an empirical store prior.
  let mix=prior.slice();
  for(let iteration=0;iteration<150;iteration++){
   const counts=Array(6).fill(strength/6);
   for(const probs of valid){
    const raw=probs.map((q,j)=>q*mix[j]/prior[j]);
    const den=raw.reduce((a,b)=>a+b,0);
    for(let j=0;j<6;j++)counts[j]+=raw[j]/den;
   }
   const next=counts.map(v=>v/(k+strength));
   const delta=next.reduce((a,v,j)=>a+Math.abs(v-mix[j]),0);mix=next;
   if(delta<1e-8)break;
  }
  let sum=0,used=0;
  for(let i=0;i<data.length;i++){
   if(!data[i])continue;
   // Approximate leave-one-out composition by subtracting this record's responsibility.
   const rawSelf=data[i].map((q,j)=>q*mix[j]/prior[j]);
   const normSelf=rawSelf.reduce((a,b)=>a+b,0);
   const own=rawSelf.map(v=>v/normSelf);
   const loo=mix.map((v,j)=>Math.max(1e-8,((k+strength)*v-own[j])/(k-1+strength)));
   const probs=data[i].map((q,j)=>q*loo[j]/prior[j]);
   const norm=probs.reduce((a,b)=>a+b,0);
   sum+=probs.reduce((a,v,j)=>a+(j+1)*v/norm,0);used++;
  }
  return {average:sum/used,used,priorStrength:strength,mix};
 }
 // Each x.expected is already Σ(setting × posterior probability); average across filtered records.
 // Summary follows the selected date, model, and ranking filter. Unestimated records are excluded.
 const estimatedRows=visible.filter(x=>Number.isFinite(x.expected));
 const sum=estimatedRows.reduce((total,x)=>total+x.expected,0);
 const average=estimatedRows.length?sum/estimatedRows.length:null;
 // A benchmark derived only from preceding days; no look-ahead from the target day.
 // With a mixed-store view, compute each store’s benchmark separately.
 const validForWeight=estimatedRows.filter(x=>Number(x.r.games)>0);
 const references=new Map();
 for(const x of validForWeight){
  const store=x.r.store_name||'';
  const targetDate=x.r.business_date;
  const k=store+'|'+targetDate;
  if(!references.has(k))references.set(k,rollingMaxReference(targetDate,store));
 }
 let weightedSum=0,weightTotal=0,benchmarkCount=0;
 const referenceDays=[];
 for(const x of validForWeight){
  const ref=references.get((x.r.store_name||'')+'|'+x.r.business_date);
  if(!ref)continue;
  // Cap at 100%; this is a heuristic weight, not a calibrated reliability score.
  const weight=Math.min(1,Number(x.r.games)/ref.reference);
  weightedSum+=x.expected*weight;weightTotal+=weight;benchmarkCount++;
  referenceDays.push(ref.days);
 }
 const activityAverage=weightTotal>0?weightedSum/weightTotal:null;
 const activitySummary=$('rankActivityAverage');
 if(activitySummary){
  activitySummary.querySelector('[data-activity-average]').textContent=activityAverage===null?'算出不可':activityAverage.toFixed(2);
  activitySummary.querySelector('[data-activity-count]').textContent=activityAverage===null?'前7日間の履歴が必要':`基準あり ${benchmarkCount}台 / 推定可能 ${estimatedRows.length}台`;
  activitySummary.querySelector('[data-activity-note]').textContent=activityAverage===null
   ?'選択した営業日の前7日間に、同じ店舗の保存データがありません。7日分が蓄積されると比較できます。'
   :`各台の重み＝min(1, 回転数÷前7日間の日別最大回転数平均)。基準日数 ${Math.min(...referenceDays)}〜${Math.max(...referenceDays)}日／最大7日。高稼働台を重視する参考平均で、設定推定の正解率ではありません。`;
 }
 // Only make the experimental estimate for a single business day and store;
 // a mixed-date or mixed-store screen is not a coherent common setting mix.
 const empiricalNode=$('rankEmpiricalAverage');
 if(empiricalNode){
  const dates=new Set(visible.map(x=>x.r.business_date));
  const stores=new Set(visible.map(x=>x.r.store_name||''));
  const eb=(dates.size===1&&stores.size===1)?empiricalMix(visible):null;
  empiricalNode.querySelector('[data-eb-value]').textContent=eb?eb.average.toFixed(2):'算出不可';
  empiricalNode.querySelector('[data-eb-count]').textContent=eb?`解析可能 ${eb.used}台 / 表示対象 ${visible.length}台`:'同一店舗・同一日の8台以上が必要';
  empiricalNode.querySelector('[data-eb-note]').textContent=eb
   ?'同じ日の全台から設定配分を推定した試験的な平均。各台の推定分布を利用し、自己データの再利用を軽減。事前分布は均等・正則化強度12。モデル誤差や稼働選択バイアスは解消しません。'
   :'複数日・複数店舗の混在、対象台数不足、またはモデル未登録のため算出できません。';
 }
 const summary=$('rankSettingAverage');
 if(summary){
  summary.querySelector('[data-average-value]').textContent=average===null?'算出不可':average.toFixed(2);
  summary.querySelector('[data-average-count]').textContent=`推定可能 ${estimatedRows.length}台 / 表示対象 ${visible.length}台`;
  summary.querySelector('[data-average-note]').textContent=estimatedRows.length?'各台の設定1〜6の推定確率から算出した期待設定値の全台平均。未推定の台を除外。':'対象となる推定済み台がありません。';
 }
 for(const {r,high,expected,likely} of visible.slice(0,500)){
  const tr=document.createElement('tr');
  for(const [colIndex,v] of [r.business_date,r.machine_name,r.machine_number,r.games,r.bb,r.rb,signed(r.diff_medals),displayOptional(r.max_hold),displayOptional(r.start_games),displayOptional(r.play_status),expected===null?'未推定':expected.toFixed(2),likely===null?'未推定':'設定'+likely,high===null?'モデル未登録 / 判定不可':(high*100).toFixed(1)+'%'].entries()){
   const td=document.createElement('td');td.textContent=v;td.dataset.col=String(colIndex);tr.append(td);
  }
  const td=document.createElement('td'),button=document.createElement('button');button.className='secondary';button.textContent='分析';
  button.textContent='詳細';button.disabled=high===null;button.onclick=()=>{tab('analyze');$('analysisRecord').value=r.id;$('analysisModel').value=modelFor(r.machine_name)?.id||'';$('runAnalysis').click();};
  td.append(button);tr.append(td);body.append(tr);
 }
 if(!visible.length){const tr=document.createElement('tr'),td=document.createElement('td');td.colSpan=14;td.textContent=key==='high_number'?'推定設定値4.0以上の台はありません（機種モデル未登録の台は対象外）':'該当するデータはありません';tr.append(td);body.append(tr);}
}

// Ranking layout preferences are device-local; no server writes.
const RANK_DENSITY_KEY='juggler-ranking-density-v1';
const RANK_SCALE_KEY='juggler-ranking-scale-v1';
const rankPanel=document.getElementById('comparison');
function setRankingLayout(){
 const compact=document.getElementById('rankCompact')?.checked ?? true;
 const scale=Number(document.getElementById('rankScale')?.value||75);
 rankPanel?.classList.toggle('rank-compact',compact);
 rankPanel?.style.setProperty('--rank-scale',String(scale/100));
 const label=document.getElementById('rankScaleLabel');if(label)label.textContent=scale+'%';
 localStorage.setItem(RANK_DENSITY_KEY,compact?'compact':'full');
 localStorage.setItem(RANK_SCALE_KEY,String(scale));
}
if(document.getElementById('rankCompact')){
 document.getElementById('rankCompact').checked=localStorage.getItem(RANK_DENSITY_KEY)!=='full';
 document.getElementById('rankScale').value=localStorage.getItem(RANK_SCALE_KEY)||'75';
 document.getElementById('rankCompact').addEventListener('change',setRankingLayout);
 document.getElementById('rankScale').addEventListener('input',setRankingLayout);
 setRankingLayout();
}
function rankingExportData(){
 const date=document.getElementById('comparisonDate')?.value||'',machine=document.getElementById('comparisonMachine')?.value||'';
 const sort=document.getElementById('comparisonSort')?.value||'expected_setting';
 let data=records.filter(r=>(!date||r.business_date===date)&&(!machine||r.machine_name===machine)).map(r=>({r,...inferenceMetrics(r)}));
 if(sort==='high_number')data=data.filter(x=>x.expected!==null&&x.expected>=4);
 data.sort((a,b)=>{
  if(sort==='number'||sort==='high_number')return String(a.r.machine_number).localeCompare(String(b.r.machine_number),'ja',{numeric:true});
  if(sort==='expected_setting')return (b.expected??-1)-(a.expected??-1);
  if(sort==='high_prob')return (b.high??-1)-(a.high??-1);
  if(sort==='games')return (b.r.games||0)-(a.r.games||0);
  return (b.r.diff_medals??-Infinity)-(a.r.diff_medals??-Infinity);
 });
 return data;
}
async function exportRankingExcel(){
 const button=document.getElementById('rankExport');button.disabled=true;button.textContent='Excel生成中…';
 try{
  if(typeof ExcelJS==='undefined')throw Error('Excelライブラリを読み込めません。ネット接続を確認してください。');
  const rows=rankingExportData();if(!rows.length)throw Error('出力する台データがありません');
  const book=new ExcelJS.Workbook();book.creator='Juggler Analyzer';book.created=new Date();
  const sheet=book.addWorksheet('全台ランキング',{views:[{state:'frozen',ySplit:2}]});
  const date=document.getElementById('comparisonDate')?.value||'全日程';
  sheet.mergeCells('A1:N1');sheet.getCell('A1').value='ジャグラー 全台設定ランキング / '+date;
  sheet.getCell('A1').font={name:'Yu Gothic',bold:true,size:15,color:{argb:'FFFFFFFF'}};
  sheet.getCell('A1').fill={type:'pattern',pattern:'solid',fgColor:{argb:'FF18283F'}};
  sheet.getRow(1).height=31;
  const labels=['営業日','店舗','機種','台番号','総回転数','BB','RB','差枚','最大持玉','スタート','稼働状態','推定設定値','最有力設定','設定4〜6確率'];
  const header=sheet.getRow(2);labels.forEach((label,i)=>header.getCell(i+1).value=label);
  header.height=26;header.eachCell(c=>{c.font={name:'Yu Gothic',bold:true,color:{argb:'FFFFFFFF'}};c.fill={type:'pattern',pattern:'solid',fgColor:{argb:'FF345B87'}};c.alignment={vertical:'middle',horizontal:'center'};});
  for(const [i,{r,expected,likely,high}] of rows.entries()){
   const row=sheet.addRow([r.business_date,r.store_name,r.machine_name,String(r.machine_number),r.games,r.bb,r.rb,r.diff_medals,r.max_hold,r.start_games,r.play_status,expected,likely,high]);
   row.height=22;row.eachCell({includeEmpty:true},cell=>{cell.font={name:'Yu Gothic',size:10};cell.alignment={vertical:'middle'};if(i%2===1)cell.fill={type:'pattern',pattern:'solid',fgColor:{argb:'FFF1F5FA'}};});
   row.getCell(8).numFmt='+#,##0;-#,##0;0';row.getCell(12).numFmt='0.00';row.getCell(14).numFmt='0.0%';
  }
  sheet.columns.forEach((col,i)=>col.width=[15,22,24,12,14,10,10,14,14,12,14,14,14,18][i]);
  sheet.autoFilter={from:'A2',to:'N'+(rows.length+2)};
  const meta=book.addWorksheet('解析条件');meta.addRows([
    ['エクスポート日時',new Date().toISOString()],['営業日フィルタ',date],['機種フィルタ',document.getElementById('comparisonMachine')?.value||'全機種'],
    ['チェリー狙い割合',cherryAimShare/100],['推定について','等事前確率の暫定統計モデル。機種未登録は未推定。'],
    ['集計キー','ユーザー・営業日・店舗・台番号（1台1行）']]);
  meta.getCell('B4').numFmt='0%';meta.getColumn(1).width=25;meta.getColumn(2).width=75;
  meta.getColumn(2).alignment={wrapText:true};meta.getRow(5).height=33;
  const buffer=await book.xlsx.writeBuffer();const blob=new Blob([buffer],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
  const link=document.createElement('a');const url=URL.createObjectURL(blob);link.href=url;link.download='juggler-ranking-'+date+'.xlsx';document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),15000);
 }catch(e){alert('Excel出力に失敗しました: '+e.message);}finally{button.disabled=false;button.textContent='Excel出力';}
}
document.getElementById('rankExport')?.addEventListener('click',exportRankingExcel);

$('comparisonSort').onchange=renderComparison;
$('comparisonDate').onchange=renderComparison;
$('comparisonMachine').onchange=renderComparison;
for(const id of ['store','machine','businessDate']) $(id).addEventListener('input',()=>{pending=[];$('saveRows').disabled=true;});
async function reload(){if(!user)return;const [a,b]=await Promise.all([db.from('machine_records').select('*').order('business_date',{ascending:false}).limit(1000),db.from('machine_models').select('*').order('name')]);if(a.error||b.error){alert('データ取得失敗: '+(a.error?.message||b.error?.message));return;}records=uniqueRecords(a.data||[]);models=b.data||[];render();}
async function publicState(){const {data,error}=await db.rpc('app_public_state');if(error)throw Error('認証用SQLが未適用です: '+error.message);initialized=Boolean(data?.initialized);}
function registerView(){const query=new URLSearchParams(location.search),invite=query.get('invite');$('setupCodeField').classList.toggle('hidden',!!invite||initialized);$('setupCode').required=!invite&&!initialized;$('registerTitle').textContent=invite?'招待アカウント登録':initialized?'招待が必要です':'最高管理者の初回登録';$('registerHelp').textContent=invite?'招待されたメールアドレスを入力してください。':initialized?'管理者が発行した招待URLから登録してください。':'SQL設定時に指定した初回セットアップコードを入力してください。';$('registerForm').classList.toggle('hidden',initialized&&!invite);show('register');}
async function init(){if(!config.supabaseUrl||!config.supabasePublishableKey){show('setup');return;}try{db=createClient(config.supabaseUrl,config.supabasePublishableKey,{auth:{persistSession:true,autoRefreshToken:true}});await publicState();const {data}=await db.auth.getUser();await sync(data?.user||null);db.auth.onAuthStateChange((_event,session)=>{const id=session?.user?.id||null;if(id!==(user?.id||null))setTimeout(()=>sync(session?.user||null),0);});}catch(e){show('setup');$('setup').insertAdjacentHTML('beforeend',`<p class="message error">${esc(e.message)}</p>`);}}
async function sync(next){user=next;if(user){const {data,error}=await db.rpc('app_my_membership');membership=error?null:data;if(!membership?.active){await db.auth.signOut({scope:'local'});user=null;show('login');msg('loginMessage','このアカウントは利用権限がありません。',true);return;}$('userTab').classList.toggle('hidden',!['owner','admin'].includes(membership.role));$('inviteRole').querySelector('[value="admin"]').disabled=membership.role!=='owner';show('app');await reload();await seedKnownModels();await reload();showIncomingShare();}else{membership=null;records=[];models=[];render();show('login');}}
$('openRegister').onclick=()=>registerView();$('backToLogin').onclick=()=>show('login');
$('registerForm').onsubmit=async e=>{e.preventDefault();const email=$('registerEmail').value.trim(),password=$('registerPassword').value;if(password!==$('registerConfirm').value){msg('registerMessage','確認用パスワードが一致しません',true);return;}const invite=new URLSearchParams(location.search).get('invite');if(initialized&&!invite){msg('registerMessage','招待URLから開いてください',true);return;}msg('registerMessage','登録処理中…');const metadata=invite?{invite_token:invite}:{setup_code:$('setupCode').value};const {data,error}=await db.auth.signUp({email,password,options:{data:metadata,emailRedirectTo:location.origin+location.pathname}});if(error){msg('registerMessage','登録に失敗しました。招待コード・メールアドレス・Supabase設定をご確認ください。詳細: '+error.message,true);return;}await publicState();history.replaceState({},'',location.pathname);$('registerPassword').value='';$('registerConfirm').value='';$('setupCode').value='';if(data.session){msg('registerMessage','登録しました。ログイン状態を確認します。');await sync(data.user);}else{msg('registerMessage','登録を受け付けました。確認メールが届いた場合は認証後にログインしてください。');}}
$('loginForm').onsubmit=async e=>{e.preventDefault();if(!db)return;msg('loginMessage','ログイン中…');const {error}=await db.auth.signInWithPassword({email:$('email').value.trim(),password:$('password').value});if(error)msg('loginMessage','ログインに失敗しました。メールアドレス・パスワードを確認してください。',true);else{msg('loginMessage','');$('password').value='';}};
function randomToken(){const a=new Uint8Array(32);crypto.getRandomValues(a);return Array.from(a,x=>x.toString(16).padStart(2,'0')).join('');}
$('makeInvite').onclick=async()=>{const email=$('inviteEmail').value.trim(),role=$('inviteRole').value;if(!email){msg('inviteMessage','メールアドレスを入力してください',true);return;}const token=randomToken();const {error}=await db.rpc('app_create_invite',{p_email:email,p_role:role,p_token:token,p_hours:48});if(error){msg('inviteMessage',error.message,true);return;}const url=new URL(location.href);url.search='';url.hash='';url.searchParams.set('invite',token);$('inviteLink').value=url.toString();$('inviteLinkBox').classList.remove('hidden');msg('inviteMessage','48時間有効な招待リンクを発行しました。このURLは指定したメールアドレスでのみ登録できます。');await loadUsers();};
$('copyInvite').onclick=async()=>{try{await navigator.clipboard.writeText($('inviteLink').value);msg('inviteMessage','コピーしました');}catch{msg('inviteMessage','コピーできません。URLを選択してコピーしてください',true);}};
async function loadUsers(){if(!membership||!['owner','admin'].includes(membership.role))return;const [a,b]=await Promise.all([db.rpc('app_list_members'),db.rpc('app_list_invites')]);if(a.error||b.error){$('membersList').textContent=a.error?.message||b.error?.message;return;}const list=$('membersList');list.replaceChildren();for(const m of a.data){const row=document.createElement('div');row.className='model-entry';const title=document.createElement('div');title.textContent=`${m.email}  ·  ${m.role==='owner'?'最高管理者':m.role==='admin'?'管理者':'一般'}  ·  ${m.active?'有効':'停止'}`;row.append(title);if(m.role!=='owner'&&membership.role==='owner'){const role=document.createElement('select');for(const r of ['member','admin']){const opt=document.createElement('option');opt.value=r;opt.textContent=r==='admin'?'管理者':'一般';opt.selected=m.role===r;role.append(opt);}const active=document.createElement('select');for(const [v,t] of [['true','有効'],['false','停止']]){const opt=document.createElement('option');opt.value=v;opt.textContent=t;opt.selected=String(m.active)===v;active.append(opt);}const save=document.createElement('button');save.textContent='権限を更新';save.className='secondary';save.onclick=async()=>{if(!confirm('このユーザーの権限を更新しますか？'))return;const {error}=await db.rpc('app_set_member',{p_id:m.user_id,p_role:role.value,p_active:active.value==='true'});if(error)alert(error.message);else await loadUsers();};row.append(role,active,save);}list.append(row);}const invites=$('invitesList');invites.replaceChildren();for(const i of b.data){const div=document.createElement('div');div.className='model-entry';const state=i.used_at?'登録済み':i.revoked_at?'取消済み':new Date(i.expires_at)<new Date()?'期限切れ':'有効';div.append(document.createTextNode(`${i.email} · ${i.role} · ${state} · 期限 ${new Date(i.expires_at).toLocaleString('ja-JP')}`));if(state==='有効'){const button=document.createElement('button');button.className='secondary';button.textContent='招待取消';button.onclick=async()=>{const {error}=await db.rpc('app_revoke_invite',{p_id:i.id});if(error)alert(error.message);else await loadUsers();};div.append(button);}invites.append(div);}}
$('refreshUsers').onclick=loadUsers;
$('logout').onclick=async()=>{const {error}=await db.auth.signOut({scope:'local'});if(error)alert(error.message);else await sync(null);};$('refresh').onclick=reload;document.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>{tab(b.dataset.tab);if(b.dataset.tab==='users')loadUsers();});
// Standard CSV/JSON parser. Does not fetch a third-party site or execute pasted content.
function csvRows(raw){const lines=[];let row=[],value='',quoted=false;const s=raw.replace(/^\uFEFF/,'');for(let i=0;i<s.length;i++){const c=s[i];if(c==='"'){if(quoted&&s[i+1]==='"'){value+='"';i++;}else quoted=!quoted;}else if(c===','&&!quoted){row.push(value);value='';}else if((c==='\n'||c==='\r')&&!quoted){if(c==='\r'&&s[i+1]==='\n')i++;row.push(value);if(row.some(x=>x.trim()))lines.push(row);row=[];value='';}else value+=c;}if(quoted)throw Error('CSVの引用符が閉じられていません');row.push(value);if(row.some(x=>x.trim()))lines.push(row);return lines;}
const cleanKey=s=>String(s).toLowerCase().replace(/[\s_\-()（）]/g,'');
function parseInput(raw){let arr;if(raw.trim().startsWith('[')||raw.trim().startsWith('{')){let json=JSON.parse(raw);if(json.error)throw Error(json.error);arr=Array.isArray(json)?json:json.rows||json.data||json.records;if(!Array.isArray(arr))throw Error('JSONは配列、またはrows/data/records配列を持つ必要があります');}else{const lines=csvRows(raw);if(lines.length<2)throw Error('見出し行とデータ行が必要です');arr=lines.slice(1).map(row=>Object.fromEntries(lines[0].map((h,i)=>[h,row[i]??''])));}if(arr.length>500)throw Error('一度の取込は500台までにしてください');return arr.map((v,i)=>{if(Array.isArray(v))throw Error('JSONはキー付きオブジェクトにしてください');const obj=Object.fromEntries(Object.entries(v).map(([k,val])=>[cleanKey(k),val]));const get=(...keys)=>{for(const k of keys){const val=obj[cleanKey(k)];if(val!==undefined&&val!==null&&val!=='')return val;}return undefined;};const r={machine_number:String(get('台番号','台','number','machine_number','台番')??'').trim(),games:num(get('総回転数','回転数','ゲーム数','G','games','totalgames')),bb:num(get('BB','big','bigbonus')),rb:num(get('RB','REG','regular','reg')),diff_medals:optionalInt(get('差玉','差枚','差枚数','差玉数','diff_medals','difference')),max_hold:optionalInt(get('最大持玉','最大持ち玉','最大持メダル','最大獲得枚数','max_hold')),start_games:optionalInt(get('スタート','現在スタート','現在のスタート回転数','start_games')),play_status:String(get('状態','稼働状態','status','play_status')??'').trim()||null};r.valid=!!r.machine_number&&r.machine_number.length<=40&&[r.games,r.bb,r.rb].every(n=>Number.isInteger(n)&&n>=0&&n<=100000)&&r.bb+r.rb<=r.games&&r.bb<=10000&&r.rb<=10000&&[r.diff_medals,r.max_hold,r.start_games].every(n=>n===null||(Number.isSafeInteger(n)&&Math.abs(n)<=10000000))&&(r.play_status===null||r.play_status.length<=40);r.issue=r.valid?'OK':`行${i+2}：値を確認`;return r;});}
// Shortcut export: accepting JSON copied by the user, not reading third-party pages here.
function applyShortcutMetadata(raw){
  let obj;
  try{obj=JSON.parse(raw);}catch{return false;}
  if(!obj || Array.isArray(obj) || typeof obj!=='object')return false;
  const isShortcut=String(obj.source||'').startsWith('safari-shortcuts-teramoba');
  const store=String(obj.store||obj.store_name||'').trim();
  const machine=effectiveMachineName(String(obj.machine||obj.machine_name||'').trim());
  const date=String(obj.businessDate||obj.business_date||obj.date||'').trim();
  if(store && store.length<=120)$('store').value=store;
  if(machine && machine.length<=120)$('machine').value=machine;
  if(/^\d{4}-\d{2}-\d{2}$/.test(date) && !Number.isNaN(Date.parse(date+'T00:00:00')))$('businessDate').value=date;
  else if(isShortcut)$('businessDate').value=''; // 営業日未取得時は「今日」で勝手に保存しない
  if(isShortcut && (!store||!machine||!date))msg('importMessage','取得データに店舗・機種・営業日の一部がありません。ショートカットを更新してください。',true);
  return Boolean($('store').value.trim() && $('machine').value.trim() && $('businessDate').value);
}
function normalizeSharedInput(){
 const raw=$('rawData').value.trim();
 if(!raw.includes('#ja06=') || !/^https?:\/\//i.test(raw))return true;
 try{
  const decoded=decodeSharedLinkText(raw);
  $('rawData').value=decoded;
  applyShortcutMetadata(decoded);
  return true;
 }catch(e){
  msg('importMessage','共有URLの復元に失敗しました: '+e.message,true);
  return false;
 }
}
$('rawData').addEventListener('input',()=>{
 pending=[];$('saveRows').disabled=true;
 const raw=$('rawData').value.trim();
 if(raw.startsWith('https://') && raw.includes('#ja06=')){
  if(normalizeSharedInput())queueMicrotask(()=>$('preview').click());
  return;
 }
 applyShortcutMetadata($('rawData').value);
});
$('pasteClipboard').onclick=async()=>{
 try{const raw=await navigator.clipboard.readText();if(!raw.trim())throw Error('クリップボードが空です');
 if(raw.length>1000000)throw Error('読み込むデータが大きすぎます');
 const decoded=decodeSharedLinkText(raw);if(!decoded.startsWith('{')&&!decoded.startsWith('['))throw Error('台データJSONではありません。ショートカットを最新版に更新してください');$('rawData').value=decoded;applyShortcutMetadata(decoded);tab('import');$('preview').click();
 }catch(e){msg('importMessage','自動貼り付けできません: '+e.message+'。下のテキスト欄に手動で貼り付けてください。',true);}
};
$('openTeramoba').onclick=()=>window.open('https://nobuta.pt.teramoba2.com/lightshinshigai/rack_info','_blank','noopener,noreferrer');
$('importFile').onchange=async e=>{const f=e.target.files[0];if(!f)return;if(f.size>1024*1024){msg('importMessage','ファイルは1MB以下にしてください',true);return;}$('rawData').value=await f.text();applyShortcutMetadata($('rawData').value);};
$('preview').onclick=()=>{pending=[];$('saveRows').disabled=true;if(!normalizeSharedInput())return;applyShortcutMetadata($('rawData').value);const store=$('store').value.trim(),machine=$('machine').value.trim(),date=$('businessDate').value;if(!store||!machine||!date){msg('importMessage','店舗・機種・営業日を入力してください',true);return;}try{pending=parseInput($('rawData').value);if(!pending.length)throw Error('台データがありません');const seen=new Set();for(const r of pending){if(seen.has(r.machine_number)){r.valid=false;r.issue='同じ台番号が複数あります';}seen.add(r.machine_number);}const tbody=$('previewRows');tbody.replaceChildren();for(const r of pending){const tr=document.createElement('tr');for(const value of [r.machine_number,r.games,r.bb,r.rb,signed(r.diff_medals),displayOptional(r.max_hold),displayOptional(r.start_games),displayOptional(r.play_status),r.issue]){const td=document.createElement('td');td.textContent=String(value);tr.append(td);}tbody.appendChild(tr);}$('saveRows').disabled=pending.some(r=>!r.valid);msg('importMessage',`${pending.length}件読み取りました。${pending.filter(r=>!r.valid).length}件に確認が必要です。`,pending.some(r=>!r.valid));}catch(e){msg('importMessage',e.message,true);}};
$('saveRows').onclick=async()=>{
 if(!pending.length||pending.some(r=>!r.valid)||!user)return;
 const store=$('store').value.trim(),machine=$('machine').value.trim(),date=$('businessDate').value;
 if(!store||!machine||!/^\d{4}-\d{2}-\d{2}$/.test(date)){msg('importMessage','店舗・機種・営業日を確認してください',true);return;}
 const rows=pending.map(r=>({user_id:user.id,business_date:date,store_name:store,machine_name:effectiveMachineName(machine),machine_number:r.machine_number,games:r.games,bb:r.bb,rb:r.rb,diff_medals:r.diff_medals,max_hold:r.max_hold,start_games:r.start_games,play_status:r.play_status,imported_at:new Date().toISOString()}));
 $('saveRows').disabled=true;msg('importMessage',`${rows.length}件を保存しています…`);
 try{
  // Upsert uniquely by user/date/store/number, including machine-name corrections.
  // Write in small batches to avoid large payloads, while reporting partial failure explicitly.
  let saved=0;
  for(let i=0;i<rows.length;i+=100){
   const {error}=await db.from('machine_records').upsert(rows.slice(i,i+100),{onConflict:'user_id,business_date,store_name,machine_number'});
   if(error)throw Error(`${saved}件保存後、続きの登録に失敗: ${error.message}`);
   saved+=Math.min(100,rows.length-i);
  }
  const {count,error:checkError}=await db.from('machine_records').select('id',{count:'exact',head:true}).eq('business_date',date).eq('store_name',store).eq('machine_name',effectiveMachineName(machine));
  if(checkError)throw Error('保存要求は完了しましたが件数確認に失敗: '+checkError.message);
  msg('importMessage',`${saved}台の解析・更新が完了しました。${date}・${store}・${machine}の登録件数は${count}件です。`);
  pending=[];
  await reload();
  tab('comparison');
  $('comparisonDate').value=date;
  $('comparisonMachine').value=effectiveMachineName(machine);
  renderComparison();
 }catch(e){msg('importMessage',e.message+'。登録済みの台がある可能性があります。同じデータで再試行できます。',true);}
 finally{$('saveRows').disabled=pending.length===0||pending.some(r=>!r.valid);}
};
$('saveModel').onclick=async()=>{const name=$('modelName').value.trim();const settings=[];for(let i=1;i<=6;i++)settings.push({setting:i,bb:Number($('bb'+i).value),rb:Number($('rb'+i).value)});if(!name||settings.some(s=>!Number.isFinite(s.bb)||!Number.isFinite(s.rb)||s.bb<=1||s.rb<=1)){msg('modelMessage','名前と設定1〜6のBB・RB分母（1より大きい数）をすべて入力してください',true);return;}const source_url=$('modelSource').value.trim()||null;if($('modelType').value!=='manual'&&!source_url){msg('modelMessage','公式値・解析値を登録するときは出典URLが必要です',true);return;}const {error}=await db.from('machine_models').upsert({user_id:user.id,name,source_type:$('modelType').value,source_url,checked_on:$('modelChecked').value||null,settings},{onConflict:'user_id,name'});if(error)msg('modelMessage',error.message,true);else{msg('modelMessage','モデルを保存しました');await reload();}};
// Independent binomial terms: BB occurs with pBB per game and RB with pRB per game.
// Treat categories as mutually exclusive, using multinomial likelihood (constant omitted).
function infer(record,model){return analyzeStat(record,model).entries.map(e=>({setting:e.setting,prob:e.prob}));}
$('runAnalysis').onclick=()=>{
 const r=records.find(x=>x.id===$('analysisRecord').value),m=models.find(x=>x.id===$('analysisModel').value);
 if(!r||!m){msg('analysisMessage','台データと機種モデルを選択してください',true);return;}
 if(effectiveMachineName(r.machine_name)!==effectiveMachineName(m.name)){msg('analysisMessage','台の機種とモデルが一致しません',true);return;}
 try{
  const result=analyzeStat(r,m),ps=result.entries,high=ps.filter(x=>x.setting>=4).reduce((a,x)=>a+x.prob,0),mean=ps.reduce((a,x)=>a+x.setting*x.prob,0);
  const chart=result.profile?plotAnalysis(r,result):'<p class="warning">小役確率・重複確率の検証済みモデルが未登録のため、現在はボーナス回数のみで推定します。差枚分布は表示しません。</p>';
  $('analysisOutput').innerHTML=`<h3>${esc(r.business_date)} ${esc(r.store_name)} ${esc(r.machine_name)} ${esc(r.machine_number)}番台</h3><p>${r.games}G · BB ${r.bb} · RB ${r.rb} · 差枚 ${signed(r.diff_medals)}</p><p><b>推定設定値 ${mean.toFixed(2)} / 設定4以上 ${(100*high).toFixed(1)}%</b></p>`+chart+ps.map(x=>`<div class="prob-row"><b>設定${x.setting}</b><div class="bar"><div class="fill" style="width:${(100*x.prob).toFixed(2)}%"></div></div><b>${(100*x.prob).toFixed(1)}%</b></div>`).join('')+`<p class="hint">方式：${result.mode==='bonus+medals'?'BB/RB＋条件付き差枚（正規近似）':'BB/RBのみ'}。${result.profile?'暫定小役モデル：'+esc(result.profile.version)+'　重複確率：'+(result.profile.verifiedOverlap?'一部反映':'未検証・非反映')+'　出典：'+esc(result.profile.source):''}　チェリー狙い割合：${cherryAimShare}% ／ 平均取得率：${(100*aimCapture()).toFixed(2)}%。等事前確率の相対推定であり実設定の保証ではありません。モデルの未検証部分があります。</p>`;
  msg('analysisMessage','分析しました');
 }catch(e){msg('analysisMessage',e.message,true);}
};
const aimControl=$('cherryAimShare');if(aimControl){aimControl.value=cherryAimShare;$('cherryAimValue').textContent=cherryAimShare+'%';aimControl.addEventListener('input',()=>{cherryAimShare=Number(aimControl.value);$('cherryAimValue').textContent=cherryAimShare+'%';localStorage.setItem(SETTINGS_KEY,String(cherryAimShare));renderComparison();if($('analysisRecord').value&&$('analysisModel').value)$('runAnalysis').click();});}

init();
