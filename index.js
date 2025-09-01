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
let totalImgs = 36;

function createImgs() {
    for (let i = 1; i <= totalImgs; i++) {
        let src = 'image_ps/' + i + '.jpg';
        let img = document.createElement('img');
        img.src = src;
        img.width = img_width;
        img.onload = () => {
            loadedCount++;
            if (loadedCount === totalImgs) {
                // 等待一帧，确保 DOM 渲染完成再执行布局
                requestAnimationFrame(() => {
                    setTimeout(() => {
                        setPositions();
                    }, 0);
                });
            }
        };
        container.appendChild(img);
    }
}

createImgs();
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


function setPositions(){
    
    let info=cal();
 
    let next_tops=new Array(info.columns);
    
    next_tops.fill(0);
    for(let i=0;i<container.children.length;i++){
        let img=container.children[i];
     
        let min_top=Math.min.apply(null,next_tops);
        img.style.top=min_top+'px';
     
        let index=next_tops.indexOf(min_top); 
        next_tops[index]+=img.height+info.space;
     
        let left=(index+1)*info.space+index*img_width;
        img.style.left=left+'px';
    }
 
    let max=Math.max.apply(null,next_tops);
    container.style.height=max+'px';
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
    console.warn("⚠️ step 宽度测量失败");
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
