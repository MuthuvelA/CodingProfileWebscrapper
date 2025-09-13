const express = require('express');
const router = express.Router();
const codingProfileExtractController = require('../controllers/codingProfileExtractController')


router.get('/leetcode/:username',codingProfileExtractController.getLeetcode);
router.get('/codechef/:username',codingProfileExtractController.getCodechef);

module.exports = router;
