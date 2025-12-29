// ================== Section Control ==================
function showSection(sectionId) {
  const targetSection = document.getElementById(sectionId);
  
  if (!targetSection) return;

  const sections = document.getElementsByClassName('section');
  for (let section of sections) {
    section.classList.remove('active');
  }
  
  targetSection.classList.add('active');

  const navLinks = document.querySelectorAll('nav a');
  navLinks.forEach(link => {
    link.classList.remove('active');

    const href = link.getAttribute('href');
    const onclickAttr = link.getAttribute('onclick');
    if ((onclickAttr && onclickAttr.includes(`'${sectionId}'`)) || (href && href.includes(`#${sectionId}`))) {
        link.classList.add('active');
    }
  });
}

window.addEventListener('DOMContentLoaded', () => {
    const hash = window.location.hash.replace('#', '');
    
    if (hash) {
        showSection(hash);
    } else {
        showSection('home');
    }
});

// ================== Loader ==================
document.addEventListener("DOMContentLoaded", () => {
  const fromLoader = sessionStorage.getItem("fromLoader");
  const homeSection = document.getElementById("home");
  const heroTitle = document.querySelector(".hero-title");

  if (fromLoader && homeSection && heroTitle) {
    // 標記狀態
    homeSection.classList.add("hero-from-loader");

    // 下一幀開始動畫
    requestAnimationFrame(() => {
      heroTitle.classList.add("hero-enter");
    });

    // 清除狀態，避免重新整理再跑
    sessionStorage.removeItem("fromLoader");
  }
});



// ================== Resize Optimization ==================
let resizeRaf = null;
window.addEventListener('resize', () => {
  if (resizeRaf) cancelAnimationFrame(resizeRaf);
  resizeRaf = requestAnimationFrame(() => {
    updateItemWidths(); 
    setPositions();
    resizeRaf = null;
  });
});

// ================== Bands (About Section) ==================
function buildBand(band) {
  const inner = band.querySelector('.band-inner');
  if (!inner) return;

  if (!inner.dataset.base) {
    inner.dataset.base = inner.innerHTML;
  }
  inner.innerHTML = inner.dataset.base;

  const probe = document.createElement('div');
  probe.style.cssText = 'position:absolute;visibility:hidden;white-space:nowrap;display:inline-flex;gap:2rem;';
  probe.innerHTML = inner.dataset.base;
  document.body.appendChild(probe);
  const step = probe.scrollWidth;
  document.body.removeChild(probe);

  if (step <= 0) {
    console.warn("error: step Width measurement failed");
    return;
  }

  let acc = inner.scrollWidth;
  let limit = 20;
  while (acc < band.clientWidth + step && limit > 0) {
    inner.insertAdjacentHTML('beforeend', inner.dataset.base);
    acc = inner.scrollWidth;
    limit--;
  }

  const dur = band.dataset.speed || 30;
  inner.style.setProperty('--step', step + 'px');
  inner.style.animationDuration = dur + 's';
  inner.style.animationName = (band.dataset.dir === 'right') ? 'move-right' : 'move-left';
}

function buildAllBands() {
  document.querySelectorAll('.bands .band').forEach(buildBand);
}
window.addEventListener('load', buildAllBands);
window.addEventListener('resize', () => {
  clearTimeout(window.__bandTimer);
  window.__bandTimer = setTimeout(buildAllBands, 300);
});

// ================== Copy Button ==================
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.copy-btn');
  if (!btn) return;
  const text = btn.dataset.copy || '';
  if (!text) return;
  navigator.clipboard.writeText(text).then(() => {
    const tip = document.querySelector('.copy-tip');
    if (tip) {
      tip.classList.add('show');
      setTimeout(() => tip.classList.remove('show'), 1200);
    }
  });
});

// ================== Contact Form ==================
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const subject = encodeURIComponent(data.get('subject') || 'Contact from portfolio');
    const body = encodeURIComponent(
      `Name: ${data.get('name')}\nEmail: ${data.get('email')}\n\n${data.get('message')}`
    );
    window.location.href = `mailto:louzip123@yahoo.com?subject=${subject}&body=${body}`;
  });
}

