const countdownTarget = new Date('2025-01-10T10:00:00');

function calculateCountdown() {
    const now = new Date();
    if (countdownTarget <= now) {
        return { months: 0, days: 0, hours: 0 };
    }

    let months = (countdownTarget.getFullYear() - now.getFullYear()) * 12 +
        (countdownTarget.getMonth() - now.getMonth());

    const anchor = new Date(now);
    anchor.setMonth(anchor.getMonth() + months);

    if (anchor > countdownTarget) {
        months -= 1;
        anchor.setMonth(anchor.getMonth() - 1);
    }

    const remainingMs = countdownTarget.getTime() - anchor.getTime();
    const dayMs = 1000 * 60 * 60 * 24;
    const hourMs = 1000 * 60 * 60;

    const days = Math.max(0, Math.floor(remainingMs / dayMs));
    const hours = Math.max(0, Math.floor((remainingMs - days * dayMs) / hourMs));

    return { months, days, hours };
}

function renderCountdown() {
    const container = document.querySelector('[data-countdown]');
    if (!container) return;

    const monthsEl = container.querySelector('[data-months]');
    const daysEl = container.querySelector('[data-days]');
    const hoursEl = container.querySelector('[data-hours]');

    const { months, days, hours } = calculateCountdown();
    monthsEl.textContent = months.toString().padStart(2, '0');
    daysEl.textContent = days.toString().padStart(2, '0');
    hoursEl.textContent = hours.toString().padStart(2, '0');
}

document.addEventListener('DOMContentLoaded', () => {
    renderCountdown();
    setInterval(renderCountdown, 60 * 60 * 1000);
});
