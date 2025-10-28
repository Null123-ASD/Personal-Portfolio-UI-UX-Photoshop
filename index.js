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
  "Character Posters - KUUGA(Growing Form)",
  "Chinese Character Creative Design",
  "Character Posters - KUUGA(Ultimate Form)",
  "Travel - Poster",
  "Pepsi - Promotional Poster 1",
  "Fashion & Art  - Photography Poster",
  "Restaurant Promotion - Poster",
  "Skateboarding Competition - Poster",
  "Character Posters - KUUGA(Mighty Form)",
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
  "Summer Soul 2023 (Growing Form 2)",
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
