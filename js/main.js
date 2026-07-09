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

  /* module explorer + live demos */
  const railBtns = document.querySelectorAll(".rail-btn");
  const panels = document.querySelectorAll(".panel");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let demoTimers = [];
  let demoIntervals = [];

  function clearDemoTimers() {
    demoTimers.forEach(function (id) {
      clearTimeout(id);
    });
    demoIntervals.forEach(function (id) {
      clearInterval(id);
    });
    demoTimers = [];
    demoIntervals = [];
  }

  function later(fn, ms) {
    const id = setTimeout(fn, ms);
    demoTimers.push(id);
    return id;
  }

  function every(fn, ms) {
    const id = setInterval(fn, ms);
    demoIntervals.push(id);
    return id;
  }

  function typeInto(el, text, speed, done) {
    if (!el) {
      if (done) done();
      return;
    }
    el.textContent = "";
    if (reduceMotion || !speed) {
      el.textContent = text;
      if (done) done();
      return;
    }
    let i = 0;
    const id = setInterval(function () {
      i += 1;
      el.textContent = text.slice(0, i);
      if (i >= text.length) {
        clearInterval(id);
        const idx = demoIntervals.indexOf(id);
        if (idx >= 0) demoIntervals.splice(idx, 1);
        if (done) done();
      }
    }, speed);
    demoIntervals.push(id);
  }

  function restartDemo(root) {
    if (!root) return;
    clearDemoTimers();
    document.querySelectorAll(".demo.is-playing").forEach(function (d) {
      d.classList.remove("is-playing");
    });
    root.classList.remove("is-playing");
    /* force reflow so CSS enter anims restart */
    void root.offsetWidth;
    root.classList.add("is-playing");

    const kind = root.getAttribute("data-demo");
    if (kind === "terminal") runTerminalDemo(root);
    if (kind === "studio") runStudioDemo(root);
    if (kind === "agents") runAgentsDemo(root);
    if (kind === "k8s") runK8sDemo(root);
    if (kind === "mars") runMarsDemo(root);
    if (kind === "access") runAccessDemo(root);
    if (kind === "plugins") runPluginsDemo(root);
    if (kind === "servers") {
      /* CSS-driven */
    }
  }

  function runTerminalDemo(root) {
    const out = root.querySelector("#demo-term-out");
    const nova = root.querySelector("#demo-nova-msg");
    if (!out || !nova) return;
    out.innerHTML = "";
    nova.textContent = "";

    const lines = [
      { html: '<span class="u">ops@worker-03</span>:<span class="p">~</span>$ df -h /' },
      { html: '<span class="muted">Filesystem  Size  Used Avail Use%</span>' },
      { html: '<span class="muted">/dev/sda1    80G   69G  8.2G  86%</span>' },
      { html: '<span class="u">ops@worker-03</span>:<span class="p">~</span>$ journalctl -u nginx -n 3 --no-pager' },
      { html: '<span class="muted">… connect() failed (111: Connection refused)</span>' },
    ];

    let delay = 200;
    lines.forEach(function (line, idx) {
      later(function () {
        const div = document.createElement("div");
        div.innerHTML = line.html;
        div.style.opacity = "0";
        out.appendChild(div);
        requestAnimationFrame(function () {
          div.style.transition = "opacity 0.25s ease";
          div.style.opacity = "1";
        });
        if (idx === lines.length - 1) {
          later(function () {
            typeInto(
              nova,
              "Диск 86%. Nginx upstream :3001 недоступен. Проверь process на app-порту и reload после фикса. sudo: limited.",
              reduceMotion ? 0 : 16,
            );
          }, 400);
        }
      }, delay);
      delay += reduceMotion ? 80 : 550;
    });
  }

  function runStudioDemo(root) {
    const nodes = root.querySelectorAll(".fn");
    const wires = root.querySelectorAll(".fw");
    const log = root.querySelector("#demo-studio-log");
    const status = root.querySelector("#demo-studio-status");
    nodes.forEach(function (n) {
      n.classList.remove("lit", "done");
    });
    wires.forEach(function (w) {
      w.classList.remove("lit");
    });
    if (log) log.textContent = "run #1204 · starting…";
    if (status) {
      status.textContent = "running";
      status.className = "pill run";
    }

    const steps = [
      { t: 300, n: 0, msg: "trigger fired · cron 0 */6" },
      { t: 1100, n: 1, msg: "ssh · df -h on workers…" },
      { t: 2000, n: 2, msg: "if · use% > 80 → true" },
      { t: 2900, n: 3, msg: "notify · telegram ops · sent" },
    ];

    steps.forEach(function (step, i) {
      later(function () {
        if (nodes[step.n]) nodes[step.n].classList.add("lit");
        if (i > 0 && wires[i - 1]) wires[i - 1].classList.add("lit");
        if (i > 0 && nodes[i - 1]) nodes[i - 1].classList.add("done");
        if (log) log.textContent = step.msg;
        if (i === steps.length - 1) {
          later(function () {
            if (nodes[step.n]) nodes[step.n].classList.add("done");
            if (status) {
              status.textContent = "success";
              status.className = "pill ok";
            }
            if (log) log.textContent = "last run ok · 42s · mcp:3 · skills:2";
          }, 500);
        }
      }, reduceMotion ? i * 100 : step.t);
    });
  }

  function runAgentsDemo(root) {
    const log = root.querySelector("#demo-agent-log");
    const bar = root.querySelector("#demo-agent-bar");
    const badge = root.querySelector("#demo-agent-badge");
    const sub = root.querySelector("#demo-agent-sub");
    if (!log) return;
    log.innerHTML = "";
    if (bar) bar.style.width = "8%";
    if (badge) {
      badge.textContent = "Выполняется";
      badge.className = "pill run";
    }

    const lines = [
      { t: 200, pct: 15, text: "plan · check nginx + disk on worker pool", sub: "plan · check nginx + disk…" },
      { t: 900, pct: 35, text: "tool · list_servers → 4 hosts", sub: "tool · list_servers" },
      { t: 1700, pct: 55, text: "tool · run_command worker-03 «df -h»", sub: "run_command · worker-03" },
      { t: 2500, pct: 72, text: "result · / 86% used — warning", ok: false, sub: "disk warning on worker-03" },
      { t: 3300, pct: 88, text: "tool · journalctl -u nginx -n 20", sub: "collecting evidence…" },
      { t: 4100, pct: 100, text: "report ready · 1 finding · 2 actions", ok: true, sub: "Диск 86% на worker-03, nginx upstream down", done: true },
    ];

    lines.forEach(function (line) {
      later(function () {
        const div = document.createElement("div");
        div.className = "line" + (line.ok ? " ok" : "");
        div.innerHTML = "<time>12:0" + Math.min(5, 1 + Math.floor(line.t / 1000)) + "</time>" + line.text;
        log.appendChild(div);
        requestAnimationFrame(function () {
          div.classList.add("show");
        });
        if (bar) bar.style.width = line.pct + "%";
        if (sub) sub.textContent = line.sub;
        if (line.done && badge) {
          badge.textContent = "С замечаниями";
          badge.className = "pill warn";
        }
      }, reduceMotion ? line.t / 4 : line.t);
    });
  }

  function runK8sDemo(root) {
    const nums = root.querySelectorAll("[data-count]");
    nums.forEach(function (el) {
      const target = parseInt(el.getAttribute("data-count") || "0", 10);
      if (reduceMotion) {
        el.textContent = String(target);
        return;
      }
      el.textContent = "0";
      const start = performance.now();
      const dur = 1200;
      function tick(now) {
        const p = Math.min(1, (now - start) / dur);
        el.textContent = String(Math.round(target * p));
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }

  function runMarsDemo(root) {
    const steps = root.querySelectorAll(".ms");
    const note = root.querySelector("#demo-mars-note");
    const phase = root.querySelector("#demo-mars-phase");
    steps.forEach(function (s) {
      s.classList.remove("done", "active");
    });
    const labels = ["interview", "plan", "execute", "review"];
    let i = 0;
    function advance() {
      steps.forEach(function (s, idx) {
        s.classList.remove("active");
        if (idx < i) s.classList.add("done");
        else s.classList.remove("done");
        if (idx === i) s.classList.add("active");
      });
      if (phase) phase.textContent = labels[i] || "review";
      if (note) {
        note.textContent =
          i < 3
            ? "workspace user_22 · worker phase: " + labels[i]
            : "workspace user_22 · awaiting review";
      }
      i += 1;
      if (i < steps.length) {
        later(advance, reduceMotion ? 200 : 1100);
      } else {
        steps.forEach(function (s) {
          s.classList.remove("active");
          s.classList.add("done");
        });
        if (phase) {
          phase.textContent = "done";
          phase.className = "pill ok";
        }
      }
    }
    if (phase) phase.className = "pill run";
    later(advance, 200);
  }

  function runAccessDemo(root) {
    const audit = root.querySelector("#demo-audit");
    const events = [
      "audit · admin enabled studio for ops-team",
      "audit · kubernetes gate: readiness pending",
      "audit · session ops@10.0.0.8 created",
    ];
    let i = 0;
    if (audit) audit.textContent = events[0];
    every(function () {
      i = (i + 1) % events.length;
      if (audit) audit.textContent = events[i];
    }, reduceMotion ? 5000 : 2200);
  }

  function runPluginsDemo(root) {
    const bar = root.querySelector("#demo-plug-bar");
    const st = root.querySelector("#demo-plug-st");
    if (bar) bar.style.width = "0%";
    if (st) st.textContent = "uploading ops-board.wtp…";
    let p = 0;
    const id = setInterval(function () {
      p += reduceMotion ? 50 : 8;
      if (p > 100) p = 100;
      if (bar) bar.style.width = p + "%";
      if (st) {
        if (p < 40) st.textContent = "uploading ops-board.wtp…";
        else if (p < 75) st.textContent = "validating package…";
        else if (p < 100) st.textContent = "registering widgets…";
        else st.textContent = "installed · dashboard widgets ready";
      }
      if (p >= 100) {
        clearInterval(id);
        const idx = demoIntervals.indexOf(id);
        if (idx >= 0) demoIntervals.splice(idx, 1);
      }
    }, 120);
    demoIntervals.push(id);
  }

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
    const active = document.querySelector('.panel.is-on .demo');
    later(function () {
      restartDemo(active);
    }, 40);
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

  /* start first demo when map is visible */
  const mapSection = document.getElementById("map");
  if (mapSection && "IntersectionObserver" in window) {
    let started = false;
    const io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && !started) {
            started = true;
            const demo = document.querySelector("#panel-servers .demo");
            restartDemo(demo);
          }
        });
      },
      { threshold: 0.25 },
    );
    io.observe(mapSection);
  } else {
    later(function () {
      restartDemo(document.querySelector("#panel-servers .demo"));
    }, 300);
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
