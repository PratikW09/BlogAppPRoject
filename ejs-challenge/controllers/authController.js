const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const BlogPost = require('../models/post')


//handles error 
const handleError = (err)=>{
    console.log(err.message,err.code);
}

const maxAge = 3*24*60*60;
const createToken = (id)=>{
    return jwt.sign({id},'pratik wlale swcret key',{
        expiresIn:maxAge
    });
}


module.exports.singup_get = (req,res)=>{
    res.render('signup')
};

module.exports.singup_post = async(req,res)=>{
    const {name,email,username,password} = req.body;
    // console.log(req.body);
    try {
        const newUser = await User.create({name,email,username,password});
        const token = createToken(newUser._id);
        res.cookie('jwt',token,{httpOnly:true,maxAge:maxAge*1000})
        // res.status(201).json({newUser:newUser._id});
        res.redirect('/');
        
    } catch (error) {
        handleError(error);
        // console.log("error in singup post request ",error);
        // res.status(400).send("error in creating the user in data base");
    }
    

    // res.send('signup from router route') this is giving error as the program need only one send 
};
module.exports.singin_get = (req,res)=>{
    res.render('signin')
};
module.exports.singin_post= async(req,res)=>{
    const {username,password}= req.body;
    try {
        
        const usernamed =  await User.findOne({username:username});
        if(usernamed) {
        const isPassMatch = await bcrypt.compare(password,usernamed.password);
        if(isPassMatch){
            const token = createToken(usernamed._id);
            res.cookie('jwt',token,{httpOnly:true,maxAge:maxAge*1000});
            res.status(200).redirect('/compose');
            // console.log(useremail,"login successfully")
                
        }
        else{
        // alert('incorrect passord');
        throw Error('Incorrect Password');
        }
     }
     else{
        throw Error('Incorrect Username');
     }

 
        
    } catch (error) {
        console.error('Error signin:', error);
              // alert('invalid crendital')
        res.status(400).send('Invalid crendital'); // Handle the error appropriately
         
              
            }
};



module.exports.logout_get = (req,res)=>{
    res.clearCookie('jwt');
    res.redirect('/');
}


//Featur route functions
// HOME PAGE
module.exports.get_home = (req,res)=>{
    BlogPost.find()
    .then((blogPosts)=>{
      res.render('home',{posts:blogPosts});
    }).catch((error)=>{
      console.log(` Error retriving blog posts : `,error);
      res.status(500).send("Internal server Error")
    })
    
  }

//   ABOUTPAGE
module.exports.get_about = (req,res)=>{
    const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
    res.render("about",{aboutContent_key:aboutContent});
  };

module.exports.get_contact =  (req,res)=>{
    const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";
    res.render("contact",{contactContent_key:contactContent});
  };

module.exports.get_compose =  (req,res)=>{
    res.render("compose");
  }

module.exports.post_compose =  (req,res)=>{
    const postB = {
      title:req.body.postTitle,
      body:req.body.postBody,
      author:req.body.postAuthor
    };
  
    const newBlogPost = new BlogPost({
      title:postB.title,
      body:postB.body,
      author:postB.author,
    });
  
    newBlogPost.save()
      .then((savedPost) => {
       
        res.redirect('/'); 
      })
      .catch((error) => {
        console.error('Error saving blog post:', error);
        res.status(500).send('Internal Server Error'); 
      });
    
  };
  




