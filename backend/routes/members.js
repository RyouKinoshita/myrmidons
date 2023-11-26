const express = require('express');
const router = express.Router();
const upload = require('../utils/multer')
const {getmembers, newMember, getTeam, getAdminMember, updateMember, deleteMember} = require('../controllers/membersController');
const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");

router.get('/members', getmembers);
router.post(
  "/admin/MemberList/new",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  upload.array("images", 10),
  newMember
)
router.get(  "/admin/MemberList", isAuthenticatedUser, authorizeRoles("admin"), getTeam);
  router.get('/admin/MemberList/:id', getAdminMember)

  // router
  // .get("/admin/MemberList/:id", isAuthenticatedUser, authorizeRoles("admin"))
  // .put(upload.array("images", 10), updateMember)
  // // .delete(deleteMember);

router.route('/admin/MemberList/:id', isAuthenticatedUser, authorizeRoles('admin')).put(upload.array("images", 10), updateMember);

router.delete('/admin/MemberList/:id', isAuthenticatedUser, authorizeRoles('admin'), deleteMember)
module.exports = router;