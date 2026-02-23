// // assets/js/app.js (FULL DROP-IN REPLACEMENT)
// (() => {
//   const pad2 = (n) => String(n).padStart(2, "0");
//   const $ = (id) => document.getElementById(id);

//   // ---- Slow Snowfall ----
//   function startSnow(canvas) {
//     if (!canvas) return () => {};
//     const ctx = canvas.getContext("2d");

//     const reduceMotion = window.matchMedia?.(
//       "(prefers-reduced-motion: reduce)",
//     )?.matches;
//     if (reduceMotion) return () => {};

//     let w, h, raf;
//     const DPR = Math.max(1, window.devicePixelRatio || 1);

//     const resize = () => {
//       w = canvas.width = Math.floor(window.innerWidth * DPR);
//       h = canvas.height = Math.floor(window.innerHeight * DPR);
//       canvas.style.width = window.innerWidth + "px";
//       canvas.style.height = window.innerHeight + "px";
//     };
//     resize();
//     window.addEventListener("resize", resize);

//     const COUNT = Math.min(
//       140,
//       Math.floor((window.innerWidth * window.innerHeight) / 14000) + 60,
//     );

//     const flakes = Array.from({ length: COUNT }, () => ({
//       x: Math.random() * w,
//       y: Math.random() * h,
//       r: (Math.random() * 2.4 + 0.8) * DPR,
//       vy: (Math.random() * 0.55 + 0.25) * DPR,
//       vx: (Math.random() * 0.2 - 0.1) * DPR,
//       sway: (Math.random() * 1.2 + 0.6) * DPR,
//       t: Math.random() * Math.PI * 2,
//       a: Math.random() * 0.35 + 0.25,
//     }));

//     function tick() {
//       ctx.clearRect(0, 0, w, h);

//       for (const f of flakes) {
//         f.t += 0.01;
//         f.x += f.vx + Math.sin(f.t) * 0.18 * f.sway;
//         f.y += f.vy;

//         if (f.y > h + 10) {
//           f.y = -10;
//           f.x = Math.random() * w;
//         }
//         if (f.x < -20) f.x = w + 20;
//         if (f.x > w + 20) f.x = -20;

//         ctx.beginPath();
//         ctx.globalAlpha = f.a;
//         ctx.fillStyle = "rgba(255,255,255,0.9)";
//         ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
//         ctx.fill();
//       }

//       ctx.globalAlpha = 1;
//       raf = requestAnimationFrame(tick);
//     }

//     tick();
//     return () => {
//       cancelAnimationFrame(raf);
//       window.removeEventListener("resize", resize);
//     };
//   }

//   // ---- Music helper (autoplay + fallback) ----
//   function setupMusic() {
//     const audio = $("bgMusic");
//     const btn = $("musicBtn");
//     const icon = $("musicIcon");
//     const text = $("musicText");
//     if (!audio || !btn) return;

//     const setUI = (playing) => {
//       if (icon) icon.textContent = playing ? "⏸" : "♪";
//       if (text) text.textContent = playing ? "Pause" : "Tap to Play";
//     };

//     let playing = false;

//     const tryAutoPlay = async () => {
//       try {
//         audio.volume = 0.65;
//         await audio.play();
//         playing = true;
//         setUI(true);
//       } catch {
//         playing = false;
//         setUI(false);
//       }
//     };

//     const userKick = async () => {
//       if (playing) return;
//       try {
//         await audio.play();
//         playing = true;
//         setUI(true);
//       } catch {}
//       window.removeEventListener("pointerdown", userKick);
//       window.removeEventListener("keydown", userKick);
//     };

//     btn.addEventListener("click", async () => {
//       if (!playing) {
//         try {
//           await audio.play();
//           playing = true;
//           setUI(true);
//         } catch {
//           playing = false;
//           setUI(false);
//         }
//       } else {
//         audio.pause();
//         playing = false;
//         setUI(false);
//       }
//     });

//     tryAutoPlay();
//     window.addEventListener("pointerdown", userKick, { once: true });
//     window.addEventListener("keydown", userKick, { once: true });
//   }

//   // ---- Home hero rotation ----
//   function setupHome(imagesCount) {
//     const heroImg = $("heroImg");
//     if (!heroImg) return;

//     let i = 1;
//     setInterval(() => {
//       i = (i % imagesCount) + 1;
//       heroImg.src = `assets/img/${pad2(i)}.jpg`;
//     }, 2600);
//   }

//   // ---- Memories gallery + lightbox ----
//   function setupMemories(imagesCount) {
//     const gallery = $("gallery");
//     const lightbox = $("lightbox");
//     const lbImg = $("lbImg");
//     const lbClose = $("lbClose");
//     const lbPrev = $("lbPrev");
//     const lbNext = $("lbNext");

//     if (!gallery) return;

//     let current = 1;

//     const open = (idx) => {
//       current = idx;
//       if (lbImg) lbImg.src = `assets/img/${pad2(current)}.jpg`;
//       if (lightbox) {
//         lightbox.classList.add("show");
//         lightbox.setAttribute("aria-hidden", "false");
//       }
//     };

//     const close = () => {
//       if (lightbox) {
//         lightbox.classList.remove("show");
//         lightbox.setAttribute("aria-hidden", "true");
//       }
//     };

//     const next = () => open((current % imagesCount) + 1);
//     const prev = () => open(current === 1 ? imagesCount : current - 1);

//     const frag = document.createDocumentFragment();
//     for (let i = 1; i <= imagesCount; i++) {
//       const tile = document.createElement("div");
//       tile.className = "tile";
//       tile.tabIndex = 0;

//       const img = document.createElement("img");
//       img.src = `assets/img/${pad2(i)}.jpg`;
//       img.alt = `Memory ${i}`;

//       const badge = document.createElement("div");
//       badge.className = "tileBadge";
//       badge.textContent = `Memory ${i}`;

//       tile.appendChild(img);
//       tile.appendChild(badge);

//       tile.addEventListener("click", () => open(i));
//       tile.addEventListener("keydown", (e) => {
//         if (e.key === "Enter" || e.key === " ") open(i);
//       });

//       frag.appendChild(tile);
//     }
//     gallery.appendChild(frag);

//     if (lbClose) lbClose.addEventListener("click", close);
//     if (lbNext) lbNext.addEventListener("click", next);
//     if (lbPrev) lbPrev.addEventListener("click", prev);

//     if (lightbox) {
//       lightbox.addEventListener("click", (e) => {
//         if (e.target === lightbox) close();
//       });
//     }

//     window.addEventListener("keydown", (e) => {
//       if (!lightbox || !lightbox.classList.contains("show")) return;
//       if (e.key === "Escape") close();
//       if (e.key === "ArrowRight") next();
//       if (e.key === "ArrowLeft") prev();
//     });
//   }

//   // ---- Games: Tabs + Quiz + Wheel + Guess + Puzzle ----
//   function setupGames(imagesCount) {
//     // Tabs
//     const tabBtns = document.querySelectorAll(".tabBtn");
//     const panels = {
//       quiz: document.getElementById("tab-quiz"),
//       wheel: document.getElementById("tab-wheel"),
//       guess: document.getElementById("tab-guess"),
//       puzzle: document.getElementById("tab-puzzle"),
//     };

//     tabBtns.forEach((b) => {
//       b.addEventListener("click", () => {
//         tabBtns.forEach((x) => x.classList.remove("active"));
//         b.classList.add("active");
//         const key = b.dataset.tab;
//         Object.entries(panels).forEach(([k, el]) => {
//           if (!el) return;
//           el.classList.toggle("show", k === key);
//         });
//       });
//     });

//     // ---------- 1) QUIZ ----------
//     const quizBox = $("quizBox");
//     const quizSubmit = $("quizSubmit");
//     const quizReset = $("quizReset");
//     const quizScore = $("quizScore");

//     const quiz = [
//       {
//         q: "Who takes more time to get ready?",
//         a: ["Priya", "Riddhikant", "Both", "Depends"],
//         correct: 2,
//       },
//       {
//         q: "Who is more likely to plan a surprise?",
//         a: ["Priya", "Riddhikant", "Both", "Depends"],
//         correct: 2,
//       },
//       {
//         q: "Who says ‘sorry’ first after a small fight?",
//         a: ["Priya", "Riddhikant", "Both", "Depends"],
//         correct: 3,
//       },
//       {
//         q: "Who is more romantic?",
//         a: ["Priya", "Riddhikant", "Both", "Depends"],
//         correct: 2,
//       },
//       {
//         q: "What matters more to you both?",
//         a: ["Money", "Peace", "Travel", "Family time"],
//         correct: 3,
//       },
//       {
//         q: "Best kind of date?",
//         a: ["Movie", "Dinner", "Long drive", "Stay home + talk"],
//         correct: 3,
//       },
//       {
//         q: "Who is more patient?",
//         a: ["Priya", "Riddhikant", "Both", "Depends"],
//         correct: 2,
//       },
//       {
//         q: "Your perfect weekend is…",
//         a: ["Outing", "Shopping", "Family gathering", "Rest + fun"],
//         correct: 2,
//       },
//     ];

//     if (quizBox) {
//       quizBox.innerHTML = quiz
//         .map((item, idx) => {
//           const name = `q${idx}`;
//           return `
//           <div class="qCard">
//             <div class="qTitle">${idx + 1}. ${item.q}</div>
//             <div class="optRow">
//               ${item.a
//                 .map(
//                   (opt, i) => `
//                 <label>
//                   <input type="radio" name="${name}" value="${i}" />
//                   <span>${opt}</span>
//                 </label>`,
//                 )
//                 .join("")}
//             </div>
//           </div>`;
//         })
//         .join("");
//     }

//     const gradeQuiz = () => {
//       if (!quizBox) return;
//       let score = 0;
//       quiz.forEach((item, idx) => {
//         const chosen = quizBox.querySelector(`input[name="q${idx}"]:checked`);
//         if (!chosen) return;
//         if (Number(chosen.value) === item.correct) score++;
//       });
//       if (quizScore) {
//         quizScore.textContent = `Score: ${score} / ${quiz.length}  •  ${score >= 6 ? "Perfect couple vibes 💖" : "Cute! Try again 😄"}`;
//       }
//     };

//     quizSubmit && quizSubmit.addEventListener("click", gradeQuiz);
//     quizReset &&
//       quizReset.addEventListener("click", () => {
//         if (!quizBox) return;
//         quizBox
//           .querySelectorAll("input[type=radio]")
//           .forEach((r) => (r.checked = false));
//         if (quizScore) quizScore.textContent = "";
//       });

//     // ---------- 2) LOVE WHEEL ----------
//     const wheel = $("wheel");
//     const spinBtn = $("spinBtn");
//     const spinReset = $("spinReset");
//     const spinResult = $("spinResult");

//     const wheelTasks = [
//       "Say 3 things you love about each other ❤️",
//       "Take a selfie together 📸",
//       "Dance for 30 seconds 💃🕺",
//       "Share your best memory from the last year ✨",
//       "Give a surprise hug 🤗",
//       "Compliment each other (5 lines) 💬",
//       "Plan a short date this week 🗓️",
//       "Promise one new habit together 🌸",
//     ];

//     let spinning = false;
//     let wheelAngle = 0;

//     const spin = () => {
//       if (!wheel || spinning) return;
//       spinning = true;

//       const pick = Math.floor(Math.random() * wheelTasks.length);
//       const slice = 360 / wheelTasks.length;

//       // target so the picked slice lands on top (pointer)
//       const targetAngle = 360 * 5 + (360 - (pick * slice + slice / 2));
//       wheelAngle = targetAngle;

//       wheel.style.transform = `rotate(${wheelAngle}deg)`;

//       setTimeout(() => {
//         spinning = false;
//         if (spinResult) spinResult.textContent = `Result: ${wheelTasks[pick]}`;
//       }, 3200);
//     };

//     spinBtn && spinBtn.addEventListener("click", spin);
//     spinReset &&
//       spinReset.addEventListener("click", () => {
//         if (!wheel) return;
//         wheelAngle = 0;
//         wheel.style.transform = "rotate(0deg)";
//         if (spinResult) spinResult.textContent = "";
//       });

//     // ---------- 3) GUESS THE YEAR ----------
//     const guessImg = $("guessImg");
//     const guessNext = $("guessNext");
//     const guessMsg = $("guessMsg");
//     const yearGrid = $("yearGrid");

//     // Fun-mode mapping: image 1..11 -> year 1..8 (cycled)
//     const yearForImageIndex = (imgIdx) => ((imgIdx - 1) % 8) + 1;

//     let currentGuessImg = 1;

//     const loadGuess = () => {
//       currentGuessImg = Math.floor(Math.random() * imagesCount) + 1;
//       if (guessImg) guessImg.src = `assets/img/${pad2(currentGuessImg)}.jpg`;
//       if (guessMsg) guessMsg.textContent = "";
//     };

//     if (yearGrid) {
//       yearGrid.innerHTML = Array.from({ length: 8 }, (_, i) => {
//         const yr = i + 1;
//         return `<button class="yearBtn" data-year="${yr}">Year ${yr}</button>`;
//       }).join("");

//       yearGrid.addEventListener("click", (e) => {
//         const btn = e.target.closest(".yearBtn");
//         if (!btn) return;
//         const chosenYear = Number(btn.dataset.year);
//         const correctYear = yearForImageIndex(currentGuessImg);
//         if (guessMsg) {
//           guessMsg.textContent =
//             chosenYear === correctYear
//               ? `Correct ✅ This one is mapped to Year ${correctYear}!`
//               : `Oops 😄 Correct was Year ${correctYear}. Try next!`;
//         }
//       });
//     }

//     guessNext && guessNext.addEventListener("click", loadGuess);
//     loadGuess();

//     // ---------- 4) MINI PUZZLE (3x3 sliding) ----------
//     const puzzleBoard = $("puzzleBoard");
//     const puzzleShuffle = $("puzzleShuffle");
//     const puzzleChange = $("puzzleChange");
//     const puzzleMsg = $("puzzleMsg");

//     const size = 3; // 3x3
//     let puzzleImgIdx = Math.floor(Math.random() * imagesCount) + 1;

//     // state: array of tile ids 0..8 where 8 = empty
//     let state = [];
//     const emptyId = size * size - 1;

//     const setTileStyles = () => {
//       if (!puzzleBoard) return;

//       // If responsive changed board size, compute from real element
//       const rect = puzzleBoard.getBoundingClientRect();
//       const boardPx = Math.floor(rect.width);

//       puzzleBoard.querySelectorAll(".pTile").forEach((tile) => {
//         tile.style.backgroundSize = `${boardPx}px ${boardPx}px`;
//       });
//     };

//     const renderPuzzle = () => {
//       if (!puzzleBoard) return;
//       puzzleBoard.innerHTML = "";

//       const imgUrl = `assets/img/${pad2(puzzleImgIdx)}.jpg`;

//       state.forEach((tileId, pos) => {
//         const tile = document.createElement("div");
//         tile.className = "pTile";
//         tile.dataset.pos = String(pos);
//         tile.dataset.tileId = String(tileId);

//         if (tileId === emptyId) {
//           tile.classList.add("empty");
//         } else {
//           const r = Math.floor(tileId / size);
//           const c = tileId % size;

//           tile.style.backgroundImage = `url(${imgUrl})`;
//           tile.style.backgroundPosition = `${(-c * 100) / (size - 1)}% ${(-r * 100) / (size - 1)}%`;
//         }

//         puzzleBoard.appendChild(tile);
//       });

//       setTileStyles();
//     };

//     const neighbors = (pos) => {
//       const r = Math.floor(pos / size);
//       const c = pos % size;
//       const n = [];
//       if (r > 0) n.push(pos - size);
//       if (r < size - 1) n.push(pos + size);
//       if (c > 0) n.push(pos - 1);
//       if (c < size - 1) n.push(pos + 1);
//       return n;
//     };

//     const isSolved = () => state.every((v, i) => v === i);

//     const move = (pos) => {
//       const emptyPos = state.indexOf(emptyId);
//       if (!neighbors(pos).includes(emptyPos)) return;

//       // swap
//       [state[pos], state[emptyPos]] = [state[emptyPos], state[pos]];
//       renderPuzzle();

//       if (puzzleMsg) {
//         puzzleMsg.textContent = isSolved() ? "Completed! 🎉" : "";
//       }
//     };

//     const shuffle = (steps = 80) => {
//       // start from solved then do random valid moves to ensure solvable
//       state = Array.from({ length: size * size }, (_, i) => i);
//       let emptyPos = emptyId;

//       for (let i = 0; i < steps; i++) {
//         const opts = neighbors(emptyPos);
//         const pick = opts[Math.floor(Math.random() * opts.length)];
//         [state[pick], state[emptyPos]] = [state[emptyPos], state[pick]];
//         emptyPos = pick;
//       }
//       if (puzzleMsg) puzzleMsg.textContent = "";
//       renderPuzzle();
//     };

//     if (puzzleBoard) {
//       puzzleBoard.addEventListener("click", (e) => {
//         const tile = e.target.closest(".pTile");
//         if (!tile) return;
//         const pos = Number(tile.dataset.pos);
//         if (Number(tile.dataset.tileId) === emptyId) return;
//         move(pos);
//       });

//       window.addEventListener("resize", () => setTileStyles());
//     }

//     puzzleShuffle &&
//       puzzleShuffle.addEventListener("click", () => shuffle(100));
//     puzzleChange &&
//       puzzleChange.addEventListener("click", () => {
//         puzzleImgIdx = Math.floor(Math.random() * imagesCount) + 1;
//         shuffle(90);
//       });

//     shuffle(90);
//   }

//   // ---- Public API ----
//   window.ANNIV = {
//     init({ page, imagesCount = 11 }) {
//       setupMusic();
//       startSnow($("confetti"));

//       if (page === "home") setupHome(imagesCount);
//       if (page === "memories") setupMemories(imagesCount);
//       if (page === "games") setupGames(imagesCount);
//     },
//   };
// })();

// assets/js/app.js (FULL DROP-IN REPLACEMENT)
(() => {
  const pad2 = (n) => String(n).padStart(2, "0");
  const $ = (id) => document.getElementById(id);
  const IMAGE_EXT_BY_INDEX = { 11: "png", 12: "png", 13: "png" };
  const imagePath = (idx) => {
    const ext = IMAGE_EXT_BY_INDEX[idx] || "jpg";
    return `assets/img/${pad2(idx)}.${ext}`;
  };
  const IMAGE_YEAR_BY_INDEX = {
    1: 2021,
    2: 2023,
    3: 2025,
    4: 2024,
    5: 2026,
    6: 2025,
    7: 2022,
    8: 2018,
    9: 2018,
    10: 2025,
    11: 2023,
    12: 2018,
  };

  // ---- Slow Snowfall ----
  function startSnow(canvas) {
    if (!canvas) return () => {};
    const ctx = canvas.getContext("2d");

    const reduceMotion = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    )?.matches;
    if (reduceMotion) return () => {};

    let w, h, raf;
    const DPR = Math.max(1, window.devicePixelRatio || 1);

    const resize = () => {
      w = canvas.width = Math.floor(window.innerWidth * DPR);
      h = canvas.height = Math.floor(window.innerHeight * DPR);
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
    };
    resize();
    window.addEventListener("resize", resize);

    const COUNT = Math.min(
      140,
      Math.floor((window.innerWidth * window.innerHeight) / 14000) + 60,
    );

    const flakes = Array.from({ length: COUNT }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: (Math.random() * 2.4 + 0.8) * DPR,
      vy: (Math.random() * 0.55 + 0.25) * DPR,
      vx: (Math.random() * 0.2 - 0.1) * DPR,
      sway: (Math.random() * 1.2 + 0.6) * DPR,
      t: Math.random() * Math.PI * 2,
      a: Math.random() * 0.35 + 0.25,
    }));

    function tick() {
      ctx.clearRect(0, 0, w, h);
      for (const f of flakes) {
        f.t += 0.01;
        f.x += f.vx + Math.sin(f.t) * 0.18 * f.sway;
        f.y += f.vy;

        if (f.y > h + 10) {
          f.y = -10;
          f.x = Math.random() * w;
        }
        if (f.x < -20) f.x = w + 20;
        if (f.x > w + 20) f.x = -20;

        ctx.beginPath();
        ctx.globalAlpha = f.a;
        ctx.fillStyle = "rgba(255,255,255,0.9)";
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(tick);
    }

    tick();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }

  // ---- Music helper (autoplay + fallback) ----
  function setupMusic() {
    const audio = $("bgMusic");
    const btn = $("musicBtn");
    const icon = $("musicIcon");
    const text = $("musicText");
    if (!audio || !btn) return;

    const setUI = (playing) => {
      if (icon) icon.textContent = playing ? "⏸" : "♪";
      if (text) text.textContent = playing ? "Pause" : "Tap to Play";
    };

    let playing = false;

    const tryAutoPlay = async () => {
      try {
        audio.volume = 0.65;
        await audio.play();
        playing = true;
        setUI(true);
      } catch {
        playing = false;
        setUI(false);
      }
    };

    const userKick = async () => {
      if (playing) return;
      try {
        await audio.play();
        playing = true;
        setUI(true);
      } catch {}
      window.removeEventListener("pointerdown", userKick);
      window.removeEventListener("keydown", userKick);
    };

    btn.addEventListener("click", async () => {
      if (!playing) {
        try {
          await audio.play();
          playing = true;
          setUI(true);
        } catch {
          playing = false;
          setUI(false);
        }
      } else {
        audio.pause();
        playing = false;
        setUI(false);
      }
    });

    tryAutoPlay();
    window.addEventListener("pointerdown", userKick, { once: true });
    window.addEventListener("keydown", userKick, { once: true });
  }

  // ---- Home hero rotation ----
  function setupHome(imagesCount) {
    const heroImg = $("heroImg");
    if (!heroImg) return;

    let i = 1;
    setInterval(() => {
      i = (i % imagesCount) + 1;
      heroImg.src = imagePath(i);
    }, 2600);
  }

  // ---- Memories gallery + lightbox ----
  function setupMemories(imagesCount) {
    const gallery = $("gallery");
    const lightbox = $("lightbox");
    const lbImg = $("lbImg");
    const lbClose = $("lbClose");
    const lbPrev = $("lbPrev");
    const lbNext = $("lbNext");

    if (!gallery) return;

    let current = 1;
    const open = (idx) => {
      current = idx;
      if (lbImg) lbImg.src = imagePath(current);
      if (lightbox) {
        lightbox.classList.add("show");
        lightbox.setAttribute("aria-hidden", "false");
      }
    };
    const close = () => {
      if (lightbox) {
        lightbox.classList.remove("show");
        lightbox.setAttribute("aria-hidden", "true");
      }
    };
    const next = () => open((current % imagesCount) + 1);
    const prev = () => open(current === 1 ? imagesCount : current - 1);

    const frag = document.createDocumentFragment();
    for (let i = 1; i <= imagesCount; i++) {
      const tile = document.createElement("div");
      tile.className = "tile";
      tile.tabIndex = 0;

      const img = document.createElement("img");
      img.src = imagePath(i);
      img.alt = `Memory ${i}`;

      const badge = document.createElement("div");
      // badge.className = "tileBadge";
      // badge.textContent = `Memory ${i}`;

      tile.appendChild(img);
      tile.appendChild(badge);
      tile.addEventListener("click", () => open(i));
      tile.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") open(i);
      });
      frag.appendChild(tile);
    }
    gallery.appendChild(frag);

    lbClose && lbClose.addEventListener("click", close);
    lbNext && lbNext.addEventListener("click", next);
    lbPrev && lbPrev.addEventListener("click", prev);

    lightbox &&
      lightbox.addEventListener("click", (e) => {
        if (e.target === lightbox) close();
      });

    window.addEventListener("keydown", (e) => {
      if (!lightbox || !lightbox.classList.contains("show")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    });
  }

  // ---- Games ----
  function setupGames(imagesCount) {
    // Tabs
    const tabBtns = document.querySelectorAll(".tabBtn");
    const panels = {
      quiz: document.getElementById("tab-quiz"),
      wheel: document.getElementById("tab-wheel"),
      guess: document.getElementById("tab-guess"),
      tictactoe: document.getElementById("tab-tictactoe"),
    };

    tabBtns.forEach((b) => {
      b.addEventListener("click", () => {
        tabBtns.forEach((x) => x.classList.remove("active"));
        b.classList.add("active");
        const key = b.dataset.tab;
        Object.entries(panels).forEach(([k, el]) => {
          if (!el) return;
          el.classList.toggle("show", k === key);
        });
      });
    });

    // ---------------- 1) QUIZ (Priya vs Riddhikant) ----------------
    const quizBox = $("quizBox");
    const quizSubmit = $("quizSubmit");
    const quizReset = $("quizReset");
    const quizScore = $("quizScore");

    const modeBtns = document.querySelectorAll(".modeBtn");
    let currentMode = "Priya"; // 'Priya' | 'Riddhikant'
    const answers = { Priya: {}, Riddhikant: {} }; // { qIndex: optionIndex }

    const quiz = [
      {
        q: "Who takes more time to get ready?",
        a: ["Priya", "Riddhikant", "Both", "Depends"],
      },
      {
        q: "Who is more likely to plan a surprise?",
        a: ["Priya", "Riddhikant", "Both", "Depends"],
      },
      {
        q: "Who says ‘sorry’ first after a small fight?",
        a: ["Priya", "Riddhikant", "Both", "Depends"],
      },
      {
        q: "Who is more romantic?",
        a: ["Priya", "Riddhikant", "Both", "Depends"],
      },
      {
        q: "Best kind of date?",
        a: ["Movie", "Dinner", "Long drive", "Stay home + talk"],
      },
      {
        q: "Who is more patient?",
        a: ["Priya", "Riddhikant", "Both", "Depends"],
      },
      {
        q: "Your perfect weekend is…",
        a: ["Outing", "Shopping", "Family gathering", "Rest + fun"],
      },
      {
        q: "Who is the better gift-giver?",
        a: ["Priya", "Riddhikant", "Both", "Depends"],
      },
    ];

    function renderQuiz() {
      if (!quizBox) return;

      quizBox.innerHTML = quiz
        .map((item, idx) => {
          const name = `q${idx}-${currentMode}`; // separate names per mode
          const saved = answers[currentMode][idx];

          return `
            <div class="qCard">
              <div class="qTitle">${idx + 1}. ${item.q}</div>
              <div class="optRow">
                ${item.a
                  .map((opt, i) => {
                    const checked = saved === i ? "checked" : "";
                    return `
                      <label>
                        <input type="radio" name="${name}" value="${i}" ${checked} />
                        <span>${opt}</span>
                      </label>`;
                  })
                  .join("")}
              </div>
            </div>
          `;
        })
        .join("");

      // save on change
      quizBox.querySelectorAll('input[type="radio"]').forEach((radio) => {
        radio.addEventListener("change", (e) => {
          const fullName = e.target.name; // q0-Priya
          const qIndex = Number(fullName.split("-")[0].replace("q", ""));
          answers[currentMode][qIndex] = Number(e.target.value);
        });
      });
    }

    function setMode(mode) {
      currentMode = mode;
      modeBtns.forEach((b) =>
        b.classList.toggle("active", b.dataset.mode === mode),
      );
      if (quizScore) quizScore.textContent = "";
      renderQuiz();
    }

    modeBtns.forEach((b) => {
      b.addEventListener("click", () => setMode(b.dataset.mode));
    });

    function calcMatch() {
      let filled = 0;
      let same = 0;
      for (let i = 0; i < quiz.length; i++) {
        const a = answers.Priya[i];
        const b = answers.Riddhikant[i];
        if (typeof a === "number" && typeof b === "number") {
          filled++;
          if (a === b) same++;
        }
      }
      const pct = filled ? Math.round((same / filled) * 100) : 0;
      return { filled, same, pct };
    }

    quizSubmit &&
      quizSubmit.addEventListener("click", () => {
        const PriyaAnswered = Object.keys(answers.Priya).length;
        const RiddhikantAnswered = Object.keys(answers.Riddhikant).length;

        const { filled, same, pct } = calcMatch();

        if (quizScore) {
          if (!PriyaAnswered || !RiddhikantAnswered) {
            quizScore.textContent =
              "First answer in both sections (Priya + Riddhikant), then tap ‘Show Result’.";
          } else {
            quizScore.textContent =
              `Match: ${same}/${filled} same answers • ${pct}% compatibility 💖` +
              (pct >= 80
                ? "  (Soulmates vibes!)"
                : pct >= 55
                  ? "  (Cute & strong!)"
                  : "  (Opposites attract 😄)");
          }
        }
      });

    quizReset &&
      quizReset.addEventListener("click", () => {
        answers.Priya = {};
        answers.Riddhikant = {};
        if (quizScore) quizScore.textContent = "";
        setMode("Priya");
      });

    // initial render
    if (quizBox) renderQuiz();

    // ---------------- 2) LOVE WHEEL ----------------
    const wheel = $("wheel");
    const spinBtn = $("spinBtn");
    const spinReset = $("spinReset");
    const spinResult = $("spinResult");

    const wheelTasks = [
      "Say 3 things you love about each other",
      "Take a selfie together",
      "Dance for 30 seconds",
      "Share your best memory from last year",
      "Give a surprise hug",
      "Compliment each other (5 lines)",
      "Plan a short date this week",
      "Promise one new habit together",
    ];
    const wheelLabels = [
      "3 Things",
      "Selfie",
      "Dance",
      "Best Memory",
      "Hug",
      "Compliments",
      "Date Plan",
      "New Habit",
    ];
    const wheelColors = [
      "#ff5fa2",
      "#ff8a5b",
      "#ffd166",
      "#8be28b",
      "#45d4ff",
      "#6d93ff",
      "#a88bff",
      "#ff79c6",
    ];

    let spinning = false;
    let wheelAngle = 0;

    const renderWheelFace = () => {
      if (!wheel) return;
      const slice = 360 / wheelTasks.length;
      const gradient = wheelColors
        .map((color, idx) => {
          const start = idx * slice;
          const end = (idx + 1) * slice;
          return `${color} ${start}deg ${end}deg`;
        })
        .join(", ");
      wheel.style.background = `conic-gradient(from -90deg, ${gradient})`;

      wheel.innerHTML = "";
      const labelsLayer = document.createElement("div");
      labelsLayer.className = "wheelLabels";

      wheelLabels.forEach((label, idx) => {
        const node = document.createElement("div");
        const angle = idx * slice + slice / 2;
        node.className = "wheelLabel";
        node.textContent = label;
        node.style.transform =
          `translate(-50%, -50%) rotate(${angle}deg) ` +
          `translateY(-118px) rotate(${-angle}deg)`;
        labelsLayer.appendChild(node);
      });

      const center = document.createElement("div");
      center.className = "wheelCenter";
      wheel.appendChild(labelsLayer);
      wheel.appendChild(center);
    };

    const spin = () => {
      if (!wheel || spinning) return;
      spinning = true;

      const pick = Math.floor(Math.random() * wheelTasks.length);
      const slice = 360 / wheelTasks.length;
      const targetAngle = 360 * 5 + (360 - (pick * slice + slice / 2));
      wheelAngle = targetAngle;
      wheel.style.transform = `rotate(${wheelAngle}deg)`;

      setTimeout(() => {
        spinning = false;
        if (spinResult) spinResult.textContent = `Result: ${wheelTasks[pick]}`;
      }, 3200);
    };

    spinBtn && spinBtn.addEventListener("click", spin);
    spinReset &&
      spinReset.addEventListener("click", () => {
        if (!wheel) return;
        wheelAngle = 0;
        wheel.style.transform = "rotate(0deg)";
        if (spinResult) spinResult.textContent = "";
      });
    renderWheelFace();

    // ---------------- 3) GUESS THE YEAR ----------------
    const guessImg = $("guessImg");
    const guessNext = $("guessNext");
    const guessMsg = $("guessMsg");
    const yearGrid = $("yearGrid");

    const yearForImageIndex = (imgIdx) => IMAGE_YEAR_BY_INDEX[imgIdx];
    const availableYears = [
      ...new Set(
        Object.entries(IMAGE_YEAR_BY_INDEX)
          .filter(([idx]) => Number(idx) <= imagesCount)
          .map(([, year]) => year),
      ),
    ].sort((a, b) => a - b);
    let currentGuessImg = 1;

    const loadGuess = () => {
      currentGuessImg = Math.floor(Math.random() * imagesCount) + 1;
      if (guessImg) guessImg.src = imagePath(currentGuessImg);
      if (guessMsg) guessMsg.textContent = "";
    };

    if (yearGrid) {
      yearGrid.innerHTML = availableYears.map((yr) => {
        return `<button class="yearBtn" data-year="${yr}">Year ${yr}</button>`;
      }).join("");

      yearGrid.addEventListener("click", (e) => {
        const btn = e.target.closest(".yearBtn");
        if (!btn) return;
        const chosenYear = Number(btn.dataset.year);
        const correctYear = yearForImageIndex(currentGuessImg);
        if (!correctYear) {
          if (guessMsg) guessMsg.textContent = "Year not mapped for this image yet.";
          return;
        }
        if (guessMsg) {
          guessMsg.textContent =
            chosenYear === correctYear
              ? `Correct ✅ This one is mapped to Year ${correctYear}!`
              : `Oops 😄 Correct was Year ${correctYear}. Try next!`;
        }
      });
    }

    guessNext && guessNext.addEventListener("click", loadGuess);
    loadGuess();
    // ---------------- 4) LOVE TIC-TAC-TOE ----------------
    const tttBoard = $("tttBoard");
    const tttTurn = $("tttTurn");
    const tttReset = $("tttReset");
    const tttSwap = $("tttSwap");
    const tttMsg = $("tttMsg");

    if (tttBoard) {
      let board = Array(9).fill("");
      let current = "X";
      let locked = false;
      const playerFor = { X: "Pia", O: "Rohit" };

      const WIN_LINES = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
      ];

      const setTurnText = () => {
        if (tttTurn) tttTurn.textContent = `${playerFor[current]} (${current}) turn`;
      };

      const getWinnerLine = () => {
        for (const [a, b, c] of WIN_LINES) {
          if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return [a, b, c];
          }
        }
        return null;
      };

      const paintWin = (line) => {
        const cells = tttBoard.querySelectorAll(".tttCell");
        line.forEach((idx) => {
          if (!cells[idx]) return;
          cells[idx].style.background = "rgba(255, 119, 183, 0.22)";
          cells[idx].style.borderColor = "rgba(255, 119, 183, 0.5)";
        });
      };

      const renderTtt = () => {
        tttBoard.innerHTML = "";
        board.forEach((mark, idx) => {
          const cell = document.createElement("button");
          cell.type = "button";
          cell.className = "tttCell";
          cell.dataset.idx = String(idx);
          cell.textContent = mark;
          cell.setAttribute("aria-label", `Cell ${idx + 1}`);
          tttBoard.appendChild(cell);
        });
      };

      const resetTtt = () => {
        board = Array(9).fill("");
        current = "X";
        locked = false;
        if (tttMsg) tttMsg.textContent = "";
        renderTtt();
        setTurnText();
      };

      tttBoard.addEventListener("click", (e) => {
        const cell = e.target.closest(".tttCell");
        if (!cell || locked) return;
        const idx = Number(cell.dataset.idx);
        if (Number.isNaN(idx) || board[idx]) return;

        board[idx] = current;
        renderTtt();

        const winnerLine = getWinnerLine();
        if (winnerLine) {
          locked = true;
          paintWin(winnerLine);
          if (tttTurn) tttTurn.textContent = `${playerFor[current]} (${current}) wins!`;
          if (tttMsg) tttMsg.textContent = "Winner!";
          return;
        }

        if (board.every((x) => x)) {
          locked = true;
          if (tttTurn) tttTurn.textContent = "Draw game";
          if (tttMsg) tttMsg.textContent = "It's a draw. Tap Reset.";
          return;
        }

        current = current === "X" ? "O" : "X";
        setTurnText();
      });

      tttReset && tttReset.addEventListener("click", resetTtt);
      tttSwap &&
        tttSwap.addEventListener("click", () => {
          [playerFor.X, playerFor.O] = [playerFor.O, playerFor.X];
          resetTtt();
          if (tttMsg) {
            tttMsg.textContent = `Swapped: ${playerFor.X} is X, ${playerFor.O} is O`;
          }
        });

      resetTtt();
    }
  }

  // ---- Public API ----
  window.ANNIV = {
    init({ page, imagesCount = 12 }) {
      setupMusic();
      startSnow($("confetti"));

      if (page === "home") setupHome(imagesCount);
      if (page === "memories") setupMemories(imagesCount);
      if (page === "games") setupGames(imagesCount);
    },
  };
})();
