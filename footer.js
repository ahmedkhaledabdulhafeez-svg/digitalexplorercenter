تمت إضافة حماية الصور بالكامل داخل ملف `footer.js` نفسه، بحيث أي صورة في الفوتر أو داخل نافذة **«الإعداد والإشراف»** تكون محمية تلقائياً في كل صفحات الموقع بنفس مستوى الحماية في `index.html`:

* **منع كليك يمين (`contextmenu`)** على الصور وداخل نافذة الإعداد والإشراف بالكامل.
* **منع السحب والحفظ (`dragstart`)** أو سحب الصورة إلى تبويب جديد.
* **حماية بـ CSS (`user-select: none` + `-webkit-touch-callout: none` + `pointer-events: none` على الصور)** بحيث لا يمكن الضغط المطوّل عليها في الموبايل أو تحديدها أو حفظها.

### كود `footer.js` الكامل بعد إضافة حماية الصور:

```javascript
(function () {
  function initUnifiedFooter() {
    if (document.getElementById("u-unified-footer-wrap")) return;

    const decodedPath = decodeURIComponent(window.location.pathname);
    const isSub = decodedPath.includes("/قسم-") || decodedPath.includes("/الشخصيات-");
    const base = isSub ? "../" : "./";

    // 1. حقن التنسيقات + حماية الصور من النسخ والسحب والحفظ
    const style = document.createElement("style");
    style.id = "u-footer-style";
    style.textContent = `
      .u-strip{width:100%;height:10px;margin-top:60px;background:repeating-linear-gradient(90deg,#c8825a 0 18px,transparent 18px 26px,#f0b44c 26px 34px,transparent 34px 42px);opacity:.75}
      .u-footer{position:relative;overflow:hidden;background:#24130b;color:#c9ae94;border-top:1px solid rgba(224,160,110,.22);font-family:'Cairo',sans-serif;direction:rtl}
      .u-footer::before{content:"";position:absolute;width:420px;height:420px;top:-220px;left:50%;transform:translateX(-50%);border-radius:50%;background:radial-gradient(circle,rgba(240,180,76,.14),transparent 70%);pointer-events:none}
      .u-f-in{position:relative;z-index:1;max-width:1240px;margin:auto;padding:42px 20px 30px;display:grid;grid-template-columns:1fr 1.35fr 1fr;gap:32px;align-items:center}
      @media(max-width:860px){.u-f-in{grid-template-columns:1fr;text-align:center;gap:26px}}

      /* حماية الصور في الفوتر ونافذة الفريق */
      .u-footer img, #uTeamModal img {
        -webkit-user-select: none !important;
        user-select: none !important;
        -webkit-user-drag: none !important;
        -webkit-touch-callout: none !important;
        pointer-events: none !important;
      }

      /* العمود الأوسط: اللوجو المفرغ بوهج ذهبي + الزر */
      .u-f-center{display:flex;flex-direction:column;align-items:center;text-align:center;order:0}
      @media(min-width:861px){.u-f-right{order:-1}}
      .u-f-logo{position:relative;width:96px;height:96px;display:grid;place-items:center;margin-bottom:10px}
      .u-f-logo::before{content:"";position:absolute;inset:6px;border-radius:50%;background:radial-gradient(circle,rgba(240,180,76,.48) 0%,rgba(200,130,90,.2) 50%,transparent 75%);filter:blur(10px);z-index:0}
      .u-f-logo img{position:relative;z-index:1;width:100%;height:100%;object-fit:contain;filter:drop-shadow(0 6px 16px rgba(240,180,76,.35))}
      .u-f-center b{font-family:'Reem Kufi',sans-serif;font-size:1.35rem;color:#f3dcb8;line-height:1.4}
      .u-f-center small{color:#c9ae94;font-size:.84rem;margin:2px 0 16px;display:block}
      .u-team-btn{display:inline-flex;align-items:center;gap:10px;padding:10px 26px;border-radius:99px;font-family:inherit;font-weight:800;font-size:.92rem;cursor:pointer;color:#f0b44c;background:rgba(240,180,76,.1);border:1.5px solid #f0b44c;box-shadow:0 0 24px rgba(240,180,76,.22);transition:.3s}
      .u-team-btn:hover{background:#f0b44c;color:#2a150b;transform:translateY(-3px);box-shadow:0 10px 26px rgba(240,180,76,.42)}

      /* أعمدة الروابط */
      .u-f-col h4{font-family:'Reem Kufi',sans-serif;font-size:1.12rem;color:#f0b44c;margin-bottom:12px}
      .u-f-col ul{list-style:none;display:flex;flex-direction:column;gap:8px;padding:0;margin:0}
      .u-f-col a{color:#c9ae94;font-size:.9rem;font-weight:600;transition:.25s;display:inline-block}
      .u-f-col a:hover{color:#f3dcb8;transform:translateX(-4px)}
      @media(max-width:860px){.u-f-col a:hover{transform:none}}

      /* شريط الحقوق السفلي الأصلي */
      .u-f-copy{position:relative;z-index:1;border-top:1px solid rgba(224,160,110,.16);text-align:center;padding:20px 16px;font-weight:600;font-size:.88rem;color:#c9ae94}

      /* ===== النافذة المنبثقة للإعداد والإشراف ===== */
      .u-modal-ov{position:fixed;inset:0;z-index:99990;background:rgba(20,11,6,.84);backdrop-filter:blur(8px);display:none;align-items:center;justify-content:center;padding:18px;overflow-y:auto;scrollbar-width:none;-ms-overflow-style:none;direction:rtl;font-family:'Cairo',sans-serif;-webkit-user-select:none;user-select:none}
      .u-modal-ov::-webkit-scrollbar{display:none}
      .u-modal-ov.on{display:flex}
      .u-modal-box{position:relative;width:100%;max-width:980px;max-height:88vh;overflow-y:auto;scrollbar-width:none;-ms-overflow-style:none;padding:34px 28px 28px;border-radius:28px;background:radial-gradient(circle at 85% 12%,rgba(240,180,76,.13),transparent 42%),radial-gradient(circle at 15% 88%,rgba(200,130,90,.16),transparent 45%),linear-gradient(160deg,#42251a,#2e1a10);border:1px solid rgba(224,160,110,.28);box-shadow:0 30px 80px rgba(0,0,0,.7),0 0 60px -20px #c8825a;animation:uPop .32s ease;margin:auto}
      .u-modal-box::-webkit-scrollbar{display:none}
      .u-modal-box::before{content:"";position:absolute;inset:0 0 auto 0;height:4px;background:linear-gradient(90deg,#c8825a,#f0b44c,#c8825a)}
      @keyframes uPop{from{transform:scale(.94) translateY(14px);opacity:0}}
      .u-modal-x{position:sticky;top:0;float:left;z-index:10;width:38px;height:38px;border-radius:12px;border:1px solid rgba(224,160,110,.3);background:#2e1a10;color:#c9ae94;font-size:1.4rem;cursor:pointer;transition:.25s;display:grid;place-items:center}
      .u-modal-x:hover{color:#f0b44c;border-color:#f0b44c;transform:scale(1.06)}

      /* تنسيقات بطاقات الفريق + تفاعل الهوفر والإضاءة */
      #uTeamContent .head{display:flex;align-items:center;gap:14px;margin-bottom:24px}
      #uTeamContent .head .ic{border-radius:16px;width:50px;height:50px;border:1px solid #c8825a;display:grid;place-items:center;font-size:1.4rem;background:rgba(200,130,90,.12);transform:rotate(45deg);flex-shrink:0}
      #uTeamContent .head .ic i{transform:rotate(-45deg);font-style:normal}
      #uTeamContent .head h2{font-family:'Reem Kufi',sans-serif;font-size:1.6rem;color:#f3dcb8}
      #uTeamContent .head p{color:#c9ae94;font-size:.88rem}
      #uTeamContent .uni{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:18px 22px;border-radius:22px;margin-bottom:30px;background:rgba(0,0,0,.22);border:1px solid rgba(224,160,110,.22);box-shadow:0 12px 30px rgba(0,0,0,.25)}
      #uTeamContent .uni img{width:62px;height:62px;border-radius:50%;background:#fff;padding:4px;object-fit:contain;flex-shrink:0}
      #uTeamContent .uni div{text-align:center}
      #uTeamContent .uni h3{font-family:'Reem Kufi',sans-serif;font-size:1.3rem;color:#f0b44c}
      #uTeamContent .uni p{color:#c9ae94;font-size:.85rem}
      @media(max-width:640px){#uTeamContent .uni{flex-wrap:wrap;justify-content:center}#uTeamContent .uni div{order:3;flex-basis:100%}}
      #uTeamContent .grp{margin-bottom:32px;--c:#c8825a}
      #uTeamContent .grp.sup{--c:#f0b44c}
      #uTeamContent .sub{display:flex;align-items:center;justify-content:center;margin-bottom:20px}
      #uTeamContent .sub h3{font-family:'Reem Kufi',sans-serif;font-size:1.4rem;color:var(--c);display:flex;align-items:center;gap:12px}
      #uTeamContent .sub h3::before,#uTeamContent .sub h3::after{content:"";width:34px;height:3px;border-radius:99px;background:var(--c)}
      #uTeamContent .sup-grid{display:flex;flex-wrap:wrap;justify-content:center;gap:22px}
      #uTeamContent .sup-grid .person{width:300px;max-width:100%;padding:26px 20px 22px}
      #uTeamContent .sup-grid .av{width:124px;height:124px}
      #uTeamContent .prep-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}
      @media(max-width:820px){#uTeamContent .prep-grid{grid-template-columns:repeat(2,1fr)}}
      @media(max-width:520px){#uTeamContent .prep-grid{grid-template-columns:1fr}}

      #uTeamContent .person{text-align:center;padding:22px 14px 18px;border-radius:22px;background:linear-gradient(160deg,rgba(66,37,26,.78),rgba(42,21,11,.85));border:1px solid rgba(224,160,110,.22);position:relative;overflow:hidden;display:flex;flex-direction:column;align-items:center;transition:transform .35s cubic-bezier(.22,1,.36,1),border-color .35s,box-shadow .35s}
      #uTeamContent .person::before{content:"";position:absolute;inset:0 0 auto 0;height:3px;background:var(--c);opacity:.75;transition:opacity .35s,height .35s}
      #uTeamContent .person::after{content:"";position:absolute;width:180px;height:180px;top:-70px;left:50%;transform:translateX(-50%);border-radius:50%;background:radial-gradient(circle,var(--c),transparent 70%);opacity:0;transition:opacity .4s;pointer-events:none}
      #uTeamContent .person:hover{transform:translateY(-8px);border-color:var(--c);box-shadow:0 22px 44px rgba(0,0,0,.5),0 0 36px -8px var(--c)}
      #uTeamContent .person:hover::before{opacity:1;height:4px}
      #uTeamContent .person:hover::after{opacity:.24}
      #uTeamContent .av{position:relative;z-index:1;width:96px;height:96px;margin:0 auto 12px;border-radius:50%;overflow:hidden;border:3px solid var(--c);padding:3px;background:radial-gradient(circle at 50% 35%,#6a3f2b,#3a2116);transition:transform .35s,box-shadow .35s}
      #uTeamContent .person:hover .av{transform:scale(1.06);box-shadow:0 0 26px color-mix(in srgb,var(--c) 55%,transparent)}
      #uTeamContent .av img,#uTeamContent .av svg{width:100%;height:100%;object-fit:cover;border-radius:50%;display:block}
      #uTeamContent .person b{position:relative;z-index:1;display:block;color:#f3dcb8;font-size:1rem;margin-bottom:5px;transition:color .3s}
      #uTeamContent .person:hover b{color:#fff}
      #uTeamContent .role-badge{position:relative;z-index:1;display:inline-block;padding:2px 12px;border-radius:99px;font-size:.78rem;font-weight:700;color:var(--c);background:color-mix(in srgb,var(--c) 14%,transparent);border:1px solid color-mix(in srgb,var(--c) 35%,transparent);transition:background .3s,color .3s}
      #uTeamContent .person:hover .role-badge{background:color-mix(in srgb,var(--c) 24%,transparent)}
    `;
    document.head.appendChild(style);

    // 2. إزالة الفوتر القديم من الصفحة (إن وجد)
    const oldStrip = document.querySelector(".strip");
    const oldFooter = document.querySelector("footer");
    if (oldStrip) oldStrip.remove();
    if (oldFooter) oldFooter.remove();

    // 3. بناء الفوتر الموحد + النافذة المنبثقة
    const wrapper = document.createElement("div");
    wrapper.id = "u-unified-footer-wrap";
    wrapper.innerHTML = `
      <div class="u-strip"></div>
      <footer class="u-footer">
        <div class="u-f-in">
          <div class="u-f-center">
            <div class="u-f-logo">
              <img src="https://i.postimg.cc/ZnF2Hzfs/almstkshf-alrqmy.png" alt="شعار مركز المستكشف الرقمي" draggable="false">
            </div>
            <b>مركز المستكشف الرقمي</b>
            <small>بيئة تعلم تفاعلية لمادة الدراسات الاجتماعية</small>
            <button type="button" class="u-team-btn" id="openTeamModalBtn">👥 الإعداد والإشراف</button>
          </div>

          <div class="u-f-col u-f-right">
            <h4>روابط المنصة</h4>
            <ul>
              <li><a href="${base}الصفحة-الرئيسية.html">الرئيسية</a></li>
              <li><a href="${base}قسم-الجغرافيا/قسم-الجغرافيا.html">قسم الجغرافيا</a></li>
              <li><a href="${base}قسم-التاريخ/قسم-التاريخ.html">قسم التاريخ</a></li>
              <li><a href="${base}readings.html">الخرائط الذكية</a></li>
              <li><a href="${base}محاكاة-الشخصيات.html">محاكاة الشخصيات</a></li>
            </ul>
          </div>

          <div class="u-f-col">
            <h4>الانتماء الأكاديمي</h4>
            <ul>
              <li><a href="https://aswu.edu.eg" target="_blank" rel="noopener">جامعة أسوان</a></li>
              <li><a href="http://spec.aswu.edu.eg" target="_blank" rel="noopener">كلية التربية النوعية</a></li>
              <li><a href="https://www.ekb.eg" target="_blank" rel="noopener">بنك المعرفة المصري</a></li>
            </ul>
          </div>
        </div>

        <div class="u-f-copy">
          <p style="margin:0 0 6px;">تصميم وإعداد: طلاب الفرقة الرابعة - قسم تكنولوجيا التعليم | جامعة أسوان</p>
          <p style="margin:0;font-size:.8rem;opacity:.75;">جميع الحقوق محفوظة © مركز المستكشف الرقمي</p>
        </div>
      </footer>

      <div class="u-modal-ov" id="uTeamModal" role="dialog" aria-modal="true" aria-label="الإعداد والإشراف">
        <div class="u-modal-box">
          <button type="button" class="u-modal-x" id="closeTeamModalBtn" aria-label="إغلاق">&times;</button>
          <div id="uTeamContent">
            <p style="text-align:center;color:#f3dcb8;padding:30px;">جاري تحميل بيانات الإعداد والإشراف...</p>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(wrapper);

    // 4. تفعيل حماية منع كليك يمين والسحب والنسخ داخل النافذة وعلى صور الفوتر
    const modal = document.getElementById("uTeamModal");
    modal.addEventListener("contextmenu", (e) => e.preventDefault());
    modal.addEventListener("dragstart", (e) => e.preventDefault());
    modal.addEventListener("copy", (e) => e.preventDefault());
    wrapper.querySelector(".u-footer").addEventListener("contextmenu", (e) => {
      if (e.target.tagName === "IMG" || e.target.closest(".u-f-logo")) e.preventDefault();
    });
    wrapper.querySelector(".u-footer").addEventListener("dragstart", (e) => {
      if (e.target.tagName === "IMG") e.preventDefault();
    });

    // 5. سحب قسم #team من index.html تلقائياً
    let teamLoaded = false;
    async function loadTeamFromIndex() {
      if (teamLoaded) return;
      const container = document.getElementById("uTeamContent");
      try {
        const res = await fetch(base + "index.html");
        const htmlText = await res.text();
        const doc = new DOMParser().parseFromString(htmlText, "text/html");
        const teamSection = doc.getElementById("team");
        if (!teamSection) throw new Error("لم يتم العثور على قسم الفريق");

        let supervisors = [];
        let teamMembers = [];
        doc.querySelectorAll("script").forEach((sc) => {
          const txt = sc.textContent;
          if (txt.includes("var supervisors") && txt.includes("var teamMembers")) {
            const supMatch = txt.match(/var supervisors\s*=\s*(\[[\s\S]*?\]);/);
            const prepMatch = txt.match(/var teamMembers\s*=\s*(\[[\s\S]*?\]);/);
            if (supMatch) supervisors = new Function("return " + supMatch[1])();
            if (prepMatch) teamMembers = new Function("return " + prepMatch[1])();
          }
        });

        container.innerHTML = teamSection.innerHTML;

        const AV = '<svg viewBox="0 0 100 100"><circle cx="50" cy="38" r="17" fill="#c8825a" opacity=".85"/><path d="M14 98c0-24 16-38 36-38s36 14 36 38z" fill="#c8825a" opacity=".85"/></svg>';
        const renderCard = (item) => {
          let imgSrc = (item.img || "").trim();
          if (imgSrc && !imgSrc.startsWith("http") && !imgSrc.startsWith("/")) {
            imgSrc = base + imgSrc;
          }
          const avHTML = imgSrc ? `<img src="${imgSrc}" alt="${item.name}" draggable="false">` : AV;
          return `<div class="person"><div class="av">${avHTML}</div><b>${item.name}</b><span class="role-badge">${item.role}</span></div>`;
        };

        const supEl = container.querySelector("#sup");
        const prepEl = container.querySelector("#prep");
        if (supEl && supervisors.length) supEl.innerHTML = supervisors.map(renderCard).join("");
        if (prepEl && teamMembers.length) prepEl.innerHTML = teamMembers.map(renderCard).join("");

        teamLoaded = true;
      } catch (err) {
        container.innerHTML = `<p style="text-align:center;color:#ff8a80;padding:24px;">تعذر تحميل البيانات، تأكد من اتصال الإنترنت.</p>`;
      }
    }

    // 6. فتح وإغلاق النافذة المنبثقة
    document.getElementById("openTeamModalBtn").addEventListener("click", () => {
      modal.classList.add("on");
      document.body.style.overflow = "hidden";
      loadTeamFromIndex();
    });

    function closeTeamModal() {
      modal.classList.remove("on");
      document.body.style.overflow = "";
    }

    document.getElementById("closeTeamModalBtn").addEventListener("click", closeTeamModal);
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeTeamModal();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("on")) closeTeamModal();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initUnifiedFooter);
  } else {
    initUnifiedFooter();
  }
})();

```
