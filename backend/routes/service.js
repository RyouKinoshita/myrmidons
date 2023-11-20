const express = require("express");
const router = express.Router();
const {
  newService,
  getServices,
  updateService,
  deleteService,
  getSingleService,
  getAdminServices,
} = require("../controllers/serviceController");
const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");

// router.post("/service/new", newService);
router.post(
  "/admin/service/new",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  upload.array("images", 10),
  newService
);
router.get("/service", getServices);

router.get("/service/:id", getSingleService);
router.get(
  "/admin/service",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  getAdminServices
);
router
  .route("/admin/service/:id", isAuthenticatedUser, authorizeRoles("admin"))
  .put(upload.array("images", 10), updateService)
  .delete(deleteService);

// router.route("/admin/service/:id").put(updateService).delete(deleteService);
module.exports = router;
