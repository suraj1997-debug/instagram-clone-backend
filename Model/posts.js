const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
 
const  postSchema = new mongoose.Schema({
   comments:[{
     comment:{  
       type:String,
       required:true
     },
     user:{
         type:ObjectId,
         ref:"users",
         required:true
     }
   }],
   picture:{
       type:String,
       required:true
   },
   likes:{
       type:Number,
       default:0
   },
   shares:{
       type:Array,
       default:[]
   },
   userId:{
       type:ObjectId,
       ref:'users',
       required:true
   }
},{timestamps:true});

postSchema.index({createdAt:-1});

const postModel = mongoose.model('posts',postSchema);

module.exports = postModel;
