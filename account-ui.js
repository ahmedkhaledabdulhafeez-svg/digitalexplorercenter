(function () {
  if (window.__explorerAccountUIInitialized) return;
  window.__explorerAccountUIInitialized = true;

  function resolveRootPrefix() {
    const pathname = window.location.pathname || "";
    if (
      pathname.includes("/قسم-الجغرافيا/") ||
      pathname.includes("/قسم-التاريخ/") ||
      pathname.includes("/محاكاة-الشخصيات/") ||
      pathname.includes("/الخرائط/")
    ) {
      return "../";
    }
    return "./";
  }

  const rootPrefix = resolveRootPrefix();

  const styleEl = document.createElement("style");
  styleEl.id = "explorer-account-ui-style";
  styleEl.textContent = `
    .nav-account {
      position: sticky;
      right: 0;
      top: 0;
      z-index: 75;
      flex-shrink: 0;
      margin-inline-end: 10px;
    }
    .account-trigger {
      width: 40px;
      height: 40px;
      padding: 0;
      border-radius: 50%;
      border: 2px solid var(--gold, #f0b44c);
      background: radial-gradient(circle at top, #5c3622, #24130b);
      color: var(--gold, #f0b44c);
      display: grid;
      place-items: center;
      font-family: 'Cairo', sans-serif;
      font-size: .95rem;
      font-weight: 800;
      cursor: pointer;
      transition: .25s;
      box-shadow: 0 0 0 2px rgba(200, 130, 90, .35), 0 4px 12px rgba(0, 0, 0, .35);
      overflow: hidden;
    }
    .account-trigger:hover {
      transform: scale(1.06);
      border-color: var(--sand, #f3dcb8);
    }
    .account-trigger img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
      border-radius: 50%;
      display: block;
    }

    .account-menu {
      position: fixed;
      top: auto;
      right: 12px;
      width: min(330px, calc(100vw - 24px));
      max-height: calc(100vh - 115px);
      overflow-y: auto;
      overflow-x: hidden;
      -webkit-overflow-scrolling: touch;
      overscroll-behavior: contain;
      touch-action: pan-y;
      background: var(--panel, #3a2116);
      border: 1.5px solid var(--copper, #c8825a);
      border-radius: 18px;
      box-shadow: 0 18px 40px rgba(0, 0, 0, .72);
      padding: 14px 12px;
      display: none;
      z-index: 95;
      font-family: 'Cairo', sans-serif;
      direction: rtl;
      color: var(--text, #f6e8d4);
    }
    .account-menu.open {
      display: block;
      animation: explorerMenuPop .2s ease;
    }
    @keyframes explorerMenuPop {
      from { opacity: 0; transform: translateY(-6px) scale(.98); }
      to { opacity: 1; transform: none; }
    }

    .account-hero-box {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 8px;
      padding-bottom: 10px;
      margin-bottom: 10px;
      border-bottom: 1px dashed var(--line, rgba(224, 160, 110, .22));
    }
    .account-big-avatar {
      width: 88px;
      height: 88px;
      border-radius: 50%;
      border: 2.5px solid var(--gold, #f0b44c);
      background: radial-gradient(circle at top, #5c3622, #24130b);
      color: var(--gold, #f0b44c);
      display: grid;
      place-items: center;
      font-size: 2rem;
      font-weight: 800;
      overflow: hidden;
      box-shadow: 0 6px 20px rgba(0, 0, 0, .45);
    }
    .account-big-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
      border-radius: 50%;
      display: block;
    }
    .account-menu-name {
      font-size: .94rem;
      font-weight: 800;
      color: var(--gold, #f0b44c);
      word-break: break-word;
      text-align: center;
    }

    .menu-action-item {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 8px 12px;
      border: 1px solid var(--line, rgba(224, 160, 110, .22));
      border-radius: 12px;
      background: rgba(0, 0, 0, .22);
      color: var(--sand, #f3dcb8);
      font-family: 'Cairo', sans-serif;
      font-size: .84rem;
      font-weight: 700;
      cursor: pointer;
      transition: .2s;
      margin-bottom: 10px;
    }
    .menu-action-item:hover {
      background: rgba(240, 180, 76, .16);
      color: var(--gold, #f0b44c);
      border-color: var(--gold, #f0b44c);
    }

    .student-form {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 10px;
      border-radius: 14px;
      background: rgba(0, 0, 0, .22);
      border: 1px solid var(--line, rgba(224, 160, 110, .22));
    }
    .student-field {
      display: flex;
      flex-direction: column;
      gap: 3px;
    }
    .student-field label {
      font-size: .75rem;
      font-weight: 700;
      color: var(--mute, #c9ae94);
    }
    .student-field input {
      width: 100%;
      padding: 7px 10px;
      border-radius: 10px;
      border: 1px solid var(--line, rgba(224, 160, 110, .22));
      background: rgba(46, 26, 16, .85);
      color: var(--text, #f6e8d4);
      font-family: 'Cairo', sans-serif;
      font-size: .82rem;
      outline: none;
    }
    .student-field input:focus {
      border-color: var(--gold, #f0b44c);
    }
    .student-row-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }
    .save-profile-btn {
      width: 100%;
      padding: 8px 12px;
      border: none;
      border-radius: 12px;
      background: var(--copper, #c8825a);
      color: #2a150b;
      font-family: 'Cairo', sans-serif;
      font-size: .84rem;
      font-weight: 800;
      cursor: pointer;
      transition: .2s;
      margin-top: 2px;
    }
    .save-profile-btn:hover {
      background: var(--gold, #f0b44c);
    }
    .save-profile-btn:disabled {
      opacity: .65;
      cursor: not-allowed;
    }
    .profile-status {
      font-size: .76rem;
      font-weight: 700;
      text-align: center;
      min-height: 16px;
      color: var(--gold, #f0b44c);
    }

    .logout-item {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 9px 12px;
      border: 1px solid rgba(255, 77, 77, .45);
      border-radius: 12px;
      background: rgba(220, 38, 38, .18);
      color: #ff5252;
      font-family: 'Cairo', sans-serif;
      font-size: .86rem;
      font-weight: 800;
      cursor: pointer;
      transition: .2s;
      margin-top: 10px;
      text-align: center;
    }
    .logout-item:hover,
    .logout-item:focus-visible {
      background: rgba(220, 38, 38, .32);
      color: #ff6b6b;
      border-color: #ff5252;
    }

    @media (min-width: 760px) {
      .nav-account {
        position: absolute;
        right: 20px;
        top: 50%;
        transform: translateY(-50%);
        margin-inline-end: 0;
      }
      .account-menu {
        position: absolute;
        top: calc(100% + 8px);
        right: 0;
      }
    }
    @media (max-width: 759px) {
      nav .in {
        justify-content: flex-start;
        padding: 0 10px;
        gap: 6px;
        overflow: visible;
      }
      .nav-links {
        justify-content: flex-start;
        overflow-x: auto;
        scrollbar-width: none;
        -webkit-overflow-scrolling: touch;
        flex: 1;
        min-width: 0;
      }
      .nav-links::-webkit-scrollbar {
        display: none;
      }
      nav a {
        padding: 5px 14px;
        margin: 5px 0;
        font-size: .82rem;
      }
      .account-trigger {
        width: 36px;
        height: 36px;
        font-size: .88rem;
      }
    }
  `;
  document.head.appendChild(styleEl);

  function ensureAccountDOM() {
    if (document.getElementById("accountTrigger")) return;
    const navIn = document.querySelector("nav .in") || document.querySelector("nav");
    if (!navIn) return;

    const accountWrap = document.createElement("div");
    accountWrap.className = "nav-account";
    accountWrap.innerHTML = `
      <button type="button" class="account-trigger" id="accountTrigger" aria-expanded="false" aria-controls="accountMenu" aria-label="قائمة الحساب">👤</button>
      <div class="account-menu" id="accountMenu" role="menu">
        <div class="account-hero-box">
          <div class="account-big-avatar" id="accountBigAvatar">👤</div>
          <div class="account-menu-name" id="accountMenuName">الحساب</div>
        </div>

        <button type="button" class="menu-action-item" id="uploadPhotoBtn" role="menuitem">🖼️ إضافة صورة</button>

        <form class="student-form" id="studentProfileForm">
          <div class="student-field">
            <label for="nameArInput">الاسم بالعربية</label>
            <input type="text" id="nameArInput" placeholder="اكتب اسمك بالعربية">
          </div>
          <div class="student-field">
            <label for="nameEnInput">الاسم بالإنجليزية</label>
            <input type="text" id="nameEnInput" dir="ltr" placeholder="Full Name in English">
          </div>
          <div class="student-field">
            <label for="gradeInput">الفرقة</label>
            <input type="text" id="gradeInput" placeholder="مثال: الفرقة الرابعة">
          </div>
          <div class="student-row-2">
            <div class="student-field">
              <label for="semesterInput">الفصل الدراسي</label>
              <input type="text" id="semesterInput" placeholder="الأول / الثاني">
            </div>
            <div class="student-field">
              <label for="sectionInput">الفصل</label>
              <input type="text" id="sectionInput" placeholder="مثال: فصل 1">
            </div>
          </div>
          <button type="submit" class="save-profile-btn" id="saveProfileBtn">💾 حفظ البيانات</button>
          <div class="profile-status" id="profileStatus"></div>
        </form>

        <button type="button" class="logout-item" id="logoutBtn" role="menuitem">🚪 تسجيل خروج</button>
      </div>
      <input type="file" id="avatarFileInput" accept="image/*" style="display:none">
    `;
    navIn.prepend(accountWrap);
  }

  ensureAccountDOM();

  let savedName = "";
  let savedPhoto = "";
  let savedProfile = null;

  function readCachedProfile() {
    try {
      const uid = window.__explorerUid || "";
      const raw =
        (uid && localStorage.getItem("explorerStudentProfile_" + uid)) ||
        localStorage.getItem("explorerStudentProfile") ||
        sessionStorage.getItem("explorerStudentProfile") ||
        "";
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return null;
  }

  try {
    savedName =
      localStorage.getItem("explorerUserName") ||
      sessionStorage.getItem("explorerUserName") ||
      "";
    savedPhoto =
      localStorage.getItem("explorerUserPhoto") ||
      sessionStorage.getItem("explorerUserPhoto") ||
      "";
    savedProfile = readCachedProfile();
  } catch (e) {}

  const trigger = document.getElementById("accountTrigger");
  const bigAvatar = document.getElementById("accountBigAvatar");
  const menu = document.getElementById("accountMenu");
  const uploadPhotoBtn = document.getElementById("uploadPhotoBtn");
  const fileInput = document.getElementById("avatarFileInput");
  const nameArInput = document.getElementById("nameArInput");
  const nameEnInput = document.getElementById("nameEnInput");
  const gradeInput = document.getElementById("gradeInput");
  const semesterInput = document.getElementById("semesterInput");
  const sectionInput = document.getElementById("sectionInput");
  const profileForm = document.getElementById("studentProfileForm");

  function renderIntoCircle(el, photoUrl, fallbackLetter) {
    if (!el) return;
    if (photoUrl) {
      const img = document.createElement("img");
      img.src = photoUrl;
      img.alt = "صورة الحساب";
      img.referrerPolicy = "no-referrer";
      img.onerror = function () {
        el.textContent = fallbackLetter || "👤";
      };
      el.innerHTML = "";
      el.appendChild(img);
    } else if (fallbackLetter) {
      el.textContent = fallbackLetter;
    } else {
      el.textContent = "👤";
    }
  }

  function applyAvatar(photoUrl, fallbackName) {
    const labelName = fallbackName || savedName;
    const letter = labelName ? labelName.trim().charAt(0).toUpperCase() : "";
    renderIntoCircle(trigger, photoUrl, letter);
    renderIntoCircle(bigAvatar, photoUrl, letter);
    if (uploadPhotoBtn) {
      uploadPhotoBtn.textContent = photoUrl ? "🖼️ تغيير الصورة" : "🖼️ إضافة صورة";
    }
  }

  window.__setExplorerAccountUI = function (newName, newPhoto, profileData) {
    const displayLabel = (profileData && profileData.nameAr) || newName || savedName;
    if (displayLabel) {
      savedName = displayLabel;
      const menuName = document.getElementById("accountMenuName");
      if (menuName) menuName.textContent = displayLabel;
    }
    if (typeof newPhoto === "string" && newPhoto) {
      savedPhoto = newPhoto;
    }
    if (profileData) {
      savedProfile = profileData;
      if (nameArInput && typeof profileData.nameAr === "string") nameArInput.value = profileData.nameAr;
      if (nameEnInput && typeof profileData.nameEn === "string") nameEnInput.value = profileData.nameEn;
      if (gradeInput && typeof profileData.grade === "string") gradeInput.value = profileData.grade;
      if (semesterInput && typeof profileData.semester === "string") semesterInput.value = profileData.semester;
      if (sectionInput && typeof profileData.section === "string") sectionInput.value = profileData.section;
    }
    applyAvatar(savedPhoto, savedName);
  };

  window.__setExplorerAccountUI(savedName, savedPhoto, savedProfile);

  function positionMenu() {
    if (!trigger || !menu) return;
    const rect = trigger.getBoundingClientRect();
    if (window.innerWidth >= 760) {
      menu.style.top = "calc(100% + 8px)";
      menu.style.right = "0";
      menu.style.left = "auto";
      menu.style.maxHeight = Math.max(240, window.innerHeight - rect.bottom - 20) + "px";
    } else {
      menu.style.top = rect.bottom + 8 + "px";
      menu.style.right = "12px";
      menu.style.left = "auto";
      menu.style.maxHeight = Math.max(240, window.innerHeight - rect.bottom - 18) + "px";
    }
  }

  function setMenuOpen(open) {
    if (!trigger || !menu) return;
    menu.classList.toggle("open", open);
    trigger.setAttribute("aria-expanded", open ? "true" : "false");
    document.body.classList.remove("menu-lock");
    if (open) positionMenu();
  }

  if (trigger && menu) {
    trigger.addEventListener("click", function (e) {
      e.stopPropagation();
      setMenuOpen(!menu.classList.contains("open"));
    });
    menu.addEventListener("click", function (e) {
      e.stopPropagation();
    });
    if (profileForm) {
      profileForm.addEventListener("submit", function (e) {
        e.stopPropagation();
      });
    }
    document.addEventListener("click", function (e) {
      if (!menu.contains(e.target) && !trigger.contains(e.target)) {
        setMenuOpen(false);
      }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menu.classList.contains("open")) {
        setMenuOpen(false);
      }
    });
    window.addEventListener("resize", function () {
      if (menu.classList.contains("open")) positionMenu();
    });
  }

  function compressImageToDataUrl(file, maxSize, quality, cb) {
    const reader = new FileReader();
    reader.onload = function (ev) {
      const img = new Image();
      img.onload = function () {
        let w = img.width;
        let h = img.height;
        if (w > maxSize || h > maxSize) {
          if (w > h) {
            h = Math.round((h * maxSize) / w);
            w = maxSize;
          } else {
            w = Math.round((w * maxSize) / h);
            h = maxSize;
          }
        }
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, w, h);
        cb(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  }

  if (uploadPhotoBtn && fileInput) {
    uploadPhotoBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      fileInput.click();
    });

    fileInput.addEventListener("change", function () {
      const file = fileInput.files && fileInput.files[0];
      if (!file) return;
      compressImageToDataUrl(file, 240, 0.78, function (dataUrl) {
        if (!dataUrl) return;
        savedPhoto = dataUrl;
        applyAvatar(dataUrl, savedName);
        try {
          localStorage.setItem("explorerUserPhoto", dataUrl);
          sessionStorage.setItem("explorerUserPhoto", dataUrl);
          if (window.__explorerUid) {
            localStorage.setItem("explorerUserPhoto_" + window.__explorerUid, dataUrl);
          }
        } catch (err) {}
        document.dispatchEvent(
          new CustomEvent("explorer:avatar-selected", {
            detail: { file: file, dataUrl: dataUrl }
          })
        );
      });
      fileInput.value = "";
    });
  }

  // استيراد Firebase كوحدة قياسية مباشرة بدون blob:
  import(`${rootPrefix}firebase-config.js`)
    .then(async (cfg) => {
      const { auth, db } = cfg;
      const [{ onAuthStateChanged, signOut }, { doc, getDoc, setDoc }] = await Promise.all([
        import("https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js"),
        import("https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js")
      ]);

      const LOGIN_PAGE = `${rootPrefix}index.html`;
      const logoutEl = document.getElementById("logoutBtn");
      const formEl = document.getElementById("studentProfileForm");
      const saveBtn = document.getElementById("saveProfileBtn");
      const statusEl = document.getElementById("profileStatus");
      let currentUser = null;

      function persistProfileCache(uid, profileObj) {
        const serialized = JSON.stringify(profileObj);
        try {
          localStorage.setItem("explorerStudentProfile_" + uid, serialized);
          localStorage.setItem("explorerStudentProfile", serialized);
          sessionStorage.setItem("explorerStudentProfile", serialized);
          if (profileObj.nameAr) {
            localStorage.setItem("explorerUserName", profileObj.nameAr);
            sessionStorage.setItem("explorerUserName", profileObj.nameAr);
          }
        } catch (e) {}
      }

      async function loadUserProfileFromFirestore(user) {
        const uid = user.uid;
        window.__explorerUid = uid;
        const fallbackName = user.displayName || user.email || "";

        let cachedPhoto = "";
        let cachedProfile = null;
        try {
          cachedPhoto =
            localStorage.getItem("explorerUserPhoto_" + uid) ||
            localStorage.getItem("explorerUserPhoto") ||
            sessionStorage.getItem("explorerUserPhoto") ||
            "";
          const rawProfile =
            localStorage.getItem("explorerStudentProfile_" + uid) ||
            localStorage.getItem("explorerStudentProfile") ||
            sessionStorage.getItem("explorerStudentProfile");
          if (rawProfile) cachedProfile = JSON.parse(rawProfile);
        } catch (e) {}

        let resolvedPhoto = cachedPhoto || user.photoURL || "";
        let resolvedProfile = {
          nameAr: cachedProfile?.nameAr ?? user.displayName ?? "",
          nameEn: cachedProfile?.nameEn ?? "",
          grade: cachedProfile?.grade ?? "",
          semester: cachedProfile?.semester ?? "",
          section: cachedProfile?.section ?? ""
        };

        if (window.__setExplorerAccountUI) {
          window.__setExplorerAccountUI(
            resolvedProfile.nameAr || fallbackName,
            resolvedPhoto,
            resolvedProfile
          );
        }

        try {
          const snap = await getDoc(doc(db, "users", uid));
          if (snap.exists()) {
            const data = snap.data() || {};
            if (data.photoData || data.photoURL || data.photo) {
              resolvedPhoto = data.photoData || data.photoURL || data.photo;
              try {
                localStorage.setItem("explorerUserPhoto_" + uid, resolvedPhoto);
                localStorage.setItem("explorerUserPhoto", resolvedPhoto);
                sessionStorage.setItem("explorerUserPhoto", resolvedPhoto);
              } catch (e) {}
            }
            resolvedProfile = {
              nameAr: data.nameAr ?? data.name ?? data.displayName ?? resolvedProfile.nameAr ?? "",
              nameEn: data.nameEn ?? resolvedProfile.nameEn ?? "",
              grade: data.grade ?? resolvedProfile.grade ?? "",
              semester: data.semester ?? resolvedProfile.semester ?? "",
              section: data.section ?? resolvedProfile.section ?? ""
            };
            persistProfileCache(uid, resolvedProfile);

            if (window.__setExplorerAccountUI) {
              window.__setExplorerAccountUI(
                resolvedProfile.nameAr || fallbackName,
                resolvedPhoto,
                resolvedProfile
              );
            }
          }
        } catch (err) {
          if (statusEl) statusEl.textContent = "⚠️ تعذر قراءة البيانات من السحابة";
        }
      }

      onAuthStateChanged(auth, (user) => {
        if (!user) return;
        currentUser = user;
        const name = user.displayName || user.email || "";
        if (name) {
          try {
            localStorage.setItem("explorerUserName", name);
            sessionStorage.setItem("explorerUserName", name);
          } catch (e) {}
        }
        loadUserProfileFromFirestore(user);
      });

      document.addEventListener("explorer:avatar-selected", async (e) => {
        const dataUrl = e.detail && e.detail.dataUrl ? e.detail.dataUrl : "";
        if (!dataUrl || !currentUser) return;
        try {
          localStorage.setItem("explorerUserPhoto_" + currentUser.uid, dataUrl);
          await setDoc(
            doc(db, "users", currentUser.uid),
            { photoData: dataUrl, updatedAt: Date.now() },
            { merge: true }
          );
          if (statusEl) {
            statusEl.textContent = "✅ تم حفظ الصورة";
            setTimeout(() => { statusEl.textContent = ""; }, 2500);
          }
        } catch (err) {
          if (statusEl) statusEl.textContent = "⚠️ تعذر حفظ الصورة";
        }
      });

      if (formEl) {
        formEl.addEventListener("submit", async (e) => {
          e.preventDefault();
          e.stopPropagation();
          if (!currentUser) {
            if (statusEl) statusEl.textContent = "⚠️ جارٍ التحقق من الحساب...";
            return;
          }

          const payload = {
            nameAr: (document.getElementById("nameArInput")?.value || "").trim(),
            nameEn: (document.getElementById("nameEnInput")?.value || "").trim(),
            grade: (document.getElementById("gradeInput")?.value || "").trim(),
            semester: (document.getElementById("semesterInput")?.value || "").trim(),
            section: (document.getElementById("sectionInput")?.value || "").trim(),
            updatedAt: Date.now()
          };

          if (saveBtn) {
            saveBtn.disabled = true;
            saveBtn.textContent = "جاري الحفظ...";
          }
          if (statusEl) statusEl.textContent = "";

          try {
            await setDoc(doc(db, "users", currentUser.uid), payload, { merge: true });
            persistProfileCache(currentUser.uid, payload);

            if (window.__setExplorerAccountUI) {
              window.__setExplorerAccountUI(
                payload.nameAr || currentUser.displayName || currentUser.email || "",
                "",
                payload
              );
            }
            if (statusEl) {
              statusEl.textContent = "✅ تم حفظ البيانات بنجاح";
              setTimeout(() => { statusEl.textContent = ""; }, 3000);
            }
          } catch (err) {
            if (statusEl) statusEl.textContent = "⚠️ حدث خطأ أثناء الحفظ";
          } finally {
            if (saveBtn) {
              saveBtn.disabled = false;
              saveBtn.textContent = "💾 حفظ البيانات";
            }
          }
        });
      }

      if (logoutEl) {
        logoutEl.onclick = async function (e) {
          e.preventDefault();
          e.stopImmediatePropagation();
          try {
            await signOut(auth);
          } catch (err) {}
          try {
            sessionStorage.removeItem("explorerSessionVerified");
            sessionStorage.removeItem("explorerUserName");
            sessionStorage.removeItem("explorerUserPhoto");
            sessionStorage.removeItem("explorerStudentProfile");
            localStorage.removeItem("explorerUserName");
            localStorage.removeItem("explorerUserPhoto");
            localStorage.removeItem("explorerStudentProfile");
          } catch (err) {}
          window.location.replace(LOGIN_PAGE);
        };
      }
    })
    .catch(() => {
      const statusEl = document.getElementById("profileStatus");
      if (statusEl) statusEl.textContent = "⚠️ تعذر ربط Firebase بالصفحة";
    });
})();
