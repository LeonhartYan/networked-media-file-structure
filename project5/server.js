// how do we know this is a npm project?
// A: package.json!

// what command do we run to start an npm project?
// A: npm init

// what does the below chunk of code do?
// A: imports libraries
const express = require("express"); // imports express
const multer = require("multer"); // imports multer -- handles file upload
const bodyParser = require("body-parser"); // imports body parser -- allows us to have a body in server request
const nedb = require("@seald-io/nedb");
const cookieParser = require("cookie-parser");
// ****************************************************************
// NEW libraries to handle sessions, auth, encryption
// ****************************************************************
const expressSession = require('express-session')
const nedbSessionStore = require('nedb-promises-session-store')
const bcrypt = require('bcrypt')
const http = require("http");
const { Server } = require("socket.io");

// translates bits and bytes (literal memory and data) to something readable by the server
const urlEncodedParser = bodyParser.urlencoded({ extended: true });

// what is app?
// A: instance of express
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  pingInterval: 25000, 
  pingTimeout: 50000, 
});

// what is this configuring?
// A: destination for where files should be uploaded
const upload = multer({
  dest: "public/uploads",
});

let database = new nedb({
  filename: "database.txt",
  autoload: true,
});

// what do each of these statements do?
app.use(express.static("public")); // set the default folder for any static files such as assets, css, html
app.use(urlEncodedParser); // middleware to make sure the bits and bytes can be understood by the app
app.use(cookieParser());
app.set("view engine", "ejs"); // allows us to use ejs

// ****************************************************************
// NEW middleware to handle sessions, auth, encryption
// ****************************************************************
const nedbSessionInit = nedbSessionStore({
  connect: expressSession,
  filename: 'sessions.txt'
})
app.use(expressSession({
  store: nedbSessionInit,
  cookie: {
    maxAge: 365 * 24 * 60 * 60 * 1000
  },
  secret: 'supersecret123',
  resave: false,
  saveUninitialized: true
}))
let userdatabase = new nedb({
  filename: 'userdb.txt',
  autoload: true
})

// custom middleware function to check if the user is logged in
// next is special to middleware -> it will go to the callback we use "next", or the anon function we use for every request
function requiresAuth(req, res, next) {
  if (req.session.loggedInUser) {
    next()
  } else {
    res.redirect('/login')
  }
}
// what is this?
// A: route that handles when the client makes a request to /
app.get("/", requiresAuth, (req, res) => {
  const username = req.session.loggedInUser
  // response.send("server working");

  // what steps do we need in order to use a template ejs file?
  let newVisits = 1;
  if (req.cookies.visits) {
    newVisits = parseInt(req.cookies.visits) + 1;
    res.cookie("visits", newVisits, {
      expires: new Date(Date.now() + 100 * 365 * 24 * 60 * 60 * 1000),
    });
  } else {
    res.cookie("visits", 1, {
      expires: new Date(Date.now() + 100 * 365 * 24 * 60 * 60 * 1000),
    });
  }

  let query = {};
  let sortQuery = {
    timestamp: -1, // sort in reverse chronological order
  };

  database
    .find(query)
    .sort(sortQuery)
    .exec((err, retreivedData) => {
      res.render("index.ejs", {
        posts: retreivedData,
        visitsToSite: newVisits,
        username: username,
      });
    });

  // response.render('index.ejs', {})
  // make sure to comment out the res.send() code above
});

// ------------------
// upload route that adds data to the database
// ------------------
app.post("/upload", upload.single("theimage"), (req, res) => {
  const username = req.session.loggedInUser;
  const theme = req.body.theme
  const interest = [
    req.body.interest1,
    req.body.interest2,
    req.body.interest3,
    req.body.interest4,
    req.body.interest5
  ].map(interest => ({ name: interest, likes: 0, likedBy: [] }));
  let currDate = new Date();
  let data = {
    user: username,
    interests: interest,
    theme: theme,
    date: currDate.toLocaleString(),
    timestamp: currDate.getTime(),
    // adding new likes field to the database
    likes: 0,
    comments: []
  };
  database.insert(data, (err, newData) => {
    console.log(newData);
    res.redirect("/")
  });
});

app.get("/starmap", (req, res) => {
  const username = req.session.loggedInUser
  res.render("starmap.ejs", { username })
})

app.get("/about", (req, res) => {
  const username = req.session.loggedInUser
  res.render("about.ejs", { username })
})

app.get("/search", (req, res) => {
  // query because get request
  const username = req.session.loggedInUser
  let searchTerm = req.query.searchTerm;
  let searchType = req.query.searchType || 'theme';
  let query;
  if (searchType === 'name') {
    query = { user: new RegExp(searchTerm, 'i') };
  } else if (searchType === 'theme') {
    query = { theme: new RegExp(searchTerm, 'i') };
  } else if (searchType === 'interest') {
    query = { 'interests.name': new RegExp(searchTerm, 'i') };
  }

  database.find(query, (err, searchedData) => {
    res.render("index.ejs", { posts: searchedData, username: username, visitsToSite: req.cookies.visits });
  });
});

app.get("/post/:id", requiresAuth, (req, res) => {
  let id = req.params.id;

  console.log(id);

  let query = {
    _id: id,
  };

  database.findOne(query, (err, data) => {
    res.render("individualPost.ejs", { post: data });
  });

  // res.redirect('/')
});

app.post("/remove", (req, res) => {
  let id = req.body.postId;
  const currentUser = req.session.loggedInUser;
  database.findOne({ _id: id }, (err, post) => {

    let query = {
      _id: id,
    };
    if (post.user === currentUser) {
      database.remove(query, (err, numRemoved) => {
        console.log("num removed elements", numRemoved);
        res.redirect("/");
      });
    } else {
      return res.status(403).send("You do not have permission to delete this Starmap.");
    }
  })
});

// ****************************************************************
// NEW route to handle likes
// ****************************************************************
app.post("/like", (req, res) => {
  console.log(req.body.postId);

  // making an id variable so i don't have to write
  // req.body.postId every time i want to use it
  let id = req.body.postId

  // checks if specific browser has liked the post
  // req.cookies.id
  if (req.cookies[id] == "set") {
    console.log(req.cookies)
    res.redirect("/");
  } else { // otherwise add the cookie and like the post
    res.cookie(id, "set", { expires: new Date(Date.now() + 100000000000) })

    // get the post we are looking at in the db
    let query = {
      _id: id,
    };
    let update = {
      $inc: { likes: 1 },
    };
    // changing information that already exist in the db
    // 1st param: post we are looking for
    // 2nd param: thing we are updating
    // 3rd param: options, typically we pass in an empty obj
    // 4th param: anonymous callback function
    database.update(query, update, {}, (err, numUpdated) => {
      console.log(numUpdated);
      res.redirect("/");
    });
  }

  // res.redirect('/')
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);
  socket.on("disconnect", (reason) => {
    console.log(`A user disconnected. Reason:${reason}`, socket.id);
  });

  socket.on("like-interest", ({ postId, interestIndex, username }) => {
    const likeByPath = `interests.${interestIndex}.likedBy`;
    const likeCountPath = `interests.${interestIndex}.likes`;
    database.findOne({ _id: postId }, (err, post) => {
      const likedBy = post.interests[interestIndex].likedBy || [];
      if (likedBy.includes(username)) {
        socket.emit("like-failed", { postId, interestIndex, message: "Already liked" });
        return;
      }
      const targetUser = post.user;
      const theme = post.theme;
      const interestName = post.interests[interestIndex].name;
      let query = {
        _id: postId,
      };
      let update = {
        $inc: { [likeCountPath]: 1 },
        $push: { [likeByPath]: username },
      };
      database.update(query, update, {}, (err, numUpdated) => {
        if (err || numUpdated === 0) {
          socket.emit("like-failed", { postId, interestIndex, message: "Failed to update likes" });
          return;
        }

        database.findOne({ _id: postId }, (err, updatedPost) => {
          if (err || !updatedPost) {
            socket.emit("like-failed", { postId, interestIndex, message: "Failed to fetch updated post" });
            return;
          }

          const updatedLikeCount = updatedPost.interests[interestIndex].likes;

          io.emit("interest-liked", {
            postId: postId,
            index: interestIndex,
            like: updatedLikeCount,
            name: interestName,
          });

          io.emit("notification", {
            message: `@${username} Liked👍 @${targetUser}'s Interest of ${theme}: ${interestName}`,
          });
        });
      }
      );
    });
  });
});



// ****************************************************************
// NEW route to handle commenting
// ****************************************************************
app.post('/comment', (req, res) => {
  let id = req.body.postId
  let commentText = req.body.comment
  const username = req.session.loggedInUser

  let query = {
    _id: id
  }
  let update = {
    $push: { comments: `@${username}: ${commentText}` }
  }
  database.update(query, update, {}, (err, num) => {
    res.redirect('/')
  })
})

app.get('/register', (req, res) => {
  res.render('register.ejs', {})
})

app.get('/login', (req, res) => {
  res.render('login.ejs', {})
})

app.post('/signup', upload.single('profilePicture'), (req, res) => {
  let hashedPassword = bcrypt.hashSync(req.body.password, 10)

  let data = {
    username: req.body.username,
    fullname: req.body.fullname,
    password: hashedPassword
  }

  userdatabase.insert(data, (err, insertedData) => {
    console.log(insertedData)
    res.redirect('/login')
  })
})

app.post("/authenticate", (req, res) => {
  // storing req body in local data obj
  let data = {
    username: req.body.username,
    password: req.body.password
  }

  // query to search the db for a particular username
  let query = {
    username: data.username
  }

  // searching the db for 1 username that matches
  userdatabase.findOne(query, (err, user) => {
    console.log('attempted login')
    // checks if error, or if user is not found
    if (err || user == null) {
      // redirects to login if user is not found
      res.redirect('/login')
    } else { // if user is found
      console.log('found user')
      // store the enc pass from the db in a local variable
      let encPass = user.password

      // use bcrypt to compare the enc pass with the password from the attempted login
      if (bcrypt.compareSync(data.password, encPass)) {
        console.log('successful login')

        // get the current session from the request
        let session = req.session
        // store the user that has logged in into the session
        session.loggedInUser = data.username

        // direct to home page
        res.redirect('/')
      } else { // if password fails, redirect back to login
        res.redirect('/login')
      }

    }
  })
})

app.get('/logout', requiresAuth, (req, res) => {
  delete req.session.loggedInUser
  res.redirect('/login')
})

// what does the number signify?
// A: port number!
// how do we access this on the web?
// A: ip address:port ex. localhost:6001
server.listen(6001, () => {
  console.log("server started on port 6001");
});

// secret comment for later in the demo:
// @seald-io/nedb
