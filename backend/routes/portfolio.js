const express = require('express');
const router = express.Router();
const {newPortfolio,getPortfolio,updatePortfolio,deletePortfolio,getSinglePortfolio} = require('../controllers/portfolioController');
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

router.post('/portfolio/new', newPortfolio);
router.get('/portfolio', getPortfolio);
router.get('/portfolio/:id',getSinglePortfolio);
router.route('/admin/portfolio/:id').put(updatePortfolio).delete(deletePortfolio);
module.exports = router;