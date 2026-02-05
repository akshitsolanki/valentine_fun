const APP_CONFIG = window.APP_CONFIG || {};
const APP_MEDIA = APP_CONFIG.media || {};
const normalizeBase = (base, fallback) => {
  let value = (base || '').trim();
  if (!value) value = fallback || '';
  if (value && !value.endsWith('/')) value += '/';
  return value;
};
const APP_IMAGES_BASE = normalizeBase(APP_CONFIG.imagesBase, '/images/');
const APP_SEND_AGREEMENT_URL = (APP_CONFIG.api && APP_CONFIG.api.sendAgreement) || '/send-agreement';
const mediaSrc = (key, fallback) => APP_MEDIA[key] || fallback;
const DEFAULT_NAMES = { a: 'Akshit', b: 'Aarzu' };
const APP_NAMES = {
  a: (APP_CONFIG.names && APP_CONFIG.names.a) ? String(APP_CONFIG.names.a).trim() : DEFAULT_NAMES.a,
  b: (APP_CONFIG.names && APP_CONFIG.names.b) ? String(APP_CONFIG.names.b).trim() : DEFAULT_NAMES.b
};

let isSoundOn = true;
let isMotionReduced = false;

const loveQuotes = [
  'You are my favorite feeling.',
  'My heart chose you — and keeps choosing you.',
  'You make ordinary days feel like poetry.',
  'Every little moment with you is a treasure.',
  'I love you more than words could ever hold.',
  'You are my calm, my sparkle, my home.',
  'I’d choose you in every lifetime.',
  'You are the sweetest part of my day.',
  'We are a love story I never want to end.',
  'Forever feels right when it’s with you.'
];

const setSoundState = (enabled, bgMusic, toggleBtn) => {
  isSoundOn = enabled;
  if (toggleBtn) toggleBtn.textContent = enabled ? '🔊' : '🔈';
  localStorage.setItem('valentine-sound', enabled ? 'on' : 'off');
  if (!bgMusic) return;
  if (enabled) {
    bgMusic.play().catch(() => {});
  } else {
    bgMusic.pause();
  }
};

const setMotionState = (reduced, toggleBtn) => {
  isMotionReduced = reduced;
  document.body.classList.toggle('reduced-motion', reduced);
  if (toggleBtn) toggleBtn.textContent = reduced ? 'Motion Off' : 'Motion';
  localStorage.setItem('valentine-motion', reduced ? 'reduced' : 'full');
};

document.addEventListener('DOMContentLoaded', () => {
  const noBtn = document.getElementById('no');
  const yesBtn = document.getElementById('yes');
  const confettiRoot = document.getElementById('confetti');
  const heartsBg = document.getElementById('hearts-bg');
  const loveMessage = document.getElementById('love-message');
  const catVideo = document.getElementById('cat-video');
  const catSource = catVideo ? catVideo.querySelector('source') : null;
  const cryingMessage = document.getElementById('crying-message');
  const bgMusic = document.getElementById('bg-music');
  const welcomeOverlay = document.getElementById('welcome-overlay');
  const openBtn = document.getElementById('open-btn');
  const quoteBtn = document.getElementById('quote-btn');
  const quoteOutput = document.getElementById('quote-output');
  const soundToggle = document.getElementById('sound-toggle');
  const motionToggle = document.getElementById('motion-toggle');

  const savedSound = localStorage.getItem('valentine-sound');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const savedMotion = localStorage.getItem('valentine-motion');

  setSoundState(savedSound !== 'off', bgMusic, soundToggle);
  setMotionState(savedMotion ? savedMotion === 'reduced' : prefersReduced, motionToggle);

  applyNames();

  if (soundToggle) {
    soundToggle.addEventListener('click', () => {
      setSoundState(!isSoundOn, bgMusic, soundToggle);
    });
  }

  if (motionToggle) {
    motionToggle.addEventListener('click', () => {
      setMotionState(!isMotionReduced, motionToggle);
    });
  }

  // Music state switching function
  const playMusic = (src) => {
    if (!bgMusic || !isSoundOn) return;
    bgMusic.pause();
    bgMusic.src = src;
    bgMusic.load();
    bgMusic.play().catch(() => {});
  };

  // Handle Welcome Overlay Click
  if (openBtn && welcomeOverlay) {
    openBtn.addEventListener('click', () => {
      welcomeOverlay.classList.add('overlay-hidden');
      setTimeout(() => {
        welcomeOverlay.style.display = 'none';
        const nav = document.querySelector('.nav');
        if (nav) {
          setTimeout(() => nav.classList.add('visible'), 500);
        }
      }, 500);
      if (isSoundOn && bgMusic) {
        bgMusic.play().catch(() => {});
      }
    });
  }

  // Floating hearts
  createFloatingHearts(heartsBg, 20);
  createFloatingSparkles(document.getElementById('sparkles-bg'), 15);
  createFloatingFlowers(document.getElementById('flowers-bg'), 10);

  initCursorTrail();
  initReasons();
  initSecretLetter();
  initThemeToggle();
  initParallax();
  initEasterEgg();
  initSmoothScroll();
  initScrollAnimations();
  initClickHearts();
  initHoverSparkles();

  if (quoteBtn && quoteOutput) {
    quoteBtn.addEventListener('click', () => {
      const quote = loveQuotes[Math.floor(Math.random() * loveQuotes.length)];
      quoteOutput.textContent = quote;
      quoteOutput.classList.remove('fade-in');
      void quoteOutput.offsetWidth;
      quoteOutput.classList.add('fade-in');
      playChime();
    });
  }

  // Typewriter title
  const title = document.getElementById('main-title');
  if (title) {
    typeWriterTitle(title, `Will you be my Valentine, ${APP_NAMES.b}?`, 90);
  }

  if (!noBtn) return;

  let noClickCount = 0;
  const noTexts = [
    'No 😢',
    'Are you sure? 💔',
    'Really?? 😿',
    'Don’t do this... 😭',
    'Heart broken... 💔',
    'Please say Yes? 🎀'
  ];

  noBtn.addEventListener('click', () => {
    noClickCount++;

    playMusic(mediaSrc('sad', 'sad.mp3'));

    if (catSource && catVideo) {
      catSource.src = mediaSrc('catCrying', 'cat_crying.mp4');
      catVideo.load();
      catVideo.play();
    }

    if (cryingMessage) {
      cryingMessage.classList.remove('hidden');
    }

    document.body.classList.add('glitch');
    playBeep(220, 0.08, 0.06);

    if (noClickCount < noTexts.length) {
      noBtn.textContent = noTexts[noClickCount];
    }

    const yesBtnInner = document.getElementById('yes');
    if (yesBtnInner) {
      const currentScale = 1 + (noClickCount * 0.15);
      yesBtnInner.style.setProperty('--yes-scale', currentScale);
    }

    const x = Math.random() * (window.innerWidth - noBtn.offsetWidth);
    const y = Math.random() * (window.innerHeight - noBtn.offsetHeight);
    noBtn.style.position = 'fixed';
    noBtn.style.left = x + 'px';
    noBtn.style.top = y + 'px';
  });

  if (yesBtn) {
    yesBtn.addEventListener('click', () => {
      document.body.classList.remove('glitch');

      const buttonsContainer = document.querySelector('.buttons');
      if (buttonsContainer) buttonsContainer.style.display = 'none';
      if (noBtn) noBtn.style.display = 'none';
      if (cryingMessage) cryingMessage.classList.add('hidden');

      const extraFeatures = document.getElementById('extra-features');
      if (extraFeatures) extraFeatures.classList.remove('hidden');

      playMusic(mediaSrc('happy', 'happy.mp3'));

      fetch(APP_SEND_AGREEMENT_URL, { method: 'POST' })
        .then(response => response.json())
        .then(data => console.log('Mail sent:', data))
        .catch(err => console.error('Mail error:', err));

      if (catSource && catVideo) {
        catSource.src = mediaSrc('catDancing', 'cat_dancing.mp4');
        catVideo.load();
        catVideo.play();
      }

      playChime();
      launchConfetti(confettiRoot, 150);
      showHappyOverlay();

      if (loveMessage) {
        loveMessage.classList.remove('hidden');
        loveMessage.classList.add('fade-in');
      }

      const slideshow = document.getElementById('slideshow');
      if (slideshow) {
        slideshow.classList.remove('hidden');
        startSlideshow(slideshow);
      }
    });
  }
});

function applyNames() {
  const coupleText = `${APP_NAMES.a} & ${APP_NAMES.b}`;
  document.querySelectorAll('[data-name=\"a\"]').forEach(el => { el.textContent = APP_NAMES.a; });
  document.querySelectorAll('[data-name=\"b\"]').forEach(el => { el.textContent = APP_NAMES.b; });
  document.querySelectorAll('[data-couple]').forEach(el => { el.textContent = coupleText; });
}

function initCursorTrail() {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  const sparkles = ['✨', '💖', '💫'];

  document.addEventListener('mousemove', (e) => {
    if (Math.random() < 0.35) {
      const trail = document.createElement('div');
      trail.className = 'sparkle-trail';
      trail.textContent = sparkles[Math.floor(Math.random() * sparkles.length)];
      trail.style.left = e.clientX + 'px';
      trail.style.top = e.clientY + 'px';
      document.body.appendChild(trail);
      setTimeout(() => {
        if (trail.parentNode) {
          trail.parentNode.removeChild(trail);
        }
      }, 700);
    }
  });
}

function initThemeToggle() {
  const themeToggle = document.getElementById('theme-toggle');
  const body = document.body;

  const savedTheme = localStorage.getItem('valentine-theme');
  if (savedTheme === 'dark') {
    body.classList.add('dark-mode');
    if (themeToggle) themeToggle.textContent = '☀️';
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      body.classList.toggle('dark-mode');
      const isDark = body.classList.contains('dark-mode');
      themeToggle.textContent = isDark ? '☀️' : '🌙';
      localStorage.setItem('valentine-theme', isDark ? 'dark' : 'light');
    });
  }
}

function initParallax() {
  if (document.body.classList.contains('reduced-motion')) return;
  const heartsBg = document.getElementById('hearts-bg');
  const sparklesBg = document.getElementById('sparkles-bg');
  const flowersBg = document.getElementById('flowers-bg');

  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;

    if (heartsBg) heartsBg.style.transform = `translateY(${rate * 0.8}px)`;
    if (sparklesBg) sparklesBg.style.transform = `translateY(${rate * 0.6}px)`;
    if (flowersBg) flowersBg.style.transform = `translateY(${rate * 0.4}px)`;
  });
}

function initEasterEgg() {
  const easterEgg = document.getElementById('easter-egg');
  const secretMessage = document.getElementById('secret-message');

  if (!easterEgg || !secretMessage) return;

  easterEgg.addEventListener('click', () => {
    secretMessage.classList.remove('hidden');
    setTimeout(() => {
      secretMessage.classList.add('hidden');
    }, 5000);

    for (let i = 0; i < 10; i++) {
      setTimeout(() => {
        const heart = document.createElement('div');
        heart.textContent = '💖';
        heart.style.position = 'fixed';
        heart.style.left = '50%';
        heart.style.top = '50%';
        heart.style.fontSize = '2rem';
        heart.style.pointerEvents = 'none';
        heart.style.zIndex = '9999';
        heart.style.animation = 'burst 1s ease-out forwards';
        document.body.appendChild(heart);
        setTimeout(() => heart.remove(), 1000);
      }, i * 100);
    }
  });
}

function initSmoothScroll() {
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

function initScrollAnimations() {
  const sections = document.querySelectorAll('.section');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  sections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(50px)';
    section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    observer.observe(section);
  });
}

function initReasons() {
  const showBtn = document.getElementById('show-reasons');
  const modal = document.getElementById('reasons-modal');
  const grid = document.getElementById('reasons-grid');
  const closeBtn = document.getElementById('reasons-close');

  const reasons = [
    'Your laugh is my favorite sound 🎵',
    'The way you care about small things 🌼',
    'You make me feel safe and loved ❤️',
    'Our late night conversations 🌙',
    'Your beautiful eyes ✨',
    'How you listen to my silly stories 👂',
    'The way you support my dreams 🌟',
    'Your kind and pure heart 💖',
    'Every memory we have made together 📸',
    'Just being YOU is enough 🎀'
  ];

  if (showBtn && modal) {
    showBtn.addEventListener('click', () => {
      grid.innerHTML = '';
      reasons.forEach(r => {
        const box = document.createElement('div');
        box.className = 'reason-box';
        box.textContent = r;
        grid.appendChild(box);
      });
      modal.classList.remove('hidden');
    });
  }

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => {
      modal.classList.add('hidden');
    });
  }
}

function initSecretLetter() {
  const showBtn = document.getElementById('show-letter');
  const modal = document.getElementById('letter-modal');
  const closeBtn = document.getElementById('letter-close');
  const openBtn = document.getElementById('letter-open-btn');
  const letterText = document.getElementById('letter-text');
  const envelope = document.getElementById('letter-envelope');

  if (showBtn && modal) {
    showBtn.addEventListener('click', () => {
      modal.classList.remove('hidden');
      if (envelope) envelope.classList.remove('open');
      if (letterText) letterText.classList.add('hidden');
    });
  }

  if (openBtn && envelope) {
    openBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      envelope.classList.add('open');
      if (letterText) letterText.classList.remove('hidden');
    });
  }

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => {
      modal.classList.add('hidden');
    });
  }
}

function initClickHearts() {
  document.addEventListener('click', (e) => {
    if (e.target.closest('.nav') || e.target.closest('.modal')) return;
    spawnHeartBurst(e.clientX, e.clientY, 6);
  });
}

function initHoverSparkles() {
  const targets = document.querySelectorAll('.pill-btn, .note-card, .moment-card');
  targets.forEach(target => {
    target.addEventListener('mouseenter', () => {
      const sparkle = document.createElement('div');
      sparkle.className = 'trail-sparkle';
      sparkle.textContent = '✨';
      const rect = target.getBoundingClientRect();
      sparkle.style.left = rect.left + rect.width - 10 + 'px';
      sparkle.style.top = rect.top + 10 + 'px';
      document.body.appendChild(sparkle);
      setTimeout(() => sparkle.remove(), 800);
    });
  });
}

function createFloatingHearts(container, count) {
  if (!container) return;
  for (let i = 0; i < count; i++) {
    const heart = document.createElement('div');
    heart.className = 'heart';
    heart.textContent = '💖';
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.animationDelay = Math.random() * 12 + 's';
    heart.style.fontSize = (24 + Math.random() * 16) + 'px';
    container.appendChild(heart);
  }
}

function createFloatingSparkles(container, count) {
  if (!container) return;
  for (let i = 0; i < count; i++) {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    sparkle.textContent = '✨';
    sparkle.style.left = Math.random() * 100 + 'vw';
    sparkle.style.animationDelay = Math.random() * 10 + 's';
    sparkle.style.fontSize = (16 + Math.random() * 8) + 'px';
    container.appendChild(sparkle);
  }
}

function createFloatingFlowers(container, count) {
  if (!container) return;
  const flowers = ['🌸', '🌺', '🌻', '🌷', '🌹'];
  for (let i = 0; i < count; i++) {
    const flower = document.createElement('div');
    flower.className = 'flower';
    flower.textContent = flowers[Math.floor(Math.random() * flowers.length)];
    flower.style.left = Math.random() * 100 + 'vw';
    flower.style.animationDelay = Math.random() * 15 + 's';
    flower.style.fontSize = (20 + Math.random() * 12) + 'px';
    container.appendChild(flower);
  }
}

function typeWriterTitle(el, text, delay = 100) {
  el.textContent = '';
  let i = 0;
  const t = setInterval(() => {
    if (i < text.length) {
      el.textContent += text[i];
      i++;
    } else {
      clearInterval(t);
    }
  }, delay);
}

function typeWriter(el, text, delay = 40, cb) {
  el.textContent = '';
  let i = 0;
  const cursor = document.createElement('span');
  cursor.className = 'typewriter-cursor';
  cursor.textContent = '|';
  el.appendChild(cursor);

  const t = setInterval(() => {
    if (i < text.length) {
      cursor.insertAdjacentText('beforebegin', text[i]);
      i++;
    } else {
      clearInterval(t);
      cursor.remove();
      if (cb) cb();
    }
  }, delay);
}

function playBeep(freq = 440, gain = 0.05, duration = 0.1) {
  if (!isSoundOn) return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'sine';
    o.frequency.value = freq;
    g.gain.value = gain;
    o.connect(g); g.connect(ctx.destination);
    o.start();
    setTimeout(() => { o.stop(); ctx.close(); }, duration * 1000);
  } catch (e) { }
}

function playChime() {
  if (!isSoundOn) return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const now = ctx.currentTime;
    const o1 = ctx.createOscillator(), o2 = ctx.createOscillator();
    const g = ctx.createGain();
    o1.type = 'sine'; o2.type = 'sine';
    o1.frequency.value = 440; o2.frequency.value = 660;
    o1.connect(g); o2.connect(g); g.connect(ctx.destination);
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(0.12, now + 0.02);
    o1.start(now); o2.start(now);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
    o1.stop(now + 0.7); o2.stop(now + 0.7);
    setTimeout(() => ctx.close(), 900);
  } catch (e) { }
}

function launchConfetti(root, count = 60) {
  if (!root) return;
  const colors = ['#ff6b81','#ffd166','#6bcBff','#b28cff','#ff9fb1'];
  for (let i=0;i<count;i++){
    const el = document.createElement('div');
    el.className = 'confetti-piece';
    el.style.background = colors[Math.floor(Math.random()*colors.length)];
    const left = Math.random()*100;
    el.style.left = left + 'vw';
    el.style.top = (-10 - Math.random()*20) + 'vh';
    el.style.width = (6 + Math.random()*12) + 'px';
    el.style.height = (8 + Math.random()*18) + 'px';
    el.style.borderRadius = (Math.random()>0.5? '2px' : '50%');
    const delay = Math.random()*0.5;
    const duration = 1.8 + Math.random()*1.2;
    el.style.animation = `confetti-fall ${duration}s ${delay}s linear forwards`;
    el.style.transform = `rotate(${Math.random()*360}deg)`;
    root.appendChild(el);
    setTimeout(()=>{ try{ root.removeChild(el); }catch(e){} }, (delay+duration)*1000 + 300);
  }
}

function showHappyOverlay() {
  const overlay = document.createElement('div');
  overlay.className = 'happy-overlay';
  overlay.innerHTML = `
    <div class="happy-card">
      <h2>Yes! ❤️</h2>
      <p>She said YES — you did it. 🎉</p>
      <p>Keep being kind and thoughtful. 💕</p>
      <button id="closeHappy">Close</button>
    </div>`;
  document.body.appendChild(overlay);
  document.getElementById('closeHappy').addEventListener('click', ()=> overlay.remove());
}

function escapeHtml(s){ return s.replace(/[&<>"]/g, c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[c])); }

function startSlideshow(container) {
  const totalPics = 16;
  const fallbackSvg = encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200">
      <rect width="100%" height="100%" fill="#ffeef6"/>
      <text x="50%" y="50%" font-size="18" text-anchor="middle" fill="#ff6b81" font-family="Arial" dy=".35em">Missing image</text>
    </svg>`
  );
  const fallbackSrc = `data:image/svg+xml;charset=UTF-8,${fallbackSvg}`;
  const captions = [
    '🌹 Every moment with you is magic',
    '💕 You make my heart skip a beat',
    '🌟 My shining star',
    '❤️ Forever and always',
    '🌸 Beautiful memories together',
    '✨ You light up my life',
    '🍀 So lucky to have you',
    '💍 Counting days together',
    '🧸 My cutie pie',
    '🎈 Floating in love with you',
    '🌈 You bring color to my world',
    '🍭 Sweetest person I know',
    '☀️ My sunshine in the rain',
    '🌌 Lost in your eyes',
    '🎀 Perfect in every way',
    '💌 A love story like no other',
    '🔥 You set my soul on fire',
    '💎 You are a rare gem',
    '💘 Struck by Cupid\'s arrow',
    '🦋 Butterflies every time I see you',
    '🥂 To us and our future',
    '💖 I love you more than words!'
  ];

  container.innerHTML = '';

  for (let i = 1; i <= totalPics; i++) {
    const slide = document.createElement('div');
    slide.className = 'slide' + (i === 1 ? ' active' : '');
    slide.innerHTML = `
      <img src="${APP_IMAGES_BASE}${i}.jpg" alt="Memory ${i}">
      <div class="slide-caption">${captions[(i - 1) % captions.length]}</div>
    `;
    container.appendChild(slide);
  }

  const slides = container.querySelectorAll('.slide');
  slides.forEach((slideEl, idx) => {
    const img = slideEl.querySelector('img');
    if (!img) return;
    img.addEventListener('error', () => {
      console.warn(`Image missing: ${APP_IMAGES_BASE}${idx + 1}.jpg`);
      img.onerror = null;
      img.src = fallbackSrc;
    });
  });

  let current = 0;
  setInterval(() => {
    slides[current].classList.remove('active');
    current = (current + 1) % slides.length;
    slides[current].classList.add('active');
  }, 3000);
}

function spawnHeartBurst(x, y, count = 6) {
  for (let i = 0; i < count; i++) {
    const heart = document.createElement('div');
    heart.textContent = '💗';
    heart.style.position = 'fixed';
    heart.style.left = x + 'px';
    heart.style.top = y + 'px';
    heart.style.fontSize = '14px';
    heart.style.pointerEvents = 'none';
    heart.style.zIndex = '9999';
    heart.style.animation = 'burst 1s ease-out forwards';
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 1000);
  }
}

// Valentine Week Features
document.addEventListener('DOMContentLoaded', () => {
  const musicToggle = document.getElementById('music-toggle');
  const dayMusic = document.getElementById('day-music');
  if (musicToggle && dayMusic) {
    let musicPlaying = false;
    musicToggle.addEventListener('click', () => {
      if (musicPlaying) {
        dayMusic.pause();
        musicToggle.textContent = '🎵 Play Music';
      } else {
        dayMusic.play().catch(() => {});
        musicToggle.textContent = '🎵 Pause Music';
      }
      musicPlaying = !musicPlaying;
    });
  }

  const floatingHearts = document.getElementById('floating-hearts');
  if (floatingHearts) {
    const createHeart = () => {
      const heart = document.createElement('div');
      heart.textContent = '❤️';
      heart.style.position = 'absolute';
      heart.style.fontSize = Math.random() * 20 + 20 + 'px';
      heart.style.left = Math.random() * 100 + 'vw';
      heart.style.animation = 'float 3s ease-in-out infinite';
      heart.style.pointerEvents = 'none';
      floatingHearts.appendChild(heart);
      setTimeout(() => {
        heart.remove();
      }, 3000);
    };
    setInterval(createHeart, 1000);
  }
});
