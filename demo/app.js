const MARK="./assets/namma-kyc-mark.svg";
const EN={
  app:"Namma KYC", gov:"Government of Karnataka", tagline:"Karnataka ration-card e-KYC", language:"ಕನ್ನಡ",
  getStarted:"Get Started", motto:"Our People · Our Karnataka · A Brighter Tomorrow", continue:"Continue", reset:"Start again", back:"Back",
  welcome:"Let's complete your e-KYC for Karnataka services.", welcomeText:"For you and your family.",
  feature1:"Ration Card e-KYC",feature1Text:"For you and your family",feature2:"Secure verification",feature2Text:"Designed around secure verification",feature3:"Your Data, Your Privacy",feature3Text:"Only what is required",feature4:"Fast & Easy",feature4Text:"Complete the journey in a few minutes.",
  ration:"Ration card number",rationHint:"Use the fictional demo card below.",demoRation:"KA-DEMO-2026-001",
  members:"Household members",selectMember:"Select the member completing e-KYC.",
  required:"KYC required",recent:"Biometric verification completed recently",
  consent:"Consent & Information",consentText:"Review the information before continuing.",
  consent1:"Aadhaar verification is completed through the authorized service.",consent2:"Verification uses the authorized Aadhaar process.",consent3:"Only the information required for this service is used.",
  agree:"I Agree & Continue",
  aadhaar:"Aadhaar verification",aadhaarText:"Enter Aadhaar details to continue with OTP authentication.",
  otp:"OTP verification",otpText:"An OTP is sent to the Aadhaar-registered mobile number.",demoOtp:"Demo OTP verified",
  verifyOtp:"Verify OTP",faceReady:"Get Ready for Face Scan",faceText:"Make sure you are in a well-lit place and follow the instructions.",
  face1:"Remove anything that covers your face",face2:"Look directly at the camera",face3:"Keep your face inside the frame",face4:"Keep the phone steady",ready:"I'm Ready",
  capture:"Face Authentication",captureText:"Keep your face inside the frame",
  verifying:"Verifying Identity",wait:"Please wait while authentication is completed.",
  authDone:"Aadhaar verification complete",pds:"Ration-card e-KYC",processing:"Finalizing your e-KYC",
  success:"e-KYC Completed Successfully!",successText:"Your identity verification has been completed for this service.",
  reference:"Reference ID",referenceValue:"NKYC-DEMO-2026-0001",status:"Completed",service:"Ration Card e-KYC",
  statusTitle:"e-KYC Status",submitted:"Request submitted",otpDone:"OTP verified",faceDone:"Biometric verification completed",pdsDone:"Ration-card e-KYC completed",
  steps:["Welcome","Ration Card","Members","Consent","OTP","Face","Verify","Complete","Status"],demo:"DEMO",simulation:"Simulation only"
};
const KN={
  app:"ನಮ್ಮ KYC",gov:"ಕರ್ನಾಟಕ ಸರ್ಕಾರ",tagline:"ಕರ್ನಾಟಕ ಪಡಿತರ ಚೀಟಿ ಇ-ಕೆವೈಸಿ",language:"English",
  getStarted:"ಪ್ರಾರಂಭಿಸಿ",motto:"ನಮ್ಮ ಜನರು · ನಮ್ಮ ಕರ್ನಾಟಕ · ಉಜ್ವಲ ಭವಿಷ್ಯ",continue:"ಮುಂದುವರಿಸಿ",reset:"ಮತ್ತೆ ಪ್ರಾರಂಭಿಸಿ",back:"ಹಿಂದೆ",
  welcome:"ಕರ್ನಾಟಕ ಸೇವೆಗಳಿಗಾಗಿ ನಿಮ್ಮ ಇ-ಕೆವೈಸಿಯನ್ನು ಪೂರ್ಣಗೊಳಿಸೋಣ.",welcomeText:"ನಿಮಗಾಗಿ ಮತ್ತು ನಿಮ್ಮ ಕುಟುಂಬಕ್ಕಾಗಿ.",
  feature1:"ಪಡಿತರ ಚೀಟಿ ಇ-ಕೆವೈಸಿ",feature1Text:"ನಿಮಗಾಗಿ ಮತ್ತು ನಿಮ್ಮ ಕುಟುಂಬಕ್ಕಾಗಿ",feature2:"ಸುರಕ್ಷಿತ ಪರಿಶೀಲನೆ",feature2Text:"ಸುರಕ್ಷಿತ ಪರಿಶೀಲನಾ ಪ್ರಕ್ರಿಯೆಗಾಗಿ ವಿನ್ಯಾಸಗೊಳಿಸಲಾಗಿದೆ",feature3:"ನಿಮ್ಮ ಡೇಟಾ, ನಿಮ್ಮ ಗೌಪ್ಯತೆ",feature3Text:"ಅಗತ್ಯವಿರುವ ಮಾಹಿತಿಯನ್ನು ಮಾತ್ರ",feature4:"ವೇಗ ಮತ್ತು ಸರಳ",feature4Text:"ಕೆಲವೇ ನಿಮಿಷಗಳಲ್ಲಿ ಪೂರ್ಣಗೊಳಿಸಿ.",
  ration:"ಪಡಿತರ ಚೀಟಿ ಸಂಖ್ಯೆ",rationHint:"ಕೆಳಗಿನ ಕಾಲ್ಪನಿಕ ಡೆಮೊ ಕಾರ್ಡ್ ಬಳಸಿ.",demoRation:"KA-DEMO-2026-001",
  members:"ಕುಟುಂಬದ ಸದಸ್ಯರು",selectMember:"ಇ-ಕೆವೈಸಿ ಪೂರ್ಣಗೊಳಿಸುವ ಸದಸ್ಯರನ್ನು ಆಯ್ಕೆಮಾಡಿ.",
  required:"KYC ಅಗತ್ಯವಿದೆ",recent:"ಬಯೋಮೆಟ್ರಿಕ್ ಪರಿಶೀಲನೆ ಇತ್ತೀಚೆಗೆ ಪೂರ್ಣಗೊಂಡಿದೆ",
  consent:"ಸಮ್ಮತಿ ಮತ್ತು ಮಾಹಿತಿ",consentText:"ಮುಂದುವರಿಸುವ ಮೊದಲು ಮಾಹಿತಿಯನ್ನು ಪರಿಶೀಲಿಸಿ.",
  consent1:"ಆಧಾರ್ ಪರಿಶೀಲನೆ ಅನುಮೋದಿತ ಸೇವೆಯ ಮೂಲಕ ನಡೆಯುತ್ತದೆ.",consent2:"ಅನುಮೋದಿತ ಆಧಾರ್ ಪ್ರಕ್ರಿಯೆಯನ್ನು ಬಳಸಲಾಗುತ್ತದೆ.",consent3:"ಈ ಸೇವೆಗೆ ಅಗತ್ಯವಿರುವ ಮಾಹಿತಿಯನ್ನು ಮಾತ್ರ ಬಳಸಲಾಗುತ್ತದೆ.",
  agree:"ಒಪ್ಪುತ್ತೇನೆ ಮತ್ತು ಮುಂದುವರಿಸಿ",
  aadhaar:"ಆಧಾರ್ ಪರಿಶೀಲನೆ",aadhaarText:"OTP ದೃಢೀಕರಣಕ್ಕಾಗಿ ಆಧಾರ್ ವಿವರಗಳನ್ನು ನಮೂದಿಸಿ.",
  otp:"OTP ಪರಿಶೀಲನೆ",otpText:"ಆಧಾರ್‌ಗೆ ನೋಂದಾಯಿಸಿದ ಮೊಬೈಲ್‌ಗೆ OTP ಕಳುಹಿಸಲಾಗುತ್ತದೆ.",demoOtp:"ಡೆಮೊ OTP ಪರಿಶೀಲಿಸಲಾಗಿದೆ",
  verifyOtp:"OTP ಪರಿಶೀಲಿಸಿ",faceReady:"ಮುಖ ಸ್ಕ್ಯಾನ್‌ಗೆ ಸಿದ್ಧರಾಗಿ",faceText:"ಉತ್ತಮ ಬೆಳಕಿನ ಸ್ಥಳದಲ್ಲಿದ್ದು ಸೂಚನೆಗಳನ್ನು ಅನುಸರಿಸಿ.",
  face1:"ಮುಖವನ್ನು ಮುಚ್ಚಿರುವ ವಸ್ತುಗಳನ್ನು ತೆಗೆದುಹಾಕಿ",face2:"ಕ್ಯಾಮೆರಾವನ್ನು ನೇರವಾಗಿ ನೋಡಿ",face3:"ನಿಮ್ಮ ಮುಖವನ್ನು ಫ್ರೇಮ್ ಒಳಗೆ ಇರಿಸಿ",face4:"ಫೋನ್ ಅನ್ನು ಸ್ಥಿರವಾಗಿರಿಸಿ",ready:"ನಾನು ಸಿದ್ಧ",
  capture:"ಮುಖ ದೃಢೀಕರಣ",captureText:"ನಿಮ್ಮ ಮುಖವನ್ನು ಫ್ರೇಮ್ ಒಳಗೆ ಇರಿಸಿ",
  verifying:"ಗುರುತು ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ",wait:"ದೃಢೀಕರಣ ಪೂರ್ಣಗೊಳ್ಳುವವರೆಗೆ ಕಾಯಿರಿ.",
  authDone:"ಆಧಾರ್ ಪರಿಶೀಲನೆ ಪೂರ್ಣಗೊಂಡಿದೆ",pds:"ಪಡಿತರ ಚೀಟಿ ಇ-ಕೆವೈಸಿ",processing:"ನಿಮ್ಮ ಇ-ಕೆವೈಸಿ ಪೂರ್ಣಗೊಳ್ಳುತ್ತಿದೆ",
  success:"ಇ-ಕೆವೈಸಿ ಯಶಸ್ವಿಯಾಗಿ ಪೂರ್ಣಗೊಂಡಿದೆ!",successText:"ಈ ಸೇವೆಗಾಗಿ ನಿಮ್ಮ ಗುರುತು ಪರಿಶೀಲನೆ ಪೂರ್ಣಗೊಂಡಿದೆ.",
  reference:"ಉಲ್ಲೇಖ ಸಂಖ್ಯೆ",referenceValue:"NKYC-DEMO-2026-0001",status:"ಪೂರ್ಣಗೊಂಡಿದೆ",service:"ಪಡಿತರ ಚೀಟಿ ಇ-ಕೆವೈಸಿ",
  statusTitle:"ಇ-ಕೆವೈಸಿ ಸ್ಥಿತಿ",submitted:"ವಿನಂತಿ ಸಲ್ಲಿಸಲಾಗಿದೆ",otpDone:"OTP ಪರಿಶೀಲಿಸಲಾಗಿದೆ",faceDone:"ಬಯೋಮೆಟ್ರಿಕ್ ಪರಿಶೀಲನೆ ಪೂರ್ಣಗೊಂಡಿದೆ",pdsDone:"ಪಡಿತರ ಚೀಟಿ ಇ-ಕೆವೈಸಿ ಪೂರ್ಣಗೊಂಡಿದೆ",
  steps:["ಸ್ವಾಗತ","ಪಡಿತರ ಚೀಟಿ","ಸದಸ್ಯರು","ಸಮ್ಮತಿ","OTP","ಮುಖ","ಪರಿಶೀಲನೆ","ಪೂರ್ಣ","ಸ್ಥಿತಿ"],demo:"ಡೆಮೊ",simulation:"ಸಿಮ್ಯುಲೇಶನ್ ಮಾತ್ರ"
};
let lang="en",step=0;
const S=()=>lang==="en"?EN:KN;
function mark(){return '<img class="brand-mark-img" src="'+MARK+'" alt="'+S().app+'">'}
function emblem(){return '<img class="karnataka-emblem" src="https://upload.wikimedia.org/wikipedia/commons/a/aa/Seal_of_Karnataka.svg" alt="'+S().gov+'">'}
function soudha(){return '<img class="soudha-photo" src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Government_Karnataka_8352.jpg" alt="Vidhana Soudha, Bengaluru">'}
function family(){return '<div class="family-art"><div class="person father"></div><div class="person mother"></div><div class="person child"></div></div>'}
function button(label,next,cls="primary"){return '<button class="'+cls+'" data-next="'+next+'">'+label+' <b>→</b></button>'}
function feature(icon,title,text){return '<div class="feature-row"><span class="feature-icon '+icon+'"></span><div><b>'+title+'</b><small>'+text+'</small></div></div>'}
function render(){
 const s=S();
 document.getElementById("tagline").textContent=s.tagline;
 document.getElementById("language").textContent=s.language;
 document.getElementById("start").textContent=s.getStarted;
 document.getElementById("reset").textContent=s.reset;
 document.querySelector(".app-top").classList.toggle("hidden",step===0); document.getElementById("progress").classList.toggle("hidden",step===0);
 document.getElementById("progress-fill").style.width=(step?Math.round(step/9*100):0)+"%";
 document.getElementById("progress-label").textContent=step?s.steps[step-1]+" · "+step+" / 9":"";
 document.getElementById("steps").innerHTML=s.steps.map((x,i)=>'<button class="demo-step '+(i===step-1?"active":"")+'" data-step="'+(i+1)+'">'+(i+1)+". "+x+"</button>").join("");
 document.querySelectorAll(".demo-step").forEach(b=>b.onclick=()=>{step=Number(b.dataset.step);render()});
 document.getElementById("screen").innerHTML=screen(s); wire();
}
function screen(s){
 if(step===0)return '<div class="splash"><div class="splash-top">'+emblem()+'<div><div class="gov">'+s.gov+'</div><small>'+(lang==="en"?"Karnataka State Services":"ಕರ್ನಾಟಕ ರಾಜ್ಯ ಸೇವೆಗಳು")+'</small></div><button class="splash-language" id="splash-language">'+s.language+'</button></div><h1>'+s.app+'</h1><p class="splash-tag">'+(lang==="en"?"Secure Identity. Better Services. A Stronger Karnataka.":"ಸುರಕ್ಷಿತ ಗುರುತು. ಉತ್ತಮ ಸೇವೆಗಳು. ಸದೃಢ ಕರ್ನಾಟಕ.")+'</p>'+soudha()+'<div class="splash-values"><span>♙<b>'+(lang==="en"?"People First":"ಜನರಿಗೆ ಮೊದಲ ಆದ್ಯತೆ")+'</b></span><span>✦<b>'+(lang==="en"?"Simple Access":"ಸರಳ ಪ್ರವೇಶ")+'</b></span><span>♡<b>'+(lang==="en"?"Digital Karnataka":"ಡಿಜಿಟಲ್ ಕರ್ನಾಟಕ")+'</b></span></div>'+button(s.getStarted,1)+'<small class="independent">'+(lang==="en"?"Independent open-source citizen initiative":"ಸ್ವತಂತ್ರ ಮುಕ್ತ-ಮೂಲ ನಾಗರಿಕ ಉಪಕ್ರಮ")+'</small></div>';
 if(step===1)return '<div class="screen-card welcome-card"><div class="welcome-top">'+mark()+'<div class="welcome-progress"><i></i><i></i><i></i></div></div><h2>'+s.welcome+'</h2><p>'+s.welcomeText+'</p>'+feature("card",s.feature1,s.feature1Text)+feature("shield",s.feature2,s.feature2Text)+feature("privacy",s.feature3,s.feature3Text)+feature("bolt",s.feature4,s.feature4Text)+family()+button(s.continue,2)+'</div>';
 if(step===2)return '<div class="screen-card"><div class="screen-head"><b>'+s.ration+'</b></div><p>'+s.rationHint+'</p><div class="demo-input">'+s.demoRation+'</div>'+button(s.continue,3)+'</div>';
 if(step===3)return '<div class="screen-card"><div class="screen-head"><b>'+s.members+'</b></div><p>'+s.selectMember+'</p><div class="member-row selected"><span class="avatar">A</span><span><b>Anitha Rao</b><small>'+s.required+'</small></span><i>›</i></div><div class="member-row completed"><span class="avatar">✓</span><span><b>Ravi Kumar</b><small>'+s.recent+'</small></span><i>✓</i></div>'+button(s.continue,4)+'</div>';
 if(step===4)return '<div class="screen-card"><div class="screen-head"><b>'+s.consent+'</b></div><p>'+s.consentText+'</p><div class="consent-list"><p>✓ '+s.consent1+'</p><p>✓ '+s.consent2+'</p><p>✓ '+s.consent3+'</p></div>'+button(s.agree,5)+'</div>';
 if(step===5)return '<div class="screen-card"><div class="screen-head"><b>'+s.otp+'</b></div><p>'+s.aadhaarText+'</p><div class="aadhaar-field">•••• •••• ••••</div><div class="otp-box"><b>✓</b><span>'+s.demoOtp+'</span></div>'+button(s.verifyOtp,6)+'</div>';
 if(step===6)return '<div class="screen-card"><div class="screen-head"><b>'+s.faceReady+'</b></div><p>'+s.faceText+'</p><div class="face-guide"><div class="face-outline"></div></div><div class="instruction-list"><p>✓ '+s.face1+'</p><p>✓ '+s.face2+'</p><p>✓ '+s.face3+'</p><p>✓ '+s.face4+'</p></div>'+button(s.ready,7)+'</div>';
 if(step===7)return '<div class="screen-card center"><div class="capture-frame"><div class="face-outline"></div><span>'+s.captureText+'</span></div><div class="verify-title">'+s.verifying+'</div><p>'+s.wait+'</p><div class="timeline">'+[s.otpDone,s.faceDone,s.pdsDone].map((x,i)=>'<div class="timeline-row"><span class="dot '+(i<2?"done":"active")+'">'+(i<2?"✓":"•")+'</span><p>'+x+'</p></div>').join("")+'</div>'+button(s.continue,8)+'</div>';
 if(step===8)return '<div class="screen-card center success"><div class="success-check">✓</div><h2>'+s.success+'</h2><p>'+s.successText+'</p><div class="details"><small>'+s.reference+'</small><code>'+s.referenceValue+'</code><small>'+s.service+'</small><b>'+s.status+'</b></div>'+button(s.continue,9)+'</div>';
 return '<div class="screen-card"><div class="screen-head"><b>'+s.statusTitle+'</b></div><div class="status-member"><span class="avatar">A</span><b>Anitha Rao</b><small>'+s.faceDone+'</small></div><div class="timeline big">'+[s.submitted,s.otpDone,s.faceDone,s.pdsDone].map(x=>'<div class="timeline-row"><span class="dot done">✓</span><p><b>'+x+'</b></p></div>').join("")+'</div><div class="details"><small>'+s.reference+'</small><code>'+s.referenceValue+'</code></div>'+button(s.reset,0,"secondary")+'</div>';
}
function wire(){
 document.querySelectorAll("[data-next]").forEach(b=>b.onclick=()=>{step=Number(b.dataset.next);render()});
 document.getElementById("language").onclick=()=>{lang=lang==="en"?"kn":"en";render()}; const splashLanguage=document.getElementById("splash-language"); if(splashLanguage)splashLanguage.onclick=()=>{lang=lang==="en"?"kn":"en";render()};
 document.getElementById("start").onclick=()=>{step=1;render()};
 document.getElementById("reset").onclick=()=>{step=0;render()};
}
render();
