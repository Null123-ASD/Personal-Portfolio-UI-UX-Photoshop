const numberEl = document.getElementById("loaderNumber");

let current = 1;
const total = 100;

// 時間配置
const normalEnd = 97;
const normalDuration = 2200; 
const slowDuration = 800;    // 98–100


requestAnimationFrame(() => {
  numberEl.classList.add("move-center");
});

window.addEventListener('load', () => {
  setTimeout(() => {
    requestAnimationFrame(() => {
      numberEl.classList.add("move-center");
    });
  }, 50);
});

// 正常段間隔
const normalInterval = normalDuration / normalEnd;

let timer = null;

function runNormal() {
  timer = setInterval(() => {
    current++;
    numberEl.textContent = current;

    if (current >= normalEnd) {
      clearInterval(timer);
      runSlow();
    }
  }, normalInterval);
}

function runSlow() {
  let slowStep = 0;
  const slowValues = [98, 99, 100];
  const slowInterval = slowDuration / slowValues.length;

  timer = setInterval(() => {
    numberEl.textContent = slowValues[slowStep];
    slowStep++;

    if (slowStep >= slowValues.length) {
      clearInterval(timer);

      // 停留一下，讓 100 被感知
      setTimeout(() => {
        numberEl.classList.add("fade-out");

        setTimeout(() => {
            sessionStorage.setItem("fromLoader", "true");

            window.location.href = "home.html#home";
        }, 600);

      }, 300);
    }
  }, slowInterval);
}

// 開始
runNormal();
