(function(){
  var $=function(q,r){return Array.prototype.slice.call((r||document).querySelectorAll(q))};
  var el=function(t,c,h){var e=document.createElement(t);if(c)e.className=c;if(h!=null)e.innerHTML=h;return e};
  var store={get:function(k){try{return JSON.parse(localStorage.getItem(k))}catch(_){return null}},set:function(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(_){}}};
  var TEAM=['Inga Plati','Anele','Olona Williams','Mpho','Result Mhlongo'];
  
    // Stories: user, want, so, criteria, tasks [text, owner], req, uat
    var STORIES=[
     {id:'US-01',u:'Resident',want:'take or upload a photo of a hazard',so:'I can report it without writing a long description',pb:'PB-01',uat:'UAT-01 to UAT-04',
      ac:['Accepts JPEG, PNG or WebP up to 10 MB','Camera capture, drag and drop and upload all work','A clear photo moves on to the review step'],
      tasks:[['Build photo upload and camera capture','Mpho (Frontend)'],['Validate file type and size','Anele (Backend)'],['Test with 4 hazard photos','Result (Testing)']]},
     {id:'US-02',u:'Resident',want:'confirm where the hazard is, even if my photo has no GPS',so:'the crew can find it',pb:'PB-03',uat:'UAT-07',
      ac:['Location read from photo, then browser, then map pin','Submission is blocked until a location is confirmed','Map link is shown on the review screen'],
      tasks:[['Read GPS from photo metadata','Anele (Backend)'],['Add browser location and draggable map pin (Leaflet)','Mpho (Frontend)'],['Test a photo with no GPS','Result (Testing)']]},
     {id:'US-03',u:'Resident',want:'see if the hazard is already reported nearby',so:'I confirm it instead of filing a duplicate',pb:'PB-04',uat:'UAT-08, UAT-09',
      ac:['Open tickets of the same type within 250 m are shown','Ticket number, status, distance and confirmed count are shown','Confirming raises the count and creates no new ticket'],
      tasks:[['Write the 250 m duplicate search','Anele (Backend)'],['Build the duplicate card and confirm button','Mpho (Frontend)'],['Run UAT-08 and UAT-09','Result (Testing)']]},
     {id:'US-04',u:'Resident',want:'follow my report from Received to Resolved',so:'I know someone is fixing it',pb:'PB-06',uat:'UAT-12',
      ac:['My Reports shows counts, search and status filters','Statuses: Received, Verified, Assigned, In Progress, Resolved, Rejected','Filtering shows only matching reports and the counts agree'],
      tasks:[['Design the My Reports table and filters','Mpho (Frontend)'],['Store status history','Anele (Backend)'],['Run UAT-12','Result (Testing)']]},
     {id:'US-05',u:'Dispatcher',want:'work from a live queue sorted by urgency',so:'dangerous hazards are handled first',pb:'PB-07',uat:'UAT-11',
      ac:['Tickets grouped as At risk, Needs a crew, Crew assigned','Opening a ticket shows status, severity, priority, nearest crew, residents affected and map','Overdue tickets are flagged'],
      tasks:[['Build the staff queue screen','Mpho (Frontend)'],['Calculate the priority score and ordering','Anele (Backend)'],['Run UAT-11','Result (Testing)']]},
     {id:'US-06',u:'Field crew',want:'see the tickets assigned to me and where they are',so:'I go to the right place first time',pb:'PB-08',uat:'UAT-11',
      ac:['Tickets are auto-assigned to the nearest crew','Crew positions show on a map'],
      tasks:[['Add nearest-crew assignment','Anele (Backend)'],['Build the crew map','Mpho (Frontend)']]},
     {id:'US-07',u:'Department manager',want:'filter hazards on a map by department and status',so:'I can plan crews and budgets by risk',pb:'PB-07',uat:'UAT-11',
      ac:['Map can be filtered by department and status','Open-ticket counts per department are visible'],
      tasks:[['Add map filters','Mpho (Frontend)'],['Write the department counts query','Anele (Backend)']]},
     {id:'US-08',u:'Reviewer',want:'check low-confidence reports and override the label, severity or department',so:'wrong AI results never reach a crew unchecked',pb:'PB-11, PB-12',uat:'UAT-05, UAT-10',
      ac:['Reports under about 70% confidence go to a review queue','Staff can change label, severity or department','Every override is logged'],
      tasks:[['Add the 70% confidence rule','Anele (Backend)'],['Build the review queue and override button','Mpho (Frontend)'],['Run UAT-05 and UAT-10','Result (Testing)']]},
     {id:'US-09',u:'Resident',want:'have faces and number plates in my photo blurred',so:'bystanders’ privacy is protected',pb:'PB-16',uat:'(privacy check)',
      ac:['Faces and number plates are blurred','Unneeded photo metadata is removed','Name and contact details are optional'],
      tasks:[['Research blur options','Olona (Research)'],['Implement blur and metadata stripping','Anele (Backend)'],['Add the privacy notice (POPIA)','Inga (Group leader)']]},
     {id:'US-10',u:'Community member',want:'see local events and start a discussion',so:'I know what my neighbours are getting fixed',pb:'PB-09',uat:'UAT-13',
      ac:['Events and discussions are listed','A new post shows its title, category and area','Posts are moderated and carry no personal information'],
      tasks:[['Build the community page','Mpho (Frontend)'],['Write moderation rules','Olona (Research)'],['Run UAT-13','Result (Testing)']]},
     {id:'US-11',u:'Group leader',want:'have every task on one board with an owner and a status',so:'all five of us know what is next and nothing is lost',pb:'(team)',uat:'(team process)',
      ac:['All tasks sit on the Trello board with an owner','Sprint goal and Definition of Done are visible','Charter and logbook are kept up to date'],
      tasks:[['Set up the Trello board','Inga (Group leader)'],['Run sprint planning and retrospective','Inga (Group leader)'],['Update the logbook after each check-in','Inga (Group leader)']]}
    ];
  
    // Product backlog (ordered by rank)
    var PB=[
     ['PB-10','Live image classification replaces the example presets (US-01)','Must',13,'Planned','Docs 6.3, stage 4'],
     ['PB-11','Send reports under about 70% confidence to human review (US-08)','Must',5,'Planned','Docs 3.3'],
     ['PB-12','Staff override with an audit log (US-08)','Must',3,'Planned','Docs 3.3, UAT-10'],
     ['PB-13','Database persistence and server-generated ticket numbers','Must',8,'Planned','Docs 6.3, stage 5'],
     ['PB-15','Run UAT-01 to UAT-13 and record an issue list','Must',5,'Planned','Docs 7.1'],
     ['PB-14','Evaluate the model on at least 100 labelled photos','Must',8,'Planned','Docs 7'],
     ['PB-01','Photo capture and upload (US-01)','Must',3,'Demo built','FR: photo upload'],
     ['PB-02','Review screen: hazard, severity, location, department','Must',5,'Demo built','FR: classification, severity'],
     ['PB-03','Location capture: photo GPS, browser, map pin (US-02)','Must',5,'Demo built','FR: location capture'],
     ['PB-04','Duplicate check within 250 m (US-03)','Must',5,'Demo built','FR: duplicate detection'],
     ['PB-05','Ticket creation with civic priority score','Must',5,'Demo built','FR: ticket, priority'],
     ['PB-06','My Reports dashboard and status tracking (US-04)','Must',3,'Demo built','FR: status tracking'],
     ['PB-07','Staff live queue and map (US-05, US-07)','Must',8,'Demo built','FR: staff queue'],
     ['PB-18','Demo-mode and privacy notices','Must',1,'Demo built','Docs 3.3'],
     ['PB-17','Document how the priority score is calculated','Should',2,'Planned','Docs 4.4'],
     ['PB-16','Blur faces and number plates, strip metadata (US-09)','Should',5,'Planned','Docs 3.3, POPIA'],
     ['PB-08','Crew assignment and crew map (US-06)','Should',8,'Demo built','FR: crew assignment'],
     ['PB-09','Community page: events, discussions, polls (US-10)','Could',3,'Demo built','FR: community'],
     ['PB-19','Moderation of community posts','Could',3,'Planned','Docs 8.1'],
     ['PB-20','Connection to real municipal systems','Won\'t',21,'Not planned','Docs 6.3 (out of scope)']
    ];
  
    // Sprint tasks: id, text, owner, backlog item, start column (0 To do, 1 Doing, 2 Done)
    var SPRINT=[
     ['S1','Plan the sprint and agree the team charter (15 Oct)','Inga','(team)',2],
     ['S2','Research and hazard knowledge base','Olona','(research)',2],
     ['S3','Frontend screens and map: reporting flow, dashboard, staff queue, community','Mpho','PB-01 to PB-09',2],
     ['S4','Deploy the backend and web app to a live demo link','Anele','PB-13 (partly)',2],
     ['S5','Project documentation (15 Oct)','Inga','(docs)',2],
     ['S6','Presentation deck and script','Result, Inga','(presentation)',2],
     ['S7','Daily stand-ups, keep the team on track, help with the frontend','Inga','(team)',2],
     ['S8','Mock presentation and final presentation (19 Oct)','All','(presentation)',2],
     ['S9','Connect live image AI to the upload flow','Anele','PB-10',0],
     ['S10','Database persistence and server ticket numbers','Anele','PB-13',0],
     ['S11','Evaluate the model on 100+ labelled photos','Result','PB-14',0],
     ['S12','Run UAT-01 to UAT-13 and record an issue list','Result','PB-15',0]
    ];
    var COLS=['To do (carried over)','In progress','Done'];
  var WEEKS=[{"n": 1, "title": "25 September to 2 October 2026", "file": "Week1", "inprog": ["Research Existing Platforms (starts 3 Oct)"], "done": ["Define Project Objectives (card 1)", "Understand the Problem (card 2)", "Identify the Target Users (card 3)", "Define the Problem Statement (card 4)", "Identify the Project Goals (card 5)", "Discuss the Proposed Solution (card 6)"], "walk": [["Define the objectives, understand the problem and identify the target users", "Define the problem statement and the project goals", "Discuss the proposed solution", "Do the Coursera AI certificate courses", "Prepare mini presentations and a quiz; meet our mentor"], ["No, all tasks are aligned with the taskboard."], ["Agree the problem statement, the goals and the proposed solution"], ["Connectivity issues at CAPACITI (every Monday); daily work could not be completed (Monday 28 September)"]], "days": [["Friday", "25-09-2026", ["Joined the team and prepared for the project", "Started my Coursera AI course"], ["Define the project objectives (card 1)", "Discuss problems affecting our local community"], ["None"]], ["Monday", "28-09-2026", ["Identified common civic issues in public areas with the team (card 1)", "Defined the project objectives"], ["Understand the problem in more detail (card 2)", "Discuss possible causes of civic issues"], ["Connectivity issues at CAPACITI (every Monday); daily work could not be completed"]], ["Tuesday", "29-09-2026", ["Discussed possible causes of civic issues (card 2)"], ["Finish understanding the problem", "Identify the target users for our web application (card 3)", "Consider community representatives"], ["None"]], ["Wednesday", "30-09-2026", ["Identified the target users for our web application (card 3)", "Considered community representatives as users"], ["Define the problem statement (card 4)", "Identify the people affected"], ["None"]], ["Thursday", "01-10-2026", ["Defined the problem statement with the team (card 4)", "Completed a Coursera AI course"], ["Identify the project goals (card 5)"], ["None"]], ["Friday", "02-10-2026", ["Identified the project goals (card 5)"], ["Discuss the proposed solution (card 6)"], ["None"]]]}, {"n": 2, "title": "5 to 9 October 2026", "file": "Week2", "inprog": ["Define the Project Scope (starts 10 Oct)"], "done": ["Research Existing Platforms (card 7)", "Identify User Needs (card 8)", "Analyse Existing Challenges (card 9)", "Research Website Features (card 10)", "Document Research Findings (card 11)", "Establish Functional Requirements (card 12)", "Establish Non-Functional Requirements (card 13)"], "walk": [["Research existing platforms and identify user needs", "Analyse existing challenges and research website features", "Document the research findings", "Establish the functional and non-functional requirements", "Do the Coursera AI certificate courses", "Prepare mini presentations and a quiz; meet our mentor"], ["No, all tasks are aligned with the taskboard."], ["Complete the research findings and the requirements"], ["Connectivity issues at CAPACITI (every Monday); daily work could not be completed (Monday 5 October)", "ITS presentation on 6 October at 11:00", "7 October: worked from home because a strike was scheduled for the following day", "9 October: study leave to prepare for my ADP reassessment the following day"]], "days": [["Monday", "05-10-2026", ["Discussed the proposed solution (card 6)", "Researched existing platforms and identified user needs (cards 7 and 8)"], ["Analyse existing challenges (card 9)"], ["Connectivity issues at CAPACITI (every Monday); daily work could not be completed"]], ["Tuesday", "06-10-2026", ["Analysed existing challenges (card 9)"], ["Research website features (card 10)"], ["ITS presentation at 11:00, which took time from the day"]], ["Wednesday", "07-10-2026", ["Researched website features (card 10)"], ["Document the research findings (card 11)"], ["Worked from home, because a strike was scheduled for the following day"]], ["Thursday", "08-10-2026", ["Documented the research findings (card 11)"], ["Establish the functional requirements (card 12)"], ["Strike scheduled for this day (announced on 7 October)"]], ["Friday", "09-10-2026", ["Established the functional requirements (card 12)"], ["Study leave: preparing for my ADP reassessment", "The team continues with the non-functional requirements (card 13)"], ["Study leave to prepare for my ADP reassessment the following day"]]]}, {"n": 3, "title": "12 to 16 October 2026", "file": "Week3", "inprog": ["Set Up the Trello Board and Choose the Visual Style (17–18 Oct)"], "done": ["Define the Project Scope (card 14)", "Prioritise Features (card 15)", "Create User Stories (card 16)", "Plan the Website Structure (card 17)", "Create a Project Workflow (card 18)", "Allocate Group Responsibilities (card 19)", "Create a Project Timeline (card 20)", "Team charter agreed by all five members (15 Oct)", "CivicFix project documentation (15 Oct)"], "walk": [["Define the scope, prioritise features and create the user stories", "Plan the website structure and create the project workflow", "Allocate group responsibilities and agree the team charter", "Create the project timeline", "Do the Coursera AI certificate courses", "Prepare mini presentations and a quiz; meet our mentor"], ["No, all tasks are aligned with the taskboard."], ["Finish the demo, the project documentation and the presentation script"], ["Connectivity issues at CAPACITI (every Monday); daily work could not be completed (Monday 12 October)", "14 October: a team member (testing) was on study leave", "The backend was not ready yet and was the open dependency for the frontend and testing"]], "days": [["Monday", "12-10-2026", ["Caught up on the non-functional requirements (card 13) completed by the team while I was on leave", "Defined the project scope and prioritised features (cards 14 and 15)"], ["Create the user stories (card 16)"], ["Connectivity issues at CAPACITI (every Monday); daily work could not be completed"]], ["Tuesday", "13-10-2026", ["Created the user stories (card 16)", "Completed a Coursera AI course"], ["Plan the website structure (card 17)"], ["None"]], ["Wednesday", "14-10-2026", ["Planned the website structure (card 17)"], ["Create the project workflow (card 18)"], ["Result (testing) was on study leave this day"]], ["Thursday", "15-10-2026", ["Created the project workflow (card 18)", "The civic repository was created and the first commits were pushed by Mpho and Anele"], ["Lead the stand-up at 09:30 at our workstations", "Allocate group responsibilities (card 19)", "Team charter meeting at 14:30 (moved from 10:30 at Mpho’s request)", "Write the project documentation"], ["The backend was not ready yet"]], ["Friday", "16-10-2026", ["Led the stand-up on 15 October", "Allocated group responsibilities and agreed the team charter with all five members at 14:30 (card 19)", "Wrote the project documentation (dated 15 October)", "Teams, 15:34 to 15:38: Result posted the first part of the presentation script and Mpho posted the UI screenshots; I asked Anele when to expect the backend"], ["Create the project timeline (card 20)", "Prepare the presentation (Result posted the solution script at 10:50)"], ["The backend was still the open dependency"]]]}, {"n": 4, "title": "17 to 23 October 2026", "file": "Week4", "inprog": ["Enhancements – improvements: connect the live image AI, database persistence, model evaluation and the full acceptance tests"], "done": ["Create a Project Timeline (card 20)", "Present and Evaluate CivicFix (card 52, 19 Oct)", "Sprint retrospective"], "walk": [["Present CivicFix to conclude the project (19 Oct)", "Review how the presentation went and write the retrospective", "Plan the enhancements: live image AI, database persistence, model evaluation, full acceptance tests", "Do the Coursera AI certificate courses", "Prepare mini presentations and a quiz; meet our mentor"], ["No, all tasks are aligned with the taskboard."], ["Carry the unfinished improvements into the remaining time of the programme (ends 30 October)"], ["Connectivity issues at CAPACITI (every Monday); daily work could not be completed (Monday 19 October)", "Backend problems after deployment over the weekend (Mpho and Anele)"]], "days": [["Sunday", "18-10-2026", ["Created the project timeline (card 20)", "Worked remotely with the team on Teams and WhatsApp (no stand-up at the workstations)", "Sent the presentation PDF to the team at 15:19 and asked if anything needed fixing"], ["Make sure everything is ready for the presentation on Monday", "Follow up on the backend"], ["Mpho reported that the backend was in trouble after he deployed it; Anele said he would look at it"]], ["Monday", "19-10-2026", ["Prepared the presentation and followed up on the backend over the weekend"], ["Lead the stand-up", "Present CivicFix, including the challenges section (card 52)"], ["Connectivity issues at CAPACITI (every Monday); daily work could not be completed", "Backend problems after deployment"]], ["Tuesday", "20-10-2026", ["Presented CivicFix on 19 October, including the challenges section"], ["Review how the presentation went", "List the improvements"], ["None"]], ["Wednesday", "21-10-2026", ["Reviewed the presentation and listed the improvements: connect the live image AI, database persistence, model evaluation, full acceptance tests"], ["Write the sprint retrospective"], ["None"]], ["Thursday", "22-10-2026", ["Wrote the sprint retrospective: what went well, what did not and what to change"], ["Plan the enhancements for the remaining time of the programme"], ["None"]], ["Friday", "23-10-2026", ["Planned the enhancements"], ["Continue the improvements: usability testing (card 48) and fixing identified issues (card 49)"], ["None"]]]}];
  var BACKLOG_ALL=["Define objectives and understand the problem", "Identify target users, define the problem statement and project goals", "Discuss the proposed solution; research existing platforms", "Identify user needs and analyse existing challenges", "Research website features and document research findings", "Establish functional and non-functional requirements", "Define scope, prioritise features, create user stories", "Plan website structure and project workflow", "Allocate group responsibilities, create the project timeline, set up the Trello board", "Design: visual style, homepage, navigation, report interface, design review", "Set up development environment, organise project files, coding standards, shared resources", "Build the main page, navigation, issue display, categories, reporting, location, map, search, filtering, dashboard", "Integrate components; improve user experience, responsive layout, accessibility and error handling", "Test functionality and usability; fix identified issues; deploy", "Prepare project documentation; present and evaluate CivicFix"];

  var sb=document.getElementById('sign-body');
  if(sb)TEAM.forEach(function(n,i){sb.appendChild(el('tr',null,'<td>'+n+'</td><td>'+['Group leader','Backend','Research','Frontend','Testing'][i]+'</td><td>21 October 2026</td>'))});

  /* user stories: compact table, row details on demand */
  var stb=document.querySelector('#story-table tbody'),sf=document.getElementById('story-filters');
  if(stb){
    STORIES.forEach(function(s,i){
      var tr=el('tr','srow',null);tr.dataset.u=s.u;
      tr.innerHTML='<td>'+s.id+'</td><td>'+s.u+'</td><td>'+s.want+'</td><td>'+s.so+'</td><td><button class="sbtn" type="button" aria-expanded="false">Details +</button></td>';
      var dr=el('tr','sdet',null);dr.hidden=true;dr.dataset.u=s.u;
      dr.innerHTML='<td colspan="5"><div class="sd"><div><h5>Acceptance criteria</h5><ul>'+s.ac.map(function(a){return'<li>'+a+'</li>'}).join('')+'</ul></div><div><h5>Tasks</h5><ul>'+s.tasks.map(function(t){return'<li>'+t[0]+' <em>('+t[1]+')</em></li>'}).join('')+'</ul></div><p>Backlog: '+s.pb+' &middot; Tests: '+s.uat+'</p></div></td>';
      tr.querySelector('.sbtn').onclick=function(){var o=dr.hidden;dr.hidden=!o;this.setAttribute('aria-expanded',o);this.innerHTML=o?'Hide &minus;':'Details +'};
      stb.appendChild(tr);stb.appendChild(dr);
    });
    var users=['All'].concat(STORIES.map(function(s){return s.u}).filter(function(v,i,a){return a.indexOf(v)===i}));
    users.forEach(function(u,i){var b=el('button','chip',u);b.type='button';b.setAttribute('aria-pressed',i===0);
      b.onclick=function(){$('.chip',sf).forEach(function(x){x.setAttribute('aria-pressed',x===b)});$('#story-table tbody tr').forEach(function(r){var show=(u==='All'||r.dataset.u===u);if(r.classList.contains('sdet')){r.hidden=true}else{r.hidden=!show;var sbn=r.querySelector('.sbtn');sbn.setAttribute('aria-expanded',false);sbn.innerHTML='Details +'}})};sf.appendChild(b)});
  }

  /* product backlog */
  var tb=document.querySelector('#pb-table tbody');
  function drawPB(){
    var p=document.getElementById('pb-pri').value,s=document.getElementById('pb-st').value;
    tb.innerHTML='';var n=0,pts=0;
    PB.forEach(function(r,i){
      if((p&&r[2]!==p)||(s&&r[4]!==s))return;n++;pts+=r[3];
      var sc=r[4]==='Demo built'?'s-Demo':r[4]==='Planned'?'s-Planned':'';
      tb.appendChild(el('tr',null,'<td>'+(i+1)+'</td><td>'+r[0]+'</td><td>'+r[1]+'</td><td><span class="pill p-'+r[2]+'">'+r[2]+'</span></td><td>'+r[3]+'</td><td><span class="pill '+sc+'">'+r[4]+'</span></td>'));
    });
    document.getElementById('pb-count').textContent=n+' of '+PB.length+' items';
    document.getElementById('pb-sum').textContent='Showing '+pts+' proposed story points. Rank 1 is the next thing to build. Points are proposed estimates for the team to confirm.';
  }
  if(tb){document.getElementById('pb-pri').onchange=drawPB;document.getElementById('pb-st').onchange=drawPB;drawPB()}

  /* sprint board */
  var board=document.getElementById('board'),KEY='p4-sprint',state=store.get(KEY)||{};
  function drawBoard(){
    if(!board)return;board.innerHTML='';var done=0;
    COLS.forEach(function(name,ci){
      var col=el('div','col'),items=SPRINT.filter(function(t){return(state[t[0]]!=null?state[t[0]]:t[4])===ci});
      if(ci===2)done=items.length;
      col.appendChild(el('h4',null,name+'<span>'+items.length+'</span>'));
      items.forEach(function(t){
        var c=el('div','task','<span class="tid">'+t[0]+' &middot; '+t[3]+'</span>'+t[1]+'<span class="own">Owner: '+t[2]+'</span>');
        var mv=el('div','mv');
        if(ci>0){var b=el('button',null,'&larr; '+COLS[ci-1]);b.type='button';b.onclick=function(){state[t[0]]=ci-1;store.set(KEY,state);drawBoard()};mv.appendChild(b)}
        if(ci<2){var f=el('button',null,COLS[ci+1]+' &rarr;');f.type='button';f.onclick=function(){state[t[0]]=ci+1;store.set(KEY,state);drawBoard()};mv.appendChild(f)}
        c.appendChild(mv);col.appendChild(c);
      });
      board.appendChild(col);
    });
    document.getElementById('sp-bar').style.width=(done/SPRINT.length*100)+'%';
    document.getElementById('sp-text').textContent=done+' of '+SPRINT.length+' tasks done';
  }
  drawBoard();

  /* logbook weeks */
  (function(){
    var wrap=document.getElementById('weeks');if(!wrap)return;
    function ul(a){return '<ul>'+a.map(function(x){return '<li>'+x+'</li>'}).join('')+'</ul>'}
    var Q=['1. What did I complete since the last standup?','2. What am I planning to complete between now and the next standup?','3. What are my impediments (or risks or problems)?'];
    var WQ=['1. What do we need to do to advance this piece of work?','2. Is anyone working on anything that is not on the board?','3. What do we need to finish as a team?','4. Are there any bottlenecks or blockers to the flow of work?'];
    WEEKS.forEach(function(w,i){
      var id='week'+w.n;
      var b='<p class="lb-head"><a class="btn ink" href="downloads/Agile_Logbook_Week'+w.n+'_Inga_Plati.pdf" target="_blank" rel="noopener">Download Week '+w.n+' (PDF)</a></p>';
      b+='<h5 class="wk-head">Taskboard</h5><div class="lb-board"><div class="lb-col"><h5>Product Backlog</h5>'+ul(BACKLOG_ALL)+'</div><div class="lb-col"><h5>In Progress</h5>'+ul(w.inprog)+'</div><div class="lb-col"><h5>Completed</h5>'+ul(w.done)+'</div></div>';
      b+='<h5 class="wk-head">Walkthrough</h5><dl class="lb-walk">'+w.walk.map(function(a,k){return '<dt>'+WQ[k]+'</dt><dd>'+ul(a)+'</dd>'}).join('')+'</dl>';
      b+='<h5 class="wk-head">Logbook</h5>'+w.days.map(function(d){return '<div class="lb-day"><header><span>'+d[0]+'</span><span>'+d[1]+'</span></header><dl>'+[2,3,4].map(function(k,j){return '<dt>'+Q[j]+'</dt><dd>'+ul(d[k])+'</dd>'}).join('')+'</dl></div>'}).join('');
      var sec=document.createElement('div');sec.id=id;
      sec.innerHTML='<div class="acc" data-group="weeks"><h4><button class="acc-btn" type="button" aria-expanded="false" aria-controls="'+id+'-p"><span class="acc-t">Agile Logbook Week '+w.n+' &middot; '+w.title+'</span><span class="acc-i" aria-hidden="true">+</span></button></h4><div class="acc-p" id="'+id+'-p" hidden>'+b+'</div></div>';
      wrap.appendChild(sec);
    });
  })();

  /* accordions + lightbox */
  document.addEventListener('click',function(e){
    var btn=e.target.closest&&e.target.closest('.acc-btn');
    if(btn){var p=document.getElementById(btn.getAttribute('aria-controls')),open=btn.getAttribute('aria-expanded')==='true';btn.setAttribute('aria-expanded',!open);btn.querySelector('.acc-i').innerHTML=open?'+':'&minus;';p.hidden=open;return}
    var ctl=e.target.closest&&e.target.closest('.acc-ctl [data-act]');
    if(ctl){var g=ctl.parentNode.getAttribute('data-for'),op=ctl.getAttribute('data-act')==='open';
      $('.acc[data-group="'+g+'"] > h4 > .acc-btn').forEach(function(b){var p=document.getElementById(b.getAttribute('aria-controls'));b.setAttribute('aria-expanded',op);b.querySelector('.acc-i').innerHTML=op?'&minus;':'+';p.hidden=!op});return}
    var z=e.target.closest&&e.target.closest('.zoom');
    if(z){var d=document.getElementById('lb'),im=document.getElementById('lb-img');im.src=z.getAttribute('data-src');im.alt=z.getAttribute('data-alt');if(d.showModal)d.showModal();else d.setAttribute('open','')}
  });
  var lbx=document.getElementById('lb-x'),lbd=document.getElementById('lb');
  if(lbx){lbx.onclick=function(){lbd.close?lbd.close():lbd.removeAttribute('open')};lbd.addEventListener('click',function(e){if(e.target===lbd)lbx.click()})}

  /* text size */
  var fs=store.get('p4-fs')||100;
  function setFs(v){fs=Math.max(85,Math.min(140,v));document.documentElement.style.fontSize=fs+'%';store.set('p4-fs',fs)}
  setFs(fs);
  var up=document.getElementById('tz-up'),dn=document.getElementById('tz-dn');if(up)up.onclick=function(){setFs(fs+10)};if(dn)dn.onclick=function(){setFs(fs-10)};

  /* nav highlight */
  var links=$('.top nav a'),secs=links.map(function(a){return document.querySelector(a.getAttribute('href'))});
  function onScroll(){var cur=-1;secs.forEach(function(s,i){if(s&&s.getBoundingClientRect().top<window.innerHeight*0.35)cur=i});links.forEach(function(a,i){a.classList.toggle('on',i===cur)})}
  window.addEventListener('scroll',onScroll,{passive:true});onScroll();
})();
