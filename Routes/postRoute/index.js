const express = require('express');
const router = express.Router();


//user
router.use('/user/post',require('./post'));



module.exports = router;