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

  if (sectionId !== 'portfolio') {
    window.location.href = `home.html#${sectionId}`;
    return;
  }

}



/* =========================
   UI / UX Carousel
========================= */

const cards = document.querySelectorAll(".uiux-card");
const prevBtn = document.querySelector(".nav-arrow.prev");
const nextBtn = document.querySelector(".nav-arrow.next");

let currentIndex = 1; // 預設中間那張是 active

function updateCards() {
  cards.forEach((card, index) => {
    card.classList.remove("active");

    if (index === currentIndex) {
      card.classList.add("active");
    }
  });
}

// 初始狀態
updateCards();

// 上一張
prevBtn.addEventListener("click", () => {
  currentIndex--;

  if (currentIndex < 0) {
    currentIndex = cards.length - 1;
  }

  updateCards();
});

// 下一張
nextBtn.addEventListener("click", () => {
  currentIndex++;

  if (currentIndex >= cards.length) {
    currentIndex = 0;
  }

  updateCards();
});

// 預載所有 UI/UX 圖片到緩存中
const preloadImages = () => {
  const imageUrls = [
    "image_ps/UIUX/2(1).jpg",
    "image_ps/UIUX/1(1).jpg",
    "image_ps/UIUX/40.jpg",
  ];
  imageUrls.forEach(url => {
    const img = new Image();
    img.src = url;
  });
};
window.addEventListener('load', preloadImages);

function preloadCSSImages() {
    const graphicImages = [
        "image_ps/DB/14.jpg",
        "image_ps/DB/10.jpg",
        "image_ps/DB/37.jpg",
        "image_ps/DB/18.jpg"
    ];

    graphicImages.forEach(url => {
        const img = new Image();
        img.src = url; // 這會觸發瀏覽器下載並緩存圖片
    });
}

// 頁面主體加載完後立即執行預載
window.addEventListener('DOMContentLoaded', preloadCSSImages);

/* =========================
   Section Indicator State
========================= */

const uiuxSection = document.querySelector(".uiux-section");
const graphicSection = document.querySelector(".graphic-section");

const uiuxIndicator = uiuxSection.querySelector(".section-title");
const graphicIndicator = graphicSection.querySelector(".section-title");

function updateSectionIndicator() {
  const scrollY = window.scrollY;
  const viewportHeight = window.innerHeight;

  const uiuxTop = uiuxSection.offsetTop;
  const graphicTop = graphicSection.offsetTop;

  // 判斷畫面目前落在哪一區
  if (scrollY + viewportHeight / 2 < graphicTop) {
    uiuxIndicator.style.color = "#ff2d2d";
    graphicIndicator.style.color = "#888";
  } else {
    uiuxIndicator.style.color = "#888";
    graphicIndicator.style.color = "#ff2d2d";
  }
}

// 初始執行
updateSectionIndicator();

// 滾動時更新
window.addEventListener("scroll", updateSectionIndicator);

