// how do we know this is a npm project?
// A: package.json!

// what command do we run to start an npm project?
// A: npm init

// what does the below chunk of code do?
// A: imports libraries
const express = require("express"); // imports express
const multer = require("multer");   // imports multer -- handles file upload
const bodyParser = require("body-parser");  // imports body parser -- allows us to have a body in server request
const nedb = require("@seald-io/nedb")
const cookieParser = require('cookie-parser')

//sessions, auth, pwd encrypt

const expressSession = require('express-session');
const nedbSessionStore = require('nedb-promises-session-store')
const bcrypt = require('bcrypt');
const session = require("express-session");

// translates bits and bytes (literal memory and data) to something readable by the server
const urlEncodedParser = bodyParser.urlencoded({ extended: true }); 

// what is app?
// A: instance of express
const app = express();

// what is this configuring?
// A: destination for where files should be uploaded
const upload = multer({
  dest: "public/uploads",
});

let database = new nedb({
  filename: "database.txt",
  autoload: true
})

// what do each of these statements do?
app.use(express.static("public"));  // set the default folder for any static files such as assets, css, html
app.use(urlEncodedParser);        // middleware to make sure the bits and bytes can be understood by the app
app.use(cookieParser())
app.set("view engine", "ejs"); // allows us to use ejs

const nedbSessionInit = nedbSessionStore({
  connect: expressSession,
  filename: 'sessions.txt'
})

app.use(expressSession({
  store: nedbSessionInit,
  cookie: {
    maxAge: 365 * 24 * 60 * 60 * 1000
  },
  secret: 'supersecret123'
}))

let userdatabase =  new nedb({
  filename: 'userdb.txt',
  autoload: true
})

function requiresAuth(req, res, next){
  if(req.session.loggedInUser){
    next()
  }else{
    res.redirect('/login')
  }
}


// what is this?
// A: route that handles when the client makes a request to /
app.get("/", requiresAuth, (request, response) => {
  // response.send("server working");

  // what steps do we need in order to use a template ejs file?
  // 
  let newVisits = 1
  if(request.cookies.visits){
    newVisits = parseInt(request.cookies.visits) + 1
    response.cookie("visits", newVisits, {
      expires: new Date(Date.now() + 100 * 365 * 24 * 60 * 60 * 1000)
    })
  } else {
    response.cookie("visits", 1, {
      expires: new Date(Date.now() + 100 * 365 * 24 * 60 * 60 * 1000)
    })
  }

  let query = {}
  let sortQuery = {
    timestamp: -1 // sort in reverse chronological order
  }

  database.find(query).sort(sortQuery).exec( (err, retreivedData)=>{
    response.render('index.ejs', {posts: retreivedData, visitsToSite:newVisits})
  })

  // response.render('index.ejs', {})
  // make sure to comment out the res.send() code above
});

//upload route add data to database

app.post('/upload', upload.single('theimage'), (req, res)=>{
  let currDate = new Date()
  let data = {
    text: req.body.text,
    date: currDate.toLocaleString(),
    timestamp: currDate.getTime(),
    likes: 0,
    comments: []
  }
  if(req.file){
    data.image = "/uploads/" + req.file.filename
  }


  database.insert(data, (err, newData)=>{
    console.log(newData)
    res.redirect('/')
  })
})

app.get('/search', (req, res)=>{
  // query because get request
  let searchTerm = req.query.searchTerm
  let imageOnly = req.query.imageOnly

  let query = {
    text: new RegExp(searchTerm)
  }

  database.find(query, (err, searchedData)=>{

    res.render('index.ejs', {posts: searchedData})
  })
})

app.get('/post/:id', (req, res)=>{
  let id = req.params.id

  console.log(id)

  let query = {
    _id: id
  }

  database.findOne(query, (err, data)=>{
    res.render('individualPost.ejs', {post: data})
  })

  // res.redirect('/')
})

app.post('/remove', (req, res)=>{
  let id = req.body.postId
  let query = {
    _id: id
  }

  database.remove(query, (err, numRemoved)=>{
    console.log('num removed elements', numRemoved)
    res.redirect('/')
  })
})

app.post('/like', (req, res)=>{
  console.log(req.body.postId)
let id = req.body.postId
  if(req.cookies[id] == "set"){
    res.redirect('/')
  } else { //otherwise add the cookie and like the post
    res.cookie(id, "set", {expires: new Date(Date.now() + 1000000000)})
  //get the post looking at in database
  let query = {
    _id: req.body.postId,
  }
  let update = {
    $inc: {likes: 1}
  }
  //changing info already in db
  //param 1: post looking for// //param 2: things updating// //3rd option, passin empty obj// 4th anonymous callback//
  database.update(query, update, {}, (err, numUpdated)=>{
    console.log(numUpdated);
    res.redirect('/')
  })
}
})

app.post('/comment', (req, res)=>{
  let id = req.body.postId
  let commentText = req.body.comment
  let query ={
    _id: id
  }
  let update = {
    //nedb data add
    $push: {comments: commentText}
  }
  
  database.update(query, update, {}, (err, num)=>{
    res.redirect("/post/" + _id)
  })

  res.redirect('/')
})

app.get('/register', (req, res)=>{
  res.render('register.ejs', {})
})

app.get('/login', (req, res)=>{
  res.render('login.ejs', {})
})

app.post('/signup', upload.single("profilePicture"), (req, res)=>{
  let hashedPassword = bcrypt.hashSync(req.body.password, 10)

  let data = {
    username: req.body.username,
    fullname: req.body.fullname,
    password: hashedPassword,
  }

  userdatabase.insert(data, (err, insertedData)=>{
    console.log(insertedData);
    res.redirect("/login")
  })
})

app.post("/authenticate", (req, res)=>{
  let data = {
    username: req.body.username,
    password: req.body.password,
  }

  //search username
  let query = {
    username: data.username
  }
  //search db for match username
  userdatabase.findOne(query, (err, user)=>{
    console.log("attempt login")
    if(err || user == null){
      console.log("user not found")
      //user not found
      res.redirect('/login')
    }else{
      console.log('found user');
      // store enc pass in db as local var
      let encPass = user.password
      // bcrypt compare enc pass with login pwd
      if(bcrypt.compareSync(data.password, encPass)){
        console.log('login successful')
        //req find current session
        let session = req.session
        //store logged user into the session
        session.loggedInUser = data.username
        res.redirect('/')
      } else {//pwd failed, re-login
        res.redirect('/login')
      }
    }
  })
})

app.get('/logout', (req, res)=>{
  delete req.session.loggedInUser
  res.redirect('/login')
})


// what does the number signify?
// A: port number!
// how do we access this on the web?
// A: ip address:port ex. localhost:6001 
app.listen(6001, () => {
  console.log("server started on port 6001");
});

// secret comment for later in the demo:
// @seald-io/nedb
