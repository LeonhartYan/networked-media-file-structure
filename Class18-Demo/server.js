// how do we know this is a npm project?
// A: package.json file

// what command do we run to start an npm project?
// A: npm init

// what does the below chunk of code do?
// A: import libraries
const express = require("express"); // express
const multer = require("multer");   // file-upload
const bodyParser = require("body-parser");  // have body in server request， read body

// translates bits and bytes(literal memory data to server reable)
const urlEncodedParser = bodyParser.urlencoded({ extended: true }); 

// what is app?
// A: apply express framework
const app = express();

// what is this configuring?
// A: file upload destination
const upload = multer({
  dest: "public/uploads",
});

// what do each of these statements do?
app.use(express.static("public"));  // set default folder of static file(assets, img, etc.)
app.use(urlEncodedParser);        //init parser to translate bit/bytes
app.set("view engine", "ejs"); // init template engine for site rendering

// what is this?
// A: route handle client request
app.get("/", (request, response) => {
  response.send("server working");

  // what steps do we need in order to use a template ejs file?
  request.render('index.ejs', {})
  // install ejs, create view folder, set view engine to "ejs", create the .ejs file
  
  // make sure to comment out the res.send() code above
});

// what does the number signify?
// A: port number
// how do we access this on the web?
// A: [IPAddress]:port
app.listen(6001, () => {
  console.log("server started on port 6001");
});

// secret comment for later in the demo:
// @seald-io/nedb
