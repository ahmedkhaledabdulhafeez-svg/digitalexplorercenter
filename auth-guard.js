import { auth } from "./firebase-config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const MIN_DISPLAY_MS = 1500;
const loadStartTime = Date.now();

function redirectToLogin() {
  window.location.replace("/index.html");
}

function hidePreloader() {
  const preloader = document.getElementById("auth-preloader");
  const preStyle = document.getElementById("pre-s");

  // تنقل داخلي: مفيش لوجو، نتأكد بس إن أي ستايل مؤقت اتشال
  if (!preloader) {
    if (preStyle) preStyle.remove();
    return;
  }

  // أول زيارة في التاب: اللوجو يفضل ثانية ونص على الأقل
  const elapsed = Date.now() - loadStartTime;
  const remainingTime = Math.max(0, MIN_DISPLAY_MS - elapsed);

  setTimeout(() => {
    preloader.classList.add("hide");
    setTimeout(() => {
      preloader.remove();
      if (preStyle) preStyle.remove();
    }, 400);
  }, remainingTime);
}

function clearSession() {
  try {
    localStorage.removeItem("explorerUserName");
    sessionStorage.removeItem("explorerSessionVerified");
  } catch (_) {}
}

onAuthStateChanged(auth, (user) => {
  if (!user) {
    clearSession();
    redirectToLogin();
    return;
  }

  const displayName = user.displayName || (user.email ? user.email.split("@")[0] : "طالب");
  try {
    localStorage.setItem("explorerUserName", displayName);
    sessionStorage.setItem("explorerSessionVerified", "true");
  } catch (_) {}

  document
    .querySelectorAll("#user-display-name, #userName, .user-name")
    .forEach((el) => {
      el.textContent = displayName;
    });

  hidePreloader();
});

document.addEventListener("click", async (e) => {
  const logoutTrigger = e.target.closest("#logout-btn, #logoutBtn, .logout-btn");
  if (!logoutTrigger) return;

  e.preventDefault();
  try {
    await signOut(auth);
    clearSession();
    redirectToLogin();
  } catch (error) {
    console.error("خطأ أثناء تسجيل الخروج:", error);
  }
});
