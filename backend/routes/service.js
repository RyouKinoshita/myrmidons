const express = require('express');
const router = express.Router();
const {newService,getServices,updateService,deleteService,getSingleService} = require('../controllers/serviceController');
router.post('/service/new', newService);
router.get('/service', getServices);
router.get('/service/:id',getSingleService);
router.route('/admin/service/:id').put(updateService).delete(deleteService);
module.exports = router;