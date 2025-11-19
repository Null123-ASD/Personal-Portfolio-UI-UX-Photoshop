// ================== Titles ==================
// 每张图的标题/说明（索引 0 占位，从 1 开始用）
const titles = [
  "", // 占位
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


// ================== Section Control ==================
function showSection(sectionId) {
  const sections = document.getElementsByClassName('section');
  for (let section of sections) {
    section.classList.remove('active');
  }
  const targetSection = document.getElementById(sectionId);
  targetSection.classList.add('active');

  const navLinks = document.querySelectorAll('nav a');
  navLinks.forEach(link => {
    link.classList.remove('active');
    
    const onclickAttr = link.getAttribute('onclick');
    
    if (onclickAttr && onclickAttr.includes(`'${sectionId}'`)) {
        link.classList.add('active');
    }
  });

  if (sectionId === 'portfolio') {
    requestAnimationFrame(() => {
      // 確保切換頁面時，寬度能重新計算
      if (typeof updateItemWidths === 'function') {
        updateItemWidths(); 
      }
      setPositions(); 
    });
  }
}



// ================== Portfolio Masonry ==================
const container = document.querySelector('.portfolio-section');
// const img_width = 380; 
let loadedCount = 0;
const totalImgs = 40;


function getPortfolioItemWidth() {
  const containerWidth = container.clientWidth; // .portfolio-section 的實際內容寬度
  const screenWidth = window.innerWidth;
  const gap = 20;

  if (screenWidth >= 1800) {
    const columns = 5;
    return Math.floor((containerWidth - gap * (columns - 1)) / columns);
  } else if (screenWidth >= 992) {
    const columns = 4;
    return Math.floor((containerWidth - gap * (columns - 1)) / columns);
  } else if (screenWidth >= 576) {
    const columns = 2;
    return Math.floor((containerWidth - gap * (columns - 1)) / columns);
  } else {
    // 小手機 (1 欄): 設置為容器寬度的 90% (例如：0.9)
    const scaleFactor = 0.9; 
    return Math.floor(containerWidth * scaleFactor); 
  }
}


function createImgs() {
  const initial_item_width = getPortfolioItemWidth(); 

  for (let i = 1; i <= totalImgs; i++) {
    const item = document.createElement('div');
    item.className = 'portfolio-item';
    item.style.width = initial_item_width + 'px'; 

    if ([11, 12, 23, 26, 38, 39, 40].includes(i)) {
      item.dataset.category = "uiux";
    } else if ([1,2,3,4,5,6,9,13,14,15,16,19,20,21,22,25,35,36].includes(i)) {
      item.dataset.category = "graphic";
    } else {
      item.dataset.category = "branding";
    }

    const img = document.createElement('img');
    img.src = `image_ps/${i}.jpg`;
    img.width = initial_item_width; 

    // overlay
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.innerHTML = `<div>${titles[i] || "Project " + i}</div>`;

    item.appendChild(img);
    item.appendChild(overlay);
    container.appendChild(item);

    const current_item_width = initial_item_width; 

    img.onload = () => {
      // 缓存计算后的高度，避免 setPositions 时触发回流
      if (!img.dataset.h) {
        img.dataset.h = img.naturalHeight * (current_item_width / img.naturalWidth); 
      }
      loadedCount++;
      if (loadedCount === totalImgs &&
          document.getElementById('portfolio').classList.contains('active')) {
        setPositions();
      }
    };
  }
}
createImgs();


const filterButtons = document.querySelectorAll(".portfolio-filter button");
filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelector(".portfolio-filter button.active").classList.remove("active");
    btn.classList.add("active");
    const filter = btn.dataset.filter;
    document.querySelectorAll(".portfolio-item").forEach(item => {
      if (filter === "all" || item.dataset.category === filter) {
        item.style.display = "block";
      } else {
        item.style.display = "none";
      }
    });
    setPositions(); // 重新排版
  });
});


function cal() {
  const container_width = container.clientWidth;
  
  const item_width = getPortfolioItemWidth(); 
  
  if (item_width <= 0) {
      return { space: 0, columns: 0, item_width: 0 };
  }
  
  // 根據動態寬度計算欄位數
  const columns = Math.max(1, Math.floor(container_width / item_width));
  
  const space_number = columns + 1;
  const left_space = container_width - columns * item_width;
  const space = left_space / space_number;
  
  return { space, columns, item_width }; 
}

function setPositions() {
  const info = cal();
  if (!info.columns || info.columns <= 0) return;

  const { space, columns, item_width } = info; 

  const next_tops = new Array(columns).fill(0);

  for (let i = 0; i < container.children.length; i++) {
    const item = container.children[i];
    const img = item.querySelector('img');

    
    item.style.width = item_width + 'px'; 

    if (item.style.display === "none") {
      item.style.top = "-9999px"; // 避免佔位
      continue;
    }
   
    const h = parseFloat(img.dataset.h) || item.offsetHeight || 0; 

    const minTop = Math.min(...next_tops);
    const colIdx = next_tops.indexOf(minTop);

    item.style.top = minTop + 'px';
    item.style.left = ((colIdx + 1) * space + colIdx * item_width) + 'px';

    next_tops[colIdx] += h + space;
  }

  container.style.height = Math.max(...next_tops) + 'px';
}


function updateItemWidths() {
    const info = cal();
    const newWidth = info.item_width;
    
    if (newWidth <= 0) return;

    const firstItem = document.querySelector('.portfolio-item');
    if (firstItem && firstItem.offsetWidth === newWidth) {
        return; 
    }

    document.querySelectorAll('.portfolio-item').forEach(item => {
        item.style.width = newWidth + 'px';
        const img = item.querySelector('img');
        if (img && img.naturalWidth) {
            // 重新計算並緩存新的高度
            img.dataset.h = img.naturalHeight * (newWidth / img.naturalWidth);
        }
    });
}


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


// ================== Lightbox (僅特定作品有流程圖) ==================
const lightbox = document.getElementById('lightbox');
const lightboxImg = lightbox.querySelector('.lightbox-img');
const lightboxTitle = lightbox.querySelector('.lightbox-title');
const lightboxDesc = lightbox.querySelector('.lightbox-desc');
const lightboxClose = lightbox.querySelector('.lightbox-close');
const btnPrev = lightbox.querySelector('.lightbox-prev');
const btnNext = lightbox.querySelector('.lightbox-next');

let currentIndex = -1;
let showingProcess = false;

// 🔹 這些作品才有流程圖
const processItems = [11, 12, 23, 26, 38, 39, 40];

// 🔹 流程圖對應的檔名（a1 ~ g1）
const processMap = {
  11: "a1.jpg",
  12: "b1.jpg",
  23: "c1.jpg",
  26: "d1.jpg",
  38: "e1.jpg",
  39: "f1.jpg",
  40: "g1.jpg",
};

// 🔹 每個流程圖的描述（你可自行修改成真實內容）
const processDescriptions = {
  a1: "Random Gifts App – UX wireflow showing reward logic and navigation design.",
  b1: "Portfolio Website - Designed using Photoshop, employing three light sources as backgrounds to create blur and color shifts.",
  c1: "Android TTS OCR Converter – user operation sequence and component linkage.",
  d1: "Game Website - Designed using Photoshop, utilizing various geometric shapes for layout flow and page highlighting of game characters.",
  e1: "UI redesign iteration – from wireframe to final visual mockups.",
  f1: "Android OCR App – workflow of text recognition and TTS processing.",
  g1: "Personal Portfolio – design lifecycle and responsive grid evolution."
};

// 🔹 主圖描述（摘要版，可留用原 titles[]）
const descriptions = [
  "", // 占位
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

// ================== 核心功能 ==================

// 開啟 Lightbox
function openLightbox(index) {
  currentIndex = index;
  showingProcess = false;

  const item = container.children[index];
  const overlayText = item.querySelector('.overlay div').textContent;
  const img = item.querySelector('img');

  lightboxImg.src = img.src;
  lightboxTitle.textContent = overlayText || "Untitled Project";
  lightboxDesc.textContent = descriptions[index + 1] || "Design showcase.";

  // 若此作品有流程圖，顯示按鈕
  const hasProcess = processItems.includes(index + 1);
  btnPrev.style.display = hasProcess ? "block" : "none";
  btnNext.style.display = hasProcess ? "block" : "none";

  lightbox.classList.add('show');
}

// 切換主圖 / 流程圖
function toggleImage(next = true) {
  if (currentIndex < 0) return;

  const projectNum = currentIndex + 1;

  // 若該作品沒有流程圖 → 不動作
  if (!processItems.includes(projectNum)) return;

  if (next && !showingProcess) {
    // 顯示流程圖
    const filename = processMap[projectNum];
    lightboxImg.src = `image_ps/${filename}`;
    const key = filename.replace(".jpg", "");
    lightboxDesc.textContent = processDescriptions[key] || "Design process flow.";
    showingProcess = true;
  } else {
    // 返回主圖
    const mainImg = container.children[currentIndex].querySelector('img');
    lightboxImg.src = mainImg.src;
    lightboxDesc.textContent = descriptions[projectNum] || "Design showcase.";
    showingProcess = false;
  }
}

// 關閉 Lightbox
function closeLightbox() {
  lightbox.classList.remove("show");
  currentIndex = -1;
  showingProcess = false;
}

// ================== 綁定事件 ==================
document.querySelectorAll(".portfolio-item").forEach((item, i) => {
  item.addEventListener("click", () => openLightbox(i));
});

btnNext.addEventListener("click", () => toggleImage(true));
btnPrev.addEventListener("click", () => toggleImage(false));
lightboxClose.addEventListener("click", closeLightbox);

lightbox.addEventListener("click", e => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", e => {
  if (!lightbox.classList.contains("show")) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowRight" || e.key === "ArrowLeft") toggleImage(true);
});




