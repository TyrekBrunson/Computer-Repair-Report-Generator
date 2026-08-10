// Shared by diagnostic_generator.html and repair_generator.html:
// the 7:00/18:00 daily auto-refresh clock and the hamburger menu toggle.
const REFRESH_HOURS = [7, 18];

function formatTime(date) {
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const period = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    if (hours === 0) hours = 12;
    return `${hours}:${minutes} ${period}`;
}

function getHourMinute(value) {
    const hour = Math.floor(value);
    const minute = Math.round((value - hour) * 60);
    return { hour, minute };
}

function getNextRefreshTime(now = new Date()) {
    const current = new Date(now);
    current.setSeconds(0, 0);

    for (const value of REFRESH_HOURS) {
        const { hour, minute } = getHourMinute(value);
        const candidate = new Date(current);
        candidate.setHours(hour, minute, 0, 0);
        if (candidate >= now) return candidate;
    }

    const tomorrow = new Date(current);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const { hour, minute } = getHourMinute(REFRESH_HOURS[0]);
    tomorrow.setHours(hour, minute, 0, 0);
    return tomorrow;
}

function getPreviousRefreshTime(now = new Date()) {
    const current = new Date(now);
    current.setSeconds(0, 0);

    for (let i = REFRESH_HOURS.length - 1; i >= 0; i--) {
        const { hour, minute } = getHourMinute(REFRESH_HOURS[i]);
        const candidate = new Date(current);
        candidate.setHours(hour, minute, 0, 0);
        if (candidate <= now) return candidate;
    }

    const yesterday = new Date(current);
    yesterday.setDate(yesterday.getDate() - 1);
    const lastValue = REFRESH_HOURS[REFRESH_HOURS.length - 1];
    const lastTime = getHourMinute(lastValue);
    yesterday.setHours(lastTime.hour, lastTime.minute, 0, 0);
    return yesterday;
}

function updateRefreshCountdown() {
    const nextRefresh = getNextRefreshTime();
    const nextRefreshElement = document.getElementById('next-refresh-time');
    if (nextRefreshElement) nextRefreshElement.textContent = formatTime(nextRefresh);
}

function updateRefreshStatus() {
    const lastRefreshElement = document.getElementById('last-refresh-time');
    if (lastRefreshElement) lastRefreshElement.textContent = formatTime(new Date());
    updateRefreshCountdown();
}

function toggleMenu() {
    const dropdown = document.getElementById('menu-dropdown');
    dropdown.classList.toggle('show');
}

document.addEventListener('click', function(event) {
    const menu = document.querySelector('.hamburger-menu');
    const dropdown = document.getElementById('menu-dropdown');
    if (menu && !menu.contains(event.target) && dropdown) dropdown.classList.remove('show');
});
