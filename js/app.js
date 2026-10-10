/* InternTrack – shared logic: data, auth guard, navbar/footer, page renderers */

// ---------- Demo data (no database needed) ----------
const APPS=[
 {id:1,company:'Petronas Digital',role:'Web Developer Intern',status:'Interview',date:'2026-07-03',city:'Kuala Lumpur'},
 {id:2,company:'Maybank Tech',role:'UI/UX Intern',status:'Applied',date:'2026-07-15',city:'Kuala Lumpur'},
 {id:3,company:'Grab Malaysia',role:'Frontend Intern',status:'Offer',date:'2026-06-20',city:'Petaling Jaya'},
 {id:4,company:'AirAsia Digital',role:'Data Analyst Intern',status:'Rejected',date:'2026-06-11',city:'Sepang'},
 {id:5,company:'Telekom Malaysia',role:'Systems Intern',status:'Applied',date:'2026-08-02',city:'Cyberjaya'},
 {id:6,company:'Shopee MY',role:'Content Management Intern',status:'Interview',date:'2026-08-09',city:'Kuala Lumpur'},
 {id:7,company:'Axiata',role:'Web Design Intern',status:'Rejected',date:'2026-05-28',city:'Kuala Lumpur'},
 {id:8,company:'MIMOS',role:'Software Intern',status:'Applied',date:'2026-08-21',city:'Kuala Lumpur'},
 {id:9,company:'Intel Malaysia',role:'QA Intern',status:'Offer',date:'2026-07-25',city:'Bayan Lepas'}
];
const COMPANIES=[
 {name:'Petronas Digital',industry:'Energy',city:'Kuala Lumpur',allowance:1500,open:3},
 {name:'Grab Malaysia',industry:'Tech',city:'Petaling Jaya',allowance:1800,open:5},
 {name:'Telekom Malaysia',industry:'Telecom',city:'Cyberjaya',allowance:1200,open:2},
 {name:'Intel Malaysia',industry:'Semiconductor',city:'Bayan Lepas',allowance:2000,open:4},
 {name:'Maybank Tech',industry:'Finance',city:'Kuala Lumpur',allowance:1400,open:2},
 {name:'Shopee MY',industry:'E-commerce',city:'Kuala Lumpur',allowance:1700,open:6}
];
const COLORS={Applied:'#1F3A5F',Interview:'#F2A900',Offer:'#2A9D8F',Rejected:'#D1495B'};
const BADGE={Applied:'primary',Interview:'warning text-dark',Offer:'success',Rejected:'danger'};

// ---------- Auth (simulated, hardcoded credentials) ----------
const USERS=[{user:'student',pass:'ims566',name:'Aina Sofea'}];
const getUsers=()=>USERS.concat(JSON.parse(localStorage.getItem('it_users')||'[]')); // registered users persist in browser
const session=()=>JSON.parse(sessionStorage.getItem('it_session')||'null');
const logout=()=>{sessionStorage.removeItem('it_session');location.href='index.html'};

// ---------- Shared layout ----------
function layout(active){
 const me=session(); if(!me){location.href='index.html';return;}
 const links=[['dashboard.html','Dashboard'],['applications.html','Applications'],['companies.html','Companies']];
 document.getElementById('nav').innerHTML=`
 <nav class="navbar navbar-expand-md navbar-dark" aria-label="Main navigation"><div class="container">
  <a class="navbar-brand fw-bold" href="dashboard.html"><span class="brand-mark">&#9670;</span> InternTrack</a>
  <button class="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#menu" aria-label="Toggle menu"><span class="navbar-toggler-icon"></span></button>
  <div class="collapse navbar-collapse" id="menu">
   <ul class="navbar-nav me-auto">${links.map(l=>`<li class="nav-item"><a class="nav-link ${l[0]==active?'active':''}" href="${l[0]}">${l[1]}</a></li>`).join('')}</ul>
   <span class="text-white-50 me-3 small">Signed in as ${me.name}</span>
   <button class="btn btn-outline-light btn-sm" onclick="logout()">Log out</button>
  </div></div></nav>`;
 document.getElementById('footer').innerHTML=`
 <footer class="py-4 mt-5"><div class="container d-flex flex-wrap justify-content-between gap-2">
  <span>&copy; 2026 InternTrack &ndash; IMS566 Individual Assignment</span>
  <span>Built with Bootstrap 5 &amp; Chart.js &middot; <a href="https://github.com/" target="_blank" rel="noopener">GitHub</a></span></div></footer>`;
}
const countBy=k=>APPS.reduce((o,a)=>(o[a[k]]=(o[a[k]]||0)+1,o),{});

// ---------- Login / Register page ----------
function initLogin(){
 if(session()){location.href='dashboard.html';return;}
 const err=document.getElementById('err'), show=m=>{err.textContent=m;err.classList.remove('d-none')};
 document.getElementById('loginForm').addEventListener('submit',e=>{
  e.preventDefault();
  const u=lu.value.trim(),p=lp.value;
  if(!u||!p) return show('Enter both username and password.');
  const found=getUsers().find(x=>x.user===u&&x.pass===p);
  if(!found) return show('Incorrect username or password. Try the demo login shown on this page.');
  sessionStorage.setItem('it_session',JSON.stringify({user:found.user,name:found.name}));
  location.href='dashboard.html';
 });
 document.getElementById('regForm').addEventListener('submit',e=>{
  e.preventDefault();
  const list=JSON.parse(localStorage.getItem('it_users')||'[]');
  if(!rn.value.trim()||!ru.value.trim()) return show('Fill in your name and a username.');
  if(rp.value.length<6) return show('Password needs at least 6 characters.');
  if(getUsers().some(x=>x.user===ru.value.trim())) return show('That username is taken. Choose another.');
  list.push({user:ru.value.trim(),pass:rp.value,name:rn.value.trim()});
  localStorage.setItem('it_users',JSON.stringify(list));
  err.classList.add('d-none');
  document.getElementById('ok').classList.remove('d-none');
  document.querySelector('[data-bs-target="#tabLogin"]').click();
 });
}

// ---------- Dashboard ----------
function initDashboard(){
 layout('dashboard.html');
 const c=countBy('status');
 document.getElementById('stats').innerHTML=[
  ['Total applications',APPS.length,''],['Interviews',c.Interview||0,'s2'],['Offers',c.Offer||0,'s3'],['Rejected',c.Rejected||0,'s4']
 ].map(s=>`<div class="col-6 col-lg-3"><div class="panel stat ${s[2]}"><div class="num">${s[1]}</div><div class="text-muted small mt-1">${s[0]}</div></div></div>`).join('');
 new Chart(document.getElementById('statusChart'),{type:'doughnut',
  data:{labels:Object.keys(c),datasets:[{data:Object.values(c),backgroundColor:Object.keys(c).map(k=>COLORS[k])}]},
  options:{plugins:{legend:{position:'bottom'}}}});
 const m={};APPS.forEach(a=>{const k=a.date.slice(0,7);m[k]=(m[k]||0)+1});
 const keys=Object.keys(m).sort();
 new Chart(document.getElementById('monthChart'),{type:'bar',
  data:{labels:keys,datasets:[{label:'Applications sent',data:keys.map(k=>m[k]),backgroundColor:'#1F3A5F'}]},
  options:{scales:{y:{beginAtZero:true,ticks:{stepSize:1}}}}});
}

// ---------- Applications (searchable, filterable table) ----------
function initApplications(){
 layout('applications.html');
 const draw=()=>{
  const q=search.value.toLowerCase(),f=filter.value;
  const rows=APPS.filter(a=>(f==='All'||a.status===f)&&(a.company+a.role).toLowerCase().includes(q));
  tbody.innerHTML=rows.length?rows.map(a=>`<tr><td>${a.company}</td><td>${a.role}</td><td>${a.city}</td><td>${a.date}</td>
   <td><span class="badge bg-${BADGE[a.status]} badge-st">${a.status}</span></td></tr>`).join('')
   :'<tr><td colspan="5" class="text-center text-muted py-4">No applications match. Clear the search or filter.</td></tr>';
  count.textContent=rows.length+' of '+APPS.length+' shown';
 };
 search.oninput=draw;filter.onchange=draw;draw();
}

// ---------- Companies (card grid + chart) ----------
function initCompanies(){
 layout('companies.html');
 grid.innerHTML=COMPANIES.map(c=>`<div class="col-sm-6 col-lg-4"><div class="panel h-100">
  <h2 class="h5 mb-1">${c.name}</h2><p class="text-muted small mb-3">${c.industry} &middot; ${c.city}</p>
  <div class="d-flex justify-content-between"><span>Allowance</span><strong>RM ${c.allowance}</strong></div>
  <div class="d-flex justify-content-between"><span>Open positions</span><strong>${c.open}</strong></div></div></div>`).join('');
 new Chart(document.getElementById('allowChart'),{type:'bar',
  data:{labels:COMPANIES.map(c=>c.name),datasets:[{label:'Monthly allowance (RM)',data:COMPANIES.map(c=>c.allowance),backgroundColor:'#2A9D8F'}]},
  options:{indexAxis:'y',plugins:{legend:{display:false}}}});
}
