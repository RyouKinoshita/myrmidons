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

  