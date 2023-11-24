const members = require('../models/members')

exports.getmembers = async (req, res, next) => {
	const team = await members.find({});
	res.status(200).json({
		success: true,
		count: team.length,
		team
	})
}
exports.newMember = async (req, res, next) => {
	
	// req.body.user = req.user.id;
	const team = await members.create(req.body);
	res.status(201).json({
		success: true,
		members
	})
}
exports.getTeam = async (req, res, next) => {
	const team = await members.find({});
	res.status(200).json({
	  success: true,
	  count: team.length,
	  team,
	});
  };

  exports.getAdminMember = async (req, res, next) => {
	const team = await members.find({});
	console.log(team)
	res.status(200).json({
	  success: true,
	  count: team.length,
	  team,
	});
  };

  exports.updateMember = async (req, res, next) => {
	let member = await members.findById(req.params.id);
  console.log(member)
	if (!member) {
	  return res.status(404).json({
		success: false,
		member,
		message: "Member not found",
	  });
	}
  
	// Check if req.body.images is defined
	let images = req.body.images;
  
	if (images !== undefined) {
	  // Deleting images associated with the member
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



  
  
  