window.onload = () => {
    pomodoro()
    setInterval(pomodoro, 1000)
    setInterval(timer, 1000)
}

function pomodoro() {
    const now = new Date()
    const next = new Date(now.getTime() + 1500000)
    const nowString = now.toLocaleTimeString();
    const nextString = next.toLocaleTimeString();
    document.getElementById('current-time').textContent = nowString;
    document.getElementById('next-time').textContent = nextString;
}

function timer() {
    let now_timer = new Date();
    let next_timer = new Date(now_timer.getTime() + 1500000);
    let interval = (next_timer - now_timer) / 1000;
    let second = Math.floor(interval % 60);
    let minute = Math.floor((interval / 60) % 60);
    let hour = Math.floor((interval / 60 / 60) % 24);
    document.getElementById('timer').textContent = `${minute}:${second}`
}