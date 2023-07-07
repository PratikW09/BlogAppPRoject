//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const env = require('dotenv');
const path = require('path');
const mongoose = require('mongoose');
const BlogPost = require('./models/post')
const User= require('./models/User')
const bycrpt = require('bcrypt');
const router = require('./routes/authRoutes')
const cookieParser = require('cookie-parser');
const {requireAuth,checkUser} = require('./midleware/authMiddleware')
const jwt = require('jsonwebtoken')
// const Home = require('./home')

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";

env.config();
const app = express();


const url = process.env.MongoURL
// Connect to MongoDB
mongoose.connect(url, )
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });


//view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());


// Define the middleware function
app.get('*',checkUser); 








/* Geting a particular post by id*/ 
app.get('/post/:id', async function(req,res){
  
  const f_id = req.params.id;
  
    // let b_title = _.lowerCase(post.title);
    BlogPost.findById({ _id: f_id })
    .then((blogPost) => {
      res.render('post', { post: blogPost });
    })
    .catch((error) => {
      console.error('Error retrieving blog post:', error);
      res.status(500).send('Internal Server Error');
    });
    
    
    
  })
 

  /*Search box route*/ 
app.post('/search', (req,res)=>{
  const search_c = req.body.search;

  console.log(req.body.search);
})

  
// this route will be for the reader only 
  app.get('/posts/:author', (req, res) => {
    const author = req.params.author;
    
    BlogPost.find({ author: author })
      .then((blogPosts) => {
                res.render('posts', { posts: blogPosts ,author:author});
        
      })
      .catch((error) => {
        console.error('Error retrieving blog posts:', error);
        res.status(500).send('Internal Server Error');
      });
  });



// This is the route for the user to get his all post 
  app.get('/userposts/:author', (req, res) => {
    const author = req.params.author;
    
    BlogPost.find({ author: author })
      .then((blogPosts) => {
                res.render('userPosts', { posts: blogPosts ,author:author});
        
      })
      .catch((error) => {
        console.error('Error retrieving blog posts:', error);
        res.status(500).send('Internal Server Error');
      });
  });

  // thsis is the route for the user dashboard 
  app.get('/userprofile',async(req,res)=>{

    try {
      const token =  req.cookies.jwt;
      const dToken = jwt.decode(token);
      console.log(dToken);
      const user = await User.findById(dToken.id);
      console.log(user);
      res.render('userProfileHome',{user});
      
    } catch (error) {
      console.log("Error in the profile ",error);
      res.status(500).send('Internal Server Error');
      
    }
  })
  

  // delele the routee
  app.delete('/posts/:_id',(req,res)=>{
    const _id= req.params._id;

    
      BlogPost.findByIdAndDelete(_id).then(()=>{
        // console.log("delete peroform")
        res.redirect('/userprofile')
      })
      
    .catch ((error) =>{
      console.error('Error deleting post:', error);
      res.status(500).send('Internal Server Error');
    })

  })
  

 // EDIT THE POST ROUTE
 
  app.get('/blog/:id',async(req,res)=>{
    try {
      const postId = req.params.id;

      const blogpost = await BlogPost.findById(postId);

      if(blogpost){
        console.log(blogpost);
        res.render('compose',{post :blogpost});
      }
      else{
        return res.status(404).send('blogpost no found');
      }
    } catch (error) {
      console.log('Error in retrieving blog post in the edit route:', error);
      res.status(500).send('Internal Server Error');
    }
  })




// this will get the all routes in appjs from router authroutes file.
app.use(router);






const Port = 3000|| process.env.Port;

app.listen(Port, function() {
  console.log("Server started on ",Port);
});
   