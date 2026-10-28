import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';
const $ = id => document.getElementById(id);
// Curated versioned reference data; no unauthorised scraping or claimed live updates.
const CATALOG_CHECKED='2026-10-28';
const CURATED_CATALOG=[
 {"name":"マイジャグラーV","aliases":["マイジャグラー5","マイジャグラーⅤ","SマイジャグラーVKD","SマイジャグラーⅤKD","マイジャグ5"],"url":"https://www.kitadenshi.co.jp/fun/","sourceType":"official","bb":[273.1,270.8,266.4,254,240.1,229.1],"rb":[409.6,385.5,336.1,290,268.6,229.1],"payout":[97,98,99.9,102.8,105.3,109.4]},
 {"name":"マイジャグラーVI","aliases":["マイジャグラー6","マイジャグラーⅥ","マイジャグVI","マイジャグ6"],"url":"https://www.kitadenshi.co.jp/fun/","sourceType":"official","bb":[273.1,270.8,266.4,254,240.1,229.1],"rb":[409.6,385.5,336.1,290,268.6,229.1],"payout":[97,98,99.9,102.8,105.3,109.4]},
 {"name":"アイムジャグラーEX","aliases":["SアイムジャグラーEX","アイムジャグラーＥＸ","SアイムジャグラーEX-TP","SアイムジャグラーEXTP","アイムEX"],"url":"https://pachislot-memo.online/juggler-all","sourceType":"secondary","bb":[273.1,269.7,269.7,259,259,255],"rb":[439.8,399.6,331,315.1,255,255],"payout":[97,98,99.5,101.1,103.3,105.5]},
 {"name":"ネオアイムジャグラーEX","aliases":["ネオアイムジャグラー","ネオアイム","ネオアイムEX"],"url":"https://tsumoreru.com/machines/juggler_neo_im_ex/","sourceType":"secondary","bb":[273.1,269.7,269.7,259,259,255],"rb":[439.8,399.6,331,315.1,255,255],"payout":[97,98,99.5,101.1,103.3,105.5]},
 {"name":"ゴーゴージャグラー3","aliases":["ゴーゴージャグラーⅢ","Sゴーゴージャグラー3","ゴージャグ3"],"url":"https://pachislot-memo.online/juggler-all","sourceType":"secondary","bb":[259,258,257,254,247.3,234.9],"rb":[354.2,332.7,306.2,268.6,247.3,234.9],"payout":[97.2,98.2,99.4,101.6,103.8,106.5]},
 {"name":"ファンキージャグラー2","aliases":["ファンキージャグラーⅡ","ファンキー2","ファンキー"],"url":"https://pachislot-memo.online/juggler-all","sourceType":"secondary","bb":[266.4,259,256,249.2,240.1,219.9],"rb":[439.8,407.1,366.1,322.8,299.3,262.1]},
 {"name":"ハッピージャグラーVⅢ","aliases":["ハッピージャグラーVIII","ハッピージャグラーV3","ハッピージャグラー3","ハッピー3"],"url":"https://pachislot-memo.online/juggler-all","sourceType":"secondary","bb":[273.1,270.8,263.2,254,239.2,226],"rb":[397.2,362.1,332.7,300.6,273.1,256]},
 {"name":"ジャグラーガールズSS","aliases":["ジャグラーガールズ","ガールズSS","ジャグラーガールズＳＳ"],"url":"https://pachislot-memo.online/juggler-all","sourceType":"secondary","bb":[273.1,270.8,260.1,250.1,243.6,226],"rb":[381,350.5,316.6,281.3,270.8,252.1]},
 {"name":"ウルトラミラクルジャグラー","aliases":["ウルトラミラクル","ミラクルジャグラー","ウルミラ"],"url":"https://pachislot-memo.online/juggler-all","sourceType":"secondary","bb":[267.5,261.1,256,242.7,233.2,216.3],"rb":[425.6,402.1,350.5,322.8,297.9,277.7]},
 {"name":"ミスタージャグラー","aliases":["ミスター","ミスタージャグ"],"url":"https://pachislot-memo.online/juggler-all","sourceType":"secondary","bb":[268.6,267.5,260.1,249.2,240.9,237.4],"rb":[374.5,354.2,331,291.3,257,237.4]},
];
const normalizeMachine=s=>String(s||'').normalize('NFKC').toLowerCase().replace(/[\s　・_\-]/g,'').replace(/^(s|l)(?=[ァ-ヶ])/,'');
function catalogFor(s){const key=normalizeMachine(s);return CURATED_CATALOG.find(m=>[m.name,...m.aliases].some(a=>normalizeMachine(a)===key))||null;}
function modelFor(s){const entry=catalogFor(s);return models.find(m=>normalizeMachine(m.name)===normalizeMachine(entry?.name||s)||normalizeMachine(m.name)===normalizeMachine(s))||null;}
function effectiveMachineName(s){return catalogFor(s)?.name||s;}
async function seedKnownModels(){
 if(!user)return;
 const missing=CURATED_CATALOG.filter(c=>!models.some(m=>normalizeMachine(m.name)===normalizeMachine(c.name)));
 if(!missing.length)return;
 const payload=missing.map(c=>({user_id:user.id,name:c.name,source_type:'estimated',source_url:c.url,checked_on:CATALOG_CHECKED,settings:c.bb.map((bb,i)=>({setting:i+1,bb,rb:c.rb[i],payout:c.payout?.[i]??null}))}));
 const {error}=await db.from('machine_models').upsert(payload,{onConflict:'user_id,name',ignoreDuplicates:true});
 if(error)console.warn('カタログ登録保留:',error.message);
}
function inferenceMetrics(r){const m=modelFor(r.machine_name);if(!m)return {model:null,high:null,expected:null,likely:null};try{const ps=infer(r,m);return {model:m,high:ps.filter(p=>Number(p.setting)>=4).reduce((v,p)=>v+p.prob,0),expected:ps.reduce((v,p)=>v+Number(p.setting)*p.prob,0),likely:ps.reduce((a,b)=>a.prob>=b.prob?a:b).setting};}catch{return {model:m,high:null,expected:null,likely:null};}}

const config=window.APP_CONFIG||{};
let db=null, user=null, records=[], models=[], pending=[], membership=null, initialized=false;
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
 for(const {r,high,expected,likely} of visible.slice(0,500)){
  const tr=document.createElement('tr');
  for(const v of [r.business_date,r.machine_name,r.machine_number,r.games,r.bb,r.rb,signed(r.diff_medals),displayOptional(r.max_hold),displayOptional(r.start_games),displayOptional(r.play_status),expected===null?'未推定':expected.toFixed(2),likely===null?'未推定':'設定'+likely,high===null?'モデル未登録 / 判定不可':(high*100).toFixed(1)+'%']){
   const td=document.createElement('td');td.textContent=v;tr.append(td);
  }
  const td=document.createElement('td'),button=document.createElement('button');button.className='secondary';button.textContent='分析';
  button.disabled=high===null;button.onclick=()=>{tab('analyze');$('analysisRecord').value=r.id;$('analysisModel').value=modelFor(r.machine_name)?.id||'';$('runAnalysis').click();};
  td.append(button);tr.append(td);body.append(tr);
 }
 if(!visible.length){const tr=document.createElement('tr'),td=document.createElement('td');td.colSpan=14;td.textContent=key==='high_number'?'推定設定値4.0以上の台はありません（機種モデル未登録の台は対象外）':'該当するデータはありません';tr.append(td);body.append(tr);}
}
$('comparisonSort').onchange=renderComparison;
$('comparisonDate').onchange=renderComparison;
$('comparisonMachine').onchange=renderComparison;
for(const id of ['store','machine','businessDate']) $(id).addEventListener('input',()=>{pending=[];$('saveRows').disabled=true;});
async function reload(){if(!user)return;const [a,b]=await Promise.all([db.from('machine_records').select('*').order('business_date',{ascending:false}).limit(1000),db.from('machine_models').select('*').order('name')]);if(a.error||b.error){alert('データ取得失敗: '+(a.error?.message||b.error?.message));return;}records=a.data||[];models=b.data||[];render();}
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
$('rawData').addEventListener('input',()=>{pending=[];$('saveRows').disabled=true;applyShortcutMetadata($('rawData').value);});
$('pasteClipboard').onclick=async()=>{
 try{const raw=await navigator.clipboard.readText();if(!raw.trim())throw Error('クリップボードが空です');
 if(raw.length>1000000)throw Error('読み込むデータが大きすぎます');
 const decoded=decodeSharedLinkText(raw);if(!decoded.startsWith('{')&&!decoded.startsWith('['))throw Error('台データJSONではありません。ショートカットを最新版に更新してください');$('rawData').value=decoded;applyShortcutMetadata(decoded);tab('import');$('preview').click();
 }catch(e){msg('importMessage','自動貼り付けできません: '+e.message+'。下のテキスト欄に手動で貼り付けてください。',true);}
};
$('openTeramoba').onclick=()=>window.open('https://nobuta.pt.teramoba2.com/lightshinshigai/rack_info','_blank','noopener,noreferrer');
$('importFile').onchange=async e=>{const f=e.target.files[0];if(!f)return;if(f.size>1024*1024){msg('importMessage','ファイルは1MB以下にしてください',true);return;}$('rawData').value=await f.text();applyShortcutMetadata($('rawData').value);};
$('preview').onclick=()=>{pending=[];$('saveRows').disabled=true;applyShortcutMetadata($('rawData').value);const store=$('store').value.trim(),machine=$('machine').value.trim(),date=$('businessDate').value;if(!store||!machine||!date){msg('importMessage','店舗・機種・営業日を入力してください',true);return;}try{pending=parseInput($('rawData').value);if(!pending.length)throw Error('台データがありません');const seen=new Set();for(const r of pending){if(seen.has(r.machine_number)){r.valid=false;r.issue='同じ台番号が複数あります';}seen.add(r.machine_number);}const tbody=$('previewRows');tbody.replaceChildren();for(const r of pending){const tr=document.createElement('tr');for(const value of [r.machine_number,r.games,r.bb,r.rb,signed(r.diff_medals),displayOptional(r.max_hold),displayOptional(r.start_games),displayOptional(r.play_status),r.issue]){const td=document.createElement('td');td.textContent=String(value);tr.append(td);}tbody.appendChild(tr);}$('saveRows').disabled=pending.some(r=>!r.valid);msg('importMessage',`${pending.length}件読み取りました。${pending.filter(r=>!r.valid).length}件に確認が必要です。`,pending.some(r=>!r.valid));}catch(e){msg('importMessage',e.message,true);}};
$('saveRows').onclick=async()=>{
 if(!pending.length||pending.some(r=>!r.valid)||!user)return;
 const store=$('store').value.trim(),machine=$('machine').value.trim(),date=$('businessDate').value;
 if(!store||!machine||!/^\d{4}-\d{2}-\d{2}$/.test(date)){msg('importMessage','店舗・機種・営業日を確認してください',true);return;}
 const rows=pending.map(r=>({user_id:user.id,business_date:date,store_name:store,machine_name:effectiveMachineName(machine),machine_number:r.machine_number,games:r.games,bb:r.bb,rb:r.rb,diff_medals:r.diff_medals,max_hold:r.max_hold,start_games:r.start_games,play_status:r.play_status}));
 $('saveRows').disabled=true;msg('importMessage',`${rows.length}件を保存しています…`);
 try{
  // Upsert is idempotent for the same user/date/store/machine/number.
  // Write in small batches to avoid large payloads, while reporting partial failure explicitly.
  let saved=0;
  for(let i=0;i<rows.length;i+=100){
   const {error}=await db.from('machine_records').upsert(rows.slice(i,i+100),{onConflict:'user_id,business_date,store_name,machine_name,machine_number'});
   if(error)throw Error(`${saved}件保存後、続きの登録に失敗: ${error.message}`);
   saved+=Math.min(100,rows.length-i);
  }
  const {count,error:checkError}=await db.from('machine_records').select('id',{count:'exact',head:true}).eq('business_date',date).eq('store_name',store).eq('machine_name',machine);
  if(checkError)throw Error('保存要求は完了しましたが件数確認に失敗: '+checkError.message);
  msg('importMessage',`${saved}件の保存要求が成功しました。${date}・${store}・${machine}の登録件数は${count}件です。既存の同一台番号は更新されます。`);
  pending=[];
  await reload();
 }catch(e){msg('importMessage',e.message+'。登録済みの台がある可能性があります。同じデータで再試行できます。',true);}
 finally{$('saveRows').disabled=pending.length===0||pending.some(r=>!r.valid);}
};
$('saveModel').onclick=async()=>{const name=$('modelName').value.trim();const settings=[];for(let i=1;i<=6;i++)settings.push({setting:i,bb:Number($('bb'+i).value),rb:Number($('rb'+i).value)});if(!name||settings.some(s=>!Number.isFinite(s.bb)||!Number.isFinite(s.rb)||s.bb<=1||s.rb<=1)){msg('modelMessage','名前と設定1〜6のBB・RB分母（1より大きい数）をすべて入力してください',true);return;}const source_url=$('modelSource').value.trim()||null;if($('modelType').value!=='manual'&&!source_url){msg('modelMessage','公式値・解析値を登録するときは出典URLが必要です',true);return;}const {error}=await db.from('machine_models').upsert({user_id:user.id,name,source_type:$('modelType').value,source_url,checked_on:$('modelChecked').value||null,settings},{onConflict:'user_id,name'});if(error)msg('modelMessage',error.message,true);else{msg('modelMessage','モデルを保存しました');await reload();}};
// Independent binomial terms: BB occurs with pBB per game and RB with pRB per game.
// Treat categories as mutually exclusive, using multinomial likelihood (constant omitted).
function infer(record,model){if(!record.games||record.bb+record.rb>record.games)throw Error('回転数またはボーナス回数に誤りがあります');const logs=model.settings.map(x=>{const a=1/x.bb,b=1/x.rb,c=1-a-b;if(a<=0||b<=0||c<=0)throw Error('確率モデルが不正です');return record.bb*Math.log(a)+record.rb*Math.log(b)+(record.games-record.bb-record.rb)*Math.log(c);});if(logs.length!==6)throw Error('設定1〜6のデータが必要です');const max=Math.max(...logs),exp=logs.map(v=>Math.exp(v-max)),sum=exp.reduce((a,b)=>a+b,0);return exp.map((v,i)=>({setting:model.settings[i].setting,prob:v/sum}));}
$('runAnalysis').onclick=()=>{const r=records.find(x=>x.id===$('analysisRecord').value),m=models.find(x=>x.id===$('analysisModel').value);if(!r||!m){msg('analysisMessage','台データと機種モデルを選択してください',true);return;}if(effectiveMachineName(r.machine_name)!==effectiveMachineName(m.name)){msg('analysisMessage','警告：台データとモデルの機種名が一致していません。分析を中止しました。',true);return;}try{const probs=infer(r,m),max=Math.max(...probs.map(x=>x.prob));$('analysisOutput').innerHTML=`<p><b>${esc(r.machine_name)} ${esc(r.machine_number)}番台</b> · ${r.games}G · BB ${r.bb} · RB ${r.rb} · 差枚 ${signed(r.diff_medals)} · 最大持玉 ${displayOptional(r.max_hold)} · 現在スタート ${displayOptional(r.start_games)} · 状態 ${esc(displayOptional(r.play_status))}</p><p class="warning">確率はモデルと等事前確率を仮定した相対値です。設定の真の確率や勝率ではありません。</p>`+probs.map(x=>`<div class="prob-row"><b>設定${x.setting}</b><div class="bar"><div class="fill" style="width:${Math.max(0,x.prob*100)}%"></div></div><b>${(x.prob*100).toFixed(1)}%</b></div>`).join('')+`<p class="hint">モデル：${esc(m.source_type)}／確認日：${esc(m.checked_on||'未設定')}。差枚は参考情報であり、この推定確率には直接加えていません。少ないG数では判断が不安定です。</p>`;msg('analysisMessage','分析しました');}catch(e){msg('analysisMessage',e.message,true);}};
init();
