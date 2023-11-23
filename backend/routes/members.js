const express = require('express');
const router = express.Router();
const {getmembers,newMember, getTeam} = require('../controllers/membersController');
const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");

router.get('/members', getmembers);
router.post('/members/new', newMember);
router.get(
    "/admin/teamList",
    isAuthenticatedUser,
    authorizeRoles("admin"),
    getTeam
  );
module.exports = router;