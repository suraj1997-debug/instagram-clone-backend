const express = require('express');
const router = express.Router();
const post = require('../../Controller/postController/post');
const { PostPicsResizeImages, PostPics } = require('../../Middleware/postFileUpload');
const userAuth = require('../../Middleware/userMiddleware');

//add post
router.post('/add',userAuth,PostPics.single('picture'),PostPicsResizeImages,post.addPost);

//get post
router.get('/getAll',userAuth,post.getPosts);

//add comment by postId
router.put('/addComments/:_id',userAuth,post.addComments)

//get getSinglePost by post id 
router.get('/getSinglePost/:_id',userAuth,post.getSinglePost);


module.exports = router;