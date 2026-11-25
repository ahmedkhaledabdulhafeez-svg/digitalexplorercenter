import { auth } from "./firebase-config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// 1. حقن شاشة تحميل فورية تغطي المحتوى بالكامل بلون الموقع وشعار المنصة
const loaderStyle = document.createElement("style");
loaderStyle.id = "auth-preloader-style";
loaderStyle.textContent = `
  html, body { overflow: hidden !important; }
  #auth-preloader {
    position: fixed;
    inset: 0;
    z-index: 999999;
    background: radial-gradient(circle at center, #42251a 0%, #2e1a10 100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 18px;
    transition: opacity 0.35s ease, visibility 0.35s ease;
  }
  #auth-preloader.hide {
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
  }
  #auth-preloader .loader-ring {
    width: 96px;
    height: 96px;
    border-radius: 50%;
    padding: 12px;
    background: rgba(255, 255, 255, 0.06);
    border: 2px solid rgba(240, 180, 76, 0.45);
    box-shadow: 0 0 35px rgba(240, 180, 76, 0.28);
    animation: authPulse 1.6s ease-in-out infinite;
    display: grid;
    place-items: center;
  }
  #auth-preloader img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  #auth-preloader span {
    font-family: 'Cairo', system-ui, sans-serif;
    color: #f3dcb8;
    font-size: 0.95rem;
    font-weight: 700;
    letter-spacing: 0.3px;
  }
  @keyframes authPulse {
    0%, 100% { transform: scale(1); box-shadow: 0 0 25px rgba(240, 180, 76, 0.25); }
    50% { transform: scale(1.07); box-shadow: 0 0 45px rgba(240, 180, 76, 0.55); }
  }
`;
document.head.appendChild(loaderStyle);

const preloader = document.createElement("div");
preloader.id = "auth-preloader";
preloader.innerHTML = `
  <div class="loader-ring">
    <img src="https://i.postimg.cc/ZnF2Hzfs/almstkshf-alrqmy.png" alt="مركز المستكشف الرقمي">
  </div>
  <span>جاري التحقق من جلسة المستكشف...</span>
`;
(document.body || document.documentElement).appendChild(preloader);

// 2. دالة التحويل لصفحة الدخول (تدعم المسارات العربية والفرعية)
function redirectToLogin() {
  const decodedPath = decodeURIComponent(window.location.pathname);
  const isSubfolder = decodedPath.includes("/قسم-") || decodedPath.includes("/الشخصيات-");
  window.location.replace(isSubfolder ? "../index.html" : "index.html");
}

// 3. التحقق من حالة تسجيل الدخول
onAuthStateChanged(auth, (user) => {
  if (!user) {
    try { localStorage.removeItem("explorerUserName"); } catch (_) {}
    redirectToLogin();
  } else {
    const displayName = user.displayName || user.email.split("@")[0];
    try { localStorage.setItem("explorerUserName", displayName); } catch (_) {}

    const nameTargets = document.querySelectorAll("#user-display-name, #userName, .user-name");
    nameTargets.forEach((el) => {
      el.textContent = displayName;
    });

    // إظهار الصفحة وإزالة شاشة التحميل بنعومة
    preloader.classList.add("hide");
    setTimeout(() => {
      preloader.remove();
      loaderStyle.remove();
    }, 360);
  }
});

// 4. تفعيل تسجيل الخروج
document.addEventListener("click", async (e) => {
  const logoutTrigger = e.target.closest("#logout-btn, #logoutBtn, .logout-btn");
  if (logoutTrigger) {
    e.preventDefault();
    try {
      await signOut(auth);
      try { localStorage.removeItem("explorerUserName"); } catch (_) {}
      redirectToLogin();
    } catch (error) {
      console.error("خطأ أثناء تسجيل الخروج:", error);
    }
  }
});
