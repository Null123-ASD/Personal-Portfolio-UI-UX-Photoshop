// ================== Titles ==================
const titles = [
  "", 
  "Fashion & Art - Original Character",
  "BOOOOM!!! - Illustration Design",
  "Why am I so sad, don't cry baby - Illustration Design.",
  "Fashion & Art - Fashionable Aunt",
  "Business Card Design 1",
  "Business Card Design 2",
  "Summer Soul 2023 - KUUGA(Growing Form 1)",
  "Summer Soul 2023 - KUUGA(Mighty Form 1)",
  "Modern & Business - Restaurant Menu",
  "Summer Soul 2023 - KUUGA(Ultimate Form)",
  "UI Mobile App - Random Gifts App",
  "Modern & Business - Portfolio Website",
  "Perfect - Illustration Design",
  "Art Posters - Little Elf",
  "Chinese Character Creative Design",
  "Character Posters - KUUGA(Ultimate Form)",
  "Travel - Poster",
  "Pepsi - Promotional Poster 1",
  "Fashion & Art  - Photography Poster",
  "Restaurant Promotion - Poster",
  "Skateboarding Competition - Poster",
  "Art Posters - Walking with Insects",
  "UI Mobile App - Android TTS OCR Converter",
  "Summer Soul 2023 (Mighty Form 2)",
  "Flower Viewing Festival",
  "Modern & Business - Game Website",
  "Pepsi - Ad Design",
  "Pepsi Promotional Poster 2",
  "Chage - Packaging Design 1",
  "Chage - Shopping Bag Display 1",
  "Chage - Shopping Bag Display 2",
  "Chage - Packaging Design 2",
  "Chage - Shopping Bag Display 3",
  "LOGO - Design ",
  "Lost in Thought - Illustration Design",
  "Fashion & Art - Fashion",
  "Lamborghini - Visual Poster",
  "Random Gifts App - UI Design",
  "Android TTS OCR Converter - UI Design",
  "Personal Portfolio - UI Design"
];

const descriptions = [...titles];

// ================== Section Control ==================
function showSection(sectionId) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById(sectionId).classList.add('active');

  document.querySelectorAll("nav a").forEach(link => {
    link.classList.remove("active");
    if (link.getAttribute("onclick").includes(`'${sectionId}'`)) {
      link.classList.add("active");
    }
  });

  if (sectionId === "portfolio") onShowPortfolio();
}

// ================== Masonry Config ==================
const totalImgs = 40;
const container = document.querySelector(".portfolio-section");
let resizeTimer = null;
let rafScheduled = false;

function scheduleLayout() {
  if (rafScheduled) return;
  rafScheduled = true;
  requestAnimationFrame(() => {
    layout();
    rafScheduled = false;
  });
}

function getItemWidth() {
  const w = container.clientWidth;
  const gap = 20;
  const screen = window.innerWidth;

  if (screen >= 1800) return Math.floor((w - gap * 4) / 5);
  if (screen >= 992) return Math.floor((w - gap * 3) / 4);
  if (screen >= 576) return Math.floor((w - gap * 1) / 2);
  return Math.floor(w * 0.9);
}

function calcGrid() {
  const w = container.clientWidth;
  const itemWidth = getItemWidth();
  const cols = Math.max(1, Math.floor(w / itemWidth));
  const left = w - cols * itemWidth;
  const space = left / (cols + 1);
  return { space, cols, itemWidth };
}

// ================== Create Images ==================
function createImgs() {
  container.innerHTML = "";

  const placeholder = "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==";

  for (let i = 1; i <= totalImgs; i++) {
    const item = document.createElement("div");
    item.className = "portfolio-item";
    item.dataset.index = i - 1;
    item.style.position = "absolute";

    // Category rules
    if ([11,12,23,26,38,39,40].includes(i)) item.dataset.category = "uiux";
    else if ([1,2,3,4,5,6,9,13,14,15,16,19,20,21,22,25,35,36].includes(i)) item.dataset.category = "graphic";
    else item.dataset.category = "branding";

    const img = document.createElement("img");
    img.src = placeholder;
    img.dataset.src = `image_ps/${i}.jpg`;
    img.dataset.r = 0; // aspect ratio will be stored later

    const overlay = document.createElement("div");
    overlay.className = "overlay";
    overlay.innerHTML = `<div>${titles[i]}</div>`;

    item.appendChild(img);
    item.appendChild(overlay);
    container.appendChild(item);
  }
}

// ================== Mixed Load (Preload + Lazy) ==================
let observer = null;

function initLazyObserver() {
  if (observer) observer.disconnect();

  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const img = entry.target;
      if (img.dataset.loaded) return;

      loadImg(img);
      observer.unobserve(img);
    });
  }, {
    rootMargin: "300px",
    threshold: 0.01
  });

  document.querySelectorAll(".portfolio-item img").forEach(img => observer.observe(img));
}

function loadImg(img) {
  const src = img.dataset.src;
  if (!src) return;

  const tmp = new Image();
  tmp.src = src;

  tmp.onload = () => {
    img.src = src;
    img.dataset.loaded = "1";
    const r = tmp.naturalHeight / tmp.naturalWidth;
    img.dataset.r = r;
    scheduleLayout();
  };
}

// 預載前 3 行圖片
function preloadFirstRows() {
  const { cols } = calcGrid();
  const preloadCount = cols * 3;

  const imgs = [...container.querySelectorAll("img")];
  for (let i = 0; i < preloadCount && i < imgs.length; i++) {
    loadImg(imgs[i]);
  }
}

// ================== Masonry Layout ==================
function layout() {
  const { space, cols, itemWidth } = calcGrid();
  const colHeights = new Array(cols).fill(0);

  const items = [...container.children].filter(i => i.style.display !== "none");

  items.forEach(item => {
    item.style.width = itemWidth + "px";
  });

  items.forEach(item => {
    const img = item.querySelector("img");

    const h = (img.dataset.r > 0)
      ? itemWidth * img.dataset.r
      : itemWidth * 0.75;

    const minTop = Math.min(...colHeights);
    const col = colHeights.indexOf(minTop);

    item.style.top = minTop + "px";
    item.style.left = ((col + 1) * space + col * itemWidth) + "px";

    colHeights[col] += h + space;
  });

  container.style.height = Math.max(...colHeights) + "px";
}

// ================== Filters ==================
document.querySelectorAll(".portfolio-filter button").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelector(".portfolio-filter .active").classList.remove("active");
    btn.classList.add("active");

    const filter = btn.dataset.filter;

    container.querySelectorAll(".portfolio-item").forEach(item => {
      item.style.display = (filter === "all" || item.dataset.category === filter)
        ? "block" : "none";
    });

    scheduleLayout();
  });
});

// ================== Resize ==================
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    scheduleLayout();
  }, 50); 
});

// ================== Show Portfolio ==================
function onShowPortfolio() {
  if (!container.children.length) {
    createImgs();
    preloadFirstRows(); // 預載前 2~3 行圖片
    initLazyObserver(); // 其餘 lazy-load
  }

  scheduleLayout();
}

window.onShowPortfolio = onShowPortfolio;

// ================== Lightbox ==================
const lightbox = document.getElementById("lightbox");
const lightboxImg = lightbox.querySelector(".lightbox-img");
const lightboxVideo = lightbox.querySelector(".lightbox-video");
const lightboxTitle = lightbox.querySelector(".lightbox-title");
const lightboxDesc = lightbox.querySelector(".lightbox-desc");
const closeBtn = lightbox.querySelector(".lightbox-close");
const btnPrev = lightbox.querySelector(".lightbox-prev");
const btnNext = lightbox.querySelector(".lightbox-next");

let currentIndex = -1;
let showingProcess = false;

const processItems = [11,12,23,26,38,39,40];
const processTypes = {11:"image",12:"video",23:"image",26:"video",38:"image",39:"image",40:"image"};
const processMap = {
  11:"a1.jpg", 12:"b1.mp4", 23:"c1.jpg",
  26:"d1.mp4", 38:"e1.jpg", 39:"f1.jpg", 40:"g1.jpg"
};
const processDescriptions = {
  a1:"Random Gifts App – UX flow",
  b1:"Portfolio responsive layout demo",
  c1:"OCR Converter workflow",
  d1:"Game website prototype",
  e1:"UI redesign progress",
  f1:"OCR App flow",
  g1:"Portfolio grid evolution"
};

function hideMedia() {
  lightboxImg.style.display = "none";
  lightboxVideo.style.display = "none";
  lightboxVideo.pause();
  lightboxVideo.removeAttribute("src");
}

function openLightbox(idx) {
  currentIndex = idx;
  showingProcess = false;

  const item = container.children[idx];
  const img = item.querySelector("img");

  hideMedia();
  lightboxImg.src = img.src || img.dataset.src;
  lightboxImg.style.display = "block";

  lightboxTitle.textContent = titles[idx + 1];
  lightboxDesc.textContent = descriptions[idx + 1];

  const has = processItems.includes(idx + 1);
  btnPrev.style.display = has ? "block" : "none";
  btnNext.style.display = has ? "block" : "none";

  lightbox.classList.add("show");
}

function toggleImage() {
  const p = currentIndex + 1;
  if (!processItems.includes(p)) return;

  const file = processMap[p];
  const key = file.replace(/\..+$/, "");

  hideMedia();

  if (!showingProcess) {
    const type = processTypes[p];
    lightboxDesc.textContent = processDescriptions[key];

    if (type === "video") {
      lightboxVideo.src = `image_ps/${file}`;
      lightboxVideo.style.display = "block";
      lightboxVideo.play();
    } else {
      lightboxImg.src = `image_ps/${file}`;
      lightboxImg.style.display = "block";
    }

    showingProcess = true;
  } else {
    const mainImg = container.children[currentIndex].querySelector("img");
    lightboxImg.src = mainImg.src;
    lightboxImg.style.display = "block";
    lightboxDesc.textContent = descriptions[p];
    showingProcess = false;
  }
}

container.addEventListener("click", (e) => {
  const item = e.target.closest(".portfolio-item");
  if (item) openLightbox(parseInt(item.dataset.index));
});

btnNext.addEventListener("click", () => toggleImage());
btnPrev.addEventListener("click", () => toggleImage());
closeBtn.addEventListener("click", () => lightbox.classList.remove("show"));

lightbox.addEventListener("click", e => {
  if (e.target === lightbox) lightbox.classList.remove("show");
});

document.addEventListener("keydown", e => {
  if (!lightbox.classList.contains("show")) return;
  if (e.key === "Escape") lightbox.classList.remove("show");
  if (e.key === "ArrowRight") toggleImage();
  if (e.key === "ArrowLeft") toggleImage();
});

// ================== Copy Button ==================
document.addEventListener("click", (e) => {
  const btn = e.target.closest(".copy-btn");
  if (!btn) return;

  navigator.clipboard.writeText(btn.dataset.copy);
  const tip = document.querySelector(".copy-tip");
  tip.classList.add("show");
  setTimeout(() => tip.classList.remove("show"), 1200);
});

// ================== Contact Form ==================
const form = document.getElementById("contactForm");
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const subject = encodeURIComponent(data.get('subject') || 'Contact from portfolio');
    const body = encodeURIComponent(
      `Name: ${data.get('name')}\nEmail: ${data.get('email')}\n\n${data.get('message')}`
    );
    window.location.href = `mailto:louzip123@yahoo.com?subject=${subject}&body=${body}`;
  });
}

// ================== About Section Bands ==================
function buildBand(band) {
  const inner = band.querySelector('.band-inner');
  if (!inner) return;

  if (!inner.dataset.base) inner.dataset.base = inner.innerHTML;
  inner.innerHTML = inner.dataset.base;

  const probe = document.createElement('div');
  probe.style.cssText = 'position:absolute;visibility:hidden;white-space:nowrap;';
  probe.innerHTML = inner.dataset.base;
  document.body.appendChild(probe);
  const step = probe.scrollWidth;
  document.body.removeChild(probe);

  let acc = inner.scrollWidth;
  let limit = 20;
  while (acc < band.clientWidth + step && limit-- > 0) {
    inner.insertAdjacentHTML('beforeend', inner.dataset.base);
    acc = inner.scrollWidth;
  }

  inner.style.setProperty('--step', step + 'px');
  inner.style.animationDuration = band.dataset.speed + 's';
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
