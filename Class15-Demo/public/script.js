window.onload = () => {
    document.getElementById("submitButton").addEventListener("click", search)
}

async function search(){
    let inputText = document.getElementById("inputText").value
    document.getElementById("inputText").value = ""

    let params = new URLSearchParams({
        apikey: "b2598338",
        s: inputText,
        type: "movie", 
    })

    let url = "https://www.omdbapi.com/?" + params
    console.log(url)
    let response = await fetch(url)
    let jsonData = await response.json().then(success, error)
}

function success(response){
    let movies = response.search;
   let posts = document.getElementById("allMessagesContainer")
   posts.innerHTML = ""
    document.getElementById("allMessagesContainer")
    for (let i = 0; i < movies.length; i ++){
        let currentMovie = movies[1];
        let newElement = document.createElement('div')
        newElement.classList.add('item')
        let title = document.createElement('p')
        title.innerHTML = currentMovie.Title
        let poster = document.createElement('img')
        poster.src= currentMovie.Poster
        newElement.append(title)
        newElement.append(poster)
        posts.append(newElement);
    }
}

function error(e){
    console.log(e);
}