const $=s=>document.querySelector(s);
const ROOMNAMES=["VALUES INVESTIGATION","CREED BLACKOUT","PATHWAY WAR ROOM","MONEY CRISIS","LEADERSHIP BOARD","FINAL EXTRACTION"];
const hints=[
"Do not look for a value word in the sentence. Identify what principle is actually being tested, then distinguish the primary value from the supporting value.",
"Restore exact Creed language first. Then identify decoys. Sequence comes last. LET 4 must reconstruct nearly the entire Creed.",
"Eliminate pathways that violate a hard constraint before comparing advantages. Cost, required credential, location, and service obligations all matter.",
"Build the budget in layers: needs → savings → wants → emergency change. Credit utilization is balance divided by limit.",
"Do not choose based on prestige, friends, or price alone. Look for the option that survives the most important constraints after the intelligence updates.",
"The final terminal does NOT want the room keys simply concatenated. Follow each extraction instruction exactly."
];

let level="3",room=0,score=5000,time=2700,timer=null,inventory=[],tokens=[],soundOn=true,audioCtx=null,callsign="";

function screen(id){["start","game","complete","failed"].forEach(x=>$("#"+x).classList.remove("active"));$("#"+id).classList.add("active")}
function fmt(s){return Math.floor(Math.max(0,s)/60)+":"+String(Math.max(0,s)%60).padStart(2,"0")}
function hud(){
 $("#clock").textContent=fmt(time);$("#score").textContent=score;
 $("#status").textContent=room>=6?"RECOVERED":room>0?"ACTIVE":"STANDBY";
 $("#roomStatus").innerHTML=ROOMNAMES.map((n,i)=>`<div class="statusRow ${i<room?"done":i===room?"current":""}">${i<room?"✓":"▸"} ROOM ${i+1} // ${n}</div>`).join("")
}
function inv(){$("#inventory").innerHTML=inventory.length?inventory.map(x=>`<div class="asset">${x}</div>`).join(""):`<p class="muted">No keys recovered.</p>`}
function fb(msg,kind=""){$("#feedback").className="feedback "+kind;$("#feedback").innerHTML=msg}
function audio(){if(!soundOn)return null;if(!audioCtx)audioCtx=new (window.AudioContext||window.webkitAudioContext)();if(audioCtx.state==="suspended")audioCtx.resume();return audioCtx}
function tone(f,d,type="sine",v=.06,delay=0){let c=audio();if(!c)return;let o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.value=f;g.gain.value=v;o.connect(g);g.connect(c.destination);let s=c.currentTime+delay;g.gain.setValueAtTime(v,s);g.gain.exponentialRampToValueAtTime(.001,s+d);o.start(s);o.stop(s+d)}
function sfx(k){
 if(k==="wrong"){tone(180,.14,"square",.06);tone(118,.2,"square",.05,.1)}
 if(k==="unlock"){tone(420,.1);tone(620,.12,"sine",.06,.1);tone(860,.16,"sine",.07,.22)}
 if(k==="final"){tone(523,.15,"triangle");tone(659,.15,"triangle",.06,.14);tone(784,.17,"triangle",.06,.28);tone(1047,.28,"triangle",.07,.43)}
 if(k==="hint"){tone(300,.08,"sine",.04);tone(420,.1,"sine",.04,.08)}
}
function penalty(p,msg){sfx("wrong");score=Math.max(0,score-p);time=Math.max(0,time-15);hud();fb(msg+` • −${p} points • −15 seconds`,"warn")}
function clearRoom(asset){inventory.push(asset);inv();sfx(room===5?"final":"unlock");fb(`<b>ROOM UNLOCKED</b><br>${asset}`);room++;hud();$("#hintBox").textContent="";setTimeout(()=>room>=6?finish():render(),850)}
function selectExact(container,max,arr,i,button){
 let at=arr.indexOf(i);
 if(at>=0){arr.splice(at,1);button.classList.remove("selected")}
 else if(arr.length<max){arr.push(i);button.classList.add("selected")}
}

$("#startBtn").onclick=()=>{
 callsign=$("#callsign").value.trim();if(!callsign)return alert("Enter a callsign.");
 level=$("#level").value;screen("game");render();
 timer=setInterval(()=>{time--;hud();if(time<=0){clearInterval(timer);screen("failed")}},1000)
}
$("#hintBtn").onclick=()=>{if(room>=6)return;sfx("hint");time=Math.max(0,time-45);$("#hintBox").textContent="INTEL: "+hints[room];hud()}
$("#soundBtn").onclick=()=>{soundOn=!soundOn;$("#soundBtn").textContent="SOUND: "+(soundOn?"ON":"OFF");if(soundOn){audio();tone(600,.08)}}

function render(){
 hud();$("#feedback").className="";$("#feedback").innerHTML="";
 $("#roomTag").textContent=`ROOM ${room+1} OF 6 // LET ${level}`;
 $("#roomTitle").textContent=ROOMNAMES[room];
 $("#difficulty").textContent="DIFFICULTY "+"★".repeat(Math.min(6,room+2))+"☆".repeat(Math.max(0,4-room));
 $("#roomBrief").textContent=[
  "Analyze ambiguous leadership incidents. Identify both the primary and supporting Army Value before solving the first riddle.",
  "Restore damaged Creed language, remove false statements, and reconstruct the correct sequence.",
  "Solve a constraint-based postsecondary planning problem. Each cadet needs a pathway AND a defensible reason.",
  "Build a budget, absorb a surprise expense, and calculate credit consequences without sacrificing essential needs.",
  "Survive a two-update college decision board. The strongest decision may change as new facts arrive.",
  "Use extracted parts of each recovered key and all three riddle tokens to recover the briefing."
 ][room];
 [valuesRoom,creedRoom,pathwayRoom,financeRoom,leadershipRoom,finalRoom][room]()
}

/* ROOM 1 */
function valuesRoom(){
 const vals=["Loyalty","Duty","Respect","Selfless Service","Honor","Integrity","Personal Courage"];
 const cases=level==="3"?[
  ["A teammate asks you to report equipment as returned even though one item is still missing. You refuse and tell the instructor the count is short.","Integrity","Personal Courage"],
  ["A strong cadet keeps mocking a new cadet during practice. You stop the behavior and correct the cadet without embarrassing anyone.","Respect","Duty"],
  ["Your team is behind. You give up your preferred assignment and take the least desirable job because that is where the team needs help.","Selfless Service","Loyalty"],
  ["You promised to prepare the briefing. Friends invite you to leave early, but you stay until your assigned portion is complete.","Duty","Honor"]
 ]:[
  ["A battalion report contains a number that makes the unit look better, but you discover the source data does not support it. A senior cadet says, 'Leave it alone—we need the win.'","Integrity","Personal Courage"],
  ["Two high-performing staff members are in conflict. One is your close friend. You apply the same standard to both and protect each from public humiliation.","Respect","Honor"],
  ["A popular plan benefits your staff section but shifts an unfair workload to another section. You recommend a less convenient plan that distributes the burden fairly.","Selfless Service","Duty"],
  ["A cadet privately reports an unsafe practice by a respected leader. You protect the cadet from retaliation while using the proper chain to investigate.","Loyalty","Personal Courage"],
  ["You discover you caused the error everyone has been blaming on another cadet. Correcting the record will hurt your reputation.","Honor","Integrity"]
 ];
 $("#work").innerHTML=`<div class="task"><h3>PHASE 1 // PRIMARY + SUPPORTING VALUE</h3><p>Each incident has TWO defensible values, but one is the primary value being tested. Match both exactly.</p><div id="vrows"></div><button id="vcheck">VERIFY INVESTIGATION</button></div><div id="riddle1"></div>`;
 let a=cases.map(()=>({p:"",s:""}));
 cases.forEach((x,i)=>{
  let row=document.createElement("div");row.className="profile";row.innerHTML=`<b>INCIDENT ${i+1}</b><p>${x[0]}</p>`;
  let p=document.createElement("select");p.innerHTML=`<option value="">PRIMARY VALUE</option>`+vals.map(v=>`<option>${v}</option>`).join("");p.onchange=()=>a[i].p=p.value;
  let s=document.createElement("select");s.innerHTML=`<option value="">SUPPORTING VALUE</option>`+vals.map(v=>`<option>${v}</option>`).join("");s.onchange=()=>a[i].s=s.value;
  row.appendChild(p);row.appendChild(s);$("#vrows").appendChild(row)
 });
 $("#vcheck").onclick=()=>{
  if(a.some(x=>!x.p||!x.s))return fb("Every incident needs a primary AND supporting value.","warn");
  let n=a.filter((x,i)=>x.p===cases[i][1]&&x.s===cases[i][2]).length;
  if(n<cases.length)return penalty((cases.length-n)*80,`${n}/${cases.length} incidents fully correct`);
  $("#riddle1").innerHTML=`<div class="task"><h3>RIDDLE TOKEN 1</h3><div class="riddle">There are seven apples and you take away three of them. How many apples do you have?</div><input id="rr1"><button id="rr1b">UNLOCK TOKEN</button></div>`;
  $("#rr1b").onclick=()=>{let v=$("#rr1").value.trim().toLowerCase();if(!["3","three"].includes(v))return penalty(50,"Riddle rejected");tokens.push("3");clearRoom("VALUES KEY // LDRSHIP7 • TOKEN // 3")}
 }
}

/* ROOM 2 */
function creedRoom(){
 const full=[
 "I am an Army Junior ROTC Cadet.",
 "I will always conduct myself to bring credit to my family, country, school and the Corps of Cadets.",
 "I am loyal and patriotic.",
 "I am the future of the United States of America.",
 "I do not lie, cheat or steal and will always be accountable for my actions and deeds.",
 "I will always practice good citizenship and patriotism.",
 "I will work hard to improve my mind and strengthen my body.",
 "I will seek the mantle of leadership and stand prepared to uphold the Constitution and the American way of life.",
 "May God grant me the strength to always live by this creed."
 ];
 const blanks=level==="3"?[
  ["I will always conduct myself to bring ___ to my family, country, school and the Corps of Cadets.","credit",["credit","honor","attention","respect"]],
  ["I do not lie, cheat or steal and will always be ___ for my actions and deeds.","accountable",["accountable","responsible","recognized","prepared"]],
  ["I will work hard to improve my ___ and strengthen my body.","mind",["mind","leadership","character","reputation"]],
  ["I will seek the ___ of leadership...","mantle",["mantle","position","rank","title"]]
 ]:[
  ["I am an ___ Junior ROTC Cadet.","Army",["Army","American","Active","Armed"]],
  ["I will always conduct myself to bring ___ to my family, country, school and the Corps of Cadets.","credit",["credit","honor","respect","recognition"]],
  ["I am loyal and ___.","patriotic",["patriotic","obedient","fearless","dedicated"]],
  ["I am the ___ of the United States of America.","future",["future","leader","defender","strength"]],
  ["I do not lie, cheat or ___...","steal",["steal","quit","fail","complain"]],
  ["I will always practice good ___ and patriotism.","citizenship",["citizenship","leadership","discipline","service"]],
  ["I will work hard to improve my ___ and strengthen my body.","mind",["mind","character","rank","image"]],
  ["I will seek the ___ of leadership...","mantle",["mantle","position","reward","title"]]
 ];
 const decoys=level==="3"?[
  "I am the future of the United States of America.",
  "I will always obey my friends if the team agrees.",
  "I will always practice good citizenship and patriotism.",
  "I will work hard to improve my mind and strengthen my body.",
  "I will place winning above personal accountability.",
  "May God grant me the strength to always live by this creed."
 ]:[
  "I am an Army Junior ROTC Cadet.",
  "I will place the reputation of my unit above the Constitution when necessary.",
  "I am loyal and patriotic.",
  "I will always obey a leader even when the direction is unsafe or improper.",
  "I do not lie, cheat or steal and will always be accountable for my actions and deeds.",
  "I will always practice good citizenship and patriotism.",
  "I will seek the mantle of leadership and stand prepared to uphold the Constitution and the American way of life.",
  "I am entitled to leadership because of my rank."
 ];
 const falseSet=level==="3"?[1,4]:[1,3,7];
 let seq=(level==="3"?full.slice(0,8):full.slice()).sort(()=>Math.random()-.5);
 const correct=level==="3"?full.slice(0,8):full.slice();
 $("#work").innerHTML=`<div class="task"><h3>PHASE 1 // EXACT LANGUAGE</h3><p>Restore each damaged Creed transmission. Similar-sounding words are decoys.</p><div id="cb"></div><button id="cbBtn">VERIFY LANGUAGE</button></div><div id="decoyBox" class="task" style="display:none"><h3>PHASE 2 // COUNTERFEIT CREED</h3><p>Select exactly ${falseSet.length} statement${falseSet.length>1?"s":""} that do NOT belong.</p><div id="decoys"></div><button id="decoyBtn">VERIFY COUNTERFEITS</button></div><div id="seqBox" class="task" style="display:none"><h3>PHASE 3 // BLACKOUT RECONSTRUCTION</h3><p>Rebuild the Creed in correct order.</p><div id="creedSeq"></div><button id="seqBtn">VERIFY RECONSTRUCTION</button></div>`;
 let answers=Array(blanks.length).fill("");
 blanks.forEach((x,i)=>{let row=document.createElement("div");row.className="matchrow";row.innerHTML=`<span>${x[0]}</span>`;let s=document.createElement("select");s.innerHTML=`<option value="">SELECT EXACT WORD</option>`+x[2].map(v=>`<option>${v}</option>`).join("");s.onchange=()=>answers[i]=s.value;row.appendChild(s);$("#cb").appendChild(row)});
 $("#cbBtn").onclick=()=>{
  if(answers.some(x=>!x))return fb("Restore every missing word.","warn");
  let n=answers.filter((x,i)=>x.toLowerCase()===blanks[i][1].toLowerCase()).length;
  if(n<blanks.length)return penalty((blanks.length-n)*55,`${n}/${blanks.length} exact words restored`);
  $("#decoyBox").style.display="block"
 };
 let picked=[];
 decoys.forEach((d,i)=>{let b=document.createElement("button");b.className="option";b.textContent=d;b.onclick=()=>selectExact("#decoys",falseSet.length,picked,i,b);$("#decoys").appendChild(b)});
 $("#decoyBtn").onclick=()=>{
  if(picked.length!==falseSet.length)return fb(`Select exactly ${falseSet.length} counterfeit statement${falseSet.length>1?"s":""}.`,"warn");
  if(JSON.stringify([...picked].sort((a,b)=>a-b))!==JSON.stringify(falseSet))return penalty(95,"Counterfeit identification rejected");
  $("#seqBox").style.display="block";draw()
 };
 function draw(){let box=$("#creedSeq");box.innerHTML="";seq.forEach((x,i)=>{let d=document.createElement("div");d.className="sortitem";d.innerHTML=`<span>${x}</span><div><button data-u="${i}">▲</button><button data-d="${i}">▼</button></div>`;box.appendChild(d)});box.querySelectorAll("[data-u]").forEach(b=>b.onclick=()=>{let i=+b.dataset.u;if(i){[seq[i-1],seq[i]]=[seq[i],seq[i-1]];draw()}});box.querySelectorAll("[data-d]").forEach(b=>b.onclick=()=>{let i=+b.dataset.d;if(i<seq.length-1){[seq[i+1],seq[i]]=[seq[i],seq[i+1]];draw()}})}
 $("#seqBtn").onclick=()=>JSON.stringify(seq)===JSON.stringify(correct)?clearRoom("CREED KEY // 9HONOR"):penalty(110,"Creed reconstruction rejected")
}

/* ROOM 3 */
function pathwayRoom(){
 const profiles=level==="3"?[
  {n:"Maya",facts:"3.7 GPA • wants RN nursing • $9,000/year family budget • wants to remain within 90 minutes • willing to transfer",best:"Community college → transfer",reason:"Lowest-cost route that can begin locally and preserve a bachelor's pathway"},
  {n:"Andre",facts:"2.9 GPA • wants industrial maintenance • learns best hands-on • wants to earn within 18 months • dislikes heavy student debt",best:"Career/technical program",reason:"Credentialed hands-on training aligns with the career and faster entry"},
  {n:"Simone",facts:"3.8 GPA • wants public administration • interested in Army officership • accepts that ROTC scholarships/programs may include obligations",best:"Four-year college + ROTC",reason:"Degree plus officer-development opportunity matches both goals"},
  {n:"Malik",facts:"Undecided • wants low first-two-year cost • needs flexible schedule • may transfer later",best:"Community college → transfer",reason:"Allows lower-cost exploration with a transfer option"}
 ]:[
  {n:"Morgan",facts:"3.9 GPA • engineering • wants to commission • scholarship offer includes service obligation • school has ABET-accredited engineering",best:"Four-year college + ROTC",reason:"Accredited degree and ROTC align with engineering and commissioning goals"},
  {n:"Darius",facts:"2.8 GPA • cybersecurity • wants certifications first • wants to work within 12–18 months • may complete degree later",best:"Career/technical program",reason:"Stackable technical credentials support quicker employment and later education"},
  {n:"Kayla",facts:"3.6 GPA • business • must stay local for family care • maximum first-year net cost $8,000 • wants bachelor's eventually",best:"Community college → transfer",reason:"Meets the local cost constraint and preserves a bachelor's route"},
  {n:"Elijah",facts:"3.9 GPA • biology/pre-health • $14,000/year net-cost cap • university research position included in aid offer",best:"Four-year university",reason:"Research and bachelor's preparation align with the health-professions pathway"},
  {n:"Renee",facts:"3.4 GPA • electrician career • wants paid training • maximum debt $5,000 • values direct employer experience",best:"Registered apprenticeship / technical",reason:"Paid work-based training fits the occupation and debt constraint"}
 ];
 const paths=["Four-year university","Community college → transfer","Career/technical program","Four-year college + ROTC","Registered apprenticeship / technical","Immediate workforce only"];
 const reasons=[
 "Lowest-cost route that can begin locally and preserve a bachelor's pathway",
 "Credentialed hands-on training aligns with the career and faster entry",
 "Degree plus officer-development opportunity matches both goals",
 "Allows lower-cost exploration with a transfer option",
 "Accredited degree and ROTC align with engineering and commissioning goals",
 "Stackable technical credentials support quicker employment and later education",
 "Meets the local cost constraint and preserves a bachelor's route",
 "Research and bachelor's preparation align with the health-professions pathway",
 "Paid work-based training fits the occupation and debt constraint",
 "Most prestigious option",
 "Friends are going there",
 "Any scholarship automatically makes the choice best"
 ];
 $("#work").innerHTML=`<div class="task"><h3>PHASE 1 // HARD-CONSTRAINT MATRIX</h3><p>Select a pathway AND the controlling reason for every cadet. A choice that violates a hard cost/career/location constraint is wrong even if it sounds attractive.</p><div id="profiles"></div><button id="pathBtn">VERIFY MATRIX</button></div><div id="updateBox"></div><div id="riddle2"></div>`;
 let a=profiles.map(()=>({p:"",r:""}));
 profiles.forEach((x,i)=>{let d=document.createElement("div");d.className="profile";d.innerHTML=`<b>${x.n}</b><p>${x.facts}</p>`;let p=document.createElement("select");p.innerHTML=`<option value="">PATHWAY</option>`+paths.map(v=>`<option>${v}</option>`).join("");p.onchange=()=>a[i].p=p.value;let r=document.createElement("select");r.innerHTML=`<option value="">CONTROLLING REASON</option>`+reasons.map(v=>`<option>${v}</option>`).join("");r.onchange=()=>a[i].r=r.value;d.appendChild(p);d.appendChild(r);$("#profiles").appendChild(d)});
 $("#pathBtn").onclick=()=>{
  if(a.some(x=>!x.p||!x.r))return fb("Every cadet needs both a pathway and controlling reason.","warn");
  let n=a.filter((x,i)=>x.p===profiles[i].best&&x.r===profiles[i].reason).length;
  if(n<profiles.length)return penalty((profiles.length-n)*75,`${n}/${profiles.length} pathway decisions fully correct`);
  update()
 };
 function update(){
  $("#updateBox").innerHTML=level==="3"?`<div class="task"><h3>PHASE 2 // NEW CONSTRAINTS</h3><p>Maya's preferred local nursing program now has a two-year waitlist. Another accredited community college 70 minutes away can start her this fall and still fits the budget. Which action is strongest?</p><button class="option" id="u1">Wait two years because the first plan should never change.</button><button class="option" id="u2">Compare the alternate accredited program, transfer agreements, commute, and total cost before switching.</button><button class="option" id="u3">Choose any four-year university immediately.</button></div>`:`<div class="task"><h3>PHASE 2 // MULTIPLE NEW CONSTRAINTS</h3><p>Morgan's ROTC scholarship is confirmed, but the school loses ABET accreditation for his engineering program. A second university has ABET accreditation, ROTC, and costs $3,000 more per year. Which factor should control the next decision?</p><button class="option" id="u1">Keep the cheaper school because price always wins.</button><button class="option" id="u2">Re-evaluate around program accreditation, commissioning goal, scholarship portability/terms, and total cost.</button><button class="option" id="u3">Drop engineering because changing majors is easier.</button></div>`;
  $("#u1").onclick=()=>penalty(95,"The new constraint materially changes the pathway");
  $("#u3").onclick=()=>penalty(95,"Changing the career goal is not the first response");
  $("#u2").onclick=()=>riddle()
 }
 function riddle(){
  $("#riddle2").innerHTML=`<div class="task"><h3>RIDDLE TOKEN 2</h3><div class="riddle">How many sides does a circle have?</div><input id="rr2"><button id="rr2b">UNLOCK TOKEN</button></div>`;
  $("#rr2b").onclick=()=>{let v=$("#rr2").value.trim().toLowerCase();if(!["2","two"].includes(v))return penalty(50,"Riddle rejected");tokens.push("2");clearRoom("PATHWAY KEY // ROUTE5 • TOKEN // 2")}
 }
}

/* ROOM 4 */
function financeRoom(){
 const items=level==="3"?[
  ["Rent","NEED"],["Groceries","NEED"],["Basic transportation to work/school","NEED"],["Premium streaming bundle","WANT"],["Restaurant delivery twice a week","WANT"],["Phone plan","DEPENDS"],["New $170 sneakers when another usable pair exists","WANT"],["Replacement shoes because the only pair is torn and unusable","NEED"],["Emergency savings contribution","NEED"]
 ]:[
  ["Rent","NEED"],["Groceries","NEED"],["Car insurance","NEED"],["Gas for work/school","NEED"],["Three entertainment subscriptions","WANT"],["Restaurant delivery three times a week","WANT"],["Phone plan","DEPENDS"],["Replacement shoes because the only pair is unusable","NEED"],["Upgraded laptop when current laptop meets school requirements","WANT"],["Emergency savings contribution","NEED"]
 ];
 $("#work").innerHTML=`<div class="task"><h3>PHASE 1 // FINANCIAL TRIAGE</h3><div id="frows"></div><button id="fcheck">VERIFY TRIAGE</button></div><div id="budgetBox"></div>`;
 let a=Array(items.length).fill("");
 items.forEach((x,i)=>{let row=document.createElement("div");row.className="classrow";row.innerHTML=`<span>${x[0]}</span>`;let s=document.createElement("select");s.innerHTML=`<option value="">SELECT</option><option>NEED</option><option>WANT</option><option>DEPENDS</option>`;s.onchange=()=>a[i]=s.value;row.appendChild(s);$("#frows").appendChild(row)});
 $("#fcheck").onclick=()=>{if(a.some(x=>!x))return fb("Classify every item.","warn");let n=a.filter((x,i)=>x===items[i][1]).length;if(n<items.length)return penalty((items.length-n)*45,`${n}/${items.length} classifications correct`);budget()};
 function budget(){
  if(level==="3"){
   $("#budgetBox").innerHTML=`<div class="task"><h3>PHASE 2 // ZERO-BASED BUDGET</h3><p>Take-home income = <b>$2,420</b></p><table class="budget"><tr><th>Need</th><th>Amount</th></tr><tr><td>Rent</td><td>$760</td></tr><tr><td>Utilities</td><td>$145</td></tr><tr><td>Groceries</td><td>$315</td></tr><tr><td>Transportation</td><td>$210</td></tr><tr><td>Insurance</td><td>$165</td></tr><tr><td>Phone</td><td>$75</td></tr></table><p>Pay yourself first: <b>$250 savings</b>.</p><label>A. Money remaining after needs + savings<input id="m1" type="number"></label><p>Planned wants: restaurants $180, entertainment $95, clothing $140.</p><label>B. Buffer after planned wants<input id="m2" type="number"></label><button id="mbtn">VERIFY BUDGET</button></div><div id="shock"></div>`;
   $("#mbtn").onclick=()=>{if(+$("#m1").value!==500||+$("#m2").value!==85)return penalty(80,"Budget calculations rejected");shock3()}
  } else {
   $("#budgetBox").innerHTML=`<div class="task"><h3>PHASE 2 // ZERO-BASED BUDGET</h3><p>Take-home income = <b>$3,080</b></p><table class="budget"><tr><th>Need</th><th>Amount</th></tr><tr><td>Rent</td><td>$925</td></tr><tr><td>Utilities</td><td>$160</td></tr><tr><td>Groceries</td><td>$360</td></tr><tr><td>Car insurance</td><td>$205</td></tr><tr><td>Gas</td><td>$190</td></tr><tr><td>Phone</td><td>$85</td></tr><tr><td>Student loan payment</td><td>$175</td></tr></table><p>Pay yourself first: <b>$300 savings</b>.</p><label>A. Money remaining after needs + savings<input id="m1" type="number"></label><p>Planned wants: dining $230, entertainment $120, travel fund $190.</p><label>B. Buffer after planned wants<input id="m2" type="number"></label><button id="mbtn">VERIFY BUDGET</button></div><div id="shock"></div>`;
   $("#mbtn").onclick=()=>{if(+$("#m1").value!==680||+$("#m2").value!==140)return penalty(80,"Budget calculations rejected");shock4()}
  }
 }
 function shock3(){
  $("#shock").innerHTML=`<div class="task"><h3>PHASE 3 // EMERGENCY CHANGE</h3><p>A required $310 repair appears. You have an $85 buffer. Which combination covers the remaining $225 while preserving all needs AND the $250 savings goal?</p><button class="option" id="q1">Cut restaurants by $130 and clothing by $95.</button><button class="option" id="q2">Take $225 from savings.</button><button class="option" id="q3">Skip groceries and insurance totaling $225.</button><button class="option" id="q4">Charge the full repair without changing spending.</button></div><div id="credit"></div>`;
  $("#q2").onclick=()=>penalty(90,"Savings goal is part of the stated constraint");$("#q3").onclick=()=>penalty(90,"Those are true needs");$("#q4").onclick=()=>penalty(90,"Discretionary cuts are available before adding debt");$("#q1").onclick=()=>credit3()
 }
 function shock4(){
  $("#shock").innerHTML=`<div class="task"><h3>PHASE 3 // EMERGENCY CHANGE</h3><p>A required certification fee of $390 appears. You have a $140 buffer. Choose the plan that covers the remaining $250 while preserving needs and $300 savings.</p><button class="option" id="q1">Reduce dining $120, entertainment $80, travel $50.</button><button class="option" id="q2">Skip the $175 student loan payment and cut savings by $75.</button><button class="option" id="q3">Pay it all with a credit card and leave spending unchanged.</button><button class="option" id="q4">Reduce groceries by $250.</button></div><div id="credit"></div>`;
  $("#q2").onclick=()=>penalty(90,"The plan violates stated obligations and savings");$("#q3").onclick=()=>penalty(90,"Debt is not the strongest first adjustment");$("#q4").onclick=()=>penalty(90,"Groceries are a need");$("#q1").onclick=()=>credit4()
 }
 function credit3(){
  $("#credit").innerHTML=`<div class="task"><h3>PHASE 4 // CREDIT CONSEQUENCE</h3><p>Card limit $1,500. Balance $975. You make a $225 payment, then charge $180 for a required expense.</p><label>New balance<input id="bal" type="number"></label><label>Utilization % rounded to nearest whole percent<input id="util" type="number"></label><button id="cbtn">CHECK CREDIT MATH</button></div>`;
  $("#cbtn").onclick=()=>{if(+$("#bal").value!==930||+$("#util").value!==62)return penalty(90,"Credit calculation rejected");clearRoom("FINANCE KEY // 62SAVE")}
 }
 function credit4(){
  $("#credit").innerHTML=`<div class="task"><h3>PHASE 4 // CREDIT + INTEREST</h3><p>Card limit $2,400. Current balance $1,560. You pay $400, then charge $260.</p><label>A. New balance<input id="bal" type="number"></label><label>B. Utilization % rounded to nearest whole percent<input id="util" type="number"></label><p>The APR is 24%. Approximate one month of interest using APR ÷ 12.</p><label>C. Approximate one-month interest on the new balance<input id="interest" type="number" step="0.01"></label><button id="cbtn">CHECK CREDIT MATH</button></div>`;
  $("#cbtn").onclick=()=>{let ok=+$("#bal").value===1420&&+$("#util").value===59&&Math.abs(+$("#interest").value-28.40)<.02;if(!ok)return penalty(100,"Credit/interest calculation rejected");clearRoom("FINANCE KEY // 59SAVE")}
 }
}

/* ROOM 5 */
function leadershipRoom(){
 const schools=level==="3"?[
  {n:"COLLEGE A",f:"Desired major • $18,000/year net cost • 3 hours away • strong graduation rate"},
  {n:"COLLEGE B",f:"Desired major • $11,500/year net cost • internship partnership • 45 minutes away"},
  {n:"COLLEGE C",f:"Full scholarship • friends attending • does NOT offer desired major"}
 ]:[
  {n:"COLLEGE A",f:"Top-ranked desired program • $25,000/year net cost • no ROTC"},
  {n:"COLLEGE B",f:"Strong desired program • $14,000/year net cost • ROTC • paid internship"},
  {n:"COLLEGE C",f:"Full scholarship • different major • family strongly prefers it"}
 ];
 let choice=null, factors=[];
 $("#work").innerHTML=`<div class="task"><h3>PHASE 1 // INITIAL BOARD</h3><p>Choose a school and exactly THREE controlling factors.</p><div id="schools" class="grid3"></div><div id="factors"></div><button id="lock">LOCK INITIAL BOARD</button></div><div id="update1"></div>`;
 schools.forEach((x,i)=>{let d=document.createElement("div");d.className="school";d.innerHTML=`<h3>${x.n}</h3><p>${x.f}</p><button>SELECT</button>`;d.querySelector("button").onclick=()=>{choice=i;document.querySelectorAll(".school").forEach(q=>q.classList.remove("selected"));d.classList.add("selected")};$("#schools").appendChild(d)});
 const fs=["Career/major fit","Net cost/debt","Internship/ROTC opportunity","Graduation/completion likelihood","Friends are attending","Prestige alone","Long-term flexibility"];
 fs.forEach((x,i)=>{let b=document.createElement("button");b.className="option";b.textContent=x;b.onclick=()=>selectExact("#factors",3,factors,i,b);$("#factors").appendChild(b)});
 $("#lock").onclick=()=>{if(choice===null||factors.length!==3)return fb("Choose one school and exactly three controlling factors.","warn");if(factors.filter(x=>[4,5].includes(x)).length>=2)return penalty(110,"Social pressure/prestige is controlling too much of the decision");update1()};
 function update1(){
  $("#update1").innerHTML=level==="3"?`<div class="task"><h3>INTELLIGENCE UPDATE 1</h3><p>College B adds a $5,000 annual scholarship. College A reports that your desired program requires an extra year for most students.</p><p>Which response is strongest?</p><button class="option" id="a1">Keep the first choice automatically.</button><button class="option" id="a2">Recalculate total cost/time-to-degree and re-evaluate career fit before deciding.</button><button class="option" id="a3">Choose B only because it is cheaper.</button></div><div id="update2"></div>`:`<div class="task"><h3>INTELLIGENCE UPDATE 1</h3><p>College B adds a $7,000 annual scholarship, but the ROTC option includes a future service obligation. College A adds a $4,000 scholarship but still has no ROTC.</p><p>Which response is strongest?</p><button class="option" id="a1">Accept B immediately because it has the larger scholarship.</button><button class="option" id="a2">Compare net cost, career fit, ROTC obligation, commissioning goal, and alternatives before committing.</button><button class="option" id="a3">Reject B automatically because any service obligation is bad.</button></div><div id="update2"></div>`;
  $("#a1").onclick=()=>penalty(100,"The new facts require analysis, not an automatic response");$("#a3").onclick=()=>penalty(100,"One factor should not automatically control the entire decision");$("#a2").onclick=()=>update2()
 }
 function update2(){
  $("#update2").innerHTML=level==="3"?`<div class="task"><h3>INTELLIGENCE UPDATE 2</h3><p>College B's internship partner guarantees interviews only to students with a 3.0 college GPA. Which statement is strongest?</p><button class="option" id="b1">The internship guarantee makes B risk-free.</button><button class="option" id="b2">B may still be strong, but the benefit is conditional and should not be treated as guaranteed employment.</button><button class="option" id="b3">The GPA condition makes internships worthless.</button></div>`:`<div class="task"><h3>INTELLIGENCE UPDATE 2</h3><p>College B's ROTC scholarship does not cover room and board, and the paid internship is competitive rather than guaranteed. Which statement is strongest?</p><button class="option" id="b1">The original advertised benefits should still be treated as guaranteed.</button><button class="option" id="b2">Recalculate the true net cost and separate guaranteed benefits from competitive opportunities before the final choice.</button><button class="option" id="b3">Reject B because not every benefit is guaranteed.</button></div>`;
  $("#b1").onclick=()=>penalty(100,"Conditional opportunities cannot be treated as guaranteed");$("#b3").onclick=()=>penalty(100,"Uncertainty should be evaluated, not automatically rejected");$("#b2").onclick=()=>clearRoom("LEADERSHIP KEY // ADAPT2")
 }
}

/* ROOM 6 */
function finalRoom(){
 $("#work").innerHTML=`<div class="task"><h3>FINAL RIDDLE TOKEN</h3><div class="riddle">If you’ve got me, you want to share me; if you share me, you haven’t kept me. What am I?</div><input id="rr3"><button id="rr3b">UNLOCK FINAL TOKEN</button></div><div id="extract"></div>`;
 $("#rr3b").onclick=()=>{let v=$("#rr3").value.trim().toLowerCase();if(!["secret","a secret"].includes(v))return penalty(50,"Riddle rejected");tokens.push("S");meta()}
 function meta(){
  let finance=level==="3"?"62SAVE":"59SAVE";
  $("#extract").innerHTML=`<div class="task"><h3>PHASE 1 // META-EXTRACTION</h3><div class="codebox">
RECOVERED KEYS:<br>
VALUES = LDRSHIP7<br>
CREED = 9HONOR<br>
PATHWAY = ROUTE5<br>
FINANCE = ${finance}<br>
LEADERSHIP = ADAPT2<br>
RIDDLE TOKENS = ${tokens.join(" ")}<br><br>
DO NOT CONCATENATE THE KEYS.<br><br>
EXTRACT IN THIS ORDER:<br>
1. The NUMBER from VALUES<br>
2. The FIRST LETTER of CREED's word<br>
3. The NUMBER from PATHWAY<br>
4. The NUMBER from FINANCE<br>
5. The NUMBER from LEADERSHIP<br>
6. Riddle tokens in order
</div>
<label>FINAL EXTRACTION CODE<input id="finalCode"></label><button id="finalBtn">RECOVER BRIEFING</button></div>`;
  let answer=(level==="3"?"7H56223S":"7H55923S");
  $("#finalBtn").onclick=()=>{let v=$("#finalCode").value.trim().toUpperCase().replace(/[^A-Z0-9]/g,"");if(v!==answer)return penalty(130,"Meta-extraction rejected");clearRoom("FUTURE READINESS BRIEFING // EXPERT RECOVERED")}
 }
}

function finish(){clearInterval(timer);screen("complete");hud();$("#aar").innerHTML=`<div class="aarbox">CALLSIGN: ${callsign.toUpperCase()}<br>PATH: LET ${level}<br>TIME REMAINING: ${fmt(time)}<br>SCORE: ${score}<br>ROOMS CLEARED: 6/6<br>RIDDLE TOKENS: ${tokens.join(" • ")}<br><br>STATUS: FUTURE READY — EXPERT</div>`}
hud();inv();
