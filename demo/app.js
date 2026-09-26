const EMBLEM="./assets/namma-kyc-mark.svg";

const EN={
  app:"Namma KYC", gov:"Karnataka reference", tagline:"Karnataka ration-card e-KYC reference journey",
  getStarted:"Get Started", reset:"Reset", home:"Home", welcome:"Welcome, Citizen",
  welcomeText:"Complete a simulated ration-card e-KYC journey without sending personal information.",
  ration:"Ration Card Reference", rationText:"Demo values are preconfigured. Never enter a real ration-card number.",
  member:"Select Member", consent:"Consent & Information", instructions:"Get Ready",
  aadhaar:"Aadhaar Verification", provider:"Authorized Aadhaar provider boundary",
  faceTitle:"Face Authentication / Face RD", faceText:"In production, the authorized provider launches Face RD. Namma KYC does not perform face recognition.",
  otpTitle:"OTP Authentication", otpText:"If enabled by the authorized service, OTP is handled by the provider-controlled authentication path.",
  continue:"Continue", voice:"Optional voice preparation", voiceText:"Fixed instructions are provided as text and may be read aloud by the Android reference app.",
  preparation:"Before verification", prep1:"Use a well-lit place.", prep2:"Keep your face clearly visible.", prep3:"Follow the prompts in the authorized verification app.", external:"External verification boundary",
  externalText:"Simulation only: this is where an authorized Aadhaar provider would open its verification flow.",
  authResult:"Authentication result", authResultText:"Simulation result: provider authentication accepted. No identity was actually verified.",
  pds:"PDS e-KYC", pdsText:"The PDS e-KYC stage begins after an authentication result is received.",
  processing:"Processing", pdsBoundary:"Authorized PDS provider boundary",
  success:"e-KYC Completed — Simulation", successText:"The complete reference journey finished in simulation. No Aadhaar, biometric, OTP, or government record was accessed.",
  status:"e-KYC Status", submitted:"Request submitted", auth:"Aadhaar authentication result received", pdsDone:"PDS e-KYC processing completed",
  reference:"Reference ID", referenceValue:"DEMO-NKYC-2026-0001", fictional:"Fictional reference value",
  profile:"Profile", help:"Help & FAQ", language:"ಕನ್ನಡ",
  demo:"DEMO ONLY • No personal information • No backend connection • No government or Aadhaar service connection",
  steps:["Home","Member","Consent","Get Ready","Aadhaar","Result","PDS","Complete","Status","Profile"]
};
const KN={
  app:"ನಮ್ಮ KYC", gov:"ಕರ್ನಾಟಕ ರೆಫರೆನ್ಸ್", tagline:"ಕರ್ನಾಟಕ ಪಡಿತರ ಚೀಟಿ ಇ-ಕೆವೈಸಿ ರೆಫರೆನ್ಸ್ ಪ್ರಕ್ರಿಯೆ",
  getStarted:"ಪ್ರಾರಂಭಿಸಿ", reset:"ಮರುಹೊಂದಿಸಿ", home:"ಮುಖಪುಟ", welcome:"ಸ್ವಾಗತ, ನಾಗರಿಕರೇ",
  welcomeText:"ವೈಯಕ್ತಿಕ ಮಾಹಿತಿಯನ್ನು ಕಳುಹಿಸದೆ ಪಡಿತರ ಚೀಟಿ ಇ-ಕೆವೈಸಿಯ ಸಿಮ್ಯುಲೇಟೆಡ್ ಪ್ರಕ್ರಿಯೆಯನ್ನು ಅನುಭವಿಸಿ.",
  ration:"ಪಡಿತರ ಚೀಟಿ ರೆಫರೆನ್ಸ್", rationText:"ಡೆಮೊ ಮೌಲ್ಯಗಳು ಪೂರ್ವನಿಗದಿಯಾಗಿವೆ. ನಿಜವಾದ ಪಡಿತರ ಚೀಟಿ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಬೇಡಿ.",
  member:"ಸದಸ್ಯರನ್ನು ಆಯ್ಕೆಮಾಡಿ", consent:"ಸಮ್ಮತಿ ಮತ್ತು ಮಾಹಿತಿ", instructions:"ಸಿದ್ಧರಾಗಿ",
  aadhaar:"ಆಧಾರ್ ಪರಿಶೀಲನೆ", provider:"ಅನುಮೋದಿತ ಆಧಾರ್ ಪ್ರೊವೈಡರ್ ಗಡಿ",
  faceTitle:"ಮುಖ ದೃಢೀಕರಣ / Face RD", faceText:"ಉತ್ಪಾದನಾ ಆವೃತ್ತಿಯಲ್ಲಿ ಅನುಮೋದಿತ ಪ್ರೊವೈಡರ್ Face RD ಅನ್ನು ತೆರೆಯುತ್ತದೆ. ನಮ್ಮ KYC ಮುಖ ಗುರುತಿಸುವಿಕೆಯನ್ನು ಮಾಡುವುದಿಲ್ಲ.",
  otpTitle:"OTP ದೃಢೀಕರಣ", otpText:"ಅನುಮೋದಿತ ಸೇವೆಯಲ್ಲಿ ಲಭ್ಯವಿದ್ದರೆ OTP ಅನ್ನು ಪ್ರೊವೈಡರ್-ನಿಯಂತ್ರಿತ ದೃಢೀಕರಣ ಮಾರ್ಗದಲ್ಲಿ ನಿರ್ವಹಿಸಲಾಗುತ್ತದೆ.",
  continue:"ಮುಂದುವರಿಸಿ", voice:"ಐಚ್ಛಿಕ ಧ್ವನಿ ಸಿದ್ಧತೆ", voiceText:"ಸ್ಥಿರ ಸೂಚನೆಗಳನ್ನು ಪಠ್ಯವಾಗಿ ನೀಡಲಾಗುತ್ತದೆ ಮತ್ತು Android ರೆಫರೆನ್ಸ್ ಆವೃತ್ತಿಯಲ್ಲಿ ಧ್ವನಿಯಾಗಿ ಕೇಳಬಹುದು.",
  preparation:"ಪರಿಶೀಲನೆಗೆ ಮೊದಲು", prep1:"ಉತ್ತಮ ಬೆಳಕು ಇರುವ ಸ್ಥಳದಲ್ಲಿರಿ.", prep2:"ನಿಮ್ಮ ಮುಖವು ಸ್ಪಷ್ಟವಾಗಿ ಕಾಣುವಂತೆ ಮಾಡಿ.", prep3:"ಅನುಮೋದಿತ ಪರಿಶೀಲನಾ ಅಪ್ಲಿಕೇಶನ್‌ನ ಸೂಚನೆಗಳನ್ನು ಅನುಸರಿಸಿ.", external:"ಬಾಹ್ಯ ಪರಿಶೀಲನಾ ಗಡಿ",
  externalText:"ಸಿಮ್ಯುಲೇಶನ್ ಮಾತ್ರ: ಇಲ್ಲಿ ಅನುಮೋದಿತ ಆಧಾರ್ ಪ್ರೊವೈಡರ್‌ನ ಪರಿಶೀಲನಾ ಪ್ರಕ್ರಿಯೆ ತೆರೆಯುತ್ತದೆ.",
  authResult:"ದೃಢೀಕರಣ ಫಲಿತಾಂಶ", authResultText:"ಸಿಮ್ಯುಲೇಶನ್ ಫಲಿತಾಂಶ: ಪ್ರೊವೈಡರ್ ದೃಢೀಕರಣವನ್ನು ಸ್ವೀಕರಿಸಲಾಗಿದೆ. ಯಾವುದೇ ಗುರುತನ್ನು ನಿಜವಾಗಿ ಪರಿಶೀಲಿಸಲಾಗಿಲ್ಲ.",
  pds:"PDS ಇ-ಕೆವೈಸಿ", pdsText:"ದೃಢೀಕರಣದ ಫಲಿತಾಂಶ ಬಂದ ನಂತರ PDS ಇ-ಕೆವೈಸಿ ಹಂತ ಪ್ರಾರಂಭವಾಗುತ್ತದೆ.",
  processing:"ಪ್ರಕ್ರಿಯೆ", pdsBoundary:"ಅನುಮೋದಿತ PDS ಪ್ರೊವೈಡರ್ ಗಡಿ",
  success:"ಇ-ಕೆವೈಸಿ ಪೂರ್ಣ — ಸಿಮ್ಯುಲೇಶನ್", successText:"ಸಂಪೂರ್ಣ ರೆಫರೆನ್ಸ್ ಪ್ರಕ್ರಿಯೆ ಸಿಮ್ಯುಲೇಶನ್‌ನಲ್ಲಿ ಪೂರ್ಣಗೊಂಡಿದೆ. ಯಾವುದೇ ಆಧಾರ್, ಬಯೋಮೆಟ್ರಿಕ್, OTP ಅಥವಾ ಸರ್ಕಾರಿ ದಾಖಲೆಗಳನ್ನು ಪ್ರವೇಶಿಸಲಾಗಿಲ್ಲ.",
  status:"ಇ-ಕೆವೈಸಿ ಸ್ಥಿತಿ", submitted:"ವಿನಂತಿ ಸಲ್ಲಿಸಲಾಗಿದೆ", auth:"ಆಧಾರ್ ದೃಢೀಕರಣ ಫಲಿತಾಂಶ ಸ್ವೀಕರಿಸಲಾಗಿದೆ", pdsDone:"PDS ಇ-ಕೆವೈಸಿ ಪ್ರಕ್ರಿಯೆ ಪೂರ್ಣಗೊಂಡಿದೆ",
  reference:"ಉಲ್ಲೇಖ ಸಂಖ್ಯೆ", referenceValue:"DEMO-NKYC-2026-0001", fictional:"ಕಾಲ್ಪನಿಕ ಉಲ್ಲೇಖ ಮೌಲ್ಯ",
  profile:"ಪ್ರೊಫೈಲ್", help:"ಸಹಾಯ ಮತ್ತು FAQ", language:"English",
  demo:"ಡೆಮೊ ಮಾತ್ರ • ವೈಯಕ್ತಿಕ ಮಾಹಿತಿ ಇಲ್ಲ • ಬ್ಯಾಕೆಂಡ್ ಸಂಪರ್ಕವಿಲ್ಲ • ಸರ್ಕಾರಿ ಅಥವಾ ಆಧಾರ್ ಸೇವೆಗೆ ಸಂಪರ್ಕವಿಲ್ಲ",
  steps:["ಮುಖಪುಟ","ಸದಸ್ಯರು","ಸಮ್ಮತಿ","ಸಿದ್ಧತೆ","ಆಧಾರ್","ಫಲಿತಾಂಶ","PDS","ಪೂರ್ಣ","ಸ್ಥಿತಿ","ಪ್ರೊಫೈಲ್"]
};
let lang="en",step=0;
const memberName=()=>lang==="en"?"Sujatha Devi":"ಸುಜಾತಾ ದೇವಿ";
function S(){return lang==="en"?EN:KN}
function render(){
 const s=S();
 document.querySelector(".app-top").classList.toggle("hidden",step===0);
 document.getElementById("tagline").textContent=s.tagline;
 document.getElementById("language").textContent=s.language;
 document.getElementById("start").textContent=s.getStarted;
 document.getElementById("reset").textContent=s.reset;
 const pct=step>0?Math.round(step/10*100):0;
 document.getElementById("progress").classList.toggle("hidden",step===0);
 document.getElementById("progress-fill").style.width=pct+"%";
 document.getElementById("progress-label").textContent=step>0&&step<=10?s.steps[step-1]+" · "+step+" / 10":"";
 document.getElementById("steps").innerHTML=s.steps.map((x,i)=>'<button class="demo-step '+(i===step-1?"active":"")+'" data-step="'+(i+1)+'">'+(i+1)+". "+x+"</button>").join("");
 document.querySelectorAll(".demo-step").forEach(b=>b.onclick=()=>{step=Number(b.dataset.step);render()});
 document.getElementById("screen").innerHTML=screen(s);
 wire();
}
function emblem(){return '<img class="emblem-img" src="'+EMBLEM+'" alt="'+S().app+'">'}
function button(label,next,cls="primary"){return '<button class="'+cls+'" data-next="'+next+'">'+label+' <b>→</b></button>'}
function screen(s){
 if(step===0)return '<div class="splash"><div class="splash-emblem">'+emblem()+'</div><div class="gov">'+s.gov+'</div><h2>'+s.app+'</h2><p class="splash-tag">'+s.tagline+'</p><p class="motto">'+s.demo+'</p>'+button(s.getStarted,1)+'</div>';
 if(step===1)return '<div class="home-screen"><div class="home-head">'+emblem()+'<div><small>'+s.gov+'</small><h2>'+s.welcome+'</h2></div></div><div class="kyc-card"><div class="kyc-icon">▣</div><div><b>'+s.ration+'</b><small>'+s.welcomeText+'</small></div></div><div class="notice">'+s.rationText+'</div>'+button(s.continue,2)+'</div>';
 if(step===2)return '<div class="screen-card"><div class="screen-head"><b>'+s.member+'</b></div><div class="member-row selected"><span class="avatar">'+memberName().charAt(0)+'</span><span><b>'+memberName()+'</b><small>'+s.ration+'</small></span><i>✓</i></div>'+button(s.continue,3)+'</div>';
 if(step===3)return '<div class="screen-card"><div class="screen-head"><b>'+s.consent+'</b></div><div class="security-list"><p>✓ '+s.provider+'</p><p>✓ '+s.faceText+'</p><p>✓ '+s.otpText+'</p><p>✓ '+s.rationText+'</p></div>'+button(s.continue,4)+'</div>';
 if(step===4)return '<div class="screen-card"><div class="screen-head"><b>'+s.instructions+'</b></div><h3>'+s.preparation+'</h3><div class="timeline">'+[s.prep1,s.prep2,s.prep3].map((x,i)=>'<div class="timeline-row"><span class="dot done">'+(i+1)+'</span><p>'+x+'</p></div>').join("")+'</div><div class="notice"><b>'+s.voice+'</b><br>'+s.voiceText+'</div>'+button(s.continue,5)+'</div>';
 if(step===5)return '<div class="screen-card"><div class="screen-head"><b>'+s.aadhaar+'</b></div><div class="provider-label">'+s.provider+'<br><small>'+s.external+'</small></div><h3>'+s.faceTitle+'</h3><p>'+s.faceText+'</p><h3>'+s.otpTitle+'</h3><p>'+s.otpText+'</p><div class="face-boundary"><div class="face-placeholder">↗</div></div><div class="notice">'+s.externalText+'</div>'+button(s.continue,6)+'</div>';
 if(step===6)return '<div class="screen-card center"><div class="success-check">✓</div><h2>'+s.authResult+'</h2><p>'+s.authResultText+'</p><div class="details"><small>'+s.provider+'</small><small>'+s.external+'</small></div>'+button(s.continue,7)+'</div>';
 if(step===7)return '<div class="screen-card"><div class="screen-head"><b>'+s.pds+'</b></div><h2>'+s.processing+'</h2><p>'+s.pdsText+'</p><div class="timeline">'+[[s.auth,"done"],[s.pdsDone,"active"]].map(x=>'<div class="timeline-row"><span class="dot '+x[1]+'">'+(x[1]==="done"?"✓":"•")+'</span><p>'+x[0]+'</p></div>').join("")+'</div><div class="notice"><b>'+s.pdsBoundary+'</b><br>'+s.pdsText+'</div>'+button(s.continue,8)+'</div>';
 if(step===8)return '<div class="screen-card center success"><div class="success-check">✓</div><h2>'+s.success+'</h2><p>'+s.successText+'</p><div class="details"><small>'+s.reference+'</small><code>'+s.referenceValue+'</code><small>'+s.fictional+'</small></div>'+button(s.continue,9)+'</div>';
 if(step===9)return '<div class="screen-card"><div class="screen-head"><b>'+s.status+'</b></div><div class="status-member"><span class="avatar">'+memberName().charAt(0)+'</span><b>'+memberName()+'</b></div><div class="timeline big">'+[s.submitted,s.auth,s.pdsDone].map((x,i)=>'<div class="timeline-row"><span class="dot done">✓</span><p><b>'+x+'</b></p></div>').join("")+'</div><div class="details"><small>'+s.reference+'</small><code>'+s.referenceValue+'</code></div>'+button(s.reset,0,"secondary")+'</div>';
 return '<div class="screen-card"><div class="profile-top"><div class="profile-avatar">N</div><h2>'+s.profile+'</h2></div><div class="profile-row">'+s.help+' <b>›</b></div>'+button(s.reset,0,"secondary")+'</div>';
}
function wire(){
 document.querySelectorAll("[data-next]").forEach(b=>b.onclick=()=>{step=Number(b.dataset.next);render()});
 document.getElementById("language").onclick=()=>{lang=lang==="en"?"kn":"en";render()};
 document.getElementById("start").onclick=()=>{step=1;render()};
 document.getElementById("reset").onclick=()=>{step=0;render()};
}
render();
