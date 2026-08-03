// ---------- Mobile menu toggle ----------
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('active'));
});

// ---------- Scroll reveal ----------
const revealTargets = document.querySelectorAll(
  '.about-grid, .skills-grid, .achievements-grid, .contact-grid, .timeline-item, .case, .skill-card, .achievement-card, .project-card'
);
revealTargets.forEach(el => el.classList.add('reveal-init'));

const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealTargets.forEach(el => io.observe(el));

// ---------- 3D tilt on hover for cards ----------
function attachTilt(el, options = {}) {
  const maxTilt = options.maxTilt || 8;
  el.addEventListener('mousemove', (e) => {
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const rotateY = (px - 0.5) * maxTilt * 2;
    const rotateX = (0.5 - py) * maxTilt * 2;
    el.style.transform = `perspective(700px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
  });
  el.addEventListener('mouseleave', () => {
    el.style.transform = 'perspective(700px) rotateX(0deg) rotateY(0deg) translateY(0)';
  });
}

document.querySelectorAll('.skill-card, .achievement-card, .case-head, .project-card-cta')
  .forEach(el => attachTilt(el, { maxTilt: 6 }));

// ---------- Hero parallax on scroll ----------
const heroText = document.querySelector('.hero-text');
const phoneCol = document.querySelector('.phone-col');
if (heroText && phoneCol) {
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y < window.innerHeight) {
      heroText.style.transform = `translateY(${y * 0.08}px)`;
      phoneCol.style.transform = `translateY(${y * 0.18}px)`;
    }
  });
}
function toggleCase(headEl) {
  const caseEl = headEl.parentElement;
  const wasOpen = caseEl.classList.contains('open');
  document.querySelectorAll('.case.open').forEach(c => c.classList.remove('open'));
  if (!wasOpen) caseEl.classList.add('open');
}
window.toggleCase = toggleCase;

// ---------- 3D phone: drag to rotate + idle float ----------
const stage = document.getElementById('phoneStage');
const phone = document.getElementById('phone');

if (stage && phone) {
  let rotX = -6, rotY = 20;
  let dragging = false, lastX = 0, lastY = 0;
  let idleAngle = 0;

  function applyRotation() {
    phone.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
  }

  function idleFloat() {
    if (!dragging) {
      idleAngle += 0.15;
      rotY = 20 + Math.sin((idleAngle * Math.PI) / 180) * 6;
      applyRotation();
    }
    requestAnimationFrame(idleFloat);
  }
  idleFloat();

  stage.addEventListener('pointerdown', (e) => {
    dragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
    stage.classList.add('grabbing');
  });

  window.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    rotY += dx * 0.4;
    rotX -= dy * 0.4;
    rotX = Math.max(-35, Math.min(35, rotX));
    lastX = e.clientX;
    lastY = e.clientY;
    applyRotation();
  });

  window.addEventListener('pointerup', () => {
    dragging = false;
    stage.classList.remove('grabbing');
  });

  // Tab dots switch the screen shown inside the phone
  const tabs = document.querySelectorAll('.phone-tab');
  const screens = document.querySelectorAll('.screen');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const idx = tab.dataset.idx;
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      screens.forEach(s => s.classList.toggle('active', s.dataset.screen === idx));
    });
  });
}

// ---------- Contact form (Formspree AJAX) ----------
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(contactForm);
    try {
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      });
      if (response.ok) {
        contactForm.reset();
        alert('Thanks! Your message has been sent.');
      } else {
        alert('Something went wrong. Please try again or email me directly.');
      }
    } catch (error) {
      alert('Something went wrong. Please try again or email me directly.');
    }
  });
}

// ---------- Back to top ----------
const backToTop = document.getElementById('backToTop');
if (backToTop) {
  backToTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}



// ---------- Live GitHub repos ----------
async function loadGithubRepos() {
  const grid = document.getElementById('repoGrid');
  if (!grid) return;
  try {
    const res = await fetch('https://api.github.com/users/Dipu-111/repos?sort=updated&per_page=6');
    if (!res.ok) throw new Error('GitHub API error');
    const repos = await res.json();
    const filtered = repos.filter(r => !r.fork).slice(0, 3);
    grid.innerHTML = filtered.map(r => `
      <div class="repo-card">
        <div class="repo-top">
          <span class="repo-name">${r.name}</span>
          <span class="repo-stars">★ ${r.stargazers_count}</span>
        </div>
        <p class="repo-desc">${r.description ? r.description : 'No description provided.'}</p>
        <div class="repo-meta">
          ${r.language ? `<span class="tag">${r.language}</span>` : ''}
          <a href="${r.html_url}" target="_blank" rel="noopener noreferrer">View →</a>
        </div>
      </div>
    `).join('');
  } catch (err) {
    grid.innerHTML = '<p class="case-text">Could not load repos right now — visit GitHub directly.</p>';
  }
}
loadGithubRepos();
