import { auth } from "./firebase-config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const MIN_DISPLAY_MS = 1200;
const loadStartTime = Date.now();

function clearFallback() {
  if (window.__authFallback) {
    clearTimeout(window.__authFallback);
    window.__authFallback = null;
  }
}

function redirectToLogin() {
  clearFallback();
  const decodedPath = decodeURIComponent(window.location.pathname);
  const isSubfolder = decodedPath.includes("/قسم-") || decodedPath.includes("/الشخصيات-");
  window.location.replace(isSubfolder ? "../index.html" : "index.html");
}

function hidePreloader() {
  clearFallback();
  const preloader = document.getElementById("auth-preloader");
  const preStyle = document.getElementById("pre-s");
  if (!preloader) return;

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

onAuthStateChanged(auth, (user) => {
  clearFallback();
  if (!user) {
    try {
      localStorage.removeItem("explorerUserName");
      sessionStorage.removeItem("explorerSessionVerified");
    } catch (_) {}
    redirectToLogin();
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

    hidePreloader();
  }
});

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
