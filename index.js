// 每张图的标题/说明（索引 0 占位，从 1 开始用）
const titles = [
  "", // 占位，不用
  "Fashion & Art - Original Character",
  "BOOOOM!!! - Illustration Design",
  "Why am I so sad, don't cry baby - Illustration Design.",
  "Fashion & Art - 2025 Fashion Exhibition",
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
  "Summer Soul 2023 (Growing Form 2)"
];


function showSection(sectionId) {
    const sections = document.getElementsByClassName('section');
    for (let section of sections) {
        section.classList.remove('active');
    }

    const targetSection = document.getElementById(sectionId);
    targetSection.classList.add('active');

    // 等待显示后再布局
    if (sectionId === 'portfolio') {
        requestAnimationFrame(() => {
            setTimeout(() => {
                setPositions();
            }, 0);
        });
    }
}


const container = document.querySelector('.portfolio-section');
let img_width = 380;
let loadedCount = 0;
let totalImgs = 37;


function createImgs() {
  for (let i = 1; i <= totalImgs; i++) {
    // 外层容器
    const item = document.createElement('div');
    item.className = 'portfolio-item';
    item.style.width = img_width + 'px';

    // 图片
    const img = document.createElement('img');
    img.src = `image_ps/${i}.jpg`;
    img.width = img_width;

    // 覆盖层（按 titles 数组取对应文字）
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.innerHTML = `<div>${titles[i] || "Project " + i}</div>`;

    item.appendChild(img);
    item.appendChild(overlay);
    container.appendChild(item);

    img.onload = () => {
      loadedCount++;
      // 如果当前已经在 portfolio 页，加载完就排一次
      if (loadedCount === totalImgs &&
          document.getElementById('portfolio').classList.contains('active')) {
        setPositions();
      }
    };
  }
}

createImgs();


function cal(){
    let container_width=container.clientWidth;
    let columns=Math.floor(container_width/img_width);
    let space_number=columns+1; 
    let left_space=container_width-columns*img_width; 
    let space=left_space/space_number; 
    return {
        space: space,
        columns: columns
    };
}


function setPositions() {
  const info = cal();
  if (!info.columns || info.columns <= 0) {
    // 在区块隐藏时先不排，等显示后再排
    return;
  }

  const next_tops = new Array(info.columns).fill(0);

  for (let i = 0; i < container.children.length; i++) {
    const item = container.children[i];           // .portfolio-item
    const img  = item.querySelector('img');

    const minTop = Math.min(...next_tops);
    const colIdx = next_tops.indexOf(minTop);

    // 设容器位置
    item.style.top  = minTop + 'px';
    item.style.left = ((colIdx + 1) * info.space + colIdx * img_width) + 'px';

    // 叠加该列高度（使用图片高度）
    const h = img?.height || item.offsetHeight || 0;
    next_tops[colIdx] += h + info.space;
  }

  const max = Math.max(...next_tops);
  container.style.height = max + 'px';
}




let timer=null;
window.onresize=function(){
    if(timer){
        clearTimeout(timer);
    }
    timer=setTimeout(setPositions,100);
}

function buildBand(band) {
  const inner = band.querySelector('.band-inner');
  if (!inner) return;

  // 先保存原始 HTML（只存一次）
  if (!inner.dataset.base) {
    inner.dataset.base = inner.innerHTML;
  }
  inner.innerHTML = inner.dataset.base;

  // 测量单组宽度
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
  let limit = 20; // 最多重复 20 次，防止死循环
  while (acc < band.clientWidth + step && limit > 0) {
    inner.insertAdjacentHTML('beforeend', inner.dataset.base);
    acc = inner.scrollWidth;
    limit--;
  }

  // 设置动画
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



// 复制按钮
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.copy-btn');
  if (!btn) return;
  const text = btn.dataset.copy || '';
  if (!text) return;
  navigator.clipboard.writeText(text).then(()=>{
    const tip = document.querySelector('.copy-tip');
    if (tip){ tip.classList.add('show'); setTimeout(()=> tip.classList.remove('show'), 1200); }
  });
});

// 表单占位提交（阻止默认并用 mailto 兜底）
const form = document.getElementById('contactForm');
if (form){
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const data = new FormData(form);
    const subject = encodeURIComponent(data.get('subject') || 'Contact from portfolio');
    const body = encodeURIComponent(
      `Name: ${data.get('name')}\nEmail: ${data.get('email')}\n\n${data.get('message')}`
    );
    window.location.href = `mailto:louzip123@yahoo.com?subject=${subject}&body=${body}`;
  });
}
