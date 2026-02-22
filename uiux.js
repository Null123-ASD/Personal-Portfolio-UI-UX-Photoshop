const projectData = {
    random: {
        label: "Random Gifts App",
        media: [
            { type: 'img', src: 'image_ps/UIUX/2(1).jpg' },
            { type: 'img', src: 'image_ps/UIUX/a1.jpg' },    
            { type: 'img', src: 'image_ps/UIUX/38.jpg' },
            { type: 'video', src: 'image_ps/UIUX/e1.mp4' }
        ],
        title: "PROJECT OVERVIEW",
        desc: "The Challenge: Users often face 'decision fatigue' when trying to find the perfect gift for special occasions.<br><br>The Solution: An AI-powered randomized selection app that simplifies decision-making through a clean, card-based interface.<br><br>The Result: Successfully integrated ChatGPT API to bridge the gap between user preferences and intelligent gift suggestions.",
        features: [
            "Intelligent recommendation engine powered by smart algorithms",
            "Immersive card-switching animations",
            "Native UI optimization for both Android and iOS platforms",
            "Customizable gift list management",
            "Built-in AI chat functionality" 
        ],
        demoDesc: "Explore the AI-powered gift selection flow in this demo! See how the card-switching animation works and how ChatGPT integration delivers personalized gift suggestions in real-time."
    },
    tts: {
        label: "Android TTS OCR Converter",
        media: [
            { type: 'img', src: 'image_ps/UIUX/1(1).jpg' },
            { type: 'img', src: 'image_ps/UIUX/c1.jpg' },    
            { type: 'img', src: 'image_ps/UIUX/39.jpg' },
            { type: 'video', src: 'image_ps/UIUX/f1.mp4' }
        ],
        title: "OCR & ACCESSIBILITY",
        desc: "The Challenge: Visually impaired individuals face significant barriers when reading physical text (such as medicine bottles, road signs). <br><br>The Solution: Develop a tool focusing on accessibility that integrates image recognition with voice output.<br><br>The Result: Achieved an [instant capture, instant read] experience, emphasizing the precision of information delivery.",
        features: [
            "Real-time text recognition (OCR)", 
            "TTS voice output locally", 
            "Optimized volume key operations",
            "Use OpenAI's API for contextual communication", 
            "Offline recognition mode support"
        ],
        demoDesc: "Watch the demo to see how the OCR converter works in real time! Experience the touch-sensitive volume controls and listen to natural TTS voice readings for visually impaired users – available offline (except for the AI ​​chat function)."
    },
    portfolio: {
        label: "Personal Portfolio Website",
        media: [
            { type: 'img', src: 'image_ps/UIUX/51.jpg' },
            { type: 'img', src: 'image_ps/UIUX/g1.jpg' },    
            { type: 'img', src: 'image_ps/UIUX/40.jpg' },
            { type: 'video', src: 'image_ps/UIUX/p1.mp4' }
        ],
        title: "DIGITAL EXPERIENCE",
        desc: "The Challenge: How to effectively demonstrate a balance between creative design aesthetics and technical front-end implementation.<br><br>The Solution: A sleek Dark Mode portfolio featuring Responsive Web Design (RWD) to ensure accessibility across all devices.<br><br>The Result: Created a structured, interactive brand portal that serves as a living example of my hybrid design-dev skillset.",
        features: [
            "Visual hierarchy guided by grid and whitespace", 
            "Smooth page transition animations", 
            "Dark mode visual optimization", 
            "High-quality portfolio display framework"
        ],
        demoDesc: "Check out the portfolio's responsive design in action! See how the structured grid adapts seamlessly to different screen sizes, and experience the smooth page transitions coupled with sleek dark mode animations."
    }
};

let currentProject = 'random';

function updateContent(projectId) {
    const data = projectData[projectId];
    currentProject = projectId;

    // --- Row 1: Image (Left) | Words (Right) ---
    document.getElementById('row1-img').innerHTML = `<img src="${data.media[0].src}" alt="${data.label}">`;
    document.getElementById('row1-words').innerHTML = `
        <h3>${data.title}</h3>
        <p>${data.desc}</p>
    `;

    // --- Row 2: ER Diagram (Full width Image, no text) ---
    document.getElementById('row2-img').innerHTML = `<img src="${data.media[1].src}" alt="${data.label} Architecture" style="max-width: 100%; max-height: 100%; box-shadow: none;">`;

    // --- Row 3: Image (Left) | Words (Right) ---
    document.getElementById('row3-img').innerHTML = `<img src="${data.media[2].src}" alt="${data.label} Features">`;
    let featureList = data.features.map(f => `<li>${f}</li>`).join('');
    document.getElementById('row3-words').innerHTML = `
        <h3>KEY FEATURES</h3>
        <ul>${featureList}</ul>
    `;

    // --- Row 4: Words (Left) | Demo (Right) ---
    document.getElementById('row4-words').innerHTML = `
        <h3>INTERACTIVE DEMO</h3>
        <p>${data.demoDesc}</p>
    `;
    document.getElementById('row4-demo').innerHTML = `
        <video src="${data.media[3].src}" controls playsinline style="max-height: 100%;"></video>
    `;

    // 添加簡單的淡入動畫
    document.querySelectorAll('.pane').forEach(pane => {
        pane.style.opacity = 0;
        pane.style.transform = 'translateY(10px)';
        setTimeout(() => {
            pane.style.transition = 'all 0.5s ease';
            pane.style.opacity = 1;
            pane.style.transform = 'translateY(0)';
        }, 50);
    });
}

document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', function() {
        document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
        this.classList.add('active');

        updateContent(this.dataset.target);
    });
});

updateContent('random');