const APP_CONFIG = window.APP_CONFIG || {};
const APP_MEDIA = APP_CONFIG.media || {};
const normalizeBase = (base, fallback) => {
  let value = (base || '').trim();
  if (!value) value = fallback || '';
  if (value && !value.endsWith('/')) value += '/';
  return value;
};
const APP_IMAGES_BASE = normalizeBase(
  APP_CONFIG.imagesBase,
  '/images/'
);
const APP_SEND_AGREEMENT_URL = (APP_CONFIG.api && APP_CONFIG.api.sendAgreement) || '/send-agreement';
const mediaSrc = (key, fallback) => APP_MEDIA[key] || fallback;

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

  // Music state switching function
  const playMusic = (src) => {
    if (bgMusic) {
      bgMusic.pause();
      bgMusic.src = src;
      bgMusic.load();
      bgMusic.play().catch(e => console.log("Music play blocked:", e));
    }
  };

  // Handle Welcome Overlay Click
  if (openBtn && welcomeOverlay) {
    openBtn.addEventListener('click', () => {
      welcomeOverlay.classList.add('overlay-hidden');
      setTimeout(() => {
        welcomeOverlay.style.display = 'none';
      }, 500); // Remove from layout after animation
      if (bgMusic) {
        bgMusic.play().catch(e => console.log("Direct play blocked:", e));
      }
    });
  }

  // Floating hearts
  createFloatingHearts(heartsBg, 20);
  // Sparkles
  createFloatingSparkles(document.getElementById('sparkles-bg'), 15);
  // Flowers
  createFloatingFlowers(document.getElementById('flowers-bg'), 10);

  initCursorTrail();
  initReasons();
  initSecretLetter();

  // Typewriter title
  const title = document.getElementById('main-title');
  if (title) {
    typeWriterTitle(title, '💖 Will you be my Valentine? 💖', 100);
  }

  if (!noBtn) return;

  let noClickCount = 0;
  const noTexts = [
    "NO 😢",
    "Are you sure? 💔",
    "Really?? 😿",
    "Don't do this... 😭",
    "Heart broken... 💔",
    "Pls say YES? 🎀"
  ];

  noBtn.addEventListener('click', () => {
    noClickCount++;
    
    // Switch to sad music
    playMusic(mediaSrc('sad', 'sad.mp3'));

    // Switch to crying cat
    if (catSource && catVideo) {
      catSource.src = mediaSrc('catCrying', 'cat_crying.mp4');
      catVideo.load();
      catVideo.play();
    }
    
    // Show crying message
    if (cryingMessage) {
      cryingMessage.classList.remove('hidden');
    }

    document.body.classList.add('glitch');
    playBeep(220, 0.08, 0.06);

    // Update NO button text
    if (noClickCount < noTexts.length) {
      noBtn.textContent = noTexts[noClickCount];
    }

    // Make YES button bigger using CSS variable
    const yesBtn = document.getElementById('yes');
    if (yesBtn) {
      const currentScale = 1 + (noClickCount * 0.15);
      yesBtn.style.setProperty('--yes-scale', currentScale);
    }

    // Move NO button randomly to make it harder (optional but fun)
    const x = Math.random() * (window.innerWidth - noBtn.offsetWidth);
    const y = Math.random() * (window.innerHeight - noBtn.offsetHeight);
    noBtn.style.position = 'fixed';
    noBtn.style.left = x + 'px';
    noBtn.style.top = y + 'px';
  });

  // YES behavior: confetti + chime + happy overlay + reveal love message + slideshow + dancing cat
  if (yesBtn) {
    yesBtn.addEventListener('click', () => {
      // Remove glitch if it was active
      document.body.classList.remove('glitch');
      
      // Hide the buttons container and crying message
      const buttonsContainer = document.querySelector('.buttons');
      if (buttonsContainer) buttonsContainer.style.display = 'none';
      if (noBtn) noBtn.style.display = 'none'; // Just in case it was fixed elsewhere
      if (cryingMessage) cryingMessage.classList.add('hidden');

      // Show extra features (Reasons/Letter)
      const extraFeatures = document.getElementById('extra-features');
      if (extraFeatures) extraFeatures.classList.remove('hidden');

      // Switch to happy music
      playMusic(mediaSrc('happy', 'happy.mp3'));

      // Trigger Agreement Email
      // Automatically switches between Local and Netlify Production
      fetch(APP_SEND_AGREEMENT_URL, { 
        method: 'POST'
      })
        .then(response => response.json())
        .then(data => console.log('Mail sent:', data))
        .catch(err => console.error('Mail error:', err));

      // Switch to dancing cat
      if (catSource && catVideo) {
      catSource.src = mediaSrc('catDancing', 'cat_dancing.mp4');
        catVideo.load();
        catVideo.play();
      }

      playChime();
      launchConfetti(confettiRoot, 150);
      showHappyOverlay();
      // Reveal love message
      if (loveMessage) {
        loveMessage.classList.remove('hidden');
        loveMessage.classList.add('fade-in');
      }
      // Start slideshow
      const slideshow = document.getElementById('slideshow');
      if (slideshow) {
        slideshow.classList.remove('hidden');
        startSlideshow(slideshow);
      }
    });
  }
});

function initCursorTrail() {
  const container = document.getElementById('cursor-trail-container');
  const symbols = ['✨', '💖', '⭐', '🌸'];
  let lastPos = { x: 0, y: 0 };

  document.addEventListener('mousemove', (e) => {
    // Release stars much faster
    const dist = Math.hypot(e.clientX - lastPos.x, e.clientY - lastPos.y);
    if (dist < 6) return; 
    lastPos = { x: e.clientX, y: e.clientY };

    const sparkle = document.createElement('div');
    sparkle.className = 'trail-sparkle';
    sparkle.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    // Random slight offset for more "release" feel
    const offX = (Math.random() - 0.5) * 15;
    const offY = (Math.random() - 0.5) * 15;
    sparkle.style.left = (e.clientX + offX) + 'px';
    sparkle.style.top = (e.clientY + offY) + 'px';
    container.appendChild(sparkle);
    
    setTimeout(() => sparkle.remove(), 600);
  });
}

function initReasons() {
  const showBtn = document.getElementById('show-reasons');
  const modal = document.getElementById('reasons-modal');
  const grid = document.getElementById('reasons-grid');
  const closeBtn = document.getElementById('reasons-close');

  const reasons = [
    "Your laugh is my favorite sound 🎵",
    "The way you care about small things 🥺",
    "You make me feel safe and loved ❤️",
    "Our late night conversations 🌙",
    "Your beautiful eyes ✨",
    "How you listen to my silly stories 👂",
    "The way you support my dreams 🌟",
    "Your kind and pure heart 💖",
    "Every memory we've made together 📸",
    "Just being YOU is enough 🎀"
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

function createFloatingHearts(container, count) {
  for (let i = 0; i < count; i++) {
    const heart = document.createElement('div');
    heart.className = 'heart';
    heart.textContent = '💖';
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.animationDelay = Math.random() * 6 + 's';
    heart.style.fontSize = (20 + Math.random() * 20) + 'px';
    container.appendChild(heart);
  }
}

function createFloatingSparkles(container, count) {
  for (let i = 0; i < count; i++) {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    sparkle.textContent = '✨';
    sparkle.style.left = Math.random() * 100 + 'vw';
    sparkle.style.animationDelay = Math.random() * 8 + 's';
    sparkle.fontSize = (14 + Math.random() * 10) + 'px';
    container.appendChild(sparkle);
  }
}

function createFloatingFlowers(container, count) {
  const flowers = ['🌸', '🌺', '🌻', '🌷', '🌹'];
  for (let i = 0; i < count; i++) {
    const flower = document.createElement('div');
    flower.className = 'flower';
    flower.textContent = flowers[Math.floor(Math.random() * flowers.length)];
    flower.style.left = Math.random() * 100 + 'vw';
    flower.style.animationDelay = Math.random() * 10 + 's';
    flower.style.fontSize = (18 + Math.random() * 12) + 'px';
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
  } catch (e) { /* fail silently */ }
}

function playChime() {
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
    // cleanup
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
    "🌹 Every moment with you is magic",
    "💕 You make my heart skip a beat",
    "🌟 My shining star",
    "❤️ Forever and always",
    "🌸 Beautiful memories together",
    "✨ You light up my life",
    "🍀 So lucky to have you",
    "💍 Counting days together",
    "🧸 My cutie pie",
    "🎈 Floating in love with you",
    "🌈 You bring color to my world",
    "🍭 Sweetest person I know",
    "☀️ My sunshine in the rain",
    "🌌 Lost in your eyes",
    "🎀 Perfect in every way",
    "💌 A love story like no other",
    "🔥 You set my soul on fire",
    "💎 You're a rare gem",
    "💘 Struck by Cupid's arrow",
    "🦋 Butterflies every time I see you",
    "🥂 To us and our future",
    "💖 I love you more than words!"
  ];

  container.innerHTML = ''; // Clear existing

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
  
  const interval = setInterval(() => {
    slides[current].classList.remove('active');
    current = (current + 1) % slides.length;
    slides[current].classList.add('active');
  }, 3000);
}
