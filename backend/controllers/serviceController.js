const service = require("../models/service");
const Service = require("../models/service");
const Order = require("../models/order");
const APIFeatures = require("../utils/apiFeatures");
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
exports.getServices = async (req, res, next) => {
  const resPerPage = 4;
  const serviceCount = await Service.countDocuments();
  const apiFeatures = new APIFeatures(Service.find(), req.query)
    .search()
    .filter();

  apiFeatures.pagination(resPerPage);
  const services = await apiFeatures.query;
  let filteredServiceCount = services.length;
  res.status(200).json({
    success: true,
    filteredServiceCount,
    serviceCount,
    services,
    resPerPage,
  });
};

exports.updateService = async (req, res, next) => {
  let service = await Service.findById(req.params.id);

  if (!service) {
    return res.status(404).json({
      success: false,
      message: "Service not found",
    });
  }

  // Check if req.body.images is defined
  let images = req.body.images;

  if (images !== undefined) {
    // Deleting images associated with the service
    for (let i = 0; i < service.images.length; i++) {
      const result = await cloudinary.v2.uploader.destroy(
        service.images[i].public_id
      );
    }

    let imagesLinks = [];
    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "services",
      });
      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    req.body.images = imagesLinks;
  }

  service = await Service.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindandModify: false,
  });

  return res.status(200).json({
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
  res.status(200).json({
    success: true,
    message: "Service deleted",
  });
};
exports.getSingleService = async (req, res, next) => {
  const service = await Service.findById(req.params.id);
  const order = await Order.find({ 'orderItems.service': req.params.id })
  .populate('orderItems.service')
  .exec();
  const datesArray = order.map(orderItem => orderItem.orderItems.map(item => item.date)).flat();
  // const mappedOrders = order.map(order => {
  //   const orderItemDates = order.orderItems.map(item => item.date);
  //   return {
  //     orderItemDates: orderItemDates,
  //   };
  // });
  
  // console.log(mappedOrders);
  console.log(datesArray);
  // const orderItemIds = order.orderItems.service.map(item => item._id);
  // console.log(orderItemIds)
  if (!service) {
    return res.status(404).json({
      success: false,
      message: "Service not found",
    });
  }
  res.status(200).json({
    success: true,
    service,
    order
  });
};
// exports.getServiceOrder = async (req, res, next) => {
//   const order = await Order.findById(req.params.id).populate('orderItems', '_id');
//   if (!order) {
//     return res.status(404).json({
//       success: false,
//       message: "Service not found",
//     });
//   }
//   const orderItemIds = order.orderItems.map(item => item._id);
//   res.status(200).json({
//     success: true,
//     orderItemIds,
//   });
// };

exports.getAdminServices = async (req, res, next) => {
  const services = await Service.find({});
  res.status(200).json({
    success: true,
    count: services.length,
    services,
  });
};
