document.getElementById('inquiry').addEventListener('submit',function(event){
  event.preventDefault();
  const data=new FormData(event.currentTarget);
  const body=['성함: '+data.get('name'),'기관명: '+data.get('organization'),'연락처: '+data.get('contact'),'교육 희망일: '+(data.get('date')||'협의 희망'),'','교육 대상 및 희망 내용:',data.get('message')||'상담 요청'].join('\n');
  window.location.href='mailto:nalynnxx@naver.com?subject='+encodeURIComponent('AI 교육 문의 | '+data.get('organization'))+'&body='+encodeURIComponent(body);
  document.getElementById('form-status').textContent='이메일 앱에서 내용을 확인한 뒤 직접 보내주세요. 앱이 열리지 않으면 nalynnxx@naver.com으로 문의해 주세요.';
});

const motionPreference=window.matchMedia('(prefers-reduced-motion: reduce)');
const revealTargets=document.querySelectorAll('.section h2,.grid article,.featured,.profile-grid,.process li,.faqs details');
let revealObserver;
function configureMotion(){
  if(revealObserver) revealObserver.disconnect();
  revealTargets.forEach(el=>el.classList.remove('reveal','visible'));
  if(motionPreference.matches||!('IntersectionObserver' in window)) return;
  revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(entry.isIntersecting){entry.target.classList.add('visible');revealObserver.unobserve(entry.target);}
  }),{threshold:0.08});
  revealTargets.forEach((el,i)=>{el.style.setProperty('--delay',(i%3)*65+'ms');el.classList.add('reveal');revealObserver.observe(el);});
}
configureMotion();
motionPreference.addEventListener('change',configureMotion);
let scrollPending=false;
function updateProgress(){
  const available=document.documentElement.scrollHeight-window.innerHeight;
  document.querySelector('.scroll-progress').style.transform='scaleX('+(available>0?Math.min(1,Math.max(0,window.scrollY/available)):0)+')';
  scrollPending=false;
}
window.addEventListener('scroll',()=>{if(!scrollPending){scrollPending=true;requestAnimationFrame(updateProgress);}},{passive:true});
window.addEventListener('resize',updateProgress);
updateProgress();

const menuButton=document.querySelector('.menu-toggle');
const primaryNav=document.getElementById('primary-nav');
const mobileMenuQuery=window.matchMedia('(max-width: 650px)');
function setMenu(open){
  menuButton.setAttribute('aria-expanded',String(open));
  primaryNav.hidden=mobileMenuQuery.matches&&!open;
}
function adaptMenu(){setMenu(false);}
menuButton.addEventListener('click',()=>setMenu(menuButton.getAttribute('aria-expanded')!=='true'));
primaryNav.addEventListener('click',event=>{if(event.target.closest('a'))setMenu(false);});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&mobileMenuQuery.matches&&menuButton.getAttribute('aria-expanded')==='true'){setMenu(false);menuButton.focus();}});
mobileMenuQuery.addEventListener('change',adaptMenu);
adaptMenu();
