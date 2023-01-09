require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();
const _ =require("lodash");
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const mongoose = require("mongoose");
const port= process.env.PORT || 3000;

mongoose.connect(process.env.mongoose_connect_url, {useNewUrlParser: true});

const compose_schema= {
  blog_title:String,
  blog_post:String
};

const Blogs= mongoose.model("Blogs",compose_schema);


const homeStartingContent = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Pellentesque sit amet porttitor eget dolor morbi non. Viverra adipiscing at in tellus integer feugiat scelerisque varius. Diam volutpat commodo sed egestas egestas fringilla phasellus. Eget mauris pharetra et ultrices neque ornare aenean euismod. Sem viverra aliquet eget sit amet tellus. Amet nisl suscipit adipiscing bibendum est. Varius vel pharetra vel turpis nunc. Ultrices in iaculis nunc sed augue lacus. Quis risus sed vulputate odio. At augue eget arcu dictum varius duis at consectetur lorem. ";

const aboutContent = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Pellentesque sit amet porttitor eget dolor morbi non. Viverra adipiscing at in tellus integer feugiat scelerisque varius. Diam volutpat commodo sed egestas egestas fringilla phasellus. Eget mauris pharetra et ultrices neque ornare aenean euismod. Sem viverra aliquet eget sit amet tellus. Amet nisl suscipit adipiscing bibendum est. Varius vel pharetra vel turpis nunc. Ultrices in iaculis nunc sed augue lacus. Quis risus sed vulputate odio. At augue eget arcu dictum varius duis at consectetur lorem. ";

const contactContent = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Pellentesque sit amet porttitor eget dolor morbi non. Viverra adipiscing at in tellus integer feugiat scelerisque varius. Diam volutpat commodo sed egestas egestas fringilla phasellus. Eget mauris pharetra et ultrices neque ornare aenean euismod. Sem viverra aliquet eget sit amet tellus. Amet nisl suscipit adipiscing bibendum est. Varius vel pharetra vel turpis nunc. Ultrices in iaculis nunc sed augue lacus. Quis risus sed vulputate odio. At augue eget arcu dictum varius duis at consectetur lorem. ";


let post_arr=[];
app.get('/', (req, res) => {
  Blogs.find({},function(err,post_db){
    if(err) console.log(err);
    else
    {
      res.render('home', {
        home_content: homeStartingContent,
        posts:post_db
      });

    }
  });

});
app.get('/about',function(req,res){
  res.render('about',{about_content:aboutContent});
});


app.get('/contact',function(req,res){
  res.render('contact',{contact_content:contactContent});
});

app.get('/compose',function(req,res){
  res.render('compose');
});

app.post("/compose",function(req,response){
  const post= new Blogs ({
    blog_title:req.body.publishTitle,
    blog_post:req.body.publishText
  });
  post.save();
  console.log("Saved successfuly to db");
  response.redirect("/");
});


app.get("/posts/:postName",function(req,response){

  const requested_title= req.params.postName;
  const requested_title_univ=_.lowerCase(req.params.postName);
  Blogs.find({},function(err,posts_db){
    if(err) console.log(err);
    else
    {
      posts_db.forEach(function(post){
        const storedTitle=_.lowerCase(post.blog_title);
        if(storedTitle===requested_title_univ)
        {
          response.render('post',{post_name:requested_title,post_text:post.blog_post});
        }
      });
    }
  });

});
// app.post("/posts",function(req,response){
//   response.redirect("/post")
// })


app.listen(port, function() {
  console.log("Server started on port 3000");
});
