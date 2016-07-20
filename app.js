var express = require("express"),
    app     = express(),
    multer = require("multer"),
    methodOverride = require("method-override"),
    mongoose = require("mongoose"),
    flash = require("connect-flash"),
    bodyParser = require("body-parser")

// Multer Storage Options
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now()+file.originalname)
    }
});
var upload = multer({ storage: storage });

// Auth Packages
var passport = require("passport"),
    localStrategy = require("passport-local")

// Import Models
var Book    = require("./models/book"),
    User = require("./models/user")

// Mongoose Connection
mongoose.connect("mongodb://localhost/demo");

// App Config
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(flash());
// passport config
  app.use(require("express-session")({
    secret: "random text",
    resave: false,
    saveUninitialized: false
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  passport.use( new localStrategy(User.authenticate()));
  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());

// Global objects
app.use(function(req, res,next){
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

// Routes
app.get("/", function(req, res){
    res.render("landing");
});
// Get all products
app.get("/browse", function(req, res){
    Book.find({}).sort({uploadDate: -1}).exec(function(err, allBooks){
    // Book.find({}, , function(err, allBooks){
      res.render("browse", {allBooks: allBooks});
    });

});
// Get all products By year
app.get("/browse/year/:year", function(req, res){
  var year = req.params.year;
  Book.find({year: year} , function(err, allBooks){
    res.render("browse", {allBooks: allBooks});
  });
});
// Get all products by user
app.get("/browse/user/:username", function(req, res){
  var username = req.params.username;
  Book.find({ 'user.username' : username }, function(err, allBooks){
    res.render("browse", {allBooks: allBooks});
  })
});

// Add a new product
app.get("/browse/new", function(req, res){
  res.render("new");
});
// Upload a product
app.post("/browse", upload.single('image'), function(req, res){
  // Get Input data
  var title = req.body.title,
      image = req.file.filename,
      desc  = req.body.desc,
      year = req.body.year,
      contact = req.body.contact,
      postedBy = req.body.postedBy;
  if(req.user) {
    var user = {
      id: req.user._id ,
      username: req.user.username
    }
  }
  var newBook = { title: title, image: image, description: desc, year: year, contact: contact ,user: user, postedBy: postedBy };

  // store in database

  Book.create(newBook, function(err){
    if(err) {
      console.log(err);
    } else {
      req.flash("success", "Great Job! Your book is now posted online.")
      res.redirect("/browse");
    }
  });

});

// Show details of a product
app.get("/browse/:id", function(req, res){

  Book.findById(req.params.id, function(err, foundBook){
    if(err) {
      res.redirect("/browse");
    } else {
      res.render("show", {book: foundBook});
    }
  });
});
// edit form for a product
app.get("/browse/:id/edit", checkOwner, function(req, res){
  Book.findById(req.params.id, function(err, foundBook){
    if(err)
      res.redirec("back");
    else
      res.render("edit", {book: foundBook});

  })
});
// update a product
app.put("/browse/:id", checkOwner, upload.single('image'), function(req, res){
  var image = req.file.filename;
  var book = req.body.book;
  book.image = image;
  // console.log(book);
  Book.findByIdAndUpdate(req.params.id, book, function(err, updatedBook){
    if(err)
      res.redirect("back");
    else {
      req.flash("success", "Nice! Update successful.")
      res.redirect("/browse/"+ req.params.id);
    }
  })
})
// delete
app.delete("/browse/:id", function(req, res){
    Book.findByIdAndRemove(req.params.id, function(err){
        if(err) {
            res.redirect("back");
        } else {
            req.flash("error", "Book deleted!")
            res.redirect("/browse");
        }
    });
})

// mark product as sold
app.get("/browse/:id/sold", checkOwner,  function(req, res){
    Book.findById(req.params.id, function(err, book){
      if(err) {
        res.redirect("back");
      } else {
        book.sold = !book.sold;
        book.save(function(err){
          if(err)
            console.log(err);
        });
        res.redirect("back");
      }
  });
});

// app.get("/browse/:id/sold", function(req, res){
//     Book.findById(req.params.id, function(err, book){
//       if(err) {
//         res.redirect("back");
//       } else {
//         var sold = book.sold;
//         Book.findByIdAndUpdate(req.params.id, { $set: { sold: !sold } }, function(err, book){});
//         res.redirect("back");
//       }
//   });
// });




// ====================== Auth Routes

app.get("/signup", function(req, res){
  res.render("signup");
});

app.post("/signup", function(req, res){

  var newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, function(err, user){
    if(err){
      req.flash("error", err.message + " Plase try again!");
      return res.redirect("/signup");
    } else {
      passport.authenticate("local")(req, res, function(){
        req.flash("success" , "Welcome " + req.body.username + "! You're now successfully signed up!")
        res.redirect("/browse");
      });
    }
  });

});

// Sign In

app.get("/signin", function(req, res){
  res.render("signin");
});

app.post("/signin",
  passport.authenticate("local", { successRedirect: "/browse",
                                  successFlash: "Welcome! you're now logged in.",
                                  failureRedirect: "/signin",
                                  failureFlash: true })
);

// logout

app.get("/logout", function(req, res) {
   req.logout();
   req.flash("success", "Successfully logged out!")
   res.redirect("/signin");
});

// Middleware

function checkOwner(req, res, next){
  // Is someone logged in?
  if(req.isAuthenticated()) {
    // Does User own the product?
      Book.findById(req.params.id, function(err, foundBook){
          if(err) {
            res.redirect("back");
          } else {
            // User check
              if((foundBook.user.id).equals(req.user._id)) {
                next();
              } else {
                res.redirect("back");
              }
          }
      });
  } else {
    res.redirect("back");
  }

}

app.listen(3000);
