const express = require('express');
const router = express.Router();
const codingProfileExtractController = require('../controllers/codingProfileExtractController')


router.get('/leetcode/:username',codingProfileExtractController.getLeetcode);

module.exports = router;
