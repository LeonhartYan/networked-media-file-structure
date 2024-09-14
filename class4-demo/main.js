window.onload = () => {
    console.log('loaded')
    alert('loaded!')
    let mypara = document.getElementById('important')
    console.log(mypara)
    mypara.innerHTML = 'Changed!!!'
    mypara.style.color = 'aqua'
    mypara.style.backgroundColor = 'black'
}