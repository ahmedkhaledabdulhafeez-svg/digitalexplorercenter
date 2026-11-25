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
      @media(max-width:640
