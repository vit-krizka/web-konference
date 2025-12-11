document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('[data-snow-toggle]');
  let snowTimer = null;
  let snowLayer = null;

  const createSnowflake = () => {
    if (!snowLayer) return;
    const flake = document.createElement('div');
    flake.className = 'snowflake';
    flake.textContent = '❄';
    flake.style.left = `${Math.random() * 100}%`;
    flake.style.fontSize = `${12 + Math.random() * 10}px`;
    const fallDuration = 6 + Math.random() * 6;
    flake.style.animationDuration = `${fallDuration}s, ${4 + Math.random() * 3}s`;
    snowLayer.appendChild(flake);
    setTimeout(() => flake.remove(), fallDuration * 1000);
  };

  const startSnow = () => {
    if (snowLayer) return;
    snowLayer = document.createElement('div');
    snowLayer.className = 'snow-layer';
    document.body.appendChild(snowLayer);
    snowTimer = setInterval(createSnowflake, 200);
    toggle?.setAttribute('aria-pressed', 'true');
    if (toggle) toggle.textContent = 'Přestat sněžit';
  };

  const stopSnow = () => {
    if (snowTimer) clearInterval(snowTimer);
    snowTimer = null;
    snowLayer?.remove();
    snowLayer = null;
    toggle?.setAttribute('aria-pressed', 'false');
    if (toggle) toggle.textContent = 'Sněžit';
  };

  toggle?.addEventListener('click', () => {
    if (snowLayer) {
      stopSnow();
    } else {
      startSnow();
    }
  });
});
