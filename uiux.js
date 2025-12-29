const projectData = {
    random: {
        label: "Random Gifts App",
        media: [
            { type: 'img', src: 'image_ps/UIUX/2(1).jpg' },
            { type: 'img', src: 'image_ps/UIUX/38.jpg' },
            { type: 'video', src: 'image_ps/UIUX/e1.mp4' }
        ],
        title: "PROJECT OVERVIEW",
        desc: "This is a randomized gift selection app powered by user preference. It helps users overcome decision fatigue during special occasions by offering a smooth, card-based interaction experience.",
        features: ["Intelligent recommendation engine powered by smart algorithms", 
            "Immersive 3D card-switching animations", 
            "Native UI optimization for both Android and iOS platforms", 
            "Customizable gift list management", 
            "Built-in AI chat functionality"]
    },
    tts: {
        label: "Android TTS OCR Converter",
        media: [
            { type: 'img', src: 'image_ps/UIUX/1(1).jpg' }, // 請確保路徑正確
            { type: 'img', src: 'image_ps/UIUX/39.jpg' },
            { type: 'video', src: 'image_ps/UIUX/f1.mp4' }
        ],
        title: "OCR & ACCESSIBILITY",
        desc: "This is a text recognition and speech conversion tool designed specifically for visually impaired users. By integrating Google ML Kit OCR technology, it delivers high-accuracy real-time text scanning and natural voice narration.",
        features: ["Real-time text recognition (OCR)", 
            "TTS voice output in both local and English languages", 
            "Optimized volume key operations (accessibility-focused design)", 
            "Offline recognition mode support", 
            "Built-in AI chat functionality"]
    },
    portfolio: {
        label: "Personal Portfolio Website",
        media: [
            { type: 'img', src: 'image_ps/UIUX/51.jpg' },
            { type: 'img', src: 'image_ps/UIUX/40.jpg' },
            { type: 'video', src: 'image_ps/UIUX/p1.mp4' }
        ],
        title: "DIGITAL EXPERIENCE",
        desc: "This is a personal portfolio website combining UI and graphic design, emphasizing minimalism and a striking black-and-red visual impact. It focuses on showcasing the designer’s cross-disciplinary capabilities, achieving a seamless transition from graphic design to UI/UX.",
        features: ["Responsive masonry grid layout (Masonry)", 
            "Smooth page transition animations", 
            "Dark mode visual optimization", 
            "High-quality portfolio display framework"]
    }
};

let currentProject = 'random';
let currentIndex = 0;

function updateContent(projectId) {
    const data = projectData[projectId];
    currentProject = projectId;
    currentIndex = 0;

    // 更新標籤和文字
    document.getElementById('appLabel').textContent = data.label;
    
    let featureList = data.features.map(f => `<li>${f}</li>`).join('');
    document.getElementById('textContent').innerHTML = `
        <div class="text-group">
            <h3>${data.title}</h3>
            <p>${data.desc}</p>
        </div>
        <div class="text-group">
            <h3>KEY FEATURES</h3>
            <ul>${featureList}</ul>
        </div>
    `;

    // 更新媒體軌道
    const track = document.getElementById('mediaTrack');
    track.innerHTML = data.media.map(item => {
        if(item.type === 'img') return `<div class="media-item"><img src="${item.src}"></div>`;
        return `<div class="media-item"><video src="${item.src}" autoplay loop muted playsinline></video></div>`;
    }).join('');

    track.style.transform = `translateX(0)`;
}

// 綁定側邊欄點擊
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', function() {
        document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
        this.classList.add('active');
        updateContent(this.dataset.target);
    });
});

// 輪播控制
document.getElementById('nextBtn').addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % 3;
    document.getElementById('mediaTrack').style.transform = `translateX(-${currentIndex * 33.333}%)`;
});

document.getElementById('prevBtn').addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + 3) % 3;
    document.getElementById('mediaTrack').style.transform = `translateX(-${currentIndex * 33.333}%)`;
});

// 初始加載
updateContent('random');