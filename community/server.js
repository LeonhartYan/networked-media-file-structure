// imports express library
const express = require('express')
// include body parser library
const parser = require('body-parser')
const encodedParser = parser.urlencoded({extended: true})
// include multer library
const multer = require('multer')
const uploadProcessor = multer({dest:'public/upload'})

// initialize express
const app = express()

// initialize public folder for assets
app.use(express.static('public'))
// initialize body parser with the app
app.use(encodedParser)

// initialize template engine to look at views folder for rendering
app.set('view engine', 'ejs')

// TODO INCLASS: SET UP ROUTES!
app.get('/', (req, res)=>{
    res.render("index.ejs", {})
})

app.get('/posts', (req, res)=>{
    //pass data of posts in the server
    // to the posts page
    const filterTag = req.query.filterTag
    let dataContainer = {
        arrayToBeSent: data,
        allTags: allTags,
        filter: tagsFilter,
        filterTag: filterTag
    }
    res.render("posts.ejs", dataContainer)
})

app.get('/scenarios', (req, res) => {
    res.render('scenarios.ejs');
});

app.get('/about', (req, res)=>{
    res.render('about.ejs');
})


// array that stores all of the data on the server
let data = []
const allTags = ["Scenarios Recommendation 团本推荐",
    "Scenarios Critique 团本拔草", "Run Session 跑团预警",  "Session Comment 跑团评价", "Chat 闲聊"]
const tagsFilter = ["All Tags 全部标签", "Scenarios Recommendation 团本推荐",
    "Scenarios Critique 团本拔草", "Run Session 跑团预警",  "Session Comment 跑团评价", "Chat 闲聊"]
let postNum = []

// new route to handle uploaded data
app.post('/upload', uploadProcessor.single('theimage'), (req, res)=>{
    
    let now = new Date()
    
    // message object that holds the data from the form
    let message = {
        theme: req.body.theme,
        text: req.body.text,
        tags: req.body.tags,
        date: now.toLocaleString(),
        imgSrc: req.body.file,
        postNumber: postNum
    }

    // checks to see if a file has been uplaoded
    if(req.file){
        message.imgSrc = 'upload/'+req.file.filename
    }

    postNum ++
    // adding the most recent message to the top of the array
    data.unshift(message)

    res.redirect('/posts')
})

app.post('/delete', (req, res)=>{
    //data.splice(req.query.postId, 1)
    //res.redirect('/posts')
    data.forEach((d) => {
        console.log(d.postNum)
        console.log(d.postNumber, req.query.postId)
        if(d.postNum == req.query.postId){
            data.splice(req.query.postId, 1)
        }
    });
    res.redirect('/posts')
})

// setting up the server to start
// LAST PIECE OF CODE
// for projects going forward, it CANNOT be 80
app.listen(5050, ()=> {
    console.log('server starts')
})

