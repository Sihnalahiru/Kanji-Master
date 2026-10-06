const state={
page:'home', query:'', topic:'all', source:'all', sourceQuery:'',
xp:+localStorage.getItem('skm_xp')||0,
seen:+localStorage.getItem('skm_seen')||0,
mastered:+localStorage.getItem('skm_mastered')||0,
streak:+localStorage.getItem('skm_streak')||0,
daily:JSON.parse(localStorage.getItem('skm_daily')||'{}'),
modal:null,
selected:null
};

let kanji=[],manifest={},slots=[],source450Data=[],characterStories=[],memory450=[],learning={};

const $=s=>document.querySelector(s);

const esc=s=>String(s??'').replace(
/[&<>"']/g,
m=>({
'&':'&amp;',
'<':'&lt;',
'>':'&gt;',
'"':'&quot;',
"'":'&#39;'
}[m])
);

const today=()=>new Date().toISOString().slice(0,10);

const TOPICS=[
['personal','👤','Personal Information'],
['family','👨‍👩‍👧','Family'],
['home','🏠','Home & Daily Life'],
['time','🕐','Time & Dates'],
['food','🍱','Food & Drink'],
['shopping','🛍️','Shopping & Money'],
['transport','🚆','Transportation'],
['places','📍','Places & Directions'],
['work','💼','Work & Jobs'],
['health','🩺','Health & Medical'],
['weather','☀️','Weather & Seasons'],
['leisure','🎵','Leisure & Hobbies'],
['communication','💬','Communication & Requests'],
['public','🏢','Public Services'],
['travel','🧳','Travel & Accommodation']
];

const STORY={
'利用':{
title:'ප්‍රයෝජනයට ගන්නවා',
story:'දිනපතා ජීවිතයේ තියෙන දෙයක් අතට අරගෙන “මේක ප්‍රයෝජනයට ගන්නවා” කියලා මතක තියාගන්න.',
trigger:'利用 → භාවිතා කරනවා',
visual:'🛠️'
},
'窓口':{
title:'සේවා කවුළුව',
story:'කවුළුවක් ළඟට ගිහින් සේවාවක් ඉල්ලන කවුළුවක් මවාගන්න. 窓 = කවුළුව, 口 = මුඛය/විවෘත ස්ථානය.',
trigger:'窓口 → කවුළු කවුන්ටරය',
visual:'🪟'
},
'外国':{
title:'විදේශ රට',
story:'ඔයාගේ රටෙන් පිටත තියෙන රටක් සිතියමකින් බලන දර්ශනයක් මවාගන්න.',
trigger:'外国 → විදේශ රට',
visual:'🌍'
},
'郵便局':{
title:'තැපැල් කාර්යාලය',
story:'ලිපියක් අරගෙන තැපැල් කාර්යාලයට යන දර්ශනයක් මවාගන්න.',
trigger:'郵便局 → තැපැල් කාර්යාලය',
visual:'📮'
},
'情報':{
title:'තොරතුරු',
story:'දුරකථනයේ හෝ පුවරුවක වැදගත් තොරතුරු පේන දර්ශනයක් මතක තියාගන්න.',
trigger:'情報 → තොරතුරු',
visual:'📰'
},
'近所':{
title:'අසල්වැසි ප්‍රදේශය',
story:'ගෙදරට ළඟම තියෙන අසල්වැසි ගෙවල් කිහිපයක් මවාගන්න.',
trigger:'近所 → අසල්වැසි ප්‍රදේශය',
visual:'🏘️'
},
'相談':{
title:'සාකච්ඡා කර උපදෙස් ගන්නවා',
story:'ප්‍රශ්නයක් තියෙනකොට විශ්වාස කරන කෙනෙක් එක්ක කතා කරලා උපදෙස් ගන්න දර්ශනයක් මතක තියාගන්න.',
trigger:'相談 → උපදෙස් ගැන කතා කිරීම',
visual:'🗣️'
},
'自動':{
title:'ස්වයංක්‍රීය',
story:'කෙනෙක් තල්ලු නොකරත් යන්ත්‍රයක් තමන්ම ක්‍රියා කරන දර්ශනයක් මවාගන්න.',
trigger:'自動 → ස්වයංක්‍රීය',
visual:'⚙️'
},
'質問':{
title:'ප්‍රශ්නය',
story:'අත උස්සලා ගුරුවරයාගෙන් ප්‍රශ්නයක් අහන දර්ශනයක් මතක තියාගන්න.',
trigger:'質問 → ප්‍රශ්නය',
visual:'❓'
},
'洗う':{
title:'සෝදනවා',
story:'අත් දෙක වතුරෙන් සෝදන දර්ශනයක් මවාගන්න.',
trigger:'洗う → සෝදනවා',
visual:'🫧'
},
'学生':{
title:'ශිෂ්‍යයා',
story:'පොත් බෑගයක් අරගෙන පාසලට යන ශිෂ්‍යයෙක් මවාගන්න.',
trigger:'学生 → ශිෂ්‍යයා',
visual:'🎒'
},
'仕事':{
title:'රැකියාව / වැඩ',
story:'උදේ වැඩට ගිහින් තමන්ගේ රාජකාරිය කරන දර්ශනයක් මවාගන්න.',
trigger:'仕事 → රැකියාව / වැඩ',
visual:'💼'
},
'学校':{
title:'පාසල',
story:'පංති කාමරයක්, ගුරුවරයෙක් සහ සිසුන් සිටින පාසල් දර්ශනයක් මතක තියාගන්න.',
trigger:'学校 → පාසල',
visual:'🏫'
},
'元気':{
title:'සෞඛ්‍ය සම්පන්න / හොඳ තත්ත්වයේ',
story:'උදේ නැගිටලා ශක්තියෙන් දවස ආරම්භ කරන කෙනෙක් මවාගන්න.',
trigger:'元気 → සෞඛ්‍ය සම්පන්න',
visual:'💪'
},
'生活':{
title:'ජීවිතය / දෛනික ජීවිතය',
story:'උදේ සිට රාත්‍රිය දක්වා දිනපතා කරන වැඩ එකම දිනයක දර්ශන මාලාවක් ලෙස මතක තියාගන්න.',
trigger:'生活 → දෛනික ජීවිතය',
visual:'🏠'
},
'忙しい':{
title:'කාර්යබහුල',
story:'එකවර වැඩ ගොඩක් තියෙන නිසා වේගයෙන් එහා මෙහා යන කෙනෙක් මවාගන්න.',
trigger:'忙しい → කාර්යබහුල',
visual:'🏃'
},
'去年':{
title:'පසුගිය අවුරුද්ද',
story:'දින දර්ශනයේ මේ අවුරුද්දෙන් එක පියවරක් පස්සට යන දර්ශනයක් මවාගන්න.',
trigger:'去年 → පසුගිය අවුරුද්ද',
visual:'📆'
},
'働く':{
title:'වැඩ කරනවා',
story:'තමන්ගේ රැකියාවේ වගකීමක් කරලා අවසන් කරන කෙනෙක් මවාගන්න.',
trigger:'働く → වැඩ කරනවා',
visual:'🔧'
},
'先週':{
title:'පසුගිය සතිය',
story:'කැලැන්ඩරයේ මේ සතියෙන් එක කොටසක් පස්සට යන දර්ශනයක් මතක තියාගන්න.',
trigger:'先週 → පසුගිය සතිය',
visual:'🗓️'
},
'作る':{
title:'හදනවා / නිර්මාණය කරනවා',
story:'අමුද්‍රව්‍ය අරගෙන දෙයක් හදන කෙනෙක් මවාගන්න.',
trigger:'作る → හදනවා',
visual:'🛠️'
},
'人':{
title:'මිනිසා',
story:'මිනිස් හැඩයම Kanji එකේ මූලික රූපය ලෙස මතක තියාගන්න.',
trigger:'人 → මිනිසා',
visual:'🧍'
},
'夕方':{
title:'සවස',
story:'ඉර බැස යන වෙලාවේ අහස වෙනස් වෙන දර්ශනයක් මවාගන්න.',
trigger:'夕方 → සවස',
visual:'🌇'
},
'一人':{
title:'එක් පුද්ගලයෙක්',
story:'කණ්ඩායමක් නැතුව එකම කෙනෙක් සිටින දර්ශනයක් මතක තියාගන්න.',
trigger:'一人 → එක් පුද්ගලයෙක්',
visual:'1️⃣'
},
'英語':{
title:'ඉංග්‍රීසි භාෂාව',
story:'භාෂා පන්තියක English වචන කියවන දර්ශනයක් මවාගන්න.',
trigger:'英語 → ඉංග්‍රීසි භාෂාව',
visual:'🔤'
},
'二人':{
title:'පුද්ගලයන් දෙදෙනෙක්',
story:'මිතුරන් දෙදෙනෙක් එකට සිටින දර්ශනයක් මතක තියාගන්න.',
trigger:'二人 → දෙදෙනෙක්',
visual:'👥'
},
'音楽':{
title:'සංගීතය',
story:'ගීතයක් අහන විට ශබ්දය සහ සතුට එකට මතක තියාගන්න.',
trigger:'音楽 → සංගීතය',
visual:'🎵'
},
'犬':{
title:'බල්ලා',
story:'බල්ලා දිවගෙන එන සරල දර්ශනයක් මවාගන්න.',
trigger:'犬 → බල්ලා',
visual:'🐕'
},
'習う':{
title:'ඉගෙන ගන්නවා',
story:'ගුරුවරයෙකුගෙන් අලුත් දෙයක් ඉගෙන ගන්නා දර්ශනයක් මතක තියාගන්න.',
trigger:'習う → ඉගෙන ගන්නවා',
visual:'📚'
},
'家族':{
title:'පවුල',
story:'එකම ගෙදර එකට සිටින පවුලක් මවාගන්න.',
trigger:'家族 → පවුල',
visual:'👨‍👩‍👧'
},
'話す':{
title:'කතා කරනවා',
story:'මිතුරෙකු සමඟ මුහුණට මුහුණ කතා කරන දර්ශනයක් මතක තියාගන්න.',
trigger:'話す → කතා කරනවා',
visual:'💬'
}
};

function save(){
localStorage.setItem('skm_xp',state.xp);
localStorage.setItem('skm_seen',state.seen);
localStorage.setItem('skm_mastered',state.mastered);
localStorage.setItem('skm_streak',state.streak);
localStorage.setItem('skm_daily',JSON.stringify(state.daily));
}

function ensureDaily(){
if(state.daily.date!==today()){
state.daily={
date:today(),
done:0,
ids:[]
};
}
}

function dailyPct(){
ensureDaily();
return Math.min(100,(state.daily.done||0)/25*100);
}

function memoryFor(id){
return memory450.find(x=>x.source_entry_id===id);
}

/*
CREATIVE SINHALA EXPLANATION FIX

IMPORTANT:
- Existing source data is NOT modified.
- Existing JSON is NOT overwritten.
- This function creates an additive learning explanation.
- These are learning mnemonics, NOT official Kanji etymology.
*/
function creativeExplanationFor(m,r){
const jp=m?.japanese||r?.kanji||'';
const si=m?.sinhala||r?.sinhala||'';
const known=STORY[jp];

if(known){
return `${known.visual} ${known.story}
🧠 “${si}” කියන Sinhala meaning එක මතක් වුණාම ${jp} කියන Japanese word එක recall කරන්න.
🎯 ${jp} → ${si}`;
}

const text=String(si||'').trim();

if(/තැපැල්|post/i.test(text)){
return `📮 Japan එකේ තැපැල් කාර්යාලයක counter එක ඉස්සරහ ඉන්නවා කියලා හිතන්න. අතේ ලිපියක් හෝ parcel එකක් තියෙනවා. ඉදිරියේ ${jp} කියලා ලොකු sign එකක් පේනවා. ලිපිය භාර දෙන මොහොතේ “${text}” කියන Sinhala meaning එක මතක් කරගෙන ${jp} එක්ක බැඳගන්න. 🎯 ${jp} → ${text}`;
}

if(/තොරතුරු|information/i.test(text)){
return `📱 Phone එකේ වැදගත් message එකක් open කරනවා කියලා හිතන්න. Screen එකේ ${jp} කියලා පේනවා. ඒ screen එකෙන් ඔයාට අවශ්‍ය “${text}” ලැබෙනවා. ඒ නිසා screen එකේ ${jp} දැක්කම ${text} කියලා recall කරන්න. 🎯 ${jp} → ${text}`;
}

if(/විදේශ|රට|country|foreign/i.test(text)){
return `🌍 Airport එකේ ලොකු world map එකක් ඉස්සරහ ඉන්නවා කියලා හිතන්න. තමන්ගේ රටෙන් පිටත රටක් පෙන්නලා ${jp} කියලා label එකක් තියෙනවා. ඒ label එක දැක්කම “${text}” කියන අදහස මතක් කරගන්න. 🎯 ${jp} → ${text}`;
}

if(/කවුළුව|කවුන්ටර|window|counter/i.test(text)){
return `🪟 Office එකක service window එකක් ළඟට යනවා කියලා හිතන්න. කවුළුව උඩ ${jp} කියලා sign එකක් තියෙනවා. එතැනින් සේවාවක් ගන්න වෙලාවේ “${text}” කියන meaning එක ${jp} එක්ක connect කරන්න. 🎯 ${jp} → ${text}`;
}

if(/භාවිත|ප්‍රයෝජන|use/i.test(text)){
return `🛠️ මේසය උඩ තියෙන tool එකක් අරගෙන වැඩකට භාවිතා කරනවා කියලා හිතන්න. Tool එකේ ${jp} කියලා label එකක් තියෙනවා. ඒක වැඩකට ගන්න හැම වෙලාවෙම “${text}” කියන meaning එක recall කරන්න. 🎯 ${jp} → ${text}`;
}

if(/අසල්|ළඟ|near|neigh/i.test(text)){
return `🏘️ ගෙදර දොරෙන් එළියට බැලුවම ළඟම තියෙන ගෙවල් කිහිපය පේනවා කියලා හිතන්න. ඒ ප්‍රදේශයට ${jp} කියලා ලොකු label එකක් දාගන්න. එතකොට ${jp} දැක්කම “${text}” කියලා මතක් වෙයි. 🎯 ${jp} → ${text}`;
}

if(/පාසල|ශිෂ්‍ය|ඉගෙන|school|student|learn/i.test(text)){
return `🏫 Japan පාසලක classroom එකකට ඇතුල් වෙනවා කියලා හිතන්න. Board එකේ ${jp} ලොකු අකුරින් ලියලා තියෙනවා. ගුරුවරයා ඒක පෙන්නලා “${text}” කියන අදහස explain කරනවා. ඒ classroom scene එක ${jp} එක්ක බැඳගන්න. 🎯 ${jp} → ${text}`;
}

if(/රැකියා|වැඩ|job|work/i.test(text)){
return `💼 උදේ office එකට ගිහින් තමන්ගේ වැඩ පටන් ගන්නවා කියලා හිතන්න. Desk එක උඩ ${jp} කියලා card එකක් තියෙනවා. වැඩ පටන් ගන්න මොහොතේ “${text}” කියන meaning එක recall කරන්න. 🎯 ${jp} → ${text}`;
}

if(/රෝහල|වෛද්‍ය|සෞඛ්‍ය|hospital|health|doctor/i.test(text)){
return `🏥 Hospital එකකට ඇතුල් වෙන scene එකක් හිතන්න. Reception එක ළඟ ${jp} කියලා sign එකක් පේනවා. ඒ medical scene එකට “${text}” කියන Sinhala meaning එක බැඳගන්න. 🎯 ${jp} → ${text}`;
}

if(/දුම්රිය|බස්|වාහන|station|train|bus|transport/i.test(text)){
return `🚆 Japan station එකක platform එකේ ඉන්නවා කියලා හිතන්න. Information board එකේ ${jp} කියලා පේනවා. ගමන් කරන scene එකට “${text}” කියන meaning එක attach කරන්න. 🎯 ${jp} → ${text}`;
}

if(/කඩ|සාප්පු|මිල|මුදල්|shop|money|price/i.test(text)){
return `🛍️ Shop එකකට ගිහින් භාණ්ඩයක් අතට ගන්නවා කියලා හිතන්න. Price tag එක ළඟ ${jp} කියලා පේනවා. Shopping scene එකට “${text}” කියන Sinhala meaning එක connect කරන්න. 🎯 ${jp} → ${text}`;
}

if(/කෑම|බීම|ආහාර|food|drink/i.test(text)){
return `🍱 මේසය උඩ Japanese කෑමක් තියෙනවා කියලා හිතන්න. Plate එක ළඟ ${jp} කියලා card එකක් තියෙනවා. ඒ කෑම/බීම scene එකෙන් “${text}” කියන meaning එක recall කරන්න. 🎯 ${jp} → ${text}`;
}

if(/වතුර|ජල|water/i.test(text)){
return `💧 සීතල වතුර glass එකක් අතට ගන්නවා කියලා හිතන්න. Glass එකේ ${jp} කියලා ලියලා තියෙනවා. වතුර දකින හැම වෙලාවෙම “${text}” කියන meaning එක ${jp} එක්ක මතක් කරගන්න. 🎯 ${jp} → ${text}`;
}

if(/කාල|වෙලාව|සතිය|මාස|අවුරුද්ද|time|week|month|year/i.test(text)){
return `🗓️ Calendar එකක් සහ clock එකක් එකට පේනවා කියලා හිතන්න. Calendar එකේ ${jp} ලොකු අකුරින් mark කරලා තියෙනවා. ඒක බලනකොට “${text}” කියන time meaning එක recall කරන්න. 🎯 ${jp} → ${text}`;
}

if(/පවුල|තාත්තා|අම්මා|සහෝදර|family|father|mother/i.test(text)){
return `👨‍👩‍👧 පවුලේ අය එකට photo එකකට ඉන්නවා කියලා හිතන්න. Photo එක යට ${jp} කියලා caption එකක් තියෙනවා. ඒ family picture එකෙන් “${text}” කියන meaning එක මතක් කරගන්න. 🎯 ${jp} → ${text}`;
}

if(/කතා|ප්‍රශ්න|සාකච්ඡා|talk|speak|question/i.test(text)){
return `💬 දෙන්නෙක් මුහුණට මුහුණ කතා කරනවා කියලා හිතන්න. Speech bubble එක ඇතුළේ ${jp} කියලා පේනවා. ඒ conversation scene එකට “${text}” කියන meaning එක බැඳගන්න. 🎯 ${jp} → ${text}`;
}

return `🧠 “${text}” කියන අදහසට ගැලපෙන දිනපතා ජීවිතයේ සරල දර්ශනයක් හිතන්න. ඒ දර්ශනයේ වැදගත්ම තැනට ${jp} කියන Japanese word එක ලොකු sign එකක් වගේ දාගන්න. Scene එක නැවත මතක් කරනකොට මුලින් ${jp}, ඊළඟට “${text}” කියලා recall කරන්න. 🎯 ${jp} → ${text}`;
}

function source450Card(x){
const r=x.structured_record;
const m=memoryFor(x.id);

const jp=m?.japanese||r?.kanji||`Source ${x.page}-${x.slot}`;
const si=m?.sinhala||r?.sinhala||'';
const label=si?`${jp} · ${si}`:jp;

return `<button class="source450-card" data-source-detail="${x.id}">
<div class="source450-image-wrap">
<img src="${x.crop}" loading="lazy" alt="Original source page ${x.page} slot ${x.slot}">
</div>
<div class="source450-meta">
<span class="source-tag">${m?.creative_explanation?'Creative + Source':'Original Source'}</span>
<b>${esc(label)}</b>
<small>Page ${x.page} · Slot ${x.slot}</small>
</div>
</button>`;
}

function source450(){
const q=(state.sourceQuery||'').toLowerCase();

const shown=source450Data.filter(x=>{
const r=x.structured_record;
const hay=[
x.id,
String(x.page),
String(x.slot),
r?.kanji||'',
r?.furigana||'',
r?.romaji||'',
r?.sinhala||''
].join(' ').toLowerCase();

return !q||hay.includes(q);
});

return `${header()}
<main class="app">

<section class="page-head">
<span class="eyebrow">450 SOURCE CARDS</span>
<h1>All 450 Source Entries</h1>
<p>Every source slot from the original 450-page scan is preserved. Existing structured records remain untouched.</p>
</section>

<div class="search-wrap">
<span>⌕</span>
<input
id="sourceSearch"
class="search"
placeholder="Search structured data / page / slot"
value="${esc(state.sourceQuery||'')}"
>
<button id="clearSourceSearch">×</button>
</div>

<div class="integrity">
<span>🔒</span>
<div>
<b>${shown.length} / ${source450Data.length} source entries visible</b>
<p>The original source image is the authority for every entry. No OCR text is used to overwrite source data.</p>
</div>
</div>

<div class="source450-grid">
${shown.map(source450Card).join('')}
</div>

</main>
${nav()}
${sourceDetailModal()}`;
}

function sourceDetailModal(){
const id=
state.modal&&String(state.modal).startsWith('source:')
?String(state.modal).slice(7)
:null;

if(!id)return '';

const x=source450Data.find(v=>v.id===id);
const m=memoryFor(id);
const r=x?.structured_record;

if(!x)return '';

const jp=m?.japanese||r?.kanji||'Source entry';
const fur=m?.furigana||r?.furigana||'';
const rom=m?.romaji||r?.romaji||'';
const si=m?.sinhala||r?.sinhala||'Original source visual';
const chars=m?.character_stories||[];

return `
<div class="modal-backdrop" data-close="1">
<div class="modal-card source-modal" onclick="event.stopPropagation()">

<button class="modal-close" data-close="1">×</button>

<div class="modal-label">
CREATIVE SINHALA MEMORY + SOURCE
</div>

<img
class="source-modal-image"
src="${esc(x.crop)}"
alt="Original source entry page ${x.page} slot ${x.slot}"
>

<div class="source-modal-meta">
<span class="source-tag">Page ${x.page} · Slot ${x.slot}</span>

<div class="kanji-detail">${esc(jp)}</div>
<div class="reading">${esc(fur)}</div>
<div class="romaji">${esc(rom)}</div>
<div class="meaning">${esc(si)}</div>
</div>

<div class="story-panel creative-panel">
<div class="story-visual">🧠</div>

<b>💡 Creative Sinhala Explanation</b>

<p>${esc(creativeExplanationFor(m,r))}</p>

<strong>
🧠 ${esc(m?.memory_trigger||`${jp} → ${si}`)}
</strong>

<small class="memory-note">
මෙය learning mnemonic එකක්. Official etymology එකක් නොවේ.
</small>
</div>

${
chars.length
?`
<div class="panel compact-panel">
<div class="panel-title">🧩 Character memory clues</div>

${chars.map(c=>`
<div class="character-story-row">
<b>${esc(c.kanji)}</b>

<div>
<small>${esc(c.anchor_word)}</small>
<p>${esc(c.sinhala_memory_story)}</p>
</div>
</div>
`).join('')}

</div>
`
:''
}

<button
class="primary full"
data-source-learn="${esc(x.id)}"
>
✓ Mark reviewed +10 XP
</button>

<button
class="secondary full"
data-flash450="${esc(x.id)}"
>
🎴 Open flashcard
</button>

</div>
</div>`;
}
function nav(){
return `<nav class="bottom">
<div class="bottom-in">
${[
['home','⌂','Home'],
['library','漢','Library'],
['daily','25','Daily'],
['cards','🎴','Cards'],
['more','☷','More']
].map(([p,i,t])=>`
<button class="nav-btn ${state.page===p?'active':''}" data-page="${p}">
<span>${i}</span>
<small>${t}</small>
</button>
`).join('')}
</div>
</nav>`;
}

function header(){
return `<header class="topbar">
<div class="top-inner">
<button class="icon-btn" data-page="home">☰</button>

<div>
<div class="appname">Sihina Kanji Master</div>
<div class="subtitle">
Japanese • Furigana • Romaji • Sinhala
</div>
</div>

<button class="profile">SL</button>
</div>
</header>`;
}

function statCard(icon,label,value,sub=''){
return `<div class="stat-card">
<div class="stat-icon">${icon}</div>
<div class="stat-label">${label}</div>
<div class="stat-value">${value}</div>
<div class="stat-sub">${sub}</div>
</div>`;
}

function menuTile(icon,title,sub,page,cls=''){
return `<button class="menu-tile ${cls}" data-page="${page}">
<span class="tile-icon">${icon}</span>
<span>
<b>${title}</b>
<small>${sub}</small>
</span>
<span class="arrow">›</span>
</button>`;
}

function home(){
ensureDaily();

const mastered=Math.min(
100,
Math.round(
(state.mastered/Math.max(1,kanji.length))*100
)
);

return `${header()}

<main class="app">

<section class="hero-card">
<div class="hero-orb">漢</div>

<div>
<span class="eyebrow">DAILY KANJI LAB</span>

<h1>
Learn Kanji.<br>
<em>Remember for life.</em>
</h1>

<p>
Source-preserving learning with Sinhala memory cues
and JFT-useful word families.
</p>
</div>
</section>

<section class="stats-grid">
${statCard(
'🎯',
'Today',
`${state.daily.done||0}/25`,
'daily target'
)}

${statCard(
'🔥',
'Streak',
state.streak,
'days'
)}

${statCard(
'⚡',
'XP',
state.xp,
'learning points'
)}

${statCard(
'🏆',
'Mastered',
state.mastered,
`${mastered}% of structured`
)}
</section>

<section class="section">

<div class="section-head">
<div>
<span class="eyebrow">TODAY</span>
<h2>Daily 25 Kanji</h2>
</div>

<button
class="text-btn"
data-page="daily"
>
View all ›
</button>
</div>

<div class="daily-card">

<div
class="progress-ring"
style="--p:${dailyPct()}%"
>
<div>
<strong>${state.daily.done||0}</strong>
<small>/25</small>
</div>
</div>

<div class="daily-copy">

<b>Keep your streak alive 🔥</b>

<p>
Recognition → reading → Sinhala cue →
word family → recall.
</p>

<button
class="primary"
data-page="daily"
>
Continue practice
</button>

</div>
</div>

</section>

<section class="section">

<div class="section-head">
<div>
<span class="eyebrow">QUICK LEARN</span>
<h2>Explore</h2>
</div>
</div>

<div class="menu-grid">

${menuTile(
'漢',
'All Kanji',
'450 source entries',
'source450',
'purple'
)}

${menuTile(
'🧠',
'Memory Stories',
'All 450 source entries',
'stories',
'teal'
)}

${menuTile(
'🎴',
'Flashcards',
'Tap to reveal',
'cards',
'lime'
)}

${menuTile(
'✍️',
'Writing Practice',
'Stroke reference + recall',
'writing',
'yellow'
)}

${menuTile(
'🔊',
'Reading',
'Japanese pronunciation',
'reading',
'blue'
)}

${menuTile(
'📝',
'Quiz',
'Japanese + Furigana',
'quiz',
'navy'
)}

${menuTile(
'📈',
'Progress',
'Mastery + SRS',
'progress',
'coral'
)}

${menuTile(
'🎮',
'Games',
'Fast recall challenges',
'games',
'mint'
)}

</div>

</section>

<section class="section">

<div class="section-head">

<div>
<span class="eyebrow">JFT-ORIENTED</span>
<h2>Topics</h2>
</div>

<button
class="text-btn"
data-page="topics"
>
All topics ›
</button>

</div>

<div class="topic-row">
${TOPICS.slice(0,8).map(t=>`
<button
class="topic-pill"
data-topic="${t[0]}"
>
${t[1]} ${t[2]}
</button>
`).join('')}
</div>

</section>

<section class="section">

<div class="section-head">

<div>
<span class="eyebrow">SOURCE LIBRARY</span>
<h2>Original PDFs</h2>
</div>

</div>

<div class="source-grid">

<button
class="source-card"
data-source="all450"
>
<span>📘</span>
<b>Kanji all 450</b>
<small>47 pages • original scan</small>
</button>

<button
class="source-card"
data-source="n4"
>
<span>📙</span>
<b>N4 Kanji</b>
<small>132 pages • original scan</small>
</button>

</div>

</section>

<section class="integrity">

<span>🔒</span>

<div>
<b>Source data is frozen</b>

<p>
Original JSON/PDF records are kept untouched.
New stories, UI and learning helpers live in
separate layers.
</p>
</div>

</section>

</main>

${nav()}
${modal()}`;
}

function library(){

let q=state.query.toLowerCase();

let shown=kanji.filter(x=>
[
x.kanji,
x.furigana,
x.romaji,
x.sinhala
]
.join(' ')
.toLowerCase()
.includes(q)
);

return `${header()}

<main class="app">

<section class="page-head">

<span class="eyebrow">LIBRARY</span>

<h1>All source records</h1>

<p>
Original structured records stay unchanged.
Search and learn around them.
</p>

</section>

<div class="search-wrap">

<span>⌕</span>

<input
id="search"
class="search"
placeholder="Japanese / Furigana / Romaji / Sinhala"
value="${esc(state.query)}"
>

<button id="clearSearch">×</button>

</div>

<div class="filter-row">

<button class="filter active">
Structured ${kanji.length}
</button>

<button
class="filter"
data-page="source"
>
All 450 source slots
</button>

<button
class="filter"
data-page="topics"
>
JFT topics
</button>

</div>

<div class="grid">
${shown.map(card).join('')}
</div>

${
shown.length
?''
:`
<div class="empty">
No structured record matches.
Open Source Pages to browse the original scans.
</div>
`
}

</main>

${nav()}
${modal()}`;
}

function card(x){

const st=STORY[x.kanji]||{
visual:'🈶',
title:x.sinhala||'Learning cue',
story:`${x.kanji} කියන වචනයේ අර්ථය ${x.sinhala||'source meaning'} ලෙස මතක තියාගන්න.`,
trigger:`${x.kanji} → ${x.sinhala||'meaning'}`
};

return `<article class="kanji-card">

<div class="card-top">

<span class="source-tag">
P.${x.sourcePage}
</span>

<button
class="mini-btn"
data-flash="${x.id}"
>
🎴
</button>

</div>

<div class="visual-badge">
${st.visual}
</div>

<div class="kanji-big">
${esc(x.kanji)}
</div>

<div class="reading">
${esc(x.furigana)}
</div>

<div class="romaji">
${esc(x.romaji)}
</div>

<div class="meaning">
${esc(x.sinhala)}
</div>

<div class="cue-line">
🧠 ${esc(st.trigger)}
</div>

<button
class="learn-btn"
data-detail="${x.id}"
>
Open learning unit
<span>›</span>
</button>

</article>`;
}

function detail(id){

const x=kanji.find(k=>k.id===id);

if(!x)return library();

const st=STORY[x.kanji]||{
visual:'🈶',
title:x.sinhala||'Learning cue',
story:`${x.kanji} කියන Kanji එකේ ${x.sinhala||'අර්ථය'} කියන scene එකක් මතක තියාගන්න.`,
trigger:`${x.kanji} → ${x.sinhala||'meaning'}`
};

const family=kanji
.filter(k=>
k.kanji
.split('')
.some(ch=>x.kanji.includes(ch))
)
.filter(k=>k.id!==x.id)
.slice(0,5);

return `${header()}

<main class="app">

<button
class="back-btn"
data-page="library"
>
‹ Library
</button>

<section class="detail-hero">

<div class="detail-visual">
${st.visual}
</div>

<div>

<span class="eyebrow">
KANJI LEARNING UNIT
</span>

<div class="kanji-detail">
${esc(x.kanji)}
</div>

<div class="reading detail-reading">
${esc(x.furigana)}
</div>

<div class="romaji">
${esc(x.romaji)}
</div>

<div class="meaning detail-meaning">
${esc(x.sinhala)}
</div>

</div>

<button
class="floating-card"
data-flash="${x.id}"
>
🎴
<small>Flashcard</small>
</button>

</section>

<section class="detail-grid">

<div class="panel">

<div class="panel-title">
🧩 Visual Clue
</div>

<div class="visual-clue">

<div class="clue-icon">
${st.visual}
</div>

<div>

<b>${esc(st.title)}</b>

<p>
මෙය <strong>memory aid</strong> එකක්.
Official etymology එකක් ලෙස නොගන්න.
</p>

</div>

</div>

</div>

<div class="panel story-panel">

<div class="panel-title">
💡 සිංහල මතක කතාව
</div>

<p>
${esc(st.story)}
</p>

<div class="trigger">
🧠 ${esc(st.trigger)}
</div>

</div>

</section>

<section class="panel">

<div class="panel-title">
🇯🇵 JFT-useful source words
</div>

<p class="panel-note">
මෙහි මුලින්ම පෙන්වන්නේ source records වලින්ම
Kanji/character එක share කරන words.
මේවා official JFT question claims නොව learning examples.
</p>

<div class="word-list">

${
family.length
?
family.map(w=>`
<button
class="word-row"
data-detail="${w.id}"
>

<span class="word-jp">
${esc(w.kanji)}
</span>

<span>

<b>
${esc(w.furigana)}
</b>

<small>
${esc(w.romaji)}
•
${esc(w.sinhala)}
</small>

</span>

<span>›</span>

</button>
`).join('')
:
`
<div class="empty">
No additional structured source word
found for this character.
</div>
`
}

</div>

</section>

<section class="panel">

<div class="panel-title">
🔊 Japanese Reading
</div>

<div class="audio-row">

<button
class="audio-btn"
data-speak="${esc(x.furigana)}"
>
▶
</button>

<div>

<b>Native-style browser speech</b>

<small>
${esc(x.furigana)} • Japanese
</small>

</div>

</div>

</section>

<section class="panel">

<div class="panel-title">
✍️ Stroke & Recall
</div>

<div class="stroke-card">

<div class="stroke-kanji">
${esc(x.kanji)}
</div>

<div>

<b>
Source visual reference
</b>

<p>
The original PDF illustration remains
unchanged. Animation is intentionally removed
from this redesign.
</p>

<button
class="secondary"
data-sourcepage="${x.sourcePage}"
>
Open source page ↗
</button>

</div>

</div>

</section>

<section class="panel">

<div class="panel-title">
🎯 Recall
</div>

<button
class="primary full"
data-mark="${x.id}"
>
I know this +10 XP
</button>

</section>

</main>

${nav()}
${modal()}`;
}

function daily(){

ensureDaily();

let items=[];

for(let i=0;i<25;i++){

let x=
kanji[
(state.daily.done+i)
%
Math.max(1,kanji.length)
];

if(x)items.push(x);

}

return `${header()}

<main class="app">

<section class="page-head">

<span class="eyebrow">
TODAY'S TARGET
</span>

<h1>25 Kanji</h1>

<p>
Repeat until recognition feels automatic.
</p>

</section>

<div class="daily-banner">

<div class="big-count">
${state.daily.done||0}
<small>/25</small>
</div>

<div>

<b>
${Math.round(dailyPct())}% complete
</b>

<div class="bar">
<i style="width:${dailyPct()}%"></i>
</div>

<p>
Each card:
Japanese → reading → Sinhala cue →
word family → recall.
</p>

</div>

</div>

<div class="grid">

${items.map(x=>`

<article class="kanji-card compact">

<div class="card-top">

<span class="source-tag">
Daily
</span>

<button
class="mini-btn"
data-flash="${x.id}"
>
🎴
</button>

</div>

<div class="kanji-big">
${esc(x.kanji)}
</div>

<div class="reading">
${esc(x.furigana)}
</div>

<div class="romaji">
${esc(x.romaji)}
</div>

<div class="meaning">
${esc(x.sinhala)}
</div>

<button
class="learn-btn"
data-mark-daily="${x.id}"
>
${
state.daily.ids.includes(x.id)
?'✓ Learned'
:'Mark learned'
}

<span>›</span>

</button>

</article>

`).join('')}

</div>

</main>

${nav()}
${modal()}`;
}

function cards(){

const x=
kanji[
state.seen%
Math.max(1,kanji.length)
]
||
kanji[0];

return `${header()}

<main class="app">

<section class="page-head">

<span class="eyebrow">
SMART FLASHCARDS
</span>

<h1>
Tap. Reveal. Recall.
</h1>

<p>
Flashcards open as a comfortable iOS-style popup,
without leaving your study screen.
</p>

</section>

<div
class="flash-preview"
data-flash="${x?.id||''}"
>

<div class="flash-mark">
🎴
</div>

<div class="kanji-detail">
${esc(x?.kanji||'漢')}
</div>

<div class="reading">
${esc(x?.furigana||'かんじ')}
</div>

<div class="romaji">
${esc(x?.romaji||'kanji')}
</div>

<div class="hint">
Tap to open card
</div>

</div>

<div class="grid">

<button
class="panel action-tile"
data-page="daily"
>
<b>🎯 Daily 25</b>
<small>Targeted practice</small>
</button>

<button
class="panel action-tile"
data-page="quiz"
>
<b>📝 Pure Japanese Quiz</b>
<small>Japanese + Furigana</small>
</button>

</div>

</main>

${nav()}
${modal()}`;
}

function stories(){

return `${header()}

<main class="app">

<section class="page-head">

<span class="eyebrow">
450 MEMORY LAB
</span>

<h1>
Sinhala Kanji Stories
</h1>

<p>
All 450 original source entries are available here.
Structured entries use their dedicated Sinhala story;
every other entry keeps the original scan as the
authoritative visual source.
</p>

</section>

<div class="source450-grid">

${source450Data.map(x=>{

const r=x.structured_record;
const st=r?STORY[r.kanji]:null;

return `
<button
class="source450-card"
data-source-detail="${x.id}"
>

<div class="source450-image-wrap">

<img
src="${x.crop}"
loading="lazy"
alt="Original source page ${x.page} slot ${x.slot}"
>

</div>

<div class="source450-meta">

<span class="source-tag">
${
st
?'Sinhala Story + Source'
:'Source + Memory Aid'
}
</span>

<b>
${
esc(
st?.title
||
r?.kanji
||
`Source entry ${x.page}-${x.slot}`
)
}
</b>

<small>
Page ${x.page} · Slot ${x.slot}
</small>

</div>

</button>
`;

}).join('')}

</div>

</main>

${nav()}
${sourceDetailModal()}`;
}

function topics(){

return `${header()}

<main class="app">

<section class="page-head">

<span class="eyebrow">
JFT ORIENTED
</span>

<h1>
15 Topic Navigation
</h1>

<p>
Topic navigation is a UI layer.
It does not rewrite source records.
</p>

</section>

<div class="topic-grid">

${TOPICS.map(t=>`

<button
class="topic-card"
data-topic="${t[0]}"
>

<span>${t[1]}</span>

<b>${t[2]}</b>

<small>
Explore source-linked words
</small>

<em>›</em>

</button>

`).join('')}

</div>

<section class="panel topic-results">

<div class="panel-title">

${
state.topic==='all'
?'Choose a topic'
:
TOPICS.find(
t=>t[0]===state.topic
)?.[2]||'Topic'
}

</div>

<p>
Current structured source records can be searched here.
Topic labels are navigation helpers, not claims that
a word is an official JFT item.
</p>

<div class="chips">

${kanji.slice(0,12).map(x=>`

<button
class="chip"
data-detail="${x.id}"
>
${esc(x.kanji)}
·
${esc(x.sinhala)}
</button>

`).join('')}

</div>

</section>

</main>

${nav()}
${modal()}`;
}

function progress(){

const total=kanji.length;

const pct=Math.round(
(state.mastered/Math.max(1,total))*100
);

return `${header()}

<main class="app">

<section class="page-head">

<span class="eyebrow">
MASTERY
</span>

<h1>
Your Kanji Progress
</h1>

<p>
Learning state is stored locally on this device.
</p>

</section>

<div class="master-card">

<div
class="progress-ring large"
style="--p:${pct}%"
>

<div>
<strong>${pct}%</strong>
<small>mastery</small>
</div>

</div>

<div>

<b>
${state.mastered} mastered
</b>

<p>
${state.seen} review actions
•
${state.xp} XP
•
${state.streak} day streak
</p>

</div>

</div>

<div class="stats-grid">

${statCard(
'👀',
'Seen',
state.seen,
'review actions'
)}

${statCard(
'🏆',
'Mastered',
state.mastered,
'structured'
)}

${statCard(
'⚡',
'XP',
state.xp,
'earned'
)}

${statCard(
'🔥',
'Streak',
state.streak,
'days'
)}

</div>

<section class="panel">

<div class="panel-title">
SRS buttons
</div>

<div class="srs-grid">

<button data-srs="again">
Again
</button>

<button data-srs="hard">
Hard
</button>

<button data-srs="good">
Good
</button>

<button data-srs="mastered">
Mastered
</button>

</div>

</section>
</main>

${nav()}
${modal()}`;
}
function writing(){

return `${header()}

<main class="app">

<section class="page-head">

<span class="eyebrow">
WRITING
</span>

<h1>
Write & Recall
</h1>

<p>
Use the original source page as the visual reference.
No fabricated animated stroke layer.
</p>

</section>

<div class="writing-card">

<div class="writing-kanji">
漢
</div>

<div class="writing-grid">

<div>
1
<br>
<small>Observe source</small>
</div>

<div>
2
<br>
<small>Trace on paper</small>
</div>

<div>
3
<br>
<small>Write from memory</small>
</div>

<div>
4
<br>
<small>Recognize</small>
</div>

</div>

<button
class="primary"
data-page="daily"
>
Practice today's 25
</button>

</div>

</main>

${nav()}
${modal()}`;
}


function reading(){

return `${header()}

<main class="app">

<section class="page-head">

<span class="eyebrow">
READING
</span>

<h1>
Japanese Reading Lab
</h1>

<p>
Japanese pronunciation practice with browser speech.
</p>

</section>

<div class="grid">

${kanji.slice(0,12).map(x=>`

<article class="kanji-card compact">

<div class="kanji-big">
${esc(x.kanji)}
</div>

<div class="reading">
${esc(x.furigana)}
</div>

<div class="romaji">
${esc(x.romaji)}
</div>

<div class="meaning">
${esc(x.sinhala)}
</div>

<button
class="audio-btn"
data-speak="${esc(x.furigana)}"
>
🔊 Listen
</button>

</article>

`).join('')}

</div>

</main>

${nav()}
${modal()}`;
}


function quiz(){

const pool=kanji.length
?kanji
:[];

if(!pool.length){

return `${header()}

<main class="app">

<section class="empty">
No structured quiz records available.
</section>

</main>

${nav()}`;
}

const x=
pool[
Math.floor(
Math.random()*pool.length
)
];

const choices=[
x.sinhala,
...pool
.filter(k=>k.id!==x.id)
.sort(()=>Math.random()-0.5)
.slice(0,3)
.map(k=>k.sinhala)
].sort(()=>Math.random()-0.5);

return `${header()}

<main class="app">

<section class="page-head">

<span class="eyebrow">
QUIZ MODE
</span>

<h1>
Japanese Recall
</h1>

<p>
Japanese question first.
Sinhala is shown only in the answer choices.
</p>

</section>

<section class="quiz-card">

<span class="quiz-label">
What does this mean?
</span>

<div class="quiz-kanji">
${esc(x.kanji)}
</div>

<div class="quiz-reading">
${esc(x.furigana)}
</div>

<div class="quiz-options">

${choices.map(c=>`

<button
class="quiz-option"
data-answer="${esc(c)}"
data-correct="${esc(x.sinhala)}"
>
${esc(c)}
</button>

`).join('')}

</div>

<button
class="secondary"
data-page="quiz"
>
Next Question
</button>

</section>

</main>

${nav()}
${modal()}`;
}


function games(){

return `${header()}

<main class="app">

<section class="page-head">

<span class="eyebrow">
GAMES
</span>

<h1>
Fast Recall Games
</h1>

<p>
Short activities for quick Japanese recognition.
</p>

</section>

<div class="game-grid">

<button
class="game-card"
data-page="quiz"
>
<span>🧠</span>
<b>Meaning Rush</b>
<small>
Japanese → Sinhala recall
</small>
</button>

<button
class="game-card"
data-page="cards"
>
<span>🎴</span>
<b>Flash Recall</b>
<small>
Reveal and remember
</small>
</button>

<button
class="game-card"
data-page="writing"
>
<span>✍️</span>
<b>Write Recall</b>
<small>
Look → hide → write
</small>
</button>

<button
class="game-card"
data-page="daily"
>
<span>🔥</span>
<b>Daily 25</b>
<small>
Complete today's target
</small>
</button>

</div>

</main>

${nav()}
${modal()}`;
}


function more(){

return `${header()}

<main class="app">

<section class="page-head">

<span class="eyebrow">
MORE
</span>

<h1>
Study Tools
</h1>

<p>
Additional learning and source tools.
</p>

</section>

<div class="menu-grid">

${menuTile(
'📚',
'Source Library',
'Original 450 entries',
'source450'
)}

${menuTile(
'🧠',
'Memory Stories',
'Sinhala creative explanations',
'stories'
)}

${menuTile(
'📈',
'Progress',
'Mastery and review',
'progress'
)}

${menuTile(
'📝',
'Quiz',
'Recall practice',
'quiz'
)}

${menuTile(
'🎮',
'Games',
'Fast recall',
'games'
)}

${menuTile(
'✍️',
'Writing',
'Writing practice',
'writing'
)}

</div>

</main>

${nav()}
${modal()}`;
}


function modal(){

if(!state.modal)return '';

const type=String(state.modal);

if(type.startsWith('flash:')){

const id=type.slice(6);

const x=kanji.find(k=>String(k.id)===String(id));

if(!x)return '';

const m=
memory450.find(
v=>String(v.source_entry_id)===String(id)
);

const r=m?.creative_explanation
?m
:null;

return `
<div
class="modal-backdrop"
data-close="1"
>

<div
class="modal-card"
onclick="event.stopPropagation()"
>

<button
class="modal-close"
data-close="1"
>
×
</button>

<div class="modal-label">
FLASHCARD
</div>

<div class="kanji-detail">
${esc(x.kanji)}
</div>

<div class="reading">
${esc(x.furigana)}
</div>

<div class="romaji">
${esc(x.romaji)}
</div>

<div class="meaning">
${esc(x.sinhala)}
</div>

${
r
?
`
<div class="story-panel creative-panel">

<div class="story-visual">
🧠
</div>

<b>
💡 Creative Sinhala Explanation
</b>

<p>
${esc(
creativeExplanationFor(r,null)
)}
</p>

<strong>
🎯
${esc(
r.memory_trigger
||
`${x.kanji} → ${x.sinhala}`
)}
</strong>

<small class="memory-note">
මෙය learning mnemonic එකක්.
Official etymology එකක් නොවේ.
</small>

</div>
`
:
`
<div class="story-panel">
<b>
🧠 Memory Cue
</b>
<p>
${esc(x.sinhala)}
</p>
</div>
`
}

<div class="flash-actions">

<button
class="secondary"
data-speak="${esc(x.furigana)}"
>
🔊 Listen
</button>

<button
class="primary"
data-mark="${x.id}"
>
✓ I know this +10 XP
</button>

</div>

</div>

</div>
`;
}

return '';
}


function markKnown(id){

state.seen++;

state.xp+=10;

if(!state._masteredIds){
state._masteredIds=[];
}

if(!state._masteredIds.includes(id)){

state._masteredIds.push(id);

state.mastered++;

}

save();

state.modal=null;

render();
}


function markDaily(id){

ensureDaily();

if(
!Array.isArray(state.daily.ids)
){
state.daily.ids=[];
}

if(
!state.daily.ids.includes(id)
){

state.daily.ids.push(id);

state.daily.done=
Math.min(
25,
state.daily.ids.length
);

state.seen++;
state.xp+=10;

save();

}

render();
}


function speak(text){

if(!('speechSynthesis' in window)){

alert(
'Japanese speech is not available in this browser.'
);

return;
}

window.speechSynthesis.cancel();

const u=
new SpeechSynthesisUtterance(text);

u.lang='ja-JP';
u.rate=.82;
u.pitch=1;

window.speechSynthesis.speak(u);
}


function sourcePage(page){

const n=
String(page)
.padStart(2,'0');

state.modal=null;

const url=
`./assets/pages/all450-${n}.jpg`;

window.open(
url,
'_blank',
'noopener'
);
}


function handleQuiz(button){

const answer=
button.dataset.answer;

const correct=
button.dataset.correct;

document
.querySelectorAll('.quiz-option')
.forEach(b=>{
b.disabled=true;

if(
b.dataset.answer===correct
){
b.classList.add('correct');
}
});

if(answer===correct){

button.classList.add('correct');

state.xp+=10;
state.seen++;

save();

}else{

button.classList.add('wrong');

}

}


function handleSRS(type){

const points={
again:1,
hard:3,
good:7,
mastered:10
};

state.xp+=points[type]||0;

state.seen++;

if(type==='mastered'){
state.mastered++;
}

save();

render();
}


function bind(){

document
.querySelectorAll('[data-page]')
.forEach(btn=>{

btn.addEventListener(
'click',
()=>{

state.page=
btn.dataset.page;

state.modal=null;

render();

window.scrollTo({
top:0,
behavior:'smooth'
});

}
);

});


document
.querySelectorAll('[data-detail]')
.forEach(btn=>{

btn.addEventListener(
'click',
()=>{

state.page='detail';

state.selected=
btn.dataset.detail;

render();

window.scrollTo({
top:0,
behavior:'smooth'
});

}
);

});


document
.querySelectorAll('[data-source-detail]')
.forEach(btn=>{

btn.addEventListener(
'click',
()=>{

state.modal=
`source:${btn.dataset.sourceDetail}`;

render();

}
);

});


document
.querySelectorAll('[data-flash]')
.forEach(btn=>{

btn.addEventListener(
'click',
e=>{

e.stopPropagation();

state.modal=
`flash:${btn.dataset.flash}`;

render();

}
);

});


document
.querySelectorAll('[data-flash450]')
.forEach(btn=>{

btn.addEventListener(
'click',
e=>{

e.stopPropagation();

state.modal=
`flash:${btn.dataset.flash450}`;

render();

}
);

});


document
.querySelectorAll('[data-mark]')
.forEach(btn=>{

btn.addEventListener(
'click',
()=>markKnown(btn.dataset.mark)
);

});


document
.querySelectorAll('[data-mark-daily]')
.forEach(btn=>{

btn.addEventListener(
'click',
()=>markDaily(
btn.dataset.markDaily
)
);

});


document
.querySelectorAll('[data-speak]')
.forEach(btn=>{

btn.addEventListener(
'click',
e=>{

e.stopPropagation();

speak(
btn.dataset.speak
);

}
);

});


document
.querySelectorAll('[data-srs]')
.forEach(btn=>{

btn.addEventListener(
'click',
()=>handleSRS(
btn.dataset.srs
)
);

});


document
.querySelectorAll('[data-close]')
.forEach(btn=>{

btn.addEventListener(
'click',
()=>{

state.modal=null;

render();

}
);

});


document
.querySelectorAll('[data-topic]')
.forEach(btn=>{

btn.addEventListener(
'click',
()=>{

state.topic=
btn.dataset.topic;

state.page='topics';

render();

}
);

});


document
.querySelectorAll('[data-sourcepage]')
.forEach(btn=>{

btn.addEventListener(
'click',
()=>sourcePage(
btn.dataset.sourcepage
)
);

});


document
.querySelectorAll('[data-source]')
.forEach(btn=>{

btn.addEventListener(
'click',
()=>{

if(
btn.dataset.source==='all450'
){

state.page='source450';

render();

}else{

window.open(
'./sources/n4-kanji.pdf',
'_blank',
'noopener'
);

}

}
);

});


const search=$('#search');

if(search){

search.addEventListener(
'input',
e=>{

state.query=
e.target.value;

render();

const el=$('#search');

if(el){

el.focus();

el.setSelectionRange(
state.query.length,
state.query.length
);

}

}
);

}


const sourceSearch=
$('#sourceSearch');

if(sourceSearch){

sourceSearch.addEventListener(
'input',
e=>{

state.sourceQuery=
e.target.value;

render();

const el=
$('#sourceSearch');

if(el){

el.focus();

el.setSelectionRange(
state.sourceQuery.length,
state.sourceQuery.length
);

}

}
);

}


const clearSearch=
$('#clearSearch');

if(clearSearch){

clearSearch.addEventListener(
'click',
()=>{

state.query='';

render();

}
);

}


const clearSourceSearch=
$('#clearSourceSearch');

if(clearSourceSearch){

clearSourceSearch.addEventListener(
'click',
()=>{

state.sourceQuery='';

render();

}
);

}


document
.querySelectorAll('.quiz-option')
.forEach(btn=>{

btn.addEventListener(
'click',
()=>handleQuiz(btn)
);

});

}


function render(){

ensureDaily();

const app=
document.querySelector('#app');

if(!app)return;

let html='';

switch(state.page){

case 'home':
html=home();
break;

case 'library':
html=library();
break;

case 'source450':
html=source450();
break;

case 'stories':
html=stories();
break;

case 'daily':
html=daily();
break;

case 'cards':
html=cards();
break;

case 'detail':
html=detail(state.selected);
break;

case 'topics':
html=topics();
break;

case 'progress':
html=progress();
break;

case 'writing':
html=writing();
break;

case 'reading':
html=reading();
break;

case 'quiz':
html=quiz();
break;

case 'games':
html=games();
break;

case 'more':
html=more();
break;

default:
html=home();

}

app.innerHTML=html;

bind();

}


async function loadJSON(url){

const response=
await fetch(
`${url}?v=${Date.now()}`
);

if(!response.ok){

throw new Error(
`Failed to load ${url}: ${response.status}`
);

}

return response.json();

}


async function boot(){

try{

const results=
await Promise.allSettled([

loadJSON('./data/kanji.json'),

loadJSON('./data/source-manifest.json'),

loadJSON('./data/source-slots.json'),

loadJSON('./data/source450-index.json'),

loadJSON('./data/kanji-character-stories.json'),

loadJSON('./data/kanji-memory-450.json')

]);


if(
results[0].status==='fulfilled'
){
kanji=
Array.isArray(
results[0].value
)
?
results[0].value
:
[];
}


if(
results[1].status==='fulfilled'
){
manifest=
results[1].value||{};
}


if(
results[2].status==='fulfilled'
){
slots=
Array.isArray(
results[2].value
)
?
results[2].value
:
[];
}


if(
results[3].status==='fulfilled'
){

source450Data=
Array.isArray(
results[3].value
)
?
results[3].value
:
[];

}


if(
results[4].status==='fulfilled'
){

characterStories=
Array.isArray(
results[4].value
)
?
results[4].value
:
[];

}


if(
results[5].status==='fulfilled'
){

memory450=
Array.isArray(
results[5].value
)
?
results[5].value
:
[];

}


/*
IMPORTANT DATA INTEGRITY CHECK

We do NOT create fake source records.
We do NOT overwrite source data.
*/

if(
!Array.isArray(source450Data)
||
source450Data.length===0
){

console.warn(
'Source 450 index unavailable.'
);

}


if(
memory450.length
&&
source450Data.length
){

const sourceIds=
new Set(
source450Data.map(
x=>x.id
)
);

const validMemory=
memory450.filter(
x=>sourceIds.has(
x.source_entry_id
)
);

if(
validMemory.length!==memory450.length
){

console.warn(
'Some memory records do not match source IDs.'
);

}

}


render();


}catch(error){

console.error(
'Sihina Kanji Master boot error:',
error
);

const app=
document.querySelector('#app');

if(app){

app.innerHTML=`

<main class="app">

<section class="empty">

<h2>
⚠️ App data could not be loaded
</h2>

<p>
Please refresh the page.
</p>

<small>
${esc(error.message)}
</small>

</section>

</main>

`;

}

}

}


if(
'serviceWorker' in navigator
){

window.addEventListener(
'load',
()=>{
navigator.serviceWorker
.register('./sw.js')
.catch(
error=>
console.warn(
'Service Worker registration failed:',
error
)
);
}
);

}


document.addEventListener(
'DOMContentLoaded',
boot
);
