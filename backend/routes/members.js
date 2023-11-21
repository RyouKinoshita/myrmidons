const express = require('express');
const router = express.Router();
const {getmembers,newMember} = require('../controllers/membersController');

router.get('/members', getmembers);
router.post('/members/new', newMember);

module.exports = router;