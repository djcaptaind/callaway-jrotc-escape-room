
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
 const blanks=level==="3"?[
  ["I am an ___ Junior ROTC Cadet.","Army",["Army","American","Active","Armed"]],
  ["I will always conduct myself to bring ___ to my family, country, school and the Corps of Cadets.","credit",["credit","attention","rank","victory"]],
  ["I am loyal and ___ .","patriotic",["patriotic","obedient","fearless","competitive"]],
  ["I do not lie, cheat or steal and will always be ___ for my actions and deeds.","accountable",["accountable","rewarded","recognized","responsible only when caught"]],
  ["I will work hard to improve my ___ and strengthen my body.","mind",["mind","reputation","rank","uniform"]]
 ]:[
  ["I will always conduct myself to bring ___ to my family, country, school and the Corps of Cadets.","credit",["credit","honor","attention","victory"]],
  ["I am loyal and ___ .","patriotic",["patriotic","obedient","fearless","competitive"]],
  ["I do not lie, cheat or ___ and will always be accountable for my actions and deeds.","steal",["steal","borrow","quit","complain"]],
  ["I will always be accountable for my ___ and deeds.","actions",["actions","intentions","opinions","friends"]],
  ["I will work hard to improve my ___ and strengthen my body.","mind",["mind","reputation","rank","image"]],
  ["I will seek the ___ of leadership and stand prepared to uphold the Constitution and the American way of life.","mantle",["mantle","position","title","reward"]]
 ];
 const intruders=level==="3"?[
  ["I am the future of the United States of America.",false],
  ["I will always practice good citizenship and patriotism.",false],
  ["I will work hard to improve my mind and strengthen my body.",false],
  ["I will follow my friends whenever the group agrees.",true],
  ["May God grant me the strength to always live by this creed.",false],
  ["I will seek the mantle of leadership and stand prepared to uphold the Constitution and the American way of life.",false]
 ]:[
  ["I will always practice good citizenship and patriotism.",false],
  ["I will place the reputation of my unit above the Constitution when necessary.",true],
  ["I am the future of the United States of America.",false],
  ["I will always obey every order without using judgment or proper channels.",true],
  ["I do not lie, cheat or steal and will always be accountable for my actions and deeds.",false],
  ["May God grant me the strength to always live by this creed.",false],
  ["I will seek the mantle of leadership and stand prepared to uphold the Constitution and the American way of life.",false]
 ];
 let seq=level==="3"?[
  "I am an Army Junior ROTC Cadet.",
  "I will always conduct myself to bring credit to my family, country, school and the Corps of Cadets.",
  "I am loyal and patriotic.",
  "I do not lie, cheat or steal and will always be accountable for my actions and deeds.",
  "I will work hard to improve my mind and strengthen my body.",
  "I will seek the mantle of leadership and stand prepared to uphold the Constitution and the American way of life."
 ]:[
  "I am an Army Junior ROTC Cadet.",
  "I will always conduct myself to bring credit to my family, country, school and the Corps of Cadets.",
  "I am loyal and patriotic.",
  "I am the future of the United States of America.",
  "I do not lie, cheat or steal and will always be accountable for my actions and deeds.",
  "I will always practice good citizenship and patriotism.",
  "I will work hard to improve my mind and strengthen my body.",
  "I will seek the mantle of leadership and stand prepared to uphold the Constitution and the American way of life."
 ];
 const correct=[...seq];seq.sort(()=>Math.random()-.5);
 $("#work").innerHTML=`<div class="task"><h3>PHASE 1 // CREED FORENSICS</h3><p>Restore the exact Creed word in each damaged transmission. Decoy words are intentionally plausible.</p><div id="blankRows"></div><button id="blankCheck">VERIFY RESTORATION</button></div><div id="intruderBox" class="task" style="display:none"><h3>PHASE 2 // FIND THE INTRUDER${level==="4"?"S":""}</h3><p>${level==="4"?"Exactly TWO statements do not belong in the Cadet Creed. Select both.":"Exactly ONE statement does not belong in the Cadet Creed."}</p><div id="intruders"></div><button id="intruderCheck">VERIFY FORENSICS</button></div><div id="corder" class="task" style="display:none"><h3>PHASE 3 // REBUILD THE CREED</h3><p>Place the selected Creed statements in their correct relative order.</p><div id="sortc"></div><button id="ocheck">VERIFY SEQUENCE</button></div>`;
 let a=Array(blanks.length).fill("");
 blanks.forEach((x,i)=>{let row=document.createElement("div");row.className="matchrow";row.innerHTML=`<span>${x[0]}</span>`;let sel=document.createElement("select");sel.innerHTML=`<option value="">SELECT WORD</option>`+x[2].map(o=>`<option>${o}</option>`).join("");sel.onchange=()=>a[i]=sel.value;row.appendChild(sel);$("#blankRows").appendChild(row)});
 $("#blankCheck").onclick=()=>{if(a.some(x=>!x))return fb("Restore every damaged word.","warn");let n=a.filter((x,i)=>x.toLowerCase()===blanks[i][1].toLowerCase()).length;if(n<blanks.length)return penalty((blanks.length-n)*45,`${n}/${blanks.length} Creed words restored`);$("#intruderBox").style.display="block";buildIntruders()};
 let picked=[];
 function buildIntruders(){let box=$("#intruders");box.innerHTML="";intruders.forEach((x,i)=>{let b=document.createElement("button");b.className="option";b.textContent=x[0];b.onclick=()=>{let at=picked.indexOf(i);if(at>=0){picked.splice(at,1);b.classList.remove("selected")}else{let max=level==="4"?2:1;if(picked.length<max){picked.push(i);b.classList.add("selected")}}};box.appendChild(b)})}
 $("#intruderCheck").onclick=()=>{let need=intruders.map((x,i)=>x[1]?i:null).filter(x=>x!==null);if(picked.length!==need.length)return fb(`Select exactly ${need.length} intruder statement${need.length>1?"s":""}.`,"warn");if(JSON.stringify([...picked].sort())!==JSON.stringify([...need].sort()))return penalty(80,"Creed forensic selection rejected");$("#corder").style.display="block";draw()};
 function draw(){let b=$("#sortc");b.innerHTML="";seq.forEach((x,i)=>{let d=document.createElement("div");d.className="sortitem";d.innerHTML=`<span>${x}</span><div><button data-u="${i}">▲</button><button data-d="${i}">▼</button></div>`;b.appendChild(d)});b.querySelectorAll("[data-u]").forEach(q=>q.onclick=()=>{let i=+q.dataset.u;if(i){[seq[i-1],seq[i]]=[seq[i],seq[i-1]];draw()}});b.querySelectorAll("[data-d]").forEach(q=>q.onclick=()=>{let i=+q.dataset.d;if(i<seq.length-1){[seq[i+1],seq[i]]=[seq[i],seq[i+1]];draw()}})}
 $("#ocheck").onclick=()=>JSON.stringify(seq)===JSON.stringify(correct)?clearRoom("CREED KEY // HONOR"):penalty(90,"Creed sequence rejected")
}
function pathwayRoom(){
 const profiles=level==="3"?[
  ["Nia","3.6 GPA • wants teaching • wants a traditional campus • moderate financial need • bachelor's degree required for her target career","Four-year university","Career requires a bachelor's degree"],
  ["Caleb","2.8 GPA • enjoys welding • wants a faster route into skilled work • prefers hands-on training","Career/technical program","Hands-on credential can lead directly to skilled employment"],
  ["Tori","3.8 GPA • wants college + leadership training • interested in military service after college • wants scholarship opportunities","Four-year college + ROTC","Combines degree path with officer-development opportunity"],
  ["Jaylen","Undecided • wants lower cost for the first two years • wants time to explore majors • wants transfer option","Community college → transfer","Lower-cost exploration while preserving transfer options"]
 ]:[
  ["Morgan","3.9 GPA • wants engineering • strong leadership record • interested in commissioning • willing to accept a service obligation if the program fits","Four-year college + ROTC","Degree + ROTC aligns with engineering and commissioning goals"],
  ["Darius","2.7 GPA • wants cybersecurity • prefers certifications and hands-on learning • wants to work sooner • may pursue a degree later","Career/technical program","Stackable technical credentials support faster entry and later growth"],
  ["Kayla","3.5 GPA • wants business • family obligations require staying close • lower first-year cost is critical • wants bachelor's degree eventually","Community college → transfer","Local lower-cost start supports family needs and later transfer"],
  ["Elijah","3.8 GPA • wants biology for a health-professions pathway • has a strong academic aid package • wants research access","Four-year university","Bachelor's pathway and research access fit long-term academic goals"],
  ["Renee","3.4 GPA • wants electrical work • values paid training • wants little student debt • comfortable learning on the job","Career/technical program","Apprenticeship-style training can combine pay, skill, and credentialing"]
 ];
 const paths=["Four-year university","Community college → transfer","Career/technical program","Four-year college + ROTC","Immediate workforce with no further training"];
 const reasons=[
  "Career requires a bachelor's degree",
  "Hands-on credential can lead directly to skilled employment",
  "Combines degree path with officer-development opportunity",
  "Lower-cost exploration while preserving transfer options",
  "Degree + ROTC aligns with engineering and commissioning goals",
  "Stackable technical credentials support faster entry and later growth",
  "Local lower-cost start supports family needs and later transfer",
  "Bachelor's pathway and research access fit long-term academic goals",
  "Apprenticeship-style training can combine pay, skill, and credentialing",
  "It sounds more impressive than the other options",
  "Friends are choosing it"
 ];
 $("#work").innerHTML=`<div class="task"><h3>PHASE 1 // PATHWAY + EVIDENCE MATRIX</h3><p>For every cadet, choose BOTH the strongest pathway and the strongest reason. A possible pathway is not always the best-fit pathway.</p><div id="profiles"></div><button id="pcheck">VERIFY MATRIX</button></div><div id="constraintBox"></div><div id="riddle2"></div>`;
 let a=Array(profiles.length).fill("").map(()=>({p:"",r:""}));
 profiles.forEach((x,i)=>{let d=document.createElement("div");d.className="profile";d.innerHTML=`<b>${x[0]}</b><p>${x[1]}</p>`;let ps=document.createElement("select");ps.innerHTML=`<option value="">SELECT PATHWAY</option>`+paths.map(o=>`<option>${o}</option>`).join("");ps.onchange=()=>a[i].p=ps.value;let rs=document.createElement("select");rs.innerHTML=`<option value="">SELECT CONTROLLING REASON</option>`+reasons.map(o=>`<option>${o}</option>`).join("");rs.onchange=()=>a[i].r=rs.value;d.appendChild(ps);d.appendChild(rs);$("#profiles").appendChild(d)});
 $("#pcheck").onclick=()=>{if(a.some(x=>!x.p||!x.r))return fb("Complete both selections for every cadet.","warn");let n=a.filter((x,i)=>x.p===profiles[i][2]&&x.r===profiles[i][3]).length;if(n<profiles.length)return penalty((profiles.length-n)*60,`${n}/${profiles.length} pathway/evidence pairs correct`);constraint()};
 function constraint(){let html=level==="3"?`<div class="task"><h3>PHASE 2 // CONSTRAINT UPDATE</h3><p>Caleb learns that the welding program he selected is <b>not recognized by the employers he wants to work for</b>. What is the strongest response?</p><button class="option" id="pa">Enroll anyway because technical school is still the right category.</button><button class="option" id="pb">Find an accredited/recognized welding program or apprenticeship that still fits his hands-on career goal.</button><button class="option" id="pc">Switch automatically to a four-year university.</button></div>`:`<div class="task"><h3>PHASE 2 // CONSTRAINT UPDATE</h3><p>Morgan receives a confirmed ROTC scholarship offer at a university with engineering, but accepting it includes a future service obligation. What is the strongest response?</p><button class="option" id="pa">Accept immediately because free tuition is always the best choice.</button><button class="option" id="pb">Compare the service obligation, engineering fit, career goals, and scholarship terms before committing.</button><button class="option" id="pc">Reject ROTC automatically because any obligation removes personal choice.</button></div>`;$("#constraintBox").innerHTML=html;$("#pa").onclick=()=>penalty(85,"Pathway category alone is not enough; program quality and requirements matter");$("#pc").onclick=()=>penalty(85,"A major decision should not be automatic");$("#pb").onclick=()=>riddle()}
 function riddle(){$("#riddle2").innerHTML=`<div class="task"><h3>RIDDLE TOKEN 2</h3><div class="riddle">How many sides does a circle have?</div><input id="rr2"><button id="rr2b">UNLOCK</button></div>`;$("#rr2b").onclick=()=>{let v=$("#rr2").value.trim().toLowerCase();if(!["2","two"].includes(v))return penalty(45,"Riddle rejected");tokens.push("2");clearRoom("PATHWAY KEY // ROUTE • TOKEN // 2")}}
}
function financeRoom(){
 const items=level==="3"?[
  ["Rent","NEED"],["Groceries","NEED"],["Basic transportation to work/school","NEED"],["Premium streaming bundle","WANT"],["Restaurant delivery twice a week","WANT"],["Phone plan","DEPENDS"],["New $170 sneakers when you already have another usable pair","WANT"],["Replacement shoes because your only pair is torn and unusable","NEED"],["Minimum emergency savings contribution","NEED"]
 ]:[
  ["Rent","NEED"],["Groceries","NEED"],["Car insurance","NEED"],["Gas for work/school","NEED"],["Three entertainment subscriptions","WANT"],["Restaurant delivery three times a week","WANT"],["Phone plan","DEPENDS"],["Emergency fund contribution","NEED"],["Upgraded laptop when current laptop meets school requirements","WANT"]
 ];
 $("#work").innerHTML=`<div class="task"><h3>PHASE 1 // FINANCIAL TRIAGE</h3><p>Classify each item. "Depends" means the category can change based on the actual plan, price, or circumstances.</p><div id="frows"></div><button id="fcheck">VERIFY TRIAGE</button></div><div id="budgetBox"></div>`;
 let a=Array(items.length).fill("");items.forEach((x,i)=>{let row=document.createElement("div");row.className="classrow";row.innerHTML=`<span>${x[0]}</span>`;let sel=document.createElement("select");sel.innerHTML=`<option value="">SELECT</option><option>NEED</option><option>WANT</option><option>DEPENDS</option>`;sel.onchange=()=>a[i]=sel.value;row.appendChild(sel);$("#frows").appendChild(row)});
 $("#fcheck").onclick=()=>{if(a.some(x=>!x))return fb("Classify every expense.","warn");let n=a.filter((x,i)=>x===items[i][1]).length;if(n<items.length)return penalty((items.length-n)*40,`${n}/${items.length} classifications correct`);budget()};
 function budget(){
  if(level==="3"){$("#budgetBox").innerHTML=`<div class="task"><h3>PHASE 2 // BUDGET UNDER PRESSURE</h3><p>Monthly income: <span class="money">$2,050</span></p><table class="budget"><tr><th>Need</th><th>Amount</th></tr><tr><td>Rent</td><td>$720</td></tr><tr><td>Utilities</td><td>$120</td></tr><tr><td>Groceries</td><td>$280</td></tr><tr><td>Transportation</td><td>$180</td></tr><tr><td>Basic phone</td><td>$70</td></tr></table><p>You must <b>pay yourself first: $200 savings</b>.</p><p>1) After needs and savings, how much is available for all wants?</p><input id="b1" type="number"><p>2) Wants planned: streaming $55 + restaurants $220 + sneakers $160. If all are purchased, how much money remains?</p><input id="b2" type="number"><button id="budgetBtn">VERIFY BUDGET</button></div><div id="shockBox"></div>`;$("#budgetBtn").onclick=()=>{if(+$("#b1").value!==480||+$("#b2").value!==45)return penalty(65,"Budget math rejected");shock3()}}
  else{$("#budgetBox").innerHTML=`<div class="task"><h3>PHASE 2 // BUDGET UNDER PRESSURE</h3><p>Monthly income: <span class="money">$2,650</span></p><table class="budget"><tr><th>Need</th><th>Amount</th></tr><tr><td>Rent</td><td>$850</td></tr><tr><td>Utilities</td><td>$135</td></tr><tr><td>Groceries</td><td>$320</td></tr><tr><td>Car insurance</td><td>$190</td></tr><tr><td>Gas</td><td>$170</td></tr><tr><td>Phone</td><td>$85</td></tr></table><p>You must <b>pay yourself first: $200 savings</b>.</p><p>1) After needs and savings, how much remains for wants and buffer?</p><input id="b1" type="number"><p>2) Planned wants total $590. How much buffer remains after those wants?</p><input id="b2" type="number"><button id="budgetBtn">VERIFY BUDGET</button></div><div id="shockBox"></div>`;$("#budgetBtn").onclick=()=>{if(+$("#b1").value!==700||+$("#b2").value!==110)return penalty(65,"Budget math rejected");shock4()}}
 }
 function shock3(){$("#shockBox").innerHTML=`<div class="task"><h3>PHASE 3 // SURPRISE EXPENSE</h3><p>A required $175 car repair appears. You only had a $45 buffer. Which adjustment preserves the $200 savings goal and protects true needs?</p><button class="option" id="s1">Take $130 from savings.</button><button class="option" id="s2">Cancel $55 streaming and reduce restaurants by $75.</button><button class="option" id="s3">Skip $130 of groceries.</button><button class="option" id="s4">Put the $175 repair on an already high-balance credit card.</button></div><div id="creditBox"></div>`;$("#s1").onclick=()=>penalty(80,"That breaks the pay-yourself-first goal");$("#s3").onclick=()=>penalty(80,"Groceries are a true need in this scenario");$("#s4").onclick=()=>penalty(80,"New high-interest debt should not be the first solution when discretionary cuts are available");$("#s2").onclick=()=>credit3()}
 function shock4(){$("#shockBox").innerHTML=`<div class="task"><h3>PHASE 3 // SURPRISE EXPENSE</h3><p>A required $260 school fee appears. You have a $110 buffer. Which adjustment covers the remaining $150 while preserving $200 savings and all true needs?</p><button class="option" id="s1">Reduce travel/entertainment by $100 and restaurant spending by $50.</button><button class="option" id="s2">Reduce savings by $150.</button><button class="option" id="s3">Delay car insurance and use the money for the fee.</button><button class="option" id="s4">Charge the entire fee to a high-balance card without changing spending.</button></div><div id="creditBox"></div>`;$("#s2").onclick=()=>penalty(80,"That breaks the pay-yourself-first plan");$("#s3").onclick=()=>penalty(80,"Car insurance is a true need in this scenario");$("#s4").onclick=()=>penalty(80,"Debt does not replace a spending adjustment");$("#s1").onclick=()=>credit4()}
 function credit3(){$("#creditBox").innerHTML=`<div class="task"><h3>PHASE 4 // CREDIT UTILIZATION</h3><p>Credit limit: $1,200. Current balance: $780. If you charge another $180, what will the card utilization percentage be?</p><input id="util" type="number" placeholder="WHOLE PERCENT"><button id="utilBtn">CHECK UTILIZATION</button></div>`;$("#utilBtn").onclick=()=>+$("#util").value===80?clearRoom("FINANCE KEY // SAVE200"):penalty(70,"Utilization calculation rejected")}
 function credit4(){$("#creditBox").innerHTML=`<div class="task"><h3>PHASE 4 // CREDIT UTILIZATION</h3><p>Credit limit: $1,800. Balance: $1,170. You make a $300 payment, then charge $240. Enter the NEW balance and utilization percentage rounded to the nearest whole percent.</p><label>NEW BALANCE<input id="bal" type="number"></label><label>UTILIZATION %<input id="util" type="number"></label><button id="utilBtn">CHECK CREDIT MATH</button></div>`;$("#utilBtn").onclick=()=>{if(+$("#bal").value!==1110||+$("#util").value!==62)return penalty(70,"Credit math rejected");clearRoom("FINANCE KEY // SAVE200")}}
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
