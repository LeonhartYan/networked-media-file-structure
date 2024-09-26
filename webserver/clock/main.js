let next;
let countdown;
let expect_run = true;
let i = 0;
let count = 0;

window.onload = () => {
    var button1 = document.getElementById("start");
    var panel = document.getElementsByClassName("box1");
    document.getElementById('current-time').textContent = "00:00:00";
    document.getElementById('next-time').textContent = "00:00:00";
    document.getElementById('timer').textContent = "25:00";
    clock_timer = setInterval(now_clock, 1000);
    button1.addEventListener("click", function () {
        count += 1;
        if(count % 2 != 0){
            panel[0].style.backgroundColor = '#c10038';
            document.body.style.backgroundColor = '#df3b57';
            button1.innerHTML = 'Reset Pomodoro Timer<br>00:00'
            const now = new Date();
            next = new Date(now.getTime() + 1500000);
            next_justify = new Date(next.getTime() + 2000)
            nextString = next_justify.toLocaleTimeString();
            expect_run = false;
            document.getElementById('next-time').textContent = nextString;
            countdown = setInterval(pomodoro, 1000)
        }
    })
    
}

function now_clock() {
    const now = new Date()
    const next_timer = new Date(now.getTime() + 1500000);
    const nextString = next_timer.toLocaleTimeString();
    const nowString = now.toLocaleTimeString();
    document.getElementById('current-time').textContent = nowString;
    if(expect_run){
    document.getElementById('next-time').textContent = nextString;
    }
}



function pomodoro() {
    const now = new Date()
    timer(now)
}

function timer(now_timer) {
    let interval = (next - now_timer) / 1000 + 2;
    var panel = document.getElementsByClassName("box1");
    if (interval <= 0 || count % 2 == 0) {
        expect_run = true;
        document.getElementById("start").innerHTML = 'Start Pomodoro Timer<br>25:00'
        document.getElementById('timer').textContent = "00:00";  
        panel[0].style.backgroundColor = '#fff0f0';
        document.body.style.backgroundColor = '#ffffff';
        document.getElementById('timer').textContent = "25:00"; 
        clearInterval(countdown);
        count = 0;
        return;
    }
    let second = Math.floor(interval % 60);
    let minute = Math.floor((interval / 60) % 60);
    let s_text = second;
    let m_text = minute;
    if (second < 10){
        s_text = "0" + second;
    }
    if (minute < 10){
        m_text = "0" + minute;
    }
    document.getElementById('timer').textContent = `${m_text}:${s_text}`;  
}