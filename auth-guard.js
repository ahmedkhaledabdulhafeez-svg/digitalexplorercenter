import { auth } from "./firebase-config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const MIN_DISPLAY_MS = 1500; // مدة الظهور في أول فتح للرابط من الخارج فقط
const loadStartTime = Date.now();

// التحقق هل الطالب بالفعل بيتصفح جوه الموقع حالياً في نفس التاب ولا فاتح رابط من بره
let isSessionVerified = false;
try {
  isSessionVerified = sessionStorage.getItem("explorerSessionVerified") === "true";
} catch (_) {}

let loaderStyle = null;
let preloader = null;

// لو أول مرة يفتح من بره أو مش متأكدين من جلسته، اعرض شاشة اللوجو
if (!isSessionVerified) {
  loaderStyle = document.createElement("style");
  loaderStyle.id = "auth-preloader-style";
  loaderStyle.textContent = `
    html, body { overflow: hidden !important; }
    #auth-preloader {
      position: fixed;
      inset: 0;
      z-index: 999999;
      background: radial-gradient(circle at center, #4a2a1c 0%, #2e1a10 75%, #22120a 100%);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 20px;
      transition: opacity 0.4s ease, visibility 0.4s ease;
    }
    #auth-preloader.hide {
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
    }
    #auth-preloader .loader-orb {
      position: relative;
      width: 155px;
      height: 155px;
      display: grid;
      place-items: center;
    }
    #auth-preloader .loader-halo {
      position: absolute;
      inset: -24%;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(240, 180, 76, 0.38), transparent 65%);
      animation: authHaloPulse 2.4s ease-in-out infinite;
    }
    #auth-preloader .loader-ring-outer {
      position: absolute;
      inset: 0;
      border-radius: 50%;
      border: 2.5px dashed rgba(240, 180, 76, 0.65);
      animation: authSpin 14s linear infinite;
    }
    #auth-preloader .loader-ring-inner {
      position: absolute;
      inset: 10px;
      border-radius: 50%;
      background: conic-gradient(from 0deg, transparent 0 65%, #f0b44c 100%);
      -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 3.5px), #000 calc(100% - 2.5px));
      mask: radial-gradient(farthest-side, transparent calc(100% - 3.5px), #000 calc(100% - 2.5px));
      animation: authSpinReverse 2.2s linear infinite;
    }
    #auth-preloader .loader-core {
      position: relative;
      z-index: 2;
      width: 112px;
      height: 112px;
      border-radius: 50%;
      padding: 12px;
      background: rgba(255, 255, 255, 0.08);
      backdrop-filter: blur(8px);
      border: 1.5px solid rgba(240, 180, 76, 0.45);
      box-shadow: 0 0 40px rgba(240, 180, 76, 0.35), inset 0 0 20px rgba(255, 255, 255, 0.1);
      display: grid;
      place-items: center;
      overflow: hidden;
      animation: authFloat 2.6s ease-in-out infinite;
    }
    #auth-preloader .loader-core::after {
      content: "";
      position: absolute;
      inset: -40%;
      background: linear-gradient(110deg, transparent 40%, rgba(255, 255, 255, 0.38) 50%, transparent 60%);
      animation: authSweep 2s ease-in-out infinite;
    }
    #auth-preloader img {
      position: relative;
      z-index: 1;
      width: 100%;
      height: 100%;
      object-fit: contain;
      filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.5));
    }
    #auth-preloader .loader-title {
      font-family: 'Reem Kufi', 'Cairo', system-ui, sans-serif;
      font-size: 1.45rem;
      font-weight: 700;
      color: #f0b44c;
      text-shadow: 0 2px 14px rgba(240, 180, 76, 0.3);
      margin-top: 4px;
    }
    #auth-preloader .loader-sub {
      font-family: 'Cairo', system-ui, sans-serif;
      color: #f3dcb8;
      font-size: 0.92rem;
      font-weight: 600;
      opacity: 0.88;
    }
    @keyframes authSpin { to { transform: rotate(360deg); } }
    @keyframes authSpinReverse { to { transform: rotate(-360deg); } }
    @keyframes authFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-7px); } }
    @keyframes authHaloPulse { 0%, 100% { opacity: 0.65; transform: scale(0.95); } 50% { opacity: 1; transform: scale(1.06); } }
    @keyframes authSweep { 0% { transform: translateX(-70%); } 100% { transform: translateX(70%); } }
  `;
  document.head.appendChild(loaderStyle);

  preloader = document.createElement("div");
  preloader.id = "auth-preloader";
  preloader.innerHTML = `
    <div class="loader-orb">
      <span class="loader-halo"></span>
      <span class="loader-ring-outer"></span>
      <span class="loader-ring-inner"></span>
      <div class="loader-core">
        <img src="https://i.postimg.cc/ZnF2Hzfs/almstkshf-alrqmy.png" alt="مركز المستكشف الرقمي">
      </div>
    </div>
    <div class="loader-title">مركز المستكشف الرقمي</div>
    <div class="loader-sub">جاري تجهيز بيئة التعلم...</div>
  `;
  (document.body || document.documentElement).appendChild(preloader);
}

// دالة التحويل لصفحة الدخول
function redirectToLogin() {
  const decodedPath = decodeURIComponent(window.location.pathname);
  const isSubfolder = decodedPath.includes("/قسم-") || decodedPath.includes("/الشخصيات-");
  window.location.replace(isSubfolder ? "../index.html" : "index.html");
}

// التحقق الفعلي من Firebase في كل الحالات
onAuthStateChanged(auth, (user) => {
  if (!user) {
    try {
      localStorage.removeItem("explorerUserName");
      sessionStorage.removeItem("explorerSessionVerified");
    } catch (_) {}

    if (preloader) {
      const elapsed = Date.now() - loadStartTime;
      const wait = Math.max(0, Math.min(900, MIN_DISPLAY_MS - elapsed));
      setTimeout(redirectToLogin, wait);
    } else {
      redirectToLogin();
    }
  } else {
    const displayName = user.displayName || user.email.split("@")[0];
    try {
      localStorage.setItem("explorerUserName", displayName);
      sessionStorage.setItem("explorerSessionVerified", "true");
    } catch (_) {}

    const nameTargets = document.querySelectorAll("#user-display-name, #userName, .user-name");
    nameTargets.forEach((el) => {
      el.textContent = displayName;
    });

    // لو شاشة التحميل كانت ظاهرة (أول فتح للرابط)، اخفيها بعد المدة المحددة
    if (preloader) {
      const elapsed = Date.now() - loadStartTime;
      const remainingTime = Math.max(0, MIN_DISPLAY_MS - elapsed);
      setTimeout(() => {
        preloader.classList.add("hide");
        setTimeout(() => {
          preloader.remove();
          if (loaderStyle) loaderStyle.remove();
        }, 420);
      }, remainingTime);
    }
  }
});

// تفعيل تسجيل الخروج
document.addEventListener("click", async (e) => {
  const logoutTrigger = e.target.closest("#logout-btn, #logoutBtn, .logout-btn");
  if (logoutTrigger) {
    e.preventDefault();
    try {
      await signOut(auth);
      try {
        localStorage.removeItem("explorerUserName");
        sessionStorage.removeItem("explorerSessionVerified");
      } catch (_) {}
      redirectToLogin();
    } catch (error) {
      console.error("خطأ أثناء تسجيل الخروج:", error);
    }
  }
});
