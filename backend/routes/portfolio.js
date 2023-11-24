const express = require('express');
const router = express.Router();
const upload = require('../utils/multer')
const {newPortfolio,getPortfolio,updatePortfolio,deletePortfolio,getSinglePortfolio, getAdminProject} = require('../controllers/portfolioController');
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

router.post(
    "/admin/portfolio/new",
    isAuthenticatedUser,
    authorizeRoles("admin"),
    upload.array("images", 10),
    newPortfolio
  );
  router.get("/portfolio", getPortfolio);

  router.get("/portfolio/:id", getSinglePortfolio);

  router.get(
    "/admin/portfolio",
    isAuthenticatedUser,
    authorizeRoles("admin"),
    getAdminProject
  );
  router
    .route("/admin/portfolio/:id", isAuthenticatedUser, authorizeRoles("admin"))
    .put(upload.array("images", 10), updatePortfolio)
    .delete(deletePortfolio);

// router.post('/portfolio/new', newPortfolio);
// router.get('/portfolio', getPortfolio);
// router.get('/portfolio/:id',getSinglePortfolio);
// router.route('/admin/portfolio/:id').put(updatePortfolio).delete(deletePortfolio);
module.exports = router;