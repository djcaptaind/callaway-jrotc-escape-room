
const $=s=>document.querySelector(s);
const ROOMNAMES=["VALUES LOCK","CREED VAULT","PATHWAY MATRIX","MONEY LAB","LEADERSHIP CROSSROADS","FINAL EXTRACTION"];
const hints=[
"Army Values may overlap. Choose the value MOST directly tested by the action.",
"The Creed challenge uses exact meaning and sequence, not the founding year.",
"Career goal + required training + affordability should drive pathway decisions.",
"Available credit is debt capacity, not income. Protect savings before wants.",
"For senior leaders, a good choice balances career fit, cost, values, and long-term options.",
"The final code uses every recovered key in room order, then the two riddle tokens."
];

let level="3",room=0,score=3000,time=2100,timer=null,inventory=[],tokens=[],soundOn=true,audioCtx=null,callsign="";

function screen(id){["start","game","complete","failed"].forEach(x=>$("#"+x).classList.remove("active"));$("#"+id).classList.add("active")}
function fmt(s){return Math.floor(Math.max(0,s)/60)+":"+String(Math.max(0,s)%60).padStart(2,"0")}
function hud(){$("#clock").textContent=fmt(time);$("#score").textContent=score;$("#status").textContent=room>=6?"RECOVERED":room>0?"ACTIVE":"STANDBY";$("#roomStatus").innerHTML=ROOMNAMES.map((n,i)=>`<div class="statusRow ${i<room?"done":i===room?"current":""}">${i<room?"✓":"▸"} ROOM ${i+1} // ${n}</div>`).join("")}
function inv(){$("#inventory").innerHTML=inventory.length?inventory.map(x=>`<div class="asset">${x}</div>`).join(""):`<p class="muted">No keys recovered.</p>`}
function fb(msg,kind=""){$("#feedback").className="feedback "+kind;$("#feedback").innerHTML=msg}
function audio(){if(!soundOn)return null;if(!audioCtx)audioCtx=new (window.AudioContext||window.webkitAudioContext)();if(audioCtx.state==="suspended")audioCtx.resume();return audioCtx}
function tone(f,d,type="sine",v=.06,delay=0){let c=audio();if(!c)return;let o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.value=f;g.gain.value=v;o.connect(g);g.connect(c.destination);let s=c.currentTime+delay;g.gain.setValueAtTime(v,s);g.gain.exponentialRampToValueAtTime(.001,s+d);o.start(s);o.stop(s+d)}
function sfx(k){if(k==="wrong"){tone(180,.14,"square",.06);tone(120,.2,"square",.05,.1)}if(k==="unlock"){tone(440,.1);tone(660,.12,"sine",.06,.1);tone(880,.16,"sine",.07,.22)}if(k==="final"){tone(523,.15,"triangle");tone(659,.15,"triangle",.06,.14);tone(784,.17,"triangle",.06,.28);tone(1047,.28,"triangle",.07,.43)}if(k==="hint"){tone(300,.08,"sine",.04);tone(420,.1,"sine",.04,.08)}}
function penalty(p,msg){sfx("wrong");score=Math.max(0,score-p);hud();fb(msg+` • −${p} points`,"warn")}
function clearRoom(asset){inventory.push(asset);inv();sfx(room===5?"final":"unlock");fb(`<b>ROOM UNLOCKED</b><br>${asset}`);room++;hud();$("#hintBox").textContent="";setTimeout(()=>room>=6?finish():render(),700)}

$("#startBtn").onclick=()=>{callsign=$("#callsign").value.trim();if(!callsign)return alert("Enter a callsign.");level=$("#level").value;screen("game");render();timer=setInterval(()=>{time--;hud();if(time<=0){clearInterval(timer);screen("failed")}},1000)}
$("#hintBtn").onclick=()=>{if(room>=6)return;sfx("hint");time=Math.max(0,time-45);$("#hintBox").textContent="INTEL: "+hints[room];hud()}
$("#soundBtn").onclick=()=>{soundOn=!soundOn;$("#soundBtn").textContent="SOUND: "+(soundOn?"ON":"OFF");if(soundOn){audio();tone(600,.08)}}

function render(){hud();$("#feedback").className="";$("#feedback").innerHTML="";$("#roomTag").textContent=`ROOM ${room+1} OF 6 // LET ${level}`;$("#roomTitle").textContent=ROOMNAMES[room];$("#difficulty").textContent="DIFFICULTY "+"★".repeat(room+1)+"☆".repeat(5-room);$("#roomBrief").textContent=[
"Apply Army Values to new situations, then solve the first logic riddle.",
"Prove Creed knowledge through meaning and sequence—without using a history-year question.",
"Match realistic cadets to viable college, ROTC, technical, or transfer pathways.",
"Repair a student budget, identify credit risk, and protect savings.",
"Make a values-based college decision using structured tradeoffs—no written defense.",
"Combine all recovered keys and riddle tokens to recover the alternate briefing."
][room];[valuesRoom,creedRoom,pathwayRoom,financeRoom,leadershipRoom,finalRoom][room]()}

function valuesRoom(){
 const vals=["Loyalty","Duty","Respect","Selfless Service","Honor","Integrity","Personal Courage"];
 const data=level==="3"?[
 ["You tell the truth about a mistake even though nobody saw it.","Integrity"],
 ["You finish an assigned job before leaving practice.","Duty"],
 ["You listen to a cadet you strongly disagree with.","Respect"],
 ["You help a teammate prepare instead of taking the easy early dismissal.","Selfless Service"],
 ["You refuse to join friends who want to embarrass another cadet.","Honor"],
 ["You support your unit while still reporting a serious problem.","Loyalty"],
 ["You speak up when doing so may make you unpopular.","Personal Courage"]
 ]:[
 ["A senior cadet asks you to quietly alter a report to protect the unit's image.","Integrity"],
 ["You enforce a standard even when the high performer involved is your friend.","Duty"],
 ["You correct a subordinate privately instead of humiliating them publicly.","Respect"],
 ["You give scarce preparation time to the team member who needs it most.","Selfless Service"],
 ["You choose a course that protects institutional trust even though it costs you personally.","Honor"],
 ["You remain committed to the organization without confusing loyalty with covering misconduct.","Loyalty"],
 ["You challenge an unsafe decision through the proper channel despite pressure to stay quiet.","Personal Courage"]
 ];
 $("#work").innerHTML=`<div class="task"><h3>PHASE 1 // LDRSHIP MATCH</h3><div id="vrows"></div><button id="vcheck">VERIFY VALUES</button></div><div id="riddle1"></div>`;
 let a=Array(data.length).fill("");
 data.forEach((x,i)=>{let row=document.createElement("div");row.className="matchrow";row.innerHTML=`<span>${x[0]}</span>`;let s=document.createElement("select");s.innerHTML=`<option value="">SELECT</option>`+vals.map(v=>`<option>${v}</option>`).join("");s.onchange=()=>a[i]=s.value;row.appendChild(s);$("#vrows").appendChild(row)});
 $("#vcheck").onclick=()=>{if(a.some(x=>!x))return fb("Complete all value matches.","warn");let n=a.filter((x,i)=>x===data[i][1]).length;if(n<data.length)return penalty((data.length-n)*35,`${n}/${data.length} correct`);$("#riddle1").innerHTML=`<div class="task"><h3>RIDDLE TOKEN 1</h3><div class="riddle">There are seven apples and you take away three of them. How many apples do you have?</div><input id="rr1"><button id="rr1b">UNLOCK</button></div>`;$("#rr1b").onclick=()=>{let v=$("#rr1").value.trim().toLowerCase();if(!["3","three"].includes(v))return penalty(45,"Riddle rejected");tokens.push("3");clearRoom("VALUES KEY // LDRSHIP • TOKEN // 3")}}
}

function creedRoom(){
 const phrases=level==="3"?[
 ["I am an Army Junior ROTC Cadet.","IDENTITY"],
 ["I do not lie, cheat or steal...","ACCOUNTABILITY"],
 ["I will work hard to improve my mind and strengthen my body.","SELF-DEVELOPMENT"],
 ["I will seek the mantle of leadership...","LEADERSHIP"]
 ]:[
 ["I will always conduct myself to bring credit...","CHARACTER / CONDUCT"],
 ["I am loyal and patriotic.","LOYALTY / PATRIOTISM"],
 ["I do not lie, cheat or steal...","ACCOUNTABILITY"],
 ["I will seek the mantle of leadership and stand prepared to uphold the Constitution...","LEADERSHIP / CONSTITUTION"]
 ];
 const opts=[...new Set(phrases.map(x=>x[1]))];
 let seq=level==="3"?["I am an Army Junior ROTC Cadet.","I am loyal and patriotic.","I do not lie, cheat or steal and will always be accountable for my actions and deeds.","I will work hard to improve my mind and strengthen my body.","I will seek the mantle of leadership and stand prepared to uphold the Constitution and the American way of life."]:
 ["I am an Army Junior ROTC Cadet.","I will always conduct myself to bring credit to my family, country, school and the Corps of Cadets.","I am loyal and patriotic.","I do not lie, cheat or steal and will always be accountable for my actions and deeds.","I will seek the mantle of leadership and stand prepared to uphold the Constitution and the American way of life."];
 const correct=[...seq];seq.sort(()=>Math.random()-.5);
 $("#work").innerHTML=`<div class="task"><h3>PHASE 1 // CREED MEANING</h3><div id="crows"></div><button id="ccheck">VERIFY MEANING</button></div><div id="corder" class="task" style="display:none"><h3>PHASE 2 // CREED SEQUENCE</h3><div id="sortc"></div><button id="ocheck">VERIFY SEQUENCE</button></div>`;
 let a=Array(phrases.length).fill("");
 phrases.forEach((x,i)=>{let row=document.createElement("div");row.className="matchrow";row.innerHTML=`<span>${x[0]}</span>`;let s=document.createElement("select");s.innerHTML=`<option value="">SELECT MEANING</option>`+opts.map(o=>`<option>${o}</option>`).join("");s.onchange=()=>a[i]=s.value;row.appendChild(s);$("#crows").appendChild(row)});
 $("#ccheck").onclick=()=>{if(a.some(x=>!x))return fb("Complete each Creed meaning.","warn");let n=a.filter((x,i)=>x===phrases[i][1]).length;if(n<phrases.length)return penalty((phrases.length-n)*50,`${n}/${phrases.length} Creed meanings correct`);$("#corder").style.display="block";draw()};
 function draw(){let b=$("#sortc");b.innerHTML="";seq.forEach((x,i)=>{let d=document.createElement("div");d.className="sortitem";d.innerHTML=`<span>${x}</span><div><button data-u="${i}">▲</button><button data-d="${i}">▼</button></div>`;b.appendChild(d)});b.querySelectorAll("[data-u]").forEach(q=>q.onclick=()=>{let i=+q.dataset.u;if(i){[seq[i-1],seq[i]]=[seq[i],seq[i-1]];draw()}});b.querySelectorAll("[data-d]").forEach(q=>q.onclick=()=>{let i=+q.dataset.d;if(i<seq.length-1){[seq[i+1],seq[i]]=[seq[i],seq[i+1]];draw()}})}
 $("#ocheck").onclick=()=>JSON.stringify(seq)===JSON.stringify(correct)?clearRoom("CREED KEY // HONOR"):penalty(70,"Creed sequence rejected")
}

function pathwayRoom(){
 const profiles=level==="3"?[
 ["Nia","3.6 GPA • wants teaching • wants a traditional campus • moderate financial need","Four-year university"],
 ["Caleb","2.8 GPA • enjoys welding • wants a faster route into skilled work","Career/technical program"],
 ["Tori","3.8 GPA • wants college + leadership training + possible scholarship support","Four-year college + ROTC"],
 ["Jaylen","Undecided • wants lower cost first two years • wants transfer option","Community college → transfer"]
 ]:[
 ["Morgan","3.9 GPA • wants engineering • strong leadership record • willing to compete for scholarships","Four-year college + ROTC"],
 ["Darius","2.7 GPA • wants cybersecurity • prefers certifications and hands-on learning • wants to work sooner","Career/technical program"],
 ["Kayla","3.5 GPA • wants business • family obligations require staying close • wants lower first-year cost","Community college → transfer"],
 ["Elijah","3.8 GPA • wants a bachelor's degree in biology • has strong academic aid package","Four-year university"]
 ];
 const opts=["Four-year university","Community college → transfer","Career/technical program","Four-year college + ROTC","Immediate workforce with no further training"];
 $("#work").innerHTML=`<div class="task"><h3>PATHWAY MATRIX</h3><p>Choose the strongest realistic pathway for each cadet.</p><div id="profiles"></div><button id="pcheck">VERIFY MATRIX</button></div><div id="riddle2"></div>`;
 let a=Array(4).fill("");
 profiles.forEach((x,i)=>{let d=document.createElement("div");d.className="profile";d.innerHTML=`<b>${x[0]}</b><p>${x[1]}</p>`;let s=document.createElement("select");s.innerHTML=`<option value="">SELECT</option>`+opts.map(o=>`<option>${o}</option>`).join("");s.onchange=()=>a[i]=s.value;d.appendChild(s);$("#profiles").appendChild(d)});
 $("#pcheck").onclick=()=>{if(a.some(x=>!x))return fb("Choose all four pathways.","warn");let n=a.filter((x,i)=>x===profiles[i][2]).length;if(n<4)return penalty((4-n)*65,`${n}/4 pathway matches correct`);$("#riddle2").innerHTML=`<div class="task"><h3>RIDDLE TOKEN 2</h3><div class="riddle">How many sides does a circle have?</div><input id="rr2"><button id="rr2b">UNLOCK</button></div>`;$("#rr2b").onclick=()=>{let v=$("#rr2").value.trim().toLowerCase();if(!["2","two"].includes(v))return penalty(45,"Riddle rejected");tokens.push("2");clearRoom("PATHWAY KEY // ROUTE • TOKEN // 2")}}
}

function financeRoom(){
 const items=level==="3"?[
 ["Rent","NEED"],["Groceries","NEED"],["Streaming service","WANT"],["New gaming headset","WANT"],["Phone plan","DEPENDS"],["Transportation to work/school","NEED"]
 ]:[
 ["Rent","NEED"],["Emergency fund contribution","NEED"],["Premium streaming bundle","WANT"],["Restaurant delivery three times a week","WANT"],["Phone plan","DEPENDS"],["Transportation to work/school","NEED"]
 ];
 $("#work").innerHTML=`<div class="task"><h3>PHASE 1 // NEED, WANT, DEPENDS</h3><div id="frows"></div><button id="fcheck">VERIFY</button></div><div id="budgetBox"></div>`;
 let a=Array(items.length).fill(null);items.forEach((x,i)=>{let row=document.createElement("div");row.className="classrow";row.innerHTML=`<span>${x[0]}</span>`;let s=document.createElement("select");s.innerHTML=`<option value="">SELECT</option><option>NEED</option><option>WANT</option><option>DEPENDS</option>`;s.onchange=()=>a[i]=s.value;row.appendChild(s);$("#frows").appendChild(row)});
 $("#fcheck").onclick=()=>{if(a.some(x=>!x))return fb("Classify every expense.","warn");let n=a.filter((x,i)=>x===items[i][1]).length;if(n<items.length)return penalty((items.length-n)*45,`${n}/${items.length} correct`);budget()};
 function budget(){
  const inc=level==="3"?1800:2250;
  const fixed=level==="3"?1450:1785;
  $("#budgetBox").innerHTML=`<div class="task"><h3>PHASE 2 // PAY YOURSELF FIRST</h3><p>Monthly income: <span class="money">$${inc}</span><br>Fixed needs: <span class="money">$${fixed}</span></p><p>You want at least <b>$200 saved first</b>. What is the MOST you should plan to spend on all remaining wants combined?</p><input id="budgetAns" type="number"><button id="budgetBtn">CHECK BUDGET</button></div><div id="creditBox"></div>`;
  let answer=inc-fixed-200;
  $("#budgetBtn").onclick=()=>+$("#budgetAns").value===answer?credit():penalty(60,"Budget amount rejected");
 }
 function credit(){
  let q=level==="3"?"Card limit $1,000; balance $760; you want to charge $200 sneakers.":"Card limit $1,500; balance $1,170; statement balance is carrying interest; you want to charge a $250 trip.";
  $("#creditBox").innerHTML=`<div class="task"><h3>PHASE 3 // CREDIT DECISION</h3><p>${q}</p><button class="option" id="fa">Charge it because there is enough available credit.</button><button class="option" id="fb">Treat available credit as debt capacity, not spending money; protect cash flow and reduce the high balance first.</button><button class="option" id="fc">Open another card to create more room.</button></div>`;
  $("#fa").onclick=()=>penalty(80,"Available credit does not prove affordability");$("#fc").onclick=()=>penalty(80,"More borrowing capacity does not fix the underlying balance");$("#fb").onclick=()=>clearRoom("FINANCE KEY // SAVE200");
 }
}

function leadershipRoom(){
 const schools=level==="3"?[
 ["COLLEGE A","Desired major • $21,000/year net cost • far from home"],
 ["COLLEGE B","Desired major • $10,500/year net cost • smaller campus • internship partnership"],
 ["COLLEGE C","Full scholarship • friends attending • does not offer desired major"]
 ]:[
 ["COLLEGE A","Top-ranked program • $26,000/year net cost • desired major"],
 ["COLLEGE B","Strong program • $12,000/year net cost • ROTC + internship • desired major"],
 ["COLLEGE C","Full scholarship • different major • family strongly prefers it"]
 ];
 let choice=null,reasons=[];
 $("#work").innerHTML=`<div class="task"><h3>PHASE 1 // COLLEGE CHOICE</h3><div id="schools" class="grid3"></div><h3>SELECT TWO CONTROLLING FACTORS</h3><div id="reasons"></div><button id="lcheck">LOCK DECISION</button></div><div id="twist"></div>`;
 schools.forEach((x,i)=>{let d=document.createElement("div");d.className="school";d.innerHTML=`<h3>${x[0]}</h3><p>${x[1]}</p><button>SELECT</button>`;d.querySelector("button").onclick=()=>{choice=i;document.querySelectorAll(".school").forEach(q=>q.classList.remove("selected"));d.classList.add("selected")};$("#schools").appendChild(d)});
 let rs=["Career/major fit","Total cost/debt","Leadership/internship opportunity","Friends are attending","Prestige alone","Long-term flexibility"];
 rs.forEach((r,i)=>{let b=document.createElement("button");b.className="option";b.textContent=r;b.onclick=()=>{let at=reasons.indexOf(i);if(at>=0){reasons.splice(at,1);b.classList.remove("selected")}else if(reasons.length<2){reasons.push(i);b.classList.add("selected")}};$("#reasons").appendChild(b)});
 $("#lcheck").onclick=()=>{if(choice===null||reasons.length!==2)return fb("Select one college and exactly two controlling factors.","warn");if(reasons.every(i=>[3,4].includes(i)))return penalty(100,"Social pressure/prestige cannot be the only controlling factors");twist()};
 function twist(){
  let msg=level==="3"?"College B adds a $4,000 annual scholarship.":"College B adds a $6,500 annual scholarship and a paid sophomore internship.";
  $("#twist").innerHTML=`<div class="task"><h3>PHASE 2 // NEW INFORMATION</h3><p><b>${msg}</b></p><p>Which response demonstrates the strongest leadership judgment?</p><button class="option" id="la">Ignore the update; leaders never change their first decision.</button><button class="option" id="lb">Re-evaluate because material cost/opportunity information changed while career fit remains strong.</button><button class="option" id="lc">Automatically choose the cheapest option without considering career fit.</button></div>`;
  $("#la").onclick=()=>penalty(90,"Leadership is not stubbornness");$("#lc").onclick=()=>penalty(90,"Price is important but not the only factor");$("#lb").onclick=()=>clearRoom("LEADERSHIP KEY // ADAPT");
 }
}

function finalRoom(){
 $("#work").innerHTML=`<div class="task"><h3>FINAL RIDDLE TOKEN</h3><div class="riddle">If you’ve got me, you want to share me; if you share me, you haven’t kept me. What am I?</div><input id="rr3" placeholder="ENTER ANSWER"><button id="rr3b">UNLOCK FINAL TOKEN</button></div><div id="finalExtract"></div>`;
 $("#rr3b").onclick=()=>{let v=$("#rr3").value.trim().toLowerCase();if(!["secret","a secret"].includes(v))return penalty(45,"Riddle rejected");tokens.push("S");$("#finalExtract").innerHTML=`<div class="task"><h3>FINAL EXTRACTION</h3><div class="codebox">BUILD THE CODE IN ROOM ORDER:<br><br>VALUES KEY<br>CREED KEY<br>PATHWAY KEY<br>FINANCE KEY<br>LEADERSHIP KEY<br>RIDDLE TOKEN 1<br>RIDDLE TOKEN 2<br>RIDDLE TOKEN 3<br><br>NO SPACES OR DASHES.</div><input id="finalCode" placeholder="ENTER EXTRACTION CODE"><button id="finalBtn">RECOVER BRIEFING</button></div>`;let answer="LDRSHIPHONORROUTESAVE200ADAPT"+tokens.join("");$("#finalBtn").onclick=()=>{let code=$("#finalCode").value.trim().toUpperCase().replace(/[^A-Z0-9]/g,"");if(code!==answer)return penalty(110,"Extraction code rejected");clearRoom("FUTURE READINESS BRIEFING // VERSION B RECOVERED")}}
}

function finish(){clearInterval(timer);screen("complete");hud();$("#aar").innerHTML=`<div class="aarbox">CALLSIGN: ${callsign.toUpperCase()}<br>PATH: LET ${level}<br>TIME REMAINING: ${fmt(time)}<br>SCORE: ${score}<br>ROOMS CLEARED: 6/6<br>RIDDLE TOKENS: ${tokens.join(" • ")}<br><br>STATUS: FUTURE READY — VERSION B</div>`}
hud();inv();
