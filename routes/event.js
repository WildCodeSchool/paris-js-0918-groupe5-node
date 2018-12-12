const express = require('express');
const router = express.Router();
const models = require('../models');

router.get('/', (req,res) => {
	models.event.findAll()
	.then(data => {
		res.status(200).json(data)
	});
});

module.exports = router;