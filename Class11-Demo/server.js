//express var
const express = require('express')
const app = express()
//library var
const parser = require('body-parser')
const encodedParser = parser.urlencoded({extended: true})

const multer = require('multer')
const uploadProcessor = multer({dest:"public/upload"})

app.use(express.static('public'))
app.use(encodedParser)
app.set('view engine', 'ejs')
app.get('/', (req, res)=>{
    let dataContainer ={
        posts: allPosts
    }
    res.render('index.ejs', dataContainer)
})
let allPosts = [];
app.post('/upload', uploadProcessor.single('image'), (req, res)=>{
    console.log(req.body)
    console.log(req.body.caption)
    let now = new Date()
    let post = {
        cap: req.body.caption,
        date: now.toLocaleDateString(),
    }
    if (req.file) {
        console.log(req.file.filename);
      }
    allPosts.push(post)
    res.redirect('/')
})

app.listen(8080, ()=>{
    console.log('port is open on 8080')
})