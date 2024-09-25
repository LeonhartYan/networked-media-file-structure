let colorArray = ['#FF6978', '#FFFCF9', '#B1EDE8', '#6D435A', '#352D39']

window.onload = () => {
    console.log('loaded')
    for (i = 0; i < 50; i ++){
        
        let span = document.createElement("span");
        let spantext = document.createTextNode('This is element '+ i +'');
        span.appendChild(spantext);
        span.classList.add('text-body')
        span.style.backgroundColor = randomColor(colorArray);
        document.body.appendChild(span);
        //console.log(spantext)
    }
    setInterval(modfySpanBackground, 1000)
}

function modfySpanBackground(){
    const date = new Date();
    const date1 = date.getHours()
    const date2 = date.getMinutes() + 25
    let allSpans = document.getElementsByClassName('text-body');
        //console.log(allSpans)
    for(let i = 0; i < allSpans.length; i++){
        allSpans[i].textContent = date2 + "\n";
    }
}

function randomColor(arr){
    //array index is not a decimal
    //formula to calculate number max value
    //Math.random() * arr.length
    let index = Math.floor(Math.random() * arr.length);
    return arr[index];
}