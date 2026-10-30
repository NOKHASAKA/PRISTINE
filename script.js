const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const STORAGE_KEY = "pristine-starter-v1";
const today = new Date();
const dateKey = (date) => `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`;
const safeId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`;
const esc = (value="") => String(value).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const formatDate = (date, options={weekday:"short",month:"short",day:"numeric"}) => new Intl.DateTimeFormat(undefined, options).format(date);
const startOfWeek = (date) => { const d = new Date(date); d.setDate(d.getDate() - ((d.getDay()+6)%7)); d.setHours(0,0,0,0); return d; };
const dayNames = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
const themes = [
  {id:"ocean",name:"Pristine Ocean",desc:"Midnight blue, turquoise, sunlight",colors:["#061b2a","#0a5269","#78dce0","#e7c78c"]},
  {id:"crystal",name:"Crystal Waters",desc:"Airy blue, sea glass, pearl",colors:["#c8e7e9","#e7f5f3","#3c9eae","#c49b4f"]},
  {id:"midnight",name:"Midnight Sea",desc:"Deep navy, violet, silver",colors:["#080b19","#15142e","#b4a5ff","#d8c5a2"]},
  {id:"sunset",name:"Sunset Shores",desc:"Dusky mauve, peach, warm gold",colors:["#2a1b2a","#493044","#f5b7a1","#f3d18c"]},
  {id:"minimal",name:"Minimalist Study",desc:"Soft cream, muted ocean green",colors:["#eae5da","#f7f3eb","#618d91","#bd9755"]}
];
const quotes = [
  ["You do not have to be perfect to make progress.","A gentle reminder"],
  ["Small steps still move you forward.","For the days that feel slow"],
  ["You are allowed to learn at your own pace.","A note to self"],
  ["Begin where you are. Use what you have.","A little encouragement"],
  ["Rest is part of the rhythm, not a reward for exhaustion.","For your wellbeing"],
  ["You can do difficult things one piece at a time.","Keep going gently"],
  ["Your effort matters, even when progress is quiet.","A reminder for today"],
  ["Make room for the person you are becoming.","For your future self"],
  ["Consistency is returning, not being perfect every day.","A kinder definition of discipline"],
  ["One focused hour can be a beautiful beginning.","A fresh start"]
];
const defaultState = () => ({
  theme:"ocean", customBackground:null, savedQuotes:[],
  quoteIndex:0, calendarMonth: new Date(today.getFullYear(),today.getMonth(),1).toISOString(),
  selectedDay:dateKey(today), selectedWeek:dateKey(startOfWeek(today)),
  sessions:[
    {id:safeId(),day:1,time:"08:00",end:"09:00",subject:"Physics",notes:"Revise current topic",done:false,color:"#76cbd4"},
    {id:safeId(),day:1,time:"09:15",end:"10:15",subject:"Mathematics",notes:"Practice problems",done:false,color:"#d7a4b5"},
    {id:safeId(),day:1,time:"10:30",end:"11:30",subject:"Chemistry",notes:"Review notes",done:false,color:"#d7bd84"},
    {id:safeId(),day:1,time:"14:00",end:"15:00",subject:"English",notes:"Reading and writing",done:false,color:"#b5a4d8"}
  ],
  habits:[
    {id:safeId(),name:"Study according to my plan",icon:"📚",checks:{}},
    {id:safeId(),name:"Read for a little while",icon:"📖",checks:{}},
    {id:safeId(),name:"Take a mindful break",icon:"🫧",checks:{}},
    {id:safeId(),name:"Review today's notes",icon:"✧",checks:{}}
  ],
  events:[],
  moodboard:[
    {id:"m1",title:"Small Steps, Big Changes",category:"Quotes",description:"Progress, not perfection.",image:"https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=700&q=80",saved:false},
    {id:"m2",title:"Golden Hour",category:"Ocean",description:"A little sunlight on the sea.",image:"https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=700&q=80",saved:false},
    {id:"m3",title:"A Quiet Mind",category:"Aesthetic",description:"Find your own rhythm.",image:"https://images.unsplash.com/photo-1473116763249-2faaef81ccda?auto=format&fit=crop&w=700&q=80",saved:false},
    {id:"m4",title:"Deep Blue",category:"Ocean",description:"Let the world slow down.",image:"https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=700&q=80",saved:false},
    {id:"m5",title:"Make Time to Grow",category:"Study",description:"A little progress each day.",image:"https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=700&q=80",saved:false},
    {id:"m6",title:"Ocean Bloom",category:"Aesthetic",description:"Softness can be strength.",image:"https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=700&q=80",saved:false},
    {id:"m7",title:"Breathe",category:"Quotes",description:"You can begin again.",image:"https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&w=700&q=80",saved:false},
    {id:"m8",title:"A Study of Calm",category:"Study",description:"Create space for focus.",image:"https://images.unsplash.com/photo-1455390582262-044cდე?auto=format&fit=crop&w=700&q=80",saved:false}
  ]
});
function loadState() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return defaultState();
    const parsed = JSON.parse(stored), base = defaultState();
    return {...base,...parsed, habits:parsed.habits || base.habits, sessions:parsed.sessions || base.sessions, events:parsed.events || [], moodboard:parsed.moodboard || base.moodboard, savedQuotes:parsed.savedQuotes || []};
  } catch { return defaultState(); }
}
let state = loadState();
function saveState() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
  catch { showToast("Storage is full. Try removing some large uploaded images."); }
}
function showToast(message) {
  const toast=$("#toast"); toast.textContent=message; toast.classList.add("show");
  clearTimeout(showToast.timer); showToast.timer=setTimeout(()=>toast.classList.remove("show"),2600);
}
function applyTheme() {
  document.body.classList.remove("theme-crystal","theme-midnight","theme-sunset","theme-minimal");
  if(state.theme!=="ocean") document.body.classList.add(`theme-${state.theme}`);
  if(state.customBackground) {
    document.body.style.setProperty("--custom-bg-image",`url("${state.customBackground}")`);
    document.body.style.backgroundImage=`linear-gradient(rgba(3,20,32,.55),rgba(3,20,32,.75)),url("${state.customBackground}")`;
    document.body.style.backgroundAttachment="fixed"; document.body.style.backgroundSize="cover"; document.body.style.backgroundPosition="center";
  } else {
    document.body.style.backgroundImage=""; document.body.style.backgroundAttachment=""; document.body.style.backgroundSize=""; document.body.style.backgroundPosition="";
  }
  renderThemes();
}
function navigate(page) {
  $$(".page").forEach(el=>el.classList.toggle("active-page",el.id===`page-${page}`));
  $$(".nav-item").forEach(el=>el.classList.toggle("active",el.dataset.page===page));
  const names={home:"Your sanctuary",calendar:"Calendar",timetable:"Timetable",habits:"Habit tracker",moodboard:"Moodboard",templates:"Templates",appearance:"Appearance"};
  $("#page-breadcrumb").textContent=names[page]||"Your sanctuary";
  $("#sidebar").classList.remove("open");
  if(page==="calendar") renderCalendar();
  if(page==="timetable") renderTimetable();
  if(page==="habits") renderHabits();
  if(page==="moodboard") renderMoodboard();
  if(page==="templates") renderTemplates();
  if(page==="appearance") renderThemes();
  window.scrollTo({top:0,behavior:"smooth"});
}
$$(".nav-item").forEach(btn=>btn.addEventListener("click",()=>navigate(btn.dataset.page)));
$$("[data-go]").forEach(btn=>btn.addEventListener("click",()=>navigate(btn.dataset.go)));
$("#menu-toggle").addEventListener("click",()=>$("#sidebar").classList.toggle("open"));
$("#profile-button").addEventListener("click",()=>showToast("This is a local demo profile. Secure sign-in will be added in a later stage."));
$("#today-chip").textContent=formatDate(today,{month:"short",day:"numeric",year:"numeric"});
$("#hero-date").textContent=formatDate(today,{weekday:"long",month:"long",day:"numeric",year:"numeric"});
$("#footer-year").textContent=`© ${today.getFullYear()} PRISTINE`;
$("#greeting").textContent=(today.getHours()<12?"A LITTLE SPACE FOR YOUR MORNING":today.getHours()<18?"A LITTLE SPACE FOR YOUR AFTERNOON":"A LITTLE SPACE FOR YOUR EVENING");
function renderMiniCalendar() {
  const month=new Date(today.getFullYear(),today.getMonth(),1), year=month.getFullYear(), m=month.getMonth();
  $("#mini-month-title").textContent=month.toLocaleDateString(undefined,{month:"long",year:"numeric"});
  const first=(month.getDay()+6)%7, days=new Date(year,m+1,0).getDate(), prevDays=new Date(year,m,0).getDate();
  const eventDates=new Set(state.events.map(e=>e.date));
  let html=dayNames.map(d=>`<div class="calendar-weekday">${d[0]}</div>`).join("");
  for(let i=0;i<42;i++){
    let n, date, other=false;
    if(i<first){n=prevDays-first+i+1;date=new Date(year,m-1,n);other=true;}
    else if(i>=first+days){n=i-first-days+1;date=new Date(year,m+1,n);other=true;}
    else {n=i-first+1;date=new Date(year,m,n);}
    const key=dateKey(date);
    html+=`<button class="calendar-day ${other?"other-month":""} ${key===dateKey(today)?"today":""} ${eventDates.has(key)?"has-event":""}" data-mini-date="${key}" title="${esc(formatDate(date,{month:"long",day:"numeric",year:"numeric"}))}">${n}</button>`;
  }
  $("#mini-calendar").innerHTML=html;
  $$("[data-mini-date]").forEach(btn=>btn.addEventListener("click",()=>{state.selectedDay=btn.dataset.miniDate;saveState();navigate("calendar");renderCalendar();}));
}
function getDaySessions(day) { return state.sessions.filter(s=>Number(s.day)===day).sort((a,b)=>a.time.localeCompare(b.time)); }
function renderSessionRows(container, sessions, showDay=false) {
  if(!sessions.length){container.innerHTML='<p class="muted">Nothing scheduled yet. Add a session whenever you are ready.</p>';return;}
  container.innerHTML=sessions.map(s=>`<div class="session-row">
    <div class="session-time">${showDay?`${dayNames[(s.day+6)%7]} · `:""}${esc(s.time)}–${esc(s.end)}</div>
    <div class="session-detail" style="border-left-color:${esc(s.color||"var(--accent)")}"><strong>${esc(s.subject)}</strong><small>${esc(s.notes||"A little focused time")}</small></div>
    <button class="session-check ${s.done?"done":""}" data-session-done="${s.id}" title="Mark ${s.done?"incomplete":"complete"}">${s.done?"✓":"○"}</button>
  </div>`).join("");
  $$("[data-session-done]",container).forEach(btn=>btn.addEventListener("click",()=>{const s=state.sessions.find(x=>x.id===btn.dataset.sessionDone);if(s){s.done=!s.done;saveState();renderHome();if($("#page-timetable").classList.contains("active-page"))renderTimetable();showToast(s.done?"Session completed. Well done.":"Session marked incomplete.");}}));
}
function renderTodaySessions() { renderSessionRows($("#today-sessions"),getDaySessions(today.getDay()||7)); }
function renderHomeHabits() {
  const key=dateKey(today), habits=state.habits;
  const done=habits.filter(h=>h.checks?.[key]).length;
  const percent=habits.length?Math.round(done/habits.length*100):0;
  $("#habit-progress-number").textContent=`${percent}%`;$("#habit-progress-bar").style.width=`${percent}%`;
  $("#home-habits").innerHTML=habits.slice(0,5).map(h=>`<label class="home-habit"><input class="habit-check" type="checkbox" data-home-habit="${h.id}" ${h.checks?.[key]?"checked":""}><span>${esc(h.icon||"✧")} ${esc(h.name)}</span></label>`).join("") || '<p class="muted">Add your first habit on the Habits page.</p>';
  $$("[data-home-habit]").forEach(input=>input.addEventListener("change",()=>{const h=state.habits.find(x=>x.id===input.dataset.homeHabit);if(h){h.checks ||= {};h.checks[key]=input.checked;saveState();renderHomeHabits();if($("#page-habits").classList.contains("active-page"))renderHabits();}}));
}
function moodCard(item) {
  return `<article class="mood-card"><img src="${esc(item.image)}" alt="${esc(item.title)}" loading="lazy" onerror="this.style.display='none'"><div class="mood-card-copy"><strong>${esc(item.title)}</strong><small>${esc(item.description||item.category)}</small></div><button class="mood-heart ${item.saved?"saved":""}" data-save-mood="${esc(item.id)}" aria-label="Save ${esc(item.title)}">${item.saved?"♥":"♡"}</button></article>`;
}
function wireMoodSave(root) {
  $$("[data-save-mood]",root).forEach(btn=>btn.addEventListener("click",()=>{const item=state.moodboard.find(m=>m.id===btn.dataset.saveMood);if(item){item.saved=!item.saved;saveState();renderMoodboard();renderHomeMoodboard();showToast(item.saved?"Saved to your favourites.":"Removed from favourites.");}}));
}
function renderHomeMoodboard() { const items=state.moodboard.slice(0,4);$("#home-moodboard").innerHTML=items.map(moodCard).join("");wireMoodSave($("#home-moodboard")); }
let activeMoodFilter="All";
function renderMoodboard() {
  const items=state.moodboard.filter(m=>activeMoodFilter==="All"||m.category===activeMoodFilter);
  $("#full-moodboard").innerHTML=items.map(moodCard).join("")||'<p class="muted">No cards in this category yet.</p>';
  wireMoodSave($("#full-moodboard"));
}
$("#mood-filters").addEventListener("click",e=>{const btn=e.target.closest("[data-filter]");if(!btn)return;activeMoodFilter=btn.dataset.filter;$$(".filter-pill").forEach(b=>b.classList.toggle("selected",b===btn));renderMoodboard();});
function renderHome() { renderMiniCalendar();renderTodaySessions();renderHomeHabits();renderHomeMoodboard(); }
function renderCalendar() {
  const saved=state.calendarMonth?new Date(state.calendarMonth):new Date(today.getFullYear(),today.getMonth(),1);
  const month=new Date(saved.getFullYear(),saved.getMonth(),1), year=month.getFullYear(), m=month.getMonth();
  $("#calendar-title").textContent=month.toLocaleDateString(undefined,{month:"long",year:"numeric"});
  const first=(month.getDay()+6)%7, count=new Date(year,m+1,0).getDate(), prevCount=new Date(year,m,0).getDate();
  let html=dayNames.map(d=>`<div class="full-weekday">${d}</div>`).join("");
  for(let i=0;i<42;i++){
    let date,n,other=false;
    if(i<first){n=prevCount-first+i+1;date=new Date(year,m-1,n);other=true;}
    else if(i>=first+count){n=i-first-count+1;date=new Date(year,m+1,n);other=true;}
    else {n=i-first+1;date=new Date(year,m,n);}
    const key=dateKey(date), events=state.events.filter(e=>e.date===key);
    html+=`<button class="full-day ${other?"other-month":""} ${key===dateKey(today)?"today":""}" data-full-date="${key}"><span class="day-number">${n}</span>${events.slice(0,2).map(e=>`<span class="event-marker">${esc(e.title)}</span>`).join("")}</button>`;
  }
  $("#full-calendar").innerHTML=html;
  $$("[data-full-date]").forEach(btn=>btn.addEventListener("click",()=>{state.selectedDay=btn.dataset.fullDate;saveState();openForm("event",null,{date:btn.dataset.fullDate});}));
  const upcoming=[...state.events].sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time));
  $("#event-list").innerHTML=upcoming.length?upcoming.map(e=>`<div class="event-item"><div><strong>${esc(e.title)}</strong><small>${esc(e.date)} · ${esc(e.time||"Time not set")}${e.notes?" · "+esc(e.notes):""}</small></div><button class="delete-button" data-delete-event="${e.id}" aria-label="Delete event">×</button></div>`).join(""):'<p class="muted">No events yet. Add an event to give a date a little meaning.</p>';
  $$("[data-delete-event]").forEach(btn=>btn.addEventListener("click",()=>{state.events=state.events.filter(e=>e.id!==btn.dataset.deleteEvent);saveState();renderCalendar();renderMiniCalendar();showToast("Event deleted.");}));
}
$("#calendar-prev").addEventListener("click",()=>{const d=new Date(state.calendarMonth);d.setMonth(d.getMonth()-1);state.calendarMonth=d.toISOString();saveState();renderCalendar();});
$("#calendar-next").addEventListener("click",()=>{const d=new Date(state.calendarMonth);d.setMonth(d.getMonth()+1);state.calendarMonth=d.toISOString();saveState();renderCalendar();});
$("#add-event-button").addEventListener("click",()=>openForm("event"));
function renderTimetable() {
  const weekStart=state.selectedWeek?new Date(state.selectedWeek+"T00:00:00"):startOfWeek(today);
  $("#week-tabs").innerHTML=dayNames.map((d,i)=>{const date=new Date(weekStart);date.setDate(date.getDate()+i);return `<button class="week-tab ${date.getDay()===(today.getDay())&&dateKey(date)===dateKey(today)?"selected":""}" data-week-day="${i+1}">${d} <span>${date.getDate()}</span></button>`;}).join("");
  const selectedDay=Number(state.viewDay)||((today.getDay()+6)%7+1);
  $$("[data-week-day]").forEach(btn=>{btn.classList.toggle("selected",Number(btn.dataset.weekDay)===selectedDay);btn.addEventListener("click",()=>{state.viewDay=Number(btn.dataset.weekDay);saveState();renderTimetable();});});
  const list=getDaySessions(selectedDay===7?0:selectedDay);
  renderSessionRows($("#all-sessions"),list);
}
$("#add-session-button").addEventListener("click",()=>openForm("session"));
$("#quick-add-session").addEventListener("click",()=>openForm("session"));
$("#add-habit-button").addEventListener("click",()=>openForm("habit"));
function renderHabits() {
  const start=startOfWeek(today), days=Array.from({length:7},(_,i)=>{const d=new Date(start);d.setDate(d.getDate()+i);return d;});
  $("#habit-date-label").textContent=`Week of ${formatDate(start,{month:"long",day:"numeric"})}`;
  const heading=`<div class="full-habit-row"><div class="full-habit-name"><strong>My habits</strong></div>${days.map(d=>`<div class="day-heading">${formatDate(d,{weekday:"short"})}<br>${d.getDate()}</div>`).join("")}<div></div></div>`;
  const rows=state.habits.map(h=>`<div class="full-habit-row"><div class="full-habit-name"><span class="habit-emoji">${esc(h.icon||"✧")}</span><div><strong>${esc(h.name)}</strong><small>${days.filter(d=>h.checks?.[dateKey(d)]).length} of 7 this week</small></div></div>${days.map(d=>{const k=dateKey(d);return `<button class="habit-day-button ${h.checks?.[k]?"checked":""}" data-habit-id="${h.id}" data-habit-date="${k}" aria-label="${esc(h.name)} ${k}">${h.checks?.[k]?"✓":"·"}</button>`;}).join("")}<button class="delete-button" data-delete-habit="${h.id}" aria-label="Delete habit">×</button></div>`).join("");
  $("#full-habits").innerHTML=heading+(rows||'<p class="muted">No habits yet. Add one small habit to begin.</p>');
  $$("[data-habit-id]").forEach(btn=>btn.addEventListener("click",()=>{const h=state.habits.find(x=>x.id===btn.dataset.habitId);if(h){h.checks ||= {};const k=btn.dataset.habitDate;h.checks[k]=!h.checks[k];saveState();renderHabits();renderHomeHabits();}}));
  $$("[data-delete-habit]").forEach(btn=>btn.addEventListener("click",()=>{state.habits=state.habits.filter(h=>h.id!==btn.dataset.deleteHabit);saveState();renderHabits();renderHomeHabits();showToast("Habit removed.");}));
}
function renderTemplates() {
  const templates=[
    {id:"ocean",name:"Pristine Ocean",desc:"The signature deep-blue ocean look with turquoise and golden accents.",label:"The original"},
    {id:"crystal",name:"Crystal Waters",desc:"Bright, airy, sea-glass colours with a calm, clean feel.",label:"Light & airy"},
    {id:"midnight",name:"Midnight Sea",desc:"A darker, dreamy look with soft violet highlights.",label:"Deep focus"},
    {id:"sunset",name:"Sunset Shores",desc:"Warm peach and golden tones over a dusky ocean palette.",label:"Warm & soft"},
    {id:"minimal",name:"Minimalist Study",desc:"A gentle cream workspace with understated ocean-green accents.",label:"Simple & clear"}
  ];
  $("#template-grid").innerHTML=templates.map(t=>`<article class="template-card"><div class="template-preview" style="background-image:linear-gradient(140deg,${themes.find(x=>x.id===t.id).colors[1]}99,${themes.find(x=>x.id===t.id).colors[0]}aa),url('https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=600&q=75')"><span class="card-kicker">${esc(t.label.toUpperCase())}</span><div class="preview-lines"><span></span><span></span><span></span><span></span></div><strong>${esc(t.name)}</strong></div><div class="template-info"><h3>${esc(t.name)}</h3><p>${esc(t.desc)}</p><button class="button ${state.theme===t.id?"button-primary":"button-outline"}" data-apply-template="${t.id}">${state.theme===t.id?"Currently applied":"Apply template"}</button></div></article>`).join("");
  $$("[data-apply-template]").forEach(btn=>btn.addEventListener("click",()=>{state.theme=btn.dataset.applyTemplate;saveState();applyTheme();renderTemplates();showToast("Your new theme has been applied.");}));
}
function renderThemes() {
  $("#theme-options").innerHTML=themes.map(t=>`<button class="theme-option ${state.theme===t.id?"selected":""}" data-theme="${t.id}"><span class="theme-swatch" style="background:linear-gradient(135deg,${t.colors[0]},${t.colors[1]} 50%,${t.colors[2]} 75%,${t.colors[3]})"></span><strong>${esc(t.name)}</strong><p class="muted">${esc(t.desc)}</p></button>`).join("");
  $$("[data-theme]").forEach(btn=>btn.addEventListener("click",()=>{state.theme=btn.dataset.theme;saveState();applyTheme();showToast(`${themes.find(t=>t.id===state.theme).name} applied.`);}));
}
$("#theme-cycle").addEventListener("click",()=>{const i=themes.findIndex(t=>t.id===state.theme);state.theme=themes[(i+1)%themes.length].id;saveState();applyTheme();showToast(`${themes.find(t=>t.id===state.theme).name} applied.`);});
function openForm(type,id=null,extra={}) {
  const form=$("#form-fields");$("#item-form").dataset.type=type;$("#item-form").dataset.editId=id||"";
  const existing=type==="event"?state.events.find(x=>x.id===id):type==="session"?state.sessions.find(x=>x.id===id):type==="habit"?state.habits.find(x=>x.id===id):null;
  const val=(key,def="")=>esc(existing?.[key]??extra[key]??def);
  const field=(label,name,value,type="text",placeholder="")=>`<label class="form-field">${label}<input name="${name}" type="${type}" value="${value}" ${type==="text"?'maxlength="100"':""} placeholder="${placeholder}" required></label>`;
  let title="",fields="";
  if(type==="event"){title=id?"Edit event":"Add an event";fields=field("Event title","title",val("title"),"text","e.g. Chemistry revision")+field("Date","date",val("date",dateKey(today)),"date")+field("Time (optional)","time",val("time","09:00"),"time")+`<label class="form-field">Notes (optional)<textarea name="notes" maxlength="500">${val("notes")}</textarea></label>`;}
  if(type==="session"){title=id?"Edit session":"Add a study session";fields=field("Subject / activity","subject",val("subject"),"text","e.g. Mathematics")+`<label class="form-field">Day<select name="day">${dayNames.map((d,i)=>`<option value="${i+1}" ${Number(val("day",((today.getDay()+6)%7)+1))===i+1?"selected":""}>${d}</option>`).join("")}</select></label>`+field("Start time","time",val("time","08:00"),"time")+field("End time","end",val("end","09:00"),"time")+`<label class="form-field">Notes (optional)<textarea name="notes" maxlength="500">${val("notes")}</textarea></label>`;}
  if(type==="habit"){title="Add a habit";fields=field("Habit name","name","","text","e.g. Review my notes")+`<label class="form-field">Icon<select name="icon">${["📚","📖","🫧","🌿","✧","💧","🧘","✍️"].map(i=>`<option>${i}</option>`).join("")}</select></label>`;}
  $("#form-title").textContent=title;form.innerHTML=fields;
  const dialog=$("#form-dialog");if(!dialog.open)dialog.showModal();
}
$("#item-form").addEventListener("submit",e=>{
  if(e.submitter?.value==="cancel")return;
  e.preventDefault();
  const form=e.currentTarget,type=form.dataset.type,id=form.dataset.editId,data=Object.fromEntries(new FormData(form).entries());
  if(type==="event"){
    if(data.date<"1900-01-01"){showToast("Please choose a valid date.");return;}
    if(id){state.events=state.events.map(x=>x.id===id?{...x,...data}:x);}else state.events.push({id:safeId(),...data});
    saveState();renderCalendar();renderMiniCalendar();showToast("Event saved.");
  } else if(type==="session"){
    const start=Number(data.time.replace(":","")),end=Number(data.end.replace(":",""));
    if(start>=end){showToast("End time must be after start time.");return;}
    data.day=Number(data.day);data.done=false;data.color=["#76cbd4","#d7a4b5","#d7bd84","#b5a4d8","#8dc8a8"][state.sessions.length%5];
    if(id)state.sessions=state.sessions.map(x=>x.id===id?{...x,...data}:x);else state.sessions.push({id:safeId(),...data});
    saveState();renderHome();renderTimetable();showToast("Study session saved.");
  } else if(type==="habit"){
    state.habits.push({id:safeId(),name:data.name,icon:data.icon,checks:{}});saveState();renderHabits();renderHomeHabits();showToast("Habit added.");
  }
  $("#form-dialog").close();
});





// Close the form dialog when Cancel or the × button is clicked
$("#form-dialog").addEventListener("click", (e) => {
  if (
    e.target.matches('[value="cancel"]') ||
    e.target.matches(".close-dialog") ||
    e.target.closest(".close-dialog")
  ) {
    e.preventDefault();
    $("#form-dialog").close();
  }
});


$("#new-quote").addEventListener("click",()=>{
  state.quoteIndex=(state.quoteIndex+1)%quotes.length;const q=quotes[state.quoteIndex];
  $("#quote-text").textContent=q[0];$("#quote-author").textContent=q[1];
  $("#save-quote").classList.toggle("saved",state.savedQuotes.includes(q[0]));$("#save-quote").textContent=state.savedQuotes.includes(q[0])?"♥":"♡";
  saveState();
});
$("#save-quote").addEventListener("click",()=>{
  const quote=$("#quote-text").textContent;
  if(state.savedQuotes.includes(quote)){state.savedQuotes=state.savedQuotes.filter(q=>q!==quote);showToast("Quote removed from saved quotes.");}
  else {state.savedQuotes.push(quote);showToast("Quote saved.");}
  $("#save-quote").classList.toggle("saved",state.savedQuotes.includes(quote));$("#save-quote").textContent=state.savedQuotes.includes(quote)?"♥":"♡";saveState();
});
$("#image-upload").addEventListener("change",e=>{
  const file=e.target.files?.[0];if(!file)return;
  if(file.size>1_500_000){showToast("Please choose an image smaller than 1.5 MB for this local demo.");e.target.value="";return;}
  const reader=new FileReader();reader.onload=()=>{state.moodboard.unshift({id:safeId(),title:file.name.replace(/\.[^.]+$/,""),category:"Aesthetic",description:"Added by you",image:reader.result,saved:false});saveState();renderMoodboard();renderHomeMoodboard();showToast("Image added to your moodboard.");};reader.readAsDataURL(file);e.target.value="";
});
$("#background-upload").addEventListener("change",e=>{
  const file=e.target.files?.[0];if(!file)return;
  if(file.size>1_500_000){showToast("Please choose an image smaller than 1.5 MB for this local demo.");e.target.value="";return;}
  const reader=new FileReader();reader.onload=()=>{state.customBackground=reader.result;saveState();applyTheme();showToast("Your background has been updated.");};reader.readAsDataURL(file);e.target.value="";
});
$("#clear-background").addEventListener("click",()=>{state.customBackground=null;saveState();applyTheme();showToast("Custom background removed.");});
$("#export-data").addEventListener("click",()=>{
  const blob=new Blob([JSON.stringify(state,null,2)],{type:"application/json"}),url=URL.createObjectURL(blob),a=document.createElement("a");
  a.href=url;a.download="pristine-planner-backup.json";a.click();URL.revokeObjectURL(url);showToast("Planner backup exported.");
});
window.addEventListener("online",()=>{$("#connection-label").textContent="Back online · local demo";});
window.addEventListener("offline",()=>{$("#connection-label").textContent="Offline · local demo";});
function init(){
  applyTheme();
  const q=quotes[state.quoteIndex%quotes.length];$("#quote-text").textContent=q[0];$("#quote-author").textContent=q[1];
  $("#save-quote").classList.toggle("saved",state.savedQuotes.includes(q[0]));$("#save-quote").textContent=state.savedQuotes.includes(q[0])?"♥":"♡";
  renderHome();renderCalendar();renderTimetable();renderHabits();renderMoodboard();renderTemplates();
  $("#connection-label").textContent=navigator.onLine?"Your space, your pace":"Offline · local demo";
}
init();
