import { auth } from "./firebase-config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// إخفاء الصفحة مؤقتاً لحين التحقق من الجلسة حتى لا يظهر المحتوى لغير المسجلين
document.documentElement.style.visibility = "hidden";

// تحديد مسار العودة لصفحة الدخول سواء كانت الصفحة في المجلد الرئيسي أو مجلد فرعي
function redirectToLogin() {
  const isSubfolder = window.location.pathname.includes("/قسم-") || window.location.pathname.includes("/الشخصيات-");
  window.location.replace(isSubfolder ? "../index.html" : "index.html");
}

onAuthStateChanged(auth, (user) => {
  if (!user) {
    // المستخدم غير مسجل دخول -> طرد فوري لصفحة الدخول
    try { localStorage.removeItem("explorerUserName"); } catch (_) {}
    redirectToLogin();
  } else {
    // المستخدم مسجل دخول -> حفظ اسمه وإظهار الصفحة
    const displayName = user.displayName || user.email.split("@")[0];
    try { localStorage.setItem("explorerUserName", displayName); } catch (_) {}

    // تحديث أي عنصر بيعرض اسم الطالب في الصفحة
    const nameTargets = document.querySelectorAll("#user-display-name, #userName, .user-name");
    nameTargets.forEach((el) => {
      el.textContent = displayName;
    });

    // إظهار محتوى الصفحة الآن بأمان
    document.documentElement.style.visibility = "visible";
  }
});

// تفعيل تسجيل الخروج لأي زر يحمل id="logout-btn" أو class="logout-btn"
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
