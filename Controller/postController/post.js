const mongoose = require('mongoose');
const postModel = require('../../Model/posts');
const  objectId = mongoose.Types.ObjectId;



exports.addPost= (req,res) =>{
    const {
        comment,
        picture,
    } = req.body;
    
    const postDetails = new postModel({
        comments:[{
            comment:comment,
            user:objectId(req.user._id)
        }],
        picture,
        userId:objectId(req.user._id)
    })
    postDetails.save()
    .then((post)=>{
        return res.status(201).json({
            success:true,
            message:"Post added successfully."
        })
    }).catch((e)=>{
        console.log("error",e)
        return res.status(400).json({
            errorMessage:"Something went wrong.",
            success:false,
            errorLog:e
        })
    })
}

exports.getPosts = (req,res) =>{
    const id = objectId(req.user._id)
   postModel.find({userId:id})
   .sort({createdAt:-1})
    .then((post)=>{
        return res.status(200).json({
            success:true,
            message:"Posts fetched successfully.",
            data:post
        })
    })
    .catch((e)=>{
        console.log("error",e)
        return res.status(400).json({
            errorMessage:"Something went wrong.",
            success:false,
            errorLog:e
        })
    })
}

exports.addComments = (req,res) =>{
    const id = objectId(req.params._id);

    const {
        comment
    } = req.body;

    postModel.findById({_id:id})
    .then((post)=>{
        let arr = post.comments;
        let arr1 = {};
        arr1.comment = comment;
        arr1.user = objectId(req.user._id);
        arr.push(arr1);
        console.log('arr',arr)
         post.comments = comment ? arr : post.comments;
         post.save()
         .then(post=>{
            return res.status(202).json({
                success:true,
                message:"Comment added successfully."
            })
         })
         .catch((e)=>{
            console.log("error",e)
            return res.status(400).json({
                errorMessage:"Something went wrong.",
                success:false,
                errorLog:e
            })
        })
    })
    .catch((e)=>{
        console.log("error",e)
        return res.status(400).json({
            errorMessage:"Something went wrong.",
            success:false,
            errorLog:e
        })
    })
}

exports.getSinglePost = (req,res) =>{
    const id = objectId(req.params._id)

    postModel.findById({_id:id})
     .then((post)=>{
         return res.status(200).json({
             success:true,
             message:"single post  fetched successfully.",
             data:post
         })
     })
     .catch((e)=>{
         console.log("error",e)
         return res.status(400).json({
             errorMessage:"Something went wrong.",
             success:false,
             errorLog:e
         })
     })
}