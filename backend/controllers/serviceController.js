const service = require("../models/service");
const Service = require("../models/service");
const APIFeatures = require('../utils/apiFeatures');
const cloudinary = require("cloudinary");

exports.newService = async (req, res, next) => {
  let images = [];
  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  let imagesLinks = [];

  for (let i = 0; i < images.length; i++) {
    let imageDataUri = images[i];
    // console.log(imageDataUri)
    try {
      const result = await cloudinary.v2.uploader.upload(`${imageDataUri}`, {
        folder: "services",
        width: 150,
        crop: "scale",
      });

      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    } catch (error) {
      console.log(error);
    }
  }

  req.body.images = imagesLinks;
  req.body.user = req.user.id;

  const service = await Service.create(req.body);
  if (!service)
    return res.status(400).json({
      success: false,
      message: "Service not created",
    });

  res.status(201).json({
    success: true,
    service,
  });
};
// exports.getServices = async (req, res, next) => {
//   const resPerPage = 4;
//   const serviceCount = await Service.countDocuments();
//   APIFeatures.pagination(resPerPage);
//   const services = await Service.find({});
//   res.status(200).json({
//     success: true,
//     count: services.length,
//     services,
//   });
// };
exports.getServices = async (req,res,next) => {
	
	const resPerPage = 4;
	const serviceCount = await Service.countDocuments();
	const apiFeatures = new APIFeatures(Service.find(),req.query).search().filter(); 

	// const products = await Product.find();
	apiFeatures.pagination(resPerPage);
	const services = await apiFeatures.query;
	let filteredServiceCount = services.length;
	res.status(200).json({
		success: true,
		filteredServiceCount,
		serviceCount,
		services,
		resPerPage,
	})
}
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
