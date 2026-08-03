const DATA = {"3": [{"title": "Hallway 214", "brief": "You arrive after a bullying incident has already begun. A student is filming; the targeted student says this has happened before.", "tasks": [{"type": "classify", "title": "Evidence Triage", "items": ["You personally saw a student filming.", "The accused student has bullied the target for months.", "The target said, “I've told them to stop.”", "The target started today's incident."], "answers": ["FACT", "UNKNOWN", "FACT", "UNKNOWN"]}, {"type": "multi", "title": "Immediate Action", "prompt": "Choose exactly 3 actions justified right now.", "options": ["Get appropriate adult help", "Safely interrupt without physical escalation", "Seize the student's phone", "Check on the targeted student", "Post names online", "Promise secrecy"], "correct": [0, 1, 3], "count": 3}, {"type": "decision", "title": "Witness Claim", "prompt": "A witness says, “He does this every day.” What is the strongest response?", "options": ["Treat it as proven history", "Record it as a claim requiring corroboration", "Ignore it completely", "Ask the witness to post it online"], "best": 1}, {"type": "order", "title": "Follow-Through", "prompt": "Rank the actions.", "items": ["Document/report what you directly observed", "Check immediate safety", "Separate rumor from evidence", "Follow up through proper adult channel"], "answer": [1, 2, 0, 3]}, {"type": "defend", "title": "Leadership Defense", "prompt": "Why must a leader separate observation from allegation?", "keywords": ["fact", "fair", "evidence", "trust", "accur"]}]}, {"title": "Closing Shift", "brief": "At a fictional fast-food restaurant, an employee reports repeated discriminatory comments. The accused employee denies it; a customer recorded only the final argument.", "tasks": [{"type": "order", "title": "First Four Moves", "prompt": "Rank the first four actions.", "items": ["Reach manager", "Stabilize/separate conflict", "Preserve relevant information", "Delegate customer flow"], "answer": [1, 3, 0, 2]}, {"type": "classify", "title": "Video Limits", "items": ["Video shows final 18 seconds", "Video proves weeks of harassment", "Customer had a limited recording window", "Accused employee is guilty because clip looks bad"], "answers": ["FACT", "INFERENCE", "FACT", "INFERENCE"]}, {"type": "multi", "title": "Evidence Choice", "prompt": "Choose exactly 3 strongest evidence sources.", "options": ["Full available video", "Employees actually present", "Drive-through metric", "Prior relevant documented complaints", "Online strangers", "Rumor from off-duty worker"], "correct": [0, 1, 3], "count": 3}, {"type": "decision", "title": "Friendship Bias", "prompt": "Your friend is the accused employee. What is the strongest action?", "options": ["Protect your friend", "Recognize bias risk and support fair manager-led process", "Automatically believe the complainant", "Refuse to assist with anything"], "best": 1}, {"type": "defend", "title": "Manager Mindset", "prompt": "Why is keeping the line moving not enough?", "keywords": ["people", "safety", "fair", "trust", "conduct"]}]}, {"title": "The 22-Second Video", "brief": "You witness only the end of a controversial police encounter. The recording begins after physical contact has already started.", "tasks": [{"type": "classify", "title": "Know vs Assume", "items": ["Recording begins after contact", "Civilian attacked first", "Force is visible in the clip", "Earlier officer actions were lawful"], "answers": ["FACT", "UNKNOWN", "FACT", "UNKNOWN"]}, {"type": "order", "title": "Responsible Witnessing", "prompt": "Rank the actions.", "items": ["Avoid unsupported public claims", "Observe safely", "Seek appropriate help if danger exists", "Report what you actually observed"], "answer": [1, 2, 3, 0]}, {"type": "decision", "title": "Viral Claim", "prompt": "A friend posts “WE SAW EVERYTHING.” What is strongest?", "options": ["Share it", "Correct the overstatement", "Add your theory", "Say video proves entire event"], "best": 1}, {"type": "multi", "title": "Corroboration", "prompt": "Choose 3 useful sources.", "options": ["Independent recording of missing period", "Witness with clear view", "More reposts", "Reliable time-stamped records", "Online poll"], "correct": [0, 1, 3], "count": 3}, {"type": "defend", "title": "Act Under Uncertainty", "prompt": "Explain why incomplete evidence does not mean do nothing.", "keywords": ["safe", "report", "observe", "evidence", "fact"]}]}, {"title": "The Star Performer", "brief": "Your best competition performer humiliates a quieter cadet. Two cadets say they stopped offering ideas because they expect ridicule. Competition is tomorrow.", "tasks": [{"type": "multi", "title": "Long-Term Risk", "prompt": "Choose 3 risks beyond tomorrow's score.", "options": ["Team trust", "Willingness to speak", "Retention/development", "Social followers", "Uniform inventory"], "correct": [0, 1, 2], "count": 3}, {"type": "decision", "title": "Delay Until After Competition?", "prompt": "Captain says wait until after competition.", "options": ["Agree because performance comes first", "Recognize delay may teach that results excuse misconduct", "Remove cadet permanently without review", "Ignore complaints"], "best": 1}, {"type": "order", "title": "Intervention Sequence", "prompt": "Rank the response.", "items": ["Monitor retaliation/climate", "Address conduct", "Document/report appropriately", "Check on affected cadets"], "answer": [1, 3, 2, 0]}, {"type": "classify", "title": "Signal vs Proof", "items": ["Two cadets report reduced participation", "Reduced participation proves bullying caused every problem", "Competition performance is high", "High performance means conduct complaints are false"], "answers": ["FACT", "INFERENCE", "FACT", "INFERENCE"]}, {"type": "defend", "title": "Tradeoff", "prompt": "Defend addressing conduct before competition.", "keywords": ["trust", "standard", "climate", "team", "long"]}]}, {"title": "LET 3 Crisis Room", "brief": "At an away event: one cadet is unaccounted for, another reports bullying, a parent posts a false accusation online, and buses leave in seven minutes. You are not the adult in charge.", "tasks": [{"type": "multi", "title": "Your Authority", "prompt": "Choose exactly 3 actions within your role.", "options": ["Notify responsible adult about missing cadet", "Hold disciplinary hearing", "Assist accountability", "Argue online", "Support reporting cadet/preserve info", "Promise outcomes"], "correct": [0, 2, 4], "count": 3}, {"type": "order", "title": "Priority Under Pressure", "prompt": "Rank the issues.", "items": ["Correct online rumors", "Missing cadet accountability", "Immediate safety", "Accurate information for instructor"], "answer": [2, 1, 3, 0]}, {"type": "decision", "title": "Bus Deadline", "prompt": "Driver pressures the group to leave.", "options": ["Leave to protect schedule", "Safe accountability controls; elevate to responsible adult", "Vote", "Leave one cadet behind"], "best": 1}, {"type": "classify", "title": "Authority Check", "items": ["You can assist accountability", "You can independently punish a cadet", "You should report safety concerns", "You can promise the parent's desired outcome"], "answers": ["FACT", "UNKNOWN", "FACT", "UNKNOWN"]}, {"type": "defend", "title": "Final Defense", "prompt": "What separates a leader from a person who simply reacts quickly?", "keywords": ["fact", "consequence", "respons", "prior", "evidence"]}]}], "4": [{"title": "Complaint Before Competition", "brief": "A cadet reports months of bullying and retaliation by two high performers. One accused cadet is essential tomorrow and is the child of a prominent supporter. Screenshots are cropped.", "tasks": [{"type": "classify", "title": "Evidence Discipline", "items": ["Cropped screenshot contains insulting language", "Screenshot proves entire relationship", "Two independent cadets report similar conduct", "Supporter relationship proves favoritism"], "answers": ["FACT", "INFERENCE", "FACT", "UNKNOWN"]}, {"type": "multi", "title": "Interim Controls", "prompt": "Choose exactly 3 defensible immediate controls.", "options": ["Protect against retaliation", "Preserve evidence/gaps", "Declare guilt publicly", "Appropriate separation/supervision", "Guarantee competition role", "Ask supporter permission"], "correct": [0, 1, 3], "count": 3}, {"type": "decision", "title": "Supporter Pressure", "prompt": "Supporter calls demanding complaint disappear.", "options": ["Comply", "Document pressure and preserve fair process through proper authority", "Publicly shame supporter", "Promise a result"], "best": 1}, {"type": "order", "title": "Senior-Leader Sequence", "prompt": "Rank the response.", "items": ["Assess immediate retaliation risk", "Preserve evidence", "Recommend interim controls", "Brief responsible instructor with knowns/unknowns"], "answer": [0, 1, 2, 3]}, {"type": "defend", "title": "Command Recommendation", "prompt": "Defend a recommendation that may reduce tomorrow's performance.", "keywords": ["trust", "standard", "retali", "fair", "process", "climate"]}]}, {"title": "Restaurant Crisis", "brief": "You manage a fictional restaurant. A discrimination complaint involves your strongest supervisor. Two witnesses partially corroborate it. You're 25% understaffed. District manager texts: “Keep this quiet and hit the numbers.”", "tasks": [{"type": "order", "title": "Executive Sequence", "prompt": "Rank first priorities.", "items": ["Preserve evidence", "Stabilize/separate as appropriate", "Delegate operations", "Follow required management process"], "answer": [1, 2, 0, 3]}, {"type": "multi", "title": "Choose Four Data Points", "prompt": "Choose exactly 4.", "options": ["Full available video", "Present witness statements", "Sales dashboard", "Prior relevant complaints", "Employee schedule", "Anonymous comments", "Popularity score"], "correct": [0, 1, 3, 4], "count": 4}, {"type": "decision", "title": "Pressure From Above", "prompt": "How should “keep this quiet” affect you?", "options": ["It overrides process", "Treat it as pressure; follow legitimate policy, safety, fair process and documentation", "Publish the text", "Ignore all management relationships"], "best": 1}, {"type": "classify", "title": "Operational Evidence", "items": ["Store is understaffed", "Understaffing proves the complaint is false", "Supervisor is productive", "Productivity grants immunity from conduct standards"], "answers": ["FACT", "UNKNOWN", "FACT", "INFERENCE"]}, {"type": "defend", "title": "Competing Duties", "prompt": "Explain how to protect both operations and employees.", "keywords": ["delegate", "safety", "operation", "fair", "process", "document"]}]}, {"title": "Use-of-Force Review", "brief": "A civic review simulation includes a video starting 31 seconds late, a partially obstructed witness, a later-arriving witness, an officer report, and a viral quote appearing nowhere in supplied evidence.", "tasks": [{"type": "classify", "title": "Source Boundaries", "items": ["Video shows events after recording starts", "Video proves missing 31 seconds", "Witness 1 had partial obstruction", "Viral quote is established"], "answers": ["FACT", "UNKNOWN", "FACT", "UNKNOWN"]}, {"type": "order", "title": "Reconstruction Method", "prompt": "Rank the analytical process.", "items": ["Identify contradictions/gaps", "Build source timeline", "State confidence/unknowns", "Compare claims to corroboration"], "answer": [1, 0, 3, 2]}, {"type": "multi", "title": "Confidence Builders", "prompt": "Choose exactly 3.", "options": ["Independent recording of missing period", "Clear-view witness", "More reposts", "Reliable time-stamped records", "Class poll"], "correct": [0, 1, 3], "count": 3}, {"type": "decision", "title": "Panel Pressure", "prompt": "Chair asks for conclusion before all evidence is reviewed.", "options": ["Give certainty anyway", "State provisional findings, limits and next evidence needed", "Refuse to discuss anything", "Follow social media consensus"], "best": 1}, {"type": "defend", "title": "Brief the Panel", "prompt": "State what is established, disputed, and what should happen next.", "keywords": ["establish", "unknown", "evidence", "review", "corrobor", "fact"]}]}, {"title": "Command Climate Failure", "brief": "Top cadet leader produces exceptional results. Four cadets independently report humiliation and retaliation. Junior attendance fell 18%. Competition results improved.", "tasks": [{"type": "classify", "title": "Signal or Proof?", "items": ["Four independent complaints form a pattern requiring attention", "18% decline proves retaliation caused every absence", "Competition results improved", "Leader's denial proves complaints false"], "answers": ["FACT", "INFERENCE", "FACT", "INFERENCE"]}, {"type": "multi", "title": "System Questions", "prompt": "Choose exactly 4.", "options": ["Are complaints independently consistent?", "Evidence of retaliation?", "Attendance/retention pattern?", "Trophies won?", "Standards applied consistently?", "Popularity?"], "correct": [0, 1, 2, 4], "count": 4}, {"type": "decision", "title": "Hard Tradeoff", "prompt": "Removing leader may reduce competition performance.", "options": ["Never risk performance", "Remove solely because complaints exist", "Use evidence/authority for interim or accountability action while weighing climate and mission risk", "Always wait until after competition"], "best": 2}, {"type": "order", "title": "Climate Review", "prompt": "Rank the response.", "items": ["Protect against retaliation", "Assess corroboration/pattern", "Apply proper authority/process", "Monitor climate after action"], "answer": [0, 1, 2, 3]}, {"type": "defend", "title": "Second-Order Effect", "prompt": "What does exemption for a high performer teach the organization?", "keywords": ["trust", "standard", "report", "retali", "climate", "immun"]}]}, {"title": "Strategic Crisis Cell", "brief": "3:05 PM: cadet unaccounted for off-campus; credible retaliation complaint; parent posts false injury claim; buses depart in 12 minutes; instructor handles a separate medical issue. You have three cadet leaders.", "tasks": [{"type": "multi", "title": "Allocate Three Leaders", "prompt": "Choose exactly 3 immediate delegated efforts.", "options": ["Accountability/search support under adult direction", "Fight parent online", "Preserve retaliation information/protection", "Prepare transportation/accountability status", "Recruiting flyer"], "correct": [0, 2, 3], "count": 3}, {"type": "order", "title": "Strategic Priority", "prompt": "Rank the issues.", "items": ["Reputation response", "Safety/accountability", "Retaliation process integrity", "Transportation coordination"], "answer": [1, 2, 3, 0]}, {"type": "decision", "title": "$600 Bus Cost", "prompt": "Late departure costs $600 while a cadet remains unaccounted for.", "options": ["Depart anyway", "Safe accountability controls; coordinate delay through adults and document cost", "Vote", "Leave a cadet leader behind"], "best": 1}, {"type": "classify", "title": "Crisis Facts", "items": ["A cadet is unaccounted for", "The parent post is false based on currently verified information", "The missing cadet intentionally left", "Delay has an operational cost"], "answers": ["FACT", "FACT", "UNKNOWN", "FACT"]}, {"type": "defend", "title": "Executive Defense", "prompt": "Defend accepting transportation cost and delaying public response.", "keywords": ["safety", "account", "retali", "risk", "fact", "trust", "cost", "authority"]}]}]};

const $ = (s) => document.querySelector(s);
let rooms = [];
let level = "3";
let caseIndex = 0;
let taskIndex = 0;
let score = 3000;
let seconds = 3600;
let hints = 0;
let evidence = [];
let log = [];
let timer = null;
let locked = false;

function showScreen(id) {
  document.querySelectorAll(".screen").forEach(el => el.classList.remove("active"));
  $("#" + id).classList.add("active");
}

function formatTime(s) {
  const m = Math.floor(s / 60);
  const sec = String(s % 60).padStart(2, "0");
  return m + ":" + sec;
}

function updateHud() {
  $("#time").textContent = formatTime(Math.max(0, seconds));
  $("#score").textContent = Math.max(0, score);
  $("#caseNo").textContent = (caseIndex + 1) + "/5";
}

function setFeedback(html, kind="") {
  const el = $("#feedback");
  el.className = "feedback " + kind;
  el.innerHTML = html;
}

function lockTask() {
  locked = true;
  $("#task").querySelectorAll("button").forEach(b => b.disabled = true);
}

function commit(loss, summary) {
  if (locked) return;
  lockTask();
  score = Math.max(0, score - loss);
  log.push("Case " + (caseIndex + 1) + ": " + summary + (loss ? " (−" + loss + ")" : ""));
  updateHud();
  setFeedback("<b>" + summary + "</b>" + (loss ? " • −" + loss : "") + "<div class='consequence'>Decision locked. You move forward with the consequences of your judgment.</div>", loss ? "warn" : "good");
  setTimeout(nextTask, 1000);
}

function renderCaseStrip() {
  $("#caseStrip").innerHTML = rooms.map((r,i) => {
    let cls = "casePill";
    if (i < caseIndex) cls += " done";
    if (i === caseIndex) cls += " current";
    return "<div class='" + cls + "'>" + (i < caseIndex ? "✓ CASE " : "CASE ") + (i + 1) + "</div>";
  }).join("");
}

function render() {
  locked = false;
  $("#drawer").classList.add("hidden");
  renderCaseStrip();
  const room = rooms[caseIndex];
  const task = room.tasks[taskIndex];
  $("#caseLabel").textContent = "LET " + level + " • CASE " + (caseIndex + 1) + " • DECISION " + (taskIndex + 1) + "/5";
  $("#caseTitle").textContent = room.title;
  $("#brief").textContent = room.brief;
  $("#feedback").className = "";
  $("#feedback").innerHTML = "";
  $("#hint").disabled = false;
  updateHud();
  drawTask(task);
}

function drawTask(task) {
  const box = $("#task");
  box.innerHTML = "<h3 class='taskTitle'>" + task.title + "</h3>";

  if (task.type === "decision") {
    box.innerHTML += "<p>" + task.prompt + "</p>";
    task.options.forEach((option, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "choice";
      b.textContent = option;
      b.addEventListener("click", () => {
        const loss = i === task.best ? 0 : 150;
        commit(loss, i === task.best ? "Strong judgment" : "Decision accepted with leadership risk");
      });
      box.appendChild(b);
    });
    return;
  }

  if (task.type === "classify") {
    const answers = Array(task.items.length).fill(null);
    task.items.forEach((item, rowIndex) => {
      const row = document.createElement("div");
      row.className = "classRow";
      const strong = document.createElement("strong");
      strong.textContent = item;
      row.appendChild(strong);

      ["FACT","CLAIM","INFERENCE","UNKNOWN"].forEach(category => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "classifyBtn";
        b.textContent = category;
        b.addEventListener("click", () => {
          answers[rowIndex] = category;
          row.querySelectorAll(".classifyBtn").forEach(x => x.classList.remove("selected"));
          b.classList.add("selected");
        });
        row.appendChild(b);
      });
      box.appendChild(row);
    });

    const commitBtn = document.createElement("button");
    commitBtn.type = "button";
    commitBtn.textContent = "COMMIT CLASSIFICATION";
    commitBtn.addEventListener("click", () => {
      if (answers.some(v => v === null)) {
        setFeedback("Classify every statement before committing.", "warn");
        return;
      }
      const correct = answers.filter((v,i) => v === task.answers[i]).length;
      const loss = (task.answers.length - correct) * 80;
      commit(loss, correct + "/" + task.answers.length + " evidence classifications correct");
    });
    box.appendChild(commitBtn);
    return;
  }

  if (task.type === "multi") {
    box.innerHTML += "<p>" + task.prompt + "</p><p>Select exactly <b>" + task.count + "</b>.</p>";
    const selected = [];
    task.options.forEach((option,i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "choice";
      b.textContent = option;
      b.addEventListener("click", () => {
        const at = selected.indexOf(i);
        if (at >= 0) {
          selected.splice(at,1);
          b.classList.remove("selected");
        } else if (selected.length < task.count) {
          selected.push(i);
          b.classList.add("selected");
        }
      });
      box.appendChild(b);
    });
    const commitBtn = document.createElement("button");
    commitBtn.type = "button";
    commitBtn.textContent = "COMMIT SELECTION";
    commitBtn.addEventListener("click", () => {
      if (selected.length !== task.count) {
        setFeedback("Select exactly " + task.count + " actions.", "warn");
        return;
      }
      const hit = selected.filter(i => task.correct.includes(i)).length;
      commit((task.count-hit)*100, hit + "/" + task.count + " priority actions aligned");
    });
    box.appendChild(commitBtn);
    return;
  }

  if (task.type === "order") {
    box.innerHTML += "<p>" + task.prompt + "</p><p>Click every item in the order you would execute it.</p>";
    const selected = [];
    const preview = document.createElement("div");
    preview.className = "orderPreview";
    task.items.forEach((item,i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "rankBtn";
      b.textContent = item;
      b.addEventListener("click", () => {
        if (selected.includes(i)) return;
        selected.push(i);
        b.classList.add("selected");
        b.textContent = selected.length + ". " + item;
        preview.textContent = selected.map((x,j) => (j+1) + ". " + task.items[x]).join("  →  ");
      });
      box.appendChild(b);
    });
    box.appendChild(preview);
    const reset = document.createElement("button");
    reset.type = "button";
    reset.className = "secondary";
    reset.textContent = "RESET ORDER";
    reset.addEventListener("click", () => drawTask(task));
    box.appendChild(reset);
    const commitBtn = document.createElement("button");
    commitBtn.type = "button";
    commitBtn.textContent = "COMMIT ORDER";
    commitBtn.addEventListener("click", () => {
      if (selected.length !== task.items.length) {
        setFeedback("Rank every item before committing.", "warn");
        return;
      }
      const hit = selected.filter((v,i) => v === task.answer[i]).length;
      commit((task.items.length-hit)*70, hit + "/" + task.items.length + " priorities in strongest position");
    });
    box.appendChild(commitBtn);
    return;
  }

  if (task.type === "defend") {
    box.innerHTML += "<p>" + task.prompt + "</p>";
    const ta = document.createElement("textarea");
    ta.placeholder = "Write 2–4 sentences. Address evidence, priorities, tradeoffs, or consequences.";
    box.appendChild(ta);
    const commitBtn = document.createElement("button");
    commitBtn.type = "button";
    commitBtn.textContent = "SUBMIT DEFENSE";
    commitBtn.addEventListener("click", () => {
      const v = ta.value.trim().toLowerCase();
      if (v.length < 55) {
        setFeedback("Your defense is too brief. Explain your reasoning.", "warn");
        return;
      }
      const hits = task.keywords.filter(k => v.includes(k)).length;
      commit(hits >= 2 ? 0 : hits === 1 ? 100 : 200, hits >= 2 ? "Reasoned leadership defense" : "Defense needs stronger analysis");
    });
    box.appendChild(commitBtn);
  }
}

function nextTask() {
  taskIndex++;
  if (taskIndex >= 5) {
    evidence.push("Case " + (caseIndex+1) + " completed: " + rooms[caseIndex].title);
    caseIndex++;
    taskIndex = 0;
  }
  if (caseIndex >= rooms.length) finish();
  else render();
}

function finish() {
  if (timer) clearInterval(timer);
  $("#hud").classList.add("hidden");
  showScreen("finish");
  $("#finalWho").textContent = $("#player").value.trim() + " • LET " + level;
  $("#summary").innerHTML = "<h2>" + Math.max(0,score) + " JUDGMENT POINTS</h2><p>" + hints + " hints used • " + formatTime(Math.max(0,seconds)) + " remaining</p><hr><p>" + log.slice(-10).join("<br>") + "</p>";
}

$("#begin").addEventListener("click", () => {
  const name = $("#player").value.trim();
  if (!name) {
    alert("Enter a cadet or team name.");
    return;
  }
  level = $("#level").value;
  rooms = DATA[level];
  showScreen("game");
  $("#hud").classList.remove("hidden");
  render();
  timer = setInterval(() => {
    seconds--;
    updateHud();
    if (seconds <= 0) finish();
  },1000);
});

$("#hint").addEventListener("click", () => {
  score = Math.max(0, score - 125);
  hints++;
  updateHud();
  $("#hint").disabled = true;
  setFeedback("ANALYST HINT: Separate known facts from assumptions. Identify who is at risk, what authority you actually have, and the second-order consequence. −125", "warn");
});

$("#caseFileBtn").addEventListener("click", () => {
  const d = $("#drawer");
  d.classList.toggle("hidden");
  d.innerHTML = "<h3>CASE FILE</h3>" + (evidence.length ? evidence.map(x => "<div class='entry'>" + x + "</div>").join("") : "<p>No completed cases yet.</p>");
});

$("#decisionLogBtn").addEventListener("click", () => {
  const d = $("#drawer");
  d.classList.toggle("hidden");
  d.innerHTML = "<h3>DECISION LOG</h3>" + (log.length ? log.map(x => "<div class='entry'>" + x + "</div>").join("") : "<p>No committed decisions yet.</p>");
});

updateHud();
