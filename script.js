const snowButtons = [
    document.getElementById('snow-toggle'),
    document.getElementById('snow-hero')
];

let snowActive = false;
let flakes = [];
let snowCanvas;
let ctx;

function initSnowCanvas() {
    if (snowCanvas) return;
    snowCanvas = document.createElement('canvas');
    snowCanvas.className = 'snow-canvas';
    document.body.appendChild(snowCanvas);
    ctx = snowCanvas.getContext('2d');
    resizeSnow();
    window.addEventListener('resize', resizeSnow);
}

function resizeSnow() {
    if (!snowCanvas) return;
    snowCanvas.width = window.innerWidth;
    snowCanvas.height = window.innerHeight;
}

function createFlakes() {
    flakes = Array.from({ length: 120 }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r: Math.random() * 2.2 + 1,
        d: Math.random() * 1 + 0.5,
    }));
}

function drawSnow() {
    if (!ctx || !snowActive) return;
    ctx.clearRect(0, 0, snowCanvas.width, snowCanvas.height);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.beginPath();
    flakes.forEach((flake, i) => {
        const angle = (Date.now() / 5000) + (flake.d * 2 * Math.PI);
        flake.y += Math.cos(angle + flake.d) + 1 + flake.r / 2;
        flake.x += Math.sin(angle) * 0.8;

        if (flake.y > snowCanvas.height) {
            flakes[i] = { ...flake, y: -10, x: Math.random() * snowCanvas.width };
        }
        if (flake.x > snowCanvas.width) flake.x = 0;
        if (flake.x < 0) flake.x = snowCanvas.width;

        ctx.moveTo(flake.x, flake.y);
        ctx.arc(flake.x, flake.y, flake.r, 0, Math.PI * 2, true);
    });
    ctx.fill();
    requestAnimationFrame(drawSnow);
}

function toggleSnow() {
    snowActive = !snowActive;
    snowButtons.forEach((btn) => {
        if (!btn) return;
        btn.textContent = snowActive ? 'Zastavit sněžení' : 'Sněžit';
        btn.setAttribute('aria-pressed', snowActive.toString());
    });

    if (snowActive) {
        initSnowCanvas();
        createFlakes();
        drawSnow();
    } else if (ctx) {
        ctx.clearRect(0, 0, snowCanvas.width, snowCanvas.height);
    }
}

snowButtons.forEach((btn) => btn?.addEventListener('click', toggleSnow));
