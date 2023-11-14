const express = require('express');
const router = express.Router();
const {newService,getServices,updateService,deleteService,getSingleService} = require('../controllers/serviceController');
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

router.post('/service/new', newService);
router.get('/service', getServices);
router.get('/service/:id',isAuthenticatedUser,getSingleService);
router.route('/admin/service/:id').put(updateService).delete(deleteService);
module.exports = router;