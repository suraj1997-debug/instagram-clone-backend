const express = require('express');
const router = express.Router();
const user = require('../../Controller/userController/user')
const {UserPics,UserPicsResizeImages} = require('../../Middleware/userFileUpload');
const userAuth = require('../../Middleware/userMiddleware');


//signup
router.post('/signup',user.signupUser);

//login
router.post('/login',user.loginUser);

//forget password
router.put('/forget',user.forgetPass);

//reset password
router.put('/reset/:resetToken',user.resetPass);


//profile pic update
router.put('/profilePic/update',userAuth,UserPics.single('profile'),UserPicsResizeImages,user.updatePic);

module.exports = router;