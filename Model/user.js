const mongoose = require('mongoose');

const  userSchema = new mongoose.Schema({
    emailOrMob:{
        type:String,
        unique:true,
        index:true,
        trim: true,
        required:true,
        lowercase:true
    },
    fullname:{
        type:String,
        min:3,
        max:15,
        trim: true,
        required:true
    },
    username:{
        type:String,
        min:3,
        max:15,
        lowercase:true,
        unique:true,
        index:true,
        trim: true,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    profile: {
        type: String,
        default: 'noimage.png'
    },
    deviceToken:{
        type:String,
        default:''
    },
    resetToken:{
        type:String,
        default:''
    },
    followers:{
        type:Array,
        default:[]
    },
    following:{
        type:Array,
        default:[]
    }
},{timestamps:true});

userSchema.index({createdAt:-1});

const userModel = mongoose.model('users',userSchema);

module.exports = userModel;
