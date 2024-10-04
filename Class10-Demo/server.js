// Importing the express library we've installed; This library allows us to create a simple web server.
var express = require('express');

// Create the web server.
var app = express();

// Tell the web server to use the "public" folder for serving static files (html, css, javascript, media.)
app.use(express.static('public'));

app.set("view engine", "ejs");

// Create a test endpoint; This is not required, but it allows us to verify whether the server is working.
app.get('/', function (req, res) {
  res.send('Hello World!')
});

app.get('/random', random)
function random(req, res){
  res.sendFile('img.png', {root: 'public'})
}

app.get('/submit', (req, res)=>{
  console.log(req.query.user)
  res.send("Thanks" + req.query.user + "<br/><a href=\'\/guestbook.html\'>back to guestbook</a>")
  notes.push(
    {
      username: req.query.user,
      message: req.query.notes
    }
  )
})


app.get('/template', (req, res)=>{
  const data = {
    message: [{note:"hello"},
    {visible: true, note:"hello"},
    {visible: false, note:"hello"},
    {visible: true,note:"hello"},
    {visible: true,note:"hello"},
    {visible: true,note:"hello"}]
  }
  res.render("template.ejs", data)
})

app.get('/notes', (req, res) =>{
  let allnotes = ''
  for (let i = 0; i < notes[i]; i ++){
    allnotes += notes[i].username + 'says' + notes[i].message + "<br/>"
  }
})

// And finally start the server. We start the server on port 80, which is the default port for http.
// If you want to learn more about ports, read this: https://www.cloudflare.com/learning/network-layer/what-is-a-computer-port/
app.listen(8080, function () {
  console.log('Example app listening on port 80!')
});