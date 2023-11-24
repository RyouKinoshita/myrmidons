const express = require('express');
const router = express.Router();
const {getmembers, newMember, getTeam, getAdminMember} = require('../controllers/membersController');
const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");

router.get('/members', getmembers);
router.post('/members/new', newMember);
router.get(
    "/admin/MemberList",
    isAuthenticatedUser,
    authorizeRoles("admin"),
    getTeam
  );

  router.get(
    "/admin/MemberList",
    isAuthenticatedUser,
    authorizeRoles("admin"),
    getAdminMember
  );
module.exports = router;