const portfolios = require('../models/portfolio');
const Portfolio = require('../models/portfolio')
// const APIFeatures = require('../utils/apiFeatures');
// const cloudinary = require('cloudinary')

exports.newService = async (req, res, next) => {
	
	// req.body.user = req.user.id;
	const portfolios = await Portfolio.create(req.body);
	res.status(201).json({
		success: true,
		service
	})
}
exports.getPortfolio = async (req, res, next) => {
	const portfolios = await Portfolio.find({});
	res.status(200).json({
		success: true,
		count: portfolios.length,
		portfolios
	})
}
exports.updatePortfolio = async (req, res, next) => {
	let portfolios = await Portfolio.findById(req.params.id);
	console.log(req.body)
	if (!portfolios) {
		return res.status(404).json({
			success: false,
			message: 'Service not found'
		})
	}
	portfolios = await Portfolio.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
	})
	if (!portfolios) {
		return res.status(404).json({
			success: false,
			message: 'Service not updated'
		})
	}
	res.status(200).json({
		success: true,
		service
	})
}
exports.deletePortfolio = async (req, res, next) => {
	const portfolios = await Portfolio.findByIdAndDelete(req.params.id);
	if (!portfolios) {
		return res.status(404).json({
			success: false,
			message: 'Service not found'
		})
	}
	// await product.remove();
	res.status(200).json({
		success: true,
		message: 'Service deleted'
	})
}
exports.getSinglePortfolio = async (req, res, next) => {
	const portfolios = await Portfolio.findById(req.params.id);
	if (!portfolios) {
		return res.status(404).json({
			success: false,
			message: 'Service not found'
		})
	}
	res.status(200).json({
		success: true,
		service
	})
}