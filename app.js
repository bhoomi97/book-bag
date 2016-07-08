var express = require("express"),
    app     = express(),
    mongoose = require("mongoose"),
    bodyParser = require("body-parser"),
    Book    = require("./models/book")

mongoose.connect("mongodb://localhost/demo");

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));

app.get("/", function(req, res){
    res.render("landing");
});

app.get("/browse", function(req, res){

    Book.find({} , function(err, allBooks){
      res.render("browse", {allBooks: allBooks});
    });

});

app.get("/sell", function(req, res){
  res.render("new");
});

app.post("/sell", function(req, res){
  // Get Input data
  var title = req.body.title,
      desc  = req.body.desc,
      contact = req.body.contact,
      postedBy = req.body.postedBy;
  var newBook = { title: title, description: desc, contact: contact , postedBy: postedBy };

  // store in database

  Book.create(newBook, function(err){
    if(err) {
      console.log(err);
    } else {
      res.redirect("/browse");
    }
  });

});

app.listen(3000);
