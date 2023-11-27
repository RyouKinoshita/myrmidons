const members = require("../models/members");
const APIFeatures = require("../utils/apiFeatures");
const cloudinary = require("cloudinary");

exports.getmembers = async (req, res, next) => {
  const team = await members.find({});
  res.status(200).json({
    success: true,
    count: team.length,
    team,
  });
};

exports.newMember = async (req, res, next) => {
  let images = [];

  if (typeof req.body.images === "string") {
    req.body.images = [];
    req.body.images.push(images);
    images = req.body.images;
  }

  let imagesLinks = [];

  if (req.files) {
    images = req.files.map((image) => image.path);
  }

  if (req.file) {
    images.push(req.file);
  }

  for (let i = 0; i < images.length; i++) {
    let imageDataUri = images[i];
    
    try {
      const result = await cloudinary.v2.uploader.upload(`${imageDataUri}`, {
        folder: "members",
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

  const member = await members.create(req.body);
  if (!member)
    return res.status(400).json({
      success: false,
      message: "Member not created",
    });

  res.status(201).json({
    success: true,
    member,
  });
};

exports.getTeam = async (req, res, next) => {
  const team = await members.find({});
  res.status(200).json({
    success: true,
    count: team.length,
    team,
  });
};

exports.getAdminMember = async (req, res, next) => {
  const team = await members.findById(req.params.id);
  console.log(team);
  res.status(200).json({
    success: true,
    count: team.length,
    team,
  });
};

exports.updateMember = async (req, res, next) => {
  console.log(req.body);
  let member = await members.findById(req.params.id);
  console.log(member);
  if (!member) {
    return res.status(404).json({
      success: false,
      member,
      message: "Member not found",
    });
  }
  // Check if req.body.images is defined
  let images = req.body.images;

  if (typeof req.body.images === "string") {
    req.body.images = [];
    req.body.images.push(images);
    images = req.body.images;
  }
  if (images !== undefined) {

    for (let i = 0; i < member.images.length; i++) {
      const result = await cloudinary.v2.uploader.destroy(
        member.images[i].public_id
      );
    }

    let imagesLinks = [];
    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "members",
      });
      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    req.body.images = imagesLinks;
  }

  member = await members.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindandModify: false,
  });

  return res.status(200).json({
    success: true,
    member,
  });
};

exports.deleteMember = async (req, res, next) => {
  const member = await members.findByIdAndDelete(req.params.id);
  if (!member) {
    return res.status(404).json({
      member,
      success: false,
    });
  }
};
