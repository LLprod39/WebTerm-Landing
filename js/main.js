(function () {
  "use strict";

  const header = document.querySelector(".top");
  const nav = document.getElementById("primary-nav");
  const burger = document.querySelector(".burger");
  const toast = document.getElementById("toast");
  let toastTimer = null;

  /* sticky header */
  function onScroll() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 6);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* mobile nav */
  if (burger && nav) {
    burger.addEventListener("click", function () {
      const open = nav.classList.toggle("is-open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("is-open");
        burger.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* module explorer */
  const railBtns = document.querySelectorAll(".rail-btn");
  const panels = document.querySelectorAll(".panel");

  function showPanel(id) {
    railBtns.forEach(function (btn) {
      const on = btn.getAttribute("data-panel") === id;
      btn.classList.toggle("is-on", on);
      btn.setAttribute("aria-selected", on ? "true" : "false");
    });
    panels.forEach(function (panel) {
      const on = panel.getAttribute("data-panel") === id;
      panel.classList.toggle("is-on", on);
      if (on) panel.removeAttribute("hidden");
      else panel.setAttribute("hidden", "");
    });
  }

  railBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      const id = btn.getAttribute("data-panel");
      if (id) showPanel(id);
    });
  });

  /* keyboard on rail */
  const rail = document.querySelector(".explorer-rail");
  if (rail) {
    rail.addEventListener("keydown", function (e) {
      const keys = ["ArrowDown", "ArrowUp", "ArrowRight", "ArrowLeft"];
      if (keys.indexOf(e.key) === -1) return;
      e.preventDefault();
      const list = Array.prototype.slice.call(railBtns);
      const i = list.indexOf(document.activeElement);
      if (i < 0) return;
      const delta = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : -1;
      const next = list[(i + delta + list.length) % list.length];
      next.focus();
      next.click();
    });
  }

  /* install tabs */
  const itabs = document.querySelectorAll(".itab");
  const ipanels = {
    prod: document.getElementById("ipanel-prod"),
    docker: document.getElementById("ipanel-docker"),
    dev: document.getElementById("ipanel-dev"),
  };

  itabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      const id = tab.getAttribute("data-tab");
      if (!id || !ipanels[id]) return;
      itabs.forEach(function (t) {
        const on = t === tab;
        t.classList.toggle("is-on", on);
        t.setAttribute("aria-selected", on ? "true" : "false");
      });
      Object.keys(ipanels).forEach(function (key) {
        const p = ipanels[key];
        if (!p) return;
        if (key === id) {
          p.classList.add("is-on");
          p.removeAttribute("hidden");
        } else {
          p.classList.remove("is-on");
          p.setAttribute("hidden", "");
        }
      });
    });
  });

  /* clipboard */
  function showToast(message) {
    if (!toast) return;
    toast.textContent = message || "copied";
    toast.hidden = false;
    requestAnimationFrame(function () {
      toast.classList.add("is-visible");
    });
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove("is-visible");
      setTimeout(function () {
        toast.hidden = true;
      }, 200);
    }, 1500);
  }

  function fallbackCopy(text) {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try {
      ok = document.execCommand("copy");
    } catch (_) {
      ok = false;
    }
    document.body.removeChild(ta);
    return ok;
  }

  async function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (_) {}
    }
    return fallbackCopy(text);
  }

  document.querySelectorAll(".copy-btn").forEach(function (btn) {
    btn.addEventListener("click", async function () {
      const id = btn.getAttribute("data-copy-target");
      const el = id ? document.getElementById(id) : null;
      if (!el) return;
      const text = (el.innerText || el.textContent || "").replace(/\n$/, "");
      const ok = await copyText(text);
      if (ok) {
        const prev = btn.textContent;
        btn.textContent = "ok";
        btn.classList.add("is-copied");
        showToast("copied");
        setTimeout(function () {
          btn.textContent = prev;
          btn.classList.remove("is-copied");
        }, 1400);
      } else {
        showToast("copy failed");
      }
    });
  });
})();
