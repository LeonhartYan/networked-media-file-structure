let next
window.onload = () => {
    const now = new Date();
    next = new Date(now.getTime() + 1500000);
    countdown = setInterval(pomodoro, 1000)
}

function pomodoro() {
    const now = new Date()
    const next_timer = new Date(now.getTime() + 1500000);
    const nowString = now.toLocaleTimeString();
    const nextString = next_timer.toLocaleTimeString();
    document.getElementById('current-time').textContent = nowString;
    document.getElementById('next-time').textContent = nextString;
    timer(now);
}

function timer(now_timer) {
    let interval = (next - now_timer) / 1000;
    if (interval <= 0) {
        document.getElementById('timer').textContent = '00:00';
        clearInterval(countdown);
        return;
    }

    let second = Math.floor(interval % 60);
    let minute = Math.floor((interval / 60) % 60);
    let hour = Math.floor((interval / 60 / 60) % 24);
    document.getElementById('timer').textContent = `${minute}:${second}`
}