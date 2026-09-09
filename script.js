// EmailJS 공개 설정 — 대시보드 값과 함께 관리합니다.
const EMAILJS_PUBLIC_KEY = "k0xCsb5Xht_HgXSwc";
const EMAILJS_SERVICE_ID = "service_2i361vz";
const EMAILJS_TEMPLATE_ID = "template_s8b63b4"; // 접수 알림
const EMAILJS_AUTOREPLY_ID = "template_7g3ae1n"; // 자동회신
// 배포 주소의 단일 원본 — 정적 검색 파일과 메타정보도 이 값으로 생성합니다.
const SITE_URL = "https://ai-3-opal.vercel.app/";
const NOTIFY_EMAIL = "pulynn01@gmail.com";

const inquiryForm = document.getElementById('inquiry');
const consent = inquiryForm.elements.privacy_agreed;
const submitButton = inquiryForm.querySelector('button[type="submit"]');
const formStatus = document.getElementById('form-status');
let sending = false;
consent.addEventListener('change', () => {
  inquiryForm.elements.agreed_at.value = consent.checked ? new Date().toISOString() : '';
  submitButton.disabled = !consent.checked || sending;
  document.getElementById('consent-help').textContent = consent.checked ? '동의가 확인되었습니다.' : '문의 전송을 위해 개인정보 수집 · 이용에 동의해 주세요.';
});
document.getElementById('submit-area').addEventListener('click', () => {
  if (!consent.checked) formStatus.textContent = '개인정보 수집 · 이용에 동의해 주세요.';
});
inquiryForm.addEventListener('submit', async event => {
  event.preventDefault();
  if (sending) return;
  if (!consent.checked) { formStatus.textContent = '개인정보 수집 · 이용에 동의해 주세요.'; consent.focus(); return; }
  if (!inquiryForm.reportValidity()) return;
  if (!inquiryForm.elements.from_name.value.trim() || !inquiryForm.elements.message.value.trim()) {
    formStatus.textContent = '이름과 문의 내용을 입력해 주세요.'; return;
  }
  if (!window.emailjs) { formStatus.textContent = '메일 전송 기능을 불러오지 못했습니다. 새로고침 후 다시 시도해 주세요.'; return; }
  inquiryForm.elements.to_email.value = NOTIFY_EMAIL;
  inquiryForm.elements.reply_to.value = inquiryForm.elements.from_email.value.trim();
  inquiryForm.elements.submitted_at.value = new Date().toISOString();
  inquiryForm.elements.page_url.value = window.location.href;
  if (!inquiryForm.elements.agreed_at.value) inquiryForm.elements.agreed_at.value = new Date().toISOString();
  const params = Object.fromEntries(new FormData(inquiryForm));
  params.privacy_agreed = '동의';
  sending = true; submitButton.disabled = true;
  inquiryForm.setAttribute('aria-busy','true');
  formStatus.textContent = '문의를 전송하고 있습니다. 잠시 기다려 주세요.';
  let accepted = false;
  try {
    await window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, params, {publicKey: EMAILJS_PUBLIC_KEY});
    accepted = true;
    // 초당 1회 제한을 지키고, 두 템플릿을 별도로 발송합니다.
    await new Promise(resolve => setTimeout(resolve, 1100));
    await window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_AUTOREPLY_ID, params, {publicKey: EMAILJS_PUBLIC_KEY});
    formStatus.textContent = '문의가 접수되었습니다. 입력하신 이메일로 접수 확인 메일을 보냈습니다.';
  } catch (error) {
    formStatus.textContent = accepted
      ? '문의는 접수되었으나 확인 메일을 보내지 못했습니다. 다시 접수하지 않으셔도 됩니다.'
      : '문의 전송에 실패했습니다. 입력 내용은 유지됩니다. 잠시 후 다시 시도하거나 기존 이메일로 문의해 주세요.';
  } finally {
    if (accepted) {
      inquiryForm.reset(); inquiryForm.elements.agreed_at.value = '';
      document.getElementById('consent-help').textContent = '문의 전송을 위해 개인정보 수집 · 이용에 동의해 주세요.';
    }
    sending = false; submitButton.disabled = !consent.checked;
    inquiryForm.setAttribute('aria-busy','false');
  }
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
