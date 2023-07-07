const mongoose = require('mongoose');
const {isEmail} = require('validator');
const bcrypt = require('bcrypt');
const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        unique: true,
    },
    email:{
        type: String,
        required: [true,'Please Enter An Email'],
        unique: true,
        validate:[isEmail,'Please Enter A valid Email']
    },
    username:{
        type: String,
        required:[true,'Please Enter A Username'],
        unique: true,
    },
    password:{
        type: String,
        required: [true,'Please Enter The Password'],
        minlength:[5,'Minimum Password length should be 5 Characters']
       
    }
});

// SOME INFORMATION ABOUT THE MONGOOSE HOOKS
// userSchema.post('save', function(doc,next){
//     console.log('the function is called after the saving the data',doc);
//     next();
// })

// // before save the function will call
// userSchema.pre('save',function(next){
//     console.log('the function is called befoer saving the user',this);
//     next();
// })


// HASING THE PASSWORD USING BCRYPT BEFORE SAVING THE THE NEW USER.
userSchema.pre('save',async function(next){
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password,salt);
    next();
})

const User = mongoose.model('User',userSchema);
module.exports = User;
