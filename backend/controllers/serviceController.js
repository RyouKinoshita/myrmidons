const service = require("../models/service");
const Service = require("../models/service");
// const APIFeatures = require('../utils/apiFeatures');
// const cloudinary = require('cloudinary')

exports.newService = async (req, res, next) => {
  // req.body.user = req.user.id;
  const service = await Service.create(req.body);
  res.status(201).json({
    success: true,
    service,
  });
};
exports.getServices = async (req, res, next) => {
  const services = await Service.find({});
  res.status(200).json({
    success: true,
    count: services.length,
    services,
  });
};
exports.updateService = async (req, res, next) => {
  let service = await Service.findById(req.params.id);
  console.log(req.body);
  if (!service) {
    return res.status(404).json({
      success: false,
      message: "Service not found",
    });
  }
  service = await Service.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!service) {
    return res.status(404).json({
      success: false,
      message: "Service not updated",
    });
  }
  res.status(200).json({
    success: true,
    service,
  });
};
exports.deleteService = async (req, res, next) => {
  const service = await Service.findByIdAndDelete(req.params.id);
  if (!service) {
    return res.status(404).json({
      success: false,
      message: "Service not found",
    });
  }
  // await product.remove();
  res.status(200).json({
    success: true,
    message: "Service deleted",
  });
};
exports.getSingleService = async (req, res, next) => {
  const service = await Service.findById(req.params.id);
  if (!service) {
    return res.status(404).json({
      success: false,
      message: "Service not found",
    });
  }
  res.status(200).json({
    success: true,
    service,
  });
};

exports.getAdminServices = async (req, res, next) => {
  const services = await Service.find({});
  res.status(200).json({
    success: true,
    count: services.length,
    services,
  });
};
