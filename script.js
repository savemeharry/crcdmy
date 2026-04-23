/* ============================================================
   Creata Academy — landing interactivity
   ============================================================ */

(() => {
  'use strict';

  // =========================================================
  // 1. Scroll reveal
  // =========================================================
  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    }
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal, .stagger').forEach((el) => io.observe(el));

  // =========================================================
  // 2. Ticker loop
  // =========================================================
  const tickerTrack = document.getElementById('tickerTrack');
  if (tickerTrack) {
    tickerTrack.innerHTML += tickerTrack.innerHTML;
  }

  // =========================================================
  // 3. Interactive lesson player — 6 segments
  // =========================================================
  (() => {
    const segList = document.getElementById('demoSegList');
    const canvas = document.getElementById('demoCanvas');
    if (!segList || !canvas) return;

    const items = segList.querySelectorAll('.seg-item');
    const views = canvas.querySelectorAll('.seg-view');
    const timeEl = document.getElementById('demoTime');
    const progEl = document.getElementById('demoProgressFill');
    const autoEl = document.getElementById('demoAutoplay');

    const TIMES = ['00:32 / 05:47', '01:10 / 05:47', '02:24 / 05:47', '03:30 / 05:47', '04:20 / 05:47', '05:47 / 05:47'];
    const PROGRESS = [12, 24, 42, 61, 76, 100];

    let current = 1;
    let autoplay = true;
    let autoTimer = null;
    let quizAnswered = false;

    function setActive(n) {
      current = n;
      items.forEach((it) => {
        const s = parseInt(it.dataset.seg, 10);
        it.classList.toggle('active', s === n);
        it.classList.toggle('done', s < n);
      });
      views.forEach((v) => {
        v.classList.toggle('active', parseInt(v.dataset.view, 10) === n);
      });
      if (timeEl) timeEl.textContent = TIMES[n - 1] || TIMES[0];
      if (progEl) progEl.style.width = (PROGRESS[n - 1] || 0) + '%';
      // reset quiz state when leaving segment 5
      if (n !== 5) quizAnswered = false;
    }

    function startAuto() {
      stopAuto();
      autoTimer = setInterval(() => {
        if (!autoplay) return;
        // pause auto-advance if user is still on quiz and hasn't answered
        if (current === 5 && !quizAnswered) return;
        const next = current >= 6 ? 1 : current + 1;
        setActive(next);
      }, 2600);
    }

    function stopAuto() {
      if (autoTimer) clearInterval(autoTimer);
      autoTimer = null;
    }

    // Click sidebar → switch + pause autoplay briefly then resume
    items.forEach((it) => {
      it.addEventListener('click', () => {
        const n = parseInt(it.dataset.seg, 10);
        setActive(n);
        autoplay = false;
        autoEl?.classList.add('off');
        clearTimeout(it._resume);
        it._resume = setTimeout(() => { autoplay = true; autoEl?.classList.remove('off'); }, 8000);
      });
    });

    // Toggle autoplay via indicator
    autoEl?.addEventListener('click', () => {
      autoplay = !autoplay;
      autoEl.classList.toggle('off', !autoplay);
    });

    // Quiz clicks inside seg 5
    canvas.querySelectorAll('.seg-quiz-opt').forEach((opt) => {
      opt.addEventListener('click', () => {
        const correct = opt.dataset.correct === '1';
        canvas.querySelectorAll('.seg-quiz-opt').forEach((o) => {
          o.disabled = true;
          if (o.dataset.correct === '1') o.classList.add('picked-correct');
          else if (o === opt && !correct) o.classList.add('picked-wrong');
        });
        quizAnswered = true;
        // advance to summary after short pause
        setTimeout(() => {
          if (current === 5) setActive(6);
          // reset for next cycle
          setTimeout(() => {
            canvas.querySelectorAll('.seg-quiz-opt').forEach((o) => {
              o.disabled = false;
              o.classList.remove('picked-correct', 'picked-wrong');
            });
          }, 4000);
        }, 1100);
      });
    });

    setActive(1);
    startAuto();
  })();

  // =========================================================
  // 4. Feature 02 — infographic dual-slide crossfade + counter
  // =========================================================
  (() => {
    const card = document.getElementById('infoCard');
    if (!card) return;
    const slides = card.querySelectorAll('.info-slide');
    const dots = card.querySelectorAll('.info-dot');
    const numEl = card.querySelector('.vis-infographic-number');

    function countUp(target, duration = 1600) {
      if (!numEl) return;
      const start = performance.now();
      const easeOut = (t) => 1 - Math.pow(1 - t, 4);
      function frame(now) {
        const t = Math.min(1, (now - start) / duration);
        numEl.textContent = Math.round(target * easeOut(t)) + '%';
        if (t < 1) requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    }

    function go(name) {
      slides.forEach((s) => s.classList.toggle('active', s.dataset.slide === name));
      dots.forEach((d) => d.classList.toggle('active', d.dataset.goto === name));
      if (name === 'a' && numEl) countUp(parseInt(numEl.dataset.target, 10));
    }

    dots.forEach((d) => {
      d.addEventListener('click', () => {
        go(d.dataset.goto);
        // reset auto-timer
        clearInterval(timer);
        timer = setInterval(cycle, 5500);
      });
    });

    let cycleIdx = 0;
    const cards = ['a', 'b'];
    function cycle() {
      cycleIdx = (cycleIdx + 1) % 2;
      go(cards[cycleIdx]);
    }

    // Start when visible
    const visIo = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          go('a');
          timer = setInterval(cycle, 5500);
          visIo.unobserve(card);
        }
      }
    }, { threshold: 0.5 });
    let timer = null;
    visIo.observe(card);
  })();

  // =========================================================
  // 5. Feature 03 — quiz → result state machine
  // =========================================================
  (() => {
    const card = document.getElementById('quizCard');
    if (!card) return;
    const states = card.querySelectorAll('.quiz-state');
    const opts = card.querySelectorAll('.quiz-opt');
    let cycleTimer = null;

    function setState(name) {
      states.forEach((s) => s.classList.toggle('active', s.dataset.state === name));
    }

    function resetQuiz() {
      opts.forEach((o) => {
        o.disabled = false;
        o.classList.remove('picked-correct', 'picked-wrong');
      });
      setState('quiz');
    }

    function showResult() {
      setState('result');
      clearTimeout(cycleTimer);
      cycleTimer = setTimeout(() => {
        resetQuiz();
        cycleTimer = setTimeout(autoAnswer, 2400);
      }, 4600);
    }

    function autoAnswer() {
      const correct = card.querySelector('.quiz-opt[data-correct="1"]');
      if (!correct) return;
      correct.classList.add('picked-correct');
      opts.forEach((o) => o.disabled = true);
      setTimeout(showResult, 1000);
    }

    opts.forEach((opt) => {
      opt.addEventListener('click', () => {
        const isCorrect = opt.dataset.correct === '1';
        opts.forEach((o) => {
          o.disabled = true;
          if (o.dataset.correct === '1') o.classList.add('picked-correct');
          else if (o === opt && !isCorrect) o.classList.add('picked-wrong');
        });
        clearTimeout(cycleTimer);
        cycleTimer = setTimeout(showResult, 900);
      });
    });

    // Kick off auto-cycle when visible
    const visIo = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          cycleTimer = setTimeout(autoAnswer, 1800);
          visIo.unobserve(card);
        }
      }
    }, { threshold: 0.5 });
    visIo.observe(card);
  })();

  // =========================================================
  // 6. Feature 04 — badge conveyor + XP pop
  // =========================================================
  (() => {
    const track = document.getElementById('xpConveyor');
    const pop = document.getElementById('xpPop');
    const xpVal = document.getElementById('xpValue');
    const xpBar = document.getElementById('xpBar');
    if (!track) return;

    // Six badges — swap these SVG ids with your generated 3D badges later
    const BADGES = [
      { id: 'i-star' },
      { id: 'i-spark' },
      { id: 'i-target' },
      { id: 'i-trophy' },
      { id: 'i-flame' },
      { id: 'i-star' },
    ];
    BADGES.forEach((b) => {
      const el = document.createElement('div');
      el.className = 'xp-badge';
      el.innerHTML = `<svg><use href="#${b.id}"/></svg>`;
      track.appendChild(el);
    });

    const badges = track.querySelectorAll('.xp-badge');
    const HI_IDX = 2; // central-ish badge gets highlighted
    const CYCLE_MS = 5400;

    let xp = 2310;

    function bumpXp(amount) {
      if (!pop || !xpVal) return;
      pop.textContent = '+' + amount + ' XP';
      pop.classList.remove('show');
      void pop.offsetWidth;
      pop.classList.add('show');

      const start = xp;
      const target = xp + amount;
      const t0 = performance.now();
      const dur = 900;
      (function frame(now) {
        const t = Math.min(1, (now - t0) / dur);
        const v = Math.round(start + (target - start) * (1 - Math.pow(1 - t, 3)));
        xpVal.childNodes[0].nodeValue = v.toLocaleString('ru-RU');
        if (t < 1) requestAnimationFrame(frame);
      })(performance.now());
      xp = target;

      if (xpBar) {
        const pct = 72 + (amount / 10);
        xpBar.style.width = Math.min(pct, 92) + '%';
      }
    }

    function runCycle() {
      // Restart conveyor track animation
      track.classList.remove('run');
      void track.offsetWidth;
      track.classList.add('run');

      // Clear prior highlight
      badges.forEach((b) => b.classList.remove('hi'));

      // Mid-cycle: highlight center badge + fire XP pop
      const highlightAt = CYCLE_MS * 0.32; // ~1.7s in — after track entered
      setTimeout(() => {
        badges[HI_IDX].classList.add('hi');
        bumpXp(50);
      }, highlightAt);

      // Next cycle
      setTimeout(runCycle, CYCLE_MS);
    }

    const visIo = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          setTimeout(runCycle, 400);
          visIo.unobserve(track);
        }
      }
    }, { threshold: 0.35 });
    visIo.observe(track);
  })();

  // =========================================================
  // 7. Voice waveform
  // =========================================================
  const voiceWave = document.getElementById('voiceWave');
  if (voiceWave) {
    const N = 28;
    for (let i = 0; i < N; i++) {
      const bar = document.createElement('span');
      const env = Math.sin((i / (N - 1)) * Math.PI);
      bar.style.height = (30 + env * 40 + (Math.random() - 0.5) * 10) + '%';
      bar.style.animationDelay = (i * 0.06) + 's';
      voiceWave.appendChild(bar);
    }
  }

  // =========================================================
  // 8. Tabs feature — switch
  // =========================================================
  document.querySelectorAll('.vis-tabs-strip').forEach((strip) => {
    strip.querySelectorAll('.vis-tab').forEach((tab) => {
      tab.addEventListener('click', () => {
        strip.querySelectorAll('.vis-tab').forEach((t) => t.classList.remove('active'));
        tab.classList.add('active');
      });
    });
  });

  // =========================================================
  // 9. Scale cards — cursor-follow glow
  // =========================================================
  document.querySelectorAll('.scale-card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const mx = ((e.clientX - r.left) / r.width) * 100;
      const my = ((e.clientY - r.top) / r.height) * 100;
      card.style.setProperty('--mx', mx + '%');
      card.style.setProperty('--my', my + '%');
    });
  });

  // Also for lecturer tiles — subtle version
  document.querySelectorAll('.lect-tile').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const mx = ((e.clientX - r.left) / r.width) * 100;
      const my = ((e.clientY - r.top) / r.height) * 100;
      card.style.setProperty('--mx', mx + '%');
      card.style.setProperty('--my', my + '%');
    });
  });
})();
