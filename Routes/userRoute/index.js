const express = require('express');
const router = express.Router();


//user
router.use('/user',require('./user'));



module.exports = router;