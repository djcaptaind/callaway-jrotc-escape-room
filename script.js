const $=s=>document.querySelector(s);
const rooms=[
{title:"ARMY VALUES // LDRSHIP CIPHER",stars:1,brief:"Match seven situations to the strongest Army Value, then recover the Army founding key.",hint:"Separate Integrity, Honor, Duty, Selfless Service, and Personal Courage by asking what the situation is really testing."},
{title:"CADET CREED // BROKEN TRANSMISSION",stars:2,brief:"Restore missing Creed words, rebuild the sequence, and identify the JROTC founding year.",hint:"Think identity → conduct → loyalty/patriotism → accountability → self-development → leadership → Constitution."},
{title:"COLLEGE PATHWAYS // DESTINATION UNKNOWN",stars:3,brief:"Match four cadets to realistic postsecondary pathways based on career goals, cost, grades, and learning preferences.",hint:"The best pathway is the one that fits the career requirement and the student's circumstances—not simply the most prestigious option."},
{title:"PERSONAL FINANCE // THE $1,850 PROBLEM",stars:4,brief:"Classify expenses, build savings, and solve a credit decision without confusing available credit with available money.",hint:"Pay yourself first means intentionally fund savings before discretionary spending."},
{title:"LEADERSHIP DECISION // THREE ACCEPTANCE LETTERS",stars:5,brief:"Choose and defend a college option, then decide whether new information should change the recommendation.",hint:"Use cost, career fit, opportunity, values, debt, and long-term consequences. Strong leadership can adapt when the facts change."},
{title:"FINAL EXTRACTION // RECOVER THE BRIEFING",stars:6,brief:"Use every recovered key and all three riddle tokens to restore the Future Readiness Briefing.",hint:"Build the future in this order: VALUES → PATHWAY → MONEY → DECISION. Then follow the terminal rule exactly."}
];
let room=0,score=3000,time=2100,timer=null,inventory=[],hints=0,callsign="",riddleTokens=[],log=[];

function screen(id){["start","game","complete","failed"].forEach(x=>$("#"+x).classList.remove("active"));$("#"+id).classList.add("active")}
function fmt(s){return Math.floor(Math.max(0,s)/60)+":"+String(Math.max(0,s)%60).padStart(2,"0")}
function hud(){$("#clock").textContent=fmt(time);$("#score").textContent=score;$("#status").textContent=room>=6?"RECOVERED":room>0?"ACTIVE":"STANDBY";statusRows()}
function statusRows(){$("#roomStatus").innerHTML=rooms.map((x,i)=>`<div class="statusRow ${i<room?"done":i===room?"current":""}">${i<room?"✓":"▸"} ROOM ${i+1} // ${x.title.split("//")[0].trim()}</div>`).join("")}
function inv(){$("#inventory").innerHTML=inventory.length?inventory.map(x=>`<div class="asset">${x}</div>`).join(""):`<p class="muted">No keys recovered.</p>`}
function fb(msg,kind=""){$("#feedback").className="feedback "+kind;$("#feedback").innerHTML=msg}
function penalty(points,msg){score=Math.max(0,score-points);hud();fb(msg+` • −${points} points`,"warn")}
function completeRoom(asset,summary){inventory.push(asset);inv();log.push(`Room ${room+1}: ${summary}`);fb(`<b>ROOM CLEARED.</b><br>${asset}`);room++;hud();$("#hintBox").textContent="";setTimeout(()=>room>=6?finish():render(),700)}

$("#startBtn").onclick=()=>{callsign=$("#callsign").value.trim();if(!callsign)return alert("Enter a cadet or team callsign.");screen("game");render();timer=setInterval(()=>{time--;hud();if(time<=0){clearInterval(timer);screen("failed")}},1000)}
$("#hintBtn").onclick=()=>{if(room>=6)return;time=Math.max(0,time-45);hints++;$("#hintBox").textContent="INTEL: "+rooms[room].hint;hud()}

function render(){hud();$("#feedback").className="";$("#feedback").innerHTML="";$("#roomTag").textContent=`ROOM ${room+1} OF 6`;$("#roomTitle").textContent=rooms[room].title;$("#roomBrief").textContent=rooms[room].brief;$("#difficulty").textContent="DIFFICULTY "+"★".repeat(rooms[room].stars)+"☆".repeat(6-rooms[room].stars);[army,creed,pathways,finance,leadership,finalRoom][room]()}

function army(){
 const values=["Loyalty","Duty","Respect","Selfless Service","Honor","Integrity","Personal Courage"];
 const items=[
 ["You discover your best friend changed an accountability number so nobody will know the team made a mistake.","Integrity"],
 ["You complete an assigned responsibility even when nobody reminds you.","Duty"],
 ["You disagree with a cadet but still listen without humiliating them.","Respect"],
 ["You stay late to help the team prepare even though you receive no recognition.","Selfless Service"],
 ["You support the team while refusing to cover up wrongdoing.","Loyalty"],
 ["You choose the morally right course even though it may cost you socially.","Honor"],
 ["You report a serious problem even though you are nervous about the reaction.","Personal Courage"]];
 let p=$("#work");p.innerHTML=`<div class="taskbox"><h3>PHASE 1 // VALUE MATCH</h3><p class="instruction">Match each situation to its strongest controlling Army Value.</p><div id="valueRows"></div><button id="valueCheck">VERIFY LDRSHIP</button></div><div id="armyRiddle"></div>`;
 let ans=Array(items.length).fill("");
 items.forEach((it,i)=>{let row=document.createElement("div");row.className="valueGrid";row.innerHTML=`<span>${it[0]}</span>`;let s=document.createElement("select");s.innerHTML=`<option value="">SELECT VALUE</option>`+values.map(v=>`<option>${v}</option>`).join("");s.onchange=()=>ans[i]=s.value;row.appendChild(s);$("#valueRows").appendChild(row)});
 $("#valueCheck").onclick=()=>{if(ans.some(x=>!x))return fb("Complete all seven value matches.","warn");let n=ans.filter((x,i)=>x===items[i][1]).length;if(n<7)return penalty((7-n)*35,`${n}/7 values correct. Recheck the controlling value`);$("#armyRiddle").innerHTML=`<div class="taskbox"><h3>PHASE 2 // RIDDLE TOKEN</h3><div class="riddle">I am an odd number. Take away one letter and I become even. What number am I?</div><input id="r1"><button id="r1b">UNLOCK RIDDLE</button></div>`;$("#r1b").onclick=()=>{if($("#r1").value.trim().toLowerCase()!=="seven")return penalty(45,"Riddle answer rejected");riddleTokens.push("7");$("#armyRiddle").innerHTML+=`<div class="taskbox"><h3>PHASE 3 // ARMY BIRTHDAY</h3><p class="instruction">Enter the founding year of the United States Army.</p><input id="armyYear" placeholder="4-DIGIT YEAR"><button id="armyYearBtn">AUTHENTICATE</button></div>`;$("#armyYearBtn").onclick=()=>$("#armyYear").value.trim()==="1775"?completeRoom("ARMY KEY // 1775 • RIDDLE TOKEN // 7","LDRSHIP and Army birthday verified"):penalty(60,"Army birthday key rejected")}}
}

function creed(){
 const blanks=[["I am an Army Junior ROTC ______.","cadet"],["I do not lie, cheat or steal and will always be ______ for my actions and deeds.","accountable"],["I will seek the mantle of ______ and stand prepared to uphold the Constitution and the American way of life.","leadership"]];
 let mixed=[
 "I am an Army Junior ROTC Cadet.",
 "I am loyal and patriotic.",
 "I do not lie, cheat or steal and will always be accountable for my actions and deeds.",
 "I will work hard to improve my mind and strengthen my body.",
 "I will seek the mantle of leadership and stand prepared to uphold the Constitution and the American way of life.",
 "May God grant me the strength to always live by this creed."
 ];
 const correct=[...mixed];mixed.sort(()=>Math.random()-.5);
 $("#work").innerHTML=`<div class="taskbox"><h3>PHASE 1 // MISSING CREED WORDS</h3><div id="blanks"></div><button id="blankCheck">VERIFY WORDS</button></div><div id="orderBox" class="taskbox" style="display:none"><h3>PHASE 2 // RECONSTRUCT SEQUENCE</h3><div id="sortCreed"></div><button id="orderCheck">VERIFY SEQUENCE</button></div><div id="yearBox"></div>`;
 blanks.forEach((b,i)=>$("#blanks").innerHTML+=`<label>${b[0]}<input id="cb${i}"></label>`);
 $("#blankCheck").onclick=()=>{let ok=blanks.every((b,i)=>$("#cb"+i).value.trim().toLowerCase()===b[1]);if(!ok)return penalty(55,"One or more Creed words are incorrect");$("#orderBox").style.display="block";draw()};
 function draw(){let s=$("#sortCreed");s.innerHTML="";mixed.forEach((x,i)=>{let d=document.createElement("div");d.className="sortitem";d.innerHTML=`<span>${x}</span><div><button data-u="${i}">▲</button><button data-d="${i}">▼</button></div>`;s.appendChild(d)});s.querySelectorAll("[data-u]").forEach(b=>b.onclick=()=>{let i=+b.dataset.u;if(i){[mixed[i-1],mixed[i]]=[mixed[i],mixed[i-1]];draw()}});s.querySelectorAll("[data-d]").forEach(b=>b.onclick=()=>{let i=+b.dataset.d;if(i<mixed.length-1){[mixed[i+1],mixed[i]]=[mixed[i],mixed[i+1]];draw()}})}
 $("#orderCheck").onclick=()=>{if(JSON.stringify(mixed)!==JSON.stringify(correct))return penalty(70,"Creed sequence rejected");$("#yearBox").innerHTML=`<div class="taskbox"><h3>PHASE 3 // FOUNDING YEAR</h3><div class="riddle">The world was already at war, but America had not yet entered. Woodrow Wilson was President. Congress passed a National Defense Act that formally established JROTC. I am greater than 1915 and less than 1917. What year am I?</div><input id="cy"><button id="cyb">AUTHENTICATE YEAR</button></div>`;$("#cyb").onclick=()=>$("#cy").value.trim()==="1916"?completeRoom("CADET KEY // 1916","Cadet Creed transmission reconstructed"):penalty(60,"JROTC founding year rejected")}
}

function pathways(){
 const profiles=[
 {n:"Jasmine",d:"3.7 GPA • wants nursing • limited family money • wants to remain reasonably close to home",best:"Community college → transfer"},
 {n:"Marcus",d:"2.5 GPA • strong hands-on electrical aptitude • wants to earn sooner • dislikes traditional four-year classroom structure",best:"Technical / apprenticeship pathway"},
 {n:"Aaliyah",d:"3.9 GPA • strong leader • interested in public service • wants help paying for college",best:"Four-year college + ROTC"},
 {n:"DeAndre",d:"Undecided major • wants low-cost exploration • wants the option to transfer later",best:"Community college → transfer"}];
 const opts=["Four-year college only","Community college → transfer","Technical / apprenticeship pathway","Four-year college + ROTC","Immediate workforce with no training"];
 $("#work").innerHTML=`<div class="taskbox"><h3>PHASE 1 // PROFILE MATCH</h3><div id="profiles"></div><button id="pathCheck">VERIFY PATHWAYS</button></div><div id="pathRiddle"></div>`;
 let a=Array(4).fill("");profiles.forEach((x,i)=>{let d=document.createElement("div");d.className="profile";d.innerHTML=`<b>${x.n}</b><p>${x.d}</p>`;let s=document.createElement("select");s.innerHTML=`<option value="">SELECT PATHWAY</option>`+opts.map(o=>`<option>${o}</option>`).join("");s.onchange=()=>a[i]=s.value;d.appendChild(s);$("#profiles").appendChild(d)});
 $("#pathCheck").onclick=()=>{if(a.some(x=>!x))return fb("Choose a pathway for every cadet.","warn");let n=a.filter((x,i)=>x===profiles[i].best).length;if(n<4)return penalty((4-n)*65,`${n}/4 pathway matches aligned`);$("#pathRiddle").innerHTML=`<div class="taskbox"><h3>MENTAL BREAK // RIDDLE TOKEN 2</h3><div class="riddle">What goes up but never comes down?</div><input id="r2"><button id="r2b">UNLOCK TOKEN</button></div>`;$("#r2b").onclick=()=>{let v=$("#r2").value.trim().toLowerCase();if(!["age","your age","my age"].includes(v))return penalty(45,"Riddle answer rejected");riddleTokens.push("A");completeRoom("PATHWAY KEY // PATH • RIDDLE TOKEN // A","Four realistic pathways evaluated")}}
}

function finance(){
 const expenses=[["Rent",650,"NEED"],["Utilities",110,"NEED"],["Groceries",260,"NEED"],["Car insurance",180,"NEED"],["Gas for work/school",150,"NEED"],["Phone",85,"DEPENDS"],["Streaming services",64,"WANT"],["Restaurants",210,"WANT"],["Sneakers",170,"WANT"]];
 $("#work").innerHTML=`<div class="taskbox"><h3>PHASE 1 // NEED, WANT, OR DEPENDS?</h3><div id="finClass"></div><button id="finClassBtn">VERIFY CLASSIFICATION</button></div><div id="budgetPhase"></div>`;
 let a=Array(expenses.length).fill(null);expenses.forEach((x,i)=>{let row=document.createElement("div");row.className="classifyRow";row.innerHTML=`<span>${x[0]} <span class="money">$${x[1]}</span></span>`;["NEED","WANT","DEPENDS"].forEach(c=>{let b=document.createElement("button");b.textContent=c;b.onclick=()=>{a[i]=c;row.querySelectorAll("button").forEach(q=>q.classList.remove("selected"));b.classList.add("selected")};row.appendChild(b)});$("#finClass").appendChild(row)});
 $("#finClassBtn").onclick=()=>{if(a.some(x=>x===null))return fb("Classify every expense.","warn");let n=a.filter((x,i)=>x===expenses[i][2]).length;if(n<8)return penalty((9-n)*45,`${n}/9 classifications acceptable`);budget()};
 function budget(){
 $("#budgetPhase").innerHTML=`<div class="taskbox"><h3>PHASE 2 // CREATE $200 SAVINGS</h3><p class="instruction">Income is $1,850. Current spending is $1,879. Reduce adjustable expenses enough to erase the $29 deficit AND create at least $200 in savings.</p><table class="budgetTable"><tr><th>Item</th><th>Current</th><th>New</th></tr><tr><td>Phone</td><td>$85</td><td><input id="bp" type="number" value="85"></td></tr><tr><td>Streaming</td><td>$64</td><td><input id="bs" type="number" value="64"></td></tr><tr><td>Restaurants</td><td>$210</td><td><input id="br" type="number" value="210"></td></tr><tr><td>Sneakers</td><td>$170</td><td><input id="bsh" type="number" value="170"></td></tr></table><button id="budgetBtn">TEST BUDGET</button></div><div id="creditPhase"></div>`;
 $("#budgetBtn").onclick=()=>{let old=[85,64,210,170],ids=["#bp","#bs","#br","#bsh"];let nv=ids.map((id,i)=>Math.min(old[i],Math.max(0,+$(id).value||0)));let cuts=old.reduce((s,x,i)=>s+(x-nv[i]),0),savings=cuts-29;if(savings<200)return penalty(55,`Plan creates only $${Math.max(0,savings)} savings`);credit()};
 }
 function credit(){
 $("#creditPhase").innerHTML=`<div class="taskbox"><h3>PHASE 3 // CREDIT IS NOT CASH</h3><p>Limit $1,000 • Balance $820 • Available credit $180 • Minimum payment $35. You want to charge $150 sneakers.</p><button class="option" id="ca">Charge them; available credit means you can afford them.</button><button class="option" id="cb">Do not treat available credit as available money; this adds debt to an already high balance.</button><button class="option" id="cc">Open another card.</button></div><div id="futurePhase"></div>`;
 $("#ca").onclick=()=>penalty(90,"Available credit is borrowing capacity, not affordability");$("#cc").onclick=()=>penalty(90,"A second card does not solve the affordability problem");
 $("#cb").onclick=()=>{$("#futurePhase").innerHTML=`<div class="taskbox"><h3>PHASE 4 // PAY YOURSELF FIRST</h3><div class="riddle">I am money you spend on someone you have not met yet. That person has your name, your birthday, and your dreams. Spend everything today and I disappear. Protect me first and tomorrow becomes easier. Who am I paying?</div><input id="fs"><button id="fsb">VERIFY</button></div>`;$("#fsb").onclick=()=>{let v=$("#fs").value.trim().toLowerCase();if(!["future self","my future self","your future self"].includes(v))return penalty(45,"Finance riddle rejected");completeRoom("FINANCE KEY // 200","Budget rebuilt, credit risk identified, future self funded")}}
 }
}

function leadership(){
 const colleges=[
 ["UNIVERSITY A","Desired major • prestigious • $29,000/year net cost • farther from home"],
 ["UNIVERSITY B","Strong desired program • $13,500/year net cost • ROTC available • closer to home"],
 ["UNIVERSITY C","Full scholarship • friends attending • DOES NOT offer desired major"]];
 let choice=null;
 $("#work").innerHTML=`<div class="taskbox"><h3>PHASE 1 // THREE ACCEPTANCE LETTERS</h3><div id="collegeGrid" class="collegeGrid"></div><textarea id="why" placeholder="Defend your choice in 3–5 sentences using cost, career fit, values, opportunity, or long-term consequences."></textarea><button id="leadBtn">LOCK INITIAL DECISION</button></div><div id="twist"></div>`;
 colleges.forEach((c,i)=>{let d=document.createElement("div");d.className="college";d.innerHTML=`<h3>${c[0]}</h3><p>${c[1]}</p><button>SELECT</button>`;d.querySelector("button").onclick=()=>{choice=i;document.querySelectorAll(".college").forEach(x=>x.classList.remove("selected"));d.classList.add("selected")};$("#collegeGrid").appendChild(d)});
 $("#leadBtn").onclick=()=>{let txt=$("#why").value.trim().toLowerCase();if(choice===null)return fb("Select a university.","warn");if(txt.length<100)return fb("Defend the choice in more detail.","warn");let hits=["cost","major","career","rotc","debt","value","future","opportunity","scholar","long"].filter(k=>txt.includes(k)).length;if(hits<2)return penalty(70,"Defense needs clearer tradeoff analysis");twist()};
 function twist(){
 $("#twist").innerHTML=`<div class="intelUpdate"><b>INTELLIGENCE UPDATE:</b> University B awards an additional $6,000/year scholarship, reducing net cost to $7,500.</div><div class="taskbox"><h3>PHASE 2 // ADAPT OR HOLD?</h3><select id="change"><option value="">SELECT</option><option>YES — I WOULD CHANGE</option><option>NO — I WOULD HOLD</option></select><textarea id="changeWhy" placeholder="Explain what information now matters and why."></textarea><button id="changeBtn">SUBMIT FINAL DECISION</button></div>`;
 $("#changeBtn").onclick=()=>{let txt=$("#changeWhy").value.trim().toLowerCase();if(!$("#change").value)return fb("Choose whether your recommendation changes.","warn");if(txt.length<90)return fb("Explain your reasoning in more detail.","warn");let hits=["cost","career","major","debt","value","opportunity","scholar","goal","fit","future"].filter(k=>txt.includes(k)).length;if(hits<2)return penalty(70,"Final explanation needs clearer tradeoff analysis");completeRoom("LEADERSHIP KEY // OWNIT","College choice defended and re-evaluated after new information")}
 }
}

function finalRoom(){
 $("#work").innerHTML=`<div class="taskbox"><h3>CHECKPOINT // FINAL RIDDLE TOKEN</h3><div class="riddle">Two fathers and two sons go fishing. They catch three fish and each gets one. How is this possible?</div><input id="r3"><button id="r3b">VERIFY RIDDLE</button></div><div id="extract"></div>`;
 $("#r3b").onclick=()=>{let v=$("#r3").value.trim().toLowerCase();let ok=(v.includes("grandfather")&&v.includes("father")&&v.includes("son"))||v.includes("three people");if(!ok)return penalty(45,"Riddle explanation rejected");riddleTokens.push("3");sequence()};
 function sequence(){
 let items=["MONEY","VALUES","DECISION","PATHWAY"],correct=["VALUES","PATHWAY","MONEY","DECISION"];items.sort(()=>Math.random()-.5);
 $("#extract").innerHTML=`<div class="taskbox"><h3>PHASE 1 // BUILD THE FUTURE</h3><div class="riddle">A destination is useless without direction. Money without discipline disappears. A decision without character can betray the person making it. Arrange the four concepts in the order a future should be built.</div><div id="seq"></div><button id="seqCheck">VERIFY SEQUENCE</button></div><div id="codePhase"></div>`;
 function draw(){let s=$("#seq");s.innerHTML="";items.forEach((x,i)=>{let d=document.createElement("div");d.className="seqitem";d.innerHTML=`<span>${i+1}. ${x}</span><div><button data-u="${i}">▲</button><button data-d="${i}">▼</button></div>`;s.appendChild(d)});s.querySelectorAll("[data-u]").forEach(b=>b.onclick=()=>{let i=+b.dataset.u;if(i){[items[i-1],items[i]]=[items[i],items[i-1]];draw()}});s.querySelectorAll("[data-d]").forEach(b=>b.onclick=()=>{let i=+b.dataset.d;if(i<items.length-1){[items[i+1],items[i]]=[items[i],items[i+1]];draw()}})}draw();
 $("#seqCheck").onclick=()=>{if(JSON.stringify(items)!==JSON.stringify(correct))return penalty(85,"Future-building sequence rejected");code()};
 }
 function code(){
 $("#codePhase").innerHTML=`<div class="taskbox"><h3>PHASE 2 // FINAL EXTRACTION TERMINAL</h3><div class="codebox">USE YOUR INVENTORY.<br><br>1. LAST TWO digits of ARMY KEY<br>2. LAST TWO digits of CADET KEY<br>3. PATHWAY KEY<br>4. FINANCE KEY<br>5. LEADERSHIP KEY<br>6. Three riddle tokens IN THE ORDER EARNED<br><br>NO SPACES. NO DASHES.</div><input id="finalCode"><button id="finalBtn">RECOVER BRIEFING</button></div>`;
 let answer="7516PATH200OWNIT"+riddleTokens.join("");
 $("#finalBtn").onclick=()=>{let v=$("#finalCode").value.trim().toUpperCase().replace(/[^A-Z0-9]/g,"");if(v!==answer)return penalty(110,"Extraction code rejected");completeRoom("FUTURE READINESS BRIEFING // RECOVERED","All six readiness systems restored")}
 }
}

function finish(){clearInterval(timer);screen("complete");hud();$("#aar").innerHTML=`<div class="aarbox">CALLSIGN: ${callsign.toUpperCase()}<br>TIME REMAINING: ${fmt(time)}<br>READINESS SCORE: ${score}<br>HINTS USED: ${hints}<br>RIDDLE TOKENS: ${riddleTokens.join(" • ")}<br>ROOMS CLEARED: 6/6<br><br>STATUS: FUTURE READY</div>`}
hud();inv();