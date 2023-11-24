const express = require('express');
const router = express.Router();
const upload = require('../utils/multer')
const {getmembers, newMember, getTeam, getAdminMember, updateMember, NewMember, deleteMember} = require('../controllers/membersController');
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

  router
  .get("/admin/MemberList/:id", isAuthenticatedUser, authorizeRoles("admin"))
  .put(upload.array("images", 10), updateMember)
  // .delete(deleteMember);





module.exports = router;