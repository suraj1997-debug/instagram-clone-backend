const mongoose = require('mongoose');
const userModel = require('../../Model/user');
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');
let objectId = mongoose.Types.ObjectId;


exports.signupUser = (req, res) => {
    const {
        fullname,
        emailOrMob,
        username,
        password
    } = req.body;


    userModel.find({ emailOrMob: emailOrMob })
    .then(data => {
       
        if (data && data.length > 0) {
            return res.status(400).json({
                success: false,
                errorMessage: 'User Already Registered'
            })
        }
        else {

            let Pass = CryptoJS.AES.encrypt(password, process.env.EncryptionKey).toString();
            let userDetails = new userModel({
                fullname,
                emailOrMob,
                username,
                password: Pass
            })

            userDetails.save()
                .then(user => {
                    res.status(201).json({
                        success: true,
                        message: 'User Registered Successfully'
                    })

                })
                .catch(error => {
                    console.log('error', error);
                    return res.status(400).json({
                        success: false,
                        errorMessage: 'Something went wrong',
                        errorLog: error
                    })
                })
        }
    })
    .catch(err=>{
        return res.sattus(400).json({
            success:false,
            errorMessage:'Something went wrong',
            errorlog:err
        })
    })

 
}

exports.loginUser = (req, res) => {
    const { emailOrMobOrUsername, password } = req.body;

    // userModel.find({ emailOrMob: emailOrMobOrUsername })
    userModel.aggregate([
        {
            $match:{
                $or:[{emailOrMob:emailOrMobOrUsername},{username:emailOrMobOrUsername}]
            }
        }
    ]).then(user=>{
        if (user && (user.length > 0)) {
            var bytes = CryptoJS.AES.decrypt(user[0].password, process.env.EncryptionKey)
            var loginPassword = bytes.toString(CryptoJS.enc.Utf8);

            if (password === loginPassword) {
                const token = jwt.sign(
                    {
                        _id: user[0]._id
                    },
                    process.env.JWT_SECRET,
                    {
                        expiresIn: '1d'
                    }
                );
                res.status(200).json({
                    success: true,
                    message: 'User LoggedIn Successfully',
                    token: token,
                    user: user[0]
                })

            } else {
                return res.status(400).json({
                    success: false,
                    errorMessage: 'Incorrect Password',
                })
            }


        }
        else{
            return res.status(400).json({
                success: false,
                errorMessage: 'User not found',
            })
        }
    })
    .catch(err=>{
        return res.status(400).json({
            success: false,
            errorMessage: 'Something went wrong',
            errorLog:err
        })
    })

        

}

exports.forgetPass = (req, res) => {
    const { emailOrMob } = req.body;
    userModel.find({ emailOrMob: emailOrMob })
        .exec((err, user) => {
            if (err || !user) {
                return res.status(400).json({
                    success: false,
                    errorMessage: "User Not Found!",
                    errorLog: err
                })
            }
            if (user && (user.length > 0)) {
                const token = jwt.sign({ _id: user[0]._id }, process.env.JWT_SECRET, { expiresIn: '10m' });
                // user[0].resetToken = token ? token : '';
                user[0].updateOne({ resetToken: token ? token : '' })
                    .then(data => {
                        //  console.log('data',data);
                        res.status(201).json({
                            success: true,
                            message: 'Reset Password Link added and fetched Successfully',
                            resetPasswordLink:`http://localhost:3000/password/reset/${token}`
                        })

                    })
                    .catch(error => {
                        return res.status(400).json({
                            success: false,
                            errorMessage: "Error in api",
                            errorLog: error
                        })
                    })
            }
        })
}

exports.resetPass = (req, res) => {
    const { resetToken } = req.params;

    const { newPassword } = req.body;

    if(!newPassword){
        return res.status(400).json({
            success: false,
            errorMessage: 'Password field cannot be empty'
        })
    }

    userModel.find({ resetToken: resetToken })
        .exec()
        .then(user => {

            jwt.verify(resetToken, process.env.JWT_SECRET, (err, decode) => {
                if (err || !decode) {
                    user[0].updateOne({ resetToken: '' })
                        .then(data => {
                            res.status(400).json({
                                success: false,
                                errorMessage: 'Reset Password Link Expired'
                            })
                        })
                        .catch(error => {
                            return res.status(400).json({
                                success: false,
                                errorMessage: 'something went wrong',
                                errorLog: error
                            })
                        })
                }
                else {
                    var resetPassword = CryptoJS.AES.encrypt(newPassword, process.env.EncryptionKey).toString();

                    user[0].updateOne({ resetToken: '', password: resetPassword ? resetPassword : user[0].password })
                        .then(data => {
                                    res.status(201).json({
                                        success: true,
                                        message: 'Password updated successfully'
                                    })
                        })
                        .catch(error => {
                            return res.status(400).json({
                                success: false,
                                errorMessage: 'something went wrong',
                                errorLog: error
                            })
                        })
                }
            })
        }).catch(err => {
            return res.status(400).json({
                success: false,
                errorMessage: 'something went wrong',
                errorLog: err
            })
        })
}

exports.updatePic = (req, res) => {
    const id = objectId(req.user._id);


    userModel.findByIdAndUpdate({ _id: id },{$set:req.body},{new:true})
    .then(data => {
        return res.status(201).json({
            success: true,
            message: "User Profile Pic updated Successfully"
        })
    })
        .catch(err => {
            return res.status(400).json({
                success: false,
                errorMessage: 'Something went wrong',
                errorLog: err
            })
        })
}